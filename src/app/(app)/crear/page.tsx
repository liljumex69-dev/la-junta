import { CrearJuntaWizard } from "@/components/junta/crear-junta-wizard";
import { JUNTAS, USUARIO_ACTUAL } from "@/lib/minka/mock-data";

export const metadata = { title: "Crear junta — Minka" };

export default function CrearPage() {
  // TODO: conectar a smart contract — leer del contrato el historial del organizador
  // (juntas completadas) y sus juntas activas para aplicar los topes de plan.
  const juntasActivas = JUNTAS.filter((j) => j.estado === "activa").length;

  return (
    <div className="space-y-6">
      <h1 className="text-display font-semibold text-minka-text">Crear junta</h1>
      <CrearJuntaWizard
        juntasCompletadas={USUARIO_ACTUAL.juntasCompletadas}
        juntasActivas={juntasActivas}
        plan={USUARIO_ACTUAL.plan}
      />
    </div>
  );
}
