import React, { useEffect, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import getPuestos from '../services/ServicePuestosMock'; // Asegurate que el path sea el correcto

const ConfiguracionPorPuesto = () => {
  const [puestos, setPuestos] = useState([]);
  const [umbralesPorPuesto, setUmbralesPorPuesto] = useState({});

  useEffect(() => {
    // Traemos los puestos del mock
    getPuestos().then((data) => {
      setPuestos(data);

      // Ver si ya hay algo guardado en localStorage
      const configGuardada = localStorage.getItem('umbralesPorPuesto');
      if (configGuardada) {
        setUmbralesPorPuesto(JSON.parse(configGuardada));
      } else {
        // Si no hay, asignamos valores default
        const defaults = {};
        data.forEach((puesto) => {
          defaults[puesto.id] = [30, 75];
        });
        setUmbralesPorPuesto(defaults);
      }
    });
  }, []);

  const manejarCambio = (id, valores) => {
    setUmbralesPorPuesto((prev) => ({
      ...prev,
      [id]: valores,
    }));
  };

  const guardarConfiguracion = () => {
    localStorage.setItem('umbralesPorPuesto', JSON.stringify(umbralesPorPuesto));
    alert('Configuraciones guardadas correctamente');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Configuración de rendimiento por puesto</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Puesto</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Descripción</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Rango de desempeño</th>
          </tr>
        </thead>
        <tbody>
          {puestos.map((puesto) => (
            <tr key={puesto.id}>
              <td style={{ padding: '0.5rem' }}>{puesto.nombre}</td>
              <td style={{ padding: '0.5rem' }}>{puesto.descripcion}</td>
              <td style={{ padding: '0.5rem', width: '400px' }}>
                <Slider
                  range
                  min={0}
                  max={100}
                  value={umbralesPorPuesto[puesto.id] || [30, 75]}
                  onChange={(valores) => manejarCambio(puesto.id, valores)}
                  marks={{
                    0: '0%',
                    100: '100%',
                  }}
                  trackStyle={[{ backgroundColor: 'red' }, { backgroundColor: 'orange' }]}
                  handleStyle={[{ borderColor: 'red' }, { borderColor: 'orange' }]}
                  railStyle={{ backgroundColor: 'green' }}
                />
                <div style={{ marginTop: '0.5rem' }}>
                  <strong>Rojo:</strong> &lt; {umbralesPorPuesto[puesto.id]?.[0]}% &nbsp; |&nbsp;
                  <strong>Amarillo:</strong> {umbralesPorPuesto[puesto.id]?.[0]}% - {umbralesPorPuesto[puesto.id]?.[1]}% &nbsp; |&nbsp;
                  <strong>Verde:</strong> &gt; {umbralesPorPuesto[puesto.id]?.[1]}%
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={guardarConfiguracion}
        style={{
          marginTop: '2rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Guardar configuración
      </button>
    </div>
  );
};

export default ConfiguracionPorPuesto;
