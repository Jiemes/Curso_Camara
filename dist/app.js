(() => {
  'use strict';

  const { courses, lessons } = window.AULA_CONTENT;
  const root = document.getElementById('app');
  const storageKey = 'aula-mercedes-v1';
  let storageAvailable = true;
  let toastTimer;
  let route;
  let state = load();
  const $ = selector => root.querySelector(selector);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const courseFor = id => courses.find(course => course.classes.includes(id));
  const isComplete = id => state.completed.includes(id);
  const draft = id => state.drafts[id] || {};
  const courseProgress = course => course.classes.filter(isComplete).length;
  const minutes = course => course.classes.reduce((sum, id) => sum + lessons[id - 1].duration, 0);
  const guideMessages = {};
  let voiceReady = false;
  let voiceStatus = 'idle';
  let voiceError = '';
  const narrator = window.createAulaNarrator({
    onStatus(status) {
      voiceStatus = status;
      root.querySelectorAll('.mascot').forEach(node => node.classList.toggle('is-speaking', status === 'speaking'));
      updateAudioControls();
    },
    onError(message) {
      voiceError = message;
      voiceReady = false;
      updateAudioControls();
      toast(message);
    },
    onVoices() { updateVoiceOptions(); }
  });

  function load(ignoreSaved = false) {
    const fallback = { completed: [], drafts: {}, notes: {}, queries: [], hints: {}, guideOpen: true, guideVisible: true, reduceMotion: false, voiceEnabled: false, voiceModeChosen: false, voiceURI: '', voiceRate: 0.96, lastLesson: 1, order: ['details', 'button', 'title', 'offer'], rules: { pedido: 'Ventas', consulta: 'Atención' } };
    if (ignoreSaved) return fallback;
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (!saved || typeof saved !== 'object') return fallback;
      for (const key of ['drafts', 'notes', 'hints', 'rules']) {
        if (!saved[key] || typeof saved[key] !== 'object' || Array.isArray(saved[key])) delete saved[key];
      }
      return { ...fallback, ...saved,
        completed: Array.isArray(saved.completed) ? saved.completed.filter(id => Number.isInteger(id) && id >= 1 && id <= 12) : [],
        queries: Array.isArray(saved.queries) ? saved.queries.filter(row => row && typeof row === 'object') : [],
        order: Array.isArray(saved.order) && new Set(saved.order).size === 4 && saved.order.every(item => fallback.order.includes(item)) ? saved.order : fallback.order
      };
    } catch {
      storageAvailable = false;
      return fallback;
    }
  }

  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); }
    catch { storageAvailable = false; toast('Tu navegador no permite guardar. Podés exportar tus entregas en Mis apuntes.'); }
  }

  function toast(message) {
    const node = document.getElementById('toast');
    node.textContent = message;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { node.textContent = ''; }, 4200);
  }

  function mascot(size = '', gesture = '') {
    return `<span class="mascot instructor" ${size ? `style="--size:${size}px"` : ''} ${gesture ? `data-gesture="${gesture}"` : ''} aria-hidden="true"><span class="tutor-torso"><span class="tutor-shirt"></span><span class="tutor-lapel left"></span><span class="tutor-lapel right"></span></span><span class="tutor-neck"></span><span class="tutor-ear left"></span><span class="tutor-ear right"></span><span class="tutor-head"><span class="tutor-hair"></span><span class="tutor-brow left"></span><span class="tutor-brow right"></span><span class="tutor-glasses left"><span></span></span><span class="tutor-glasses right"><span></span></span><span class="tutor-bridge"></span><span class="tutor-nose"></span><span class="tutor-mouth"></span></span><span class="tutor-arm"><span class="tutor-hand"></span></span><span class="tutor-book"><span></span></span></span>`;
  }

  function audioBar() {
    return `<div class="audio-bar" aria-label="Voz del acompañante"><span class="audio-status">Solo texto</span><button class="audio-toggle" data-action="voice-toggle" aria-pressed="false" ${narrator.supported ? '' : 'disabled'}>Activar voz</button><button class="audio-stop" data-action="voice-stop" hidden>Detener audio</button></div>`;
  }

  function voiceWelcome() {
    if (state.voiceModeChosen) return '';
    return `<section class="voice-welcome" aria-labelledby="voice-welcome-title"><div><h2 id="voice-welcome-title">¿Cómo querés que te acompañe?</h2><p>Elegí escuchar a Tu guía o leer sus intervenciones. Podés cambiar de modo cuando quieras.</p></div><div class="button-row"><button class="button primary" data-action="voice-start" ${narrator.supported ? '' : 'disabled'}>Solo voz</button><button class="button" data-action="voice-text">Solo texto</button></div></section>`;
  }

  function updateAudioControls() {
    const enabled = state.voiceEnabled && voiceReady;
    const playing = voiceStatus !== 'idle';
    const toggle = $('.audio-toggle');
    if (toggle) {
      toggle.textContent = enabled ? 'Silenciar voz' : state.voiceEnabled ? 'Continuar con voz' : 'Activar voz';
      toggle.setAttribute('aria-pressed', String(Boolean(enabled)));
    }
    const status = $('.audio-status');
    if (status) status.textContent = voiceStatus === 'speaking' ? 'Hablando…' : playing ? 'Preparando voz…' : enabled ? 'Modo voz' : 'Solo texto';
    const stop = $('.audio-stop');
    if (stop) stop.hidden = !playing;
    for (const message of root.querySelectorAll('#guide-message, #home-guide-message')) {
      message.setAttribute('aria-live', enabled ? 'off' : 'polite');
      message.hidden = Boolean(enabled && !voiceError);
    }
    $('.guide')?.classList.toggle('voice-mode', Boolean(enabled && !voiceError));
    const repeat = $('[data-action="voice-repeat"]');
    if (repeat) repeat.textContent = enabled ? 'Repetir ayuda' : 'Escuchar esta ayuda';
    const problem = $('#voice-problem');
    if (problem) {
      problem.textContent = voiceError || (!narrator.supported ? 'Este navegador ofrece el acompañamiento en texto. La voz está disponible en navegadores compatibles.' : '');
      problem.hidden = !problem.textContent;
    }
  }

  function updateVoiceOptions() {
    const select = $('#voice-choice');
    if (!select) return;
    const available = narrator.voices();
    select.innerHTML = '<option value="">Automática en español</option>' + available.map(voice => `<option value="${escape(voice.voiceURI)}" ${voice.voiceURI === state.voiceURI ? 'selected' : ''}>${escape(voice.name)} · ${escape(voice.lang)}</option>`).join('');
  }

  function speakText(text) {
    if (!state.voiceEnabled || !voiceReady || document.hidden) return;
    voiceError = '';
    narrator.speak(text, { voiceURI: state.voiceURI, rate: state.voiceRate });
    updateAudioControls();
  }

  function enableVoice(message) {
    state.voiceEnabled = true;
    state.voiceModeChosen = true;
    voiceReady = true;
    state.guideOpen = true;
    save();
    render();
    speakText(message || $('#guide-message')?.textContent || $('#home-guide-message')?.textContent || 'Hola, soy Tu guía. Voy a acompañarte paso a paso. Elegí un curso y empecemos. Podés silenciarme para leer la ayuda.');
  }

  function textOnly() {
    narrator.stop();
    state.voiceEnabled = false;
    state.voiceModeChosen = true;
    voiceReady = false;
    save();
    render();
  }

  function art(theme) {
    const content = theme === 'ai' ? '<div class="mini-doc"><span></span><span></span><span></span></div><span class="spark">✧</span>' : theme === 'social' ? '<div class="mini-doc"><span></span><span></span></div><span class="bubble">¡Hola!</span>' : theme === 'web' ? '<div class="mini-doc"><span></span><span></span></div>' : '<span class="big-glyph">{ / }</span>';
    return `<div class="course-art ${theme}" aria-hidden="true">${content}</div>`;
  }

  function frame(content, page = 'home', lesson = false) {
    const nav = [ ['home', '#', '⌂', 'Mis cursos'], ['notes', '#notes', '▤', 'Mis apuntes'], ['settings', '#settings', '⚙', 'Preferencias'] ];
    return `<div class="shell"><aside class="sidebar"><a class="brand" href="#" aria-label="Aula, inicio"><span class="brand-mark" aria-hidden="true"></span>aula<span style="color:#8c9f6d">.</span></a><nav class="side-nav" aria-label="Principal">${nav.map(([name, href, icon, label]) => `<a href="${href}" ${page === name ? 'aria-current="page"' : ''} aria-label="${label}"><span class="nav-icon" aria-hidden="true">${icon}</span><span class="nav-label">${label}</span></a>`).join('')}</nav><div class="side-bottom"><p>Un paso más para<br>lo que querés hacer.</p><p class="fine-line">Formación para comercios<br>Mercedes, Buenos Aires</p><p>Versión de prueba</p></div></aside><div class="main-shell"><header class="topbar"><p><strong>Tu espacio de aprendizaje</strong><span class="responsive-name">IA, comunicación y tecnología</span></p>${audioBar()}<span class="pill">Avance en este dispositivo</span></header><p id="voice-problem" class="voice-problem" role="status" hidden></p>${!storageAvailable ? '<p class="storage-warning" role="status">El guardado local no está disponible. Exportá tus entregas desde Mis apuntes antes de salir.</p>' : ''}<main id="main" ${lesson ? '' : 'class="page"'}>${content}</main></div></div>`;
  }

  function courseCard(course) {
    const done = courseProgress(course);
    return `<a class="course-card" href="#course/${course.id}" aria-label="${escape(course.title)}, ${done} de ${course.classes.length} clases completadas">${art(course.theme)}<div class="card-body"><div class="card-meta"><span>${escape(course.label)}</span><span>${course.classes.length} clases · ${minutes(course)} min</span></div><h3>${escape(course.title)}</h3><p class="card-description">${escape(course.description)}</p><div class="card-bottom"><span>${done ? `${done} de ${course.classes.length} completadas` : 'Empezar a tu ritmo'}</span><span class="arrow" aria-hidden="true">↗</span></div>${done ? `<div class="progress-track" style="margin-top:12px" aria-hidden="true"><div class="progress-fill" style="width:${done / course.classes.length * 100}%"></div></div>` : ''}</div></a>`;
  }

  function home() {
    const id = Math.max(1, Math.min(12, Number(state.lastLesson) || 1));
    const resume = state.completed.length > 0 || Object.keys(state.drafts).length > 0;
    const nextId = isComplete(id) ? lessons.find(lesson => !isComplete(lesson.id))?.id || id : id;
    return frame(`<div class="heading-row"><div><p class="eyebrow">Aprendizaje a tu ritmo</p><h1 class="page-title">Aprendé para tu negocio.</h1><p class="lead">Cursos cortos, práctica real y una guía que te acompaña.</p></div></div><section class="hero" aria-labelledby="welcome-title"><div class="hero-copy"><p class="eyebrow">${resume ? 'Seguí donde quedaste' : 'Tu primer curso'}</p><h2 id="welcome-title">${resume ? escape(lessons[nextId - 1].title) : 'Una idea, un borrador.<br>Y tu criterio para revisarlo.'}</h2><p id="home-guide-message">${resume ? 'Hola. ¿Seguimos con tu curso? Te acompaño con una explicación o una pista cada vez que lo necesites.' : 'Hola, soy Tu guía. Vamos a aprender paso a paso. Elegí un curso y empecemos. Si te trabás, puedo darte una pista o un ejemplo.'}</p><a class="button light" href="#lesson/${nextId}/read">${resume ? 'Continuar mi clase' : 'Empezar con IA'}<span class="arrow" aria-hidden="true">→</span></a></div><div class="hero-art"><span class="mascot-shadow"></span>${mascot('', 'hello')}</div></section>${voiceWelcome()}<section class="course-section" aria-labelledby="courses-title"><div class="heading-row"><h2 id="courses-title">Tus cursos</h2><p class="subtle">${state.completed.length} de 12 clases completadas</p></div><div class="course-grid">${courses.map(courseCard).join('')}</div></section><div class="dashboard-foot"><span>Elegí un curso o seguí el recorrido completo.</span><span>Las prácticas se guardan en este navegador.</span></div>`, 'home');
  }

  function coursePage(course) {
    const done = courseProgress(course);
    return frame(`<a class="back-link" href="#">← Volver a mis cursos</a><div class="detail-intro"><div><p class="eyebrow">${escape(course.label)} · Nivel inicial</p><h1 class="page-title">${escape(course.title)}</h1><p class="lead">${escape(course.description)}</p><p class="lead">Al terminar, te llevás ${escape(course.result.charAt(0).toLowerCase() + course.result.slice(1))}</p><div class="lesson-tools"><span>${course.classes.length} clases</span><span>◷ ${minutes(course)} minutos estimados</span><span>Práctica incluida</span></div></div>${art(course.theme)}</div><div class="heading-row"><h2>Qué vas a aprender</h2><span class="subtle">${done} de ${course.classes.length} completadas</span></div><div class="lesson-list">${course.classes.map((id, index) => { const lesson = lessons[id - 1]; return `<a class="lesson-item" href="#lesson/${id}/read"><span class="lesson-count ${isComplete(id) ? 'done' : ''}">${isComplete(id) ? '✓' : String(index + 1).padStart(2, '0')}</span><div><strong>${escape(lesson.title)}</strong><small>${lesson.duration} min · ${isComplete(id) ? 'Práctica completada' : 'Lectura y actividad'}</small></div><span class="arrow" aria-hidden="true">→</span></a>`; }).join('')}</div>`, 'home');
  }

  function inline(text) {
    return escape(text)
      .replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1 ↗</a>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  function markdown(text) {
    let html = '', paragraph = [], list = false, quote = false;
    function flush() { if (paragraph.length) { html += `<p>${paragraph.map(inline).join(' ')}</p>`; paragraph = []; } }
    function close() { flush(); if (list) { html += '</ol>'; list = false; } if (quote) { html += '</blockquote>'; quote = false; } }
    for (const line of text.split('\n')) {
      if (!line.trim()) { close(); continue; }
      if (line.startsWith('#### ')) { close(); html += `<h3>${inline(line.slice(5))}</h3>`; }
      else if (/^\d+\. /.test(line)) { flush(); if (!list) { html += '<ol>'; list = true; } html += `<li>${inline(line.replace(/^\d+\. /, ''))}</li>`; }
      else if (line.startsWith('> ')) { if (!quote) { close(); html += '<blockquote>'; quote = true; } paragraph.push(line.slice(2)); }
      else { if (list || quote) close(); paragraph.push(line); }
    }
    close(); return html;
  }

  function guide(lesson) {
    if (!state.guideVisible) return '<button class="button small" data-action="show-guide">Mostrar a Tu guía</button>';
    const open = state.guideOpen;
    const hints = Math.min(state.hints[lesson.id] || 0, 2);
    return `<aside class="guide ${open ? '' : 'closed'}" aria-label="Tu guía, acompañante virtual"><div class="guide-top">${mascot('', 'hello')}<div><strong>Tu guía</strong><small>Guía de aprendizaje</small></div><button class="close-guide" data-action="toggle-guide" aria-expanded="${open}" aria-controls="guide-body" aria-label="${open ? 'Cerrar ayuda' : 'Abrir ayuda'}">${open ? '−' : '+'}</button></div><div id="guide-body" ${open ? '' : 'hidden'}><p id="guide-message" aria-live="polite">${escape(guideMessages[lesson.id] || lesson.guidance[hints])}</p><div class="guide-listen"><button data-action="voice-repeat" ${narrator.supported ? '' : 'disabled'}>Escuchar esta ayuda</button></div><div class="guide-action"><button data-action="hint">${['Dame una pista', 'Dame otra pista', 'Repasar la pista'][hints]}</button><button data-action="explain">Explicame la actividad</button><button data-action="example">Ver un ejemplo</button></div></div></aside>`;
  }

  function lessonPage(lesson, tab = 'read') {
    const course = courseFor(lesson.id);
    const localIndex = course.classes.indexOf(lesson.id);
    const tabs = [['read', 'La clase'], ['practice', 'A practicar'], ['notes', 'Mis notas']];
    const options = course.classes.map(id => `<option value="${id}" ${id === lesson.id ? 'selected' : ''}>${course.classes.indexOf(id) + 1}. ${escape(lessons[id - 1].title)}</option>`).join('');
    return frame(`<div class="lesson-shell"><nav class="syllabus" aria-label="Clases del curso"><a class="back-link" href="#course/${course.id}">← Volver al curso</a><p class="eyebrow">Tu recorrido</p><h2>${escape(course.title)}</h2><p class="subtle">${courseProgress(course)} de ${course.classes.length} completadas</p><div class="progress-track" aria-hidden="true"><div class="progress-fill" style="width:${courseProgress(course) / course.classes.length * 100}%"></div></div>${course.classes.map((id, i) => `<a href="#lesson/${id}/read" class="${id === lesson.id ? 'active' : ''}" ${id === lesson.id ? 'aria-current="step"' : ''}><span class="step-dot">${isComplete(id) ? '✓' : i + 1}</span><span>${escape(lessons[id - 1].title)}</span></a>`).join('')}</nav><div class="lesson-main"><select class="mobile-course-picker" aria-label="Cambiar de clase">${options}</select><header class="lesson-heading"><p class="eyebrow">${escape(course.label)} · Clase ${localIndex + 1} de ${course.classes.length}</p><h1>${escape(lesson.title)}</h1><p class="lesson-objective">${escape(lesson.objective)}</p><div class="lesson-tools"><span>◷ ${lesson.duration} minutos estimados</span><span>${isComplete(lesson.id) ? '✓ Práctica completada' : 'A tu ritmo'}</span></div></header><div class="lesson-tabs" role="tablist" aria-label="Contenido de la clase">${tabs.map(([id, label]) => `<button role="tab" id="tab-${id}" aria-selected="${id === tab}" aria-controls="lesson-panel" data-tab="${id}" tabindex="${id === tab ? '0' : '-1'}">${label}</button>`).join('')}</div><div class="lesson-columns"><section class="lesson-content" id="lesson-panel" role="tabpanel" aria-labelledby="tab-${tab}">${tab === 'read' ? `<div class="listen-lesson"><button class="button small" data-action="voice-lesson" ${narrator.supported ? '' : 'disabled'}>Escuchar la explicación</button><span>El texto completo está debajo.</span></div><div class="prose">${markdown(lesson.content)}</div><div class="button-row"><a class="button primary" href="#lesson/${lesson.id}/practice">Ir a la práctica <span aria-hidden="true">→</span></a></div>` : tab === 'notes' ? notesPanel(lesson.id) : activity(lesson.id)}</section>${guide(lesson)}</div><footer class="lesson-footer"><a class="button ghost" href="${lesson.id > 1 ? `#lesson/${lesson.id - 1}/read` : '#'}">← ${lesson.id > 1 ? 'Clase anterior' : 'Mis cursos'}</a><a class="button ${isComplete(lesson.id) ? 'primary' : ''}" href="${isComplete(lesson.id) ? lesson.id < 12 ? `#lesson/${lesson.id + 1}/read` : '#' : `#lesson/${lesson.id}/practice`}">${isComplete(lesson.id) ? lesson.id < 12 ? 'Siguiente clase' : 'Volver a mis cursos' : 'Abrir la práctica'} <span aria-hidden="true">→</span></a></footer></div></div>`, 'home', true);
  }

  function field(name, label, value = '', placeholder = '', type = 'textarea') {
    const control = type === 'textarea' ? `<textarea name="${name}" placeholder="${escape(placeholder)}">${escape(value)}</textarea>` : `<input name="${name}" type="${type}" value="${escape(value)}" placeholder="${escape(placeholder)}">`;
    return `<label class="field">${escape(label)}${control}</label>`;
  }

  function checklist(items) {
    return `<fieldset class="self-check"><legend>Revisá tu entrega</legend>${items.map((label, index) => `<label class="choice"><input type="checkbox" name="criterion${index}" ${draft(route.id)[`criterion${index}`] === 'on' ? 'checked' : ''}><span>${escape(label)}</span></label>`).join('')}</fieldset>`;
  }

  function workshop(id, title, scenario, fields, criteria) {
    const data = draft(id);
    return `<form data-form="workshop" data-lesson="${id}"><h3>${title}</h3>${scenario ? `<div class="scenario">${scenario}</div>` : ''}${fields.map(([name, label, placeholder]) => field(name, label, data[name], placeholder)).join('')}${checklist(criteria)}<p class="disabled-note">Esta entrega se revisa con tu autoevaluación. Podés volver a editarla.</p><div class="activity-actions"><button class="button primary" type="submit">Guardar mi práctica <span aria-hidden="true">✓</span></button></div><div class="form-feedback" aria-live="polite"></div></form>`;
  }

  const workshopDefinitions = {
    2: ['Una respuesta que tu equipo pueda enviar', '<p>El cliente pregunta si puede pagar por transferencia y recibir antes de las 9. La transferencia está confirmada. El horario de entrega está pendiente.</p>', [['message', 'Mensaje para el cliente', '¡Hola! Sí, aceptamos transferencia…'], ['internal', 'Nota interna para el equipo', '¿Qué necesitás consultar antes de responder?'], ['prompt', 'Instrucción reutilizable', 'Incluí la consulta, los datos confirmados y lo que falta verificar.']], ['El mensaje confirma la transferencia.', 'El horario de entrega queda pendiente de consulta.', 'La nota interna indica qué debe revisar el equipo.']],
    3: ['Tu ficha de campaña', '<p>La panadería ofrece 2 panes integrales por $6.000 el sábado 21 de noviembre de 2026, de 8 a 12. Tiene 20 combos para retirar en el local.</p>', [['goal', 'Objetivo de la campaña', 'Recibir reservas de…'], ['audience', 'A quién va dirigida', 'Personas de…'], ['offer', 'Oferta y vigencia', 'Escribí los datos confirmados.'], ['action', 'Qué tiene que hacer quien la ve', 'Reservar por…'], ['measure', 'Qué vas a contar para conocer el resultado', 'Cantidad de…']], ['La oferta incluye fecha y horario.', 'La publicación pide una acción concreta.', 'El resultado se puede contar.']],
    4: ['Una oferta en dos canales', '<p>2 panes integrales por $6.000. Sábado 21 de noviembre de 2026, de 8 a 12. 20 combos disponibles. Retiro en el local.</p>', [['headline', 'Texto principal de tu pieza', '2 panes integrales por…'], ['caption', 'Pie de la publicación de Instagram', 'Sumá la fecha, el horario y cómo reservar.'], ['whatsapp', 'Mensaje para WhatsApp', 'Escribí un mensaje completo para enviar.']], ['La oferta y la vigencia coinciden en ambos mensajes.', 'Se entiende cómo reservar.', 'La pieza se puede leer en un celular.']],
    5: ['Un calendario con seguimiento', '<p>En la última campaña hubo 100 clics, 12 consultas y 5 reservas confirmadas. El objetivo era recibir reservas.</p>', [['calendar', 'Planificá tres publicaciones', 'Miércoles · anuncio · Instagram · responsable…'], ['result', 'Qué resultado tuvo la campaña', '¿Cuántas reservas confirmadas hubo?'], ['change', 'Qué cambio probarías la próxima vez', '¿Qué cambiarías y qué dato compararías?']], ['El calendario tiene días, responsables y una acción por envío.', 'El resultado identifica 5 reservas confirmadas.', 'El cambio propuesto se puede comprobar.']],
    12: ['Tu entrega del recorrido', '<p>Reuní las piezas de tu campaña y explicá cómo las actualizarías. Podés pegar enlaces de prueba o describir tu entrega.</p>', [['campaign', 'Publicación y oferta actualizada', 'Pegá el texto o el enlace de tu publicación.'], ['website', 'Web y prueba de la consulta', 'Indicá el enlace y qué pasó al probar el formulario.'], ['tests', 'Regla y resultados de prueba', 'Pedido → Reservas. Consulta → … Otro → …'], ['maintenance', 'Cómo harías el próximo cambio', 'Explicá dónde cambiar la oferta y cómo verificarla.']], ['La oferta coincide en la publicación y en la web.', 'Una consulta de prueba quedó registrada.', 'Probé los destinos de Pedido, Consulta y Otro.', 'Puedo explicar dónde haría el próximo cambio.']]
  };

  function completion(id) {
    return isComplete(id) ? `<div class="completion"><h3>Una práctica más en tu recorrido.</h3><p>Tu entrega quedó guardada en este navegador. Podés editarla o exportarla desde Mis apuntes.</p></div>` : '';
  }

  function activity(id) {
    let body;
    const data = draft(id);
    if (id === 1) {
      body = `<h3>¿Qué falta confirmar?</h3><div class="scenario"><p><strong>Ficha de La Esquina.</strong> Pan integral de 500 g. Retiro en el local, de lunes a sábado de 8 a 12.</p><p><strong>Borrador de IA.</strong> «2×1 en pan integral hasta el viernes. Retiro en el local».</p></div><form data-form="facts"><fieldset><legend>Marcá los datos que requieren confirmación</legend>${[['offer', '2×1'], ['product', 'Pan integral'], ['date', 'Hasta el viernes'], ['pickup', 'Retiro en el local']].map(([value, text]) => `<label class="choice"><input name="facts" type="checkbox" value="${value}" ${data.factsCorrect && ['offer', 'date'].includes(value) ? 'checked' : ''}><span>${text}</span></label>`).join('')}</fieldset><button class="button primary" type="submit">Comprobar</button><div class="form-feedback" aria-live="polite"></div></form><div id="individual-challenge" ${data.factsCorrect ? '' : 'hidden'} style="margin-top:25px">${workshop(1, 'Ahora probá con otro comercio', '<p>Bicicletería Rueda Sur recibe bicicletas para revisar frenos el jueves de 15 a 18, con turno previo. El precio está pendiente.</p><p>La IA escribió «Revisión de frenos gratis este jueves, vení cuando quieras».</p>', [['prompt', 'Tu instrucción para la IA', 'Indicá qué necesitás y qué datos puede usar.'], ['message', 'Tu borrador para WhatsApp', 'Escribí hasta 45 palabras.'], ['question', 'Qué le preguntarías al comercio', '¿Qué dato falta confirmar?']], ['La instrucción usa los datos confirmados.', 'El mensaje conserva el jueves de 15 a 18 y el turno previo.', 'La pregunta pide confirmar el precio.'])}</div>`;
    } else if (workshopDefinitions[id]) {
      body = workshop(id, ...workshopDefinitions[id]);
      if (id === 4) body += `<div class="mini-preview" aria-label="Vista previa de tu pieza"><p class="eyebrow">Panadería La Esquina</p><h3 id="live-headline">${escape(data.headline || 'Tu oferta, clara y a la vista.')}</h3><p id="live-caption">${escape(data.caption || 'El texto de tu publicación aparece acá mientras lo escribís.')}</p></div>`;
    } else if (id === 6) {
      body = `<h3>Ordená la página</h3><p class="intro">Ubicá primero qué ofrece el negocio, después la oferta y sus detalles, y cerrá con la acción para consultar.</p><ol class="reorder-list">${orderRows()}</ol><button class="button primary" data-action="check-order">Comprobar orden</button><div class="form-feedback" aria-live="polite"></div>`;
    } else if (id === 7) {
      body = `<h3>Armá tu página de práctica</h3><p class="intro">Editá los campos y mirá cómo cambia la página. En el apunte de la clase tenés los pasos para crearla en Google Sites.</p><form data-form="page-builder">${field('title', 'Título', data.title, 'Pan integral en Mercedes', 'text')}${field('offer', 'Oferta, fecha y horario', data.offer, '2 panes integrales por $6.000…')}${field('button', 'Texto del botón', data.button, 'Consultar por el combo', 'text')}<div class="mini-preview"><h3 id="page-title">${escape(data.title || 'El título de tu negocio')}</h3><p id="page-offer">${escape(data.offer || 'La oferta y sus detalles aparecen acá.')}</p><a href="#lesson/8/practice" class="preview-button" id="page-button">${escape(data.button || 'Abrir formulario de práctica')} →</a></div>${checklist(['El título permite entender qué se ofrece.', 'La oferta incluye fecha y horario.', 'El botón describe la acción y abre el formulario.'])}<button class="button primary" type="submit">Guardar mi página</button><div class="form-feedback" aria-live="polite"></div></form>`;
    } else if (id === 8) {
      body = `<h3>Enviá una consulta de prueba</h3><p class="intro">Usá datos inventados. Al enviar, podés ver la consulta registrada en este dispositivo.</p>${queryForm()}<div id="query-log">${queryTable(false)}</div>`;
    } else if (id === 9) {
      body = `<h3>Organizá las consultas que llegan</h3><p class="intro">Agregá una consulta de prueba, revisá sus datos y pasala de Pendiente a En atención.</p><button class="button" data-action="add-query">Agregar consulta de prueba <span aria-hidden="true">+</span></button><div id="query-log">${queryTable(true)}</div><button class="button primary" data-action="check-tracking">Comprobar seguimiento</button><div class="form-feedback" aria-live="polite"></div>`;
    } else if (id === 10) {
      body = `<h3>Cambiá un destino y probá la regla</h3><p class="intro">En esta práctica editás los textos que devuelve la función. Cambiá Consulta a Mostrador y ejecutá las pruebas.</p><div class="rules">${field('pedido', 'Destino de Pedido', state.rules.pedido, '', 'text')}${field('consulta', 'Destino de Consulta', state.rules.consulta, '', 'text')}</div><pre class="code-block" id="rule-code">${escape(ruleCode())}</pre><button class="button primary" data-action="run-rules">Ejecutar pruebas <span aria-hidden="true">▷</span></button><div id="rule-output" aria-live="polite"></div>`;
    } else if (id === 11) {
      body = `<h3>Anticipá qué devuelve la función</h3><p class="intro">La función quita espacios y pasa a minúsculas. Usá estos destinos al responder.</p><pre class="code-block">${escape(ruleCode())}</pre><form data-form="edge-cases"><div class="table-wrap"><table><thead><tr><th>Entrada</th><th>Tu predicción</th></tr></thead><tbody>${[' PEDIDO ', 'Consulta', 'Otro', '', 'Devolución'].map((value, index) => `<tr><td><code>${escape(JSON.stringify(value))}</code></td><td><select name="prediction${index}" aria-label="Resultado para ${escape(value || 'texto vacío')}"><option value="">Elegí un resultado</option>${[...new Set([state.rules.pedido, state.rules.consulta, 'Revisión manual'])].map(destination => `<option value="${escape(destination)}" ${data[`prediction${index}`] === destination ? 'selected' : ''}>${escape(destination)}</option>`).join('')}</select></td></tr>`).join('')}</tbody></table></div><button class="button primary" type="submit">Comprobar mis predicciones</button><div class="form-feedback" aria-live="polite"></div></form>`;
    }
    return `${completion(id)}<div class="activity-card"><p class="eyebrow">Actividad de la clase</p>${body}</div>`;
  }

  function orderRows() {
    const blocks = { title: 'Pan integral en Mercedes', offer: '2 panes integrales por $6.000', details: 'Sábado 21 de noviembre · Retiro de 8 a 12', button: 'Consultar por el combo →' };
    return state.order.map((item, index) => `<li><span>${escape(blocks[item])}</span><button data-action="move-block" data-index="${index}" data-direction="-1" ${index === 0 ? 'disabled' : ''} aria-label="Subir ${escape(blocks[item])}">↑</button><button data-action="move-block" data-index="${index}" data-direction="1" ${index === 3 ? 'disabled' : ''} aria-label="Bajar ${escape(blocks[item])}">↓</button></li>`).join('');
  }

  function queryForm() {
    const data = draft(8);
    return `<form data-form="query">${field('name', 'Nombre de prueba', data.name, 'Cliente de prueba', 'text')}${field('email', 'Correo de prueba', data.email, 'cliente@example.com', 'email')}<label class="field">Tipo de consulta<select name="type"><option>Pedido</option><option>Consulta</option><option>Otro</option></select></label>${field('message', 'Mensaje', data.message, 'Quiero reservar dos panes para retirar…')}<button class="button primary" type="submit">Enviar consulta de prueba</button><div class="form-feedback" aria-live="polite"></div></form>`;
  }

  function queryTable(editable) {
    if (!state.queries.length) return '<p class="subtle" style="margin:18px 0">Acá vas a ver las consultas que envíes.</p>';
    return `<div class="table-wrap"><table><caption class="subtle" style="text-align:left;margin-bottom:8px">Consultas registradas en este dispositivo</caption><thead><tr><th>Nombre y tipo</th><th>Mensaje</th><th>Estado</th></tr></thead><tbody>${state.queries.map(row => `<tr><td>${escape(row.name)}<br><span class="subtle">${escape(row.type)}</span></td><td>${escape(row.message)}</td><td>${editable ? `<select aria-label="Estado de la consulta de ${escape(row.name)}" data-query="${escape(row.id)}">${['Pendiente', 'En atención', 'Resuelta'].map(status => `<option ${row.status === status ? 'selected' : ''}>${status}</option>`).join('')}</select>` : escape(row.status)}</td></tr>`).join('')}</tbody></table></div>`;
  }

  function destination(value) {
    const category = String(value ?? '').trim().toLowerCase();
    if (category === 'pedido') return state.rules.pedido;
    if (category === 'consulta') return state.rules.consulta;
    return 'Revisión manual';
  }

  function ruleCode() {
    return `function asignarDestino(tipo) {\n  const categoria = String(tipo ?? '').trim().toLowerCase();\n\n  if (categoria === 'pedido') {\n    return ${JSON.stringify(state.rules.pedido)};\n  }\n\n  if (categoria === 'consulta') {\n    return ${JSON.stringify(state.rules.consulta)};\n  }\n\n  return 'Revisión manual';\n}`;
  }

  function notesPanel(id) {
    return `<label class="field" for="lesson-notes">Lo que querés recordar de esta clase</label><textarea id="lesson-notes" class="notes-area" placeholder="Anotá una idea o cómo la aplicarías a tu negocio…">${escape(state.notes[id] || '')}</textarea><p class="save-note" role="status">Los cambios se guardan mientras escribís.</p>`;
  }

  function notesPage() {
    const entries = lessons.filter(lesson => state.notes[lesson.id] || Object.keys(draft(lesson.id)).some(key => !['factsCorrect'].includes(key)));
    return frame(`<p class="eyebrow">Tu trabajo</p><h1 class="page-title">Mis apuntes y entregas.</h1><p class="lead">Lo que escribiste en cada clase queda guardado acá. Podés descargar una copia para compartirla con el docente.</p><div class="button-row"><button class="button primary" data-action="export">Descargar mis entregas ↓</button></div>${entries.length ? entries.map(lesson => `<article class="note-row"><h3>${escape(lesson.title)}</h3><p>${escape(state.notes[lesson.id] || 'Tenés una actividad guardada en esta clase.')}</p><a class="button small" href="#lesson/${lesson.id}/${state.notes[lesson.id] ? 'notes' : 'practice'}">Abrir clase →</a></article>`).join('') : '<p class="lead" style="margin-top:35px">Tus notas y prácticas van a aparecer acá cuando empieces a escribir.</p>'}<form class="feedback-form" data-form="pilot-feedback"><h2>Tu experiencia con el aula</h2><p class="subtle">Guardá tus observaciones para incluirlas en la descarga.</p>${field('useful', '¿En qué momento te sirvió Tu guía?', state.feedback?.useful, 'Contá qué estabas intentando hacer…')}${field('improve', '¿Qué te gustaría cambiar del curso o del acompañante?', state.feedback?.improve, '')}<button type="submit" class="button">Guardar mi opinión</button><div class="form-feedback" aria-live="polite"></div></form>`, 'notes');
  }

  function settingsPage() {
    return frame(`<div class="settings"><p class="eyebrow">A tu manera</p><h1 class="page-title">Preferencias.</h1><section class="settings-block"><h2>Tu acompañante</h2><p>Tu guía puede saludarte, explicar y acompañar las prácticas con voz. Podés elegir entre solo voz y solo texto.</p><label class="settings-toggle"><input type="checkbox" name="guideVisible" ${state.guideVisible ? 'checked' : ''}> Mostrar el acompañante en las clases</label><label class="settings-toggle"><input type="checkbox" name="voiceEnabled" ${state.voiceEnabled ? 'checked' : ''} ${narrator.supported ? '' : 'disabled'}> Acompañamiento por voz</label><label class="field" for="voice-choice">Voz en español<select id="voice-choice" name="voiceURI"><option value="">Automática en español</option></select></label><label class="field">Velocidad de la voz<select name="voiceRate"><option value="0.85" ${Number(state.voiceRate) === 0.85 ? 'selected' : ''}>Más pausada</option><option value="0.96" ${Number(state.voiceRate) === 0.96 ? 'selected' : ''}>Normal</option><option value="1.1" ${Number(state.voiceRate) === 1.1 ? 'selected' : ''}>Más rápida</option></select></label><button class="button small" data-action="voice-sample" ${narrator.supported ? '' : 'disabled'}>Probar esta voz</button><p>La voz usa las opciones en español disponibles en tu navegador y dispositivo.</p><label class="settings-toggle"><input type="checkbox" name="reduceMotion" ${state.reduceMotion ? 'checked' : ''}> Reducir el movimiento de las animaciones</label></section><section class="settings-block"><h2>Tu progreso</h2><p>Las notas, respuestas y consultas de prueba se guardan en el navegador de este dispositivo. Podés descargar una copia en Mis apuntes.</p><div class="button-row"><a class="button" href="#notes">Ver mis entregas →</a><button class="button ghost" data-action="reset-prompt">Reiniciar la prueba</button></div><div id="reset-confirm" hidden><p>Se borrarán las notas, el avance y las consultas de este navegador. Descargá tus entregas si querés conservarlas.</p><div class="button-row"><button class="button" data-action="reset-confirm">Confirmar reinicio</button><button class="button ghost" data-action="reset-cancel">Cancelar</button></div></div></section><section class="settings-block"><h2>Sobre esta prueba</h2><p>Aula y el personaje docente son propuestas de identidad para revisar. Los casos de los comercios y sus ofertas son ficticios.</p><p>Las prácticas de formulario, página y clasificación se realizan dentro del aula. En los apuntes también están los pasos para aplicarlas con herramientas externas.</p></section></div>`, 'settings');
  }

  function render() {
    const previousRoute = route;
    const parts = location.hash.replace(/^#\/?/, '').split('/');
    route = { page: parts[0] || 'home', id: Number(parts[1]), tab: ['read', 'practice', 'notes'].includes(parts[2]) ? parts[2] : 'read' };
    const routeChanged = previousRoute && (previousRoute.page !== route.page || previousRoute.id !== route.id || previousRoute.tab !== route.tab);
    if (routeChanged) narrator.stop();
    document.body.classList.toggle('reduce-motion', Boolean(state.reduceMotion));
    if (route.page === 'lesson' && lessons[route.id - 1]) {
      state.lastLesson = route.id; save();
      root.innerHTML = lessonPage(lessons[route.id - 1], route.tab);
      document.title = `${lessons[route.id - 1].title} · Aula`;
    } else if (route.page === 'course' && courses.some(course => course.id === parts[1])) {
      root.innerHTML = coursePage(courses.find(course => course.id === parts[1]));
      document.title = `${courses.find(course => course.id === parts[1]).title} · Aula`;
    } else {
      root.innerHTML = route.page === 'notes' ? notesPage() : route.page === 'settings' ? settingsPage() : home();
      document.title = 'Aula · Aprendé para tu negocio';
    }
    updateAudioControls();
    updateVoiceOptions();
    if (routeChanged && route.page === 'lesson' && route.tab !== 'notes' && state.guideVisible && state.guideOpen) {
      const lesson = lessons[route.id - 1];
      if (lesson) say(`${route.tab === 'practice' ? 'Vamos a practicar.' : `Vamos con ${lesson.title}.`} ${lesson.guidance[0]}`, 'hello');
    }
  }

  function animate(gesture) {
    const mascotNode = $('.guide .mascot');
    if (!mascotNode) return;
    delete mascotNode.dataset.gesture;
    void mascotNode.offsetWidth;
    mascotNode.dataset.gesture = gesture;
  }

  function say(message, gesture = 'hint') {
    const node = $('#guide-message');
    if (route.page === 'lesson') guideMessages[route.id] = message;
    if (node) node.textContent = message;
    animate(gesture);
    if (state.guideVisible && state.guideOpen) speakText(message);
  }

  function showFeedback(form, text, success = true) {
    form.querySelector('.form-feedback').innerHTML = `<p class="feedback ${success ? '' : 'error'}" role="${success ? 'status' : 'alert'}">${escape(text)}</p>`;
    say(text, success ? 'success' : 'hint');
  }

  function complete(id, message) {
    if (!isComplete(id)) state.completed.push(id);
    save();
    render();
    toast(message || 'Práctica completada. Tu trabajo quedó guardado.');
    say('Tu práctica quedó guardada. Ya avanzaste un paso más. Podés seguir a la próxima clase o volver a revisar tu entrega.', 'success');
  }

  function validateWorkshop(form) {
    const textFields = [...form.querySelectorAll('textarea, input[type=text]')];
    const empty = textFields.find(input => !input.value.trim());
    if (empty) { showFeedback(form, 'Completá cada campo con el detalle necesario para revisar tu entrega.', false); empty.focus(); return false; }
    const criteria = [...form.querySelectorAll('.self-check input')];
    if (criteria.some(box => !box.checked)) { showFeedback(form, 'Revisá tu entrega y marcá los criterios que cumple antes de guardarla.', false); return false; }
    return true;
  }

  root.addEventListener('input', event => {
    const input = event.target;
    if (input.id === 'lesson-notes') { state.notes[route.id] = input.value; save(); return; }
    const form = input.closest('form');
    if (form?.dataset.form === 'pilot-feedback') { state.feedback = { ...state.feedback, [input.name]: input.value }; save(); return; }
    if (form && route.page === 'lesson' && input.name && !['checkbox', 'radio'].includes(input.type)) {
      state.drafts[route.id] = { ...draft(route.id), [input.name]: input.value }; save();
    }
    if (route.id === 4) {
      if (input.name === 'headline') $('#live-headline').textContent = input.value || 'Tu oferta, clara y a la vista.';
      if (input.name === 'caption') $('#live-caption').textContent = input.value || 'El texto de tu publicación aparece acá.';
    }
    if (route.id === 7) {
      const target = { title: '#page-title', offer: '#page-offer', button: '#page-button' }[input.name];
      if (target) $(target).textContent = input.value;
    }
    if (route.id === 10 && ['pedido', 'consulta'].includes(input.name)) {
      state.rules[input.name] = input.value;
      $('#rule-code').textContent = ruleCode();
      $('#rule-output').textContent = '';
      save();
    }
  });

  root.addEventListener('change', event => {
    const input = event.target;
    if (input.classList.contains('mobile-course-picker')) { location.hash = `lesson/${input.value}/read`; return; }
    if (input.name === 'voiceEnabled') {
      if (input.checked) enableVoice('Hola, soy Tu guía. Vamos a avanzar paso a paso. Podés silenciarme para leer la ayuda en texto.');
      else textOnly();
      return;
    }
    if (input.name === 'voiceURI' || input.name === 'voiceRate') {
      narrator.stop();
      state[input.name] = input.name === 'voiceRate' ? Number(input.value) : input.value;
      save();
      return;
    }
    if (['guideVisible', 'reduceMotion'].includes(input.name)) {
      state[input.name] = input.checked; save(); document.body.classList.toggle('reduce-motion', Boolean(state.reduceMotion));
      if (input.name === 'guideVisible' && !input.checked) narrator.stop();
    }
    if (input.dataset.query) { const row = state.queries.find(row => row.id === input.dataset.query); if (row) { row.status = input.value; save(); } }
    if (route.page === 'lesson' && input.name && input.tagName === 'SELECT') { state.drafts[route.id] = { ...draft(route.id), [input.name]: input.value }; save(); }
  });

  root.addEventListener('keydown', event => {
    if (event.target.getAttribute('role') !== 'tab' || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const names = ['read', 'practice', 'notes'];
    const current = names.indexOf(route.tab);
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (current + (event.key === 'ArrowRight' ? 1 : 2)) % 3;
    location.hash = `lesson/${route.id}/${names[index]}`;
  });

  document.querySelector('.skip').addEventListener('click', event => {
    event.preventDefault();
    const main = $('#main'); main.tabIndex = -1; main.focus();
  });

  root.addEventListener('click', event => {
    const tab = event.target.closest('[data-tab]');
    if (tab) { location.hash = `lesson/${route.id}/${tab.dataset.tab}`; return; }
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'voice-toggle') {
      if (state.voiceEnabled && voiceReady) textOnly();
      else enableVoice();
    } else if (action === 'voice-start') { enableVoice(); }
    else if (action === 'voice-text') { textOnly(); }
    else if (action === 'voice-stop') { narrator.stop(); }
    else if (action === 'voice-repeat') { enableVoice($('#guide-message')?.textContent); }
    else if (action === 'voice-sample') { enableVoice('Hola, soy Tu guía. Vamos a avanzar paso a paso. Si algo se complica, lo revisamos con un ejemplo. Podés volver a escucharme o elegir la ayuda en texto.'); }
    else if (action === 'voice-lesson') {
      const text = $('.prose')?.innerText;
      if (text) enableVoice(`${lessons[route.id - 1].title}. ${text}`);
    } else if (action === 'toggle-guide') {
      state.guideOpen = !state.guideOpen; save();
      if (!state.guideOpen) narrator.stop();
      $('#guide-body').hidden = !state.guideOpen;
      button.setAttribute('aria-expanded', String(state.guideOpen));
      button.setAttribute('aria-label', state.guideOpen ? 'Cerrar ayuda' : 'Abrir ayuda');
      button.textContent = state.guideOpen ? '−' : '+';
      $('.guide').classList.toggle('closed', !state.guideOpen); animate('listen');
    } else if (action === 'show-guide') { state.guideVisible = true; state.guideOpen = true; save(); render(); }
    else if (action === 'hint') {
      const count = Math.min((state.hints[route.id] || 0) + 1, 2);
      state.hints[route.id] = count; save();
      say(lessons[route.id - 1].guidance[count]);
      button.textContent = count === 1 ? 'Dame otra pista' : 'Repasar la pista';
    } else if (action === 'explain') { say(lessons[route.id - 1].objective, 'listen'); }
    else if (action === 'example') {
      const examples = { 1: 'En una ferretería, la IA escribió “envío gratis”. Antes de usarlo, el equipo consultó cuál era el costo del envío.', 2: 'Si un taller confirmó que recibe transferencias, podés informar ese medio de pago. Si el retiro excepcional requiere consulta, dejalo pendiente.', 3: 'Objetivo: recibir reservas. Acción: escribir por WhatsApp. Dato a medir: reservas confirmadas.', 4: 'Una pieza puede decir “2 panes por $6.000”. El pie completa la fecha y explica cómo reservar.', 5: 'Podés cambiar el texto del botón y comparar cuántas consultas llegan en la próxima campaña.', 6: 'Primero “Pan integral en Mercedes”, después la oferta y sus detalles. El botón permite abrir la consulta.', 7: 'El botón “Consultar por el combo” anticipa qué puede hacer el visitante al abrirlo.', 8: 'Una consulta de prueba puede ser “Pedido · Quiero reservar dos panes” con el correo cliente@example.com.', 9: 'Al empezar a responder una consulta, registrá su estado como “En atención”.', 10: 'Si la categoría es pedido, el primer return devuelve el destino de Pedido.', 11: '“ PEDIDO ” se convierte en “pedido” al quitar los espacios y pasar a minúsculas.', 12: 'Después de cambiar una fecha, revisá que coincida en la publicación y en la página. Volvé a enviar una consulta de prueba.' };
      say(examples[route.id], 'listen');
    } else if (action === 'move-block') {
      const index = Number(button.dataset.index), target = index + Number(button.dataset.direction);
      if (target < 0 || target >= 4) return;
      [state.order[index], state.order[target]] = [state.order[target], state.order[index]]; save();
      $('.reorder-list').innerHTML = orderRows();
      $(`.reorder-list [data-index="${target}"][data-direction="${button.dataset.direction}"]`)?.focus();
    } else if (action === 'check-order') {
      const expected = ['title', 'offer', 'details', 'button'];
      if (state.order.every((item, index) => item === expected[index])) complete(6);
      else { $('.form-feedback').innerHTML = '<p class="feedback error" role="alert">Revisá el orden. Empezá por qué ofrece el negocio, seguí por la oferta y sus condiciones, y cerrá con la consulta.</p>'; animate('hint'); }
    } else if (action === 'add-query') {
      state.queries.push({ id: crypto.randomUUID(), name: 'Cliente de prueba', email: 'cliente@example.com', type: 'Pedido', message: `Quiero reservar un combo · Prueba ${state.queries.length + 1}`, status: 'Pendiente', createdAt: new Date().toISOString() });
      state.drafts[9] = { ...draft(9), addedQuery: true }; save(); $('#query-log').innerHTML = queryTable(true); toast('Consulta de prueba registrada.');
    } else if (action === 'check-tracking') {
      if (draft(9).addedQuery && state.queries.some(row => row.status !== 'Pendiente')) complete(9);
      else $('.form-feedback').innerHTML = '<p class="feedback error" role="alert">Agregá una consulta y cambiá su estado cuando empieces a atenderla.</p>';
    } else if (action === 'run-rules') {
      const values = ['Pedido', 'Consulta', 'Otro'];
      $('#rule-output').innerHTML = `<div class="table-wrap"><table><thead><tr><th>Entrada</th><th>Resultado</th></tr></thead><tbody>${values.map(value => `<tr><td>${value}</td><td>${escape(destination(value))}</td></tr>`).join('')}</tbody></table></div>`;
      if (state.rules.pedido === 'Ventas' && state.rules.consulta === 'Mostrador') {
        state.drafts[10] = { ...draft(10), ...state.rules }; complete(10, 'Las tres pruebas dieron el resultado esperado.');
        $('#rule-output').innerHTML = `<div class="table-wrap"><table><thead><tr><th>Entrada</th><th>Resultado</th></tr></thead><tbody>${values.map(value => `<tr><td>${value}</td><td>${escape(destination(value))}</td></tr>`).join('')}</tbody></table></div>`;
      } else {
        $('#rule-output').insertAdjacentHTML('beforeend', '<p class="feedback">Para esta práctica, Pedido va a Ventas y Consulta a Mostrador. Cambiá el destino de Consulta y ejecutá otra vez.</p>');
      }
    } else if (action === 'export') { exportWork(); }
    else if (action === 'reset-prompt') { $('#reset-confirm').hidden = false; }
    else if (action === 'reset-cancel') { $('#reset-confirm').hidden = true; }
    else if (action === 'reset-confirm') { narrator.stop(); voiceReady = false; state = load(true); save(); location.hash = ''; render(); toast('La prueba está lista para empezar de nuevo.'); }
  });

  root.addEventListener('submit', event => {
    const form = event.target;
    event.preventDefault();
    const type = form.dataset.form;
    const values = Object.fromEntries(new FormData(form));
    if (type === 'facts') {
      const facts = new FormData(form).getAll('facts');
      const correct = facts.length === 2 && facts.includes('offer') && facts.includes('date');
      showFeedback(form, correct ? 'El 2×1 y el viernes requieren confirmación. El producto y el lugar de retiro están respaldados. Ahora probá con otro comercio.' : 'Compará cada dato con la ficha. Marcá los que todavía debe confirmar el comercio.', correct);
      if (correct) { state.drafts[1] = { ...draft(1), factsCorrect: true }; save(); $('#individual-challenge').hidden = false; say('Identificaste los datos pendientes. Ahora usá el mismo criterio con la bicicletería.', 'success'); }
    } else if (type === 'workshop' || type === 'page-builder') {
      if (!validateWorkshop(form)) return;
      const id = Number(form.dataset.lesson) || route.id;
      state.drafts[id] = { ...draft(id), ...values }; complete(id);
    } else if (type === 'query') {
      if (!values.name?.trim() || !values.message?.trim() || !values.email?.trim()) { showFeedback(form, 'Completá el nombre, el correo y el mensaje de prueba.', false); return; }
      state.queries.push({ ...values, id: crypto.randomUUID(), status: 'Pendiente', createdAt: new Date().toISOString() });
      state.drafts[8] = { ...values }; complete(8, 'La consulta llegó al registro de este dispositivo.');
    } else if (type === 'edge-cases') {
      const tests = [' PEDIDO ', 'Consulta', 'Otro', '', 'Devolución'];
      const mismatches = tests.filter((value, index) => values[`prediction${index}`] !== destination(value));
      state.drafts[11] = values; save();
      if (!mismatches.length) complete(11, 'Las cinco predicciones coinciden con la regla.');
      else showFeedback(form, `Hay ${mismatches.length} predicciones para revisar. Recordá los espacios, las minúsculas y el destino de revisión manual.`, false);
    } else if (type === 'pilot-feedback') {
      state.feedback = values; save(); showFeedback(form, 'Tu opinión quedó guardada y se incluye al descargar tus entregas.');
    }
  });

  function exportWork() {
    const content = { aula: 'Piloto para comercios de Mercedes', exportedAt: new Date().toISOString(), completed: lessons.filter(lesson => isComplete(lesson.id)).map(({id, title}) => ({id, title})), drafts: state.drafts, notes: state.notes, queries: state.queries, rules: state.rules, feedback: state.feedback || null };
    const file = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a'); link.href = url; link.download = 'mis-entregas-aula.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  window.addEventListener('hashchange', () => {
    const active = document.activeElement;
    const fromTab = active?.getAttribute('role') === 'tab';
    render();
    if (fromTab) $(`[data-tab="${route.tab}"]`)?.focus();
    else { window.scrollTo(0, 0); const heading = $('#main h1'); if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); } }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) narrator.stop();
  });
  window.addEventListener('pagehide', () => narrator.stop());
  render();
})();
