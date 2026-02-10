import { useEffect } from 'react';
import { obtenerAsistencias } from '../services/asistenciaService';

function AsistenciaList({ asistencias, setAsistencias }) {
  useEffect(() => {
    let activo = true;
    const cargar = async () => {
      try {
        const data = await obtenerAsistencias();
        if (activo) setAsistencias(data);
      } catch {
        if (activo) setAsistencias([]);
      }
    };
    cargar();
    return () => {
      activo = false;
    };
  }, [setAsistencias]);

  return (
    <section className="card">
      <h2>Listado de asistencias</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Asistió</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty">
                  No hay asistencias registradas.
                </td>
              </tr>
            ) : (
              asistencias.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.nombrePersona}</td>
                  <td>{a.fecha}</td>
                  <td>{a.horaEntrada}</td>
                  <td>{a.asistio ? 'Sí' : 'No'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AsistenciaList;
