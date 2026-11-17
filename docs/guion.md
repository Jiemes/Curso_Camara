# Capacitación digital para comercios de Mercedes

Guion de producción para el piloto con la Cámara Económica de Mercedes. La propuesta tiene cuatro cursos básicos y 12 clases asincrónicas. El trabajo final consiste en preparar una promoción, llevar al público a una página sencilla y registrar las consultas para poder responderlas. Cada curso deja un resultado que el participante puede usar por separado.

El **curso de IA para tareas del negocio** incluye dos clases desarrolladas con textos, ejercicios y devoluciones listos para probar. Los otros tres cursos incluyen fichas de producción por clase con una demostración, una práctica, un criterio de corrección y el guion del asistente. Los tiempos son estimaciones para la primera prueba.

| Curso | Clases | Trabajo que entrega el participante |
| --- | --- | --- |
| IA para tareas del negocio | 1 y 2 | Instrucción reutilizable, borrador revisado y respuesta a una consulta comercial. |
| Redes y publicidad con IA | 3 a 5 | Ficha de campaña, dos piezas adaptadas al canal y un calendario breve. |
| Una web simple para tu negocio | 6 a 8 | Página de una oferta con botón y formulario de consulta probado desde otro dispositivo. |
| Programación y automatización inicial | 9 a 12 | Planilla que recibe consultas y prueba de una regla de clasificación escrita en JavaScript. |

## Caso que acompaña al recorrido

**Panadería La Esquina** es un comercio ficticio de Mercedes. Ofrece pan integral de 500 g con retiro en el local, de lunes a sábado de 8 a 12. Al principio todavía está definiendo la promoción. En la clase 3 confirma una oferta de práctica de dos panes por $6.000, el sábado de 8 a 12, con 20 combos disponibles para retiro. Para evitar ambigüedad al redactar, en los ejercicios de publicación se usa **sábado 21 de noviembre de 2026**, una fecha ficticia de campaña fija que se puede reemplazar al reutilizar el material.

Se puede trabajar con este caso o adaptar los ejercicios a un negocio propio. En los ensayos de formulario y código usá nombres, contactos y mensajes inventados. Para los cursos que se toman por separado, entregá la ficha de la panadería junto con el insumo de ejemplo de la clase anterior. Por ejemplo, quien empiece por Web puede recibir la oferta ya definida y una publicación de muestra.

## Guion del asistente animado

La primera propuesta de personaje es **un señalador de cuaderno animado**. Tiene una silueta vertical azul petróleo, un corte en V y una cara sencilla. Puede inclinarse como si se asomara al borde de la actividad. El corte y la silueta deben reconocerse en tamaño chico, tanto en el aula como en el catálogo. En esta etapa, el texto visible es **Tu guía**.

Una misma colección de gestos sirve para todos los cursos. El docente escribe el contenido de cada aparición y elige el gesto. El alumno puede abrir, cerrar u ocultar al asistente. Cada gesto se reproduce una vez por intervención y la ayuda se mantiene disponible en texto con movimiento reducido. [W3C sobre animación y accesibilidad](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions)

| Gesto | Cuándo aparece | Qué hace el personaje |
| --- | --- | --- |
| Asomarse | Primera entrada a una clase o saludo al retomar. | Sube un poco y se inclina hacia el área de trabajo. |
| Escuchar | El alumno abre la ayuda. | Se endereza y hace un parpadeo breve. |
| Señalar | El alumno pide una pista o un ejemplo. | Se inclina hacia el elemento pertinente y vuelve al reposo. |
| Asentir | Comprueba un criterio concreto después de un intento. | Hace un movimiento corto hacia abajo y vuelve al reposo. |
| Pausar | La respuesta requiere revisar un dato o consultar al docente. | Queda en reposo y muestra una indicación breve. |

