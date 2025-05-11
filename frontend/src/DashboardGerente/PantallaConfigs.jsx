import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const ConfiguracionDesempeno = () => {
  const [umbrales, setUmbrales] = useState([30, 75]);

useEffect(() => {
  const guardado = localStorage.getItem('umbralesDesempeno');
  if (guardado) {
    setUmbrales(JSON.parse(guardado));
  }
}, []);

const manejarCambio = (valores) => {
  setUmbrales(valores);
  localStorage.setItem('umbralesDesempeno', JSON.stringify(valores));
};


  return (
    <div style={{ width: 400, padding: '1rem' }}>
      <h2>Configurar límites de desempeño</h2>
      <Slider
        range
        min={0}
        max={100}
        value={umbrales}
        onChange={manejarCambio}
        marks={{
          0: '0%',
          [umbrales[0]]: `${umbrales[0]}%`,
          [umbrales[1]]: `${umbrales[1]}%`,
          100: '100%',
        }}
        trackStyle={[{ backgroundColor: 'red' }, { backgroundColor: 'orange' }]}
        handleStyle={[{ borderColor: 'red' }, { borderColor: 'orange' }]}
        railStyle={{ backgroundColor: 'green' }}
      />
      <p style={{ marginTop: '1rem' }}>
        <strong>Rojo:</strong> debajo de {umbrales[0]}% <br />
        <strong>Amarillo:</strong> entre {umbrales[0]}% y {umbrales[1]}% <br />
        <strong>Verde:</strong> arriba de {umbrales[1]}%
      </p>
    </div>
  );
};

export default ConfiguracionDesempeno;
