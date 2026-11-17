import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = await fs.readFile(path.join(root, 'docs', 'guion.md'), 'utf8');
const chapters = [...source.matchAll(/^### Clase (\d+) (.+)\r?\n([\s\S]*?)(?=^### Clase |^## Curso |^## Anexo)/gm)];
const durations = [20, 20, 20, 25, 20, 20, 30, 25, 25, 25, 20, 30];
const courses = [
  { id: 'ia', title: 'IA para tareas del negocio', description: 'Prepará avisos y respuestas que tu equipo pueda revisar y reutilizar.', result: 'Una instrucción reutilizable y dos mensajes revisados.', classes: [1, 2], theme: 'ai', label: 'Inteligencia artificial' },
  { id: 'redes', title: 'Redes y publicidad con IA', description: 'Convertí una oferta en una campaña clara para tus clientes.', result: 'Dos piezas para publicar y un calendario con seguimiento.', classes: [3, 4, 5], theme: 'social', label: 'Comunicación y diseño' },
  { id: 'web', title: 'Una web simple para tu negocio', description: 'Ordená tu oferta y creá un recorrido para recibir consultas.', result: 'Una página de oferta y un formulario probado.', classes: [6, 7, 8], theme: 'web', label: 'Diseño web' },
  { id: 'codigo', title: 'Programación y automatización inicial', description: 'Organizá las consultas y aprendé a cambiar una regla de código.', result: 'Un registro de consultas y una regla de clasificación probada.', classes: [9, 10, 11, 12], theme: 'code', label: 'Programación' }
];
const guidance = [
  ['Hoy vas a preparar un aviso y revisar si se puede publicar. Empezá por comparar el borrador con la ficha.', 'Buscá en la ficha la información que apareció en el anuncio. ¿Qué parte del mensaje no encontrás?', 'La ficha habla de pan integral y del retiro. ¿Quién puede confirmar el 2×1 y el día en que termina?'],
  ['El cliente necesita una respuesta clara. Primero veamos qué puede confirmar hoy el negocio.', 'Subrayá cualquier frase que comprometa un pago, un horario o una entrega. ¿Qué dato te permite sostenerla?', 'La transferencia está confirmada. Dejá que el equipo consulte el horario de entrega y decile al cliente qué va a pasar después.'],
  ['Elegí qué querés que haga la persona al ver la publicación.', '¿Qué te gustaría que haga alguien después de verla?', 'Si esperás un mensaje como “Quiero reservar un combo”, escribí dónde lo vas a recibir y qué vas a contar.'],
  ['Vamos a contar la misma oferta en dos canales.', 'Abrí la pieza en el celular. ¿Se leen la oferta y la acción sin hacer zoom?', 'Si la fecha quedó solo en la imagen, agregala al pie. Repetí la fecha al redactar el mensaje de WhatsApp.'],
  ['Elegí cuándo anunciar, recordar y actualizar.', 'Buscá cuál de los datos representa una reserva confirmada.', 'Si alguien abrió el enlace y se fue, contalo como clic. Buscá ahora el número de reservas registradas.'],
  ['Imaginá que alguien llega desde una publicación y tiene un minuto para decidir.', '¿Qué le dirías primero si estuviera frente al mostrador?', 'Leé el botón solo. ¿La persona entiende que va a abrir una consulta por el combo?'],
  ['Llevá tu boceto a la página, una sección por vez.', '¿Se entiende qué ofrece el negocio al leer el título?', 'Revisá la oferta, la fecha, el horario y la acción. Después comprobá que el texto del botón diga qué sucede al tocarlo.'],
  ['Hacé el recorrido como si quisieras reservar el combo.', '¿Qué información necesita el equipo para responder la consulta?', 'Elegí un tipo, escribí el mensaje y enviá la consulta de prueba. Revisá después el registro que se genera.'],
  ['Primero vamos a lograr que cada consulta llegue a su lugar.', 'Buscá la consulta nueva en el registro y compará los datos con los que enviaste.', 'La consulta requiere que alguien del equipo la lea. Elegí un estado para registrar que empezaste a atenderla.'],
  ['Antes de ejecutar, anticipá qué ruta va a tomar cada consulta.', '¿Qué valor compara cada condición?', 'Buscá el return dentro del bloque de consulta. Cambiá el destino y repetí las tres pruebas.'],
  ['Probá también entradas que alguien puede escribir por error.', '¿Quién debería leer una consulta que llegó sin categoría?', 'Si el valor no coincide con ninguna condición, se usa el último return de la función.'],
  ['Hacé el recorrido completo y guardá una evidencia de cada paso.', 'Revisá cada entrega con la pauta que está junto al campo.', 'Al actualizar una oferta, repetí el recorrido de consulta y probá los destinos de Pedido, Consulta y Otro.']
];
const outcomes = [
  'Escribí una instrucción y reconocé qué datos necesita confirmar el comercio antes de publicar.',
  'Prepará una respuesta a una consulta y guardá una instrucción que tu equipo pueda reutilizar.',
  'Definí un objetivo, una oferta y una acción que puedas registrar.',
  'Creá una publicación y un mensaje con los mismos datos comerciales.',
  'Planificá tres publicaciones y elegí qué resultado mirar.',
  'Ordená una página para que quien llega entienda la oferta y cómo consultar.',
  'Construí una página de práctica y revisá cómo se ve en el celular.',
  'Probá un formulario y verificá que la consulta quede registrada.',
  'Registrá las consultas y organizá su seguimiento.',
  'Modificá los destinos de una regla JavaScript y probá qué devuelve.',
  'Anticipá resultados y revisá cómo se comporta la regla con datos incompletos.',
  'Reuní tus entregas y comprobá que podés actualizar la campaña.'
];

function studentText(text) {
  return text.split('\n').filter(line => {
    if (line.trim() === '>') return false;
    if (/^\|/.test(line) || /^\*\*Tu guía|^\*\*Asistente después/.test(line)) return false;
    if (/^\*\*(Resultado de aprendizaje|\d+ minutos estimados)/.test(line)) return false;
    return true;
  }).join('\n').trim();
}

const lessons = chapters.map(([, number, title, body]) => {
  const id = Number(number);
  const course = courses.find(course => course.classes.includes(id));
  return { id, title, course: course.id, duration: durations[id - 1], objective: outcomes[id - 1], content: studentText(body), guidance: guidance[id - 1] };
});
if (lessons.length !== 12) throw new Error('Se esperaban las 12 clases del guion.');
await fs.writeFile(path.join(root, 'dist', 'content.js'), `window.AULA_CONTENT = ${JSON.stringify({courses, lessons}, null, 2)};\n`);
console.log('Contenido sincronizado. 4 cursos y 12 clases.');
