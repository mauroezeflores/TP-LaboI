import React, { useState, useEffect } from "react";

// ...estilos existentes...
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
  const [puestos, setPuestos] = useState([]);
  const [puestosSeleccionados, setPuestosSeleccionados] = useState([]);

  // Traer certificaciones y puestos de trabajo al montar
  useEffect(() => {
    fetchCertificaciones();
    fetchPuestos();
  }, []);

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

  const fetchPuestos = async () => {
    try {
      const res = await fetch("http://localhost:8000/puestos");
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Error al obtener puestos");
      setPuestos(data);
    } catch (err) {
      setMensaje("Error: " + err.message);
    }
  };

  const handleCheckbox = (id) => {
    setPuestosSeleccionados(prev =>
      prev.includes(id)
        ? prev.filter(pid => pid !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    try {
      // 1. Crear certificación
      const res = await fetch("http://localhost:8000/certificaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, peso }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Error al crear certificación");
      const id_certificacion = data.id_certificacion ?? data.id ?? data.insertId;

      // 2. Asociar con puestos seleccionados
      for (const id_puesto_trabajo of puestosSeleccionados) {
        await fetch("http://localhost:8000/certificaciones_validas_por_puesto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_certificacion, id_puesto_trabajo }),
        });
      }

      setMensaje("¡Certificación creada y asociada!");
      setNombre("");
      setPeso(1);
      setPuestosSeleccionados([]);
      fetchCertificaciones();
    } catch (err) {
      setMensaje("Error: " + err.message);
    }
  };

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
        <div style={{ flexBasis: "100%", marginTop: "1rem" }}>
          <label style={{ fontWeight: "bold" }}>Puestos de trabajo válidos:</label>
          <div style={{
            maxHeight: 120, overflowY: "auto", border: "1px solid #ccc",
            borderRadius: 6, padding: 8, background: "#fff", marginTop: 4
          }}>
            {puestos.length === 0 && <span style={{ color: "#888" }}>No hay puestos disponibles.</span>}
            {puestos.map(p => (
              <label key={p.id_puesto_trabajo} style={{ display: "block", marginBottom: 4 }}>
                <input
                  type="checkbox"
                  checked={puestosSeleccionados.includes(p.id_puesto_trabajo)}
                  onChange={() => handleCheckbox(p.id_puesto_trabajo)}
                />
                {p.nombre} {p.seniority ? `(${p.seniority})` : ""}
              </label>
            ))}
          </div>
        </div>
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