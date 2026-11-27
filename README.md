# Life-RPG · App Móvil (Frontend)

Cliente móvil en **React Native con Expo y TypeScript**, con arquitectura **MVVM (Model-View-ViewModel)**.

**Nota importante:** el móvil es solo la interfaz. Las reglas de negocio (XP, HP, saldos, validaciones) viven en el backend (`liferpg-backend`, **Node + Express**); el móvil consulta y guarda todo por su API REST.

> 📄 **El acuerdo con el backend está en [`docs/API.md`](docs/API.md).** Ahí están todas las rutas, qué reciben, qué devuelven y el formato de errores. Antes de programar un endpoint (en el back) o un servicio (en el móvil), se revisa o se actualiza ese archivo.

---

## Arquitectura y Flujo de Trabajo (MVVM)

**Flujo:** `View (app/)` → `ViewModel (viewmodels/)` → `Service (services/)` → `apiClient` → `Backend API`.

| Capa | Carpeta | Responsabilidad |
| :-- | :-- | :-- |
| **Model** | `src/models/` | Interfaces y tipos de TypeScript. Son la forma exacta de lo que envía y recibe la API. **Sin lógica.** |
| **View** | `src/app/` y `src/components/` | Pantallas (Expo Router) y componentes. Solo dibujan y llaman al ViewModel. |
| **ViewModel** | `src/viewmodels/` | Custom Hooks (`useXxxViewModel.ts`). Estados de carga y error, validaciones de pantalla y datos listos para mostrar. |
| **Service** | `src/services/` | Una función por endpoint. Cada una decide entre la **API real** y los **datos simulados**. |

---

## Estándar de integración con el backend

Estas reglas aplican a **todos** los módulos. Están resumidas aquí y completas en `docs/API.md`.

### 1. Cada servicio tiene dos mitades

```ts
// src/services/moodService.ts
const real = usesApi("animo"); // ¿este módulo ya está conectado?

// GET /animo/hoy — null si hoy no hay registro
export const getTodayMoodLog = (): Promise<MoodLog | null> =>
  real ? api.get(ENDPOINTS.animo.hoy) : mock.getTodayMoodLog();
```

- **API real:** siempre con `api` de `src/services/apiClient.ts` y una ruta de `src/constants/endpoints.ts`. Nunca `fetch` directo ni URLs escritas a mano.
- **Datos simulados:** en `src/services/mocks/xxxMock.ts`, con las mismas funciones y devolviendo **lo mismo que devolvería la API**.
- Las pantallas y los ViewModels no saben cuál de las dos se usa.

### 2. Conectar un módulo es prender un interruptor

En tu archivo `.env` (copia de `.env.example`):

```
EXPO_PUBLIC_API_URL=http://192.168.0.10:3000/api/v1
EXPO_PUBLIC_API_MODULES=usuarios,animo
```

Los módulos de la lista usan el backend; los demás siguen con datos simulados. Claves: `usuarios`, `tamagotchi`, `vestidor`, `habitos`, `misiones`, `tienda`, `logros`, `animo` (o `todos`). Vacío = toda la app simulada. Después de cambiar el `.env`, reinicia con `npx expo start -c`.

### 3. Reglas del contrato

| Tema | Regla |
| :-- | :-- |
| Rutas | Sobre `/api/v1`, en español, minúsculas y con guiones. Todas están en `endpoints.ts`. |
| Respuestas | El modelo **directo**, sin envoltorio. Campos en inglés y `camelCase`, iguales a `src/models/`. |
| IDs | Siempre `string`. |
| Fechas | ISO 8601 para momentos; `AAAA-MM-DD` para días; `HH:mm` para horas. |
| Tipos de puntos | `"cultura"`, `"fisico"`, `"enfoque"` (tipo `PointType` de `models/common.ts`). El texto visible sale de `constants/pointTypes.ts`. |
| Errores | El backend responde `{ "error": "mensaje en español" }` con su código HTTP. `apiClient` lo convierte en `ApiError` y el ViewModel muestra `error.message`. |
| Usuario | Con Firebase (`EXPO_PUBLIC_AUTH_MODE=firebase`), `apiClient` manda `Authorization: Bearer <token de Firebase>`. En los modos de prueba manda `x-user-id` con el usuario de prueba. Ver "Inicio de sesión (M00)". |
| Datos compartidos | Lo que usan varios módulos tiene **una sola fuente**. Los puntos del usuario se piden con `getPoints()` de `userService`, no se copian en cada módulo. |
| Reglas de negocio | Las valida el servidor. El móvil no recalcula XP, saldos ni recompensas. |

