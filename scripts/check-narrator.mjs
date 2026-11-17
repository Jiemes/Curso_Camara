import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const source = await fs.readFile(new URL('../dist/narrator.js', import.meta.url), 'utf8');

function browserHarness(supported = true) {
  const utterances = [];
  const errors = [];
  const statuses = [];
  const timers = new Map();
  let nextTimer = 0;
  const window = {};
  const spanishVoice = { name: 'Español Argentina', lang: 'es-AR', voiceURI: 'ar' };
  if (supported) {
    window.SpeechSynthesisUtterance = class {
      constructor(text) { this.text = text; }
    };
    window.speechSynthesis = {
      cancel() {},
      speak(utterance) { utterances.push(utterance); },
      getVoices() { return [spanishVoice]; },
      addEventListener() {}
    };
  }
  vm.runInNewContext(source, {
    window,
    setTimeout(callback) { timers.set(++nextTimer, callback); return nextTimer; },
    clearTimeout(timer) { timers.delete(timer); }
  });
  const narrator = window.createAulaNarrator({
    onStatus: status => statuses.push(status),
    onError: error => errors.push(error),
    onVoices() {}
  });
  return { narrator, utterances, errors, statuses, timers };
}

// Una intervención nueva debe cancelar los fragmentos pendientes de la anterior.
const interrupted = browserHarness();
interrupted.narrator.speak('Este es un ejemplo largo de una explicación que el alumno puede interrumpir para pedir una pista. '.repeat(7));
const oldUtterance = interrupted.utterances[0];
oldUtterance.onstart();
interrupted.narrator.speak('Vamos a revisar el primer paso.');
const currentUtterance = interrupted.utterances[1];
oldUtterance.onend();
assert.equal(interrupted.utterances.length, 2);
assert.equal(interrupted.timers.size, 1);
currentUtterance.onstart();
currentUtterance.onend();
assert.equal(interrupted.statuses.at(-1), 'idle');
assert.equal(currentUtterance.voice.lang, 'es-AR');

// Al silenciar, un evento tardío del motor tampoco debe reanudar el audio.
const muted = browserHarness();
muted.narrator.speak('Una explicación con varios fragmentos. '.repeat(20));
muted.utterances[0].onstart();
muted.narrator.stop();
muted.utterances[0].onend();
assert.equal(muted.utterances.length, 1);
assert.equal(muted.timers.size, 0);

// Los errores y la falta de soporte activan la alternativa escrita de la interfaz.
const failed = browserHarness();
failed.narrator.speak('Una ayuda.');
failed.utterances[0].onerror({ error: 'not-allowed' });
assert.equal(failed.errors.length, 1);
assert.equal(failed.statuses.at(-1), 'idle');
const absent = browserHarness(false);
assert.equal(absent.narrator.speak('Una ayuda.'), false);
assert.equal(absent.errors.length, 1);

// Si el motor nunca inicia, la espera tiene un límite y ofrece texto.
const stalled = browserHarness();
stalled.narrator.speak('Una ayuda.');
[...stalled.timers.values()][0]();
assert.equal(stalled.errors.length, 1);
assert.equal(stalled.statuses.at(-1), 'idle');

console.log('Voz verificada. Cancelación, interrupciones, errores y espera limitada.');
