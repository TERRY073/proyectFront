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
      <select name="estado" value={form.estado} onChange={onChange}>
        <option value="presente">Presente</option>
        <option value="ausente">Ausente</option>
        <option value="tardanza">Tardanza</option>
        <option value="justificado">Justificado</option>
      </select>
      <input type="date" name="fecha" value={form.fecha} onChange={onChange} />

      <button type="submit" className="btn btn-primary">
        {asistenciaEditando ? 'Guardar cambios' : 'Guardar asistencia'}
      </button>
      {asistenciaEditando && (
        <button type="button" className="btn btn-outline" onClick={cancelarEdicion}>
          Cancelar
        </button>
      )}
    </form>
  );
};

export default CrearAsistencia;
