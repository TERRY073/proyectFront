import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Register from './components/Register/Register';
import TomarAsistencia from './components/Tomarasistencia/Tomarasistencia';
import MiAsistencia from './components/Miasistencia/MiAsistencia';
import Reporte from './components/Modulos/Reporte';
import Usuarios from './components/Modulos/Usuarios';
import Profesor from './components/Modulos/Profesor';
import Notificacion from './components/Modulos/Notificacion';
import Matricula from './components/Modulos/Matricula';
import Cursoservice from './components/Curso/Cursoservice';
import SectionPage from './components/Asistencia/SectionPage';

const PlaceholderPage = ({ title, subtitle }) => (
  <SectionPage title={title} subtitle={subtitle} note="Módulo en preparación" />
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin/dashboard-asistencia"
        element={
          <PlaceholderPage
            title="Dashboard de Asistencia"
            subtitle="Vista general del estado de asistencia institucional."
          />
        }
      />
      <Route
        path="/admin/control-general"
        element={
          <PlaceholderPage
            title="Control General de Asistencias"
            subtitle="Supervisa la asistencia de estudiantes y docentes."
          />
        }
      />
      <Route path="/admin/reportes-globales" element={<Reporte />} />
      <Route
        path="/admin/auditoria"
        element={
          <PlaceholderPage
            title="Auditoría de Registros de Asistencia"
            subtitle="Seguimiento y control de cambios en los registros."
          />
        }
      />

      <Route
        path="/profesor/dashboard"
        element={
          <PlaceholderPage
            title="Dashboard del Profesor"
            subtitle="Resumen rápido de tus clases y asistencia."
          />
        }
      />
      <Route path="/profesor/mis-clases" element={<Cursoservice />} />
      <Route path="/profesor/registro-asistencia" element={<TomarAsistencia />} />
      <Route
        path="/profesor/historial-asistencias"
        element={
          <PlaceholderPage
            title="Historial de Asistencias"
            subtitle="Consulta histórica de registros por clase."
          />
        }
      />
      <Route path="/profesor/reporte-por-clase" element={<Reporte />} />

      <Route path="/estudiante/dashboard" element={<MiAsistencia />} />
      <Route path="/estudiante/mi-asistencia" element={<MiAsistencia />} />
      <Route
        path="/estudiante/historial-asistencias"
        element={
          <PlaceholderPage
            title="Historial de Asistencias"
            subtitle="Revisa tu asistencia en todas las materias."
          />
        }
      />

      <Route path="/modulos/usuarios" element={<Usuarios />} />
      <Route path="/modulos/profesor" element={<Profesor />} />
      <Route path="/modulos/notificacion" element={<Notificacion />} />
      <Route path="/modulos/matricula" element={<Matricula />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
