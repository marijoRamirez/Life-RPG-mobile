# Reglas de este proyecto (Life-RPG móvil)

Lee `README.md` (estructura y estándar) y `docs/API.md` (contrato con el backend) antes de cambiar código. Lo esencial:

- **MVVM por capas.** View (`src/app`, `src/components`) → ViewModel (`src/viewmodels`) → Service (`src/services`) → `apiClient`. Las pantallas no tienen datos ni lógica; solo llaman a su ViewModel.
- **Dentro de `src/app/` solo van pantallas** (Expo Router convierte cada archivo en ruta). Estilos en `src/styles`, constantes en `src/constants`, tipos en `src/models`.
- **Backend: Node + Express** en `/api/v1`. El contrato es `docs/API.md`; si una ruta o un dato cambia, actualiza primero ese archivo.
- **Cada servicio tiene dos mitades**: `real ? api.<método>(ENDPOINTS…) : mock.<función>()`. La API real siempre pasa por `api` de `src/services/apiClient.ts` con rutas de `src/constants/endpoints.ts`; nunca `fetch` directo ni URLs a mano. Los datos simulados van en `src/services/mocks/` y devuelven lo mismo que la API.
- **No leas `process.env` fuera de `src/config/env.ts`.** Los módulos conectados se controlan con `EXPO_PUBLIC_API_MODULES`.
- **Datos:** IDs siempre `string`; fechas ISO 8601 (`AAAA-MM-DD` para días); campos en inglés `camelCase`; tipos de puntos `"cultura" | "fisico" | "enfoque"` (`PointType` de `src/models/common.ts`). No dupliques tipos ni datos que ya existen (los puntos del usuario salen de `userService.getPoints()`).
- **Errores:** el backend responde `{ "error": "mensaje" }`; llega como `ApiError`. En los ViewModels usa `try / catch / finally` y muestra `error.message`.
- **Reglas de negocio en el servidor.** El móvil no calcula XP, saldos ni recompensas.
- **Código y comentarios** en el estilo del repo: nombres en inglés, comentarios y textos en español, con el RF/RDF cuando aplique.
- **Sesión (M00):** léela con `useSession()` de `src/viewmodels/SessionProvider.tsx`. No llames a Firebase fuera de `src/services/firebase/`; usa `authService`. Para programar sin login deja `EXPO_PUBLIC_AUTH_MODE=mock` (por defecto). No protejas rutas a mano: `app/_layout.tsx` ya manda a cada quien a su pantalla.
- **Mascota del jugador:** usa `<PetAvatar>` (animada, con estado por HP) o `petImage(session.account?.pet)` de `src/constants/petTypes.ts`; no escribas `require(".../gato.png")` en pantallas.
- **URL del backend:** el cliente la toma de `getApiUrl()` (`src/services/serverConfig.ts`), no directo del `.env`.
- **Pantallas nuevas:** usa `ScreenHeader` y las piezas de `src/styles/ui.styles.ts` para que todo se vea igual.
- Gestor de paquetes: **pnpm** (no generes `package-lock.json`). No agregues dependencias sin acordarlo con el equipo.
- Trabaja en una rama por módulo (`feat/mXX-nombre`) y abre Pull Request; no hagas push directo a `main`.

---

This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md
