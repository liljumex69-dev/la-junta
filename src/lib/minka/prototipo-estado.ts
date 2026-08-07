"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Estado local del prototipo.
 *
 * Guarda en `sessionStorage` las acciones que la persona ya hizo durante la demo
 * (aportó su cuota, cobró su turno, bloqueó una garantía) para que al volver al panel
 * la pantalla refleje lo que acaba de pasar en vez de mostrar siempre los mismos datos.
 *
 * TODO: conectar a smart contract — eliminar este módulo por completo. Cada una de
 * estas banderas corresponde a una transacción confirmada en Arbitrum, y el estado real
 * debe leerse del contrato, no de la sesión del navegador.
 */
const CLAVE = "minka:prototipo";

export interface EstadoPrototipo {
  /** Claves `juntaId:ciclo` en las que la usuaria ya aportó su cuota. */
  aportado: string[];
  /** Claves `juntaId:ciclo` en las que la usuaria ya cobró el pozo. */
  cobrado: string[];
  /** Claves `juntaId` en las que ya tiene garantía bloqueada. */
  garantiaBloqueada: string[];
  /** Ids de solicitudes de aval ya enviadas. */
  avalSolicitado: string[];
}

const VACIO: EstadoPrototipo = {
  aportado: [],
  cobrado: [],
  garantiaBloqueada: [],
  avalSolicitado: [],
};

function leer(): EstadoPrototipo {
  if (typeof window === "undefined") return VACIO;
  try {
    const crudo = window.sessionStorage.getItem(CLAVE);
    return crudo ? { ...VACIO, ...JSON.parse(crudo) } : VACIO;
  } catch {
    return VACIO;
  }
}

export function useEstadoPrototipo() {
  // Arranca vacío en el servidor y en el primer render del cliente para que el HTML
  // coincida; el estado guardado se aplica justo después de montar.
  const [estado, setEstado] = useState<EstadoPrototipo>(VACIO);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    setEstado(leer());
    setListo(true);
  }, []);

  const marcar = useCallback(
    (campo: keyof EstadoPrototipo, clave: string) => {
      setEstado((previo) => {
        if (previo[campo].includes(clave)) return previo;
        const siguiente = { ...previo, [campo]: [...previo[campo], clave] };
        try {
          window.sessionStorage.setItem(CLAVE, JSON.stringify(siguiente));
        } catch {
          // sessionStorage puede estar bloqueado; el prototipo sigue funcionando
        }
        return siguiente;
      });
    },
    []
  );

  const tiene = useCallback(
    (campo: keyof EstadoPrototipo, clave: string) =>
      estado[campo].includes(clave),
    [estado]
  );

  return { estado, marcar, tiene, listo };
}

export function claveCiclo(juntaId: string, ciclo: number) {
  return `${juntaId}:${ciclo}`;
}
