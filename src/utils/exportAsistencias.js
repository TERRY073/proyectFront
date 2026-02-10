const escapeCsv = (value) => {
  if (value == null) return '';
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
};

export const exportarAsistenciasCSV = (asistencias) => {
  const headers = ['Estudiante', 'Materia', 'Clase', 'Estado', 'Fecha'];
  const rows = asistencias.map((a) => [
    a.estudianteNombre,
    a.materiaNombre,
    a.claseNombre,
    a.estado,
    a.fecha
  ]);

  const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'asistencias.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportarAsistenciasPDF = (asistencias) => {
  const win = window.open('', '_blank');
  if (!win) return;

  const rows = asistencias
    .map(
      (a) => `
      <tr>
        <td>${a.estudianteNombre || ''}</td>
        <td>${a.materiaNombre || ''}</td>
        <td>${a.claseNombre || ''}</td>
        <td>${a.estado || ''}</td>
        <td>${a.fecha || ''}</td>
      </tr>`
    )
    .join('');

  win.document.write(`
    <html>
      <head>
        <title>Reporte de asistencias</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { font-size: 18px; margin-bottom: 12px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border-bottom: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background: #f3f4f6; }
        </style>
      </head>
      <body>
        <h1>Reporte de asistencias</h1>
        <table>
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Materia</th>
              <th>Clase</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
    </html>
  `);
  win.document.close();
  win.focus();
  win.print();
};
