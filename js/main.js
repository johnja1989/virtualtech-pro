/**
 * VirtualTech Pro - JavaScript Principal
 * Funcionalidades interactivas y optimizaciones
 */

/**
 * SOLUCIÓN TEMPORAL: FORMULARIO CON ENVÍO DIRECTO
 * Reemplaza tu función setupFormHandling() con esta versión simplificada
 */

function setupFormHandling() {
  const form = document.getElementById("contactForm");
  if (!form) {
    console.warn("❌ Formulario no encontrado");
    return;
  }

  // Configurar formulario para envío directo
  form.action = "https://formspree.io/f/mgvzpzpj";
  form.method = "POST";

  // Agregar campos ocultos necesarios
  const hiddenFields = [
    { name: "_subject", value: "Nuevo contacto desde VirtualTech Pro" },
    { name: "_next", value: window.location.origin + "/gracias.html" }, // Página de agradecimiento
    { name: "_captcha", value: "false" },
  ];

  hiddenFields.forEach((field) => {
    let existingField = form.querySelector(`[name="${field.name}"]`);
    if (!existingField) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = field.name;
      input.value = field.value;
      form.appendChild(input);
    }
  });

  // Manejar envío del formulario
  form.addEventListener("submit", function (e) {
    console.log("📝 Enviando formulario directamente...");

    // Validar antes del envío
    if (!validateForm()) {
      e.preventDefault();
      showNotification(
        "Por favor corrige los errores en el formulario",
        "error"
      );
      return false;
    }

    // Mostrar confirmación antes del envío
    const confirmSend = confirm(
      "¿Estás seguro de enviar este mensaje?\n\n" +
        "Se abrirá una nueva ventana para confirmar el envío."
    );

    if (!confirmSend) {
      e.preventDefault();
      return false;
    }

    // Configurar envío en nueva ventana
    form.target = "_blank";

    // Mostrar mensaje de éxito
    showNotification(
      "📤 Formulario enviado!\n\nSe abrió una nueva ventana para confirmar. " +
        "Si no se abrió, revisa que no esté bloqueada por tu navegador.",
      "success",
      8000
    );

    // Limpiar formulario después de un momento
    setTimeout(() => {
      form.reset();
      showNotification(
        "Formulario limpiado y listo para otro envío",
        "info",
        3000
      );
    }, 2000);

    // Permitir el envío normal
    return true;
  });

  // Validación en tiempo real (mantener)
  const inputs = form.querySelectorAll("input, textarea, select");
  inputs.forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => clearFieldError(input));
  });

  console.log("✅ Formulario configurado para envío directo");
}

/**
 * ALTERNATIVA: BOTÓN DUAL (AJAX + DIRECTO)
 * Esta función crea dos botones: uno para AJAX y otro para envío directo
 */
function setupDualSubmissionButtons() {
  const form = document.getElementById("contactForm");
  const originalSubmitBtn = form.querySelector(".form-submit");

  if (!originalSubmitBtn) return;

  // Modificar el botón original para AJAX
  originalSubmitBtn.innerHTML = `
    <span class="submit-text">🚀 Envío AJAX</span>
    <span class="submit-loading">Enviando...</span>
  `;
  originalSubmitBtn.title =
    "Envío con JavaScript (requiere dominio autorizado)";

  // Crear botón de envío directo
  const directSubmitBtn = document.createElement("button");
  directSubmitBtn.type = "submit";
  directSubmitBtn.className = "form-submit";
  directSubmitBtn.style.marginLeft = "15px";
  directSubmitBtn.style.background =
    "linear-gradient(135deg, #10b981 0%, #059669 100%)";
  directSubmitBtn.innerHTML = `
    <span>📤 Envío Directo</span>
  `;
  directSubmitBtn.title = "Envío tradicional (siempre funciona)";

  // Insertar botón directo después del original
  originalSubmitBtn.parentNode.insertBefore(
    directSubmitBtn,
    originalSubmitBtn.nextSibling
  );

  // Manejar envío directo
  directSubmitBtn.addEventListener("click", function (e) {
    e.preventDefault();

    if (!validateForm()) {
      showNotification(
        "Por favor corrige los errores en el formulario",
        "error"
      );
      return;
    }

    // Configurar para envío directo
    form.action = "https://formspree.io/f/mgvzpzpj";
    form.method = "POST";
    form.target = "_blank";

    showNotification(
      "📤 Enviando por método directo...\nSe abrirá una nueva ventana.",
      "info",
      4000
    );

    setTimeout(() => {
      form.submit();
      form.reset();
    }, 1000);
  });

  console.log("✅ Botones duales configurados");
}

