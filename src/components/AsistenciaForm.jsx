import { useState } from 'react';
import { crearAsistencia } from '../services/asistenciaService';

const estadoInicial = {
  nombrePersona: '',
  fecha: '',
  horaEntrada: '',
  asistio: false
};

function AsistenciaForm({ onGuardado, setError }) {
  const [form, setForm] = useState(estadoInicial);
  const [errores, setErrores] = useState({});

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.nombrePersona.trim()) {
      nuevosErrores.nombrePersona = 'El nombre es obligatorio';
    }
    return nuevosErrores;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = validar();
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    try {
      await crearAsistencia(form);
      setForm(estadoInicial);
      setErrores({});
      setError('');
      onGuardado();
    } catch (err) {
      setError(err.message || 'No se pudo registrar la asistencia');
    }
  };

  return (
    <section className="card">
      <h2>Registrar asistencia</h2>
      <form className="form" onSubmit={onSubmit}>
        <label>
          Nombre
          <input
            type="text"
            name="nombrePersona"
            value={form.nombrePersona}
            onChange={onChange}
            placeholder="Juan Perez"
          />
          {errores.nombrePersona && (
            <span className="error-text">{errores.nombrePersona}</span>
          )}
        </label>

        <label>
          Fecha
          <input type="date" name="fecha" value={form.fecha} onChange={onChange} />
        </label>

        <label>
          Hora de entrada
          <input
            type="time"
            name="horaEntrada"
            value={form.horaEntrada}
            onChange={onChange}
          />
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            name="asistio"
            checked={form.asistio}
            onChange={onChange}
          />
          Asistió
        </label>

        <button type="submit" className="btn">
          Guardar asistencia
        </button>
      </form>
    </section>
  );
}

export default AsistenciaForm;
