import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoSura from '../assets/LogoSura.png';

const Home = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');
  const [rolePanel, setRolePanel] = useState('');
  const [activeRole, setActiveRole] = useState('');
  const [view, setView] = useState('inicio');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const roleCardRef = useRef(null);
  const contentRef = useRef(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const [asistencias, setAsistencias] = useState([]);
  const [profesorTab, setProfesorTab] = useState('ver');
  const [asistenciaEditando, setAsistenciaEditando] = useState(null);
  const [formProfesor, setFormProfesor] = useState({
    estudiante: '',
    materia: '',
    materiaOtro: '',
    dia: '',
    asistio: false,
    excusa: false,
    anotaciones: '',
    archivoExcusaNombre: ''
  });
  const [filtrosEstudiante, setFiltrosEstudiante] = useState({
    dia: '',
    materia: ''
  });
  const [filtroProfesorMateria, setFiltroProfesorMateria] = useState('');
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

  const materiasProfesor = useMemo(() => {
    const materias = asistencias
      .map((item) => item.materia)
      .filter((materia) => Boolean(materia));
    return Array.from(new Set(materias));
  }, [asistencias]);

  const asistenciasProfesorFiltradas = useMemo(() => {
    return asistencias.filter((item) => {
      if (!filtroProfesorMateria) return true;
      return item.materia === filtroProfesorMateria;
    });
  }, [asistencias, filtroProfesorMateria]);

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
      setError('Selecciona un rol en "Elegir rol" para continuar.');
      return;
    }
    setActiveRole(selectedRole);
    localStorage.setItem('sura_active_role', selectedRole);
    setView('asistencias');
    setError('');
    setMensaje(`Sesión iniciada como ${selectedRole}.`);
    setRoleDropdownOpen(false);
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
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

  const handleToggleAsistio = () => {
    setFormProfesor((prev) => ({
      ...prev,
      asistio: !prev.asistio,
      excusa: prev.asistio ? prev.excusa : false
    }));
  };

  const handleToggleExcusa = () => {
    setFormProfesor((prev) => ({
      ...prev,
      excusa: !prev.excusa,
      asistio: false,
      anotaciones: prev.excusa ? '' : prev.anotaciones,
      archivoExcusaNombre: prev.excusa ? '' : prev.archivoExcusaNombre
    }));
  };

  const handleArchivoExcusa = (event) => {
    const file = event.target.files?.[0];
    setFormProfesor((prev) => ({
      ...prev,
      archivoExcusaNombre: file ? file.name : ''
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
      id: asistenciaEditando?.id || Date.now(),
      ...formProfesor,
      materia: materiaFinal
    };

    setAsistencias((prev) => {
      if (!asistenciaEditando) return [nueva, ...prev];
      return prev.map((item) => (item.id === asistenciaEditando.id ? nueva : item));
    });

    setAsistenciaEditando(null);
    setFormProfesor({
      estudiante: '',
      materia: '',
      materiaOtro: '',
      dia: '',
      asistio: false,
      excusa: false,
      anotaciones: '',
      archivoExcusaNombre: ''
    });
    setError('');
    setMensaje(
      asistenciaEditando
        ? 'Asistencia actualizada correctamente.'
        : 'Asistencia registrada localmente.'
    );
    setTimeout(() => setMensaje(''), 2500);
  };

  const handleEditarAsistencia = (item) => {
    setProfesorTab('asignar');
    setAsistenciaEditando(item);
    setFormProfesor({
      estudiante: item.estudiante || '',
      materia: item.materia || '',
      materiaOtro: '',
      dia: item.dia || '',
      asistio: Boolean(item.asistio),
      excusa: Boolean(item.excusa),
      anotaciones: item.anotaciones || '',
      archivoExcusaNombre: item.archivoExcusaNombre || ''
    });
  };

  const handleDropdownToggle = (event) => {
    const detail = event.currentTarget;
    if (!detail.open) return;
    const summary = detail.querySelector('summary');
    if (!summary) return;

    const rect = summary.getBoundingClientRect();
    const mid = rect.left + rect.width / 2;
    const width = window.innerWidth;

    detail.classList.remove('align-left', 'align-right', 'align-center');
    if (mid < width * 0.33) {
      detail.classList.add('align-right');
    } else if (mid > width * 0.66) {
      detail.classList.add('align-left');
    } else {
      detail.classList.add('align-center');
    }
  };

  const closeDropdown = (event) => {
    const detail = event.currentTarget.closest('details');
    if (detail?.hasAttribute('open')) {
      detail.removeAttribute('open');
    }
  };

  const gotoAsistencias = () => {
    if (!activeRole) {
      setError('Debes elegir un rol para ver asistencias.');
      setRoleDropdownOpen(true);
      roleCardRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      return;
    }
    setView('asistencias');
    setError('');
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const resolveEstado = (item) => {
    if (item.asistio) {
      return { label: 'Asistió', className: 'status-pill is-ok' };
    }
    if (item.excusa) {
      return { label: 'Excusa', className: 'status-pill is-excuse' };
    }
    return { label: 'No asistió', className: 'status-pill is-miss' };
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
          <details className="dropdown menu-dropdown" onToggle={handleDropdownToggle}>
            <summary>Menú</summary>
            <div className="dropdown-menu">
              <button
                type="button"
                className="btn outline"
                disabled={!isAdmin}
                onClick={(event) => {
                  closeDropdown(event);
                  navigate('/modulos/usuarios');
                }}
              >
                Usuarios
              </button>
              <button
                type="button"
                className="btn outline"
                disabled={!isAdmin}
                onClick={(event) => {
                  closeDropdown(event);
                  navigate('/modulos/profesor');
                }}
              >
                Profesor
              </button>
              <button
                type="button"
                className="btn outline"
                disabled={!isAdmin}
                onClick={(event) => {
                  closeDropdown(event);
                  navigate('/profesor/mis-clases');
                }}
              >
                Curso
              </button>
              <button
                type="button"
                className="btn outline"
                disabled={!isAdmin}
                onClick={(event) => {
                  closeDropdown(event);
                  navigate('/admin/reportes-globales');
                }}
              >
                Reporte
              </button>
              <button
                type="button"
                className="btn outline"
                disabled={!isAdmin}
                onClick={(event) => {
                  closeDropdown(event);
                  navigate('/modulos/notificacion');
                }}
              >
                Notificación
              </button>
              <button
                type="button"
                className="btn outline"
                disabled={!isAdmin}
                onClick={(event) => {
                  closeDropdown(event);
                  navigate('/modulos/matricula');
                }}
              >
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
              onClick={gotoAsistencias}
            >
              Asistencias registradas
            </button>
          )}
          {activeRole ? (
            <details className="dropdown user-dropdown" onToggle={handleDropdownToggle}>
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
          <p className="hero-kicker">Gestión diaria</p>
          <h1>Asistencia simple para equipos académicos.</h1>
          <p>
            Registra la presencia, gestiona excusas y consulta historiales en un
            flujo claro y rápido para profesores y estudiantes.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn primary" onClick={gotoAsistencias}>
              Ver asistencias
            </button>
            <button
              type="button"
              className="btn outline"
              onClick={() =>
                document.getElementById('resumen-diario')?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                })
              }
            >
              Ver resumen diario
            </button>
          </div>
          <div className="hero-stats" aria-label="Resumen diario">
            <div className="hero-stat">
              <div className="hero-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <span>Estado</span>
                <strong>Actualizado</strong>
              </div>
            </div>
            <div className="hero-stat">
              <div className="hero-icon alt">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
                  <path d="M12 8v4l3 3" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </div>
              <div>
                <span>Seguimiento</span>
                <strong>Diario</strong>
              </div>
            </div>
            <div className="hero-stat">
              <div className="hero-icon warn">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                  <path d="M4 20h16L12 4 4 20z" />
                </svg>
              </div>
              <div>
                <span>Soporte</span>
                <strong>Excusas</strong>
              </div>
            </div>
          </div>
        </div>
        <aside className="role-card" ref={roleCardRef}>
          <p className="role-title">Acceso rápido</p>
          <p className="role-subtitle">
            {activeRole
              ? `Sesión activa: ${activeRole}.`
              : 'Elige tu perfil y entra al módulo.'}
          </p>
          <details
            className="dropdown role-dropdown"
            open={roleDropdownOpen}
            onToggle={(event) => {
              setRoleDropdownOpen(event.currentTarget.open);
              handleDropdownToggle(event);
            }}
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
                  Entrar como estudiante
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
                  Entrar como profesor
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

      <section className="info-grid" id="resumen-diario">
        <article className="info-card highlight-card">
          <h3>Registro en un solo lugar</h3>
          <p>
            Marca asistencia, registra excusas y agrega anotaciones sin salir del
            módulo.
          </p>
          <div className="highlight-metrics">
            <div className="metric">
              <span>Profesores</span>
              <strong>Registro rápido</strong>
            </div>
            <div className="metric">
              <span>Estudiantes</span>
              <strong>Historial claro</strong>
            </div>
            <div className="metric">
              <span>Coordinación</span>
              <strong>Vista diaria</strong>
            </div>
          </div>
        </article>
        <article className="info-card">
          <h3>Alertas y seguimiento</h3>
          <p>Identifica ausencias recurrentes y actúa con tiempo.</p>
        </article>
        <article className="info-card">
          <h3>Excusas y notas</h3>
          <p>Adjunta observaciones para que todo el equipo tenga contexto.</p>
        </article>
        <article className="info-card">
          <h3>Consulta inmediata</h3>
          <p>Filtra por materia y día para encontrar lo que necesitas.</p>
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
          <p>Menos pasos, más claridad en cada clase.</p>
        </article>
        <article className="benefit">
          <div className="benefit-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h10" />
            </svg>
          </div>
          <h4>Consulta rápida</h4>
          <p>Encuentra registros con filtros simples.</p>
        </article>
        <article className="benefit">
          <div className="benefit-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
              <path d="M12 3v18M3 12h18" />
            </svg>
          </div>
          <h4>Contexto completo</h4>
          <p>Excusas y anotaciones disponibles cuando se necesitan.</p>
        </article>
      </section>

      <main className="content" ref={contentRef}>
        {mensaje && (
          <div className="alert success" role="status" aria-live="polite">
            {mensaje}
          </div>
        )}
        {error && (
          <div className="alert error" role="alert">
            {error}
          </div>
        )}

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
                            <th>Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                            {asistenciasFiltradas.length === 0 ? (
                              <tr>
                                <td colSpan="4" className="empty">
                                  No hay asistencias registradas.
                                  <div className="empty-hint">
                                    Registra la primera asistencia para comenzar.
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              asistenciasFiltradas.map((item) => {
                                const estado = resolveEstado(item);
                                return (
                                  <tr key={item.id}>
                                    <td>{item.estudiante}</td>
                                    <td>{item.materia}</td>
                                    <td>{item.dia}</td>
                                    <td>
                                      <span className={estado.className}>
                                        {estado.label}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })
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
                  <details className="dropdown" onToggle={handleDropdownToggle}>
                    <summary>Acciones</summary>
                    <div className="dropdown-menu">
                      <button
                        type="button"
                        className={`btn primary ${
                          profesorTab === 'asignar' ? 'active' : ''
                        }`}
                        onClick={(event) => {
                          closeDropdown(event);
                          setProfesorTab('asignar');
                        }}
                      >
                        Asignar asistencia
                      </button>
                      <button
                        type="button"
                        className={`btn outline ${profesorTab === 'ver' ? 'active' : ''}`}
                        onClick={(event) => {
                          closeDropdown(event);
                          setProfesorTab('ver');
                        }}
                      >
                        Ver asistencias
                      </button>
                    </div>
                  </details>
                </div>

                {profesorTab === 'asignar' ? (
                  <div className="module-body">
                    <section className="card">
                      <h3>
                        {asistenciaEditando
                          ? 'Editar asistencia (local)'
                          : 'Registrar asistencia (local)'}
                      </h3>
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
                        <div className="status-field">
                          <span className="status-label">Estado</span>
                          <div className="status-actions">
                            <button
                              type="button"
                              className={`status-btn ${
                                formProfesor.asistio ? 'active' : ''
                              }`}
                              onClick={handleToggleAsistio}
                            >
                              Asistió
                            </button>
                            <button
                              type="button"
                              className={`status-btn ${
                                !formProfesor.asistio && !formProfesor.excusa
                                  ? 'active'
                                  : ''
                              }`}
                              onClick={() =>
                                setFormProfesor((prev) => ({
                                  ...prev,
                                  asistio: false,
                                  excusa: false,
                                  anotaciones: ''
                                }))
                              }
                            >
                              No asistió
                            </button>
                            <button
                              type="button"
                              className={`status-btn ${
                                formProfesor.excusa ? 'active' : ''
                              }`}
                              onClick={handleToggleExcusa}
                            >
                              Excusa
                            </button>
                          </div>
                        </div>
                        {formProfesor.excusa && (
                          <label>
                            Anotaciones
                            <textarea
                              name="anotaciones"
                              value={formProfesor.anotaciones}
                              onChange={handleChangeProfesor}
                              placeholder="Agrega el motivo o soporte de la excusa"
                              rows={3}
                            />
                          </label>
                        )}
                        {formProfesor.excusa && (
                          <label>
                            Soporte (archivo)
                            <input
                              type="file"
                              name="archivoExcusa"
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              onChange={handleArchivoExcusa}
                            />
                            {formProfesor.archivoExcusaNombre && (
                              <span className="file-hint">
                                Archivo: {formProfesor.archivoExcusaNombre}
                              </span>
                            )}
                          </label>
                        )}
                        <button type="submit" className="btn primary">
                          {asistenciaEditando ? 'Guardar cambios' : 'Guardar asistencia'}
                        </button>
                        {asistenciaEditando && (
                          <button
                            type="button"
                            className="btn outline"
                            onClick={() => {
                              setAsistenciaEditando(null);
                              setFormProfesor({
                                estudiante: '',
                                materia: '',
                                materiaOtro: '',
                                dia: '',
                                asistio: false,
                                excusa: false,
                                anotaciones: '',
                                archivoExcusaNombre: ''
                              });
                            }}
                          >
                            Cancelar edición
                          </button>
                        )}
                      </form>
                    </section>
                  </div>
                ) : (
                  <div className="module-body">
                    <section className="card">
                      <h3>Asistencias registradas</h3>
                      <div className="filters">
                        <label>
                          Materia
                          <select
                            value={filtroProfesorMateria}
                            onChange={(e) => setFiltroProfesorMateria(e.target.value)}
                          >
                            <option value="">Todas</option>
                            {materiasProfesor.map((materia) => (
                              <option key={materia} value={materia}>
                                {materia}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <div className="table-wrap">
                        <table>
                          <thead>
                            <tr>
                              <th>Estudiante</th>
                              <th>Materia</th>
                              <th>Día</th>
                              <th>Estado</th>
                              <th>Anotaciones</th>
                              <th>Soporte</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {asistenciasProfesorFiltradas.length === 0 ? (
                              <tr>
                                <td colSpan="7" className="empty">
                                  No hay asistencias registradas.
                                  <div className="empty-hint">
                                    Usa “Asignar asistencia” para crear la primera.
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              asistenciasProfesorFiltradas.map((item) => {
                                const estado = resolveEstado(item);
                                return (
                                  <tr key={item.id}>
                                    <td>{item.estudiante}</td>
                                    <td>{item.materia}</td>
                                    <td>{item.dia}</td>
                                    <td>
                                      <span className={estado.className}>
                                        {estado.label}
                                      </span>
                                    </td>
                                    <td>{item.anotaciones || '-'}</td>
                                    <td>{item.archivoExcusaNombre || '-'}</td>
                                    <td>
                                      <button
                                        type="button"
                                        className="btn outline"
                                        onClick={() => handleEditarAsistencia(item)}
                                      >
                                        Editar
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })
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
