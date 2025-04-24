import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import styles from './Inicio.module.css';

// Datos de prueba para el slider
const convocatorias = [
  {
    id: 1,
    tags: ['⚡ Postulación rápida', 'Nuevo'],
    title: 'Programador',
    company: 'Confidencial',
    desc: 'Nuestra Organización se encuentra en la búsqueda de un Programador para formar parte de la Gerencia de Sistemas, nos orientamos a graduado o estudiante avanzados en carreras de sistemas',
    location: 'Capital Federal, Buenos Aires',
    modality: 'Remoto',
    time: 'Publicado hace 1 hora'
  },
  {
    id: 2,
    tags: [ '⚡ Postulación rápida'],
    title: 'Soporte Técnico Sistemas IT',
    company: 'Confidencial',
    desc: 'Atender las necesidades de la empresa en cuanto a hardware e instalación de software de base.',
    location: 'Capital Federal, Buenos Aires',
    modality: 'Híbrido',
    time: 'Actualizado hace 2h'
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
        <nav className={styles.navbar}>
          <div className={styles.logo}>H.R.Learning</div>
          <div className={styles.navButtons}>
            <Link to="/login/candidato" className={styles.navBtn}>
              {/* SVG icon */}
              <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#fff" d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/></svg>
              Candidatos
            </Link>
            <Link to="/login/reclutador" className={styles.navBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#fff" d="M3 13h2v-2H3v2zm4 0h14v-2H7v2zm0 4h14v-2H7v2zm-4 0h2v-2H3v2z"/></svg>
              Reclutador
            </Link>
          </div>
        </nav>
        <div className={styles.heroText}>
          <h1>Una nueva forma de conectar talento y empresas</h1>
          <p>IA + datos + usabilidad: tu próximo desafío laboral o el candidato ideal, todo en uno.</p>
        </div>
      </header>

      {/* VISIÓN & OBJETIVO */}
      <section className={styles.visionSection} id="vision">
        <div className={styles.visionContent}>
          <h2>🌟 Nuestra Visión</h2>
          <p>
            Ofrecer un Sistema Integral de Gestión de Recursos Humanos con Capacidades Predictivas que automatice el reclutamiento, potencie el desarrollo del personal y facilite la toma de decisiones. 
          </p>
          <h3>🎯 Objetivo</h3>
          <p>
            Diseñar una plataforma que evalúe CVs automáticamente, prediga el rendimiento futuro mediante ML, detecte patrones anómalos y entregue reportes y dashboards para una gestión estratégica.
          </p>
        </div>
      </section>


      {/* SLIDER DE CONVOCATORIAS */}
      <section className={styles.sectionAlt} id="convocatorias">
        <h2>📢 Convocatorias Activas</h2>
        <Slider {...sliderSettings} className={styles.slider}>
          {convocatorias.map(job => (
            <div key={job.id} className={styles.card}>
              <div className={styles.tagsRow}>
                {job.tags.map((tag, i) => (
                  <span
                    key={i}
                    className={`${styles.tag} ${tag === 'Nuevo' ? styles.tagNuevo : ''}`}
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