### 4. Inicio de sesión (M00)

La app tiene tres modos, con `EXPO_PUBLIC_AUTH_MODE` en el `.env`:

| Modo | Qué pasa | Para qué |
| :-- | :-- | :-- |
| `mock` (por defecto) | La sesión ya está iniciada con el usuario de prueba. La app abre en la Casa. | Programar cualquier módulo sin pensar en el login. |
| `mock-login` | Datos simulados, pero empieza **sin sesión**. Cuenta de prueba: `yess@liferpg.mx` / `Prueba123`; "Continuar con Google" entra como Valeria (cuenta nueva). | Probar Login, Crear cuenta y Bienvenida sin Firebase. |
| `firebase` | Firebase Authentication real (correo y contraseña, y Google en la versión web). Necesita las variables `EXPO_PUBLIC_FIREBASE_*` (pídelas al equipo). | Probar el login real. |

Flujo (ruta B): **Login** (Google o correo) → **Crear cuenta** (nombre y apellido desde Google y editables, contraseña, edad, género y metas) → **Bienvenido a Life-RPG** (elige tu animal, una sola vez por cuenta) → **Casa**. La sesión queda guardada en el teléfono: al abrir la app otra vez entra directo, como Pokémon GO.

- La sesión vive en `src/viewmodels/SessionProvider.tsx`. Las pantallas la leen con `useSession()` (usuario, cuenta y `signOut`). `app/_layout.tsx` decide a qué pantalla va cada quien; no hace falta proteger cada ruta a mano.
- Firebase solo se usa dentro de `src/services/firebase/`. El resto llama a `authService`, que elige Firebase o el modo de prueba.
- Google en el celular necesita una *development build* (no funciona en Expo Go). En Expo Go entra con correo y contraseña; en la versión web (`w`) Google sí funciona.

---

## Estructura de Carpetas

Organización **por capas**: cada carpeta es una capa y dentro hay un archivo por módulo.

```
docs/
└─ API.md                    Contrato con el backend (rutas, datos y errores)
src/
├─ app/                      VIEW · pantallas (Expo Router: la ruta del archivo es la URL)
│  ├─ _layout.tsx            Navegador raíz, fuente RetroTech y a qué pantalla va cada quien según su sesión
│  ├─ index.tsx              Casa / HUD principal (M01)
│  ├─ acceso/                M00 · login, crearCuenta, recuperar, bienvenida
│  ├─ area1_jugabilidad/     habitos/ (M02) · looks-vestidor/ y perfil/ (M01, + ajustes) · misiones/ (M03)
│  └─ area2_economia/        tienda/ (M04) · logros/ (M05) · animo/ (M06)
├─ components/               VIEW · piezas visuales reutilizables
│  ├─ ui/                    Compartidas: BottomNav, PixelIcons, ScreenHeader, AchievementToast, ComingSoon
│  └─ acceso/ misiones/ tienda/ logros/ animo/   Propias de cada módulo
├─ viewmodels/               VIEWMODEL · un hook por pantalla (useXxxViewModel.ts) + SessionProvider (sesión)
├─ services/                 SERVICE · un archivo por módulo (xxxService.ts)
│  ├─ apiClient.ts           Cliente HTTP único: URL, usuario o token, tiempo límite y errores
│  ├─ authService.ts         Inicio de sesión: Firebase o modo de prueba
│  ├─ firebase/              Lo único que habla con Firebase
│  ├─ notificationService.*  Recordatorio diario de ánimo (notificación local, solo celular)
│  └─ mocks/                 Datos simulados (xxxMock.ts) y mockUtils.ts
├─ models/                   MODEL · tipos por módulo + common.ts (tipos compartidos)
├─ constants/                endpoints.ts (rutas de la API), theme.ts, pointTypes.ts y xxxTypes.ts por módulo
├─ config/
│  └─ env.ts                 Único lugar que lee el .env (URL, módulos conectados, usuario de prueba)
└─ styles/                   Estilos por módulo (xxx.styles.ts)
```

> ⚠️ **Dentro de `src/app/` solo van pantallas.** Expo Router trata cualquier archivo ahí como una ruta, así que estilos, datos o componentes van en sus carpetas, nunca en `app/`.

### Qué hay de cada módulo

