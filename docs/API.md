# Contrato de la API · Life-RPG

Este documento es el **acuerdo entre la app móvil y el backend** (`liferpg-backend`, Node + Express).
El móvil ya está programado contra este contrato; el backend debe cumplirlo tal cual.
Si algo tiene que cambiar, **se cambia primero aquí** y después en los dos lados.

- Rutas en el código del móvil: `src/constants/endpoints.ts`
- Forma exacta de cada dato: `src/models/` (los nombres de modelo de las tablas son los de esos archivos)

---

## 1. Reglas generales

| Tema | Regla |
| :-- | :-- |
| **URL base** | `http://<host>:3000/api/v1` (variable `EXPO_PUBLIC_API_URL` del móvil). |
| **Rutas** | Recursos en español, minúsculas y con guiones: `/vestidor/look-actual`. Parámetros como `:id`. |
| **Formato** | Siempre JSON (`Content-Type: application/json`), en la petición y en la respuesta. |
| **Nombres de campos** | En inglés y `camelCase`, idénticos a los modelos: `createdAt`, `pointType`, `xpAwarded`. |
| **Respuesta correcta** | El dato **directo**, sin envoltorio. `GET /misiones` responde `[ {...}, {...} ]`, no `{ "data": [...] }`. |
| **IDs** | Siempre **texto** (`"id": "a1b2"`), nunca número. |
| **Fechas** | Momento exacto: ISO 8601 (`"2026-11-14T21:40:00.000Z"`). Solo día: `"AAAA-MM-DD"`. Hora del día: `"HH:mm"`. |
| **Tipos de puntos** | `"cultura"`, `"fisico"`, `"enfoque"`: minúsculas y sin acento. El texto visible lo pone el móvil. |
| **Datos vacíos** | Lista sin elementos: `[]`. Dato que no existe todavía (p. ej. sin registro hoy): `null` con código 200. |
| **CORS** | El backend debe permitirlo (lo usan la PWA y el móvil en modo web). |

### Quién es el usuario

- **Mientras no exista el inicio de sesión (M00):** el móvil envía el encabezado `x-user-id: u-1` (usuario de prueba, variable `EXPO_PUBLIC_DEV_USER_ID`).
- **Cuando exista el M00:** envía `Authorization: Bearer <token JWT>` y deja de mandar `x-user-id`.
- El backend toma al usuario **solo** de ahí. Ninguna ruta recibe el id del usuario en la URL ni en el cuerpo; "el usuario actual" es `/usuarios/me`.
- Cada usuario solo puede ver y modificar sus propios datos.

### Errores

Todos los errores responden con el mismo cuerpo, y el mensaje va **en español y listo para mostrarse** (el móvil lo enseña tal cual):

```json
{ "error": "La energía debe ser un entero de 0 a 10." }
```

| Código | Cuándo |
| :-- | :-- |
| `200` | Consulta o cambio correcto. |
| `201` | Se creó algo nuevo. |
| `204` | Se eliminó; sin cuerpo. |
| `400` | Datos mal formados o fuera de regla (validación). |
| `401` | No se pudo identificar al usuario. |
| `404` | El recurso no existe o no es del usuario. |
| `500` | Error inesperado del servidor. |

Las **reglas de negocio se validan en el servidor** (rangos, saldos, límites). El móvil solo hace validaciones de comodidad (campo vacío, botón deshabilitado).

---

## 2. Endpoints por módulo

Columna **Módulo móvil**: la clave que se pone en `EXPO_PUBLIC_API_MODULES` para que el móvil use esa parte de la API (ver sección 3).

### Usuario actual · módulo móvil `usuarios`

Datos compartidos por la Casa, la Tienda, el Vestidor y el Ánimo. Modelos: `UserProfile.ts`, `common.ts`.

