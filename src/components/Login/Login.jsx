import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ESTUDIANTE');

  const handleSubmit = (e) => {
    e.preventDefault();

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const provisionalAuth = {
      token: 'pendiente-backend',
      userId: 0,
      nombre: email || 'Usuario',
      role,
      expiresAt
    };

    setAuth(provisionalAuth);

    const redirectMap = {
      ADMINISTRADOR: '/admin/dashboard-asistencia',
      PROFESOR: '/profesor/dashboard',
      ESTUDIANTE: '/estudiante/dashboard'
    };

    navigate(redirectMap[role] || '/');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Iniciar sesión</h2>
        <p>Accede a tu cuenta SURA</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="ESTUDIANTE">Estudiante</option>
            <option value="PROFESOR">Profesor</option>
            <option value="ADMINISTRADOR">Administrador</option>
          </select>

          <button type="submit">Ingresar</button>
        </form>

        <span className="divider"></span>

        <p className="register-text">
          ¿No tienes cuenta? <Link to="/register">Registrarse</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
