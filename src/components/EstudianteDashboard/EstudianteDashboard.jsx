import React from 'react';
import './EstudianteDashboard.css';

const EstudianteDashboard = () => {
  const variables = [
    { name: 'estudianteId', type: 'number', description: 'Identificador unico del estudiante' },
    { name: 'periodo', type: 'string', description: 'Periodo academico activo (ej: 2026-1)' },
    { name: 'totalClases', type: 'number', description: 'Total de clases registradas en el periodo' },
    { name: 'presentes', type: 'number', description: 'Cantidad de asistencias en estado presente' },
    { name: 'ausentes', type: 'number', description: 'Cantidad de asistencias en estado ausente' },
    { name: 'tardanzas', type: 'number', description: 'Cantidad de asistencias en estado tardanza' },
    {
      name: 'porcentajeAsistencia',
      type: 'number',
      description: 'Porcentaje de asistencia calculado en el backend'
    },
    {
      name: 'ultimaAsistencia',
      type: 'string',
      description: 'Fecha ISO de la ultima asistencia registrada'
    }
  ];

  return (
    <section className="estudiante-dashboard">
      <div className="dash-header">
        <div>
          <h2>Dashboard</h2>
          <p>Resumen personal de asistencia.</p>
          <p className="dash-note">Integracion con API REST pendiente.</p>
        </div>
      </div>

      <div className="dash-card">
        <h3>Variables requeridas para el endpoint</h3>
        <p className="dash-subtitle">
          Define estas variables en tu API. Aqui solo se listan nombres y tipos.
        </p>

        <div className="vars-grid">
          {variables.map((variable) => (
            <div key={variable.name} className="var-item">
              <div className="var-name">{variable.name}</div>
              <div className="var-type">{variable.type}</div>
              <div className="var-desc">{variable.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EstudianteDashboard;
