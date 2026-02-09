import React, { useState } from "react";
import "./MiAsistencia.css";

const MiAsistencia = () => {
  const [filtros, setFiltros] = useState({
    cursoId: "",
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear()
  });

  const cursos = [];
  const asistencias = [];

  const estadisticas = {
    total: asistencias.length,
    presentes: asistencias.filter((a) => a.estado === "presente").length,
    ausentes: asistencias.filter((a) => a.estado === "ausente").length,
    tardanzas: asistencias.filter((a) => a.estado === "tardanza").length,
    porcentaje:
      asistencias.length > 0
        ? (((asistencias.filter((a) => a.estado === "presente").length +
            asistencias.filter((a) => a.estado === "tardanza").length) /
            asistencias.length) *
            100).toFixed(1)
        : 0
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      presente: { text: "Presente", className: "badge-presente" },
      ausente: { text: "Ausente", className: "badge-ausente" },
      tardanza: { text: "Tardanza", className: "badge-tardanza" },
      justificado: { text: "Justificado", className: "badge-justificado" }
    };
    return badges[estado] || { text: estado, className: "badge-default" };
  };

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(`${fechaStr}T00:00:00`);
    const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const meses = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic"
    ];

    return `${dias[fecha.getDay()]} ${fecha.getDate()} ${meses[fecha.getMonth()]}`;
  };

  const meses = [
    { value: 1, label: "Enero" },
    { value: 2, label: "Febrero" },
    { value: 3, label: "Marzo" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Mayo" },
    { value: 6, label: "Junio" },
    { value: 7, label: "Julio" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Septiembre" },
    { value: 10, label: "Octubre" },
    { value: 11, label: "Noviembre" },
    { value: 12, label: "Diciembre" }
  ];

  return (
    <div className="mi-asistencia-container">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>Mi Asistencia</h1>
          <p>Consulta tu historial de asistencia a clases</p>
        </div>
      </div>

      {/* ESTADISTICAS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon presente">✓</div>
          <div className="stat-info">
            <h3>{estadisticas.presentes}</h3>
            <p>Presentes</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon ausente">✕</div>
          <div className="stat-info">
            <h3>{estadisticas.ausentes}</h3>
            <p>Ausentes</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon tardanza">⚠</div>
          <div className="stat-info">
            <h3>{estadisticas.tardanzas}</h3>
            <p>Tardanzas</p>
          </div>
        </div>

        <div className="stat-card destacado">
          <div className="stat-icon porcentaje">%</div>
          <div className="stat-info">
            <h3>{estadisticas.porcentaje}%</h3>
            <p>Asistencia General</p>
          </div>
        </div>
      </div>

      {/* FILTROS */}
      <div className="filtros-card">
        <h3>Filtros</h3>
        <div className="filtros-grid">
          <div className="filtro-group">
            <label>Curso</label>
            <select
              value={filtros.cursoId}
              onChange={(e) => setFiltros({ ...filtros, cursoId: e.target.value })}
            >
              <option value="">Todos los cursos</option>
              {cursos.map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {curso.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="filtro-group">
            <label>Mes</label>
            <select
              value={filtros.mes}
              onChange={(e) => setFiltros({ ...filtros, mes: e.target.value })}
            >
              {meses.map((mes) => (
                <option key={mes.value} value={mes.value}>
                  {mes.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filtro-group">
            <label>Año</label>
            <select
              value={filtros.ano}
              onChange={(e) => setFiltros({ ...filtros, ano: e.target.value })}
            >
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLA DE ASISTENCIAS */}
      <div className="tabla-card">
        <h3>Historial de Asistencias ({asistencias.length} registros)</h3>

        {asistencias.length === 0 ? (
          <div className="empty-state">
            <p>No hay registros de asistencia para los filtros seleccionados</p>
          </div>
        ) : (
          <div className="tabla-container">
            <table className="tabla-asistencias">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Curso</th>
                  <th>Código</th>
                  <th>Hora</th>
                  <th>Estado</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {asistencias.map((asistencia) => {
                  const badge = getEstadoBadge(asistencia.estado);
                  return (
                    <tr key={asistencia.id}>
                      <td>
                        <strong>{formatearFecha(asistencia.fecha)}</strong>
                      </td>
                      <td>{asistencia.cursoNombre}</td>
                      <td className="codigo">{asistencia.cursoCodigo}</td>
                      <td>{asistencia.horaEntrada || "-"}</td>
                      <td>
                        <span className={`estado-badge ${badge.className}`}>
                          {badge.text}
                        </span>
                      </td>
                      <td className="observaciones">
                        {asistencia.observaciones || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiAsistencia;
