import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    document: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Crear cuenta</h2>
        <p>Regístrate para comenzar en SURA</p>

        <form onSubmit={handleSubmit}>
          {/* NOMBRE */}
          <input
            type="text"
            name="name"
            placeholder="Nombre completo"
            value={formData.name}
            onChange={handleChange}
            required
          />

          {/* DOCUMENTO */}
          <input
            type="text"
            name="document"
            placeholder="Documento de identificación"
            value={formData.document}
            onChange={handleChange}
            required
          />

          {/* CELULAR */}
          <input
            type="tel"
            name="phone"
            placeholder="Número de celular"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* ROL */}
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="" disabled hidden>
              Selecciona un Rol
            </option>
            <option value="student">Estudiante</option>
            <option value="teacher">Profesor</option>
            <option value="admin">Administrador</option>
          </select>

          {/* MENSAJE ADMIN */}
          {formData.role === 'admin' && (
            <div className="admin-warning">
              ⚠ La cuenta de administrador requiere autorización previa. Tu solicitud
              será revisada.
            </div>
          )}

          <button type="submit">Registrarse</button>
        </form>

        <span className="divider"></span>

        <p className="login-text">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
