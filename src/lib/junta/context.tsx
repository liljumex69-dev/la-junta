"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AHORRO_SEED,
  ANUNCIOS_SEED,
  ASOCIACION_DEMO,
  CUOTAS_SEED,
  DIRECTIVOS_DEMO,
  MOVIMIENTOS_FONDO_SEED,
  NOTIFICACIONES_SEED,
  PROPUESTAS_SEED,
  USUARIOS_SEED,
} from "./seed";
import { formatoPeriodo } from "./format";
import type {
  Anuncio,
  Asociacion,
  CargoDirectivo,
  ConfiguracionAsociacion,
  ContactoConfianza,
  CuotaComerciante,
  DirectivoInicial,
  MovimientoAhorro,
  MovimientoFondo,
  Notificacion,
  PropuestaGasto,
  Usuario,
} from "./types";

/**
 * Estado y acciones de Junta — todo en memoria, nada persistente.
 *
 * A propósito: sin localStorage, sin sessionStorage, sin base de datos real. El
 * estado vive en un `useState` de este Context y se reinicia limpio en cada recarga
 * de página. Es la simulación más honesta posible de un producto que, en su versión
 * real, no guarda nada del lado del cliente — todo vive en el Safe y en el contrato
 * Stylus en Arbitrum.
 *
 * TODO: conectar a Safe/smart contract — reemplazar toda esta implementación por
 * lecturas y transacciones reales. Las acciones mantienen su firma para que, al
 * integrar, las pantallas no necesiten cambiar — solo esta capa.
 */

/** PIN de demostración para simular la fricción de una firma real. Solo en el prototipo. */
export const PIN_DEMO = "1234";

interface EstadoJunta {
  usuarios: Usuario[];
  sesionUsuarioId: string | null;
  asociaciones: Asociacion[];
  cuotas: CuotaComerciante[];
  movimientosFondo: MovimientoFondo[];
  propuestas: PropuestaGasto[];
  ahorro: MovimientoAhorro[];
  anuncios: Anuncio[];
  contactos: Record<string, ContactoConfianza[]>;
  notificaciones: Notificacion[];
}

function estadoInicial(): EstadoJunta {
  return {
    usuarios: [...USUARIOS_SEED],
    sesionUsuarioId: USUARIOS_SEED[0].id,
    asociaciones: [ASOCIACION_DEMO],
    cuotas: [...CUOTAS_SEED],
    movimientosFondo: [...MOVIMIENTOS_FONDO_SEED],
    propuestas: [...PROPUESTAS_SEED],
    ahorro: [...AHORRO_SEED],
    anuncios: [...ANUNCIOS_SEED],
    contactos: {},
    notificaciones: [...NOTIFICACIONES_SEED],
  };
}

/** Colores de avatar disponibles para elegir en "Mi perfil" — todos ya
 * probados en el resto de la interfaz (primario, secundario, éxito, mora). */
export const COLORES_AVATAR = ["#1F5C3D", "#B8863B", "#4C8C5C", "#7c8a80"];

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[1][0]).toUpperCase();
}

let contador = 0;
function nuevoId(prefijo: string): string {
  contador += 1;
  return `${prefijo}-${Date.now().toString(36)}${contador}`;
}

function codigoDesdeNombre(nombre: string): string {
  const base = nombre
    .toUpperCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita tildes tras normalizar
    .replace(/[^A-Z]/g, "")
    .slice(0, 6);
  return `${base.padEnd(4, "X")}${new Date().getFullYear()}`;
}

interface ContextoJunta {
  listo: boolean;
  usuario: Usuario | null;
  usuarios: Usuario[];
  asociacion: Asociacion | null;
  /** Todas las asociaciones a las que pertenece el usuario, en el mismo orden que
   * `usuario.asociacionesIds`. La activa es `asociacion`. */
  misAsociaciones: Asociacion[];
  directivosDelDirectorio: typeof DIRECTIVOS_DEMO;
  cuotas: CuotaComerciante[];
  movimientosFondo: MovimientoFondo[];
  propuestas: PropuestaGasto[];
  ahorro: MovimientoAhorro[];
  anuncios: Anuncio[];
  contactos: ContactoConfianza[];
  notificaciones: Notificacion[];
  notificacionesNoLeidas: number;

