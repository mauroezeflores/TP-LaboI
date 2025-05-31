import React, { useState, useEffect } from "react";

// Puedes usar MUI o estilos propios, aquí va con estilos CSS-in-JS simples
const cardStyle = {
  background: "#f8fafc",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  padding: "1rem",
  margin: "0.5rem",
  minWidth: "220px",
  maxWidth: "300px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  borderLeft: "6px solid #4f8cff",
};

const cardsContainerStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
  maxHeight: "350px",
  overflowY: "auto",
  background: "#f1f5f9",
  borderRadius: "10px",
  padding: "1rem",
  marginTop: "1rem",
  marginBottom: "2rem",
  minHeight: "120px",
};

const searchBarStyle = {
  width: "100%",
  padding: "0.5rem 1rem",
  borderRadius: "6px",
  border: "1px solid #b6c2d1",
  marginBottom: "1rem",
  fontSize: "1rem",
  background: "#fff",
};

const sliderStyle = {
  width: "120px",
  marginLeft: "1rem",
  marginRight: "1rem",
};

export function CrearCertificacion() {
  const [nombre, setNombre] = useState("");
  const [peso, setPeso] = useState(1);
  const [mensaje, setMensaje] = useState("");
  const [certificaciones, setCertificaciones] = useState([]);
  const [busqueda, setBusqueda] = useState("");

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
      fetchCertificaciones();
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

  useEffect(() => {
    fetchCertificaciones();
  }, []);

  // Filtrado por búsqueda
  const certificacionesFiltradas = certificaciones.filter(cert =>
    cert.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem" }}>
      <h2 style={{ marginBottom: "1.5rem", color: "#2d3a4a" }}>Crear nueva certificación</h2>
      <form onSubmit={handleSubmit} style={{
        display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap", marginBottom: "2rem",
        background: "#f8fafc", borderRadius: "10px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
      }}>
        <label style={{ flex: 1, minWidth: 180 }}>
          Nombre:<br />
          <input
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #b6c2d1",
              fontSize: "1rem",
              marginTop: "0.3rem"
            }}
            placeholder="Ej: Scrum Master"
          />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          Peso:
          <input
            type="range"
            min={1}
            max={5}
            value={peso}
            onChange={e => setPeso(Number(e.target.value))}
            style={sliderStyle}
          />
          <span style={{
            display: "inline-block",
            minWidth: "2ch",
            fontWeight: "bold",
            color: "#4f8cff"
          }}>{peso}</span>
        </label>
        <button
          type="submit"
          style={{
            background: "#4f8cff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "0.7rem 1.5rem",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
            marginTop: "1.2rem"
          }}
        >
          Crear certificación
        </button>
        {mensaje && <p style={{ color: mensaje.startsWith("Error") ? "#d32f2f" : "#388e3c", marginTop: "1rem" }}>{mensaje}</p>}
      </form>

      <div>
        <h2 style={{ color: "#2d3a4a", marginBottom: "0.5rem" }}>Certificaciones existentes</h2>
        <input
          type="text"
          placeholder="Buscar certificación..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={searchBarStyle}
        />
        <div style={cardsContainerStyle}>
          {certificacionesFiltradas.length > 0 ? (
            certificacionesFiltradas.map(cert => (
              <div key={cert.id} style={cardStyle}>
                <div style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#2d3a4a" }}>{cert.nombre}</div>
                <div style={{ marginTop: "0.5rem", color: "#4f8cff", fontWeight: "bold" }}>
                  Peso: <span style={{
                    background: "#e3f0ff",
                    borderRadius: "5px",
                    padding: "0.2rem 0.7rem",
                    marginLeft: "0.3rem"
                  }}>{cert.peso}</span>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "#888", width: "100%", textAlign: "center" }}>No se encontraron certificaciones.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CrearCertificacion;