**Saludo inicial.** «Hola, soy tu guía. Elegí un curso y, cuando lo necesites, podés abrir la ayuda de la clase». Si hay un curso en marcha, usar el punto de avance real. «¿Seguimos con el formulario de consultas o querés ver tus cursos?». Ofrecé los botones **Retomar clase** y **Ver mis cursos**. Si se cerró el saludo, vuelve a aparecer al abrir el asistente.

**Qué guardar al escribir cada clase.** Momento en que aparece, frase exacta, gesto, botón o acción disponible y condición de cierre. Para cada práctica, preparar una pista amplia y otra específica. En el reto individual, mostrar el resultado al entregar. Cuando la ayuda pasa a texto libre, el asistente consulta el material aprobado de esa clase. Si la pregunta excede ese material, ofrece **Consultar al docente**.

## Curso 1 IA para tareas del negocio

### Clase 1 Pedirle a la IA un borrador que puedas revisar

**Resultado de aprendizaje.** Al terminar, podés escribir una instrucción para crear un aviso breve, distinguir qué datos estaban confirmados y decidir qué debe revisar el negocio. Duración estimada de 20 minutos. Podés cursar con un asistente de IA o usar las respuestas de ejemplo que están incluidas.

#### Apertura y demostración en 6 minutos

> Tenemos que anunciar el pan integral de la panadería. Probamos pedirle a la IA «Hacé una promoción para la panadería». Una respuesta posible es «¡Aprovechá el 2×1 en pan integral hasta el viernes!». Suena lista para publicar. La panadería había confirmado el producto, el peso, el horario y la forma de retiro. La oferta y la fecha del supuesto descuento quedaron pendientes.
>
> Para mejorar el pedido, indicá qué querés, dónde se va a usar y con qué datos puede trabajar. También podés decirle cómo querés ver la respuesta y qué tiene que hacer cuando le falta información. Después compará el borrador con la ficha del negocio, línea por línea.

**Pedido para copiar y adaptar**

> Escribí un borrador de hasta 45 palabras para Instagram de Panadería La Esquina. Usá un tono cercano. El negocio confirmó pan integral de 500 g y retiro en el local de lunes a sábado de 8 a 12. Incluí una invitación a consultar disponibilidad. Usá únicamente los datos confirmados. Si hace falta un dato, escribí la pregunta debajo del borrador en una línea aparte.

**Respuesta de muestra.** «¿Buscás pan integral? Tenemos pan integral de 500 g para retirar en el local de lunes a sábado, de 8 a 12. Consultanos por disponibilidad». Si el negocio quiere comunicar un descuento, en la nota aparte corresponde pedir el beneficio y su vigencia exacta.

#### Práctica guiada en 8 minutos

1. Leé el primer borrador y marcá qué partes están respaldadas por la ficha. El producto sí. El 2×1 y el viernes como vencimiento de una oferta quedan pendientes.
2. Reescribí la instrucción con tus palabras. Pedí un canal, una extensión y una acción para quien lee. Indicá dónde querés que aparezcan las preguntas sobre datos pendientes.
3. Generá un borrador o trabajá con la respuesta de muestra. Subrayá cada dato verificable y comparalo con la ficha. Corregí lo que haga falta antes de marcarlo como listo para revisión.

| Momento | Lo que dice Tu guía | Gesto y acción |
| --- | --- | --- |
| Entrada | «Hoy vas a preparar un aviso y revisar si se puede publicar. Abrí el ejemplo para empezar». | Asomarse. **Ver el ejemplo**. |
| Primera ayuda | «Buscá en la ficha la información que apareció en el anuncio. ¿Qué parte del mensaje no encontrás?». | Señalar la ficha. **Otra pista**. |
| Segunda ayuda | «La ficha habla de pan integral y del retiro. ¿Quién puede confirmar el 2×1 y el día en que termina?». | Señalar el borrador. **Volver a la actividad**. |
| Después de corregir | «Dejaste el producto y el horario respaldados. La oferta queda como una pregunta para el comercio». | Asentir cuando la revisión cumple esos criterios. **Ir al reto**. |

#### Reto individual en 6 minutos