/**
 * PÁGINA DE AGRADECIMIENTO SIMPLE
 * Crea una página básica de agradecimiento para el redirect
 */
function createThankYouPage() {
  const thankYouHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mensaje Enviado - VirtualTech Pro</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 40px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 60px 40px;
            border-radius: 20px;
            text-align: center;
            max-width: 600px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .success-icon {
            font-size: 5rem;
            margin-bottom: 20px;
        }
        h1 {
            color: #2d3748;
            font-size: 2.5rem;
            margin-bottom: 20px;
        }
        p {
            color: #4a5568;
            font-size: 1.2rem;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            display: inline-block;
            transition: transform 0.3s ease;
        }
        .btn:hover {
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="success-icon">✅</div>
        <h1>¡Mensaje Enviado!</h1>
        <p>
            Gracias por contactarme. He recibido tu mensaje y te responderé 
            en menos de 24 horas con una propuesta personalizada.
        </p>
        <p>
            <strong>John Jairo Vargas González</strong><br>
            Ingeniero de Sistemas & Asistente Virtual
        </p>
        <a href="javascript:window.close()" class="btn">Cerrar Ventana</a>
    </div>
</body>
</html>
  `;

  console.log("📄 Página de agradecimiento creada");
  console.log("💡 Guarda este HTML como 'gracias.html' en tu servidor");

  return thankYouHTML;
}

/**
 * FUNCIÓN DE CONFIGURACIÓN COMPLETA
 */
function initializeFormWithDirectSubmission() {
  // Opción 1: Solo envío directo (más simple)
  setupFormHandling();

  // Opción 2: Botones duales (AJAX + Directo)
  // setupDualSubmissionButtons();

  // Crear página de agradecimiento
  createThankYouPage();

  console.log("✅ Formulario configurado con envío directo");
  console.log("💡 Para habilitar AJAX, autoriza tu dominio en Formspree");
}

// Llamar la función de inicialización
document.addEventListener(
  "DOMContentLoaded",
  initializeFormWithDirectSubmission
);

// Variables globales
let currentTestimonial = 0;
let portfolioFilter = "all";

// Configuración del proyecto
const projectDetails = {
  1: {
    title: "Sistema de Reportes Automatizados",
    description:
      "Sistema completo de automatización de reportes financieros que transformó los procesos manuales de una empresa de 50+ empleados.",
    features: [
      "Automatización completa de reportes mensuales",
      "Integración con múltiples fuentes de datos",
      "Dashboard en tiempo real",
      "Alertas automáticas por email",
      "Reducción del 95% en tiempo de generación",
    ],
    technologies: ["Python", "Excel API", "PowerBI", "SQL Server", "Azure"],
    results:
      "Ahorro de 32 horas mensuales y mejora del 99% en precisión de datos.",
    duration: "3 semanas",
    client: "Empresa de servicios financieros",
  },
  2: {
    title: "E-commerce con IA",
    description:
      "Plataforma de comercio electrónico con sistema de recomendaciones inteligentes y análisis predictivo de comportamiento del usuario.",
    features: [
      "Sistema de recomendaciones con Machine Learning",
      "Análisis predictivo de ventas",
      "Optimización automática de precios",
      "Chatbot de atención al cliente",
      "Panel de analytics avanzado",
    ],
    technologies: ["React", "Node.js", "TensorFlow", "MongoDB", "Redis"],
    results: "Aumento del 45% en ventas y 60% en conversión.",
    duration: "8 semanas",
    client: "Startup de retail online",
  },
  3: {
    title: "Optimización de Base de Datos",
    description:
      "Proyecto de optimización completa que transformó una base de datos lenta en un sistema de alto rendimiento.",
    features: [
      "Reestructuración de índices",
      "Optimización de consultas SQL",
      "Implementación de caché Redis",
      "Migración a arquitectura escalable",
      "Monitoreo de performance en tiempo real",
    ],
    technologies: ["PostgreSQL", "Redis", "AWS RDS", "CloudWatch", "Docker"],
    results: "Mejora del 70% en velocidad y reducción del 40% en costos.",
    duration: "4 semanas",
    client: "Empresa de logística",
  },
  4: {
    title: "CRM Personalizado",
    description:
      "Sistema de gestión de relaciones con clientes diseñado específicamente para las necesidades de una empresa de servicios B2B.",
    features: [
      "Gestión completa del pipeline de ventas",
      "Automatización de seguimientos",
      "Análisis predictivo de oportunidades",
      "Integración con email marketing",
      "Reportes ejecutivos automatizados",
    ],
    technologies: ["Vue.js", "Laravel", "MySQL", "Elasticsearch", "AWS"],
    results:
      "Aumento del 35% en conversión de leads y 50% más eficiencia en ventas.",
    duration: "6 semanas",
    client: "Agencia de marketing digital",
  },
  5: {
    title: "Dashboard de Analíticas",
    description:
      "Dashboard interactivo en tiempo real para monitoreo de KPIs empresariales con alertas inteligentes y visualizaciones avanzadas.",
    features: [
      "Visualizaciones interactivas en tiempo real",
      "Sistema de alertas inteligentes",
      "Análisis de tendencias automático",
      "Exportación de reportes personalizados",
      "Acceso móvil optimizado",
    ],
    technologies: ["D3.js", "WebSockets", "MongoDB", "Express.js", "Chart.js"],
    results:
      "Reducción del 80% en tiempo de análisis y mejor toma de decisiones.",
    duration: "5 semanas",
    client: "Empresa manufacturera",
  },
  6: {
    title: "Bot de Atención al Cliente",
    description:
      "Chatbot inteligente con procesamiento de lenguaje natural que maneja consultas complejas y se integra con sistemas existentes.",
    features: [
      "Procesamiento de lenguaje natural avanzado",
      "Integración con WhatsApp Business",
      "Escalamiento automático a agentes humanos",
      "Base de conocimientos dinámica",
      "Analytics de conversaciones",
    ],
    technologies: ["Python", "NLP", "WhatsApp API", "TensorFlow", "FastAPI"],
    results:
      "Resolución automática del 80% de consultas y mejora en satisfacción.",
    duration: "7 semanas",
    client: "E-commerce de tecnología",
  },
};

// Inicialización de la aplicación
function initializeApp() {
  // Ocultar loading screen
  hideLoadingScreen();

  // Inicializar componentes
  setupNavigationScrolling();
  setupScrollAnimations();
  setupProgressBar();
  setupMobileMenu();
  setupFormHandling();
  setupPortfolioFilter();
  setupTestimonialSlider();
  setupProjectModals();
  setupServiceCards();
  setupHeaderScroll();
  setupTypewriterEffect();

  // Marcar body como cargado
  document.body.classList.add("loaded");

  console.log("VirtualTech Pro inicializado correctamente");
}

// Loading Screen
function hideLoadingScreen() {
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add("fade-out");
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 500);
    }, 1000);
  }
}

// Navegación suave
function setupNavigationScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerHeight = document.querySelector("header").offsetHeight;
        const elementPosition = targetElement.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });

        // Cerrar menú móvil si está abierto
        const navLinks = document.querySelector(".nav-links");
        const mobileToggle = document.querySelector(".mobile-menu-toggle");
        if (navLinks && navLinks.classList.contains("active")) {
          navLinks.classList.remove("active");
          mobileToggle.textContent = "☰";
        }

        // Actualizar enlace activo
        updateActiveNavLink(targetId);
      }
    });
  });
}

// Actualizar enlace activo en la navegación
function updateActiveNavLink(targetId) {
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === targetId) {
      link.classList.add("active");
    }
  });
}

// Animaciones de scroll
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        // Animar números si es una estadística
        if (entry.target.classList.contains("stat-number")) {
          animateNumber(entry.target);
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll(".fade-in").forEach((el) => {
    observer.observe(el);
  });
}

// Animar números de estadísticas
function animateNumber(element) {
  const target = parseInt(element.textContent.replace(/[^\d]/g, ""));
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }

    const suffix = element.textContent.includes("%")
      ? "%"
      : element.textContent.includes("+")
      ? "+"
      : "";
    element.textContent = Math.floor(current) + suffix;
  }, 16);
}

// Barra de progreso de scroll
function setupProgressBar() {
  const progressBar = document.getElementById("progress-bar");
  if (!progressBar) {
    const bar = document.createElement("div");
    bar.id = "progress-bar";
    document.body.appendChild(bar);
  }

  window.addEventListener(
    "scroll",
    throttle(() => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.body.offsetHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      document.getElementById("progress-bar").style.width =
        Math.min(scrollPercent, 100) + "%";
    }, 10)
  );
}

// Menú móvil
function setupMobileMenu() {
  const mobileToggle = document.querySelector(".mobile-menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      mobileToggle.textContent = navLinks.classList.contains("active")
        ? "✕"
        : "☰";
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener("click", (e) => {
      if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove("active");
        mobileToggle.textContent = "☰";
      }
    });
  }
}

// Validar formulario
function validateForm() {
  const form = document.getElementById("contactForm");
  let isValid = true;

  // Validar campos requeridos
  const requiredFields = form.querySelectorAll("[required]");
  requiredFields.forEach((field) => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  return isValid;
}

// Validar campo individual
function validateField(field) {
  const value = field.value.trim();
  const fieldName = field.name;
  let isValid = true;
  let errorMessage = "";

  // Limpiar errores previos
  clearFieldError(field);

  // Validaciones específicas
  switch (fieldName) {
    case "nombre":
      if (!value) {
        errorMessage = "El nombre es requerido";
        isValid = false;
      } else if (value.length < 2) {
        errorMessage = "El nombre debe tener al menos 2 caracteres";
        isValid = false;
      }
      break;

    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        errorMessage = "El email es requerido";
        isValid = false;
      } else if (!emailRegex.test(value)) {
        errorMessage = "Ingresa un email válido";
        isValid = false;
      }
      break;

    case "telefono":
      if (value && !/^\+?[\d\s\-\(\)]{7,}$/.test(value)) {
        errorMessage = "Ingresa un teléfono válido";
        isValid = false;
      }
      break;

    case "mensaje":
      if (!value) {
        errorMessage = "El mensaje es requerido";
        isValid = false;
      } else if (value.length < 10) {
        errorMessage = "El mensaje debe tener al menos 10 caracteres";
        isValid = false;
      }
      break;
  }

  // Mostrar error si existe
  if (!isValid) {
    showFieldError(field, errorMessage);
  }

  return isValid;
}

// Mostrar error en campo
function showFieldError(field, message) {
  field.style.borderColor = "#e74c3c";
  const errorElement = document.getElementById(field.name + "-error");
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }
}

// Limpiar error de campo
function clearFieldError(field) {
  field.style.borderColor = "#e1e5e9";
  const errorElement = document.getElementById(field.name + "-error");
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.style.display = "none";
  }
}

// Filtro de portafolio
function setupPortfolioFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      // Actualizar botones activos
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Filtrar items
      portfolioItems.forEach((item) => {
        const category = item.dataset.category;
        const shouldShow = filter === "all" || category === filter;

        item.style.display = shouldShow ? "block" : "none";

        if (shouldShow) {
          setTimeout(() => {
            item.classList.add("visible");
          }, 100);
        }
      });

      portfolioFilter = filter;
    });
  });
}

// Slider de testimonios
function setupTestimonialSlider() {
  const testimonials = document.querySelectorAll(".testimonial");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".testimonial-prev");
  const nextBtn = document.querySelector(".testimonial-next");

  if (testimonials.length === 0) return;

  function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
      testimonial.classList.toggle("active", i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });

    currentTestimonial = index;
  }

  function nextTestimonial() {
    const next = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(next);
  }

  function prevTestimonial() {
    const prev =
      (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    showTestimonial(prev);
  }

  // Event listeners
  if (nextBtn) nextBtn.addEventListener("click", nextTestimonial);
  if (prevBtn) prevBtn.addEventListener("click", prevTestimonial);

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => showTestimonial(index));
  });

  // Auto-play
  setInterval(nextTestimonial, 5000);
}

// Modales de proyectos
function setupProjectModals() {
  const modal = document.getElementById("projectModal");
  const modalBody = document.getElementById("modalBody");
  const closeBtn = document.querySelector(".modal-close");
  const viewBtns = document.querySelectorAll(".view-project");

  if (!modal) return;

  viewBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const projectId = btn.dataset.project;
      showProjectModal(projectId);
    });
  });

  closeBtn?.addEventListener("click", hideProjectModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      hideProjectModal();
    }
  });

  // Cerrar con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "block") {
      hideProjectModal();
    }
  });

  function showProjectModal(projectId) {
    const project = projectDetails[projectId];
    if (!project) return;

    modalBody.innerHTML = createProjectModalContent(project);
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }

  function hideProjectModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

// Crear contenido del modal de proyecto
function createProjectModalContent(project) {
  return `
        <h2>${project.title}</h2>
        <p class="project-description">${project.description}</p>
        
        <div class="project-details">
            <div class="project-info">
                <h3>🎯 Características Principales</h3>
                <ul>
                    ${project.features
                      .map((feature) => `<li>${feature}</li>`)
                      .join("")}
                </ul>
                
                <h3>🛠️ Tecnologías Utilizadas</h3>
                <div class="modal-tech-tags">
                    ${project.technologies
                      .map((tech) => `<span class="tech-tag">${tech}</span>`)
                      .join("")}
                </div>
                
                <h3>📈 Resultados Obtenidos</h3>
                <p class="project-results">${project.results}</p>
                
                <div class="project-meta">
                    <p><strong>⏱️ Duración:</strong> ${project.duration}</p>
                    <p><strong>👥 Cliente:</strong> ${project.client}</p>
                </div>
            </div>
        </div>
        
        <div class="modal-actions">
            <button class="cta-button primary" onclick="document.querySelector('#contacto').scrollIntoView({behavior: 'smooth'}); document.getElementById('projectModal').style.display='none'; document.body.style.overflow='auto';">
                Solicitar Proyecto Similar
            </button>
        </div>
        
        <style>
            .project-description {
                font-size: 1.1rem;
                margin-bottom: 2rem;
                color: var(--text-secondary);
                line-height: 1.6;
            }
            
            .project-details h3 {
                color: var(--text-primary);
                margin: 1.5rem 0 1rem;
                font-size: 1.2rem;
            }
            
            .project-details ul {
                margin-bottom: 1rem;
                padding-left: 1rem;
            }
            
            .project-details li {
                margin-bottom: 0.5rem;
                color: var(--text-secondary);
            }
            
            .modal-tech-tags {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
                margin-bottom: 1rem;
            }
            
            .modal-tech-tags .tech-tag {
                background: var(--primary-gradient);
                color: white;
                padding: 6px 12px;
                border-radius: 15px;
                font-size: 0.9rem;
            }
            
            .project-results {
                background: var(--bg-light);
                padding: 1rem;
                border-radius: 8px;
                font-weight: 500;
                color: var(--text-primary);
                border-left: 4px solid;
                border-image: var(--accent-gradient) 1;
            }
            
            .project-meta {
                margin-top: 1.5rem;
                padding-top: 1rem;
                border-top: 1px solid var(--bg-light);
            }
            
            .project-meta p {
                margin-bottom: 0.5rem;
                color: var(--text-secondary);
            }
            
            .modal-actions {
                margin-top: 2rem;
                text-align: center;
            }
        </style>
    `;
}

// Efectos de tarjetas de servicios
function setupServiceCards() {
  const serviceCards = document.querySelectorAll(".service-card");

  serviceCards.forEach((card) => {
    const originalBg = card.style.background;
    const originalColor = card.style.color;

    card.addEventListener("mouseenter", () => {
      if (!card.classList.contains("hovered")) {
        card.classList.add("hovered");
      }
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("hovered");
    });
  });

  // Botones "Saber más"
  const learnMoreBtns = document.querySelectorAll(".learn-more-btn");
  learnMoreBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const service = btn.dataset.service;
      showServiceInfo(service);
    });
  });
}

// Mostrar información del servicio
function showServiceInfo(service) {
  const serviceInfo = {
    automatizacion:
      "Especializado en crear scripts de Python, workflows de automatización y integraciones que eliminan tareas repetitivas y aumentan la productividad hasta 300%.",
    soporte:
      "Soporte técnico avanzado con experiencia en múltiples tecnologías, resolución de problemas complejos y optimización de sistemas existentes.",
    analisis:
      "Transformo datos en insights accionables usando herramientas como PowerBI, Python y SQL, creando dashboards que impulsan la toma de decisiones.",
    desarrollo:
      "Desarrollo aplicaciones web modernas y escalables usando las últimas tecnologías como React, Vue.js, Node.js y arquitecturas en la nube.",
    consultoria:
      "Consultoría estratégica en transformación digital, ayudando a empresas a identificar oportunidades de automatización y optimización.",
    optimizacion:
      "Especialista en optimización de bases de datos, mejora de performance web y arquitecturas escalables que crecen con tu negocio.",
  };

  const message =
    serviceInfo[service] ||
    "Servicio especializado con enfoque en resultados medibles y ROI comprobado.";
  showNotification(message, "info", 5000);
}

// Header scroll effect
function setupHeaderScroll() {
  const header = document.querySelector("header");
  let lastScrollY = 0;

  window.addEventListener(
    "scroll",
    throttle(() => {
      const scrollY = window.scrollY;

      if (scrollY > 100) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }

      // Ocultar/mostrar header al hacer scroll
      if (scrollY > lastScrollY && scrollY > 200) {
        header.style.transform = "translateY(-100%)";
      } else {
        header.style.transform = "translateY(0)";
      }

      lastScrollY = scrollY;
    }, 10)
  );
}

// Efecto typewriter
function setupTypewriterEffect() {
  const typewriterElement = document.querySelector(".typewriter");
  if (!typewriterElement) return;

  const text = typewriterElement.textContent;
  typewriterElement.textContent = "";
  typewriterElement.style.borderRight = "2px solid white";

  let index = 0;
  const speed = 100;

  function typeCharacter() {
    if (index < text.length) {
      typewriterElement.textContent += text.charAt(index);
      index++;
      setTimeout(typeCharacter, speed);
    } else {
      // Efecto de parpadeo del cursor
      setTimeout(() => {
        typewriterElement.style.borderRight = "none";
      }, 1000);
    }
  }

  // Iniciar el efecto después de un delay
  setTimeout(typeCharacter, 1500);
}

// Sistema de notificaciones
function showNotification(message, type = "info", duration = 4000) {
  // Crear contenedor de notificaciones si no existe
  let container = document.getElementById("notification-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "notification-container";
    container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        `;
    document.body.appendChild(container);
  }

  // Crear notificación
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;

  const colors = {
    success: "#10b981",
    error: "#ef4444",
    info: "#3b82f6",
    warning: "#f59e0b",
  };

  const icons = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
    warning: "⚠️",
  };

  notification.innerHTML = `
        <div style="
            background: white;
            border-left: 4px solid ${colors[type]};
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            transform: translateX(100%);
            transition: all 0.3s ease;
        ">
            <span style="font-size: 1.2rem;">${icons[type]}</span>
            <span style="flex: 1; color: #374151; line-height: 1.4;">${message}</span>
            <button onclick="this.closest('.notification').remove()" style="
                background: none;
                border: none;
                color: #9ca3af;
                cursor: pointer;
                font-size: 1.2rem;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            ">×</button>
        </div>
    `;

  container.appendChild(notification);

  // Animar entrada
  setTimeout(() => {
    notification.firstElementChild.style.transform = "translateX(0)";
  }, 100);

  // Auto-remover
  setTimeout(() => {
    if (notification.parentNode) {
      notification.firstElementChild.style.transform = "translateX(100%)";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }
  }, duration);
}

