import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import MiAsistencia from './components/Miasistencia/MiAsistencia';
import TomarAsistencia from './components/Tomarasistencia/Tomarasistencia';
import SectionPage from './components/Asistencia/SectionPage';
import { AuthProvider } from './context/AuthContext';
import EstudianteDashboard from './components/EstudianteDashboard/EstudianteDashboard';

export default function App() {
  const [theme] = useState('light');

  return (
    <AuthProvider>
      <Router>
        <div className={`app ${theme}`}>
          {/* NAVBAR */}
          <Navbar />

          {/* CONTENIDO */}
          <main className="app-main">
            <Routes>
              {/* HOME */}
              <Route
                path="/"
                element={
                  <section className="home">
                    <div className="home-content">
                      <div className="home-hero">
                        <div className="home-text">
                          <h1>Sistema de Gestion de Asistencia</h1>
                          <p>
                            Registro y consulta de asistencia academica con roles claros para
                            estudiante, profesor y administrador.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                }
              />

              {/* AUTH */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* ADMINISTRADOR */}
              <Route
                path="/admin/dashboard-asistencia"
                element={
                  <SectionPage
                    title="Dashboard de Asistencia"
                    subtitle="Visión general del estado de asistencia a nivel global."
                    note="Integración con API REST pendiente."
                  />
                }
              />
              <Route
                path="/admin/control-general"
                element={
                  <SectionPage
                    title="Control General de Asistencias"
                    subtitle="Monitorea registros y tendencias de asistencia."
                    note="Integración con API REST pendiente."
                  />
                }
              />
              <Route
                path="/admin/reportes-globales"
                element={
                  <SectionPage
                    title="Reportes Globales de Asistencia"
                    subtitle="Reporte consolidado por periodos y sedes."
                    note="Integración con API REST pendiente."
                  />
                }
              />
              <Route
                path="/admin/auditoria"
                element={
                  <SectionPage
                    title="Auditoría de Registros de Asistencia"
                    subtitle="Revisión y trazabilidad de cambios en asistencia."
                    note="Integración con API REST pendiente."
                  />
                }
              />

              {/* PROFESOR */}
              <Route
                path="/profesor/dashboard"
                element={
                  <SectionPage
                    title="Dashboard"
                    subtitle="Resumen rápido de tus clases y asistencia."
                    note="Integración con API REST pendiente."
                  />
                }
              />
              <Route
                path="/profesor/mis-clases"
                element={
                  <SectionPage
                    title="Mis Clases"
                    subtitle="Clases asignadas para registro de asistencia."
                    note="Integración con API REST pendiente."
                  />
                }
              />
              <Route path="/profesor/registro-asistencia" element={<TomarAsistencia />} />
              <Route
                path="/profesor/historial-asistencias"
                element={
                  <SectionPage
                    title="Historial de Asistencias"
                    subtitle="Consulta asistencias previamente registradas."
                    note="Integración con API REST pendiente."
                  />
                }
              />
              <Route
                path="/profesor/reporte-por-clase"
                element={
                  <SectionPage
                    title="Reporte de Asistencia por Clase"
                    subtitle="Reporte detallado por sesión y grupo."
                    note="Integración con API REST pendiente."
                  />
                }
              />

              {/* ESTUDIANTE */}
              <Route
                path="/estudiante/dashboard"
                element={<EstudianteDashboard />}
              />
              <Route path="/estudiante/mi-asistencia" element={<MiAsistencia />} />
              <Route
                path="/estudiante/historial-asistencias"
                element={
                  <SectionPage
                    title="Historial de Asistencias"
                    subtitle="Detalle histórico de tus asistencias."
                    note="Integración con API REST pendiente."
                  />
                }
              />

              {/* ALIAS */}
              <Route path="/mi-asistencia" element={<MiAsistencia />} />
              <Route path="/asistencia/tomar" element={<TomarAsistencia />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}