| Método y ruta | Cuerpo | Responde | Notas |
| :-- | :-- | :-- | :-- |
| `GET /usuarios/me` | — | `UserProfile` | `hasMoodLogToday` decide si la Casa muestra la burbuja de ánimo (RDF017). |
| `GET /usuarios/me/puntos` | — | `Wallet` | Única fuente de los puntos: `{ "cultura": 340, "fisico": 210, "enfoque": 480 }`. |
| `GET /usuarios/me/atributos` | — | `Attributes` | Puntos con su avance de 0 a 1 para las barras de la Casa. |
| `GET /usuarios/me/privacidad` | — | `PrivacySettings` | RDF071. |

### M01 · Tamagotchi · módulo móvil `tamagotchi`

Modelo: `Tamagotchi.ts`.

| Método y ruta | Cuerpo | Responde | Notas |
| :-- | :-- | :-- | :-- |
| `GET /tamagotchi` | — | `Tamagotchi` | Nombre, título, nivel, XP y HP de la mascota del usuario. |

### M01 · Vestidor y looks · módulo móvil `vestidor`

Modelo: `Wardrobe.ts`.

| Método y ruta | Cuerpo | Responde | Notas |
| :-- | :-- | :-- | :-- |
| `GET /vestidor/articulos` | — | `WardrobeItem[]` | `category`: `"Cabeza"`, `"Cara"`, `"Cuerpo"` o `"Fondo"`. |
| `GET /vestidor/look-actual` | — | `CurrentLook` | |
| `GET /vestidor/looks` | — | `SavedLook[]` | |
| `POST /vestidor/looks` | `{ "name": "Modo examen" }` | `SavedLook[]` | Guarda el look actual y lo deja en uso. Nombre obligatorio, máx. 24 caracteres. Si el nombre ya existe, lo actualiza. |
| `PATCH /vestidor/looks/:id/usar` | — | `SavedLook[]` | Deja ese look como el que está en uso. |

### M03 · Misiones únicas y enfoque · módulo móvil `misiones`

Modelo: `Mission.ts`.

| Método y ruta | Cuerpo | Responde | Notas |
| :-- | :-- | :-- | :-- |
| `GET /misiones?estado=activa` | — | `Mission[]` | RDF035. |
| `GET /misiones/:id` | — | `Mission` | `404` si ya no está activa. |
| `POST /misiones` | `NewMissionInput` | `Mission` | RDF037. El servidor calcula `reward` (RDF038). Título obligatorio. |
| `POST /misiones/:id/sesiones` | — | `FocusSession` | RDF039. `locksDevice` es `true` solo en misiones de enfoque. |
| `POST /sesiones/:id/fallar` | `{ "reason": "rendicion" }` | `204` | RDF040. `reason`: `"rendicion"` o `"salio_app"`. La misión pasa al historial como fallida. |
| `POST /sesiones/:id/finalizar` | — | `SessionOutcome` | RDF041. `claimed: false` cuando falta la validación manual. |
| `GET /sesiones/:id/resultado` | — | `SessionOutcome` | `404` si la sesión no existe. |
| `POST /sesiones/:id/validar` | — | `SessionOutcome` | RDF043. Confirma manualmente y entrega la recompensa. |
| `GET /misiones/historial` | — | `MissionHistoryEntry[]` | RDF044. De la más reciente a la más antigua. |

### M04 · Tienda e inventario · módulo móvil `tienda`

Modelo: `Item.ts`. Los puntos se consultan en `GET /usuarios/me/puntos`.

| Método y ruta | Cuerpo | Responde | Notas |
| :-- | :-- | :-- | :-- |
| `GET /tienda/articulos` | — | `ShopItem[]` | |
| `POST /tienda/compras` | `{ "itemId": "s1" }` | `PurchaseResult` | Valida que alcancen los puntos del tipo del artículo y los descuenta. `400` si no alcanzan. |
| `GET /tienda/precio-sugerido` | — | `SuggestedPrice` | Depende del nivel y de la economía global (M14). |
| `POST /tienda/recompensas` | `NewRewardInput` | `ShopItem` | Nombre obligatorio y precio mayor a 0 (dentro del rango del M14). Queda con `isCustom: true`. |
| `GET /inventario` | — | `Inventory` | |
| `POST /inventario/recompensas/:id/canjear` | — | `204` | |
| `POST /inventario/consumibles/:id/usar` | — | `Consumable[]` | Resta 1; devuelve los consumibles que quedan. |
| `PATCH /inventario/ropa/:id` | — | `ClothingItem[]` | Pone o quita la prenda; devuelve toda la ropa. |

