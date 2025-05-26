import React, { useState } from "react";
import { Box, Typography, Slider, Button } from "@mui/material";
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

function SatisfactionSlider({ label, value, setValue }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>{label}</Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <SentimentVeryDissatisfiedIcon color="error" />
        <Slider
          value={value}
          min={1}
          max={100}
          step={1}
          onChange={(_, newValue) => setValue(newValue)}
          sx={{ flex: 1 }}
        />
        <SentimentVerySatisfiedIcon color="success" />
      </Box>
      <Typography align="center" sx={{ mt: 1 }}>{value}</Typography>
    </Box>
  );
}

export function EncuestaSatisfaccionEmpleado() {
  const [satisfaccionPuesto, setSatisfaccionPuesto] = useState(50);
  const [satisfaccionAmbiente, setSatisfaccionAmbiente] = useState(50);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = () => {
    // Aquí puedes enviar los datos al backend si lo deseas
    setEnviado(true);
  };

  if (enviado) {
    return <Typography variant="h6" align="center" color="success.main">¡Gracias por tu respuesta!</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 6, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "#fff" }}>
      <Typography variant="h5" align="center" gutterBottom>
        Encuesta de Satisfacción Laboral
      </Typography>
      <SatisfactionSlider
        label="¿Qué tan satisfecho estás con tu puesto?"
        value={satisfaccionPuesto}
        setValue={setSatisfaccionPuesto}
      />
      <SatisfactionSlider
        label="¿Qué tan satisfecho estás con el ambiente laboral?"
        value={satisfaccionAmbiente}
        setValue={setSatisfaccionAmbiente}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSubmit}
      >
        Enviar respuesta
      </Button>
    </Box>
  );
}