  registrar: (datos: { nombre: string; dni: string; telefono: string }) => Usuario;
  iniciarSesion: (usuarioId: string) => void;
  iniciarSesionPorTelefono: (telefono: string) => Usuario | null;
  cerrarSesion: () => void;
  actualizarPerfil: (datos: {
    nombre?: string;
    colorAvatar?: string;
    /** `undefined` no toca la foto actual; `null` la quita explícitamente. */
    fotoUrl?: string | null;
  }) => void;

  crearAsociacion: (datos: {
    nombreMercado: string;
    numeroPuestos: number;
    umbralFirmas: number;
    cargo: CargoDirectivo;
    cargoPersonalizado?: string;
    directivosIniciales: DirectivoInicial[];
    moraActiva: boolean;
    moraPorcentaje: number;
  }) => Asociacion;
  buscarAsociacionPorCodigo: (codigo: string) => Asociacion | undefined;
  unirseAsociacion: (asociacionId: string, numeroPuesto: string) => void;
  cambiarAsociacionActiva: (asociacionId: string) => void;

  pagarCuota: (cuotaId: string) => void;
  proponerGasto: (datos: { monto: number; motivo: string; categoria: string }) => PropuestaGasto;
  firmarPropuesta: (
    propuestaId: string,
    pin: string
  ) => { ok: true; ejecutada: boolean } | { ok: false; error: string };

  agregarMovimientoAhorro: (datos: {
    tipo: "ingreso" | "egreso";
    monto: number;
    categoria: string;
    descripcion: string;
  }) => void;

  publicarAnuncio: (datos: { titulo: string; contenido: string; fijado: boolean }) => void;

  configurarAsociacion: (cambios: Partial<ConfiguracionAsociacion>) => void;

  agregarContacto: (nombre: string) => void;
  quitarContacto: (id: string) => void;

  marcarNotificacionLeida: (id: string) => void;
  marcarTodasLasNotificacionesLeidas: () => void;
  /** Devuelve el enlace de WhatsApp ya armado; el llamador decide cuándo abrirlo
   * (evita abrir pestañas desde dentro del Context). */
  enviarRecordatorioCuota: (cuotaId: string) => { enlaceWhatsapp: string | null };
}

const Contexto = createContext<ContextoJunta | null>(null);

