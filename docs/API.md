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
| **URL base** | `http://<host>:3000/api/v1` (variable `EXPO_PUBLIC_API_URL` del móvil; el jugador puede cambiarla en Ajustes › Servidor, RDF011). |
| **Estado** | `GET /estado` responde `{ "status": "ok" }` sin usuario. Ajustes › Servidor lo usa para probar la conexión. |
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

- **Con inicio de sesión (M00, modo `firebase`):** el móvil inicia sesión con **Firebase Authentication** y envía
  `Authorization: Bearer <ID token de Firebase>` en cada petición (Firebase lo renueva solo cada hora).
  El backend lo valida con `firebase-admin` (`verifyIdToken`) y usa el `uid` como id del usuario.
- **En los modos de prueba (`mock` y `mock-login`):** no hay token y el móvil envía `x-user-id: u-1`
  (variable `EXPO_PUBLIC_DEV_USER_ID`), igual que antes. El backend debe aceptar los dos mientras se integra el M00.
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
| `PUT /usuarios/me/privacidad` | `{ "visibleToViewers": false }` | `PrivacySettings` | Ajustes › Privacidad. |

### M00 · Cuenta del jugador · módulo móvil `usuarios`

La **contraseña y el correo los maneja Firebase**, no el backend. El backend guarda los datos del juego
de cada `uid`. Modelo: `Account.ts`.

| Método y ruta | Cuerpo | Responde | Notas |
| :-- | :-- | :-- | :-- |
| `GET /usuarios/me/cuenta` | — | `Account` | **`404` si aún no llena "Crear cuenta"**: el móvil lo lleva a esa pantalla. |
| `POST /usuarios/me/cuenta` | `NewAccountInput` | `Account` (`201`) | RDF001. `firstName` y `lastName` obligatorios (máx. 40); `age` entero de 1 a 120; `gender`: `"mujer"`, `"hombre"`, `"no_binario"` o `"prefiero_no_decir"`; `goals`: lista de `"lectura"`, `"ejercicio"`, `"enfoque"`, `"sueno"`, `"animo"`; `customGoal`: texto (máx. 60) o `null`. Al menos una meta o `customGoal`. Crea la cuenta con `pet: null`. |
| `PUT /usuarios/me/cuenta` | `AccountChanges` | `Account` | Mi perfil (RDF024, RDF026). Mismos campos, todos opcionales, más `photoUrl` y `petColor` (`"verde"`, `"morado"`, `"rojo"`, `"azul"` o `"naranja"`; colorea el aura y el hábitat de la mascota). |
| `PUT /usuarios/me/mascota` | `{ "pet": "dragon" }` | `Account` | "Bienvenido a Life-RPG". `pet`: `"gato"`, `"perro"`, `"dragon"`, `"hamster"` o `"leon"`. **Solo una vez por cuenta**: `400` si ya tiene mascota. Crea su Tamagotchi. |

Flujo del móvil (ruta B): Login (Google o correo) → si `GET /usuarios/me/cuenta` da `404` → Crear cuenta →
si `pet` es `null` → Bienvenida (elegir animal) → Casa. La sesión queda guardada en el teléfono: al abrir la app
otra vez entra directo. En otro celular, al iniciar sesión ya tiene su cuenta y su animal.

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
| `PATCH /vestidor/articulos/:id` | `{ "equipped": true }` | `WardrobeItem[]` | RDF021 y RDF022. Al equipar, quita lo que había en esa parte. `400` si `owned` es `false`. |

`WardrobeItem.owned`: `false` si la prenda aún no es del jugador (se compra, se gana con un logro o se desbloquea por nivel; `status` dice cuál).

### M02 · Hábitos diarios · módulo móvil `habitos`

Modelo: `Quest.ts`. Recompensa por dificultad: `facil` 10, `media` 20, `dificil` 40 (XP y puntos del tipo del hábito).
Penalizaciones fijas: `"hp"` (−10 HP), `"racha"` (reiniciar racha), `"puntos"` (−25 pts). `days`: 1 lunes … 7 domingo.

