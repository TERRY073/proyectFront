import React, { useEffect, useState } from 'react';

const initialState = {
  estudianteNombre: '',
  materiaNombre: '',
  estado: 'presente',
  fecha: ''
};

const CrearAsistencia = ({ onGuardar, asistenciaEditando, cancelarEdicion }) => {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (asistenciaEditando) {
      setForm({
        estudianteNombre: asistenciaEditando.estudianteNombre || '',
        materiaNombre: asistenciaEditando.materiaNombre || '',
        estado: asistenciaEditando.estado || 'presente',
        fecha: asistenciaEditando.fecha ? asistenciaEditando.fecha.split('T')[0] : ''
      });
    }
  }, [asistenciaEditando]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const nueva = {
      id: asistenciaEditando?.id || Date.now(),
      estudianteNombre: form.estudianteNombre.trim(),
      materiaNombre: form.materiaNombre.trim(),
      estado: form.estado,
      fecha: form.fecha || new Date().toISOString()
    };

    onGuardar(nueva);
    if (!asistenciaEditando) setForm(initialState);
  };

  return (
    <form className="student-form" onSubmit={onSubmit}>
      <h3>{asistenciaEditando ? 'Editar asistencia' : 'Registrar asistencia'}</h3>
      <input
        type="text"
        name="estudianteNombre"
        placeholder="Nombre del estudiante"
        value={form.estudianteNombre}
        onChange={onChange}
        required
      />
      <input
        type="text"
        name="materiaNombre"
        placeholder="Materia"
        value={form.materiaNombre}
        onChange={onChange}
        required
      />
      <div className="status-field">
        <span className="status-label">Estado</span>
        <div className="status-actions">
          <button
            type="button"
            className={`status-btn ${form.estado === 'presente' ? 'active' : ''}`}
            onClick={() => setForm((prev) => ({ ...prev, estado: 'presente' }))}
            aria-pressed={form.estado === 'presente'}
          >
            Presente
          </button>
          <button
            type="button"
            className={`status-btn ${form.estado === 'tardanza' ? 'active' : ''}`}
            onClick={() => setForm((prev) => ({ ...prev, estado: 'tardanza' }))}
            aria-pressed={form.estado === 'tardanza'}
          >
            Tardanza
          </button>
          <button
            type="button"
            className={`status-btn ${form.estado === 'ausente' ? 'active' : ''}`}
            onClick={() => setForm((prev) => ({ ...prev, estado: 'ausente' }))}
            aria-pressed={form.estado === 'ausente'}
          >
            Ausente
          </button>
          <button
            type="button"
            className={`status-btn ${form.estado === 'justificado' ? 'active' : ''}`}
            onClick={() => setForm((prev) => ({ ...prev, estado: 'justificado' }))}
            aria-pressed={form.estado === 'justificado'}
          >
            Excusa
          </button>
        </div>
      </div>
      <input type="date" name="fecha" value={form.fecha} onChange={onChange} />

      <button type="submit" className="btn primary">
        {asistenciaEditando ? 'Guardar cambios' : 'Guardar asistencia'}
      </button>
      {asistenciaEditando && (
        <button type="button" className="btn outline" onClick={cancelarEdicion}>
          Cancelar
        </button>
      )}
    </form>
  );
};

export default CrearAsistencia;
