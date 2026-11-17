/*
 * Contenido de las páginas legales (HU-ADM-14: publicar términos, condiciones y políticas).
 * Texto DEMOSTRATIVO para el prototipo: no constituye asesoría legal ni compromete a ninguna empresa real.
 * Cada sección: { h: título, p: [párrafos], ul: [viñetas] }.
 */

export const POLICY_UPDATED = '1 de noviembre de 2026';

export const POLICIES = {
    terms: {
        short: 'Términos y Condiciones',
        h1: 'Política / Términos y Condiciones',
        hero_title: 'TÉRMINOS Y CONDICIONES',
        hero_body: 'Reglas generales de uso del sitio y de compra en Pixel Gamers, tienda online y sucursales físicas.',
        sections: [
            { h: '1. Aceptación', p: ['Al navegar, registrarte o comprar en Pixel Gamers aceptas estos términos. Si no estás de acuerdo, te pedimos no utilizar el sitio. Podemos actualizarlos; la versión vigente es la publicada aquí, con su fecha de actualización.'] },
            { h: '2. Cuenta de usuario', p: ['Para comprar debes crear una cuenta con datos verdaderos. Eres responsable de mantener la confidencialidad de tu contraseña y de la actividad realizada con tu cuenta.'], ul: ['Debes ser mayor de 18 años o contar con autorización de un adulto responsable.', 'Podemos suspender cuentas con actividad fraudulenta o que incumplan estos términos.', 'Las cuentas del personal usan roles y doble factor de autenticación.'] },
            { h: '3. Precios y pagos', p: ['Todos los precios están expresados en pesos chilenos (CLP) e incluyen IVA (19 %). El precio válido es el mostrado al momento de confirmar el pago.'], ul: ['Aceptamos tarjetas de crédito, débito y billeteras habilitadas en el checkout.', 'Si el pago es rechazado, el pedido no se genera y el stock reservado se libera.', 'El carrito reserva tus productos durante 15 minutos.'] },
            { h: '4. Productos físicos y digitales', p: ['Vendemos juegos físicos, consolas, accesorios y claves digitales. Las claves se entregan por correo y quedan resguardadas cifradas en tu bóveda digital dentro de tu cuenta.'], ul: ['Verifica la región de tu consola antes de comprar un juego digital: algunas claves son específicas por región.', 'Una clave digital es de uso único y no puede transferirse una vez canjeada.'] },
            { h: '5. Disponibilidad', p: ['El stock mostrado es referencial y se actualiza en tiempo real entre tienda online y sucursales. En casos excepcionales (error de inventario o de precio) podemos cancelar el pedido y reembolsar íntegramente lo pagado.'] },
            { h: '6. Propiedad intelectual', p: ['Marcas, carátulas y títulos de videojuegos pertenecen a sus respectivos titulares y se muestran con fines informativos. Las ilustraciones pixel-art del sitio son de uso exclusivo de Pixel Gamers.'] },
            { h: '7. Ley aplicable', p: ['Estos términos se rigen por la legislación chilena, en particular la Ley N° 19.496 sobre Protección de los Derechos de los Consumidores. Ante cualquier discrepancia puedes acudir al SERNAC o a los tribunales competentes.'] },
        ],
    },

    guarantee: {
        short: 'Garantía',
        h1: 'Política / Términos de Garantía',
        hero_title: 'POLÍTICA DE GARANTÍA',
        hero_body: 'Cómo protegemos tu compra: plazos, coberturas y cómo hacer válida la garantía de productos físicos y digitales.',
        sections: [
            { h: 'Garantía legal', p: ['Todos los productos físicos nuevos cuentan con garantía legal de 6 meses desde la fecha de compra, según la Ley N° 19.496. Si el producto presenta fallas de fabricación puedes optar entre su reparación gratuita, su reposición o la devolución del dinero.'] },
            { h: 'Qué cubre', ul: ['Fallas de fabricación en consolas, controles, periféricos y accesorios.', 'Discos o cartuchos que no leen o vienen defectuosos de fábrica.', 'Productos que no corresponden a lo comprado (modelo, edición o color).'] },
            { h: 'Qué no cubre', ul: ['Daños por golpes, caídas, líquidos, uso indebido o manipulación por terceros.', 'Desgaste natural, rayas o roturas posteriores a la entrega.', 'Productos con sellos de garantía alterados o números de serie ilegibles.'] },
            { h: 'Cómo hacerla efectiva', p: ['Presenta tu boleta (digital o impresa) en cualquiera de nuestras sucursales o solicita el retiro por courier desde tu cuenta. Nuestro equipo evaluará el producto y te informará la resolución, normalmente en un plazo máximo de 10 días hábiles.'], ul: ['Lleva el producto con su caja, accesorios y boleta o folio de compra.', 'Si el producto se repone, la garantía se renueva por el nuevo ítem.'] },
            { h: 'Juegos digitales', p: ['Si la clave entregada resulta inválida, ya utilizada o inactiva, la reemplazamos de inmediato por otra válida o te reembolsamos el total. Escríbenos desde Contacto indicando tu número de orden.'] },
        ],
    },

    shipping: {
        short: 'Envíos',
        h1: 'Política / Términos de Envío',
        hero_title: 'POLÍTICA DE ENVÍOS',
        hero_body: 'Tiempos de entrega, costos de despacho, retiro en tienda y cobertura de nuestras opciones de envío.',
        sections: [
            { h: 'Opciones de entrega', ul: ['Despacho a domicilio con courier asociado, con número de seguimiento.', 'Retiro gratis en sucursal (Mallplaza Tobalaba, Costanera Center o Arauco Maipú).', 'Juegos digitales: entrega inmediata por correo electrónico y en tu bóveda digital.'] },
            { h: 'Tiempos y costos', p: ['El costo y el plazo se calculan en el checkout según tu comuna. Como referencia, en la Región Metropolitana el despacho toma entre 1 y 3 días hábiles; en regiones, entre 3 y 7 días hábiles.', 'Los despachos comienzan una vez confirmado el pago y preparado el pedido en bodega.'] },
            { h: 'Seguimiento', p: ['Cuando tu pedido sale de bodega recibirás un correo con el número de seguimiento. Puedes consultar el estado en la sección Seguimiento ingresando ese código.'], ul: ['Estados: preparando, despachado, en tránsito y entregado.', 'Si el courier no logra entregar tras dos intentos, el pedido vuelve a sucursal y te contactamos.'] },
            { h: 'Retiro en tienda', p: ['Cuando tu pedido esté listo recibirás un código QR. Presenta el QR y tu cédula de identidad en la sucursal elegida; quien retire firmará la recepción. Tienes 7 días para retirar antes de que el pedido se devuelva al stock.'] },
            { h: 'Cobertura', p: ['Realizamos despachos a todo Chile continental. Para zonas extremas el plazo puede ampliarse; lo verás reflejado en la cotización antes de pagar.'] },
        ],
    },

    changes: {
        short: 'Cambios',
        h1: 'Política / Términos de Cambios',
        hero_title: 'POLÍTICA DE CAMBIOS',
        hero_body: 'Condiciones para cambiar juegos físicos, consolas o accesorios por otro producto o talla/edición.',
        sections: [
            { h: 'Plazo', p: ['Puedes solicitar un cambio dentro de 10 días corridos desde la compra, presentando la boleta original (se valida escaneando el folio).'] },
            { h: 'Condiciones del producto', ul: ['Debe estar sin uso, en su empaque original, con sellos y todos los accesorios.', 'Los discos o cartuchos con sello roto no tienen cambio, salvo falla de fábrica (ver Garantía).', 'Los productos en oferta final o liquidación podrán indicar “sin cambio” en su ficha.'] },
            { h: 'Cómo cambiar', p: ['Acércate a cualquier sucursal con tu producto y tu boleta. Si el nuevo producto cuesta menos, emitimos una nota de crédito por la diferencia; si cuesta más, pagas solo la diferencia.'] },
            { h: 'Juegos digitales', p: ['Las claves digitales no admiten cambio una vez reveladas, enviadas o canjeadas, ya que no pueden volver a ponerse a la venta.'] },
        ],
    },

    returns: {
        short: 'Devoluciones',
        h1: 'Política / Términos de Devoluciones',
        hero_title: 'POLÍTICA DE DEVOLUCIONES',
        hero_body: 'Pasos y requisitos para solicitar el reembolso de tu dinero, incluyendo el derecho a retracto en compras online.',
        sections: [
            { h: 'Derecho a retracto (compras online)', p: ['En compras realizadas por internet tienes 10 días corridos desde la recepción del producto para retractarte, siempre que no esté usado y conserve su embalaje original (Art. 3 bis, Ley N° 19.496).'] },
            { h: 'Cómo solicitar una devolución', ul: ['Ingresa a Mi cuenta → Historial de pedidos, o escríbenos desde Contacto con tu número de orden.', 'Te indicaremos si debes llevar el producto a una sucursal o coordinar el retiro por courier.', 'Recibido y revisado el producto, aprobamos el reembolso.'] },
            { h: 'Reembolso', p: ['El dinero se devuelve por el mismo medio de pago utilizado, en un plazo de hasta 10 días hábiles desde la aprobación. En compras en tienda podemos emitir nota de crédito si lo prefieres.'], ul: ['Se reembolsa el valor del producto; el despacho solo si el producto llegó con falla o equivocado.', 'Puntos gamer asociados a la compra se descuentan de tu saldo.'] },
            { h: 'Juegos digitales', p: ['No se aceptan devoluciones de juegos digitales cuya clave ya haya sido revelada o enviada, porque el contenido queda disponible para su uso inmediato. Si la clave es inválida o duplicada, tienes derecho a reemplazo o reembolso completo.'] },
        ],
    },

    privacy: {
        short: 'Privacidad',
        h1: 'Política / Términos de Privacidad',
        hero_title: 'POLÍTICA DE PRIVACIDAD',
        hero_body: 'Cómo Pixel Gamers recopila, usa y protege tus datos personales, y cuáles son tus derechos sobre ellos.',
        sections: [
            { h: 'Datos que recopilamos', ul: ['Identificación: nombre, RUT, correo y teléfono.', 'Entrega: dirección y comuna.', 'Compra: historial de pedidos, boletas y claves digitales adquiridas.', 'Uso: preferencias y datos técnicos del navegador.'] },
            { h: 'Para qué los usamos', ul: ['Procesar pagos, despachar pedidos y emitir boletas.', 'Entregar claves digitales y dar soporte.', 'Enviar novedades y promociones solo si te suscribes (puedes darte de baja en un clic).', 'Prevenir fraudes y proteger la seguridad de la plataforma.'] },
            { h: 'Cómo los protegemos', p: ['Las contraseñas se almacenan con hash, las claves digitales se guardan cifradas (AES-256) y los accesos del personal se rigen por roles, doble factor y un registro de auditoría inmutable. Los datos de tarjeta son procesados por la pasarela de pago y nunca se almacenan en nuestros sistemas.'] },
            { h: 'Con quién los compartimos', p: ['Solo con proveedores necesarios para operar: pasarela de pago, couriers y servicio de correo. No vendemos tus datos a terceros.'] },
            { h: 'Tus derechos', p: ['Conforme a la legislación chilena de protección de datos personales puedes acceder, rectificar, cancelar u oponerte al tratamiento de tus datos. Puedes editar tu perfil en Mi cuenta o escribirnos desde Contacto para ejercer estos derechos.'] },
        ],
    },

    cookies: {
        short: 'Cookies',
        h1: 'Política / Términos de Cookies',
        hero_title: 'POLÍTICA DE COOKIES',
        hero_body: 'Qué cookies y almacenamiento local usamos en el sitio para mejorar tu experiencia, y cómo controlarlos.',
        sections: [
            { h: 'Qué son', p: ['Las cookies y el almacenamiento local son pequeños archivos que el navegador guarda para recordar información entre visitas.'] },
            { h: 'Las que usamos', ul: ['Esenciales: mantienen tu sesión, tu carrito y la reserva de 15 minutos.', 'Preferencias: recuerdan el tema claro/oscuro y tus filtros del catálogo.', 'Analíticas: miden de forma agregada qué secciones se visitan para mejorar el sitio.'] },
            { h: 'En este prototipo', p: ['El prototipo no utiliza cookies de terceros ni publicidad. Los datos de demostración se guardan únicamente en el almacenamiento local de tu navegador (clave pixelgamers.store.v1) y puedes borrarlos con “Reiniciar datos demo”.'] },
            { h: 'Cómo controlarlas', p: ['Puedes bloquear o eliminar cookies desde la configuración de tu navegador. Ten en cuenta que, si bloqueas las esenciales, funciones como el carrito o el inicio de sesión pueden dejar de funcionar.'] },
        ],
    },
};

