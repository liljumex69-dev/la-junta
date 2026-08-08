"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Check, Trash } from "@phosphor-icons/react/ssr";
import { toast } from "sonner";

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

/** Tamaño máximo simulado — sin backend real, una foto enorme como data URL
 * solo pesaría en memoria del navegador para nada. */
const TAMANO_MAXIMO_MB = 5;

/**
 * Mi perfil — lo que es de la persona, no de la asociación.
 *
 * Separado a propósito de "Ajustes de la asociación": ahí se configuran las
 * reglas del fondo (umbral, mora), aquí el nombre, la foto y el color de tu
 * avatar. El teléfono no se edita aquí — es la identidad con la que entras,
 * cambiarlo es un flujo de recuperación de cuenta, no una preferencia.
 *
 * TODO: conectar a almacenamiento real — la foto hoy se guarda como data URL
 * en memoria (nunca sube a ningún servidor), se pierde al recargar como todo
 * lo demás en este prototipo. En producción sería un upload real a un bucket.
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
  const [fotoUrl, setFotoUrl] = useState<string | null>(usuario?.fotoUrl ?? null);
  const [guardando, setGuardando] = useState(false);
  const inputArchivoRef = useRef<HTMLInputElement>(null);

  // Vuelve a sincronizar cuando se abre — evita arrastrar un cambio a medio
  // escribir de la vez anterior que se cerró sin guardar.
  useEffect(() => {
    if (open && usuario) {
      setNombre(usuario.nombre);
      setColor(usuario.colorAvatar ?? COLORES_AVATAR[0]);
      setFotoUrl(usuario.fotoUrl ?? null);
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

  function elegirArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    e.target.value = "";
    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
      toast.error("Elige un archivo de imagen (JPG, PNG…).");
      return;
    }
    if (archivo.size > TAMANO_MAXIMO_MB * 1024 * 1024) {
      toast.error(`La imagen pesa demasiado. Elige una de menos de ${TAMANO_MAXIMO_MB} MB.`);
      return;
    }

    const lector = new FileReader();
    lector.onload = () => setFotoUrl(lector.result as string);
    lector.readAsDataURL(archivo);
  }

  async function guardar() {
    if (!valido || guardando) return;
    setGuardando(true);
    await new Promise((r) => setTimeout(r, 400));
    actualizarPerfil({ nombre: nombre.trim(), colorAvatar: color, fotoUrl });
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
          <input
            ref={inputArchivoRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={elegirArchivo}
            aria-label="Subir foto de perfil"
          />

          <button
            type="button"
            onClick={() => inputArchivoRef.current?.click()}
            className="group relative grid size-20 place-items-center overflow-hidden rounded-full text-h2 font-semibold text-white outline-none focus-visible:ring-3 focus-visible:ring-marca-primario/50"
            style={{ backgroundColor: fotoUrl ? undefined : color }}
            aria-label={fotoUrl ? "Cambiar tu foto de perfil" : "Subir una foto de perfil"}
          >
            {fotoUrl ? (
              // Vista previa de un archivo local (data URL) — no un asset remoto,
              // por eso <img> directo en vez de next/image acá.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={fotoUrl} alt="" className="size-full object-cover" />
            ) : (
              iniciales
            )}
            <span className="absolute inset-0 grid place-items-center bg-marca-texto/50 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <Camera size={24} weight="fill" color="#fff" aria-hidden="true" />
            </span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => inputArchivoRef.current?.click()}
              className="touch-target flex items-center gap-1.5 rounded-md px-2 text-support font-semibold text-marca-primario"
            >
              <Camera size={16} weight="duotone" aria-hidden="true" />
              {fotoUrl ? "Cambiar foto" : "Subir foto"}
            </button>
            {fotoUrl ? (
              <button
                type="button"
                onClick={() => setFotoUrl(null)}
                className="touch-target flex items-center gap-1.5 rounded-md px-2 text-support font-semibold text-marca-peligro"
              >
                <Trash size={16} weight="duotone" aria-hidden="true" />
                Quitar foto
              </button>
            ) : null}
          </div>

          {!fotoUrl ? (
            <div>
              <p className="text-center text-support text-marca-tenue">
                O elige un color para tus iniciales
              </p>
              <div className="mt-2 flex gap-2">
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
          ) : null}
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
