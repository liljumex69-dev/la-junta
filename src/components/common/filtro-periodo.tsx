import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Periodo = "3" | "6" | "todo";

const PERIODOS: { valor: Periodo; etiqueta: string }[] = [
  { valor: "3", etiqueta: "Últimos 3 meses" },
  { valor: "6", etiqueta: "Últimos 6 meses" },
  { valor: "todo", etiqueta: "Todo" },
];

/** Filtro de periodo reutilizable para los dashboards con gráficos. */
export function FiltroPeriodo({
  valor,
  onChange,
}: {
  valor: Periodo;
  onChange: (valor: Periodo) => void;
}) {
  return (
    <Select value={valor} onValueChange={(v) => onChange(v as Periodo)}>
      <SelectTrigger className="h-9 w-[168px] border-2 border-marca-borde bg-marca-superficie text-support">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PERIODOS.map((p) => (
          <SelectItem key={p.valor} value={p.valor}>
            {p.etiqueta}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
