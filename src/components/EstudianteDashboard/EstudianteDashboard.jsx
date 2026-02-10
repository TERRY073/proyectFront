import { useEffect, useState } from 'react';
import CrearAsistencia from '../Asistencia/CrearAsistencia';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { exportarAsistenciasCSV, exportarAsistenciasPDF } from '../../utils/exportAsistencias';
import './EstudianteDashboard.css';

const ITEMS_POR_PAGINA = 5;

function EstudianteDashboard() {
  const [asistencias, setAsistencias] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const [filtroMateria, setFiltroMateria] = useState('');
  const [asistenciaEditando, setAsistenciaEditando] = useState(null);

  useEffect(() => {
    const storedAsistencias = localStorage.getItem('asistencias_local');
    if (storedAsistencias) {
      setAsistencias(JSON.parse(storedAsistencias));
    }

    const storedMaterias = localStorage.getItem('materias');
    if (storedMaterias) {
      setMaterias(JSON.parse(storedMaterias));
    } else {
      setMaterias(['Bases de datos,', 'Logica', 'Backend']);
    }
  }, []);

  const guardarAsistencia = (asistencia) => {
    let actualizadas;

    if (asistenciaEditando) {
      actualizadas = asistencias.map((a) =>
        a.id === asistencia.id ? asistencia : a
      );
      toast.success('Asistencia actualizada');
      setAsistenciaEditando(null);
    } else {
      actualizadas = [...asistencias, asistencia];
      toast.success('Asistencia registrada');
    }

    setAsistencias(actualizadas);
    localStorage.setItem('asistencias_local', JSON.stringify(actualizadas));
  };

  const eliminarAsistencia = (id) => {
    if (!window.confirm('¿Eliminar esta asistencia?')) return;

    const actualizadas = asistencias.filter((a) => a.id !== id);
    setAsistencias(actualizadas);
    localStorage.setItem('asistencias_local', JSON.stringify(actualizadas));
    toast.info('Asistencia eliminada');
  };

  const asistenciasFiltradas = asistencias.filter((asistencia) => {
    const estudiante = asistencia.estudianteNombre || '';
    const materia = asistencia.materiaNombre || '';

    const coincideTexto =
      estudiante.toLowerCase().includes(busqueda.toLowerCase()) ||
      materia.toLowerCase().includes(busqueda.toLowerCase());

    const coincideMateria =
      filtroMateria === '' || asistencia.materiaNombre === filtroMateria;

    return coincideTexto && coincideMateria;
  });

  const totalPaginas = Math.ceil(asistenciasFiltradas.length / ITEMS_POR_PAGINA);
  const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const fin = inicio + ITEMS_POR_PAGINA;
  const asistenciasPaginadas = asistenciasFiltradas.slice(inicio, fin);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroMateria]);

  const exportarCSV = () => {
    exportarAsistenciasCSV(asistenciasFiltradas);
  };

  const exportarPDF = () => {
    exportarAsistenciasPDF(asistenciasFiltradas);
  };

  const totalAsistencias = asistencias.length;
  const totalMaterias = materias.length;
  const totalFiltradas = asistenciasFiltradas.length;

  return (
    <div className="dashboard-container">
      <ToastContainer position="top-right" autoClose={2500} />
      <header className="dashboard-hero">
        <div>
          <p className="hero-kicker">Panel docente</p>
          <h1 className="dashboard-title">Dashboard del Docente</h1>
          <p className="dashboard-subtitle">
            Gestiona asistencias y seguimiento con filtros rápidos.
          </p>
        </div>
        <div className="hero-stats">
          <div>
            <span>Asistencias</span>
            <strong>{totalAsistencias}</strong>
          </div>
          <div>
            <span>Materias</span>
            <strong>{totalMaterias}</strong>
          </div>
          <div>
            <span>Resultados</span>
            <strong>{totalFiltradas}</strong>
          </div>
        </div>
      </header>

      <div className="dashboard-card">
        <CrearAsistencia
          onGuardar={guardarAsistencia}
          asistenciaEditando={asistenciaEditando}
          cancelarEdicion={() => setAsistenciaEditando(null)}
        />
      </div>

      <div className="dashboard-card dashboard-filters">
        <input
          type="text"
          placeholder="Buscar por estudiante o materia..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          value={filtroMateria}
          onChange={(e) => setFiltroMateria(e.target.value)}
        >
          <option value="">Todas las materias</option>
          {materias.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <div className="export-actions">
          <button className="btn btn-outline" onClick={exportarCSV}>
            Exportar CSV
          </button>

          <button className="btn btn-outline" onClick={exportarPDF}>
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="dashboard-card">
        {asistenciasFiltradas.length === 0 ? (
          <p>No hay asistencias registradas.</p>
        ) : (
          <>
            <div className="table-container">
              <table className="sura-table">
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th>Materia</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {asistenciasPaginadas.map((asistencia) => (
                    <tr key={asistencia.id}>
                      <td>{asistencia.estudianteNombre}</td>
                      <td>{asistencia.materiaNombre}</td>
                      <td>{asistencia.estado}</td>
                      <td>
                        {asistencia.fecha
                          ? new Date(asistencia.fecha).toLocaleDateString('es-CO')
                          : '-'}
                      </td>
                      <td>
                        <button
                          className="btn btn-outline"
                          onClick={() => setAsistenciaEditando(asistencia)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-outline"
                          onClick={() => eliminarAsistencia(asistencia.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPaginas > 1 && (
              <div className="pagination">
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                  (num) => (
                    <button
                      key={num}
                      className={num === paginaActual ? 'active' : ''}
                      onClick={() => setPaginaActual(num)}
                    >
                      {num}
                    </button>
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default EstudianteDashboard;
