import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../Autenticacion.module.css';

export default function RegistroCandidato() {
  const accentClass = styles.accentCandidate;

  // Datos personales
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [nacionalidad, setNacionalidad] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Teléfono
  const [codPais, setCodPais] = useState('');
  const [codArea, setCodArea] = useState('');
  const [numTelefono, setNumTelefono] = useState('');

  // Ubicación
  const [direccion, setDireccion] = useState('');
  const [pais, setPais] = useState('');
  const [provincia, setProvincia] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');

  // CV
  const [cv, setCv] = useState(null);

  // Historial laboral
  const [historialLaboral, setHistorialLaboral] = useState([
    { empresa: '', tiempo: '', rol: '', tareas: '' }
  ]);

  const agregarHistorial = () => {
    setHistorialLaboral([...historialLaboral, { empresa: '', tiempo: '', rol: '', tareas: '' }]);
  };

  const actualizarHistorial = (index, campo, valor) => {
    const actualizado = [...historialLaboral];
    actualizado[index][campo] = valor;
    setHistorialLaboral(actualizado);
  };

  // Estudios
  const [nivelEstudios, setNivelEstudios] = useState('');
  const [institucion, setInstitucion] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState('');
  const [fechaEgreso, setFechaEgreso] = useState('');

  // Tipo de empleo y salario
  const [tipoEmpleo, setTipoEmpleo] = useState('');
  const [expectativaSalarial, setExpectativaSalarial] = useState('');

  const [error, setError] = useState('');

  const handleCvChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "application/pdf" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setCv(file);
      setError('');
    } else {
      setCv(null);
      setError('Por favor, sube un archivo PDF o Word.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre || !apellido || !email || !password || !cv) {
      setError('Por favor, completa los campos obligatorios.');
      return;
    }

    if (cv && !(cv.type === "application/pdf" || cv.type === "application/msword" || cv.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setError('El formato del CV debe ser PDF o Word.');
      return;
    }

    setError('');

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('apellido', apellido);
    formData.append('fechaNacimiento', fechaNacimiento);
    formData.append('nacionalidad', nacionalidad);
    formData.append('dni', dni);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('telefono', `+${codPais}-${codArea}-${numTelefono}`);
    formData.append('direccion', direccion);
    formData.append('pais', pais);
    formData.append('provincia', provincia);
    formData.append('ciudad', ciudad);
    formData.append('codigoPostal', codigoPostal);
    formData.append('cv', cv);
    formData.append('historialLaboral', JSON.stringify(historialLaboral));
    formData.append('nivelEstudios', nivelEstudios);
    formData.append('institucion', institucion);
    formData.append('fechaIngreso', fechaIngreso);
    formData.append('fechaEgreso', fechaEgreso);
    formData.append('tipoEmpleo', tipoEmpleo);
    formData.append('expectativaSalarial', expectativaSalarial);

    console.log("Formulario listo para enviar:", Object.fromEntries(formData.entries()));

    /* Ejemplo para enviar al backend:
    fetch('/api/registro/candidato', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => console.log('Respuesta del servidor:', data))
    .catch(err => {
      console.error('Error:', err);
      setError('Error al registrar. Intenta de nuevo.');
    });
    */
  };

  return (
    <div className={`${styles.authContainer} ${accentClass}`}>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <h2 className={styles.formTitle}>Registro de Candidato</h2>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <fieldset className={styles.formSection}>
          <legend>Datos Personales</legend>
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label>Nombre</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div className={styles.inputGroup}>
              <label>Apellido</label>
              <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
            </div>
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label>Fecha de Nacimiento</label>
              <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required />
            </div>
            <div className={styles.inputGroup}>
              <label>Nacionalidad</label>
              <input type="text" value={nacionalidad} onChange={(e) => setNacionalidad(e.target.value)} required />
            </div>
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label>DNI</label>
              <input type="text" value={dni} onChange={(e) => setDni(e.target.value)} required />
            </div>
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div className={styles.inputGroup}> {/* Contraseña ocupa toda la fila si está sola */}
            <label>Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
        </fieldset>


        <fieldset className={styles.formSection}>
          <legend>Teléfono</legend>
          <div className={styles.inputGroup}> 
            <div className={styles.inputWrapper}> {/* inputWrapper para los campos de teléfono en línea */}
              <input type="text" placeholder="+54 (Cód. País)" value={codPais} onChange={(e) => setCodPais(e.target.value)} required style={{ flexBasis: "100px", flexGrow: 0 }} />
              <input type="text" placeholder="11 (Cód. Área)" value={codArea} onChange={(e) => setCodArea(e.target.value)} required style={{ flexBasis: "100px", flexGrow: 0 }} />
              <input type="text" placeholder="12345678 (Número)" value={numTelefono} onChange={(e) => setNumTelefono(e.target.value)} required style={{ flexGrow: 1 }}/>
            </div>
          </div>
        </fieldset>

        <fieldset className={styles.formSection}>
          <legend>Ubicación</legend>
          <div className={styles.inputGroup}> {/* Dirección ocupa toda la fila */}
            <label>Dirección</label>
            <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label>País</label>
              <input type="text" value={pais} onChange={(e) => setPais(e.target.value)} required />
            </div>
            <div className={styles.inputGroup}>
              <label>Provincia/Estado</label>
              <input type="text" value={provincia} onChange={(e) => setProvincia(e.target.value)} required />
            </div>
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label>Ciudad</label>
              <input type="text" value={ciudad} onChange={(e) => setCiudad(e.target.value)} required />
            </div>
            <div className={styles.inputGroup}>
              <label>Código Postal</label>
              <input type="text" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} required />
            </div>
          </div>
        </fieldset>

        <fieldset className={styles.formSection}>
            <div className={styles.inputGroup}>
                <label>CV (PDF o Word)</label>
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvChange} required />
                {cv && <span style={{ fontSize: '0.8rem', color: '#555', marginTop: '0.5rem' }}>Archivo: {cv.name}</span>}
            </div>
        </fieldset>


        <fieldset className={styles.formSection}>
          <legend>Historial Laboral</legend>
          {historialLaboral.map((item, index) => (
            <div key={index} style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
              <div className={styles.inputRow}>
                 <div className={styles.inputGroup}>
                    <label>Empresa</label>
                    <input type="text" placeholder="Empresa" value={item.empresa} onChange={(e) => actualizarHistorial(index, 'empresa', e.target.value)} required />
                 </div>
                 <div className={styles.inputGroup}>
                    <label>Tiempo</label>
                    <input type="text" placeholder="Ene 2020 - Dic 2022" value={item.tiempo} onChange={(e) => actualizarHistorial(index, 'tiempo', e.target.value)} required />
                 </div>
              </div>
              <div className={styles.inputGroup}>
                <label>Rol</label>
                <input type="text" placeholder="Rol desempeñado" value={item.rol} onChange={(e) => actualizarHistorial(index, 'rol', e.target.value)} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Tareas</label>
                <textarea placeholder="Tareas desempeñadas" value={item.tareas} onChange={(e) => actualizarHistorial(index, 'tareas', e.target.value)} required />
              </div>
            </div>
          ))}
          <button type="button" onClick={agregarHistorial} className={styles.submitButton} style={{backgroundColor: '#6c757d', width: 'auto', padding: '0.5rem 1rem', marginTop:'0.5rem'}}>
            Agregar otro empleo
          </button>
        </fieldset>

        <fieldset className={styles.formSection}>
          <legend>Educación</legend>
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label>Nivel de Estudios</label>
              <select value={nivelEstudios} onChange={(e) => setNivelEstudios(e.target.value)} required>
                <option value="">Seleccionar</option>
                <option value="Primario">Primario</option>
                <option value="Secundario">Secundario</option>
                <option value="Terciario">Terciario</option>
                <option value="Carrera de grado">Carrera de grado</option>
                <option value="Posgrado">Posgrado</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>Institución</label>
              <input type="text" placeholder="Nombre de la Institución" value={institucion} onChange={(e) => setInstitucion(e.target.value)} required />
            </div>
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
                <label>Fecha de Ingreso</label>
                <input type="date" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} required />
            </div>
            <div className={styles.inputGroup}>
                <label>Fecha de Egreso</label>
                <input type="date" value={fechaEgreso} onChange={(e) => setFechaEgreso(e.target.value)} />
            </div>
           </div>
        </fieldset>

        <fieldset className={styles.formSection}>
            <legend>Preferencias Laborales</legend>
            <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                <label>Tipo de Empleo Buscado</label>
                <select value={tipoEmpleo} onChange={(e) => setTipoEmpleo(e.target.value)} required>
                    <option value="">Seleccionar</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Pasantia">Pasantía</option>
                </select>
                </div>

                <div className={styles.inputGroup}>
                <label>Expectativa Salarial (ARS)</label>
                <input type="number" placeholder="Ej: 150000" value={expectativaSalarial} onChange={(e) => setExpectativaSalarial(e.target.value)} required />
                </div>
            </div>
        </fieldset>

        <button type="submit" className={styles.submitButton}>
          Registrarme
        </button>

        <div className={styles.linkContainer}>
          <Link to="/login/candidato">¿Ya tienes cuenta? Inicia Sesión</Link>
        </div>
        <div className={styles.linkContainer}>
          <Link to="/">← Volver al Inicio</Link>
        </div>
      </form>
    </div>
  );
}