| Módulo | View (`app/`) | ViewModel | Service (y su mock) | Model | Clave en `.env` |
| :-- | :-- | :-- | :-- | :-- | :-- |
| Usuario actual (compartido) | — | — | `userService` | `UserProfile`, `common` | `usuarios` |
| M00 Acceso | `acceso/` | `SessionProvider`, `useLogin…`, `useCreateAccount…`, `useRecoverPassword…`, `useChoosePet…` | `authService`, `userService` | `Account` | `usuarios` |
| M01 Casa | `index.tsx` | `useTamagotchiViewModel` | `tamagotchiService`, `userService` | `Tamagotchi` | `tamagotchi` |
| M01 Vestidor | `looks-vestidor/` | `useWardrobeViewModel`, `useSaveLookViewModel` | `wardrobeService` | `Wardrobe` | `vestidor` |
| M01 Perfil y Ajustes | `perfil/` | `useProfile…`, `useChangePassword…`, `useSettings…` | `userService`, `authService`, `moodService` | `Account`, `UserProfile` | `usuarios` |
| M02 Hábitos | `habitos/` (+ `enfoque` para hábitos con tiempo de enfoque) | `useHabitCheckin…`, `useHabitEditor…`, `useStreakCalendar…`, `useHabitFocus…` | `habitService` | `Quest` | `habitos` |
| M03 Misiones | `misiones/` | `useMissionBoard…`, `useFocusSession…`, `useMissionHistory…` | `missionService` | `Mission` | `misiones` |
| M04 Tienda | `tienda/` (+ `canjes`) | `useShopShowcase…`, `useRewardCreator…`, `useInventory…`, `useRedemptionHistory…` | `shopService` | `Item` | `tienda` |
| M05 Logros | `logros/` | `useAchievements…`, `useAchievementDetail…`, `useMonthlyComparison…` | `achievementService` | `Achievement` | `logros` |
| M06 Ánimo | `animo/` | `useMoodRegister…`, `useMoodChart…`, `useMoodJournal…` | `moodService` | `MoodLog` | `animo` |

### Cómo agregar o terminar una pantalla

1. **Contrato**: agrega las rutas del módulo a `docs/API.md` (método, ruta, cuerpo y respuesta) y a `src/constants/endpoints.ts`.
2. **Model**: define en `src/models/` los tipos de lo que viaja por la API. Si el dato ya existe en otro módulo, reutilízalo (`common.ts`).
3. **Mock**: en `src/services/mocks/xxxMock.ts`, una función por endpoint que devuelva lo mismo que devolverá la API (usa `delay`, `copy` y `newId` de `mockUtils.ts`).
4. **Service**: en `src/services/xxxService.ts`, una función por endpoint con las dos mitades (`real ? api… : mock…`). Si el módulo es nuevo, agrega su clave a `ApiModule` en `src/config/env.ts`.
5. **ViewModel**: en `src/viewmodels/useXxxViewModel.ts` maneja carga, error y deja los datos listos para mostrar.
6. **View**: en `src/app/...` la pantalla solo dibuja y llama al ViewModel (`const vm = useXxxViewModel()`).
7. **Estilos y constantes**: en `src/styles/xxx.styles.ts` y `src/constants/xxxTypes.ts`, con los colores de `theme.ts`.
8. Antes del PR corre `npx tsc --noEmit`; debe dar **0 errores**.

### Carpetas Compartidas

- **`assets/`**: `images/` (mascotas) y `fonts/` (tipografía RetroTech).
- **`src/components/ui/`**: `BottomNav`, `PixelIcons` (todos los íconos), `PetAvatar` (mascota animada con su ropa y su estado según el HP), `ScreenHeader` (regresar + título), `AchievementToast` (aviso de logro) y `ComingSoon` (pantalla temporal para rutas futuras).
- **Dirección del servidor:** `src/services/serverConfig.ts`. Sale del `.env`, pero el jugador la puede cambiar en Ajustes › Servidor (nube o IP de la red local).
- **`src/styles/ui.styles.ts`**: piezas visuales comunes (tarjetas, botones, chips, etiquetas) para pantallas nuevas.

---

## División de Tareas por Módulos

El desarrollo está segmentado en 15 módulos asignados a 5 desarrolladores a lo largo de 3 Sprints (S1, S2, S3). Cada módulo debe contener estrictamente **3 pantallas o vistas diferentes**.

