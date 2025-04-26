import React from "react";
import Slider from "react-slick";
import Navbar from "../../components/Navbar"; // Importa el componente Navbar
import styles from "./Inicio.module.css";

// Datos de prueba para el slider
const convocatorias = [
  {
    id: 1,
    tags: ["⚡ Postulación rápida", "Nuevo"],
    title: "Programador",
    company: "Confidencial",
    desc: "Nuestra Organización se encuentra en la búsqueda de un Programador para formar parte de la Gerencia de Sistemas, nos orientamos a graduado o estudiante avanzados en carreras de sistemas",
    location: "Capital Federal, Buenos Aires",
    modality: "Remoto",
    time: "Publicado hace 1 hora",
  },
  {
    id: 2,
    tags: ["⚡ Postulación rápida"],
    title: "Soporte Técnico Sistemas IT",
    company: "Confidencial",
    desc: "Atender las necesidades de la empresa en cuanto a hardware e instalación de software de base.",
    location: "Capital Federal, Buenos Aires",
    modality: "Híbrido",
    time: "Actualizado hace 2h",
  },
];

export default function Inicio() {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    adaptiveHeight: true,
    autoplay: true,
    autoplaySpeed: 8000,
  };

  return (
    <div className={styles.page}>
      {/* HERO */}
      <header className={styles.hero}>
        <Navbar /> {/* Usa el componente Navbar */}
        <div className={styles.heroText}>
          <h1>Una nueva forma de conectar talento y empresas</h1>
          <p>
            IA + datos + usabilidad: tu próximo desafío laboral o el candidato
            ideal, todo en uno.
          </p>
        </div>
      </header>

      {/* VISIÓN & OBJETIVO */}
      <section className={styles.visionSection} id="vision">
        <div className={styles.visionContent}>
          <h2>🌟 Nuestra Visión</h2>
          <p>
            Ofrecer un Sistema Integral de Gestión de Recursos Humanos con
            Capacidades Predictivas que automatice el reclutamiento, potencie el
            desarrollo del personal y facilite la toma de decisiones.
          </p>
          <h3>🎯 Objetivo</h3>
          <p>
            Diseñar una plataforma que evalúe CVs automáticamente, prediga el
            rendimiento futuro mediante ML, detecte patrones anómalos y entregue
            reportes y dashboards para una gestión estratégica.
          </p>
        </div>
      </section>

      {/* SLIDER DE CONVOCATORIAS */}
      <section className={styles.sectionAlt} id="convocatorias">
        <h2>📢 Convocatorias Activas</h2>
        <Slider {...sliderSettings} className={styles.slider}>
          {convocatorias.map((job) => (
            <div key={job.id} className={styles.card}>
              <div className={styles.tagsRow}>
                {job.tags.map((tag, i) => (
                  <span
                    key={i}
                    className={`${styles.tag} ${
                      tag === "Nuevo" ? styles.tagNuevo : ""
                    }`}
                  >
                    {tag}
                  </span>
                ))}
                <span className={styles.tagTime}>{job.time}</span>
              </div>
              <h3 className={styles.cardTitle}>{job.title}</h3>
              <div className={styles.cardCompany}>{job.company}</div>
              <p className={styles.cardDesc}>{job.desc}</p>
              <div className={styles.meta}>
                <span>📍 {job.location}</span>
                <span>🏢 {job.modality}</span>
              </div>
            </div>
          ))}
        </Slider>
      </section>
    </div>
  );
}