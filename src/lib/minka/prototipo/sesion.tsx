"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  AsignacionTurnos,
  FrecuenciaCuota,
  Junta,
  ModoJunta,
  Usuario,
  VisibilidadJunta,
} from "../types";
import {
  type EstadoPrototipo,
  codigoDesdeNombre,
  crearUsuario,
  guardarEstado,
  iniciales,
  juntaPorCodigo,
  leerEstado,
  nuevoId,
  participanteDe,
  reiniciarEstado,
  turnosLibres,
} from "./store";

/**
 * Sesión del prototipo.
 *
 * Toda pantalla que necesite saber "quién soy" o "qué juntas tengo" pasa por aquí.
 * Al integrar, este provider es el único punto que hay que reconectar: las acciones
 * mantienen su firma y las pantallas no cambian.
 *
 * TODO: conectar a smart contract / backend — reemplazar la implementación de cada
 * acción por la llamada real. Las lecturas de juntas y score vienen del contrato;
 * la sesión y el directorio de usuarios, de la solución de auth que se elija.
 */

interface ContextoSesion {
  listo: boolean;
  usuario: Usuario | null;
  usuarios: Usuario[];
  juntas: Junta[];
  /** Juntas en las que participa el usuario con sesión iniciada. */
  misJuntas: Junta[];

  registrar: (datos: { nombre: string; telefono: string }) => Usuario;
  entrar: (usuarioId: string) => void;
  entrarPorTelefono: (telefono: string) => Usuario | null;
  salir: () => void;
  reiniciarDemo: () => void;

  crearJunta: (datos: {
    nombre: string;
    cuota: number;
    frecuencia: FrecuenciaCuota;
    totalParticipantes: number;
    modo: ModoJunta;
    visibilidad: VisibilidadJunta;
    asignacionTurnos: AsignacionTurnos;
  }) => Junta;

  buscarPorCodigo: (codigo: string) => Junta | undefined;
  /** Se pasa la junta completa: puede venir del catálogo y no estar aún en el estado. */
  unirseAJunta: (junta: Junta, turno?: number) => void;
  solicitarTurno: (juntaId: string, turno: number) => void;
  turnosDisponibles: (juntaId: string) => number[];

  aportarCuota: (juntaId: string) => void;
  cobrarTurno: (juntaId: string) => void;
  mejorarPlan: () => void;

  contactos: { id: string; nombre: string; iniciales: string }[];
  agregarContacto: (nombre: string) => void;
  quitarContacto: (id: string) => void;
}

const Contexto = createContext<ContextoSesion | null>(null);

