import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import LogoSura from '../assets/LogoSura.svg';

const Home = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');
  const [rolePanel, setRolePanel] = useState('');
  const [activeRole, setActiveRole] = useState('');
  const [view, setView] = useState('inicio');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const roleCardRef = useRef(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const [asistencias, setAsistencias] = useState([]);
  const [profesorTab, setProfesorTab] = useState('ver');
  const [formProfesor, setFormProfesor] = useState({
    estudiante: '',
    materia: '',
    materiaOtro: '',
    dia: '',
    asistio: false
  });
  const [filtrosEstudiante, setFiltrosEstudiante] = useState({
    dia: '',
    materia: ''
  });
  const isAdmin = activeRole === 'profesor';

  useEffect(() => {
    const guardadas = localStorage.getItem('sura_asistencias_local');
    if (guardadas) {
      try {
        setAsistencias(JSON.parse(guardadas));
      } catch {
        setAsistencias([]);
      }
    }

    const rolActivo = localStorage.getItem('sura_active_role');
    if (rolActivo) {
      setActiveRole(rolActivo);
      setSelectedRole(rolActivo);
      setView('asistencias');
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      if (target.closest('details')) return;

      document
        .querySelectorAll('details[open]')
        .forEach((detail) => detail.removeAttribute('open'));
      setRoleDropdownOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    localStorage.setItem('sura_asistencias_local', JSON.stringify(asistencias));
  }, [asistencias]);

  const asistenciasFiltradas = useMemo(() => {
    return asistencias.filter((item) => {
      const diaOk = !filtrosEstudiante.dia || item.dia === filtrosEstudiante.dia;
      const materiaOk =
        !filtrosEstudiante.materia || item.materia === filtrosEstudiante.materia;
      return diaOk && materiaOk;
    });
  }, [asistencias, filtrosEstudiante]);

  const handleRoleSelect = (rol) => {
    setSelectedRole(rol);
    setRolePanel((prev) => (prev === rol ? '' : rol));
    setRoleDropdownOpen(true);
    setMensaje('');
    if (activeRole && activeRole !== rol) {
      setMensaje(`Debes iniciar sesión como ${rol} para continuar.`);
    }
  };

  const handleLogin = () => {
    if (!selectedRole) {
      setError('Selecciona un rol en "Elegir rol" para iniciar sesión.');
      return;
    }
    setActiveRole(selectedRole);
    localStorage.setItem('sura_active_role', selectedRole);
    setView('asistencias');
    setError('');
    setMensaje(`Sesión iniciada como ${selectedRole}.`);
    setRoleDropdownOpen(false);
    setTimeout(() => setMensaje(''), 2500);
  };

  const handleLogout = () => {
    setActiveRole('');
    setSelectedRole('');
    setRolePanel('');
    setView('inicio');
    localStorage.removeItem('sura_active_role');
    setMensaje('Sesión cerrada.');
    setTimeout(() => setMensaje(''), 2000);
  };

  const handleChangeProfesor = (e) => {
    const { name, value, type, checked } = e.target;
    setFormProfesor((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const guardarAsistenciaLocal = (e) => {
    e.preventDefault();
    const materiaFinal =
      formProfesor.materia === 'Otro'
        ? formProfesor.materiaOtro.trim()
        : formProfesor.materia;

    if (!formProfesor.estudiante || !materiaFinal) {
      setError('Completa estudiante y materia para guardar.');
      return;
    }
    const nueva = {
      id: Date.now(),
      ...formProfesor
    };
    nueva.materia = materiaFinal;
    setAsistencias((prev) => [nueva, ...prev]);
    setFormProfesor({
      estudiante: '',
      materia: '',
      materiaOtro: '',
      dia: '',
      asistio: false
    });
    setError('');
    setMensaje('Asistencia registrada localmente.');
    setTimeout(() => setMensaje(''), 2500);
  };

  return (
    <div className="page">
      <header className="topbar">
        <Link
          to="/"
          className="brand-link"
          onClick={() => {
            setView('inicio');
            setError('');
          }}
        >
          <div className="brand">
            <span className="brand-badge">
              <img src={LogoSura} alt="SURA" />
            </span>
            <div>
              <span className="brand-title">Asistencia</span>
              <span className="brand-subtitle">SURA Educación</span>
            </div>
          </div>
        </Link>
        <nav className="top-actions">
          <details className="dropdown menu-dropdown">
            <summary>Menú</summary>
            <div className="dropdown-menu">
              <button type="button" className="btn outline" disabled={!isAdmin}>
                Usuarios
              </button>
              <button type="button" className="btn outline" disabled={!isAdmin}>
                Profesor
              </button>
              <button type="button" className="btn outline" disabled={!isAdmin}>
                Curso
              </button>
              <button type="button" className="btn outline" disabled={!isAdmin}>
                Reporte
              </button>
              <button type="button" className="btn outline" disabled={!isAdmin}>
                Notificación
              </button>
              <button type="button" className="btn outline" disabled={!isAdmin}>
                Matrícula
              </button>
            </div>
          </details>
          <button
            type="button"
            className="btn outline"
            onClick={() => {
              navigate('/');
              setView('inicio');
              setError('');
            }}
          >
            Ir a inicio
          </button>
          {activeRole === 'profesor' && (
            <button
              type="button"
              className="btn outline"
              onClick={() => {
                setView('asistencias');
                setError('');
              }}
            >
              Asistencias registradas
            </button>
          )}
          {activeRole ? (
            <details className="dropdown user-dropdown">
              <summary>{`Sesión: ${activeRole}`}</summary>
              <div className="dropdown-menu">
                <button type="button" className="btn outline" onClick={handleLogout}>
                  Cerrar sesión
                </button>
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => setRolePanel('')}
                >
                  Cambiar rol
                </button>
              </div>
            </details>
          ) : null}
        </nav>
      </header>

      <section className="hero-row">
        <div className="hero-copy">
          <p className="hero-kicker">Panel de asistencia</p>
          <h1>Visibilidad clara para docentes y estudiantes.</h1>
          <p>
            Registra, consulta y da seguimiento a la asistencia con filtros
            simples y una experiencia lista para integrarse a tus módulos.
          </p>
          <div className="hero-actions">
            <button
              type="button"
              className="btn primary"
              onClick={() => {
                if (!activeRole) {
                  setError('Debes iniciar sesión para ver asistencias.');
                  return;
                }
                setView('asistencias');
                setError('');
              }}
            >
              Ver asistencias
            </button>
            <button type="button" className="btn outline">
              Explorar módulos
            </button>
          </div>
          <div className="hero-stats">
            <div>
              <span>Flujo</span>
              <strong>Por rol</strong>
            </div>
            <div>
              <span>Consulta</span>
              <strong>Rápida</strong>
            </div>
            <div>
              <span>Integración</span>
              <strong>Lista</strong>
            </div>
          </div>
        </div>
        <aside className="role-card" ref={roleCardRef}>
          <p className="role-title">Acceso por rol</p>
          <p className="role-subtitle">
            {activeRole
              ? `Sesión activa: ${activeRole}.`
              : 'Elige tu perfil y luego inicia sesión.'}
          </p>
          <details
            className="dropdown role-dropdown"
            open={roleDropdownOpen}
            onToggle={(event) => setRoleDropdownOpen(event.currentTarget.open)}
          >
            <summary>Elegir rol</summary>
            <div className="dropdown-menu">
              <button
                type="button"
                className={`btn outline ${selectedRole === 'estudiante' ? 'active' : ''}`}
                onClick={() => handleRoleSelect('estudiante')}
              >
                Estudiante
              </button>
              {rolePanel === 'estudiante' && (
                <button type="button" className="btn primary" onClick={handleLogin}>
                  Iniciar sesión como estudiante
                </button>
              )}
              <button
                type="button"
                className={`btn outline ${selectedRole === 'profesor' ? 'active' : ''}`}
                onClick={() => handleRoleSelect('profesor')}
              >
                Profesor
              </button>
              {rolePanel === 'profesor' && (
                <button type="button" className="btn primary" onClick={handleLogin}>
                  Iniciar sesión como profesor
                </button>
              )}
            </div>
          </details>
          {activeRole && (
            <button type="button" className="btn outline" onClick={handleLogout}>
              Cerrar sesión
            </button>
          )}
        </aside>
      </section>

      <section className="info-grid">
        <article className="info-card highlight-card">
          <h3>Asistencia con enfoque humano</h3>
          <p>
            Diseñado para equipos académicos que buscan claridad, orden y
            continuidad en el acompañamiento educativo.
          </p>
          <div className="highlight-metrics">
            <div className="metric">
              <span>Enfoque</span>
              <strong>Seguimiento real</strong>
            </div>
            <div className="metric">
              <span>Objetivo</span>
              <strong>Mejorar permanencia</strong>
            </div>
            <div className="metric">
              <span>Uso</span>
              <strong>Simple y directo</strong>
            </div>
          </div>
        </article>
        <article className="info-card">
          <h3>Educación con propósito</h3>
          <p>
            Fundación SURA promueve la calidad de la educación y el desarrollo de
            capacidades en directivos, docentes y estudiantes.
          </p>
        </article>
        <article className="info-card">
          <h3>Innovación en aula</h3>
          <p>
            Iniciativas como Félix y Susana y Cuantrix hacen parte de la línea
            educativa y acompañan procesos en instituciones educativas.
          </p>
        </article>
        <article className="info-card">
          <h3>Continuidad y mejora</h3>
          <p>
            Edúcate con SURA ofrece rutas de aprendizaje y recursos para fortalecer
            prácticas formativas y de bienestar.
          </p>
        </article>
      </section>

      <section className="benefits">
        <article className="benefit">
          <div className="benefit-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
              <path d="M5 12l4 4L19 6" />
            </svg>
          </div>
          <h4>Registro confiable</h4>
          <p>Reduce errores manuales y facilita la trazabilidad por materia.</p>
        </article>
        <article className="benefit">
          <div className="benefit-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h10" />
            </svg>
          </div>
          <h4>Consulta rápida</h4>
          <p>Filtros por día y materia para ver solo lo necesario.</p>
        </article>
        <article className="benefit">
          <div className="benefit-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
              <path d="M12 3v18M3 12h18" />
            </svg>
          </div>
          <h4>Integración sencilla</h4>
          <p>Estructura lista para conectarse con APIs y módulos externos.</p>
        </article>
      </section>

      <main className="content">
        {mensaje && <div className="alert success">{mensaje}</div>}
        {error && <div className="alert error">{error}</div>}

        {activeRole && view === 'asistencias' && (
          <section className="modules">
            {activeRole === 'estudiante' && (
              <article className="module">
                <header>
                  <h2>Estudiante</h2>
                  <p>Consulta tus asistencias registradas.</p>
                </header>
                <div className="filters">
                  <label>
                    Día
                    <select
                      value={filtrosEstudiante.dia}
                      onChange={(e) =>
                        setFiltrosEstudiante((prev) => ({
                          ...prev,
                          dia: e.target.value
                        }))
                      }
                    >
                      <option value="">Todos</option>
                      <option value="Lunes">Lunes</option>
                      <option value="Miércoles">Miércoles</option>
                      <option value="Viernes">Viernes</option>
                    </select>
                  </label>
                  <label>
                    Materia
                    <select
                      value={filtrosEstudiante.materia}
                      onChange={(e) =>
                        setFiltrosEstudiante((prev) => ({
                          ...prev,
                          materia: e.target.value
                        }))
                      }
                    >
                      <option value="">Todas</option>
                      <option value="Introducción a la programación">
                        Introducción a la programación
                      </option>
                      <option value="Bases de datos">Bases de datos</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Lógica de programación">
                        Lógica de programación
                      </option>
                      <option value="Empresarial">Empresarial</option>
                    </select>
                  </label>
                </div>
                <div className="module-body">
                  <div className="card">
                    <h3>Asistencias registradas</h3>
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Estudiante</th>
                            <th>Materia</th>
                            <th>Día</th>
                            <th>Asistió</th>
                          </tr>
                        </thead>
                        <tbody>
                            {asistenciasFiltradas.length === 0 ? (
                              <tr>
                                <td colSpan="4" className="empty">
                                  No hay asistencias registradas.
                                </td>
                              </tr>
                            ) : (
                              asistenciasFiltradas.map((item) => (
                                <tr key={item.id}>
                                  <td>{item.estudiante}</td>
                                  <td>{item.materia}</td>
                                  <td>{item.dia}</td>
                                  <td>{item.asistio ? 'Sí' : 'No'}</td>
                                </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {activeRole === 'profesor' && (
              <article className="module">
                <header>
                  <h2>Profesor</h2>
                  <p>Gestiona asistencias de tus materias.</p>
                </header>
                <div className="module-actions">
                  <details className="dropdown">
                    <summary>Acciones</summary>
                    <div className="dropdown-menu">
                      <button
                        type="button"
                        className={`btn primary ${
                          profesorTab === 'asignar' ? 'active' : ''
                        }`}
                        onClick={() => setProfesorTab('asignar')}
                      >
                        Asignar asistencia
                      </button>
                      <button
                        type="button"
                        className={`btn outline ${profesorTab === 'ver' ? 'active' : ''}`}
                        onClick={() => setProfesorTab('ver')}
                      >
                        Ver asistencias
                      </button>
                    </div>
                  </details>
                </div>

                {profesorTab === 'asignar' ? (
                  <div className="module-body">
                    <section className="card">
                      <h3>Registrar asistencia (local)</h3>
                      <form className="form" onSubmit={guardarAsistenciaLocal}>
                        <label>
                          Estudiante
                          <input
                            type="text"
                            name="estudiante"
                            value={formProfesor.estudiante}
                            onChange={handleChangeProfesor}
                            placeholder="Nombre del estudiante"
                          />
                        </label>
                        <label>
                          Materia
                          <select
                            name="materia"
                            value={formProfesor.materia}
                            onChange={handleChangeProfesor}
                          >
                            <option value="">Selecciona una materia</option>
                            <option value="Introducción a la programación">
                              Introducción a la programación
                            </option>
                            <option value="Bases de datos">Bases de datos</option>
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Lógica de programación">
                              Lógica de programación
                            </option>
                            <option value="Empresarial">Empresarial</option>
                            <option value="Otro">Otro</option>
                          </select>
                        </label>
                        {formProfesor.materia === 'Otro' && (
                          <label>
                            Otra materia
                            <input
                              type="text"
                              name="materiaOtro"
                              value={formProfesor.materiaOtro}
                              onChange={handleChangeProfesor}
                              placeholder="Escribe la materia"
                            />
                          </label>
                        )}
                        <label>
                          Día
                          <input
                            type="text"
                            name="dia"
                            value={formProfesor.dia}
                            onChange={handleChangeProfesor}
                            placeholder="Ej: Lunes"
                          />
                        </label>
                        <label className="checkbox">
                          <input
                            type="checkbox"
                            name="asistio"
                            checked={formProfesor.asistio}
                            onChange={handleChangeProfesor}
                          />
                          Asistió
                        </label>
                        <button type="submit" className="btn primary">
                          Guardar asistencia
                        </button>
                      </form>
                    </section>
                  </div>
                ) : (
                  <div className="module-body">
                    <section className="card">
                      <h3>Asistencias registradas</h3>
                      <div className="table-wrap">
                        <table>
                          <thead>
                            <tr>
                              <th>Estudiante</th>
                              <th>Materia</th>
                              <th>Día</th>
                              <th>Asistió</th>
                            </tr>
                          </thead>
                          <tbody>
                            {asistencias.length === 0 ? (
                              <tr>
                                <td colSpan="4" className="empty">
                                  No hay asistencias registradas.
                                </td>
                              </tr>
                            ) : (
                              asistencias.map((item) => (
                                <tr key={item.id}>
                                  <td>{item.estudiante}</td>
                                  <td>{item.materia}</td>
                                  <td>{item.dia}</td>
                                  <td>{item.asistio ? 'Sí' : 'No'}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  </div>
                )}
              </article>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default Home;
