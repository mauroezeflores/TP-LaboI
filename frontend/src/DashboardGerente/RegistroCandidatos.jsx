import React, { useState } from 'react';

export default function RegistroCandidato() {
  const [historialLaboral, setHistorialLaboral] = useState([
    { empresa: '', tiempo: '', rol: '', tareas: '' }
  ]);

  const [estudios, setEstudios] = useState([
    { nivel: '', institucion: '', fechaIngreso: '', fechaEgreso: '' }
  ]);

  const handleAgregarTrabajo = () => {
    setHistorialLaboral([...historialLaboral, { empresa: '', tiempo: '', rol: '', tareas: '' }]);
  };

  const handleAgregarEstudio = () => {
    setEstudios([...estudios, { nivel: '', institucion: '', fechaIngreso: '', fechaEgreso: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Acá iría el manejo de datos o conexión con Supabase
    console.log("Formulario enviado");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Registro de Candidato</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Datos Personales */}
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Nombre" required />
          <input type="text" placeholder="Apellido" required />
          <input type="date" placeholder="Fecha de nacimiento" required />
          <input type="text" placeholder="Nacionalidad" required />
          <input type="text" placeholder="DNI" required />
        </div>

        {/* Contacto */}
        <div className="grid grid-cols-2 gap-4">
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Contraseña" required />
          <input type="text" placeholder="Código de País" required />
          <input type="text" placeholder="Código de Área" required />
          <input type="text" placeholder="Número de Teléfono" required />
        </div>

        {/* Ubicación */}
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Dirección" required />
          <input type="text" placeholder="País" required />
          <input type="text" placeholder="Provincia/Estado" required />
          <input type="text" placeholder="Ciudad" required />
          <input type="text" placeholder="Código Postal" required />
          <input type="text" placeholder="Latitud" />
          <input type="text" placeholder="Longitud" />
        </div>

        {/* CV */}
        <div>
          <label>Subir CV</label>
          <input type="file" accept=".pdf,.doc,.docx" />
        </div>

        {/* Historial Laboral */}
        <div>
          <h3 className="font-semibold mb-2">Historial Laboral</h3>
          {historialLaboral.map((trabajo, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 mb-2">
              <input type="text" placeholder="Empresa" />
              <input type="text" placeholder="Tiempo trabajado" />
              <input type="text" placeholder="Rol" />
              <textarea placeholder="Tareas desempeñadas" />
            </div>
          ))}
          <button type="button" onClick={handleAgregarTrabajo}>+ Agregar otro trabajo</button>
        </div>

        {/* Estudios */}
        <div>
          <h3 className="font-semibold mb-2">Educación</h3>
          {estudios.map((estudio, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 mb-2">
              <input type="text" placeholder="Nivel de estudios" />
              <input type="text" placeholder="Nombre de la institución" />
              <input type="date" placeholder="Fecha de ingreso" />
              <input type="date" placeholder="Fecha de egreso" />
            </div>
          ))}
          <button type="button" onClick={handleAgregarEstudio}>+ Agregar otro estudio</button>
        </div>

        {/* Tipo de empleo y salario */}
        <div className="grid grid-cols-2 gap-4">
          <select required>
            <option value="">Tipo de empleo</option>
            <option value="Part Time">Part Time</option>
            <option value="Full Time">Full Time</option>
          </select>
          <input type="text" placeholder="Expectativa salarial" required />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Registrar Candidato
        </button>

      </form>
    </div>
  );
}
