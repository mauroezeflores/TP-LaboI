import React, { useState } from "react";

export function CrearCertificacion() {
  const [nombre, setNombre] = useState("");
  const [peso, setPeso] = useState(1);
  const [mensaje, setMensaje] = useState("");
  const [certificaciones, setCertificaciones] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    try {
      const res = await fetch("http://localhost:8000/certificaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, peso }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Error al crear certificación");
      setMensaje("¡Certificación creada!");
      setNombre("");
      setPeso(1);
    } catch (err) {
      setMensaje("Error: " + err.message);
    }
  };
    const fetchCertificaciones = async () => {
        try {
        const res = await fetch("http://localhost:8000/certificaciones");
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Error al obtener certificaciones");
        setCertificaciones(data);
        } catch (err) {
        setMensaje("Error: " + err.message);
        }
    };
    // Cargar certificaciones al montar el componente
    React.useEffect(() => {
        fetchCertificaciones();
    }, []);
    
  return (
    <>
    <div>
        <h2>certificaciones existentes</h2>
        <ul>
            {certificaciones.map(cert => (
                <li key={cert.id}>
                    {cert.nombre} - Peso: {cert.peso}
                </li>
            ))}
        </ul>
    </div>
    <h2>Crear nueva certificación</h2>
    <form onSubmit={handleSubmit}>
      <label>
        Nombre:
        <input value={nombre} onChange={e => setNombre(e.target.value)} required />
      </label>
      <label>
        Peso (1-5):
        <input type="number" min={1} max={5} value={peso} onChange={e => setPeso(Number(e.target.value))} required />
      </label>
      <button type="submit">Crear certificación</button>
      {mensaje && <p>{mensaje}</p>}
    </form>
    </>
  );
}

export default CrearCertificacion;