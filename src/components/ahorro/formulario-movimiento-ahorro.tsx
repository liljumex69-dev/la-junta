"use client";

import { useState } from "react";
import { Plus } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/common/spinner";
import { CATEGORIAS_AHORRO_SUGERIDAS } from "@/lib/junta/rules";
import { useJunta } from "@/lib/junta/context";
import { cn } from "@/lib/utils";

const OTRA_CATEGORIA = "__otra__";

/**
 * Registrar un movimiento de ahorro personal.
 *
 * Categorías definibles por el propio usuario, tal como pide el documento: se
 * ofrecen las sugeridas, más una opción para escribir la propia.
 */
export function FormularioMovimientoAhorro() {
  const { agregarMovimientoAhorro } = useJunta();
  const [abierto, setAbierto] = useState(false);
  const [tipo, setTipo] = useState<"ingreso" | "egreso">("ingreso");
  const [monto, setMonto] = useState("");
  const [categoriaElegida, setCategoriaElegida] = useState(CATEGORIAS_AHORRO_SUGERIDAS[0]);
  const [categoriaPropia, setCategoriaPropia] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [guardando, setGuardando] = useState(false);

  if (!abierto) {
    return (
      <Button size="lg" variant="outline" className="w-full" onClick={() => setAbierto(true)}>
        <Plus size={20} weight="bold" aria-hidden="true" />
        Agregar movimiento
      </Button>
    );
  }

  const categoria =
    categoriaElegida === OTRA_CATEGORIA ? categoriaPropia.trim() : categoriaElegida;
  const montoNumero = Number(monto);
  const valido = montoNumero > 0 && categoria.length > 0;

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (!valido || guardando) return;
    setGuardando(true);
    await new Promise((r) => setTimeout(r, 500));

    agregarMovimientoAhorro({
      tipo,
      monto: montoNumero,
      categoria,
      descripcion: descripcion.trim() || (tipo === "ingreso" ? "Depósito" : "Gasto"),
    });

    setGuardando(false);
    setAbierto(false);
    setMonto("");
    setDescripcion("");
    setCategoriaElegida(CATEGORIAS_AHORRO_SUGERIDAS[0]);
    setCategoriaPropia("");
    setTipo("ingreso");
  }

  return (
    <form
      onSubmit={guardar}
      className="space-y-4 rounded-lg border border-marca-borde bg-marca-superficie p-4"
    >
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setTipo("ingreso")}
          className={cn(
            "touch-target rounded-md border-2 py-2.5 text-body font-semibold transition-colors",
            tipo === "ingreso"
              ? "border-marca-primario bg-[#e3ede6] text-[#1F5C3D]"
              : "border-marca-borde text-marca-tenue"
          )}
        >
          Ingreso
        </button>
        <button
          type="button"
          onClick={() => setTipo("egreso")}
          className={cn(
            "touch-target rounded-md border-2 py-2.5 text-body font-semibold transition-colors",
            tipo === "egreso"
              ? "border-marca-secundario bg-[#f5e9d3] text-[#7a5a26]"
              : "border-marca-borde text-marca-tenue"
          )}
        >
          Gasto
        </button>
      </div>

      <div>
        <Label htmlFor="monto-ahorro" className="text-body font-semibold">
          Monto
        </Label>
        <div className="relative mt-2">
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-body font-semibold text-marca-tenue">
            S/
          </span>
          <Input
            id="monto-ahorro"
            type="number"
            inputMode="decimal"
            min={1}
            step="0.01"
            placeholder="0.00"
            className="pl-10"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="categoria-ahorro" className="text-body font-semibold">
          Categoría
        </Label>
        <Select value={categoriaElegida} onValueChange={setCategoriaElegida}>
          <SelectTrigger
            id="categoria-ahorro"
            className="mt-2 h-12 w-full border-2 border-marca-borde bg-card text-body"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIAS_AHORRO_SUGERIDAS.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
            <SelectItem value={OTRA_CATEGORIA}>Otra categoría…</SelectItem>
          </SelectContent>
        </Select>
        {categoriaElegida === OTRA_CATEGORIA ? (
          <Input
            className="mt-2"
            placeholder="Escribe tu categoría"
            value={categoriaPropia}
            onChange={(e) => setCategoriaPropia(e.target.value)}
          />
        ) : null}
      </div>

      <div>
        <Label htmlFor="descripcion-ahorro" className="text-body font-semibold">
          Descripción (opcional)
        </Label>
        <Input
          id="descripcion-ahorro"
          className="mt-2"
          placeholder="Ej. Ahorro de la semana"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="ghost"
          className="flex-1"
          onClick={() => setAbierto(false)}
        >
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" disabled={!valido || guardando}>
          {guardando ? <Spinner /> : "Guardar"}
        </Button>
      </div>
    </form>
  );
}