**Situación.** Bicicletería Rueda Sur recibe bicicletas para una revisión de frenos el jueves de 15 a 18, con turno previo. El precio está pendiente. La IA produjo el borrador «Revisión de frenos gratis este jueves, vení cuando quieras».

**Entrega.** Escribí una instrucción para preparar un mensaje de WhatsApp y un borrador de hasta 45 palabras. Agregá debajo la pregunta que le harías al negocio sobre el dato pendiente.

**Criterios de corrección.** La instrucción restringe el borrador a los datos confirmados. El mensaje incluye revisión de frenos, jueves de 15 a 18 y turno previo. El precio queda fuera del aviso y aparece como pregunta para el negocio. Un borrador posible es «Este jueves de 15 a 18 hacemos revisiones de frenos con turno previo. Escribinos para consultar los horarios disponibles». Podés preguntarle al negocio «¿Cuál es el precio de la revisión?».

**Asistente después de entregar.** Si todavía falta el turno previo, señala el dato con «El horario está bien. Volvé a mirar cómo se reserva la revisión». Si aprueba, asiente una vez y dice «El aviso conserva el horario y el turno. Ya podés usar este formato para otra tarea». Durante el reto queda visible la consigna y se muestra la devolución al enviar.

### Clase 2 Responder una consulta y guardar una instrucción reutilizable

**Resultado de aprendizaje.** Al terminar, podés transformar una consulta en un borrador, revisar compromisos comerciales y guardar un pedido que otra persona del equipo pueda usar. Duración estimada de 20 minutos.

#### Apertura y demostración en 6 minutos

> La panadería recibe el mensaje «¿Me pueden guardar dos panes para el sábado? ¿Hacen envíos?». Sabemos que trabajan con retiro en el local de 8 a 12. Falta confirmar el stock y todavía no sabemos si ofrecen envíos. La respuesta puede orientar al cliente y dejar pendiente lo que debe decidir el equipo.

**Instrucción de ejemplo**

> Prepará una respuesta breve y amable para WhatsApp. La consulta es «¿Me pueden guardar dos panes para el sábado? ¿Hacen envíos?». El negocio confirmó que el retiro en el local es de 8 a 12. La reserva y los envíos requieren confirmación del equipo. Escribí primero el mensaje para el cliente y después, en una nota interna aparte, qué tiene que revisar el equipo antes de enviarlo.

**Mensaje de muestra.** «¡Hola! Podés retirar en el local de 8 a 12. Vamos a consultar si hay dos panes para reservar el sábado y si podemos coordinar un envío. Te confirmamos por acá».

**Nota interna.** Verificar stock del sábado y si corresponde ofrecer envío. En el ejercicio, el equipo revisa ambos puntos. Si solo confirma el stock, puede confirmar la reserva y dejar el envío pendiente.

#### Práctica guiada en 8 minutos

1. Reemplazá la consulta por «¿Aceptan transferencia? ¿Me lo pueden entregar antes de las 9?». Para este ejercicio, el negocio confirmó que acepta transferencia. El horario de entrega queda pendiente.
2. Escribí un mensaje para el cliente y la nota interna. Marcá cualquier promesa sobre precio, pago, stock, horario o entrega y revisá si está respaldada por el escenario.
3. Guardá una instrucción con los campos editables `[tipo de consulta]`, `[datos confirmados]`, `[datos para revisar]`, `[canal]` y `[formato de salida]`. Usá esa instrucción en el reto siguiente.

**Respuesta esperada.** «¡Hola! Sí, aceptamos transferencia. Déjanos consultar el horario de entrega y te confirmamos si puede ser antes de las 9». En la nota interna alcanza con escribir «Consultar si el negocio puede entregar antes de las 9».