export function ProveedorJunta({ children }: { children: React.ReactNode }) {
  const [estado, setEstado] = useState<EstadoJunta>(estadoInicial);

  // Espejo del estado en una ref: permite leer el valor vigente dentro del mismo
  // manejador de evento sin esperar al siguiente render de React — necesario, por
  // ejemplo, cuando registrar() y luego crearAsociacion() ocurren en la misma
  // función async antes de que React vuelva a renderizar.
  const estadoRef = useRef(estado);
  estadoRef.current = estado;

  const aplicar = useCallback((cambio: (previo: EstadoJunta) => EstadoJunta) => {
    const siguiente = cambio(estadoRef.current);
    estadoRef.current = siguiente;
    setEstado(siguiente);
  }, []);

  const usuario = useMemo(
    () => estado.usuarios.find((u) => u.id === estado.sesionUsuarioId) ?? null,
    [estado]
  );

  const usuarioActual = useCallback(() => {
    const p = estadoRef.current;
    return p.usuarios.find((u) => u.id === p.sesionUsuarioId) ?? null;
  }, []);

  const asociacion = useMemo(
    () =>
      usuario?.asociacionId
        ? (estado.asociaciones.find((a) => a.id === usuario.asociacionId) ?? null)
        : null,
    [estado, usuario]
  );

  const misAsociaciones = useMemo(
    () =>
      usuario
        ? usuario.asociacionesIds
            .map((id) => estado.asociaciones.find((a) => a.id === id))
            .filter((a): a is Asociacion => !!a)
        : [],
    [estado, usuario]
  );

  const valor: ContextoJunta = {
    listo: true,
    usuario,
    usuarios: estado.usuarios,
    asociacion,
    misAsociaciones,
    directivosDelDirectorio: DIRECTIVOS_DEMO,
    cuotas: asociacion
      ? estado.cuotas.filter((c) => c.asociacionId === asociacion.id)
      : [],
    movimientosFondo: asociacion
      ? estado.movimientosFondo
          .filter((m) => m.asociacionId === asociacion.id)
          .sort((a, b) => b.fecha.localeCompare(a.fecha))
      : [],
    propuestas: asociacion
      ? estado.propuestas
          .filter((p) => p.asociacionId === asociacion.id)
          .sort((a, b) => b.fecha.localeCompare(a.fecha))
      : [],
    ahorro: usuario
      ? estado.ahorro
          .filter((m) => m.comercianteId === usuario.id)
          .sort((a, b) => b.fecha.localeCompare(a.fecha))
      : [],
    anuncios: asociacion
      ? estado.anuncios
          .filter((a) => a.asociacionId === asociacion.id)
          .sort((a, b) => b.fecha.localeCompare(a.fecha))
      : [],
    contactos: usuario ? (estado.contactos[usuario.id] ?? []) : [],
    notificaciones: usuario
      ? estado.notificaciones
          .filter((n) => n.usuarioId === usuario.id)
          .sort((a, b) => b.fecha.localeCompare(a.fecha))
      : [],
    notificacionesNoLeidas: usuario
      ? estado.notificaciones.filter((n) => n.usuarioId === usuario.id && !n.leida).length
      : 0,

    registrar: (datos) => {
      const limpio = datos.telefono.replace(/\D/g, "");
      const existente = estadoRef.current.usuarios.find(
        (u) => u.telefono.replace(/\D/g, "") === limpio
      );
      if (existente) {
        aplicar((p) => ({ ...p, sesionUsuarioId: existente.id }));
        return existente;
      }

      // TODO: conectar a Safe/smart contract — crear la identidad del usuario y, en
      // segundo plano, el firmante o beneficiario correspondiente en el Safe cuando
      // se una a una asociación. Nunca se expone clave privada ni frase semilla.
      const nuevo: Usuario = {
        id: nuevoId("u"),
        nombre: datos.nombre.trim(),
        dni: datos.dni.trim(),
        telefono: datos.telefono,
        colorAvatar: COLORES_AVATAR[estadoRef.current.usuarios.length % COLORES_AVATAR.length],
        asociacionesIds: [],
        iniciales: iniciales(datos.nombre),
        rol: "comerciante",
        asociacionId: null,
      };
      aplicar((p) => ({
        ...p,
        usuarios: [...p.usuarios, nuevo],
        sesionUsuarioId: nuevo.id,
      }));
      return nuevo;
    },

    iniciarSesion: (usuarioId) => {
      aplicar((p) => ({ ...p, sesionUsuarioId: usuarioId }));
    },

    iniciarSesionPorTelefono: (telefono) => {
      const limpio = telefono.replace(/\D/g, "");
      const encontrado =
        estadoRef.current.usuarios.find(
          (u) => u.telefono.replace(/\D/g, "") === limpio
        ) ?? null;
      if (encontrado) {
        aplicar((p) => ({ ...p, sesionUsuarioId: encontrado.id }));
      }
      return encontrado;
    },

    cerrarSesion: () => aplicar((p) => ({ ...p, sesionUsuarioId: null })),

    actualizarPerfil: (datos) => {
      const yo = usuarioActual()!;
      aplicar((p) => ({
        ...p,
        usuarios: p.usuarios.map((u) =>
          u.id === yo.id
            ? {
                ...u,
                nombre: datos.nombre?.trim() || u.nombre,
                iniciales: datos.nombre?.trim() ? iniciales(datos.nombre) : u.iniciales,
                colorAvatar: datos.colorAvatar ?? u.colorAvatar,
                fotoUrl:
                  datos.fotoUrl === undefined
                    ? u.fotoUrl
                    : (datos.fotoUrl ?? undefined),
              }
            : u
        ),
      }));
    },

    crearAsociacion: (datos) => {
      const yo = usuarioActual()!;
      // El fundador es un firmante más, sin poder especial sobre los demás — el
      // total de firmantes es él más el directorio que acaba de nombrar.
      const totalFirmantes = 1 + datos.directivosIniciales.length;
      const nueva: Asociacion = {
        id: nuevoId("a"),
        nombreMercado: datos.nombreMercado.trim(),
        numeroPuestos: datos.numeroPuestos,
        codigoInvitacion: codigoDesdeNombre(datos.nombreMercado),
        configuracion: {
          umbralFirmas: Math.min(datos.umbralFirmas, totalFirmantes),
          totalFirmantes,
          mora: {
            activa: datos.moraActiva,
            porcentaje: datos.moraPorcentaje,
            diasGracia: 5,
          },
          notificacionesActivas: true,
        },
        categorias: ["Seguridad", "Mantenimiento", "Mejoras", "Otras"],
        directivosIniciales: datos.directivosIniciales,
        creadaEn: new Date().toISOString().slice(0, 10),
      };
      // TODO: conectar a Safe/smart contract — desplegar un Safe multifirma en
      // Arbitrum con el umbral indicado y registrar al fundador como primer firmante.
      // Fundar una nueva asociación la vuelve la activa, pero no reemplaza las
      // demás a las que ya pertenece — solo cambia cuál se está viendo.
      aplicar((p) => ({
        ...p,
        asociaciones: [nueva, ...p.asociaciones],
        usuarios: p.usuarios.map((u) =>
          u.id === yo.id
            ? {
                ...u,
                asociacionId: nueva.id,
                asociacionesIds: u.asociacionesIds.includes(nueva.id)
                  ? u.asociacionesIds
                  : [...u.asociacionesIds, nueva.id],
                rol: "directivo" as const,
                cargo: datos.cargo,
                cargoPersonalizado: datos.cargoPersonalizado,
              }
            : u
        ),
      }));
      return nueva;
    },

    buscarAsociacionPorCodigo: (codigo) =>
      estadoRef.current.asociaciones.find(
        (a) => a.codigoInvitacion === codigo.trim().toUpperCase()
      ),

    unirseAsociacion: (asociacionId, numeroPuesto) => {
      const yo = usuarioActual()!;
      // TODO: conectar a Safe/smart contract — registrar al comerciante como
      // beneficiario del fondo de esta asociación.
      aplicar((p) => ({
        ...p,
        usuarios: p.usuarios.map((u) =>
          u.id === yo.id
            ? {
                ...u,
                asociacionId,
                asociacionesIds: u.asociacionesIds.includes(asociacionId)
                  ? u.asociacionesIds
                  : [...u.asociacionesIds, asociacionId],
                numeroPuesto,
                rol: "comerciante" as const,
              }
            : u
        ),
      }));
    },

    cambiarAsociacionActiva: (asociacionId) => {
      const yo = usuarioActual()!;
      if (!yo.asociacionesIds.includes(asociacionId)) return;
      aplicar((p) => ({
        ...p,
        usuarios: p.usuarios.map((u) =>
          u.id === yo.id ? { ...u, asociacionId } : u
        ),
      }));
    },

    pagarCuota: (cuotaId) => {
      const yo = usuarioActual()!;
      // TODO: conectar a Safe/smart contract — registrar el pago on-chain al
      // escanear el QR (Yape/Plin) y sumarlo al balance del Safe de la asociación.
      aplicar((p) => {
        const cuota = p.cuotas.find((c) => c.id === cuotaId);
        if (!cuota) return p;
        const movimiento: MovimientoFondo = {
          id: nuevoId("mf"),
          asociacionId: cuota.asociacionId,
          tipo: "cuota",
          monto: cuota.monto,
          fecha: new Date().toISOString().slice(0, 10),
          descripcion: `Cuota ${cuota.periodo} — Puesto ${yo.numeroPuesto ?? "?"}`,
          referenciaId: yo.id,
          hashSimulado: `0x${Math.random().toString(16).slice(2, 6)}…${Math.random().toString(16).slice(2, 6)}`,
        };
        return {
          ...p,
          cuotas: p.cuotas.map((c) =>
            c.id === cuotaId
              ? { ...c, estado: "pagado" as const, fechaPago: movimiento.fecha }
              : c
          ),
          movimientosFondo: [movimiento, ...p.movimientosFondo],
        };
      });
    },

    proponerGasto: (datos) => {
      const yo = usuarioActual()!;
      const miAsociacion = estadoRef.current.asociaciones.find(
        (a) => a.id === yo.asociacionId
      )!;
      const propuesta: PropuestaGasto = {
        id: nuevoId("pg"),
        asociacionId: miAsociacion.id,
        propuestoPorId: yo.id,
        propuestoPorNombre: yo.nombre,
        monto: datos.monto,
        motivo: datos.motivo,
        categoria: datos.categoria,
        fecha: new Date().toISOString().slice(0, 10),
        firmas: [],
        umbralRequerido: miAsociacion.configuracion.umbralFirmas,
        estado: "pendiente",
      };
      // TODO: conectar a Safe/smart contract — crear la transacción propuesta en el
      // Safe (sin ejecutar) y notificar a los demás firmantes.
      aplicar((p) => ({ ...p, propuestas: [propuesta, ...p.propuestas] }));
      return propuesta;
    },

    firmarPropuesta: (propuestaId, pin) => {
      const yo = usuarioActual()!;

      // TODO: conectar a Safe/smart contract — la verificación real es una firma
      // criptográfica del Safe (clave del dispositivo o passkey), no una comparación
      // de PIN en el cliente. Aquí el PIN solo simula la fricción de confirmar una
      // acción real de movimiento de fondos, tal como pide el documento de producto.
      if (pin !== PIN_DEMO) {
        return { ok: false, error: "PIN incorrecto. Intenta de nuevo." };
      }

      let ejecutada = false;
      aplicar((p) => {
        const propuesta = p.propuestas.find((x) => x.id === propuestaId);
        if (!propuesta || propuesta.estado !== "pendiente") return p;
        if (propuesta.firmas.some((f) => f.directivoId === yo.id)) return p;

        const firmas = [
          ...propuesta.firmas,
          { directivoId: yo.id, directivoNombre: yo.nombre, fecha: new Date().toISOString().slice(0, 10) },
        ];
        const seEjecuta = firmas.length >= propuesta.umbralRequerido;
        ejecutada = seEjecuta;

        const propuestaActualizada: PropuestaGasto = {
          ...propuesta,
          firmas,
          estado: seEjecuta ? "ejecutada" : "pendiente",
          fechaEjecucion: seEjecuta ? new Date().toISOString().slice(0, 10) : undefined,
        };

        const nuevoMovimiento: MovimientoFondo | null = seEjecuta
          ? {
              id: nuevoId("mf"),
              asociacionId: propuesta.asociacionId,
              tipo: "gasto",
              monto: propuesta.monto,
              fecha: propuestaActualizada.fechaEjecucion!,
              descripcion: propuesta.motivo,
              categoria: propuesta.categoria,
              referenciaId: propuesta.id,
              hashSimulado: `0x${Math.random().toString(16).slice(2, 6)}…${Math.random().toString(16).slice(2, 6)}`,
            }
          : null;

        return {
          ...p,
          propuestas: p.propuestas.map((x) => (x.id === propuestaId ? propuestaActualizada : x)),
          movimientosFondo: nuevoMovimiento
            ? [nuevoMovimiento, ...p.movimientosFondo]
            : p.movimientosFondo,
        };
      });

      return { ok: true, ejecutada };
    },

    agregarMovimientoAhorro: (datos) => {
      const yo = usuarioActual()!;
      const movimiento: MovimientoAhorro = {
        id: nuevoId("ma"),
        comercianteId: yo.id,
        tipo: datos.tipo,
        monto: datos.monto,
        categoria: datos.categoria,
        fecha: new Date().toISOString().slice(0, 10),
        descripcion: datos.descripcion,
      };
      aplicar((p) => ({ ...p, ahorro: [movimiento, ...p.ahorro] }));
    },

    publicarAnuncio: (datos) => {
      const yo = usuarioActual()!;
      const anuncio: Anuncio = {
        id: nuevoId("an"),
        asociacionId: yo.asociacionId!,
        publicadoPorId: yo.id,
        publicadoPorNombre: yo.nombre,
        titulo: datos.titulo,
        contenido: datos.contenido,
        fecha: new Date().toISOString().slice(0, 10),
        fijado: datos.fijado,
      };
      aplicar((p) => ({ ...p, anuncios: [anuncio, ...p.anuncios] }));
    },

    configurarAsociacion: (cambios) => {
      const yo = usuarioActual()!;
      aplicar((p) => ({
        ...p,
        asociaciones: p.asociaciones.map((a) =>
          a.id === yo.asociacionId
            ? { ...a, configuracion: { ...a.configuracion, ...cambios } }
            : a
        ),
      }));
    },

    agregarContacto: (nombre) => {
      const yo = usuarioActual()!;
      aplicar((p) => ({
        ...p,
        contactos: {
          ...p.contactos,
          [yo.id]: [
            ...(p.contactos[yo.id] ?? []),
            { id: nuevoId("c"), nombre: nombre.trim(), iniciales: iniciales(nombre) },
          ],
        },
      }));
    },

    quitarContacto: (id) => {
      const yo = usuarioActual()!;
      aplicar((p) => ({
        ...p,
        contactos: {
          ...p.contactos,
          [yo.id]: (p.contactos[yo.id] ?? []).filter((c) => c.id !== id),
        },
      }));
    },

    marcarNotificacionLeida: (id) => {
      aplicar((p) => ({
        ...p,
        notificaciones: p.notificaciones.map((n) =>
          n.id === id ? { ...n, leida: true } : n
        ),
      }));
    },

    marcarTodasLasNotificacionesLeidas: () => {
      const yo = usuarioActual();
      if (!yo) return;
      aplicar((p) => ({
        ...p,
        notificaciones: p.notificaciones.map((n) =>
          n.usuarioId === yo.id ? { ...n, leida: true } : n
        ),
      }));
    },

    enviarRecordatorioCuota: (cuotaId) => {
      const yo = usuarioActual()!;
      const cuota = estadoRef.current.cuotas.find((c) => c.id === cuotaId);
      if (!cuota) return { enlaceWhatsapp: null };
      const comerciante = estadoRef.current.usuarios.find(
        (u) => u.id === cuota.comercianteId
      );
      if (!comerciante) return { enlaceWhatsapp: null };

      // TODO: conectar a Safe/smart contract — no aplica: el recordatorio es
      // comunicación, no un movimiento del fondo. Sí debería registrarse quién y
      // cuándo lo mandó, para no spamear al mismo comerciante varias veces al día.
      const notificacion: Notificacion = {
        id: nuevoId("n"),
        usuarioId: comerciante.id,
        tipo: "recordatorio_cuota",
        titulo: `Tu cuota de ${formatoPeriodo(cuota.periodo)} sigue pendiente`,
        mensaje: `${yo.nombre} te recuerda pagar tu cuota para mantenerte al día.`,
        fecha: new Date().toISOString().slice(0, 10),
        leida: false,
        enlace: "/fondo/pagar",
      };
      aplicar((p) => ({ ...p, notificaciones: [notificacion, ...p.notificaciones] }));

      const telefonoLimpio = comerciante.telefono.replace(/\D/g, "");
      const mensaje = encodeURIComponent(
        `Hola ${comerciante.nombre.split(" ")[0]}, te recordamos pagar tu cuota de Junta. Puedes hacerlo escaneando el QR desde la app.`
      );
      return { enlaceWhatsapp: `https://wa.me/51${telefonoLimpio}?text=${mensaje}` };
    },
  };

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useJunta(): ContextoJunta {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("useJunta debe usarse dentro de <ProveedorJunta>");
  return ctx;
}