// Utilidad throttle para optimizar eventos de scroll
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Utilidad debounce para optimizar eventos de input
function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Detección de intersección mejorada
function setupIntersectionObserver() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = "#" + entry.target.id;

          // Actualizar navegación activa
          navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === id) {
              link.classList.add("active");
            }
          });
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: "-100px 0px -100px 0px",
    }
  );

  sections.forEach((section) => observer.observe(section));
}

// Optimización de imágenes lazy loading
function setupLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove("lazy");
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }
}

// Manejo de errores globales
function setupErrorHandling() {
  window.addEventListener("error", (e) => {
    console.error("Error capturado:", e.error);
    // Aquí podrías enviar errores a un servicio de monitoreo
  });

  window.addEventListener("unhandledrejection", (e) => {
    console.error("Promise rechazada:", e.reason);
    e.preventDefault();
  });
}

// Analytics y tracking
function setupAnalytics() {
  // Configurar eventos de Google Analytics si está disponible
  if (typeof gtag !== "undefined") {
    // Tracking de clics en CTA
    document.querySelectorAll(".cta-button").forEach((button) => {
      button.addEventListener("click", () => {
        gtag("event", "click", {
          event_category: "CTA",
          event_label: button.textContent.trim(),
          value: 1,
        });
      });
    });

    // Tracking de envío de formulario
    document.getElementById("contactForm")?.addEventListener("submit", () => {
      gtag("event", "form_submit", {
        event_category: "Contact",
        event_label: "Contact Form",
        value: 1,
      });
    });

    // Tracking de tiempo en página
    let startTime = Date.now();
    window.addEventListener("beforeunload", () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      gtag("event", "timing_complete", {
        name: "page_view_time",
        value: timeSpent,
      });
    });
  }
}