| Momento | Lo que dice Tu guía | Gesto y acción |
| --- | --- | --- |
| Entrada | «El cliente necesita una respuesta clara. Primero veamos qué puede confirmar hoy el negocio». | Asomarse. **Leer la consulta**. |
| Primera ayuda | «Subrayá cualquier frase que comprometa un pago, un horario o una entrega. ¿Qué dato te permite sostenerla?». | Señalar el mensaje. **Otra pista**. |
| Segunda ayuda | «La transferencia está confirmada. Dejá que el equipo consulte el horario de entrega y decile al cliente qué va a pasar después». | Señalar la ficha. **Editar respuesta**. |
| Al comprobar | «El cliente ya sabe qué puede hacer y el equipo sabe qué tiene que verificar». | Asentir cuando ambos textos cumplen su función. **Guardar instrucción**. |

#### Reto individual en 6 minutos

**Situación.** La clienta pregunta «¿Puedo retirar después de las 12? ¿Se cambia una compra?». El retiro confirmado es de 8 a 12. El comercio todavía debe consultar si puede ofrecer una excepción y cuál es su política de cambios.

**Entrega y corrección.** Presentá el mensaje al cliente y la nota al equipo. El mensaje informa el horario habitual y comunica que consultará los dos puntos antes de comprometer una respuesta. La nota identifica el retiro excepcional y la política de cambios. Un mensaje posible es «¡Hola! El horario habitual de retiro es de 8 a 12. Voy a consultar si podemos coordinar otro horario y cuáles son las condiciones de cambio. Te confirmo por acá».

**Asistente después de entregar.** Si se afirmó una política que falta verificar, pausa y dice «La política de cambios todavía necesita revisión. Ubicá esa consulta en la nota al equipo». Si aprueba, asiente y dice «La respuesta orienta al cliente y deja las dos decisiones en manos del equipo».

## Curso 2 Redes y publicidad con IA

### Clase 3 Definir qué tiene que lograr una publicación

**20 minutos estimados.** Al terminar, entregás una ficha de campaña que otro integrante del equipo pueda usar.

**Demostración.** La panadería quiere recibir reservas de 20 combos para retirar el sábado. El público son personas de Mercedes que pueden acercarse al local. Una publicación explica la oferta y termina con una acción concreta. «Reservá por mensaje» es una acción que el equipo puede reconocer y contar. En el curso Web se reemplazará por el enlace del formulario de prueba.

**Práctica.** Completá la ficha con objetivo, público, oferta confirmada, fecha y horario, canal, acción y dato a medir. Para el caso de muestra, anotá cuántas reservas confirmadas llegaron por la publicación. Diferenciá una consulta de una reserva confirmada. En un caso nuevo de pan de campo con 12 unidades, redactá una ficha con una sola acción y la cantidad real disponible.

**Corrección.** Se puede identificar una oferta válida, la fecha, el medio, la acción pedida y cómo contar su resultado. Si falta la vigencia, el alumno la deja como dato pendiente.

**Tu guía.** Al empezar, se asoma y dice «Elegí qué querés que haga la persona al ver la publicación». Para dar la primera pista, señala el objetivo y pregunta «¿Qué te gustaría que haga alguien después de verla?». En la segunda pista dice «Si esperás un mensaje como “Quiero reservar un combo”, escribí en la ficha dónde lo vas a recibir y qué vas a contar». Tras aprobar, asiente y dice «Ya tenés una acción que el equipo puede registrar». Botones **Ver ficha**, **Dame una pista** y **Seguir**.

### Clase 4 Crear una pieza para publicar y una para enviar

**25 minutos estimados.** Al terminar, entregás un borrador para Instagram y un mensaje de WhatsApp con los mismos datos comerciales.

**Demostración.** Para una publicación, la imagen puede mostrar «2 panes integrales por $6.000» y el texto completar la fecha, el horario y la reserva. En WhatsApp, se puede reunir toda la información en un mensaje. Un mensaje posible es «Este sábado 21 de noviembre, 2 panes integrales por $6.000. Retiro de 8 a 12. Hay 20 combos disponibles. Escribinos para reservar». Una foto propia o autorizada ayuda a que la persona reconozca el producto.

