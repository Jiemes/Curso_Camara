# Aula para comercios de Mercedes

Piloto de cuatro cursos y doce clases basado en el guion educativo. Incluye prácticas con devolución, apuntes, exportación de entregas y un personaje docente animado como propuesta de acompañante.

## Abrir el proyecto

Con Node.js instalado, ejecutar `npm run dev` y abrir `http://127.0.0.1:4173`. También se puede servir la carpeta `dist` con cualquier servidor estático.

## Editar el contenido

El texto original está en `docs/guion.md`. Ejecutar `npm run sync-content` después de editarlo. Las actividades y la navegación están en `dist/app.js`. Los estilos y gestos están en `dist/styles.css`. El archivo `dist/content.js` se genera desde el guion.

## Alcance del piloto

El avance, las consultas de prueba y las entregas se guardan en el navegador de cada dispositivo. Se pueden exportar desde Mis apuntes. El acompañante usa frases del guion y dos pistas por clase. El formulario y la regla de clasificación son prácticas locales. Las cuentas, los pagos, la sincronización entre dispositivos y las respuestas generadas por un modelo requieren una etapa posterior de desarrollo.

La identidad Aula y el personaje son propuestas de prueba. Los casos y datos comerciales del guion son ficticios.

## Voz del acompañante

Al entrar, el alumno elige Solo voz o Solo texto. El modo voz oculta el mensaje escrito del acompañante y usa las voces en español del navegador. Los controles permiten silenciar, detener, repetir y elegir voz y velocidad en Preferencias. Los navegadores requieren una activación mediante un botón. Si falla el audio, la ayuda se muestra por escrito. La explicación de cada clase también tiene un botón para escucharla.

El módulo `dist/narrator.js` cancela las intervenciones anteriores al cambiar de ayuda o de pantalla. Ejecutar `node scripts/check-narrator.mjs` para comprobar ese comportamiento y las alternativas ante errores.