// PWA Service Worker
function setupServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registrado:", registration.scope);
        })
        .catch((registrationError) => {
          console.log("SW registro falló:", registrationError);
        });
    });
  }
}

// Optimización de performance
function setupPerformanceOptimizations() {
  // Preload de recursos críticos
  const preloadLinks = [
    { href: "./css/style.css", as: "style" },
    { href: "./js/main.js", as: "script" },
  ];

  preloadLinks.forEach((link) => {
    const linkEl = document.createElement("link");
    linkEl.rel = "preload";
    linkEl.href = link.href;
    linkEl.as = link.as;
    document.head.appendChild(linkEl);
  });

  // Prefetch de páginas importantes
  const prefetchUrls = ["./images/portfolio/", "./assets/documents/"];

  prefetchUrls.forEach((url) => {
    const linkEl = document.createElement("link");
    linkEl.rel = "prefetch";
    linkEl.href = url;
    document.head.appendChild(linkEl);
  });
}

// Dark mode toggle
function setupDarkMode() {
  const darkModeToggle = document.createElement("button");
  darkModeToggle.innerHTML = "🌙";
  darkModeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        background: var(--primary-gradient);
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;

  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    darkModeToggle.innerHTML = isDark ? "☀️" : "🌙";
    localStorage.setItem("darkMode", isDark);
  });

  // Restaurar preferencia guardada
  const savedMode = localStorage.getItem("darkMode");
  if (savedMode === "true") {
    document.body.classList.add("dark-mode");
    darkModeToggle.innerHTML = "☀️";
  }

  document.body.appendChild(darkModeToggle);
}