**Práctica.** Pedile a la IA dos versiones a partir de la ficha. Armá una pieza legible en celular con nombre del producto y oferta, y escribí el pie de publicación. Prepará la versión de WhatsApp. Intercambiá una de las piezas con otra persona para que te diga qué se ofrece, para cuándo y cómo pedirlo.

**Corrección.** Ambas piezas conservan la oferta y su vigencia. Se entiende cómo reservar. El texto se puede leer en el celular y el dato principal aparece también en texto accesible.

**Tu guía.** Se asoma y dice «Vamos a contar la misma oferta en dos canales». Para dar la primera pista, señala la pieza y dice «Abrila en el celular. ¿Se leen la oferta y la acción sin hacer zoom?». En la segunda pista dice «Si la fecha quedó solo en la imagen, agregala al pie de la publicación. Repetí la fecha al redactar el mensaje de WhatsApp». Al aprobar, asiente y dice «Los datos coinciden y las dos versiones indican cómo reservar». Botones **Ver las dos versiones**, **Revisar** y **Guardar**.

### Clase 5 Planificar la difusión y leer el resultado

**20 minutos estimados.** Al terminar, entregás un calendario de tres publicaciones y una decisión basada en los datos del ejemplo.

**Demostración.** Proponé un anuncio el miércoles, un recordatorio el viernes y una actualización de disponibilidad el sábado. En el caso de práctica, hubo 100 clics, 12 consultas y 5 reservas confirmadas. Para el objetivo de la campaña, el equipo informa 5 reservas y registra por separado las consultas. Los clics sirven para observar cuánta gente abrió el enlace.

**Práctica.** Armá tres filas con día, propósito, canal, responsable y dato de seguimiento. En el ejercicio, 7 consultas quedaron abiertas. Proponé una modificación verificable para el próximo envío, por ejemplo destacar el horario de retiro, y anotá qué dato compararías.

**Corrección.** El calendario dice quién revisa cada acción y respeta la vigencia. El alumno identifica las reservas como resultado y propone probar un cambio concreto.

**Tu guía.** Se asoma y dice «Elegí cuándo anunciar, recordar y actualizar». Para dar la primera pista, señala el objetivo y dice «Buscá cuál de esos datos representa una reserva confirmada». En la segunda pista dice «Si alguien abrió el enlace y se fue, contalo como clic. Buscá ahora el número de personas cuya reserva quedó registrada». Al aprobar, asiente y dice «Quedó registrado qué vas a cambiar y qué número vas a mirar». Botones **Ver los datos** y **Revisar el calendario**.

## Curso 3 Una web simple para tu negocio

### Clase 6 Ordenar la página según lo que busca el cliente

**20 minutos estimados.** Al terminar, entregás un boceto de una página única orientada a la consulta.

**Demostración.** La cabecera contesta qué ofrece el negocio, para quién y cómo consultar. Para el boceto, usá el título «Pan integral en Mercedes», una frase con la oferta y un botón **Consultar por el combo**. Debajo van la vigencia, el retiro, el horario y las condiciones. Un visitante que llega desde Instagram puede entender la oferta sin conocer el negocio de antes.

**Práctica.** Dibujá o escribí el orden de las secciones. Poné junto a cada sección la pregunta que responde. En la versión para un comercio de reparación de bicicletas, incluí un título, detalles del servicio y un botón que indique qué pasa al tocarlo.

**Corrección.** La parte inicial identifica el negocio o la oferta, el texto del botón anticipa la acción y los datos necesarios aparecen antes de la consulta.

**Tu guía.** Se asoma y dice «Imaginá que alguien llega desde una publicación y tiene un minuto para decidir». Para dar la primera pista, señala el comienzo y pregunta «¿Qué le dirías primero a esa persona si estuviera frente al mostrador?». En la segunda pista dice «Leé el botón solo. ¿La persona entiende que va a abrir una consulta por el combo?». Al aprobar, asiente y dice «La oferta se entiende y el camino para consultar está a la vista». Botones **Ver el boceto**, **Pedir ayuda** y **Guardar**.

