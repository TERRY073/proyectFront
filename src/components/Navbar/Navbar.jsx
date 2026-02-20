import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../../context/AuthContext';

// Assets
import LogoSura from '../../assets/LogoSura.png';

const Navbar = () => {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();

  const roleLinks = useMemo(() => {
    if (!auth?.role) {
      return [
        { to: '/', label: 'Inicio' },
        { to: '/register', label: 'Registro' }
      ];
    }

  if (auth.role === 'ADMINISTRADOR' || auth.role === 'PROFESOR') {
    return [
      { to: '/profesor/dashboard', label: 'Dashboard' },
      { to: '/profesor/mis-clases', label: 'Mis Clases' },
      { to: '/profesor/registro-asistencia', label: 'Registro de Asistencia' },
      { to: '/profesor/historial-asistencias', label: 'Historial de Asistencias' },
      { to: '/profesor/reporte-por-clase', label: 'Reporte de Asistencia por Clase' }
    ];
  }

  return [
    { to: '/estudiante/dashboard', label: 'Dashboard' },
    { to: '/estudiante/mi-asistencia', label: 'Mi Asistencia' },
    { to: '/estudiante/historial-asistencias', label: 'Historial de Asistencias' }
  ];
  }, [auth?.role]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">
          <img src={LogoSura} alt="SURA" className="logo" />
        </Link>

        <ul className="nav-links">
          {roleLinks.map((link) => (
            <li key={link.to}>
              <Link to={link.to}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="nav-right">
        {auth ? (
          <button type="button" className="login-btn" onClick={handleLogout}>
            Cerrar sesión
          </button>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