export const POLICY_ORDER = ['terms', 'guarantee', 'shipping', 'changes', 'returns', 'privacy', 'cookies'];

/* ---------- Preguntas frecuentes ---------- */
export const FAQ = [
    {
        group: 'Compras y pagos',
        items: [
            { q: '¿Qué medios de pago aceptan?', a: 'Tarjetas de crédito y débito y billeteras habilitadas en el checkout. Todos los precios incluyen IVA.' },
            { q: '¿Por qué mi pago fue rechazado?', a: 'Puede deberse a fondos insuficientes, límites de la tarjeta o validación del banco. Si ocurre, no se genera el pedido y tu carrito se mantiene para que lo reintentes.' },
            { q: '¿Cuánto dura la reserva de mi carrito?', a: 'Reservamos tus productos durante 15 minutos. Pasado ese tiempo puedes renovar la reserva si aún hay stock.' },
            { q: '¿Cómo funcionan los puntos gamer?', a: 'Ganas 1 punto por cada $1.000 de compra. Verás tu saldo en Mi cuenta.' },
        ],
    },
    {
        group: 'Juegos digitales',
        items: [
            { q: '¿Cuándo recibo mi clave?', a: 'De inmediato tras confirmarse el pago: te la enviamos por correo y queda en tu bóveda digital.' },
            { q: '¿Cómo reviso mi clave?', a: 'Entra a Mi cuenta → Bóveda digital. Por seguridad, debes volver a ingresar tu contraseña para revelarla.' },
            { q: '¿Cómo canjeo la clave?', a: 'En la bóveda encontrarás la guía “¿Cómo canjear?” con los pasos para Steam, PlayStation, Xbox y Nintendo.' },
            { q: '¿Puedo devolver un juego digital?', a: 'No si la clave ya fue revelada o enviada. Si es inválida o duplicada, la reemplazamos o reembolsamos.' },
            { q: '¿Qué pasa si mi consola es de otra región?', a: 'Algunas claves son por región. Indica la región de tu consola en tu perfil y revisa la ficha del producto antes de comprar.' },
        ],
    },
    {
        group: 'Envíos y retiro',
        items: [
            { q: '¿Cuánto cuesta el despacho?', a: 'Se calcula en el checkout según tu comuna. El retiro en sucursal es gratis.' },
            { q: '¿Cómo sigo mi pedido?', a: 'Usa la sección Seguimiento con el código que te enviamos por correo, o entra a Mi cuenta → Historial de pedidos.' },
            { q: '¿Qué necesito para retirar en tienda?', a: 'Tu código QR y tu cédula de identidad. Quien retira firma la recepción.' },
        ],
    },
    {
        group: 'Garantía y devoluciones',
        items: [
            { q: '¿Cuánto dura la garantía?', a: '6 meses para productos físicos nuevos, según la ley chilena del consumidor.' },
            { q: '¿Puedo cambiar un producto?', a: 'Sí, dentro de 10 días con boleta, sin uso y en su empaque original.' },
            { q: '¿Tengo derecho a retracto?', a: 'En compras online tienes 10 días corridos desde la recepción para retractarte, con el producto sin uso.' },
        ],
    },
    {
        group: 'Cuenta y seguridad',
        items: [
            { q: '¿Cómo recupero mi contraseña?', a: 'Contáctanos con tu correo registrado y te ayudaremos a restablecerla de forma segura.' },
            { q: '¿Cómo me desuscribo del boletín?', a: 'Desde Mi cuenta → Perfil y preferencias, o con el enlace de desuscripción de cada correo.' },
            { q: '¿Mis datos están seguros?', a: 'Sí: contraseñas con hash, claves cifradas, roles de acceso y auditoría. Revisa nuestra Política de Privacidad.' },
        ],
    },
];

export const CONTACT_REASONS = ['Consulta general', 'Estado de mi pedido', 'Clave digital con problemas', 'Garantía, cambio o devolución', 'Reclamo o sugerencia', 'Ejercer derechos sobre mis datos'];