export function ProveedorSesion({ children }: { children: React.ReactNode }) {
  const [estado, setEstado] = useState<EstadoPrototipo | null>(null);

  // El estado guardado se lee después de montar, para que el HTML del servidor y el
  // del primer render del cliente coincidan.
  useEffect(() => {
    const inicial = leerEstado();
    estadoRef.current = inicial;
    setEstado(inicial);

    // Solo se escucha `storage`, que es el evento de OTRAS pestañas. Dentro de este
    // documento el estado ya viaja por el contexto, así que volver a leerlo aquí
    // solo provocaría renders de más.
    const alCambiarEnOtraPestana = () => {
      const leido = leerEstado();
      estadoRef.current = leido;
      setEstado(leido);
    };
    window.addEventListener("storage", alCambiarEnOtraPestana);
    return () => window.removeEventListener("storage", alCambiarEnOtraPestana);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Espejo del estado en una ref: permite calcular el siguiente estado FUERA del
  // updater de setState. Escribir en localStorage dentro del updater es un efecto
  // secundario, y en modo estricto React lo ejecuta dos veces — que era justo lo que
  // hacía que una junta creada apareciera duplicada.
  const estadoRef = useRef<EstadoPrototipo | null>(null);
  estadoRef.current = estado;

  const aplicar = useCallback(
    (cambio: (previo: EstadoPrototipo) => EstadoPrototipo) => {
      const previo = estadoRef.current;
      if (!previo) return;
      const siguiente = cambio(previo);
      estadoRef.current = siguiente;
      setEstado(siguiente);
      guardarEstado(siguiente);
    },
    []
  );

  const usuario = useMemo(
    () =>
      estado?.usuarios.find((u) => u.id === estado.sesionUsuarioId) ?? null,
    [estado]
  );

  /**
   * Usuario vigente leído de la ref, no del render.
   *
   * Importa cuando dos acciones ocurren en el mismo manejador: al registrarse y
   * entrar a una junta de una invitación, `usuario` todavía valdría `null` porque
   * React no ha vuelto a renderizar. La ref sí está actualizada.
   */
  const usuarioActual = useCallback(() => {
    const p = estadoRef.current;
    if (!p) return null;
    return p.usuarios.find((u) => u.id === p.sesionUsuarioId) ?? null;
  }, []);

  const misJuntas = useMemo(() => {
    if (!estado || !usuario) return [];
    return estado.juntas.filter((j) =>
      j.participantes.some((p) => p.id === usuario.id)
    );
  }, [estado, usuario]);

  const valor: ContextoSesion = {
    listo: estado !== null,
    usuario,
    usuarios: estado?.usuarios ?? [],
    juntas: estado?.juntas ?? [],
    misJuntas,
    contactos: (usuario && estado?.contactos[usuario.id]) || [],

    registrar: (datos) => {
      // Un número ya registrado no crea una cuenta nueva: se inicia sesión con la
      // que ya existe. Sin esto, volver a pasar por el registro duplicaba la persona.
      const limpio = datos.telefono.replace(/\D/g, "");
      const existente = estadoRef.current?.usuarios.find(
        (u) => u.telefono.replace(/\D/g, "") === limpio
      );
      if (existente) {
        aplicar((p) => ({ ...p, sesionUsuarioId: existente.id }));
        return existente;
      }

      const nuevo = crearUsuario(datos);
      aplicar((p) => ({
        ...p,
        usuarios: [...p.usuarios, nuevo],
        sesionUsuarioId: nuevo.id,
        contactos: { ...p.contactos, [nuevo.id]: [] },
      }));
      return nuevo;
    },

    entrar: (usuarioId) => {
      // TODO: conectar a backend — autenticar de verdad en vez de fijar el id.
      aplicar((p) => ({ ...p, sesionUsuarioId: usuarioId }));
    },

    entrarPorTelefono: (telefono) => {
      const limpio = telefono.replace(/\D/g, "");
      const encontrado =
        estado?.usuarios.find((u) => u.telefono.replace(/\D/g, "") === limpio) ??
        null;
      if (encontrado) {
        aplicar((p) => ({ ...p, sesionUsuarioId: encontrado.id }));
      }
      return encontrado;
    },

    salir: () => aplicar((p) => ({ ...p, sesionUsuarioId: null })),

    reiniciarDemo: () => {
      reiniciarEstado();
      setEstado(leerEstado());
    },

    crearJunta: (datos) => {
      const organizador = usuarioActual()!;
      const junta: Junta = {
        id: nuevoId("j"),
        nombre: datos.nombre.trim(),
        cuota: datos.cuota,
        frecuencia: datos.frecuencia,
        totalParticipantes: datos.totalParticipantes,
        modo: datos.modo,
        visibilidad: datos.visibilidad,
        asignacionTurnos: datos.asignacionTurnos,
        cicloActual: 0,
        estado: "formandose",
        codigoInvitacion: codigoDesdeNombre(datos.nombre, datos.totalParticipantes),
        organizadorId: organizador.id,
        proximoPago: "cuando se complete el grupo",
        fondoSeguro: 0,
        // El organizador entra con el turno 1 si él asigna los turnos; si es por
        // sorteo entra sin posición fija hasta que se complete el grupo.
        participantes: [
          {
            id: organizador.id,
            nombre: organizador.nombre,
            iniciales: organizador.iniciales,
            turno: 1,
            estadoPago: "pendiente",
            score: organizador.score,
            yaCobro: false,
          },
        ],
      };
      // TODO: conectar a smart contract — desplegar la junta en Arbitrum con estos
      // parámetros y devolver la dirección real del contrato.
      aplicar((p) => ({ ...p, juntas: [junta, ...p.juntas] }));
      return junta;
    },

    buscarPorCodigo: (codigo) =>
      estado ? juntaPorCodigo(estado, codigo) : undefined,

    turnosDisponibles: (juntaId) => {
      const junta = estado?.juntas.find((j) => j.id === juntaId);
      return junta ? turnosLibres(junta) : [];
    },

    unirseAJunta: (junta, turno) => {
      const yo = usuarioActual()!;
      aplicar((p) => {
        // La junta puede venir del catálogo de ejemplo y todavía no estar en el
        // estado; en ese caso se incorpora antes de agregar al participante.
        const juntas = p.juntas.some((j) => j.id === junta.id)
          ? p.juntas
          : [{ ...junta }, ...p.juntas];

        return {
          ...p,
          juntas: juntas.map((j) => {
            const juntaId = junta.id;
            if (j.id !== juntaId) return j;
            if (j.participantes.some((x) => x.id === yo.id)) return j;
            const libres = turnosLibres(j);
            const asignado = turno ?? libres[libres.length - 1] ?? j.participantes.length + 1;
            // TODO: conectar a smart contract — registrar al participante on-chain.
            return {
              ...j,
              participantes: [
                ...j.participantes,
                {
                  id: yo.id,
                  nombre: yo.nombre,
                  iniciales: yo.iniciales,
                  turno: asignado,
                  estadoPago: "pendiente",
                  score: yo.score,
                  yaCobro: false,
                },
              ],
            };
          }),
        };
      });
    },

    solicitarTurno: (juntaId, turno) => {
      const yo = usuarioActual()!;
      // TODO: conectar a smart contract — enviar la solicitud de turno al organizador.
      aplicar((p) => ({
        ...p,
        solicitudesTurno: [
          ...p.solicitudesTurno,
          {
            id: nuevoId("st"),
            juntaId,
            usuarioId: yo.id,
            turno,
            estado: "pendiente",
          },
        ],
      }));
    },

    aportarCuota: (juntaId) => {
      const yo = usuarioActual()!;
      // TODO: conectar a smart contract — transferir cuota + prima al contrato.
      aplicar((p) => ({
        ...p,
        juntas: p.juntas.map((j) =>
          j.id !== juntaId
            ? j
            : {
                ...j,
                participantes: j.participantes.map((x) =>
                  x.id === yo.id ? { ...x, estadoPago: "pagado" as const } : x
                ),
              }
        ),
        usuarios: p.usuarios.map((u) =>
          u.id !== yo.id
            ? u
            : {
                ...u,
                cuotasPagadas: u.cuotasPagadas + 1,
                score: Math.min(100, u.score + 2),
                puntualidad: Math.min(
                  100,
                  Math.round(
                    ((u.puntualidad * u.cuotasPagadas + 100) /
                      (u.cuotasPagadas + 1)) || 100
                  )
                ),
                historial: [
                  {
                    id: nuevoId("h"),
                    tipo: "cuota_pagada" as const,
                    descripcion: `Pagaste tu cuota a tiempo en “${
                      p.juntas.find((j) => j.id === juntaId)?.nombre ?? "tu junta"
                    }”`,
                    fecha: "Hoy",
                    impactoScore: 2,
                  },
                  ...u.historial,
                ],
              }
        ),
      }));
    },

    cobrarTurno: (juntaId) => {
      const yo = usuarioActual()!;
      // TODO: conectar a smart contract — liberar el pozo completo del ciclo.
      aplicar((p) => ({
        ...p,
        juntas: p.juntas.map((j) =>
          j.id !== juntaId
            ? j
            : {
                ...j,
                participantes: j.participantes.map((x) =>
                  x.id === yo.id ? { ...x, yaCobro: true } : x
                ),
              }
        ),
        usuarios: p.usuarios.map((u) =>
          u.id !== yo.id
            ? u
            : {
                ...u,
                historial: [
                  {
                    id: nuevoId("h"),
                    tipo: "turno_cobrado" as const,
                    descripcion: `Cobraste tu turno en “${
                      p.juntas.find((j) => j.id === juntaId)?.nombre ?? "tu junta"
                    }”`,
                    fecha: "Hoy",
                    impactoScore: 0,
                  },
                  ...u.historial,
                ],
              }
        ),
      }));
    },

    mejorarPlan: () => {
      const yo = usuarioActual()!;
      // TODO: conectar a la pasarela de pago del plan. El plan es un cobro de
      // servicio de Minka y no toca el pozo de ninguna junta.
      aplicar((p) => ({
        ...p,
        usuarios: p.usuarios.map((u) =>
          u.id === yo.id ? { ...u, plan: "pro" as const } : u
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
  };

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useSesion(): ContextoSesion {
  const ctx = useContext(Contexto);
  if (!ctx) {
    throw new Error("useSesion debe usarse dentro de <ProveedorSesion>");
  }
  return ctx;
}

export { participanteDe };
