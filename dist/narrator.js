(() => {
  'use strict';

  window.createAulaNarrator = ({ onStatus, onError, onVoices }) => {
    const synthesis = window.speechSynthesis;
    const supported = Boolean(synthesis && window.SpeechSynthesisUtterance);
    let generation = 0;
    let currentUtterance = null;
    let startTimer = null;

    function voices() {
      if (!supported) return [];
      return synthesis.getVoices().filter(voice => /^es(?:[-_]|$)/i.test(voice.lang));
    }

    function stop() {
      generation += 1;
      currentUtterance = null;
      clearTimeout(startTimer);
      if (supported) synthesis.cancel();
      onStatus('idle');
    }

    function chunks(text) {
      const words = String(text).replace(/\bIA\b/g, 'inteligencia artificial').replace(/\s+/g, ' ').trim().split(' ');
      const result = [];
      let segment = '';
      for (const word of words) {
        if (segment && segment.length + word.length > 190) {
          result.push(segment);
          segment = '';
        }
        segment += `${segment ? ' ' : ''}${word}`;
        if (segment.length > 65 && /[.!?]$/.test(word)) {
          result.push(segment);
          segment = '';
        }
      }
      if (segment) result.push(segment);
      return result;
    }

    function speak(text, { voiceURI = '', rate = 0.96 } = {}) {
      stop();
      if (!supported) {
        onError('Este navegador no ofrece voz. Podés seguir todas las ayudas por escrito.');
        return false;
      }
      const queue = chunks(text);
      if (!queue.length) return false;
      const requestGeneration = generation;
      const available = voices();
      const selected = available.find(voice => voice.voiceURI === voiceURI)
        || available.find(voice => /^es[-_]AR$/i.test(voice.lang))
        || available.find(voice => /natural|neural|google|microsoft/i.test(voice.name))
        || available.find(voice => voice.default)
        || available[0];
      const speed = Number.isFinite(Number(rate)) ? Math.max(0.8, Math.min(1.2, Number(rate))) : 0.96;
      let index = 0;
      onStatus('preparing');

      function next() {
        if (requestGeneration !== generation) return;
        if (index === queue.length) {
          currentUtterance = null;
          onStatus('idle');
          return;
        }
        const utterance = new window.SpeechSynthesisUtterance(queue[index]);
        index += 1;
        currentUtterance = utterance;
        utterance.lang = selected?.lang || 'es-AR';
        if (selected) utterance.voice = selected;
        utterance.rate = speed;
        utterance.pitch = 1;
        utterance.onstart = () => {
          if (requestGeneration === generation) {
            clearTimeout(startTimer);
            onStatus('speaking');
          }
        };
        utterance.onend = () => {
          if (requestGeneration !== generation) return;
          clearTimeout(startTimer);
          next();
        };
        utterance.onerror = event => {
          if (requestGeneration !== generation) return;
          stop();
          if (!['canceled', 'interrupted'].includes(event.error)) {
            onError('No se pudo reproducir la voz. Probá de nuevo o elegí otra voz en Preferencias. El texto está disponible.');
          }
        };
        startTimer = setTimeout(() => {
          if (requestGeneration !== generation) return;
          stop();
          onError('La voz no respondió. La ayuda aparece por escrito. Podés volver a activarla o elegir otra voz en Preferencias.');
        }, 8000);
        try { synthesis.speak(utterance); }
        catch {
          stop();
          onError('No se pudo iniciar la voz. Podés reintentarlo desde Escuchar.');
        }
      }
      next();
      return true;
    }

    if (supported) synthesis.addEventListener('voiceschanged', () => onVoices(voices()));
    return { supported, voices, speak, stop };
  };
})();