### M06 · Estado de ánimo · módulo móvil `animo`

Modelo: `MoodLog.ts`. La privacidad se consulta en `GET /usuarios/me/privacidad`.

| Método y ruta | Cuerpo | Responde | Notas |
| :-- | :-- | :-- | :-- |
| `GET /animo/hoy` | — | `MoodLog` o `null` | Registro de hoy. |
| `POST /animo` | `NewMoodLogInput` | `MoodRegisterResult` | RDF068 y RDF069. `mood` entero 1 a 5, `energy` entero 0 a 10. Primer registro del día: `201` y `xpAwarded: 5`. Si ya había: lo actualiza, `200` y `xpAwarded: 0`. |
| `GET /animo/recordatorio` | — | `MoodReminder` | RDF070. Por defecto `{ "enabled": true, "time": "20:00" }`. |
| `PUT /animo/recordatorio` | `MoodReminder` | `MoodReminder` | `time` en `HH:mm`. |
| `GET /animo/tendencia?periodo=semana` | — | `MoodTrend` | RDF072 a RDF074. `periodo`: `semana` (últimos 7 días) o `mes` (últimos 30), terminando hoy. Días sin registro: `mood` y `energy` en `null`. |
| `GET /animo/diario` | — | `JournalEntry[]` | RDF077. De la más reciente a la más antigua. |
| `POST /animo/diario` | `JournalEntryInput` | `JournalEntry` | RDF075. Texto obligatorio, máx. 500. Toma `mood` y `energy` del registro del día. `shared` es `false` por defecto. |
| `PUT /animo/diario/:id` | `JournalEntryInput` | `JournalEntry` | RDF076 y RDF078. |
| `DELETE /animo/diario/:id` | — | `204` | RDF078. |

### Pendientes (su responsable agrega aquí sus rutas antes de programar)

| Módulo | Estado |
| :-- | :-- |
| M00 · Autenticación | Sin definir. Reemplazará `x-user-id` por el token JWT. |
| M02 · Hábitos | Pantallas "En construcción". Modelo `Quest.ts` vacío. |
| M05 · Logros | Pantallas "En construcción". |

---

## 3. Cómo se conecta un módulo (del lado del móvil)

1. El backend publica las rutas del módulo cumpliendo este contrato.
2. En el archivo `.env` del móvil se agrega la clave del módulo:
   ```
   EXPO_PUBLIC_API_URL=http://192.168.0.10:3000/api/v1
   EXPO_PUBLIC_API_MODULES=usuarios,animo
   ```
3. Se reinicia Expo (`npx expo start -c`). Ese módulo ya usa la API; los demás siguen con datos simulados.

No hay que tocar pantallas ni ViewModels. Con `EXPO_PUBLIC_API_MODULES=todos` se conecta todo; vacío, todo usa datos simulados.

## 4. Ejemplo completo

Petición:

```http
POST /api/v1/animo
Content-Type: application/json
x-user-id: u-1

{ "mood": 4, "energy": 7, "factors": ["motivada"] }
```

Respuesta `201`:

```json
{
  "log": {
    "id": "a1b2",
    "date": "2026-11-14",
    "createdAt": "2026-11-14T21:40:00.000Z",
    "mood": 4,
    "energy": 7,
    "factors": ["motivada"]
  },
  "xpAwarded": 5
}
```

Si `energy` fuera `11`, respuesta `400`:

```json
{ "error": "La energía debe ser un entero de 0 a 10." }
```
