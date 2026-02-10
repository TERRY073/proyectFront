const BASE_URL = 'http://localhost:8081/api/asistencias';

export const obtenerAsistencias = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error('Error al obtener asistencias');
  }
  return res.json();
};

export const crearAsistencia = async (asistencia) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(asistencia)
  });
  if (!res.ok) {
    throw new Error('Error al registrar asistencia');
  }
  return res.json();
};