| Carpeta Asignada             | Módulo                                             | Responsable | Área  |
| :--------------------------- | :------------------------------------------------- | :---------- | :---- |
| `m00-usuarios-autenticacion` | Usuarios, autenticación y dispositivo              | Equipo      | Ambas |
| `m01-tamagotchi-perfil`      | Tamagotchi y perfil de usuario                     | Majo        | Móvil |
| `m02-habitos`                | Hábitos diarios (quests)                           | Majo        | Móvil |
| `m03-misiones-enfoque`       | Misiones únicas y enfoque                          | Angel       | Móvil |
| `m04-tienda`                 | Tienda de la mascota                               | Emi         | Móvil |
| `m05-logros-progresion`      | Logros y progresión                                | Mike        | Móvil |
| `m06-vitalidad`              | Vitalidad y estado de la mascota                   | Jandro      | Móvil |
| `m07-visualizador-usuarios`  | Visualizador de usuarios (Perfil Lite)             | Majo        | PWA   |
| `m08-botin`                  | Botín (regalos entre amigos / visor de evidencias) | Angel       | PWA   |
| `m09-diario-aventura`        | Diario de aventura (Dashboard Analítico)           | Angel       | PWA   |
| `m10-notificaciones`         | Notificaciones de acompañamiento (Alertas)         | Emi         | PWA   |
| `m11-resumen-progreso`       | Resumen de progreso y daño                         | Emi         | PWA   |
| `m12-retos-grupo`            | Retos y métricas de grupo (Gremios)                | Jandro      | PWA   |
| `m13-sincronizacion-red`     | Sincronización local y red                         | Mike        | PWA   |
| `m14-economia-global`        | Balanceo de economía global                        | Jandro      | PWA   |
| `m15-gestion-bd`             | Gestión de base de datos                           | Mike        | Ambas |

---

## Configuración y Arranque

Asegúrate de tener instalado Node.js. Utilizaremos `pnpm` como gestor de paquetes para mantener la coherencia con el entorno de trabajo general.

```bash
# 1. Instalar pnpm globalmente (si no lo tienes)
npm install -g pnpm

# 2. Configurar variables de entorno (URL del backend y módulos conectados)
cp .env.example .env

# 3. Instalar dependencias del proyecto
pnpm install

# 4. Iniciar el servidor de desarrollo de Expo (limpiando caché)
pnpm exec expo start --clear
```

> **Windows con npm 12:** `npx expo start` falla con `Cannot find module ...expo\bin\cli`. Usa
> `npx pnpm@9.15.0 install` y luego `npx pnpm@9.15.0 exec expo start --clear`.

Una vez que el servidor esté corriendo, escanea el código QR con la app **Expo Go** en tu celular físico, o presiona `a` para abrir en el emulador de Android / `i` para el simulador de iOS.

### Generar el APK (EAS)

`eas.json` tiene dos perfiles. El `.env` **no** se usa al compilar en EAS (git lo ignora): cada perfil
trae sus variables.

| Perfil | Backend | Inicio de sesión | Para qué |
| :-- | :-- | :-- | :-- |
| `demo` | Ninguno: todo con datos simulados | `mock-login` (cuenta de prueba) | Enseñar la app sin servidor. |
| `render` | `https://liferpg-backend-56d5.onrender.com/api/v1`, todos los módulos conectados | Firebase real | La app completa contra el backend en la nube. |

```bash
# APK de demostración (datos simulados)
eas build -p android --profile demo

# APK conectado a Render
eas build -p android --profile render
```

Antes de compilar `render`:

1. **Variables de Firebase.** El perfil lee las `EXPO_PUBLIC_FIREBASE_*` del entorno `preview` del proyecto en
   expo.dev (no van en el repo). Se cargan una vez, con los valores de la app web de Firebase
   (Consola de Firebase › Configuración del proyecto › Tus apps):
   ```bash
   eas env:create --environment preview --name EXPO_PUBLIC_FIREBASE_API_KEY --value <valor> --visibility plaintext
   # …y lo mismo para AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID y APP_ID
   ```
   Sin `EXPO_PUBLIC_FIREBASE_API_KEY` la app cae al modo de prueba y el backend responde 401 (en producción
   solo acepta sesiones de Firebase).
2. **`google-services.json`** en la raíz del proyecto (lo pide `app.json`). No está en el repo: pídelo al equipo.
3. **Despertar el backend.** Render apaga el servicio si nadie lo usa; la primera petición tarda ~40 s.
   Abre `https://liferpg-backend-56d5.onrender.com/api/v1/estado` antes de presentar.

Los módulos conectados se fijan al compilar (`EXPO_PUBLIC_API_MODULES`); la dirección del servidor se puede
cambiar después en la app desde **Ajustes › Servidor**.
