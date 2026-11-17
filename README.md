## Pixel Gamers — prototipo funcional (demo, no real)

Prototipo de prueba de concepto en React + Vite. **Todo es simulado**: no hay backend, pasarelas ni correo reales.
Los datos viven en un *store context* (`src/store`) y se persisten en `localStorage` (clave `pixelgamers.store.v1`).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

### Guía rápida
- Abre **/demo**: lista las 20 figuras de `Info/HDU Pixel Gamers - Imagenes necesarias.csv` y abre cada pantalla con el rol correcto.
- **Reiniciar datos demo**: botón en `/demo` o `/login` (vuelve a la semilla de `src/store/mockData.js`).
- Los correos "enviados" (boletas, claves, despachos, campañas) se ven en **/outbox**.

### Usuarios demo (uno por rol)
| Rol | Correo | Clave |
|---|---|---|
| Comprador | camila.rojas@demo.cl | Gamer2026! |
| Vendedor (Sucursal 1, PIN 1234) | diego.fuentes@pixelgamers.cl | Vendedor#Pixel26 |
| Supervisor Logístico | valentina.mora@pixelgamers.cl | Logistica#Pixel26 |
| Administrador de Negocio | admin@pixelgamers.cl | Admin#Pixel2026! |
| TI | ti@pixelgamers.cl | Sistemas#Pixel26 |

Roles administrativos (Supervisor, Admin, TI) piden 2FA: código `123456`.

### Estructura
- `src/store/mockData.js` — semilla: usuarios, sucursales, 22 productos, claves cifradas, pedidos, auditoría, couriers, infraestructura.
- `src/store/reducer.js` — toda la lógica de negocio (stock, claves, pedidos, POS, traslados, RBAC, auditoría encadenada por hash…).
- `src/store/StoreContext.jsx` — provider, persistencia y API de acciones (`useStore()`).
- `src/store/selectors.js` — consultas derivadas (stock, carrito, permisos, alertas).
- `src/routes/*` — tienda (catálogo, ficha, carrito, checkout, cuenta, seguimiento) · `src/routes/admin/*` — panel interno.
- Las portadas de producto se generan como SVG pixel-art (`components/ui/Cover.jsx`): sin imágenes externas ni derechos de terceros.
