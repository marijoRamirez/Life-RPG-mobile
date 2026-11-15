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

Los módulos de la lista usan el backend; los demás siguen con datos simulados. Claves: `usuarios`, `tamagotchi`, `vestidor`, `misiones`, `tienda`, `animo` (o `todos`). Vacío = toda la app simulada. Después de cambiar el `.env`, reinicia con `npx expo start -c`.

### 3. Reglas del contrato

| Tema | Regla |
| :-- | :-- |
| Rutas | Sobre `/api/v1`, en español, minúsculas y con guiones. Todas están en `endpoints.ts`. |
| Respuestas | El modelo **directo**, sin envoltorio. Campos en inglés y `camelCase`, iguales a `src/models/`. |
| IDs | Siempre `string`. |
| Fechas | ISO 8601 para momentos; `AAAA-MM-DD` para días; `HH:mm` para horas. |
| Tipos de puntos | `"cultura"`, `"fisico"`, `"enfoque"` (tipo `PointType` de `models/common.ts`). El texto visible sale de `constants/pointTypes.ts`. |
| Errores | El backend responde `{ "error": "mensaje en español" }` con su código HTTP. `apiClient` lo convierte en `ApiError` y el ViewModel muestra `error.message`. |
| Usuario | Sin login todavía: `apiClient` manda `x-user-id` con el usuario de prueba. Con el M00 mandará el token JWT (`setAuthToken`). |
| Datos compartidos | Lo que usan varios módulos tiene **una sola fuente**. Los puntos del usuario se piden con `getPoints()` de `userService`, no se copian en cada módulo. |
| Reglas de negocio | Las valida el servidor. El móvil no recalcula XP, saldos ni recompensas. |

---

## Estructura de Carpetas

Organización **por capas**: cada carpeta es una capa y dentro hay un archivo por módulo.

```
docs/
└─ API.md                    Contrato con el backend (rutas, datos y errores)
src/
├─ app/                      VIEW · pantallas (Expo Router: la ruta del archivo es la URL)
│  ├─ _layout.tsx            Navegador raíz y carga de la fuente RetroTech
│  ├─ index.tsx              Casa / HUD principal (M01)
│  ├─ area1_jugabilidad/     habitos/ (M02) · looks-vestidor/ y perfil/ (M01) · misiones/ (M03)
│  └─ area2_economia/        tienda/ (M04) · logros/ (M05) · animo/ (M06)
├─ components/               VIEW · piezas visuales reutilizables
│  ├─ ui/                    Compartidas: BottomNav, PixelIcons, ComingSoon
│  └─ misiones/ tienda/ animo/   Propias de cada módulo
├─ viewmodels/               VIEWMODEL · un hook por pantalla (useXxxViewModel.ts)
├─ services/                 SERVICE · un archivo por módulo (xxxService.ts)
│  ├─ apiClient.ts           Cliente HTTP único: URL, usuario, tiempo límite y errores
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
| M01 Casa | `index.tsx` | `useTamagotchiViewModel` | `tamagotchiService`, `userService` | `Tamagotchi` | `tamagotchi` |
| M01 Vestidor | `looks-vestidor/` | `useWardrobeViewModel`, `useSaveLookViewModel` | `wardrobeService` | `Wardrobe` | `vestidor` |
| M03 Misiones | `misiones/` | `useMissionBoard…`, `useFocusSession…`, `useMissionHistory…` | `missionService` | `Mission` | `misiones` |
| M04 Tienda | `tienda/` | `useShopShowcase…`, `useRewardCreator…`, `useInventory…` | `shopService` | `Item` | `tienda` |
| M06 Ánimo | `animo/` | `useMoodRegister…`, `useMoodChart…`, `useMoodJournal…` | `moodService` | `MoodLog` | `animo` |
| M02 Hábitos · M05 Logros · Perfil | Pantallas "En construcción" (`ComingSoon`) | — | — | `Quest` (pendiente) | — |

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
- **`src/components/ui/`**: `BottomNav`, `PixelIcons` (todos los íconos) y `ComingSoon` (pantalla temporal para rutas pendientes).

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
pnpm dlx expo start -c
```

Una vez que el servidor esté corriendo, escanea el código QR con la app **Expo Go** en tu celular físico, o presiona `a` para abrir en el emulador de Android / `i` para el simulador de iOS.
