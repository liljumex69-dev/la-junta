/**
 * Exportar CSV real, generado en el cliente — a diferencia de PDF/Excel (que se
 * simulan en este prototipo), un CSV no necesita ninguna librería de documentos,
 * así que aquí sí se genera y descarga de verdad. Formato pensado para SUNAT:
 * una fila por cuota, sin columnas que un contador no reconozca.
 */
export function descargarCSV(nombreArchivo: string, encabezados: string[], filas: (string | number)[][]) {
  const escapar = (valor: string | number) => {
    const texto = String(valor);
    return /[",\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
  };

  const lineas = [encabezados, ...filas].map((fila) => fila.map(escapar).join(","));
  const contenido = "﻿" + lineas.join("\r\n");

  const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombreArchivo;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);
}
