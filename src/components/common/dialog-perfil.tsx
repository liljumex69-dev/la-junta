"use client";

import { useEffect, useState } from "react";
import { Check } from "@phosphor-icons/react/ssr";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COLORES_AVATAR } from "@/lib/junta/context";
import { useJunta } from "@/lib/junta/context";

/**
 * Mi perfil — lo que es de la persona, no de la asociación.
 *
 * Separado a propósito de "Ajustes de la asociación": ahí se configuran las
 * reglas del fondo (umbral, mora), aquí solo el nombre y el color de tu
 * avatar. El teléfono no se edita aquí — es la identidad con la que entras,
 * cambiarlo es un flujo de recuperación de cuenta, no una preferencia.
 */
export function DialogPerfil({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { usuario, actualizarPerfil } = useJunta();
  const [nombre, setNombre] = useState(usuario?.nombre ?? "");
  const [color, setColor] = useState(usuario?.colorAvatar ?? COLORES_AVATAR[0]);
  const [guardando, setGuardando] = useState(false);

  // Vuelve a sincronizar cuando se abre — evita arrastrar un cambio a medio
  // escribir de la vez anterior que se cerró sin guardar.
  useEffect(() => {
    if (open && usuario) {
      setNombre(usuario.nombre);
      setColor(usuario.colorAvatar ?? COLORES_AVATAR[0]);
    }
  }, [open, usuario]);

  if (!usuario) return null;

  const iniciales = nombre
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || usuario.iniciales;

  const valido = nombre.trim().length >= 3;

  async function guardar() {
    if (!valido || guardando) return;
    setGuardando(true);
    await new Promise((r) => setTimeout(r, 400));
    actualizarPerfil({ nombre: nombre.trim(), colorAvatar: color });
    setGuardando(false);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-sm bg-marca-fondo">
        <DialogHeader>
          <DialogTitle className="text-h3 font-semibold text-marca-texto">
            Mi perfil
          </DialogTitle>
          <DialogDescription className="text-support text-marca-tenue">
            Así te ven los demás miembros de tu asociación.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3 py-2">
          <span
            className="grid size-16 place-items-center rounded-full text-h3 font-semibold text-white"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          >
            {iniciales}
          </span>
          <div className="flex gap-2">
            {COLORES_AVATAR.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-label={`Elegir color ${c}`}
                aria-pressed={color === c}
                className="grid size-9 place-items-center rounded-full border-2 transition-colors"
                style={{
                  backgroundColor: c,
                  borderColor: color === c ? "#24312B" : "transparent",
                }}
              >
                {color === c ? (
                  <Check size={16} weight="bold" color="#fff" aria-hidden="true" />
                ) : null}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="perfil-nombre" className="text-body font-semibold">
              Nombre completo
            </Label>
            <Input
              id="perfil-nombre"
              className="mt-2"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="perfil-telefono" className="text-body font-semibold">
              Celular
            </Label>
            <Input
              id="perfil-telefono"
              className="mt-2"
              value={`+51 ${usuario.telefono}`}
              disabled
              aria-describedby="perfil-telefono-ayuda"
            />
            <p id="perfil-telefono-ayuda" className="mt-2 text-support text-marca-tenue">
              Con este número entras a tu cuenta — cambiarlo es parte de
              recuperar cuenta, no de este formulario.
            </p>
          </div>
        </div>

        <DialogFooter className="-mx-0 -mb-0 rounded-none border-0 bg-transparent p-0 sm:justify-stretch">
          <Button size="lg" className="w-full" onClick={guardar} disabled={!valido || guardando}>
            {guardando ? "Guardando…" : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