| Método y ruta | Cuerpo | Responde | Notas |
| :-- | :-- | :-- | :-- |
| `GET /habitos/hoy` | — | `TodayHabit[]` | RDF027. Los activos programados para hoy, con `done`. |
| `GET /habitos` | — | `Habit[]` | Todos, incluidos los pausados (`active: false`). |
| `GET /habitos/:id` | — | `Habit` | |
| `POST /habitos` | `NewHabitInput` | `Habit` (`201`) | RDF031. Nombre obligatorio (máx. 40), al menos un día. `focusMinutes`: `null` o de 10 a 120. |
| `PUT /habitos/:id` | `NewHabitInput` | `Habit` | RDF034. Aplica desde mañana; no cambia el historial. |
| `PATCH /habitos/:id` | `{ "active": false }` | `Habit` | RDF035. Pausar o reactivar; conserva historial y rachas. |
| `POST /habitos/:id/checkin` | — | `CheckInResult` | RDF028. Una vez al día (`400` si ya estaba). Suma puntos y XP. `unlockedAchievements`: nombres de logros que se desbloquearon. Si el hábito tiene `focusMinutes`, el móvil lo llama solo al terminar su Modo concentración. |
| `DELETE /habitos/:id/checkin` | — | `CheckInResult` | RDF029. Solo el mismo día; resta la recompensa (`xpChange` y `pointsChange` negativos). |
| `GET /habitos/rachas?mes=AAAA-MM&habito=:id` | — | `StreakCalendar` | RDF036 a RDF038. Sin `habito` = todos. Estados por día: `completo`, `parcial`, `fallido`, `sin_habitos`, `futuro`. |

**Racha global:** días seguidos con al menos un hábito cumplido; un día sin ninguno la rompe. **Por hábito:**
días seguidos cumpliéndolo (los días que no le tocaba no la rompen). **Cierre diario (RDF030):** a las 23:59
el servidor marca los no cumplidos y aplica su penalización.

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
| `GET /tienda/precio-sugerido` | — | `SuggestedPrice` | `min`/`max`: sugerido para el nivel. `allowedMin`/`allowedMax`: rango permitido por la economía global (M14, RDF054); fuera de él, crear o editar responde `400`. |
| `POST /tienda/recompensas` | `NewRewardInput` | `ShopItem` | Nombre obligatorio y precio mayor a 0 (dentro del rango del M14). Queda con `isCustom: true`. |
| `GET /tienda/recompensas/:id` | — | `CustomReward` | Datos completos de una recompensa propia, para editarla. |
| `PUT /tienda/recompensas/:id` | `NewRewardInput` | `ShopItem` | RDF055. Solo recompensas propias. |
| `DELETE /tienda/recompensas/:id` | — | `204` | RDF056. Solo recompensas propias. |
| `GET /inventario/canjes` | — | `RedemptionEntry[]` | RDF059. Recompensas y consumibles usados, del más reciente al más antiguo. |
| `GET /inventario` | — | `Inventory` | RDF057. Recompensas, consumibles y ropa; lo que llegó como regalo de un amigo (M08) trae `giftFrom` con su alias. |
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

### M05 · Logros y progresión · módulo móvil `logros`

Modelo: `Achievement.ts`. `rarity`: `"comun"`, `"raro"`, `"epico"` o `"legendario"`. `area` decide a qué pantalla lleva
el botón de la ficha: `"habitos"`, `"misiones"`, `"enfoque"`, `"tienda"` o `"animo"`.

| Método y ruta | Cuerpo | Responde | Notas |
| :-- | :-- | :-- | :-- |
| `GET /logros` | — | `Achievement[]` | RDF060. Desbloqueados y bloqueados (`unlockedAt: null`) con `current` / `target`. |
| `GET /logros/:id` | — | `Achievement` | RDF063. |
| `POST /logros/:id/reclamar` | — | `ClaimResult` | RDF064. Una sola vez (`400` si ya se reclamó o si está bloqueado). Suma los puntos de `reward`. |
| `GET /progreso/comparativa` | — | `MonthlyComparison` | RDF065 a RDF067. Días 1 a hoy de este mes contra los mismos días del anterior. `dailyXp`: XP acumulada por día. |

**evaluarLogros (RDF061)** corre en el servidor tras cada check-in, misión, racha o compra. Lo que se desbloquee
en una acción se devuelve en su respuesta (p. ej. `unlockedAchievements` del check-in) y el móvil muestra el aviso.

---

## 3. Cómo se conecta un módulo (del lado del móvil)

1. El backend publica las rutas del módulo cumpliendo este contrato.
2. En el archivo `.env` del móvil se agrega la clave del módulo:
   ```
   EXPO_PUBLIC_API_URL=http://192.168.0.10:3000/api/v1
   EXPO_PUBLIC_API_MODULES=usuarios,animo
   # Claves: usuarios, tamagotchi, vestidor, habitos, misiones, tienda, logros, animo (o todos)
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