### Clase 7 Construir y previsualizar la página

**30 minutos estimados.** Al terminar, entregás un borrador funcional con texto, imagen y acceso al canal de consultas.

**Demostración.** En computadora, creá un sitio de práctica en Google Sites, agregá las secciones del boceto, usá un botón con texto descriptivo y revisá la vista para celular. Para el piloto, el botón puede apuntar al formulario de prueba que facilita el docente. Podés reemplazarlo por el propio en la próxima clase. [Google Sites sobre creación de sitios](https://support.google.com/sites/answer/6372878?hl=es-419) · [Vista previa y publicación](https://support.google.com/sites/answer/6372880?hl=es)

**Práctica.** Armá la página de la panadería. Incluí el nombre del producto, la oferta, los detalles del retiro y el botón. Agregá texto alternativo a la foto si aporta información. En vista móvil, probá el botón, revisá que el horario quede completo y comprobá que la oferta se pueda leer sin ampliar.

**Corrección.** El borrador conserva los datos comerciales, el botón lleva al lugar esperado y el contenido se entiende en vista móvil. Si la cuenta tiene bloqueado Google Sites, la evidencia de esta clase puede ser un boceto navegable o una maqueta con el enlace de destino y capturas de la vista móvil.

**Tu guía.** Se asoma y dice «Llevá tu boceto a la página, una sección por vez». Para dar la primera pista, señala el botón y pregunta «¿Funciona el enlace de destino cuando lo abrís por separado?». En la segunda pista dice «Si el enlace funciona por separado, comparalo con la dirección que quedó guardada en el botón». Al aprobar, asiente y dice «La oferta se lee y el botón abre el destino previsto». Botones **Ver pasos** y **Probar enlace**.

### Clase 8 Probar el recorrido de consulta

**25 minutos estimados.** Al terminar, entregás una prueba documentada desde la página hasta el registro de una consulta.

**Demostración.** El formulario de práctica pide nombre inventado, correo de prueba y tipo de consulta (**Pedido**, **Consulta** u **Otro**) más un mensaje breve. Primero verificá el acceso del público de prueba al formulario y al sitio. Usá un enlace para responder, distinto del de edición. [Google sobre publicación y acceso a formularios](https://support.google.com/docs/answer/2839588?hl=es-419)

**Práctica.** Conectá el botón al formulario. Abrí el sitio de prueba desde un celular o una sesión distinta de la cuenta editora, según los permisos que configuraste. Enviá «Pedido · Quiero reservar dos panes» con el correo ficticio `cliente@example.com` y comprobá que el mensaje llega a las respuestas. Repetí con el botón en la vista de computadora.

**Corrección.** Una persona con el permiso previsto puede abrir la página, usar el botón y enviar el mensaje. El equipo puede encontrarlo. La evidencia incluye qué se probó, qué pasó y qué se corrigió.

**Tu guía.** Se asoma y dice «Hacé el recorrido como si quisieras reservar el combo». Para dar la primera pista, pausa y pregunta «¿Abriste el formulario como alguien que responde o como quien lo edita?». En la segunda pista dice «Copiá el vínculo para responder y probalo desde otra cuenta con el permiso previsto». Cuando aparece la respuesta, asiente y dice «La consulta llegó completa. Ahora podés organizar cómo se recibe». Botones **Ver pasos de prueba** y **Verificar la llegada**.

## Curso 4 Programación y automatización inicial

### Clase 9 Pasar del formulario a una planilla de seguimiento

**25 minutos estimados.** Al terminar, entregás una planilla que recibe respuestas y un paso claro para que una persona las atienda.

**Demostración.** El ingreso es el envío del formulario. El registro es una nueva fila en la planilla vinculada. El seguimiento es la revisión por parte del equipo. En Formularios de Google, usá **Respuestas** para vincular una hoja de cálculo nueva o existente. [Google sobre el destino de las respuestas](https://support.google.com/docs/answer/2917686?hl=es-419)

**Práctica.** Enviá tres consultas de prueba, una por tipo. Registrá hora, tipo y mensaje como columnas de entrada. En otra pestaña podés llevar estado y responsable. Comprobá que una cuarta consulta genera una fila nueva y que el formulario y la planilla tienen los accesos esperados.

**Corrección.** La cuarta respuesta se registra sin volver a escribirla en la planilla. El alumno identifica quién la revisa y dónde anota el estado.

**Tu guía.** Se asoma y dice «Primero vamos a lograr que la consulta llegue a su lugar». Para dar la primera pista, señala el paso previo y pregunta «¿La respuesta entró al formulario? Buscala ahí». En la segunda pista dice «Si está en Respuestas, abrí la planilla desde el propio formulario. Puede que hayas abierto otra copia». Al aprobar, asiente y dice «La consulta quedó registrada. El paso siguiente es decidir a quién corresponde». Botones **Ver el recorrido** y **Comprobar una fila**.

### Clase 10 Escribir una regla con una condición

**25 minutos estimados.** Al terminar, entregás una función que asigna un destino para cada tipo de consulta.

**Demostración.** Una función recibe un valor y devuelve otro. Leé la función del anexo en voz alta. Cuando el tipo es `pedido`, devuelve `Ventas`. Para `consulta`, devuelve `Atención`. El resto pasa a `Revisión manual`. `if` significa «si se cumple esta condición» y `return` indica qué resultado devuelve. [MDN sobre condiciones en JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/if...else)

**Práctica.** Abrí el código del anexo en un editor de JavaScript con consola. Antes de ejecutar, anotá qué esperás para `Pedido`, `Consulta` y `Otro`. Cambiá únicamente el resultado de `Consulta` a `Mostrador` y ejecutá las tres entradas de nuevo.

**Corrección.** `Pedido` sigue dando `Ventas`, `Consulta` devuelve `Mostrador` y `Otro` conserva `Revisión manual`. El alumno explica qué condición lleva a cada resultado.

**Tu guía.** Se asoma y dice «Antes de ejecutar, anticipá qué ruta va a tomar cada consulta». Para dar la primera pista, señala el código y pregunta «¿Qué valor compara cada condición?». En la segunda pista dice «Buscá el `return` dentro del bloque de `consulta`. Cambiá el destino que devuelve ese bloque y repetí las tres pruebas». Al aprobar, asiente y dice «Cambiaste el destino de consultas y las otras dos rutas siguen funcionando». Botones **Ver el código** y **Pedir una pista**.

### Clase 11 Probar errores y datos incompletos

**20 minutos estimados.** Al terminar, entregás una tabla con entradas esperadas, casos límite y resultados reales.

**Demostración.** La primera línea de la función quita espacios al principio y al final y convierte el texto a minúsculas. Usá ` Pedido ` para mostrar por qué sirve. Probar solo casos que sabemos que funcionan deja sin revisar entradas como el texto vacío o un tipo nuevo.

**Práctica.** Probá ` PEDIDO `, `Consulta`, `Otro`, `''` y `Devolución`. Anotá el resultado esperado y el real. Usá la IA, si la tenés disponible, para pedir un caso adicional y explicá por qué lo incluirías. En el código, agregá una prueba para `null` y confirmá qué pasa.

**Corrección.** ` PEDIDO ` llega a Ventas. `Consulta` llega a Atención o Mostrador, según la versión que dejó el alumno. Los otros casos pasan a Revisión manual. Si el resultado difiere, el alumno anota qué cambió y vuelve a ejecutar los casos.

**Tu guía.** Se asoma y dice «Probá también entradas que alguien puede escribir por error». Para dar la primera pista, señala el caso vacío y pregunta «¿Quién debería leer una consulta que llegó sin categoría?». En la segunda pista dice «Si el valor no coincide con ninguna condición, buscá el último `return` de la función». Al aprobar, asiente y dice «Encontraste una salida para los casos que requieren revisión». Botones **Ver casos** y **Repetir pruebas**.

### Clase 12 Integrar la campaña y demostrar que podés mantenerla

**30 minutos estimados.** Al terminar, entregás una entrega con la prueba completa y un cambio realizado por el participante.

**Demostración.** Abrí la publicación que preparaste, seguí su enlace a la web, enviá una consulta de práctica y buscala en la planilla. Usá el tipo de esa consulta como entrada de la función en el editor de práctica. La planilla recibe las respuestas por su conexión con el formulario. La clasificación JavaScript se ejecuta en el editor del curso.

**Práctica.** Entregá la publicación, un enlace o capturas de la web, el registro de una consulta y la tabla de pruebas del código. Después actualizá la fecha y el horario de la oferta en la web y en la publicación. También cambiá el destino de `Pedido` a `Reservas`. Volvé a comprobar el botón, la llegada de una consulta y los tres destinos. Quien haga solo este curso recibe una publicación y página de muestra del docente.

**Corrección.** La oferta coincide en los canales. El botón llega al formulario y el envío genera una fila. `Pedido` devuelve `Reservas`, `Consulta` conserva el destino de la versión anterior y `Otro` llega a Revisión manual. El participante explica dónde haría el próximo cambio para que otro integrante pueda mantenerlo.

**Tu guía.** Se asoma y dice «Hacé el recorrido completo y guardá una evidencia de cada paso». La ayuda durante el reto da acceso a la consigna. Después de entregar, si el botón falla, pausa y dice «La prueba se cortó al abrir la consulta. Revisá el enlace desde una cuenta que no edite la página». Si falla la clasificación, señala la prueba y dice «Compará el tipo que figura en la fila con el que ingresaste al ejecutar el código». Si aprueba, asiente y dice «Actualizaste la promoción y verificaste que el circuito sigue funcionando». Botones **Ver consigna** y **Entregar pruebas**.

## Anexo de programación para copiar y probar

Pegá el código completo en un editor de JavaScript con consola y ejecutalo. En la clase 10, cambiá el destino de una condición. En la 11, agregá entradas de prueba. Las comillas alrededor de cada valor indican que es texto. El valor `null` representa una entrada ausente.

```javascript
function asignarDestino(tipo) {
  const categoria = String(tipo ?? '').trim().toLowerCase();

  if (categoria === 'pedido') {
    return 'Ventas';
  }

  if (categoria === 'consulta') {
    return 'Atención';
  }

  return 'Revisión manual';
}

for (const tipo of ['Pedido', 'Consulta', 'Otro', ' PEDIDO ', '', 'Devolución']) {
  console.log(JSON.stringify(tipo), '→', asignarDestino(tipo));
}
```

## Cómo hacer la primera prueba con comercios

1. Usá las clases 1 y 2 con un grupo chico de personas que hoy redacten avisos o respondan consultas. Mostrales el asistente con los gestos del guion y ofrecé la misma ayuda en texto. Pediles que hagan el primer reto con el caso ficticio y que guarden el segundo ejercicio para aplicarlo a una tarea real de su negocio.
2. Observá si pueden empezar la práctica por su cuenta, qué pistas usan, qué datos se les escapan y si pueden resolver el reto nuevo después de la práctica. La pauta de la clase 1 exige una instrucción que limite los datos, un borrador que conserve el turno y una pregunta por el precio.
3. Al terminar, pediles que muestren una tarea que puedan hacer ahora con la plantilla y una que todavía dependa de alguien más. Usá esas respuestas para elegir los casos de Redes, Web y Programación que más les sirvan a los comercios.

**Pregunta sobre el personaje.** «¿En qué momento te sirvió abrir la ayuda?». Pediles después que lo describan sin mirar la pantalla. Las respuestas sirven para ajustar el momento de aparición, el gesto y qué rasgos del personaje conviene mantener.
