// Rutas de la API, en un solo lugar. Los servicios nunca escriben una URL a mano.
// Convención: recursos en español, minúsculas y con guiones; se montan sobre /api/v1.
// Lo que recibe y devuelve cada una está en docs/API.md.

export const ENDPOINTS = {
  // Usuario actual (compartido por varios módulos)
  usuarios: {
    yo: "/usuarios/me",
    puntos: "/usuarios/me/puntos",
    atributos: "/usuarios/me/atributos",
    privacidad: "/usuarios/me/privacidad",
    cuenta: "/usuarios/me/cuenta", // M00 · cuenta del juego (crear y consultar)
    mascota: "/usuarios/me/mascota", // M00 · animal elegido en la Bienvenida
  },

  // M01 · Tamagotchi
  tamagotchi: {
    actual: "/tamagotchi",
  },

  // M01 · Vestidor y looks
  vestidor: {
    articulos: "/vestidor/articulos",
    lookActual: "/vestidor/look-actual",
    looks: "/vestidor/looks",
    usarLook: (id: string) => `/vestidor/looks/${id}/usar`,
    articulo: (id: string) => `/vestidor/articulos/${id}`,
  },

  // M02 · Hábitos diarios
  habitos: {
    hoy: "/habitos/hoy",
    lista: "/habitos",
    uno: (id: string) => `/habitos/${id}`,
    checkin: (id: string) => `/habitos/${id}/checkin`,
    rachas: (mes: string, habitoId: string | null) =>
      `/habitos/rachas?mes=${mes}${habitoId ? `&habito=${habitoId}` : ""}`,
  },

  // M03 · Misiones únicas y enfoque
  misiones: {
    activas: "/misiones?estado=activa",
    lista: "/misiones",
    una: (id: string) => `/misiones/${id}`,
    historial: "/misiones/historial",
    iniciarSesion: (id: string) => `/misiones/${id}/sesiones`,
    fallarSesion: (id: string) => `/sesiones/${id}/fallar`,
    finalizarSesion: (id: string) => `/sesiones/${id}/finalizar`,
    resultadoSesion: (id: string) => `/sesiones/${id}/resultado`,
    validarSesion: (id: string) => `/sesiones/${id}/validar`,
  },

  // M04 · Tienda e inventario
  tienda: {
    articulos: "/tienda/articulos",
    compras: "/tienda/compras",
    precioSugerido: "/tienda/precio-sugerido",
    recompensas: "/tienda/recompensas",
    recompensa: (id: string) => `/tienda/recompensas/${id}`,
    inventario: "/inventario",
    canjes: "/inventario/canjes",
    canjear: (id: string) => `/inventario/recompensas/${id}/canjear`,
    usarConsumible: (id: string) => `/inventario/consumibles/${id}/usar`,
    ropa: (id: string) => `/inventario/ropa/${id}`,
  },

  // M05 · Logros y progresión
  logros: {
    lista: "/logros",
    uno: (id: string) => `/logros/${id}`,
    reclamar: (id: string) => `/logros/${id}/reclamar`,
    comparativa: "/progreso/comparativa",
  },

  // M06 · Estado de ánimo
  animo: {
    registrar: "/animo",
    hoy: "/animo/hoy",
    recordatorio: "/animo/recordatorio",
    tendencia: (periodo: "semana" | "mes") => `/animo/tendencia?periodo=${periodo}`,
    diario: "/animo/diario",
    entrada: (id: string) => `/animo/diario/${id}`,
  },
} as const;
