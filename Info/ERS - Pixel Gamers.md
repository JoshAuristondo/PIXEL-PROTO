

INGENIERÍA DE REQUISITOS

Estrategia de digitalización e integración de inventario para tienda Pixel Gamers

Contenido

[**Ficha del documento	2**](#ficha-del-documento)

[**1\. Introducción	3**](#introducción)

[1.1 Propósito	3](#propósito)

[1.2 Ámbito del Sistema	3](#ámbito-del-sistema)

[1.3 Visión General del Documento	6](#visión-general-del-documento)

[**2\. Descripción General	7**](#descripción-general)

[2.1 Perspectiva del Producto	7](#2.1-perspectiva-del-producto)

[2.2 Funciones del Producto	8](#2.2-funciones-del-producto)

[2.3 Características de los Usuarios	9](#2.3-características-de-los-usuarios)

[**3\. Requisitos del Proyecto	10**](#requisitos-del-proyecto)

[3.1 Requisitos funcionales	10](#3.1-requisitos-funcionales)

[3.1.1 Requisito funcional: Gestión de Catálogo	10](#3.1.1-requisito-funcional:-gestión-de-catálogo)

[3.1.2 Requisito funcional: Sincronización de Stock	11](#3.1.2-requisito-funcional:-sincronización-de-stock)

[3.1.3 Requisito funcional: E-Commerce	11](#3.1.3-requisito-funcional:-e-commerce)

[3.1.4 Requisito funcional: Despacho Digital	12](#3.1.4-requisito-funcional:-despacho-digital)

[3.1.5 Requisito funcional: Logística Física	12](#3.1.5-requisito-funcional:-logística-física)

[3.1.6 Requisito funcional: Marketing & Alertas	13](#3.1.6-requisito-funcional:-marketing-&-alertas)

[3.2 Requisitos no funcionales	13](#3.2-requisitos-no-funcionales)

[3.2.1 Requisitos de rendimiento	13](#3.2.1-requisitos-de-rendimiento)

[3.2.2 Seguridad	14](#3.2.2-seguridad)

[3.2.3 Otros Requisitos	14](#3.2.3-otros-requisitos)

[**4\. Propuesta de Planificación	20**](#propuesta-de-planificación)

[4.1 Definición del Equipo de Trabajo	20](#4.1-definición-del-equipo-de-trabajo)

[4.2 Análisis Metodológico y Justificación del Marco de Trabajo	21](#4.2-análisis-metodológico-y-justificación-del-marco-de-trabajo)

[**5\. Definición de Historias de Usuario	22**](#5.-definición-de-historias-de-usuario)

[5.1 Historias de Usuario	22](#5.1-historias-de-usuario)

[5.1.1 Comprador	22](#5.1.1-comprador)

[5.1.2 Vendedor de Tienda	23](#5.1.2-vendedor-de-tienda)

[5.1.3 Administrador de Inventario	24](#5.1.3-administrador-de-inventario)

[**5.1.4 Administrador de negocio	26**](#5.1.4-administrador-de-negocio)

[**6\. Definición del Product Backlog Priorizado	28**](#6.-definición-del-product-backlog-priorizado)

[6.1 Product Backlog Priorizado	28](#6.1-product-backlog-priorizado)

[**7\. Refinamiento del Product Backlog	34**](#7.-refinamiento-del-product-backlog)

[7.1 Product Backlog Refinado	34](#7.1-product-backlog-refinado)

[**8\. Estimación de Esfuerzo de las Tareas	40**](#8.-estimación-de-esfuerzo-de-las-tareas)

[8.1 Estimación de Esfuerzo de las Tareas	40](#8.1-estimación-de-esfuerzo-de-las-tareas)

[**9\. Documentación de los eventos.	84**](#9.-documentación-de-los-eventos.)

# **Ficha del documento** {#ficha-del-documento}

| Fecha | Revisión | Autor | Modificación |
| :---: | :---: | :---: | :---: |
|  |  |  |  |
|  |  |  |  |

**Integrantes del Equipo:**

| Nombre Integrante del Equipo | Rol Definido |
| :---- | :---- |
| *Joshua Auristondo Gonzales* | *Product Owner* |
| *Catalina Larenas Jiménez* | *Scrum Master* |
| *Benjamín Zepeda Zuloaga* | *Developer Team* |
| *Javier Sepulveda Munoz* | *Developer Team* |

1. # **Introducción**  {#introducción}

   1. ## **Propósito** {#propósito}

El propósito de este documento es la Especificación de Requisitos de Software (ERS), definir rigurosamente las especificaciones técnicas, funcionales y operativas de la futura plataforma digital de la tienda “Píxel Gamers”. Considerando las necesidades y requisitos del negocio y diseñado para resolver de manera integral la problemática de descoordinación de inventarios y deficiencias transaccionales que afectan actualmente a la tienda y sus usuarios.

Este informe está particularmente dirigido al equipo de desarrollo para guiar la construcción, codificación y pruebas del producto; al equipo administrativo de Píxel Gamers como marco validador de los requisitos de negocio, y a los analistas de aseguramiento de calidad (QA) para el diseño de planes de prueba orientados a verificar el cumplimiento de cada requerimiento. 

Todo esto con el objetivo de establecer una comprensión común sobre las características y comportamiento que deberá presentar el sistema para poder delimitar el alcance del proyecto y establecer el rumbo de desarrollo.

2. ## **Ámbito del Sistema** {#ámbito-del-sistema}

El sistema desarrollado se denominará oficialmente al igual que la tienda “**Pixel Gamers**”. Este software consistirá en una plataforma digital integrada que unificará la gestión física y la lógica de e-commerce de la compañía.

**¿Qué hará el sistema?**	

* Sincronizar en tiempo real el inventario físico de las 3 sucursales físicas, preparada para futuras expansiones, con el inventario de la tienda en línea, evitando discrepancias en ventas presenciales, telefónicas y web.   
* Permitir transacciones en línea seguras mediante la implementación de plataformas de pago para productos físicos y digitales (códigos de descarga, suscripciones y contenido descargable).  
* Validar y despachar automáticamente y por correo electrónico las claves de descarga digital adquiridas, garantizando que el cliente reciba un código activo e inmediato, así evitar la concurrencia de códigos en inventario.  
* Proveer un módulo logístico de seguimiento para la programación y control de despachos físicos a domicilio, notificando el estado de la entrega en tiempo real al usuario.  
* Automatizar un motor de notificaciones con objetivos de marketing, comunicar nuevos lanzamientos y promociones exclusivas directamente al correo de los usuarios registrados.


  


  


  


  

**¿Qué no hará el sistema?**

* No reemplazará las cajas registradoras de pago en efectivo de las sucursales físicas, actuando únicamente como consultor de existencias en el punto de venta.  
* No automatizará de forma autónoma compras a distribuidores internacionales; la reposición de existencias permanecerá como una tarea de ingreso manual por parte del área de compras.  
* No alojará de manera directa los archivos de descarga de los videojuegos; las descargas seguirán efectuándose desde los servidores oficiales de las plataformas correspondientes.  
    
  


**Requisitos de negocio, métricas de éxito.**

* Eliminar por completo la concurrencia y duplicación accidental de códigos digitales en venta (doble asignación del mismo inventario).  
* Reducir la tasa de quejas por retrasos en despachos a domicilio de productos físicos en un 80-85% en los primeros meses del sistema.  
* Mejorar la tasa de retención de clientes en un margen de 25% a través del sistema de notificaciones automatizadas de lanzamientos y promociones.  
* Lograr que el 99.9% de códigos digitales despachados por correo sean válidos y funcionales a la hora de compra.

**Visión del producto.**

Enfocado para entusiastas y jugadores comunes de consolas de videojuegos interesados/as en el mercado local, que buscan eficiencia y comodidad tanto en entregas físicas como digitales, la plataforma unificada de PixelGamers  centraliza inventarios únicos, accesorios de consola y automatiza la entrega de códigos digitales. Que a diferencia de plataformas globales rígidas (Ya sea PlayStation Store, Nintendo eShop o Xbox Store) que no comercializan accesorios ni formatos físicos. Garantizando stock exacto en sucursales físicas y ventas web, despacho automatizado inmediato de claves digitales y fidelización activa de la comunidad creciente a través de notificaciones oportunas.

3. ## **Visión General del Documento** {#visión-general-del-documento}

Este documento se organiza de forma sistemática en cuatro capítulos principales. En el capítulo 1 se define la introducción, el ámbito del sistema, sus límites operativos y la visión del negocio. El capítulo 2 presenta la descripción general del sistema, donde se modela el entorno de integración del software (perspectiva), las funciones generales organizadas y el perfil de los usuarios clave. El capítulo 3 detalla de forma explícita y estructurada los requisitos funcionales del sistema y los requisitos no funcionales agrupados en rendimiento, seguridad y otros criterios de operación. Finalmente, el capítulo 4 propone la planificación metodológica del desarrollo, la definición de roles y la justificación del marco ágil de trabajo (Scrum) seleccionado para viabilizar el proyecto.

2. # **Descripción General** {#descripción-general}

## **2.1 Perspectiva del Producto** {#2.1-perspectiva-del-producto}

El sistema de PixelGamers operará como una solución centralizada de organización en la nube, la cual actuará como enlace principal entre los canales de distribución y transmisión de la empresa. Esta plataforma reemplazará el actual catálogo web plano, e interactuara de manera dinámica con los siguientes subsistemas ya sean internos y externos:

Internos:

* Base de datos local de sucursales: Integración en tiempo real con los sistemas de venta locales mediante APIs seguras para la captar transacciones y actualizaciones del stock en las actuales y futuras sucursales.  
* Servicio SMTP/SMS: Motor externo para el envío automatizado de correos electrónicos transaccionales conteniendo códigos de canje digital, alertas de despacho físico y alertas publicitarias de marketing.  
* Sistemas de contabilidad preexistentes.

Externos:

* Pasarelas de Pago (Webpay / MercadoPago, etc): Conector transaccional externo para procesar autorizaciones de tarjetas de crédito, débito o transferencias digitales bajo estándares PCI-DSS.  
* Proveedores de códigos de descarga digitales: Obtención y Validación de códigos digitales desde reputables fuentes.  
* Proveedores de Despacho (Courier).

## **2.2 Funciones del Producto** {#2.2-funciones-del-producto}

A continuación se detallan, en grandes rasgos, las cinco principales funciones del sistema de tienda Pixel Gamers, organizadas dependiendo del aporte estratégico y funcional a la empresa:

* Administración Transaccional E-Commerce: Proporcionar una plataforma web completa de carritos de compra que permita al usuario cliente, seleccionar, cotizar y pagar artículos desde el stock físico y digital en un pago unificado.  
* Control de Sincronizado Omnicanal: Sincronizar centralizadamente las existencias de productos ubicadas en las 3 sucursales actuales y venta por teléfono. Reduciendo de forma automática el stock disponible inmediatamente después de realizada una venta confirmada.  
* Despacho automatizado de licencias y Códigos: Extraer automáticamente de la base de datos, claves de descargas encriptadas para seguridad, con el objetivo de enviarlas al cliente final por correo inmediatamente después de la verificación de pago.  
* Consola Logística de Envíos Físicos: Permitir al personal encargado por sucursal generar órdenes de envío, gestionar y registrar en base a la empresa de courier elegida.  
* Gestión de Campañas y Alertas de Lanzamiento: Permitir al personal encargado por sucursal configurar las alertas segmentadas que notifiquen a usuarios inscritos. Preventas exclusivas, noticias de videojuegos altamente demandados e informen sobre promociones y descuentos.

## **2.3 Características de los Usuarios** {#2.3-características-de-los-usuarios}

El sistema de Pixel Gamers será utilizado por 3 tipos de usuarios finales, cada uno con un nivel de experiencia técnica, educacional y necesidades específicas dentro de la plataforma:

| Tipo de usuario | Nivel educacional / Experiencia | Rol y Tareas clave dentro de la Plataforma |
| :---: | ----- | ----- |
| Comprador | **Nivel variado**: Estudiante, técnico o profesional.  **Nivel Medio-alto**: Presenta familiaridad con tecnología de entretenimiento.  **Nivel variado**: Transacciones digitales. | Navegar por el catálogo, realizar compras en línea de accesorios físicos, licencias y códigos digitales.  Recibir por medio de correo y hacer seguimiento de pedidos. |
| Vendedor de Tienda | Educación Media o Técnica completa. Experiencia media en sistemas de Punto de Venta (POS). | Consultar stock consolidado de productos en tiempo real, registrar ventas presenciales físicas e ingresar pedidos por teléfono manuales reservando stock. |
| Supervisor Logistico | Técnico o profesional de logística. Experiencia alta en sistemas de control de stock. | Cargar, validar los inventarios físicos periódicos de las 3 sucursales, importar lotes de códigos digitales para descarga, emisión de despacho. |
| Administrador de Negocio | Profesional en logística, administración de empresas. Alta experiencia en el manejo multiplataforma. | Validar lógica de negocio y todos los sistemas combinados. |

3. # **Requisitos del Proyecto** {#requisitos-del-proyecto}

Los requisitos del proyecto establecen las acciones y condiciones que deberá cumplir Pixel Gamers para responder a las necesidades identificadas. estos se dividen en requisitos funcionales, que representan lo que el sistema debe realizar, y los requisitos no funcionales, que establecen características de calidad y restricciones que el sistema debe garantizar.

## **3.1 Requisitos funcionales** {#3.1-requisitos-funcionales}

En este proyecto, se relacionan principalmente con la gestión de productos, inventario, pedidos digitales y notificaciones. En este caso, los requisitos funcionales corresponden a las acciones que el sistema deberá realizar al recibir la información, procesarla y producir un resultado. 

#### **3.1.1 Requisito funcional: Gestión de Catálogo** {#3.1.1-requisito-funcional:-gestión-de-catálogo}

| RF-1 | El sistema debe permitir gestionar productos (CRUD), (Físicos y Digitales) con título, descripción, consola y precio. |
| :---: | ----: |
| RF-2 | El sistema debe permitir asociar imágenes, portadas y videos a la ficha de cada videojuego. |
| RF-3 | El sistema debe permitir la categorización y filtrado (manual y automático) de productos según su formato (físico, digital, suscripción, DLC). |
| RF-4 | El sistema debe permitir ocultar de la vista aquellos productos desactivados o sin stock. |
| RF-5 | El sistema debe proveer una barra de búsqueda inteligente que filtre por plataforma, género, rango de precios y disponibilidad de stock. |

#### **3.1.2 Requisito funcional: Sincronización de Stock** {#3.1.2-requisito-funcional:-sincronización-de-stock}

| RF-6 | El sistema debe sincronizar automáticamente y en tiempo real las existencias de las tres sucursales físicas con el stock de la tienda en línea. |
| :---: | ----: |
| RF-7 | El sistema debe actualizar y restar el inventario físico local inmediatamente después de procesarse una venta presencial en el POS de cualquier sucursal. |
| RF-8 | El sistema debe restar el inventario web de forma inmediata una vez que la pasarela de pago autorice una transacción en la tienda en línea. |
| RF-9 | El sistema debe permitir al área de compras ingresar manualmente stock inicial y reabastecimientos de productos físicos y lotes de claves digitales. |
| RF-10 | El sistema debe gatillar alertas automatizadas visuales en el panel de control cuando el inventario de un artículo de alta demanda caiga bajo un umbral crítico. |
| RF-11 | El sistema debe bloquear transacciones de compra e impedir sobreventa de productos sin stock. |

#### **3.1.3 Requisito funcional: E-Commerce**  {#3.1.3-requisito-funcional:-e-commerce}

| RF-12 | El sistema debe permitir a los usuarios registrarse como clientes, almacenando de forma segura su correo, clave, nombre, teléfono y dirección de despacho. |
| :---: | ----: |
| RF-13 | El sistema debe proveer un carrito de compras unificado que permita consolidar y comprar artículos físicos e intangibles en la misma sesión de pago. |
| RF-14 | El sistema debe integrarse vía API con pasarelas de pago externas (Webpay, MercadoPago) para procesar pagos seguros. |
| RF-15 | El sistema debe procesar transacciones seguras mediante tarjetas de crédito, débito y transferencias bancarias directas. |
| RF-16 | El sistema debe emitir un comprobante o boleta de compra digital y despacharlo automáticamente al correo del cliente tras validarse la transacción. |
| RF-17 | El sistema debe permitir al usuario cliente consultar desde su perfil personal el historial detallado de todas sus compras físicas y claves digitales adquiridas. |

#### **3.1.4 Requisito funcional: Despacho Digital** {#3.1.4-requisito-funcional:-despacho-digital}

| RF-18 | El sistema debe permitir la importación masiva de lotes de códigos de descarga digital en formato encriptado de forma segura. |
| :---: | ----: |
| RF-19 | El sistema debe verificar y garantizar que cada código digital asignado esté activo y no posea asignaciones previas a otros clientes. |
| RF-20 | El sistema debe despachar de forma inmediata el código digital de descarga por correo electrónico (servidor SMTP) al confirmarse el pago. |
| RF-21 | El sistema debe registrar un log histórico inalterable de cada código digital asignado (ID transacción, cliente, fecha/hora y estado de validez). |
| RF-22 | El sistema debe permitir a los administradores de TI consultar y auditar los estados de validez de los códigos encriptados guardados en base de datos. |

#### **3.1.5 Requisito funcional: Logística Física** {#3.1.5-requisito-funcional:-logística-física}

| RF-23 | El sistema debe permitir al cliente elegir entre despacho físico a domicilio o retiro presencial en cualquiera de las 3 sucursales de Pixel Gamers. |
| :---: | ----: |
| RF-24 | El sistema debe permitir a los encargados de bodega generar e imprimir etiquetas de despacho y órdenes de embalaje en PDF. |
| RF-25 | El sistema debe integrarse vía API con el Courier logístico externo para cotizar los costos de envío de forma automatizada según la dirección. |
| RF-26 | El sistema debe permitir a logística ingresar manualmente el número de seguimiento (tracking ID) entregado por el Courier externo. |
| RF-27 | El sistema debe enviar notificaciones de correo automáticas al usuario informando cada actualización de su despacho (En preparación, En camino, Entregado). |

#### **3.1.6 Requisito funcional: Marketing & Alertas** {#3.1.6-requisito-funcional:-marketing-&-alertas}

| RF-28 | El sistema debe permitir a los usuarios suscribirse o desuscribirse de forma autónoma al boletín de lanzamientos y preventas exclusivas. |
| :---: | ----: |
| RF-29 | El sistema debe permitir al personal de sucursal crear y programar campañas de marketing por correo electrónico dirigidas a clientes registrados. |
| RF-30 | El sistema debe enviar alertas de correo automatizadas inmediatas a los usuarios suscritos en cuanto un videojuego altamente demandado sea publicado. |

## **3.2 Requisitos no funcionales**	 {#3.2-requisitos-no-funcionales}

A continuación se especifican las restricciones técnicas de operación, seguridad y rendimiento a las que la plataforma se sujetará, asegurando la viabilidad técnica y confiabilidad comercial:

### 	**3.2.1 Requisitos de rendimiento** {#3.2.1-requisitos-de-rendimiento}

- Tiempo de Respuesta del Catálogo: El sistema debe procesar búsquedas de productos y renderizar las páginas del catálogo web en menos de 2 segundos bajo condiciones normales, con el objetivo de optimizar la experiencia del usuario.   
- Soporte de Usuarios Concurrentes: La plataforma web e-commerce y los endpoints de API deben soportar un mínimo de 500 usuarios concurrentes procesando operaciones de manera estable y segura.  
- Latencia de Sincronización del Stock: Las transacciones que modifiquen stock en puntos de venta físicos o compras web deben replicarse en base a datos sincronizados, viéndose reflejadas en toda consola en un plazo menor a 5 segundos.

### 	**3.2.2 Seguridad** {#3.2.2-seguridad}

- Cifrado de Datos Sensibles en Tránsito: Comunicaciones y transferencias de información personal, credenciales, login y pasarelas de pago deben encriptar usando protocolos modernos y certificados (HTTPS, TLS) vigentes  
- Seguridad de Claves Digitales: La base de datos almacena códigos digitales listos para descarga usando una base de encriptación por algoritmos. Impidiendo el robo o visualización por parte de personal sin autorización.  
- Acceso Basado en Roles: Se limitará el acceso a la consola de administración del sistema mediante credenciales validadas asociadas a roles con permisos específicos (Vendedor, Logística, Administrador, TI).  
- Registro de Logs Transaccionales: El sistema debe registrar un log detallado, inalterable de cada código de descarga asignado, guardando fecha, hora, ID de transacción, correo del cliente y estado de validez del código.

### **3.2.3 Otros Requisitos** {#3.2.3-otros-requisitos}

- Disponibilidad Alta de los Servicios: La tienda en línea de e-commerce 	debe ser capaz de garantizar una disponibilidad operativa mensual mínima de un 99,5%, operando las 24 horas del día los 7 días semanales.  
- Diseño Responsivo y Usabilidad: El diseño del portal de clientes debe ser totalmente adaptativo (responsive), asegurando accesibilidad multiplataforma.

| Código | Tipo de Requisito | Clasificación | Descripción |
| :---: | :---: | :---: | ----- |
| RNF-01 | Disponibilidad | Externo | El sistema de e-commerce web debe alcanzar un tiempo de actividad mensual mínimo del 99.5%, operando las 24 horas del día, los 7 días de la semana. |
| RNF-02 | Disponibilidad | Externo | El motor de sincronización de stock de las sucursales debe estar disponible el 99.9% del tiempo durante el horario comercial de las tiendas físicas. |
| RNF-03 | Disponibilidad | Externo | En caso de una caída del servidor principal en la nube, el sistema debe redirigir de forma automática el tráfico a un servidor de respaldo en un tiempo máximo de 3 minutos. |
| RNF-04 | Instalabilidad | Externo | La instalación del cliente de administración en los computadores de las sucursales físicas de Pixel Gamers debe ejecutarse mediante un script automatizado que complete el proceso en menos de 10 minutos. |
| RNF-05 | Instalabilidad | Externo | El instalador debe permitir la desinstalación completa de la aplicación de terminal de ventas en un plazo máximo de 2 minutos, borrando de forma segura todos los archivos temporales. |
| RNF-06 | Instalabilidad | Externo | El despliegue de parches o nuevas versiones del catálogo web en el servidor de producción debe poder ejecutarse en caliente sin interrumpir el servicio activo de los usuarios. |
| RNF-07 | Integridad | Externo | Toda transacción de actualización de stock debe cumplir con normas para evitar la duplicación accidental o pérdida de códigos de descarga digital en la base de datos. |
| RNF-08 | Integridad | Externo | Cada cambio manual en el inventario físico realizado por un administrador debe quedar registrado con un codigo único para asegurar que el inventario no fue manipulado externamente. |
| RNF-09 | Integridad | Externo | El sistema debe ejecutar una conciliación lógica automática de datos al final de cada jornada (23:59:00 hrs) para verificar la consistencia exacta de saldos entre las sucursales y la web. |
| RNF-10 | Interoperabilidad | Externo | El sistema debe integrarse de forma nativa con las pasarelas Webpay y MercadoPago mediante APIs que operen bajo protocolo de comunicación seguro HTTPS. |
| RNF-11 | Interoperabilidad | Externo | El módulo logístico de despachos con los servicios de courier externos debe procesar solicitudes de cotización en menos de 1.5 segundos. |
| RNF-12 | Interoperabilidad | Externo | La plataforma de inventario debe permitir exportar e importar datos en formatos estándar estructurados (JSON, CSV, XML) para asegurar la comunicación con sistemas de contabilidad preexistentes. |
| RNF-13 | Rendimiento | Externo | El sistema de e-commerce web debe procesar búsquedas de productos y renderizar las páginas del catálogo web en menos de 2 segundos en condiciones normales de uso. |
| RNF-14 | Rendimiento | Externo | La replicación y sincronización de cambios de stock entre las sucursales y la web tras cualquier transacción de venta debe completarse en un plazo menor a 5 segundos. |
| RNF-15 | Rendimiento | Externo | El endpoint de la API para consultas rápidas de stock desde el terminal del punto de venta físico de un vendedor debe retornar la información en menos de 1 segundo. |
| RNF-16 | Confiabilidad | Externo | El software central del servidor de producción debe operar con un tiempo medio entre fallas mínimo de 720 horas continuas de ejecución sin interrupciones críticas. |
| RNF-17 | Confiabilidad | Externo | El tiempo medio de reparación de la base de datos de transacciones ante fallas de hardware o red no debe exceder de 15 minutos. |
| RNF-18 | Confiabilidad | Externo | El motor SMTP para entrega automática de códigos digitales debe poseer una tasa de éxito de envío superior al 99.8% mensual bajo condiciones operativas estables. |
| RNF-19 | Robustez | Externo | En caso de interrupción repentina de la conexión a internet en una sucursal, el terminal local de ventas debe operar de manera offline mediante caché local, guardando las ventas para sincronizarlas cuando retorne el servicio. |
| RNF-20 | Robustez | Externo | El sistema web debe rechazar, mitigar y bloquear de forma segura entradas de datos inválidas, intentos de inyección SQL, XSS o payloads excesivos sin detener la ejecución de otros servicios ni mostrar trazas de error. |
| RNF-21 | Robustez | Externo | Ante fallas repentinas de timeout (superior a 10 segundos) en la pasarela externa de pagos, el sistema debe revertir de forma segura la asignación temporal del código digital y notificar amigablemente al cliente. |
| RNF-22 | Seguridad | Externo | La base de datos del sistema debe almacenar de forma encriptada todos los códigos digitales activos mediante algoritmos de cifrado fuerte de extremo a extremo. |
| RNF-23 | Seguridad | Externo | La autenticación administrativa de la consola debe exigir un protocolo de control de acceso basado en roles y contraseñas cifradas con algoritmos seguros.  |
| RNF-24 | Seguridad | Externo | El sistema debe hacer un registro detallado, inalterable y encriptado por cada código entregado, guardando fecha, hora, ID de transacción, email del cliente y hash de validez.  |
| RNF-25 | Usabilidad | Externo | La navegación para la realización de una compra completa en línea de productos o códigos digitales no debe superar un flujo de 3 pasos o clics desde el carrito de compras. |
| RNF-26 | Usabilidad | Externo | La interfaz de usuario del portal de clientes debe ser totalmente adaptativa para que se vea correctamente en dispositivos móviles y computadores. |
| RNF-27 | Usabilidad | Externo | El portal debe incorporar un manual interactivo visual integrado de máximo 4 pantallas para que los clientes puedan comprender fácilmente el proceso de canje de sus códigos digitales en consolas. |
| RNF-28 | Eficiencia | Interno | El uso de la CPU del servidor web de Pixel Gamers durante operaciones normales con un tráfico simultáneo de hasta 200 usuarios concurrentes no debe superar el 30% de la capacidad contratada. |
| RNF-29 | Eficiencia | Interno | Las consultas de base de datos SQL para búsquedas de catálogo deben estar optimizadas con índices lógicos para consumir menos de 50 MB de memoria de servidor por consulta simultánea. |
| RNF-30 | Eficiencia | Interno | El peso de transferencia de la página de inicio (landing page y assets gráficos del e-commerce) debe limitarse a un máximo de 2.5 MB para optimizar el consumo de ancho de banda del cliente. |
| RNF-31 | Modificabilidad | Interno | El sistema debe estructurarse utilizando una arquitectura de microservicios basada en APIs REST y patrón MVC para permitir modificaciones independientes en la base de datos sin afectar la web.  |
| RNF-32 | Modificabilidad | Interno | La plataforma debe permitir cambiar de proveedor de pasarela de pago modificando únicamente un archivo de configuración de variables de entorno JSON o XML, sin tocar el código fuente principal de transacciones. |
| RNF-33 | Modificabilidad | Interno | La adición de una nueva sucursal física o canal de ventas telefónicas de Pixel Gamers debe poder realizarse desde la consola de configuración de TI en menos de 5 minutos de forma limpia. |
| RNF-34 | Portabilidad | Interno | La aplicación backend debe encapsularse en contenedores estándar de Docker de Linux para garantizar su portabilidad directa entre entornos AWS, Azure o Google Cloud sin cambios de código. |
| RNF-35 | Portabilidad | Interno | El modelo de datos de inventario y pedidos de la base de datos debe ser compatible con motores de base de datos PostgreSQL y MySQL sin requerir cambios estructurales en las relaciones. |
| RNF-36 | Portabilidad | Interno | El código del frontend e-commerce debe ser compatible con las últimas 3 versiones oficiales estables de los navegadores Chrome, Safari, Firefox, Edge y navegadores integrados de consolas. |
| RNF-37 | Reusabilidad | Interno | Los componentes desarrollados para la pasarela de pago de la web deben empaquetarse en librerías independientes y desacopladas para poder ser reutilizadas en futuras aplicaciones móviles nativas de Pixel Gamers. |
| RNF-38 | Reusabilidad | Interno | El motor SMTP para despacho de correos electrónicos transaccionales debe ser diseñado como un módulo genérico que se reutilice tanto para enviar boletas, claves digitales o alertas de promociones. |
| RNF-39 | Reusabilidad | Interno | Las funciones de cálculo de divisas, redondeo financiero y cómputo de impuestos (IVA) del backend deben centralizarse en un módulo utilitario reutilizable para todo el sistema transaccional. |
| RNF-40 | Escalabilidad | Interno | La base de datos central de Pixel Gamers debe estar diseñada de forma indexada para almacenar de forma estable y rápida hasta 1.000.000 de registros históricos de transacciones. |
| RNF-41 | Escalabilidad | Interno | La arquitectura en la nube de la tienda web debe permitir el escalamiento con auto scaling, incrementando instancias de servidor web en menos de 3 minutos cuando la CPU supere el 75% de uso. |
| RNF-42 | Escalabilidad | Interno | El sistema debe estar estructurado para admitir la expansión física de sucursales a nivel nacional, escalando de las 3 sucursales actuales hasta un límite de 50 sucursales activas simultáneas. |
| RNF-43 | Verificabilidad | Interno | El código fuente del backend y servicios API de Pixel Gamers debe poseer una cobertura de pruebas unitarias (unit testing) automatizadas mínimo del 80% antes de compilar pasos a producción. |
| RNF-44 | Verificabilidad | Interno | El sistema debe contar con un entorno de preproducción que permita simular compras virtuales, fallas de pago y despacho SMTP sin alterar la base de datos comercial activa. |
| RNF-45 | Verificabilidad | Interno | El backend del sistema debe exponer endpoints seguros de monitoreo de estado operativo (health check APIs) que verifiquen la salud de la base de datos, servidor SMTP y conexiones de courier de manera automatizada. |

# 

4. # **Propuesta de Planificación** {#propuesta-de-planificación}

## **4.1 Definición del Equipo de Trabajo** {#4.1-definición-del-equipo-de-trabajo}

Para llevar a cabo el desarrollo y despliegue del proyecto de una manera exitosa para Pixel Gamers, se ha establecido la siguiente estructura del equipo de software, asignando responsabilidades:

| Rol del Proyecto | Responsabilidades Clave | Alineación con metodología ágil. | Nombre del encargado |
| :---: | ----- | ----- | ----- |
| Analista de Requisitos | Modelar y documentar las necesidades de negocio, refinar requisitos, validar especificaciones, diseñar historial de usuarios. comunicación con cliente. | Asume el rol de Product Owner (PO). | Joshua Auristondo Gonzales |
| Jefe de Proyecto | Monitorización de recursos, presupuesto, monitorización de cumplimiento de metodología scrum. | Asume el rol de Scrum Master. | Catalina Larenas Jiménez |
| Equipo de desarrollo | Escribir código de alta calidad en frontend y backend, integrar bases de datos distribuidas y configurar servicios APIs externos. | Desarrolladores autónomos que autoorganizan su trabajo para entregar incrementos terminados en cada ciclo de desarrollo (Sprints). | Benjamin Zepeda Zuloaga, Javier Sepulveda Muñoz |
| Quality Assurance | Diseñar planes de pruebas sistemáticas funcionales y no funcionales, ejecutar tests de rendimiento y validar la seguridad. | Parte integrada del Dev Team que valida que cada historia de usuario desarrollada cumpla estrictamente la definición de terminado (DoD). | Benjamin Zepeda Zuloaga, Javier Sepulveda Muñoz |

## **4.2 Análisis Metodológico y Justificación del Marco de Trabajo** {#4.2-análisis-metodológico-y-justificación-del-marco-de-trabajo}

El modelo de cascada es rígido y secuencial, en el caso de este proyecto, hay tareas con distintas prioridades que calzan mejor con el flujo ágil y más libre de SCRUM, además de que hay ciertas incertidumbres técnicas que podrían retrasar el proceso si es que se hubiese elegido el método de cascada. El proyecto cuenta con vinculaciones con sistemas externos, como son las pasarelas de pago o distribuidores de códigos digitales por ejemplo, y al ser manejados por otras empresas, pueden haber cambios en cómo se integren al proyecto, por lo que en caso de que haya algún cambio en cómo se comunican estos sistemas y algo deje de funcionar o deba actualizarse, la metodología SCRUM permite adaptarse a cambios sin destruir la organización del proyecto completo.

# 

# 

# 

# 

# 

# 

# 

# 

# **5\. Definición de Historias de Usuario** {#5.-definición-de-historias-de-usuario}

## **5.1 Historias de Usuario** {#5.1-historias-de-usuario}

Para nuestros usuarios definidos primero definimos las siguientes historias de usuario. 

### **5.1.1 Comprador** {#5.1.1-comprador}

| ID | Historia de Usuario |
| :---: | ----- |
| HU-COM-1 | Como Comprador, quiero navegar y filtrar los videojuegos por consola, género y rango de precio, para encontrar rápidamente los títulos de mi interés. |
| HU-COM-2 | Como Comprador, quiero visualizar la ficha detallada de cada videojuego con imágenes, tráileres y especificaciones técnicas para decidir informadamente mi compra. |
| HU-COM-3 | Como Comprador, quiero agregar productos físicos y licencias digitales a un carrito de compras unificado, para realizar una sola transacción de pago. |
| HU-COM-4 | Como Comprador, quiero pagar de forma segura mediante pasarelas de pago integradas (Webpay / MercadoPago), para completar mi compra de manera confiable. |
| HU-COM-5 | Como Comprador, quiero recibir una boleta electrónica automática en mi correo registrado para contar con un respaldo oficial de mi compra. |
| HU-COM-6 | Como Comprador, quiero recibir de forma inmediata y automática mi clave o licencia digital en pantalla y por correo para comenzar a jugar sin demoras. |
| HU-COM-7 | Como Comprador, quiero seleccionar entre despacho a domicilio o retiro presencial en sucursal física para elegir la alternativa de entrega más conveniente. |
| HU-COM-8 | Como Comprador, quiero consultar el estado de envío en tiempo real con un número de seguimiento para saber cuándo recibiré mi pedido físico. |
| HU-COM-9 | Como Comprador, quiero consultar mi historial de compras y mi bóveda personal de claves digitales adquiridas, para acceder a mis juegos en cualquier momento. |
| HU-COM-10 | Como Comprador, quiero suscribirme o desuscribirme al boletín promocional y alertas de preventas, para recibir ofertas exclusivas según mi preferencia. |
| HU-COM-11 | Como Comprador, quiero registrarme y autenticarme mediante una cuenta de usuario protegida para gestionar mis datos personales y pedidos de forma rápida. |
| HU-COM-12 | Como Comprador, quiero publicar valoraciones y reseñas en los juegos que he comprado, para compartir mi opinión con la comunidad gamer. |
| HU-COM-13 | Como Comprador, quiero solicitar la recuperación de mi contraseña mediante un enlace seguro enviado a mi correo electrónico para restablecer mi acceso si lo olvido. |
| HU-COM-14 | Como Comprador, quiero solicitar una alerta por correo cuando un producto agotado vuelva a tener stock disponible, para comprarlo oportunamente. |
| HU-COM-15 | Como Comprador, quiero filtrar los productos por idioma de subtítulos y región de activación de la consola, para evitar comprar contenido incompatible. |

### **5.1.2 Vendedor de Tienda** {#5.1.2-vendedor-de-tienda}

| ID | Historia de Usuario |
| :---: | ----- |
| HU-VEN-1 | Como Vendedor de Tienda, quiero consultar el inventario consolidado en tiempo real de las 3 sucursales y la tienda web para informar con precisión la disponibilidad de stock al cliente presencial. |
| HU-VEN-2 | Como Vendedor de Tienda, quiero registrar ventas presenciales en caja registrando rebaja instantánea en el stock general para mantener actualizado el inventario omnicanal. |
| HU-VEN-3 | Como Vendedor de Tienda, quiero reservar stock temporalmente para clientes que soliciten compras telefónicas, para asegurar el producto durante 24 horas. |
| HU-VEN-4 | Como Vendedor de Tienda, quiero emitir e imprimir boletas o vales de venta desde la terminal de caja, para entregar comprobantes físicos al cliente. |
| HU-VEN-5 | Como Vendedor de Tienda, quiero verificar la disponibilidad e imprimir/enviar códigos de licencias digitales vendidas en mostrador, para atender compras digitales en tienda física. |
| HU-VEN-6 | Como Vendedor de Tienda, quiero recibir alertas visuales de stock crítico en el terminal POS para sugerir productos alternativos al cliente o solicitar reposición. |
| HU-VEN-7 | Como Vendedor de Tienda, quiero operar la caja registradora en modo offline ante caídas de internet, para no interrumpir la atención al cliente presencial. |
| HU-VEN-8 | Como Vendedor de Tienda, quiero buscar productos rápidamente escaneando su código de barras o SKU, para agilizar la atención en fila. |
| HU-VEN-9 | Como Vendedor de Tienda, quiero procesar cambios y devoluciones de productos físicos presentando boleta para reintegrar el ítem al stock y emitir nota de crédito. |
| HU-VEN-10 | Como Vendedor de Tienda, quiero solicitar traslados internos de mercadería desde otra sucursal, para satisfacer la demanda de un cliente local. |
| HU-VEN-11 | Como Vendedor de Tienda, quiero programar el envío de boletines de ofertas locales a clientes de mi sucursal, para promocionar eventos y liquidaciones. |
| HU-VEN-12 | Como Vendedor de Tienda, quiero autenticarme en la terminal POS con mi usuario individual, para registrar la responsabilidad de cada transacción procesada. |
| HU-VEN-13 | Como Vendedor de Tienda, quiero realizar el arqueo y cierre diario de caja comparando efectivo y vales de tarjeta, para cuadrar los ingresos de mi turno. |
| HU-VEN-14 | Como Vendedor de Tienda, quiero emitir e imprimir cotizaciones formales para clientes presenciales, para ofrecer presupuestos válidos por tiempo determinado. |
| HU-VEN-15 | Como Vendedor de Tienda, quiero validar y entregar órdenes de compra web con modalidad retiro en tienda, para completar la entrega presencial al comprador. |

### **5.1.3 Administrador de Inventario** {#5.1.3-administrador-de-inventario}

| ID | Historia de Usuario |
| :---: | ----- |
| HU-INV-1 | Como Supervisor Logístico, quiero realizar cargas masivas de claves digitales encriptadas mediante archivos CSV o JSON para mantener abastecido el catálogo digital. |
| HU-INV-2 | Como Supervisor Logístico, quiero auditar las claves digitales almacenadas verificando que estén encriptadas y sin duplicaciones, para garantizar la seguridad del inventario virtual. |
| HU-INV-3 | Como Supervisor Logístico, quiero registrar el ingreso de nuevos lotes de mercadería física especificando sucursal de destino para actualizar el stock disponible. |
| HU-INV-4 | Como Supervisor Logístico, quiero definir parámetros de stock mínimo y crítico por producto para gatillar alertas automáticas de reposición a proveedores. |
| HU-INV-5 | Como Supervisor Logístico, quiero generar e imprimir etiquetas de despacho y código de barras en formato PDF, para agilizar el embalaje de pedidos web. |
| HU-INV-6 | Como Supervisor Logístico, quiero integrar el sistema con las API de los couriers de despacho externos, para automatizar la cotización y generación de guías. |
| HU-INV-7 | Como Supervisor Logístico, quiero registrar el código de seguimiento de envío en cada pedido embalado, para notificar automáticamente al cliente. |
| HU-INV-8 | Como Supervisor Logístico, quiero programar conciliaciones automáticas del stock físico y digital para detectar inconsistencias de inventario de forma diaria. |
| HU-INV-9 | Como Supervisor Logístico, quiero registrar mermas, productos dañados o extravíos con su justificación técnica, para mantener la transparencia del inventario real. |
| HU-INV-10 | Como Supervisor Logístico, quiero exportar e importar reportes detallados de rotación de inventarios en formatos CSV/JSON/XML, para respaldar la toma de decisiones. |
| HU-INV-11 | Como Supervisor Logístico, quiero autorizar y coordinar la transferencia física de productos entre bodegas de sucursales, para balancear la disponibilidad geográfica. |
| HU-INV-12 | Como Supervisor Logístico, quiero acceder a una bitácora inalterable de entrega de códigos digitales para resolver reclamos por licencias supuestamente no recibidas. |
| HU-INV-13 | Como Supervisor Logístico, quiero gestionar el catálogo de proveedores de consolas y distribuidores oficiales, para centralizar las órdenes de compra de reabastecimiento. |
| HU-INV-14 | Como Supervisor Logístico, quiero configurar instrucciones especiales de empaque para ediciones de coleccionista o frágiles, para asegurar la protección del producto durante el transporte. |
| HU-INV-15 | Como Supervisor Logístico, quiero monitorear el estado operativo y tiempos de respuesta de las APIs de couriers integrados, para detectar caídas del servicio logístico. |

# **5.1.4 Administrador de negocio** {#5.1.4-administrador-de-negocio}

| ID | Historia de Usuario |
| :---: | ----- |
| HU-ADM-1 | Como Administrador de Negocio, quiero registrar y gestionar las cuentas de usuarios administrativos (Vendedores, Supervisores) para otorgar acceso seguro al sistema. |
| HU-ADM-2 | Como Administrador de Negocio, quiero definir y asignar roles y permisos específicos (RBAC) para limitar las funciones accesibles por cada tipo de empleado. |
| HU-ADM-3 | Como Administrador de Negocio, quiero desactivar de forma inmediata la cuenta de cualquier empleado desvinculado, para revocar todos sus accesos de manera instantánea. |
| HU-ADM-4 | Como Administrador de Negocio, quiero auditar el registro global de actividades (logs de auditoría) para supervisar transacciones sensibles y cambios de stock. |
| HU-ADM-5 | Como Administrador de Negocio, quiero exigir el uso de contraseñas de alta complejidad y autenticación de dos factores (2FA) para roles administrativos, para blindar el acceso a la plataforma. |
| HU-ADM-6 | Como Administrador de Negocio, quiero vincular y asignar usuarios a sucursal(es) física(s) específica(s), para delimitar sus privilegios operativos según su sede de trabajo. |
| HU-ADM-7 | Como Administrador de Negocio, quiero restablecer claves de acceso a usuarios administrativos ante bloqueos para garantizar la continuidad operativa del personal. |
| HU-ADM-8 | Como Administrador de Negocio, quiero gestionar las llaves de API y credenciales de integración con pasarelas de pago para asegurar el correcto flujo financiero. |
| HU-ADM-9 | Como Administrador de Negocio, quiero dar de alta nuevas sucursales físicas y configurar sus parámetros comerciales en el sistema, para respaldar la expansión del negocio. |
| HU-ADM-10 | Como Administrador de Negocio, quiero visualizar paneles ejecutivos de seguridad, intentos de acceso fallidos e incidentes para tomar medidas preventivas. |
| HU-ADM-11 | Como Administrador de Negocio, quiero establecer las políticas de retención, respaldo y purga de logs y datos históricos, para cumplir con normativas legales y de almacenamiento. |
| HU-ADM-12 | Como Administrador de Negocio, quiero autorizar e iniciar los protocolos de respaldo y recuperación ante desastres (DRP), para asegurar la continuidad operacional ante contingencias. |
| HU-ADM-13 | Como Administrador de Negocio, quiero definir y autorizar los límites de compra y presupuestos de emergencia asignados a Supervisores, para controlar el gasto operativo. |
| HU-ADM-14 | Como Administrador de Negocio, quiero publicar y actualizar los términos, condiciones y políticas de privacidad del comercio, para garantizar el cumplimiento normativo. |
| HU-ADM-15 | Como Administrador de Negocio, quiero supervisar las reglas de autoescalado y costos operativos del servidor en la nube durante eventos de alta demanda (CyberDay, lanzamientos), para optimizar el gasto de TI. |

# 

# **6\. Definición del Product Backlog Priorizado** {#6.-definición-del-product-backlog-priorizado}

## **6.1 Product Backlog Priorizado** {#6.1-product-backlog-priorizado}

| N° HDU | Historia de Usuario |
| :---: | ----- |
| HU-ADM-1 | Como Administrador de Negocio, quiero registrar y gestionar las cuentas de usuarios administrativos (Vendedores, Supervisores) para otorgar acceso seguro al sistema. |
| HU-ADM-2 | Como Administrador de Negocio, quiero definir y asignar roles y permisos específicos (RBAC) para limitar las funciones accesibles por cada tipo de empleado. |
| HU-ADM-5 | Como Administrador de Negocio, quiero exigir el uso de contraseñas de alta complejidad y autenticación de dos factores (2FA) para roles administrativos, para blindar el acceso a la plataforma. |
| HU-ADM-6 | Como Administrador de Negocio, quiero vincular y asignar usuarios a sucursal(es) física(s) específica(s), para delimitar sus privilegios operativos según su sede de trabajo. |
| HU-ADM-9 | Como Administrador de Negocio, quiero dar de alta nuevas sucursales físicas y configurar sus parámetros comerciales en el sistema, para respaldar la expansión del negocio. |
| HU-ADM-3 | Como Administrador de Negocio, quiero desactivar de forma inmediata la cuenta de cualquier empleado desvinculado, para revocar todos sus accesos de manera instantánea. |
| HU-ADM-7 | Como Administrador de Negocio, quiero restablecer claves de acceso a usuarios administrativos ante bloqueos para garantizar la continuidad operativa del personal. |
| HU-COM-11 | Como Comprador, quiero registrarme y autenticarme mediante una cuenta de usuario protegida para gestionar mis datos personales y pedidos de forma rápida. |
| HU-VEN-12 | Como Vendedor de Tienda, quiero autenticarme en la terminal POS con mi usuario individual, para registrar la responsabilidad de cada transacción procesada. |
| HU-COM-13 | Como Comprador, quiero solicitar la recuperación de mi contraseña mediante un enlace seguro enviado a mi correo electrónico para restablecer mi acceso si lo olvido. |
| HU-INV-3 | Como Supervisor Logístico, quiero registrar el ingreso de nuevos lotes de mercadería física especificando sucursal de destino para actualizar el stock disponible. |
| HU-INV-1 | Como Supervisor Logístico, quiero realizar cargas masivas de claves digitales encriptadas mediante archivos CSV o JSON para mantener abastecido el catálogo digital. |
| HU-INV-4 | Como Supervisor Logístico, quiero definir parámetros de stock mínimo y crítico por producto para gatillar alertas automáticas de reposición a proveedores. |
| HU-VEN-1 | Como Vendedor de Tienda, quiero consultar el inventario consolidado en tiempo real de las 3 sucursales y la tienda web para informar con precisión la disponibilidad de stock al cliente presencial. |
| HU-COM-1 | Como Comprador, quiero navegar y filtrar los videojuegos por consola, género y rango de precio, para encontrar rápidamente los títulos de mi interés. |
| HU-COM-2 | Como Comprador, quiero visualizar la ficha detallada de cada videojuego con imágenes, tráileres y especificaciones técnicas para decidir informadamente mi compra. |
| HU-VEN-8 | Como Vendedor de Tienda, quiero buscar productos rápidamente escaneando su código de barras o SKU, para agilizar la atención en fila. |
| HU-INV-2 | Como Supervisor Logístico, quiero auditar las claves digitales almacenadas verificando que estén encriptadas y sin duplicaciones, para garantizar la seguridad del inventario virtual. |
| HU-INV-13 | Como Supervisor Logístico, quiero gestionar el catálogo de proveedores de consolas y distribuidores oficiales, para centralizar las órdenes de compra de reabastecimiento. |
| HU-VEN-2 | Como Vendedor de Tienda, quiero registrar ventas presenciales en caja registrando rebaja instantánea en el stock general para mantener actualizado el inventario omnicanal. |
| HU-VEN-4 | Como Vendedor de Tienda, quiero emitir e imprimir boletas o vales de venta desde la terminal de caja, para entregar comprobantes físicos al cliente. |
| HU-VEN-13 | Como Vendedor de Tienda, quiero realizar el arqueo y cierre diario de caja comparando efectivo y vales de tarjeta, para cuadrar los ingresos de mi turno. |
| HU-VEN-5 | Como Vendedor de Tienda, quiero verificar la disponibilidad e imprimir/enviar códigos de licencias digitales vendidas en mostrador, para atender compras digitales en tienda física. |
| HU-COM-3 | Como Comprador, quiero agregar productos físicos y licencias digitales a un carrito de compras unificado, para realizar una sola transacción de pago. |
| HU-COM-4 | Como Comprador, quiero pagar de forma segura mediante pasarelas de pago integradas (Webpay / MercadoPago), para completar mi compra de manera confiable. |
| HU-COM-5 | Como Comprador, quiero recibir una boleta electrónica automática en mi correo registrado para contar con un respaldo oficial de mi compra. |
| HU-VEN-3 | Como Vendedor de Tienda, quiero reservar stock temporalmente para clientes que soliciten compras telefónicas, para asegurar el producto durante 24 horas. |
| HU-VEN-14 | Como Vendedor de Tienda, quiero emitir e imprimir cotizaciones formales para clientes presenciales, para ofrecer presupuestos válidos por tiempo determinado. |
| HU-COM-6 | Como Comprador, quiero recibir de forma inmediata y automática mi clave o licencia digital en pantalla y por correo para comenzar a jugar sin demoras. |
| HU-COM-7 | Como Comprador, quiero seleccionar entre despacho a domicilio o retiro presencial en sucursal física para elegir la alternativa de entrega más conveniente. |
| HU-INV-5 | Como Supervisor Logístico, quiero generar e imprimir etiquetas de despacho y código de barras en formato PDF, para agilizar el embalaje de pedidos web. |
| HU-INV-6 | Como Supervisor Logístico, quiero integrar el sistema con las API de los couriers de despacho externos, para automatizar la cotización y generación de guías. |
| HU-INV-7 | Como Supervisor Logístico, quiero registrar el código de seguimiento de envío en cada pedido embalado, para notificar automáticamente al cliente. |
| HU-COM-8 | Como Comprador, quiero consultar el estado de envío en tiempo real con un número de seguimiento para saber cuándo recibiré mi pedido físico. |
| HU-VEN-15 | Como Vendedor de Tienda, quiero validar y entregar órdenes de compra web con modalidad retiro en tienda, para completar la entrega presencial al comprador. |
| HU-VEN-10 | Como Vendedor de Tienda, quiero solicitar traslados internos de mercadería desde otra sucursal, para satisfacer la demanda de un cliente local. |
| HU-INV-11 | Como Supervisor Logístico, quiero autorizar y coordinar la transferencia física de productos entre bodegas de sucursales, para balancear la disponibilidad geográfica. |
| HU-COM-9 | Como Comprador, quiero consultar mi historial de compras y mi bóveda personal de claves digitales adquiridas, para acceder a mis juegos en cualquier momento. |
| HU-VEN-9 | Como Vendedor de Tienda, quiero procesar cambios y devoluciones de productos físicos presentando boleta para reintegrar el ítem al stock y emitir nota de crédito. |
| HU-COM-12 | Como Comprador, quiero publicar valoraciones y reseñas en los juegos que he comprado, para compartir mi opinión con la comunidad gamer. |
| HU-COM-14 | Como Comprador, quiero solicitar una alerta por correo cuando un producto agotado vuelva a tener stock disponible, para comprarlo oportunamente. |
| HU-COM-15 | Como Comprador, quiero filtrar los productos por idioma de subtítulos y región de activación de la consola, para evitar comprar contenido incompatible. |
| HU-INV-9 | Como Supervisor Logístico, quiero registrar mermas, productos dañados o extravíos con su justificación técnica, para mantener la transparencia del inventario real. |
| HU-INV-8 | Como Supervisor Logístico, quiero programar conciliaciones automáticas del stock físico y digital para detectar inconsistencias de inventario de forma diaria. |
| HU-INV-10 | Como Supervisor Logístico, quiero exportar e importar reportes detallados de rotación de inventarios en formatos CSV/JSON/XML, para respaldar la toma de decisiones. |
| HU-COM-10 | Como Comprador, quiero suscribirme o desuscribirme al boletín promocional y alertas de preventas, para recibir ofertas exclusivas según mi preferencia. |
| HU-VEN-11 | Como Vendedor de Tienda, quiero programar el envío de boletines de ofertas locales a clientes de mi sucursal, para promocionar eventos y liquidaciones. |
| HU-VEN-6 | Como Vendedor de Tienda, quiero recibir alertas visuales de stock crítico en el terminal POS para sugerir productos alternativos al cliente o solicitar reposición. |
| HU-ADM-4 | Como Administrador de Negocio, quiero auditar el registro global de actividades (logs de auditoría) para supervisar transacciones sensibles y cambios de stock. |
| HU-INV-12 | Como Supervisor Logístico, quiero acceder a una bitácora inalterable de entrega de códigos digitales para resolver reclamos por licencias supuestamente no recibidas. |
| HU-ADM-8 | Como Administrador de Negocio, quiero gestionar las llaves de API y credenciales de integración con pasarelas de pago para asegurar el correcto flujo financiero. |
| HU-ADM-10 | Como Administrador de Negocio, quiero visualizar paneles ejecutivos de seguridad, intentos de acceso fallidos e incidentes para tomar medidas preventivas. |
| HU-ADM-11 | Como Administrador de Negocio, quiero establecer las políticas de retención, respaldo y purga de logs y datos históricos, para cumplir con normativas legales y de almacenamiento. |
| HU-ADM-14 | Como Administrador de Negocio, quiero publicar y actualizar los términos, condiciones y políticas de privacidad del comercio, para garantizar el cumplimiento normativo. |
| HU-ADM-13 | Como Administrador de Negocio, quiero definir y autorizar los límites de compra y presupuestos de emergencia asignados a Supervisores, para controlar el gasto operativo. |
| HU-INV-14 | Como Supervisor Logístico, quiero configurar instrucciones especiales de empaque para ediciones de coleccionista o frágiles, para asegurar la protección del producto durante el transporte. |
| HU-INV-15 | Como Supervisor Logístico, quiero monitorear el estado operativo y tiempos de respuesta de las APIs de couriers integrados, para detectar caídas del servicio logístico. |
| HU-VEN-7 | Como Vendedor de Tienda, quiero operar la caja registradora en modo offline ante caídas de internet, para no interrumpir la atención al cliente presencial. |
| HU-ADM-12 | Como Administrador de Negocio, quiero autorizar e iniciar los protocolos de respaldo y recuperación ante desastres (DRP), para asegurar la continuidad operacional ante contingencias. |
| HU-ADM-15 | Como Administrador de Negocio, quiero supervisar las reglas de autoescalado y costos operativos del servidor en la nube durante eventos de alta demanda (CyberDay, lanzamientos), para optimizar el gasto de TI. |

# 

 

# 

# **7\. Refinamiento del Product Backlog** {#7.-refinamiento-del-product-backlog}

## **7.1 Product Backlog Refinado** {#7.1-product-backlog-refinado}

| N° HDU | Historia de Usuario |
| :---: | ----- |
| **HU-ADM-1** | **Como Administrador de Negocio, quiero registrar y gestionar las cuentas de usuarios administrativos (Vendedores, Supervisores Logísticos, TI), para otorgar acceso al personal autorizando sus funciones.** |
| **HU-ADM-2** | **Como Administrador de Negocio, quiero configurar matrices de roles y permisos de acceso granulares (RBAC), para asegurar que cada empleado acceda exclusivamente a los módulos requeridos.** |
| HU-ADM-5 | Como Administrador de Negocio, quiero exigir el uso de contraseñas de alta complejidad y autenticación de dos factores (2FA) para roles administrativos, para blindar el acceso a la plataforma. |
| HU-ADM-6 | Como Administrador de Negocio, quiero vincular y asignar usuarios a sucursal(es) física(s) específica(s), para delimitar sus privilegios operativos según su sede de trabajo. |
| HU-ADM-9 | Como Administrador de Negocio, quiero dar de alta nuevas sucursales físicas y configurar sus parámetros comerciales en el sistema, para respaldar la expansión del negocio. |
| HU-ADM-3 | Como Administrador de Negocio, quiero desactivar de forma inmediata la cuenta de cualquier empleado desvinculado, para revocar todos sus accesos de manera instantánea. |
| **HU-ADM-7** | **Como Administrador de Negocio, quiero realizar el reseteo administrativo de credenciales y desbloquear cuentas suspendidas, para restablecer el acceso a personal bloqueado.** |
| **HU-COM-11** | **Como Comprador, quiero registrarme e iniciar sesión con credenciales seguras, para guardar mis datos de envío y preferencias de compra.** |
| HU-VEN-12 | Como Vendedor de Tienda, quiero autenticarme en la terminal POS con mi usuario individual, para registrar la responsabilidad de cada transacción procesada. |
| **HU-COM-13** | **Como Comprador, quiero solicitar la recuperación de mi contraseña mediante un enlace verificado por correo, para restablecer mi acceso de forma segura.** |
| **HU-INV-3** | **Como Supervisor Logístico, quiero registrar el ingreso de reabastecimientos de mercadería física por proveedor y sucursal, para mantener actualizado el stock físico.** |
| **HU-INV-1** | **Como Supervisor Logístico, quiero realizar cargas masivas de lotes de licencias digitales mediante archivos CSV o JSON, para poblar el inventario virtual.** |
| **HU-INV-4** | **Como Supervisor Logístico, quiero configurar el umbral de stock crítico y reorden automático por SKU, para prevenir el desabastecimiento de juegos populares.** |
| **HU-VEN-1** | **Como Vendedor de Tienda, quiero consultar el stock disponible en tiempo real en las 3 sucursales y la tienda web, para orientar al cliente presencial.** |
| HU-COM-1 | Como Comprador, quiero navegar y filtrar los videojuegos por consola, género y rango de precio, para encontrar rápidamente los títulos de mi interés. |
| **HU-COM-2** | **Como Comprador, quiero visualizar la ficha técnica detallada de cada producto con imágenes y tráilers, para evaluar los juegos antes de comprarlos.** |
| HU-VEN-8 | Como Vendedor de Tienda, quiero buscar productos rápidamente escaneando su código de barras o SKU, para agilizar la atención en fila. |
| HU-INV-2 | Como Supervisor Logístico, quiero auditar las claves digitales almacenadas verificando que estén encriptadas y sin duplicaciones, para garantizar la seguridad del inventario virtual. |
| HU-INV-13 | Como Supervisor Logístico, quiero gestionar el catálogo de proveedores de consolas y distribuidores oficiales, para centralizar las órdenes de compra de reabastecimiento. |
| **HU-VEN-2** | **Como Vendedor de Tienda, quiero registrar ventas presenciales en el punto de venta (POS) con actualización inmediata de inventario, para procesar transacciones en caja.** |
| HU-VEN-4 | Como Vendedor de Tienda, quiero emitir e imprimir boletas o vales de venta desde la terminal de caja, para entregar comprobantes físicos al cliente. |
| HU-VEN-13 | Como Vendedor de Tienda, quiero realizar el arqueo y cierre diario de caja comparando efectivo y vales de tarjeta, para cuadrar los ingresos de mi turno. |
| HU-VEN-5 | Como Vendedor de Tienda, quiero verificar la disponibilidad e imprimir/enviar códigos de licencias digitales vendidas en mostrador, para atender compras digitales en tienda física. |
| HU-COM-3 | Como Comprador, quiero agregar productos físicos y licencias digitales a un carrito de compras unificado, para realizar una sola transacción de pago. |
| HU-COM-4 | Como Comprador, quiero pagar de forma segura mediante pasarelas de pago integradas (Webpay / MercadoPago), para completar mi compra de manera confiable. |
| **HU-COM-5** | **Como Comprador, quiero recibir una boleta electrónica automática por correo electrónico, para respaldar legalmente mi compra.** |
| HU-VEN-3 | Como Vendedor de Tienda, quiero reservar stock temporalmente para clientes que soliciten compras telefónicas, para asegurar el producto durante 24 horas. |
| HU-VEN-14 | Como Vendedor de Tienda, quiero emitir e imprimir cotizaciones formales para clientes presenciales, para ofrecer presupuestos válidos por tiempo determinado. |
| **HU-COM-6** | **Como Comprador, quiero recibir de forma inmediata y automática mis claves digitales por correo y en mi perfil, para activar mis juegos de inmediato.** |
| **HU-COM-7** | **Como Comprador, quiero seleccionar entre envío a domicilio o retiro presencial en cualquiera de las 3 sucursales, para elegir la opción logística más conveniente.** |
| HU-INV-5 | Como Supervisor Logístico, quiero generar e imprimir etiquetas de despacho y código de barras en formato PDF, para agilizar el embalaje de pedidos web. |
| HU-INV-6 | Como Supervisor Logístico, quiero integrar el sistema con las API de los couriers de despacho externos, para automatizar la cotización y generación de guías. |
| HU-INV-7 | Como Supervisor Logístico, quiero registrar el código de seguimiento de envío en cada pedido embalado, para notificar automáticamente al cliente. |
| **HU-COM-8** | **Como Comprador, quiero realizar el seguimiento en tiempo real del estado de mi despacho mediante un código de rastreo, para saber cuándo llegará mi paquete.** |
| HU-VEN-15 | Como Vendedor de Tienda, quiero validar y entregar órdenes de compra web con modalidad retiro en tienda, para completar la entrega presencial al comprador. |
| HU-VEN-10 | Como Vendedor de Tienda, quiero solicitar traslados internos de mercadería desde otra sucursal, para satisfacer la demanda de un cliente local. |
| HU-INV-11 | Como Supervisor Logístico, quiero autorizar y coordinar la transferencia física de productos entre bodegas de sucursales, para balancear la disponibilidad geográfica. |
| HU-COM-9 | Como Comprador, quiero consultar mi historial de compras y mi bóveda personal de claves digitales adquiridas, para acceder a mis juegos en cualquier momento. |
| **HU-VEN-9** | **Como Vendedor de Tienda, quiero procesar cambios y devoluciones de productos físicos según las políticas de garantía, para gestionar la satisfacción del cliente.** |
| HU-COM-12 | Como Comprador, quiero publicar valoraciones y reseñas en los juegos que he comprado, para compartir mi opinión con la comunidad gamer. |
| HU-COM-14 | Como Comprador, quiero solicitar una alerta por correo cuando un producto agotado vuelva a tener stock disponible, para comprarlo oportunamente. |
| HU-COM-15 | Como Comprador, quiero filtrar los productos por idioma de subtítulos y región de activación de la consola, para evitar comprar contenido incompatible. |
| HU-INV-9 | Como Supervisor Logístico, quiero registrar mermas, productos dañados o extravíos con su justificación técnica, para mantener la transparencia del inventario real. |
| **HU-INV-8** | **Como Supervisor Logístico, quiero ejecutar el proceso de conciliación nocturna entre stock físico, reservado y en tránsito, para corregir descuadres de inventario.** |
| HU-INV-10 | Como Supervisor Logístico, quiero exportar e importar reportes detallados de rotación de inventarios en formatos CSV/JSON/XML, para respaldar la toma de decisiones. |
| HU-COM-10 | Como Comprador, quiero suscribirme o desuscribirme al boletín promocional y alertas de preventas, para recibir ofertas exclusivas según mi preferencia. |
| HU-VEN-11 | Como Vendedor de Tienda, quiero programar el envío de boletines de ofertas locales a clientes de mi sucursal, para promocionar eventos y liquidaciones. |
| **HU-VEN-6** | **Como Vendedor de Tienda, quiero visualizar alertas automáticas en pantalla cuando un producto alcance su nivel de stock crítico, para solicitar reabastecimiento a bodega.** |
| **HU-ADM-4** | **Como Administrador de Negocio, quiero revisar la bitácora central de auditoría del sistema (log de eventos), para supervisar las acciones críticas realizadas por los usuarios internos.** |
| **HU-INV-12** | **Como Supervisor Logístico, quiero consultar la bitácora inalterable de despacho de códigos digitales por cliente y orden, para resolver disputas o reclamos por claves no funcionales.** |
| **HU-ADM-8** | **Como Administrador de Negocio, quiero gestionar las llaves API y credenciales de integración con pasarelas de pago y servicios externos, para mantener activa la cobranza digital.** |
| **HU-ADM-10** | **Como Administrador de Negocio, quiero visualizar un panel ejecutivo de KPIs de seguridad, intentos de vulneración y disponibilidad de infraestructura, para tomar decisiones de riesgo.** |
| HU-ADM-11 | Como Administrador de Negocio, quiero establecer las políticas de retención, respaldo y purga de logs y datos históricos, para cumplir con normativas legales y de almacenamiento. |
| HU-ADM-14 | Como Administrador de Negocio, quiero publicar y actualizar los términos, condiciones y políticas de privacidad del comercio, para garantizar el cumplimiento normativo. |
| HU-ADM-13 | Como Administrador de Negocio, quiero definir y autorizar los límites de compra y presupuestos de emergencia asignados a Supervisores, para controlar el gasto operativo. |
| HU-INV-14 | Como Supervisor Logístico, quiero configurar instrucciones especiales de empaque para ediciones de coleccionista o frágiles, para asegurar la protección del producto durante el transporte. |
| HU-INV-15 | Como Supervisor Logístico, quiero monitorear el estado operativo y tiempos de respuesta de las APIs de couriers integrados, para detectar caídas del servicio logístico. |
| HU-VEN-7 | Como Vendedor de Tienda, quiero operar la caja registradora en modo offline ante caídas de internet, para no interrumpir la atención al cliente presencial. |
| HU-ADM-12 | Como Administrador de Negocio, quiero autorizar e iniciar los protocolos de respaldo y recuperación ante desastres (DRP), para asegurar la continuidad operacional ante contingencias. |
| HU-ADM-15 | Como Administrador de Negocio, quiero supervisar las reglas de autoescalado y costos operativos del servidor en la nube durante eventos de alta demanda (CyberDay, lanzamientos), para optimizar el gasto de TI. |

# 

# **8\. Estimación de Esfuerzo de las Tareas**  {#8.-estimación-de-esfuerzo-de-las-tareas}

## **8.1 Estimación de Esfuerzo de las Tareas** {#8.1-estimación-de-esfuerzo-de-las-tareas}

| ID | Historia de Usuario | Talla | Fibonacci |
| :---: | ----- | ----- | ----- |
| HU-ADM-1 | Como Administrador de Negocio, quiero registrar y gestionar las cuentas de usuarios administrativos (Vendedores, Supervisores Logísticos, TI), para otorgar acceso al personal autorizando sus funciones. | S | 3 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Formulario de alta exige asignación de Rol, Sucursal, Nombre completo, RUT e Email corporativo. | Requisito Funcional (RF-12 / RNF-23) |  |
| CA-2 | Envía invitación por correo al nuevo empleado para la creación de su contraseña inicial. | Requisito No Funcional (RNF-18) |  |
| CA-3 | Mantiene registro histórico de todas las cuentas administrativas creadas y sus modificaciones. | Requisito No Funcional (RNF-33) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-ADM-2 | Como Administrador de Negocio, quiero configurar matrices de roles y permisos de acceso granulares (RBAC), para asegurar que cada empleado acceda exclusivamente a los módulos requeridos. | M | 5 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Permite activar o desactivar permisos específicos (Crear, Leer, Actualizar, Borrar) por cada módulo del sistema. | Requisito No Funcional (RNF-23) |  |
| CA-2 | Garantiza que los Vendedores no puedan modificar precios ni acceder a claves encriptadas en lote. | Requisito No Funcional (RNF-22) |  |
| CA-3 | Los cambios en los permisos se aplican de forma inmediata en la sesión del usuario afectado. | Requisito No Funcional (RNF-24) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-ADM-5 | Como Administrador de Negocio, quiero exigir el uso de contraseñas de alta complejidad y autenticación de dos factores (2FA) para roles administrativos, para blindar el acceso a la plataforma. | S | 3 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Política exige contraseñas de mínimo 12 caracteres, mayúsculas, minúsculas, números y símbolos. | Requisito No Funcional (RNF-23) |  |
| CA-2 | Configura la obligación de enrolar app autenticadora (Google Authenticator/Authy) para login administrativo. | Requisito No Funcional (RNF-23) |  |
| CA-3 | Forzará la expiración y cambio de contraseña cada 90 días calendario. | Requisito No Funcional (RNF-20) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-ADM-6 | Como Administrador de Negocio, quiero vincular y asignar usuarios a sucursal(es) física(s) específica(s), para delimitar sus privilegios operativos según su sede de trabajo. | S | 2 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Permite seleccionar una o múltiples tiendas físicas a las que estará restringido un Vendedor o Supervisor. | Regla de Negocio / Sucursal |  |
| CA-2 | Impide que un vendedor opere la caja registradora de una sucursal a la que no está asignado. | Requisito No Funcional (RNF-33) |  |
| CA-3 | Facilita la reasignación temporal de personal entre tiendas físicas ante reemplazos. | Requisito Funcional (RF-7) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-ADM-9 | Como Administrador de Negocio, quiero dar de alta nuevas sucursales físicas y configurar sus parámetros comerciales en el sistema, para respaldar la expansión del negocio. | M | 5 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Formulario de alta de sucursal registra Nombre, Dirección, Teléfono, Comuna y Cajas POS autorizadas. | Requisito No Funcional (RNF-33) |  |
| CA-2 | Crea automáticamente la bodega virtual asociada a la nueva sucursal para gestión de inventarios. | Requisito No Funcional (RNF-42) |  |
| CA-3 | Integra la nueva tienda en la matriz global de stock y opciones de retiro en web. | Requisito Funcional (RF-6) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-ADM-3 | Como Administrador de Negocio, quiero desactivar de forma inmediata la cuenta de cualquier empleado desvinculado, para revocar todos sus accesos de manera instantánea. | XS | 2 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Botonera de acción rápida en la lista de usuarios permite cambiar estado a 'Inactivo' con un clic. | Regla de Negocio / Desactivación |  |
| CA-2 | Cierra automáticamente cualquier sesión activa del usuario en el POS o panel web en \< 1 segundo. | Requisito No Funcional (RNF-23) |  |
| CA-3 | Impide el inicio de sesión del usuario revocado mostrando un mensaje de cuenta suspendida. | Requisito No Funcional (RNF-05) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-ADM-7 | Como Administrador de Negocio, quiero realizar el reseteo administrativo de credenciales y desbloquear cuentas suspendidas, para restablecer el acceso a personal bloqueado. | XS | 2 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Permite generar una clave temporal de un solo uso para empleados con cuenta bloqueada. | Requisito No Funcional (RNF-23) |  |
| CA-2 | Exige el cambio obligatorio de la clave temporal en el primer inicio de sesión del usuario. | Requisito No Funcional (RNF-18) |  |
| CA-3 | Registra el evento de reseteo administrativo en la bitácora de auditoría indicando el autor. | Requisito No Funcional (RNF-24) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-COM-11 | Como Comprador, quiero registrarme e iniciar sesión con credenciales seguras, para guardar mis datos de envío y preferencias de compra. | S | 2 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Formulario exige campos válidos: Nombre, RUT/DNI, Email único, Teléfono y Contraseña segura. | Requisito Funcional (RF-12) |  |
| CA-2 | Almacena contraseñas bajo hash seguro (Argon2 / bcrypt) con salado individual. | Requisito No Funcional (RNF-23) |  |
| CA-3 | Permite inicio de sesión rápido con OAuth 2.0 (Google / Facebook / Apple ID). | Requisito No Funcional (RNF-20) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-VEN-12 | Como Vendedor de Tienda, quiero autenticarme en la terminal POS con mi usuario individual, para registrar la responsabilidad de cada transacción procesada. | S | 2 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Exige login individual con credencial y PIN rápido de 4 dígitos para cajeros. | Requisito No Funcional (RNF-23) |  |
| CA-2 | Bloquea la terminal POS tras 3 minutos de inactividad de uso en mostrador. | Requisito No Funcional (RNF-24) |  |
| CA-3 | Registra el ID del vendedor en cada boleta y movimiento de inventario realizado. | Requisito No Funcional (RNF-05) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-COM-13 | Como Comprador, quiero solicitar la recuperación de mi contraseña mediante un enlace verificado por correo, para restablecer mi acceso de forma segura. | S | 2 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Envía un token criptográfico de recuperación al correo registrado con validez de 15 minutos. | Regla de Negocio / RNF-22 |  |
| CA-2 | El enlace expira inmediatamente tras ser utilizado una vez para cambiar la clave. | Requisito No Funcional (RNF-10) |  |
| CA-3 | No revela si el correo ingresado existe o no en el sistema por motivos de seguridad. | Requisito No Funcional (RNF-22) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-INV-3 | Como Supervisor Logístico, quiero registrar el ingreso de reabastecimientos de mercadería física por proveedor y sucursal, para mantener actualizado el stock físico. | M | 5 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Ingresa órdenes de recepción asociadas a factura de proveedor sumando unidades a bodega. | Requisito Funcional (RF-9) |  |
| CA-2 | Actualiza inmediatamente la disponibilidad global en el catálogo web y sucursales físicas. | Requisito No Funcional (RNF-08) |  |
| CA-3 | Imprime guía de recepción interna con firma de responsabilidad del bodeguero. | Requisito Funcional (RF-6) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-INV-1 | Como Supervisor Logístico, quiero realizar cargas masivas de lotes de licencias digitales mediante archivos CSV o JSON, para poblar el inventario virtual. | M | 5 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Procesa archivos masivos validando la estructura del SKU, formato de clave y duplicados en \< 5s. | Requisito Funcional (RF-18 / RNF-22) |  |
| CA-2 | Encripta automáticamente las claves con algoritmo AES-256 antes de guardarlas en base de datos. | Requisito No Funcional (RNF-22) |  |
| CA-3 | Genera un reporte de carga indicando registros exitosos y fallidos con su detalle de error. | Requisito No Funcional (RNF-12) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-INV-4 | Como Supervisor Logístico, quiero configurar el umbral de stock crítico y reorden automático por SKU, para prevenir el desabastecimiento de juegos populares. | S | 3 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Permite definir el mínimo de unidades permitidas para cada producto físico por tienda. | Requisito Funcional (RF-10) |  |
| CA-2 | Emite alertas por correo y notificación en panel cuando el inventario cruce el umbral mínimo. | Requisito Funcional (RF-10) |  |
| CA-3 | Sugiere automáticamente la cantidad de unidades a pedir al proveedor según velocidad de venta. | Requisito No Funcional (RNF-02) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-VEN-1 | Como Vendedor de Tienda, quiero consultar el stock disponible en tiempo real en las 3 sucursales y la tienda web, para orientar al cliente presencial. | S | 3 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Despliega matriz de stock diferenciada por tienda física (Sucursal 1, 2, 3\) y bodega e-commerce. | Requisito Funcional (RF-6) |  |
| CA-2 | La consulta responde en un tiempo máximo de 1.0 segundo desde la interfaz del POS. | Requisito No Funcional (RNF-15) |  |
| CA-3 | Indica si hay unidades en tránsito o reservadas en otras tiendas. | Requisito No Funcional (RNF-02) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-COM-1 | Como Comprador, quiero navegar y filtrar los videojuegos por consola, género y rango de precio, para encontrar rápidamente los títulos de mi interés. | M | 5 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Permite aplicar filtros combinados (PS5, Xbox, Switch, PC, Rango Precio) refrescando catálogo en menos de 1.5 segundos. | Requisito Funcional (RF-3 / RNF-20) |  |
| CA-2 | Muestra contador exacto de resultados encontrados y botón para limpiar todos los filtros aplicados. | Requisito Funcional (RF-5) |  |
| CA-3 | Si no hay resultados que coincidan, muestra sugerencias de títulos populares alternativos. | Regla de Negocio / Usabilidad (RNF-13) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-COM-2 | Como Comprador, quiero visualizar la ficha técnica detallada de cada producto con imágenes y tráilers, para evaluar los juegos antes de comprarlos. | S | 3 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Despliega ficha completa con sinopsis, idioma de voces/subtítulos, clasificación de edad y tráiler de YouTube. | Requisito Funcional (RF-1 / RF-2) |  |
| CA-2 | Muestra disponibilidad de stock diferenciada para edición física (por tienda) y digital. | Requisito Funcional (RF-6) |  |
| CA-3 | Las imágenes de alta resolución cargan de forma diferida (lazy loading) sin degradar el rendimiento. | Requisito No Funcional (RNF-30) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-VEN-8 | Como Vendedor de Tienda, quiero buscar productos rápidamente escaneando su código de barras o SKU, para agilizar la atención en fila. | XS | 2 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Soporta lectores de código de barras USB/Bluetooth estándar cargando el producto en \< 0.3s. | Requisito Funcional (RF-1) |  |
| CA-2 | Si el código no existe, emite un pitido de error y abre la búsqueda manual por nombre. | Requisito No Funcional (RNF-15) |  |
| CA-3 | Permite sumar unidades automáticamente con cada escaneo sucesivo del mismo producto. | Requisito Funcional (RF-4) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-INV-2 | Como Supervisor Logístico, quiero auditar las claves digitales almacenadas verificando que estén encriptadas y sin duplicaciones, para garantizar la seguridad del inventario virtual. | M | 5 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Modulo de auditoría ejecuta escaneo de integridad detectando códigos expuestos o corruptos. | Requisito Funcional (RF-19) |  |
| CA-2 | Muestra resumen de claves: Disponibles, Asignadas, Revocadas y Corruptas por SKU. | Requisito Funcional (RF-21) |  |
| CA-3 | Bloquea automáticamente cualquier lote que presente inconsistencias en su firma criptográfica. | Requisito No Funcional (RNF-07) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-INV-13 | Como Supervisor Logístico, quiero gestionar el catálogo de proveedores de consolas y distribuidores oficiales, para centralizar las órdenes de compra de reabastecimiento. | S | 3 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Mantenedor CRUD de proveedores (RUT, Razón Social, Contacto, Tiempos de Entrega). | Requisito Funcional (RF-1) |  |
| CA-2 | Asocia productos del catálogo a sus proveedores principales y alternativos. | Requisito No Funcional (RNF-12) |  |
| CA-3 | Registra evaluación de cumplimiento de entregas por parte de cada proveedor. | Requisito No Funcional (RNF-23) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-VEN-2 | Como Vendedor de Tienda, quiero registrar ventas presenciales en el punto de venta (POS) con actualización inmediata de inventario, para procesar transacciones en caja. | M | 5 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Permite agregar productos escaneando código de barras o búsqueda rápida por SKU. | Requisito Funcional (RF-7) |  |
| CA-2 | Descuenta el stock físico local de inmediato en la base de datos al presionar 'Finalizar Venta'. | Requisito No Funcional (RNF-14) |  |
| CA-3 | Admite múltiples medios de pago combinados (Efectivo, Tarjeta Débito/Crédito, Transferencia). | Requisito No Funcional (RNF-07) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-VEN-4 | Como Vendedor de Tienda, quiero emitir e imprimir boletas o vales de venta desde la terminal de caja, para entregar comprobantes físicos al cliente. | XS | 2 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Envía la orden de impresión a la impresora térmica local en menos de 2 segundos. | Requisito No Funcional (RNF-39) |  |
| CA-2 | Registra el folio de la boleta electrónica asociada al Servicio de Impuestos Internos. | Requisito Funcional (RF-16) |  |
| CA-3 | Imprime código QR para verificación tributaria y clave de devolución. | Requisito No Funcional (RNF-04) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-VEN-13 | Como Vendedor de Tienda, quiero realizar el arqueo y cierre diario de caja comparando efectivo y vales de tarjeta, para cuadrar los ingresos de mi turno. | S | 3 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Genera el reporte Z de cierre de caja sumando ventas por medio de pago (Efectivo, Débito, Crédito). | Regla de Negocio / Contabilidad |  |
| CA-2 | Registra sobrantes o faltantes de dinero solicitando clave del administrador para cuadres con descalce. | Requisito No Funcional (RNF-09) |  |
| CA-3 | Envía el resumen del cierre contable al correo del Administrador al cerrar turno. | Requisito No Funcional (RNF-39) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-VEN-5 | Como Vendedor de Tienda, quiero verificar la disponibilidad e imprimir/enviar códigos de licencias digitales vendidas en mostrador, para atender compras digitales en tienda física. | S | 3 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Al cobrar un juego digital en caja, desacopla y asigna una clave de la base central encriptada. | Requisito Funcional (RF-19) |  |
| CA-2 | Imprime la clave digital en el voucher físico o la envía al correo del cliente instantáneamente. | Requisito Funcional (RF-20) |  |
| CA-3 | La clave entregada queda marcada como 'Entregada en Tienda' en la bitácora de auditoría. | Requisito No Funcional (RNF-22) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-COM-3 | Como Comprador, quiero agregar productos físicos y licencias digitales a un carrito de compras unificado, para realizar una sola transacción de pago. | M | 5 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | El carrito calcula subtotal, impuestos y costo estimado de despacho de manera dinámica. | Requisito Funcional (RF-13) |  |
| CA-2 | Reserva el stock del producto físico en bodega durante 15 minutos mientras el comprador está en checkout. | Regla de Negocio (RNF-25) |  |
| CA-3 | Permite modificar cantidades o eliminar ítems sin perder la sesión de compra. | Requisito Funcional (RF-11) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-COM-4 | Como Comprador, quiero pagar de forma segura mediante pasarelas de pago integradas (Webpay / MercadoPago), para completar mi compra de manera confiable. | L | 8 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Soporta tarjetas de débito, crédito y transferencias bancarias con encriptación TLS 1.3. | Requisito No Funcional (RNF-10 / RNF-21) |  |
| CA-2 | Si el pago es rechazado, libera inmediatamente la reserva de stock y notifica al cliente la causa. | Requisito Funcional (RF-14 / RF-15) |  |
| CA-3 | Al confirmarse el pago, genera una orden de compra única con estado 'Pagado' en menos de 3 segundos. | Requisito Funcional (RF-15 / RNF-20) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-COM-5 | Como Comprador, quiero recibir una boleta electrónica automática por correo electrónico, para respaldar legalmente mi compra. | S | 2 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Genera el documento tributario electrónico (PDF y XML) adjunto en el correo de confirmación. | Requisito Funcional (RF-16) |  |
| CA-2 | El correo se envía en un lapso no mayor a 30 segundos posterior a la autorización del pago. | Requisito No Funcional (RNF-18) |  |
| CA-3 | La boleta incluye el desglose detallado de impuestos (IVA 19%) y números de serie de productos. | Regla de Negocio / Tributaria (RNF-39) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-VEN-3 | Como Vendedor de Tienda, quiero reservar stock temporalmente para clientes que soliciten compras telefónicas, para asegurar el producto durante 24 horas. | M | 5 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Genera una orden de reserva asociada al RUT y teléfono del cliente presencial/telefónico. | Requisito Funcional (RF-6 / RF-11) |  |
| CA-2 | El stock reservado queda bloqueado para venta web y otras sucursales por exactamente 24 horas. | Regla de Negocio / 24 Horas |  |
| CA-3 | Si la reserva no se concreta en 24 horas, el sistema libera automáticamente el stock a inventario disponible. | Requisito No Funcional (RNF-24) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-VEN-14 | Como Vendedor de Tienda, quiero emitir e imprimir cotizaciones formales para clientes presenciales, para ofrecer presupuestos válidos por tiempo determinado. | S | 2 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Genera un documento PDF de cotización con vigencia de 5 días hábiles y congelamiento de precio. | Requisito Funcional (RF-1) |  |
| CA-2 | Permite convertir la cotización directamente en venta presencial recuperando el folio. | Requisito Funcional (RF-20) |  |
| CA-3 | La cotización no reserva stock físico hasta convertirse en venta o reserva formal. | Requisito No Funcional (RNF-18) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-COM-6 | Como Comprador, quiero recibir de forma inmediata y automática mis claves digitales por correo y en mi perfil, para activar mis juegos de inmediato. | M | 5 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Envía la clave digital encriptada al correo y la hace visible en el panel del cliente tras el pago autorizado. | Requisito Funcional (RF-20) |  |
| CA-2 | Cada clave digital es asignada de forma única e irreversible desde la base de claves desencriptadas. | Requisito Funcional (RF-19) |  |
| CA-3 | La clave en pantalla incluye instrucciones paso a paso para canje en PSN, Xbox Live o Steam. | Regla de Negocio / RNF-22 |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-COM-7 | Como Comprador, quiero seleccionar entre envío a domicilio o retiro presencial en cualquiera de las 3 sucursales, para elegir la opción logística más conveniente. | S | 3 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Si elige retiro en tienda, muestra el stock disponible en cada una de las 3 sucursales físicas. | Requisito Funcional (RF-23) |  |
| CA-2 | Si elige envío a domicilio, calcula el costo de flete según comuna mediante integración con courier. | Requisito Funcional (RF-25) |  |
| CA-3 | Para retiro en tienda, el producto queda reservado para entrega en un máximo de 2 horas hábiles. | Regla de Negocio (RNF-11) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-INV-5 | Como Supervisor Logístico, quiero generar e imprimir etiquetas de despacho y código de barras en formato PDF, para agilizar el embalaje de pedidos web. | S | 3 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Genera PDF listo para impresión térmica con datos de remitente, destinatario y código de barras del pedido. | Requisito Funcional (RF-24) |  |
| CA-2 | Incluye resumen de empaque (packing slip) con el detalle de ítems que deben ir dentro de la caja. | Requisito Funcional (RF-23) |  |
| CA-3 | Procesa la generación del archivo PDF en menos de 1.0 segundo. | Requisito No Funcional (RNF-06) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-INV-6 | Como Supervisor Logístico, quiero integrar el sistema con las API de los couriers de despacho externos, para automatizar la cotización y generación de guías. | L | 8 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Conecta vía API REST con Starken, Chilexpress y Blue Express para consultar tarifas dinámicas. | Requisito Funcional (RF-25) |  |
| CA-2 | Solicita automáticamente la recolección en bodega al cambiar el estado del lote a 'Listo para Despacho'. | Requisito No Funcional (RNF-11) |  |
| CA-3 | Maneja respuestas de fallback si la API de un courier se encuentra fuera de servicio. | Requisito No Funcional (RNF-21) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-INV-7 | Como Supervisor Logístico, quiero registrar el código de seguimiento de envío en cada pedido embalado, para notificar automáticamente al cliente. | S | 3 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Permite escaneo del código de barras de la guía del courier asociándolo a la orden web. | Requisito Funcional (RF-26) |  |
| CA-2 | Dispara el correo de confirmación de despacho al comprador con el enlace directo al rastreo. | Requisito Funcional (RF-27) |  |
| CA-3 | Cambia el estado del pedido a 'Despachado' actualizando la vista del cliente. | Requisito No Funcional (RNF-18) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-COM-8 | Como Comprador, quiero realizar el seguimiento en tiempo real del estado de mi despacho mediante un código de rastreo, para saber cuándo llegará mi paquete. | S | 3 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Notifica por correo el número de seguimiento (Tracking ID) cuando el paquete sea entregado al courier. | Requisito Funcional (RF-27) |  |
| CA-2 | Despliega una línea de tiempo interactiva con los estados: Preparación, En Tránsito, En Reparto, Entregado. | Requisito Funcional (RF-26) |  |
| CA-3 | La información de seguimiento se actualiza vía API externa cada 30 minutos. | Requisito No Funcional (RNF-01) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-VEN-15 | Como Vendedor de Tienda, quiero validar y entregar órdenes de compra web con modalidad retiro en tienda, para completar la entrega presencial al comprador. | S | 2 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Permite buscar la orden por código de retiro o RUT del cliente y verificar su pago en sistema. | Requisito Funcional (RF-23) |  |
| CA-2 | Exige la firma digital en pantalla o escaneo de cédula para confirmar la entrega del paquete. | Regla de Negocio / Retiro |  |
| CA-3 | Actualiza el estado de la orden web a 'Entregado en Sucursal' de forma simultánea. | Requisito No Funcional (RNF-15) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-VEN-10 | Como Vendedor de Tienda, quiero solicitar traslados internos de mercadería desde otra sucursal, para satisfacer la demanda de un cliente local. | S | 3 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Crea una solicitud de traspaso indicando sucursal origen, destino y producto requerido. | Requisito Funcional (RF-6) |  |
| CA-2 | Notifica al Supervisor Logístico de la sucursal origen para aprobación de despacho. | Regla de Negocio / Traslados |  |
| CA-3 | Mantiene la orden en estado 'En Tránsito Inter-Sucursal' hasta su recepción física. | Requisito No Funcional (RNF-14) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-INV-11 | Como Supervisor Logístico, quiero autorizar y coordinar la transferencia física de productos entre bodegas de sucursales, para balancear la disponibilidad geográfica. | S | 3 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Módulo de traspasos permite aprobar o rechazar solicitudes de traslado enviadas por vendedores. | Regla de Negocio / Traslado |  |
| CA-2 | Imprime guía de despacho interna para el transportista de la empresa. | Requisito Funcional (RF-24) |  |
| CA-3 | Mantiene las unidades en estado 'En Tránsito' previniendo su venta durante el viaje. | Requisito No Funcional (RNF-14) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-COM-9 | Como Comprador, quiero consultar mi historial de compras y mi bóveda personal de claves digitales adquiridas, para acceder a mis juegos en cualquier momento. | S | 3 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Muestra la lista de todos los pedidos históricos ordenados cronológicamente con filtro por fecha. | Requisito Funcional (RF-17) |  |
| CA-2 | Permite revelar y copiar el código de licencias digitales adquiridas previa re-autenticación. | Requisito No Funcional (RNF-27 / RNF-22) |  |
| CA-3 | Permite re-descargar las boletas electrónicas de compras pasadas en formato PDF. | Requisito No Funcional (RNF-26) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-VEN-9 | Como Vendedor de Tienda, quiero procesar cambios y devoluciones de productos físicos según las políticas de garantía, para gestionar la satisfacción del cliente. | M | 5 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Valida la boleta de compra original mediante escaneo del folio dentro del plazo legal de 10 días. | Regla de Negocio / Garantía |  |
| CA-2 | Reingresa el producto físico al inventario de la tienda y emite nota de crédito automática. | Requisito Funcional (RF-7) |  |
| CA-3 | No permite devolución de juegos digitales cuyo código ya haya sido revelado o enviado. | Regla de Negocio / RNF-08 |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-COM-12 | Como Comprador, quiero publicar valoraciones y reseñas en los juegos que he comprado, para compartir mi opinión con la comunidad gamer. | S | 2 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Solo permite calificar (1 a 5 estrellas) y comentar a usuarios con orden confirmada de dicho juego ('Comprador Verificado'). | Regla de Negocio / Calidad |  |
| CA-2 | Las reseñas pasan por un filtro automático de lenguaje inapropiado antes de su publicación. | Requisito No Funcional (RNF-29) |  |
| CA-3 | Calcula y muestra el promedio ponderado de estrellas en la ficha del producto instantáneamente. | Requisito Funcional (RF-20) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-COM-14 | Como Comprador, quiero solicitar una alerta por correo cuando un producto agotado vuelva a tener stock disponible, para comprarlo oportunamente. | S | 3 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Habilita el botón 'Avisarme cuando haya stock' en fichas de productos con inventario cero. | Requisito Funcional (RF-4) |  |
| CA-2 | Dispara correos automáticos en lote a los suscriptores cuando el stock sea \> 0 en bodega web. | Requisito Funcional (RF-10) |  |
| CA-3 | Las alertas respetan el orden de registro de la lista de espera prioritariamente. | Requisito No Funcional (RNF-14) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-COM-15 | Como Comprador, quiero filtrar los productos por idioma de subtítulos y región de activación de la consola, para evitar comprar contenido incompatible. | XS | 2 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Permite filtrar juegos digitales por Región (Global, EE.UU., LATAM, Europa). | Requisito Funcional (RF-3) |  |
| CA-2 | Muestra una advertencia destacada en rojo si la región del juego no coincide con la región de la cuenta del usuario. | Regla de Negocio / Usabilidad |  |
| CA-3 | Garantiza la precisión de la información técnica del catálogo en un 100%. | Requisito No Funcional (RNF-36) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-INV-9 | Como Supervisor Logístico, quiero registrar mermas, productos dañados o extravíos con su justificación técnica, para mantener la transparencia del inventario real. | S | 3 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Formulario de ajuste exige seleccionar motivo (Merma, Daño, Hurto, Error Conteo) y adjuntar evidencia. | Requisito Funcional (RF-9) |  |
| CA-2 | Requiere aprobación digital del Administrador para ajustes superiores a 5 unidades o \$100.000. | Regla de Negocio / Control |  |
| CA-3 | Refleja la baja de inventario inmediatamente en la disponibilidad para venta. | Requisito No Funcional (RNF-24) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-INV-8 | Como Supervisor Logístico, quiero ejecutar el proceso de conciliación nocturna entre stock físico, reservado y en tránsito, para corregir descuadres de inventario. | M | 5 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Proceso Batch automático se ejecuta a las 23:59 hrs comparando registros contables e inventarios. | Requisito No Funcional (RNF-09) |  |
| CA-2 | Identifica desviaciones entre reservas expiradas no liberadas y corrige saldos automáticamente. | Requisito No Funcional (RNF-09) |  |
| CA-3 | Genera informe de auditoría con las variaciones detectadas enviándolo a Logística y Administración. | Requisito No Funcional (RNF-08) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-INV-10 | Como Supervisor Logístico, quiero exportar e importar reportes detallados de rotación de inventarios en formatos CSV/JSON/XML, para respaldar la toma de decisiones. | M | 5 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Exporta datos completos de stock, entradas, salidas y días de inventario en \< 3 segundos. | Requisito No Funcional (RNF-12) |  |
| CA-2 | Permite filtrado de exportación por rango de fechas, categoría de juego y sucursal. | Requisito No Funcional (RNF-35) |  |
| CA-3 | El archivo generado cumple con estándares de encriptación para resguardo de información comercial. | Requisito No Funcional (RNF-29) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-COM-10 | Como Comprador, quiero suscribirme o desuscribirme al boletín promocional y alertas de preventas, para recibir ofertas exclusivas según mi preferencia. | XS | 1 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Incluye casilla opt-in en el registro y en el perfil de usuario para gestionar suscripciones. | Requisito Funcional (RF-28) |  |
| CA-2 | Cada correo publicitario enviado incluye un enlace funcional de suscripción en un solo clic. | Requisito Funcional (RF-30) |  |
| CA-3 | Sincroniza el estado de preferencia promocional en la base de datos en tiempo real. | Requisito No Funcional (RNF-38) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-VEN-11 | Como Vendedor de Tienda, quiero programar el envío de boletines de ofertas locales a clientes de mi sucursal, para promocionar eventos y liquidaciones. | M | 5 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Permite seleccionar plantilla de oferta local y grupo de clientes adscritos a dicha tienda. | Requisito Funcional (RF-29) |  |
| CA-2 | Envía la campaña publicitaria respetando la lista de desuscritos (opt-out). | Requisito Funcional (RF-28) |  |
| CA-3 | Proporciona métricas de apertura y clics de la campaña enviada. | Requisito No Funcional (RNF-38) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-VEN-6 | Como Vendedor de Tienda, quiero visualizar alertas automáticas en pantalla cuando un producto alcance su nivel de stock crítico, para solicitar reabastecimiento a bodega. | S | 2 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Muestra un indicador de color amarillo/rojo en el POS cuando el stock local sea \<= 3 unidades. | Requisito Funcional (RF-10) |  |
| CA-2 | Permite generar una solicitud de reposición interna a bodega central con un clic. | Requisito No Funcional (RNF-14) |  |
| CA-3 | Notifica al Supervisor Logístico de la tienda sobre el bajo stock de dicho ítem. | Requisito No Funcional (RNF-02) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-ADM-4 | Como Administrador de Negocio, quiero revisar la bitácora central de auditoría del sistema (log de eventos), para supervisar las acciones críticas realizadas por los usuarios internos. | M | 5 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Despliega tabla de auditoría con filtros por Fecha, Usuario, Acción, Módulo y Dirección IP. | Requisito No Funcional (RNF-24) |  |
| CA-2 | Registra obligatoriamente eventos de: carga de claves, ajustes de stock, cambios de permisos y cierres de caja. | Requisito Funcional (RF-21 / RNF-08) |  |
| CA-3 | Los registros de la bitácora son inalterables y no pueden ser borrados ni modificados por ningún rol. | Requisito No Funcional (RNF-40) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-INV-12 | Como Supervisor Logístico, quiero consultar la bitácora inalterable de despacho de códigos digitales por cliente y orden, para resolver disputas o reclamos por claves no funcionales. | S | 3 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Muestra registro de fecha, hora, IP, mail y código de transacción exacto de cada entrega digital. | Requisito Funcional (RF-21 / RF-22) |  |
| CA-2 | Permite verificar mediante API externa con el distribuidor si la clave ya fue activada. | Requisito No Funcional (RNF-24) |  |
| CA-3 | Almacena los logs de claves encriptados en almacenamiento WORM (Write Once Read Many). | Requisito No Funcional (RNF-13) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-ADM-8 | Como Administrador de Negocio, quiero gestionar las llaves API y credenciales de integración con pasarelas de pago y servicios externos, para mantener activa la cobranza digital. | S | 3 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Panel de configuración permite ingresar y probar llaves secretas de Webpay, MercadoPago y Couriers. | Requisito No Funcional (RNF-32) |  |
| CA-2 | Almacena las llaves secretas encriptadas en bóveda de claves (Key Vault) con acceso restringido. | Requisito No Funcional (RNF-10) |  |
| CA-3 | Proporciona botón de prueba de conexión ('Test Connection') notificando el estado del servicio. | Requisito No Funcional (RNF-23) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-ADM-10 | Como Administrador de Negocio, quiero visualizar un panel ejecutivo de KPIs de seguridad, intentos de vulneración y disponibilidad de infraestructura, para tomar decisiones de riesgo. | M | 5 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Dashboard en tiempo real muestra disponibilidad de servidores (Uptime %), latencia media e intentos fallidos de login. | Requisito No Funcional (RNF-45) |  |
| CA-2 | Despliega mapa de calor con alertas de seguridad e intentos de inyección SQL o fuerza bruta. | Requisito No Funcional (RNF-01 / RNF-02) |  |
| CA-3 | Permite configurar alertas críticas al teléfono móvil ante caídas del sistema principal. | Requisito No Funcional (RNF-20) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-ADM-11 | Como Administrador de Negocio, quiero establecer las políticas de retención, respaldo y purga de logs y datos históricos, para cumplir con normativas legales y de almacenamiento. | S | 3 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Configura la retención de respaldos automáticos diarios por un periodo mínimo de 5 años. | Requisito No Funcional (RNF-24) |  |
| CA-2 | Programa la purga de logs secundarios no sensibles mayores a 365 días para liberar almacenamiento. | Requisito No Funcional (RNF-35) |  |
| CA-3 | Garantiza que la información tributaria y transaccional se mantenga inalterada en almacenamiento seguro. | Requisito No Funcional (RNF-40) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-ADM-14 | Como Administrador de Negocio, quiero publicar y actualizar los términos, condiciones y políticas de privacidad del comercio, para garantizar el cumplimiento normativo. | XS | 1 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Editor de texto enriquecido para modificar los términos legales desplegados en el pie de página de la web. | Requisito Funcional (RF-1) |  |
| CA-2 | Registra versión del documento y exige re-aceptación a compradores registrados si hay cambios sustanciales. | Requisito No Funcional (RNF-06) |  |
| CA-3 | Mantiene archivo con el historial de versiones de los términos y condiciones pasados. | Requisito No Funcional (RNF-26) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-ADM-13 | Como Administrador de Negocio, quiero definir y autorizar los límites de compra y presupuestos de emergencia asignados a Supervisores, para controlar el gasto operativo. | S | 3 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Permite fijar el monto máximo en dinero que un Supervisor Logístico puede autorizar en compras sin VoBo. | Regla de Negocio / Presupuesto |  |
| CA-2 | Notifica al Administrador cuando una solicitud de compra supere el límite configurado para aprobación manual. | Requisito No Funcional (RNF-39) |  |
| CA-3 | Genera reporte mensual de compras de emergencia autorizadas por usuario. | Requisito No Funcional (RNF-24) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-INV-14 | Como Supervisor Logístico, quiero configurar instrucciones especiales de empaque para ediciones de coleccionista o frágiles, para asegurar la protección del producto durante el transporte. | XS | 2 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Permite marcar SKU físicos con la etiqueta 'Empaque Especial / Frágil'. | Requisito Funcional (RF-1) |  |
| CA-2 | Imprime automáticamente advertencia de manipulación en la etiqueta de despacho. | Requisito Funcional (RF-24) |  |
| CA-3 | Suma costo adicional por embalaje especial en el cálculo del flete en checkout. | Requisito No Funcional (RNF-25) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-INV-15 | Como Supervisor Logístico, quiero monitorear el estado operativo y tiempos de respuesta de las APIs de couriers integrados, para detectar caídas del servicio logístico. | S | 3 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Panel de salud de integraciones muestra latencia y tasa de éxito de solicitudes a Starken/Chilexpress. | Requisito No Funcional (RNF-45) |  |
| CA-2 | Desactiva temporalmente un courier si su API no responde en 3 intentos consecutivos. | Requisito No Funcional (RNF-21) |  |
| CA-3 | Conmuta automáticamente los despachos al courier alternativo disponible. | Requisito No Funcional (RNF-03) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-VEN-7 | Como Vendedor de Tienda, quiero operar la caja registradora en modo offline ante caídas de internet, para no interrumpir la atención al cliente presencial. | L | 8 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Almacena transacciones locales en SQLite del navegador/POS cuando se detecte pérdida de red. | Requisito No Funcional (RNF-19) |  |
| CA-2 | Sincroniza automáticamente todas las ventas acumuladas al restablecer la conexión a internet. | Requisito No Funcional (RNF-19) |  |
| CA-3 | Bloquea la venta de claves digitales en modo offline para prevenir asignación duplicada de licencias. | Regla de Negocio / RNF-09 |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-ADM-12 | Como Administrador de Negocio, quiero autorizar e iniciar los protocolos de respaldo y recuperación ante desastres (DRP), para asegurar la continuidad operacional ante contingencias. | M | 5 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Permite ejecutar la restauración completa del sistema desde una copia de respaldo encriptada. | Requisito No Funcional (RNF-03) |  |
| CA-2 | El tiempo objetivo de recuperación (RTO) es menor a 2 horas y la pérdida de datos (RPO) es menor a 15 minutos. | Requisito No Funcional (RNF-17) |  |
| CA-3 | Requiere autenticación de dos factores y doble confirmación para ejecutar cualquier restauración masiva. | Requisito No Funcional (RNF-16) |  |
| ID | Historia de Usuario | Talla | Fibonacci |
| HU-ADM-15 | Como Administrador de Negocio, quiero supervisar las reglas de autoescalado y costos operativos del servidor en la nube durante eventos de alta demanda (CyberDay, lanzamientos), para optimizar el gasto de TI. | S | 3 |
| N° Criterio | Criterio de Aceptación | RNF y RF |  |
| CA-1 | Configura parámetros de escalado automático de instancias AWS/GCP al superar el 70% de CPU. | Requisito No Funcional (RNF-41) |  |
| CA-2 | Establece tope de presupuesto diario de infraestructura notificando si el gasto proyectado se excede. | Requisito No Funcional (RNF-28) |  |
| CA-3 | Garantiza soporte para más de 10.000 usuarios concurrentes sin degradar tiempos de respuesta. | Requisito No Funcional (RNF-34) |  |

# **9\. Documentación de los eventos.** {#9.-documentación-de-los-eventos.}

El siguiente segmento corresponde a la planificación, ejecución y documentación de eventos Scrum durante un ciclo total de 20 días hábiles de desarrollo. El trabajo se ha estructurado en 4 Sprints consecutivos de 5 días cada uno, abordando las 60 Historias de Usuario refinadas y priorizadas en la fase anterior.

## **SPRINT 1 (Días 1 a 5\)**

| Sprint Planning | Días 1 \- 5 / 20 |
| :---: | :---: |
| Objetivo del Sprint | Desplegar el núcleo de seguridad, la arquitectura de permisos RBAC, el registro/login multi-rol y la gestión básica de inventarios físicos y digitales. |
| Capacidad Comprometida | 15 Historias de usuario \| 50 puntos de Fibonacci.  |
| Equipo Asignado | Product Owner: Joshua Auristondo \| Scrum Master: Catalina Larenas \| Dev Team: Benjamín Zepeda & Javier Sepúlveda |
| Criterios | Garantizar la cobertura del 100% del Definition of Done (DoD) y la viabilidad del entregable dentro del timebox de 5 días. |

| Sprint Backlog | 15 HDU seleccionadas |
| :---: | ----- |
| N° HDU | Historia de Usuario |
| HU-ADM-1 | Como Administrador de Negocio, quiero registrar y gestionar las cuentas de usuarios administrativos (Vendedores, Supervisores Logísticos, TI), para otorgar acceso al personal autorizando sus funciones. |
| HU-ADM-2 | Como Administrador de Negocio, quiero configurar matrices de roles y permisos de acceso granulares (RBAC), para asegurar que cada empleado acceda exclusivamente a los módulos requeridos. |
| HU-ADM-5 | Como Administrador de Negocio, quiero exigir el uso de contraseñas de alta complejidad y autenticación de dos factores (2FA) para roles administrativos, para blindar el acceso a la plataforma. |
| HU-ADM-6 | Como Administrador de Negocio, quiero vincular y asignar usuarios a sucursal(es) física(s) específica(s), para delimitar sus privilegios operativos según su sede de trabajo. |
| HU-ADM-9 | Como Administrador de Negocio, quiero dar de alta nuevas sucursales físicas y configurar sus parámetros comerciales en el sistema, para respaldar la expansión del negocio. |
| HU-ADM-3 | Como Administrador de Negocio, quiero desactivar de forma inmediata la cuenta de cualquier empleado desvinculado, para revocar todos sus accesos de manera instantánea. |
| HU-ADM-7 | Como Administrador de Negocio, quiero realizar el reseteo administrativo de credenciales y desbloquear cuentas suspendidas, para restablecer el acceso a personal bloqueado. |
| HU-COM-11 | Como Comprador, quiero registrarme e iniciar sesión con credenciales seguras, para guardar mis datos de envío y preferencias de compra. |
| HU-VEN-12 | Como Vendedor de Tienda, quiero autenticarme en la terminal POS con mi usuario individual, para registrar la responsabilidad de cada transacción procesada. |
| HU-COM-13 | Como Comprador, quiero solicitar la recuperación de mi contraseña mediante un enlace verificado por correo, para restablecer mi acceso de forma segura. |
| HU-INV-3 | Como Supervisor Logístico, quiero registrar el ingreso de reabastecimientos de mercadería física por proveedor y sucursal, para mantener actualizado el stock físico. |
| HU-INV-1 | Como Supervisor Logístico, quiero realizar cargas masivas de lotes de licencias digitales mediante archivos CSV o JSON, para poblar el inventario virtual. |
| HU-INV-4 | Como Supervisor Logístico, quiero configurar el umbral de stock crítico y reorden automático por SKU, para prevenir el desabastecimiento de juegos populares. |
| HU-VEN-1 | Como Vendedor de Tienda, quiero consultar el stock disponible en tiempo real en las 3 sucursales y la tienda web, para orientar al cliente presencial. |
| HU-COM-1 | Como Comprador, quiero navegar y filtrar los videojuegos por consola, género y rango de precio, para encontrar rápidamente los títulos de mi interés. |

	

| Daily Scrum |  | Seguimiento | 5 días |
| ----- | ----- | ----- | ----- |
| Jornada | ¿Qué se hizo?  | ¿Qué se hará? | Impedimentos |
| Dia 1 | Configuración de BD PostgreSQL, esquemas de usuarios. | Desarrollar vistas de login y registro multi-rol con 2FA. | Ninguno. Entorno configurado correctamente. |
| Dia 2 | Vistas de inicio de sesión y autenticación individual en terminal POS. | Implementar mantenedor de usuarios administrativos y matriz RBAC. | Latencia menor en el envío de mails de bienvenida. |
| Dia 3 | Módulo de gestión de usuarios y vinculación de sucursales físicas. | Construir módulo logístico de carga masiva CSV/JSON de licencias. | Validación de formato en archivos CSV con caracteres especiales. |
| Dia 4 | Script de parseo e ingesta masiva de claves encriptadas AES-256. | Desarrollar catálogo web con filtros por consola, precio y stock. | Ninguno. API de catálogo respondiendo en \< 0.5s. |
| Dia 5 | Integración de filtros de catálogo y consulta omnicanal en POS. | Ejecutar pruebas unitarias de sincronización y preparar Sprint Review. | Ajustes menores en la maquetación responsive del filtro. |

TODO : IMAGENES

| Sprint Review (Demostración & DoD) | Se presentó al Product Owner el prototipo funcional del flujo de autenticación, administración RBAC e ingesta masiva de inventarios. El PO aprobó el 100% de los criterios de aceptación de las 15 HDUs. Se destacó la velocidad de respuesta del filtro del catálogo (\<1.2s). |
| :---: | :---: |
| Sprint Retrospective (Mejora Continua) | Puntos fuertes: Excelente coordinación del Dev Team en la estructura de base de datos. Oportunidad de Mejora: Ajustar los mensajes de error en la validación de archivos CSV masivos para hacerlos más descriptivos. Acción: Implementar modal explicativo en el Sprint 2\. |

## **SPRINT 2 (Días 6 a 10\)**

| Sprint Planning | Días 6 \- 10 / 20 |
| :---: | :---: |
| Objetivo del Sprint | Construir el motor principal de ventas transaccionales, integrando la caja registradora POS para tiendas físicas y la pasarela de pago web (Webpay/MercadoPago) con boleta electrónica automática. |
| Capacidad Comprometida | 15 Historias de Usuario \| 59 Puntos de Fibonacci  |
| Equipo Asignado | Product Owner: Joshua Auristondo \| Scrum Master: Catalina Larenas \| Dev Team: Benjamín Zepeda & Javier Sepúlveda |
| Criterios | Garantizar la cobertura del 100% del Definition of Done (DoD) y la viabilidad del entregable dentro del timebox de 5 días. |

| Sprint Backlog | 15 HDU seleccionadas |
| :---: | ----- |
| N° HDU | Historia de Usuario |
| HU-COM-2 | Como Comprador, quiero visualizar la ficha técnica detallada de cada producto con imágenes y tráilers, para evaluar los juegos antes de comprarlos. |
| HU-VEN-8 | Como Vendedor de Tienda, quiero buscar productos rápidamente escaneando su código de barras o SKU, para agilizar la atención en fila. |
| HU-INV-2 | Como Supervisor Logístico, quiero auditar las claves digitales almacenadas verificando que estén encriptadas y sin duplicaciones, para garantizar la seguridad del inventario virtual. |
| HU-INV-13 | Como Supervisor Logístico, quiero gestionar el catálogo de proveedores de consolas y distribuidores oficiales, para centralizar las órdenes de compra de reabastecimiento. |
| HU-VEN-2 | Como Vendedor de Tienda, quiero registrar ventas presenciales en el punto de venta (POS) con actualización inmediata de inventario, para procesar transacciones en caja. |
| HU-VEN-4 | Como Vendedor de Tienda, quiero emitir e imprimir boletas o vales de venta desde la terminal de caja, para entregar comprobantes físicos al cliente. |
| HU-VEN-13 | Como Vendedor de Tienda, quiero realizar el arqueo y cierre diario de caja comparando efectivo y vales de tarjeta, para cuadrar los ingresos de mi turno. |
| HU-VEN-5 | Como Vendedor de Tienda, quiero verificar la disponibilidad e imprimir/enviar códigos de licencias digitales vendidas en mostrador, para atender compras digitales en tienda física. |
| HU-COM-3 | Como Comprador, quiero agregar productos físicos y licencias digitales a un carrito de compras unificado, para realizar una sola transacción de pago. |
| HU-COM-4 | Como Comprador, quiero pagar de forma segura mediante pasarelas de pago integradas (Webpay / MercadoPago), para completar mi compra de manera confiable. |
| HU-COM-5 | Como Comprador, quiero recibir una boleta electrónica automática por correo electrónico, para respaldar legalmente mi compra. |
| HU-VEN-3 | Como Vendedor de Tienda, quiero reservar stock temporalmente para clientes que soliciten compras telefónicas, para asegurar el producto durante 24 horas. |
| HU-VEN-14 | Como Vendedor de Tienda, quiero emitir e imprimir cotizaciones formales para clientes presenciales, para ofrecer presupuestos válidos por tiempo determinado. |
| HU-COM-6 | Como Comprador, quiero recibir de forma inmediata y automática mis claves digitales por correo y en mi perfil, para activar mis juegos de inmediato. |
| HU-COM-7 | Como Comprador, quiero seleccionar entre envío a domicilio o retiro presencial en cualquiera de las 3 sucursales, para elegir la opción logística más conveniente. |

	

| Daily Scrum |  | Seguimiento | 5 días |
| ----- | ----- | ----- | ----- |
| Jornada | ¿Qué se hizo?  | ¿Qué se hará? | Impedimentos |
| Dia 6 | Desarrollo del lector de código de barras y ficha técnica ampliada. | Construir módulo de venta presencial POS y descuento automático de stock local. | Ninguno. |
| Dia 7 | Integración del checkout POS con múltiples medios de pago y generación de voucher. | Desarrollar el carrito de compras unificado en la web con reserva de stock por 15m. | Gestión del tiempo de expiración de la sesión del carrito. |
| Dia 8 | Lógica del carrito web unificado y reserva temporal de stock. | Integrar la pasarela de pago Webpay/MercadoPago bajo protocolo HTTPS/TLS 1.3. | Simulación de timeouts en entorno Sandbox de Webpay. |
| Dia 9 | Lógica del carrito web unificado y reserva temporal de stock. | Implementar servicio SMTP de despacho inmediato de licencias y boleta en PDF. | Ajuste en la plantilla HTML del correo para clientes de correo móviles. |
| Dia 10 | Pruebas integradas de compras digitales/físicas y arqueo Z en caja POS. | Finalizar maquetación del flujo completo de pago y presentar demostración. | Ninguno. Cierre de caja cuadra al 100%. |

TODO : IMAGENES

| Sprint Review (Demostración & DoD) | El Product Owner probó la compra web completa y el proceso de cobro en caja POS. Se verificó que el despacho por correo de la boleta y la clave digital se ejecuta en menos de 10 segundos tras la autorización. Incremento aprobado satisfactoriamente. |
| :---: | :---: |
| Sprint Retrospective (Mejora Continua) | Puntos Fuertes: Alta estabilidad en la integración con la pasarela de pagos. Oportunidad de Mejora: Mejorar la velocidad de carga de tráilers pesados en la ficha técnica. Acción: Aplicar carga diferida (lazy loading) en iFrames de video para el Sprint 3\. |

## **SPRINT 3 (Días 11 a 15\)**

| Sprint Planning | Días 11 \- 15 / 20 |
| :---: | :---: |
| Objetivo del Sprint | Implementar el ecosistema logístico de despachos físicos (etiquetas PDF, integración API Couriers Starken/Chilexpress), la gestión de retiros en tienda (Click & Collect), traslados inter-sucursal y la bóveda digital personal del comprador. |
| Capacidad Comprometida | 15 Historias de Usuario \| 52 Puntos de Fibonacci  |
| Equipo Asignado | Product Owner: Joshua Auristondo \| Scrum Master: Catalina Larenas \| Dev Team: Benjamín Zepeda & Javier Sepúlveda |
| Criterios | Garantizar la cobertura del 100% del Definition of Done (DoD) y la viabilidad del entregable dentro del timebox de 5 días. |

| Sprint Backlog | 15 HDU seleccionadas |
| :---: | ----- |
| N° HDU | Historia de Usuario |
| HU-INV-5 | Como Supervisor Logístico, quiero generar e imprimir etiquetas de despacho y código de barras en formato PDF, para agilizar el embalaje de pedidos web. |
| HU-INV-6 | Como Supervisor Logístico, quiero integrar el sistema con las API de los couriers de despacho externos, para automatizar la cotización y generación de guías. |
| HU-INV-7 | Como Supervisor Logístico, quiero registrar el código de seguimiento de envío en cada pedido embalado, para notificar automáticamente al cliente. |
| HU-COM-8 | Como Comprador, quiero realizar el seguimiento en tiempo real del estado de mi despacho mediante un código de rastreo, para saber cuándo llegará mi paquete. |
| HU-VEN-15 | Como Vendedor de Tienda, quiero validar y entregar órdenes de compra web con modalidad retiro en tienda, para completar la entrega presencial al comprador. |
| HU-VEN-10 | Como Vendedor de Tienda, quiero solicitar traslados internos de mercadería desde otra sucursal, para satisfacer la demanda de un cliente local. |
| HU-INV-11 | Como Supervisor Logístico, quiero autorizar y coordinar la transferencia física de productos entre bodegas de sucursales, para balancear la disponibilidad geográfica. |
| HU-COM-9 | Como Comprador, quiero consultar mi historial de compras y mi bóveda personal de claves digitales adquiridas, para acceder a mis juegos en cualquier momento. |
| HU-VEN-9 | Como Vendedor de Tienda, quiero procesar cambios y devoluciones de productos físicos según las políticas de garantía, para gestionar la satisfacción del cliente. |
| HU-COM-12 | Como Comprador, quiero publicar valoraciones y reseñas en los juegos que he comprado, para compartir mi opinión con la comunidad gamer. |
| HU-COM-14 | Como Comprador, quiero solicitar una alerta por correo cuando un producto agotado vuelva a tener stock disponible, para comprarlo oportunamente. |
| HU-COM-15 | Como Comprador, quiero filtrar los productos por idioma de subtítulos y región de activación de la consola, para evitar comprar contenido incompatible. |
| HU-INV-9 | Como Supervisor Logístico, quiero registrar mermas, productos dañados o extravíos con su justificación técnica, para mantener la transparencia del inventario real. |
| HU-INV-8 | Como Supervisor Logístico, quiero ejecutar el proceso de conciliación nocturna entre stock físico, reservado y en tránsito, para corregir descuadres de inventario. |
| HU-INV-10 | Como Supervisor Logístico, quiero exportar e importar reportes detallados de rotación de inventarios en formatos CSV/JSON/XML, para respaldar la toma de decisiones. |

	

| Daily Scrum |  | Seguimiento | 5 días |
| ----- | ----- | ----- | ----- |
| Jornada | ¿Qué se hizo?  | ¿Qué se hará? | Impedimentos |
| Dia 11 | Desarrollo del generador de etiquetas térmicas PDF y conector API Starken/Chilexpress. | Crear vista de seguimiento de despacho en tiempo real para el cliente web. | Tiempos de respuesta variables en el sandbox del courier. |
| Dia 12 |  Lógica de rastreo de pedidos con línea de tiempo e integración de webhooks de courier. | Implementar módulo POS de validación de retiros en tienda (Click & Collect). | Ninguno. El módulo de retiro valida la orden en \< 1s. |
| Dia 13 | Módulo POS de Click & Collect y registro de firma digital del cliente. | Desarrollar sistema de solicitudes y aprobación de traslados inter-sucursales. | Manejo de estados de stock 'En Tránsito' durante los traslados. |
| Dia 14 | Módulo de traslados inter-bodega y bóveda personal de claves digitales del cliente. | Construir módulo de valoraciones/reseñas para compradores verificados y alertas de stock. | Filtro de lenguaje inapropiado en comentarios de productos. |
| Dia 15 | Proceso Batch de conciliación nocturna (23:59h) e importación/exportación de reportes. | Realizar pruebas integradas de logística y presentar incremento al PO. | Ninguno. Proceso Batch procesa 10.000 registros en \< 3s. |

TODO : IMAGENES

| Sprint Review (Demostración & DoD) | Se realizó la demostración del ciclo logístico completo: desde la compra web, la generación de etiquetas en bodega, la consulta API de tarifas hasta el retiro en tienda física. El PO aprobó el flujo sin observaciones. |
| :---: | :---: |
| Sprint Retrospective (Mejora Continua) | Puntos Fuertes: La integración de la bóveda de claves otorgó un gran valor percibido al usuario final. Oportunidad de Mejora: Optimizar las alertas visuales en el POS ante inventarios bajos. Acción: Incluir indicadores de color en el Sprint 4\. |

## **SPRINT 4 (Días 16 a 20\)**

| Sprint Planning | Días 16 \- 20 / 20 |
| :---: | :---: |
| Objetivo del Sprint | Concluir el desarrollo integrando el motor de marketing/boletines, el sistema de auditoría inalterable de eventos, la resiliencia offline de cajas POS, el plan de desastres (DRP) y la gobernanza en la nube con autoescalado. |
| Capacidad Comprometida | 15 Historias de Usuario \| 51 Puntos de Fibonacci  |
| Equipo Asignado | Product Owner: Joshua Auristondo \| Scrum Master: Catalina Larenas \| Dev Team: Benjamín Zepeda & Javier Sepúlveda |
| Criterios | Garantizar la cobertura del 100% del Definition of Done (DoD) y la viabilidad del entregable dentro del timebox de 5 días. |

| Sprint Backlog | 15 HDU seleccionadas |
| :---: | ----- |
| N° HDU | Historia de Usuario |
| HU-COM-10 | Como Comprador, quiero suscribirme o desuscribirme al boletín promocional y alertas de preventas, para recibir ofertas exclusivas según mi preferencia. |
| HU-VEN-11 | Como Vendedor de Tienda, quiero programar el envío de boletines de ofertas locales a clientes de mi sucursal, para promocionar eventos y liquidaciones. |
| HU-VEN-6 | Como Vendedor de Tienda, quiero visualizar alertas automáticas en pantalla cuando un producto alcance su nivel de stock crítico, para solicitar reabastecimiento a bodega. |
| HU-ADM-4 | Como Administrador de Negocio, quiero revisar la bitácora central de auditoría del sistema (log de eventos), para supervisar las acciones críticas realizadas por los usuarios internos. |
| HU-INV-12 | Como Supervisor Logístico, quiero consultar la bitácora inalterable de despacho de códigos digitales por cliente y orden, para resolver disputas o reclamos por claves no funcionales. |
| HU-ADM-8 | Como Administrador de Negocio, quiero gestionar las llaves API y credenciales de integración con pasarelas de pago y servicios externos, para mantener activa la cobranza digital. |
| HU-ADM-10 | Como Administrador de Negocio, quiero visualizar un panel ejecutivo de KPIs de seguridad, intentos de vulneración y disponibilidad de infraestructura, para tomar decisiones de riesgo. |
| HU-ADM-11 | Como Administrador de Negocio, quiero establecer las políticas de retención, respaldo y purga de logs y datos históricos, para cumplir con normativas legales y de almacenamiento. |
| HU-ADM-14 | Como Administrador de Negocio, quiero publicar y actualizar los términos, condiciones y políticas de privacidad del comercio, para garantizar el cumplimiento normativo. |
| HU-ADM-13 | Como Administrador de Negocio, quiero definir y autorizar los límites de compra y presupuestos de emergencia asignados a Supervisores, para controlar el gasto operativo. |
| HU-INV-14 | Como Supervisor Logístico, quiero configurar instrucciones especiales de empaque para ediciones de coleccionista o frágiles, para asegurar la protección del producto durante el transporte. |
| HU-INV-15 | Como Supervisor Logístico, quiero monitorear el estado operativo y tiempos de respuesta de las APIs de couriers integrados, para detectar caídas del servicio logístico. |
| HU-VEN-7 | Como Vendedor de Tienda, quiero operar la caja registradora en modo offline ante caídas de internet, para no interrumpir la atención al cliente presencial. |
| HU-ADM-12 | Como Administrador de Negocio, quiero autorizar e iniciar los protocolos de respaldo y recuperación ante desastres (DRP), para asegurar la continuidad operacional ante contingencias. |
| HU-ADM-15 | Como Administrador de Negocio, quiero supervisar las reglas de autoescalado y costos operativos del servidor en la nube durante eventos de alta demanda (CyberDay, lanzamientos), para optimizar el gasto de TI. |

	

| Daily Scrum |  | Seguimiento | 5 días |
| ----- | ----- | ----- | ----- |
| Jornada | ¿Qué se hizo?  | ¿Qué se hará? | Impedimentos |
| Dia 16 | Maquetación del gestor de campañas promocionales por sucursal y panel de alertas de stock en POS. | Implementar la bitácora inalterable de auditoría (Log de Eventos) con firma hash. | Garantizar que el log de auditoría no pueda ser modificado por administradores. |
| Dia 17 | Lógica del log de auditoría inalterable en base de datos WORM y dashboard de KPIs de seguridad. | Construir la resiliencia offline del POS con almacenamiento en caché local SQLite. | Sincronización de transacciones offline al reconectar la red sin duplicar folios. |
| Dia 18 | Modo Offline POS operando con SQLite local e inhibición de venta de licencias sin conexión.. | Desarrollar el panel de monitoreo de salud de APIs (Healthcheck) y conmutación automatizada. | Pruebas de simulación de caída de API de Starken con failover a Chilexpress. |
| Dia 19 | Healthcheck de servicios y configuración del script de recuperación ante desastres (DRP). | Configurar parámetros de autoescalado AWS/GCP al 70% CPU y pruebas de carga masiva. | Pruebas de estrés simulando 1.000 usuarios concurrentes sin degradar la latencia. |
| Dia 20 | Pruebas integrales de cierre de proyecto, validación de la suite completa de 60 HDUs y Sprint Review. | Entregar el prototipo final 100% operativo al Product Owner e interesados. | Ninguno. Plataforma lista para pase a producción. |

TODO : IMAGENES

| Sprint Review (Demostración & DoD) | Se presentó la plataforma Pixel Gamers terminada al 100%. Se realizaron pruebas de caída de red en caja POS (modo offline exitoso) y simulación de carga en AWS. El Product Owner firmó el Acta de Aceptación Definitiva del Prototipo. |
| :---: | :---: |
| Sprint Retrospective (Mejora Continua) | Puntos Fuertes: Se logró completar las 60 HDUs dentro de los 20 días de desarrollo sin deuda técnica. Oportunidad de Mejora: Documentar guías rápidas de usuario para cajeros. Acción: Incluir manual de usuario en el entregable final. |

