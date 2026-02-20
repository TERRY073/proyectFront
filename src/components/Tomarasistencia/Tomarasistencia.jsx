import React, { useMemo, useState } from 'react';
import './Tomarasistencia.css';

const TomarAsistencia = () => {
  const [cursos] = useState([]);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [mensaje, setMensaje] = useState(null);

  const estudiantesPorCurso = useMemo(() => ({}), []);

  const cambiarEstado = (estudianteId, nuevoEstado) => {
    setEstudiantes(
      estudiantes.map((est) => {
        if (est.estudianteId === estudianteId) {
          return {
            ...est,
            estado: nuevoEstado,
            horaEntrada:
              nuevoEstado !== 'ausente'
                ? new Date().toLocaleTimeString('es-CO', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })
                : null
          };
        }
        return est;
      })
    );
  };

  const cambiarObservacion = (estudianteId, observacion) => {
    setEstudiantes(
      estudiantes.map((est) =>
        est.estudianteId === estudianteId ? { ...est, observaciones: observacion } : est
      )
    );
  };

  const marcarTodos = (estado) => {
    setEstudiantes(
      estudiantes.map((est) => ({
        ...est,
        estado,
        horaEntrada:
          estado !== 'ausente'
            ? new Date().toLocaleTimeString('es-CO', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })
            : null
      }))
    );
  };

  const guardarAsistencias = () => {
    if (!cursoSeleccionado) {
      setMensaje({ tipo: 'error', texto: 'Selecciona un curso' });
      return;
    }

    setMensaje({
      tipo: 'success',
      texto: `Asistencias guardadas correctamente para ${cursoSeleccionado.nombre || 'el curso'}`
    });

    setTimeout(() => setMensaje(null), 4000);
  };

  const contarEstados = () => {
    const presentes = estudiantes.filter((e) => e.estado === 'presente').length;
    const ausentes = estudiantes.filter((e) => e.estado === 'ausente').length;
    const tardanzas = estudiantes.filter((e) => e.estado === 'tardanza').length;
    const total = estudiantes.length;

    return { presentes, ausentes, tardanzas, total };
  };

  const estadisticas = contarEstados();

  return (
    <div className="tomar-asistencia-container">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>Tomar Asistencia</h1>
          <p>Registra la asistencia de tus estudiantes</p>
          <p className="page-note">Datos cargados desde API REST (en progreso).</p>
        </div>
      </div>

      {/* MENSAJE */}
      {mensaje && <div className={`mensaje-alert ${mensaje.tipo}`}>{mensaje.texto}</div>}

      {/* SELECCION DE CURSO Y FECHA */}
      <div className="seleccion-card">
        <div className="seleccion-grid">
          <div className="campo-group">
            <label>Curso *</label>
            <select
              value={cursoSeleccionado?.id || ''}
              onChange={(e) => {
                const curso = cursos.find((c) => c.id === parseInt(e.target.value, 10));
                setCursoSeleccionado(curso || null);
                setEstudiantes(curso ? estudiantesPorCurso[curso.id] || [] : []);
                setMensaje(null);
              }}
            >
              <option value="">Selecciona un curso</option>
              {cursos.map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {curso.codigo} - {curso.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="campo-group">
            <label>Fecha *</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {cursoSeleccionado && (
          <div className="curso-info">
            <div className="info-item">
              <span className="info-label">Horario:</span>
              <span className="info-value">{cursoSeleccionado.horario}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Aula:</span>
              <span className="info-value">{cursoSeleccionado.aula}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Total estudiantes:</span>
              <span className="info-value">{cursoSeleccionado.totalEstudiantes}</span>
            </div>
          </div>
        )}
      </div>

      {/* ESTADISTICAS RAPIDAS */}
      {cursoSeleccionado && estudiantes.length > 0 && (
        <div className="stats-mini">
          <div className="stat-mini presente">
            <strong>{estadisticas.presentes}</strong>
            <span>Presentes</span>
          </div>
          <div className="stat-mini ausente">
            <strong>{estadisticas.ausentes}</strong>
            <span>Ausentes</span>
          </div>
          <div className="stat-mini tardanza">
            <strong>{estadisticas.tardanzas}</strong>
            <span>Tardanzas</span>
          </div>
          <div className="stat-mini total">
            <strong>{estadisticas.total}</strong>
            <span>Total</span>
          </div>
        </div>
      )}

      {/* ACCIONES RAPIDAS */}
      {cursoSeleccionado && estudiantes.length > 0 && (
        <div className="acciones-rapidas">
          <h3>Acciones rápidas</h3>
          <div className="acciones-buttons">
            <button
              className="btn btn-accion presente"
              onClick={() => marcarTodos('presente')}
            >
              Marcar todos presentes
            </button>
            <button
              className="btn btn-accion ausente"
              onClick={() => marcarTodos('ausente')}
            >
              Marcar todos ausentes
            </button>
          </div>
        </div>
      )}

      {/* LISTA DE ESTUDIANTES */}
      {cursoSeleccionado && estudiantes.length > 0 ? (
        <div className="estudiantes-card">
          <h3>Lista de Estudiantes</h3>

          <div className="estudiantes-lista">
            {estudiantes.map((estudiante) => (
              <div key={estudiante.estudianteId} className="estudiante-item">
                <div className="estudiante-info">
                  <div className="estudiante-nombre">{estudiante.estudianteNombre}</div>
                  <div className="estudiante-cedula">CC: {estudiante.estudianteCedula}</div>
                </div>

                <div className="estudiante-acciones">
                  {/* BOTONES DE ESTADO */}
                  <div className="estado-buttons">
                    <button
                      className={`btn-estado presente ${
                        estudiante.estado === 'presente' ? 'activo' : ''
                      }`}
                      onClick={() => cambiarEstado(estudiante.estudianteId, 'presente')}
                      title="Presente"
                      aria-pressed={estudiante.estado === 'presente'}
                    >
                      P
                    </button>
                    <button
                      className={`btn-estado tardanza ${
                        estudiante.estado === 'tardanza' ? 'activo' : ''
                      }`}
                      onClick={() => cambiarEstado(estudiante.estudianteId, 'tardanza')}
                      title="Tardanza"
                      aria-pressed={estudiante.estado === 'tardanza'}
                    >
                      T
                    </button>
                    <button
                      className={`btn-estado ausente ${
                        estudiante.estado === 'ausente' ? 'activo' : ''
                      }`}
                      onClick={() => cambiarEstado(estudiante.estudianteId, 'ausente')}
                      title="Ausente"
                      aria-pressed={estudiante.estado === 'ausente'}
                    >
                      A
                    </button>
                    <button
                      className={`btn-estado justificado ${
                        estudiante.estado === 'justificado' ? 'activo' : ''
                      }`}
                      onClick={() => cambiarEstado(estudiante.estudianteId, 'justificado')}
                      title="Justificado"
                      aria-pressed={estudiante.estado === 'justificado'}
                    >
                      J
                    </button>
                  </div>

                  {/* OBSERVACIONES */}
                  <input
                    type="text"
                    className="observaciones-input"
                    placeholder="Observaciones (opcional)"
                    value={estudiante.observaciones || ''}
                    onChange={(e) => cambiarObservacion(estudiante.estudianteId, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* BOTON GUARDAR */}
          <div className="guardar-section">
            <button
              className="btn primary btn-guardar"
              onClick={guardarAsistencias}
              disabled={estudiantes.length === 0}
            >
              Guardar Asistencias
            </button>
          </div>
        </div>
      ) : cursoSeleccionado ? (
        <div className="empty-state">
          <p>No hay estudiantes inscritos en este curso.</p>
          <p className="empty-hint">
            Cambia de curso o actualiza la matrícula para comenzar.
          </p>
        </div>
      ) : (
        <div className="empty-state">
          <p>Selecciona un curso para comenzar.</p>
          <p className="empty-hint">
            Luego podrás marcar asistencia y registrar observaciones.
          </p>
        </div>
      )}
    </div>
  );
};

export default TomarAsistencia;