// Keyboard navigation
function setupKeyboardNavigation() {
  let focusableElements = [];

  function updateFocusableElements() {
    focusableElements = Array.from(
      document.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.disabled && !el.hidden);
  }

  document.addEventListener("keydown", (e) => {
    updateFocusableElements();

    if (e.key === "Tab") {
      const currentIndex = focusableElements.indexOf(document.activeElement);
      let nextIndex;

      if (e.shiftKey) {
        nextIndex =
          currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
      } else {
        nextIndex =
          currentIndex >= focusableElements.length - 1 ? 0 : currentIndex + 1;
      }

      if (focusableElements[nextIndex]) {
        e.preventDefault();
        focusableElements[nextIndex].focus();
      }
    }

    // Atajos de teclado
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "k":
          e.preventDefault();
          document
            .querySelector("#contacto")
            .scrollIntoView({ behavior: "smooth" });
          break;
        case "/":
          e.preventDefault();
          document
            .querySelector("#servicios")
            .scrollIntoView({ behavior: "smooth" });
          break;
      }
    }
  });
}

// Inicialización completa mejorada
function initializeApp() {
  try {
    // Core functionality
    hideLoadingScreen();
    setupNavigationScrolling();
    setupScrollAnimations();
    setupProgressBar();
    setupMobileMenu();
    setupFormHandling();
    setupPortfolioFilter();
    setupTestimonialSlider();
    setupProjectModals();
    setupServiceCards();
    setupHeaderScroll();
    setupTypewriterEffect();

    // Enhanced features
    setupIntersectionObserver();
    setupLazyLoading();
    setupErrorHandling();
    setupAnalytics();
    setupPerformanceOptimizations();
    setupKeyboardNavigation();

    // Optional features
    if (window.location.protocol === "https:") {
      setupServiceWorker();
    }

    // Mark as loaded
    document.body.classList.add("loaded");

    // Performance timing
    if ("performance" in window) {
      window.addEventListener("load", () => {
        const loadTime =
          performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Página cargada en ${loadTime}ms`);

        // Enviar métricas si analytics está disponible
        if (typeof gtag !== "undefined") {
          gtag("event", "timing_complete", {
            name: "load_time",
            value: loadTime,
          });
        }
      });
    }

    console.log("✅ VirtualTech Pro inicializado correctamente");
  } catch (error) {
    console.error("❌ Error inicializando la aplicación:", error);
    showNotification(
      "Error al cargar la aplicación. Por favor recarga la página.",
      "error"
    );
  }
}

// Funciones de utilidad adicionales
const Utils = {
  // Formatear números
  formatNumber: (num) => {
    return new Intl.NumberFormat("es-CO").format(num);
  },

  // Formatear moneda
  formatCurrency: (amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  },

  // Validar email
  isValidEmail: (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  // Truncar texto
  truncateText: (text, maxLength) => {
    return text.length > maxLength ? text.substr(0, maxLength) + "..." : text;
  },

  // Scroll suave a elemento
  scrollToElement: (selector, offset = 0) => {
    const element = document.querySelector(selector);
    if (element) {
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  },

  // Copiar al portapapeles
  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification("Copiado al portapapeles", "success", 2000);
    } catch (err) {
      console.error("Error al copiar:", err);
      showNotification("Error al copiar", "error", 2000);
    }
  },
};

// Exportar funciones para uso global
window.VirtualTechPro = {
  showNotification,
  scrollToElement: Utils.scrollToElement,
  copyToClipboard: Utils.copyToClipboard,
  formatCurrency: Utils.formatCurrency,
};

// Auto-inicialización cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}
