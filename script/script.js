// ===== Menú móvil =====
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    navToggle.classList.toggle('open');
  });

  // Cerrar el menú al tocar cualquier link de adentro
  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
    });
  });
}

// ===== Chips seleccionables (tipo de consulta / formato de reunión) =====
document.querySelectorAll('.chip-grid').forEach((group) => {
  group.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    group.querySelectorAll('.chip').forEach((c) => c.classList.remove('selected'));
    chip.classList.add('selected');
  });
});

// ===== Formulario de reunión → envío por WhatsApp =====
const reunionForm = document.getElementById('reunionForm');
const formStatus = document.getElementById('formStatus');

const WHATSAPP_NUMERO = '573107861723';

if (reunionForm) {
  reunionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!document.getElementById('fechaHoraInput').value) {
      formStatus.textContent = 'Por favor seleccioná una fecha y un horario antes de enviar.';
      return;
    }

    const datos = new FormData(reunionForm);
    const nombre = datos.get('nombre') || '';
    const empresa = datos.get('empresa') || '';
    const cargo = datos.get('cargo') || '';
    const email = datos.get('email') || '';
    const telefono = datos.get('telefono') || '';
    const mensaje = datos.get('mensaje') || '';
    const fechaHora = datos.get('fecha_hora') || '';

    const tipoConsulta = document.querySelector('[data-group="tipo"] .chip.selected')?.textContent.trim() || 'No especificado';
    const formato = document.querySelector('[data-group="formato"] .chip.selected')?.textContent.trim() || 'No especificado';

    const texto =
`Hola, quisiera agendar una reunión:

*Nombre:* ${nombre}
*Empresa:* ${empresa}
*Cargo:* ${cargo}
*Email:* ${email}
*Teléfono:* ${telefono}
*Tipo de consulta:* ${tipoConsulta}
*Formato de reunión:* ${formato}
*Fecha y hora:* ${fechaHora}

*Descripción:*
${mensaje}`;

    const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');

    formStatus.textContent = 'Te redirigimos a WhatsApp para confirmar el envío de tu solicitud.';
    reunionForm.reset();
    document.querySelectorAll('.chip.selected').forEach((c) => c.classList.remove('selected'));
    if (window.resetReunionCalendar) window.resetReunionCalendar();
  });
}

// ===== Newsletter =====
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    input.value = '';
    input.placeholder = '¡Gracias por suscribirse!';
  });
}


      

      

// ===== Calendario de fecha y hora =====
const calendarEl = document.getElementById('calendar');

if (calendarEl) {
  const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const HORARIOS = ['8:30 a. m.','9:30 a. m.','10:30 a. m.','2:00 p. m.','3:00 p. m.','4:00 p. m.','5:00 p. m.','6:00 p. m.'];

  const monthLabel = document.getElementById('calMonthLabel');
  const daysGrid = document.getElementById('calDays');
  const prevBtn = document.getElementById('calPrev');
  const nextBtn = document.getElementById('calNext');
  const slotsGrid = document.getElementById('slotsGrid');
  const slotsLabel = document.getElementById('timeSlotsLabel');
  const fechaHoraInput = document.getElementById('fechaHoraInput');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();
  let selectedDate = null;
  let selectedSlot = null;

  function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  function isSameDay(a, b) {
    return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function updateHiddenInput() {
    if (selectedDate && selectedSlot) {
      const fechaTexto = selectedDate.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
      fechaHoraInput.value = '${fechaTexto}; ${selectedSlot}';
    } else {
      fechaHoraInput.value = '';
    }
  }

  function renderSlots() {
    slotsGrid.innerHTML = '';
    if (!selectedDate) {
      slotsLabel.textContent = 'Elija primero una fecha disponible.';
      return;
    }
    const fechaTexto = selectedDate.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
    slotsLabel.textContent = 'Horarios disponibles para el ${fechaTexto}:';

    HORARIOS.forEach((hora) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'slot-btn';
      btn.textContent = hora;
      if (hora === selectedSlot) btn.classList.add('selected');
      btn.addEventListener('click', () => {
        selectedSlot = hora;
        slotsGrid.querySelectorAll('.slot-btn').forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
        updateHiddenInput();
      });
      slotsGrid.appendChild(btn);
    });
  }

  function renderCalendar() {
    monthLabel.textContent = `${MESES[viewMonth]} ${viewYear}`;
    prevBtn.disabled = viewYear === today.getFullYear() && viewMonth === today.getMonth();

    daysGrid.innerHTML = '';

    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const leadingEmpty = (firstOfMonth.getDay() + 6) % 7;
    const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();

    for (let i = 0; i < leadingEmpty; i++) {
      const empty = document.createElement('span');
      empty.className = 'cal-day empty';
      daysGrid.appendChild(empty);
    }

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(viewYear, viewMonth, day);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cal-day';
      btn.textContent = day;

      const isPast = date < today;
      const disabled = isPast || isWeekend(date);
      btn.disabled = disabled;

      if (isSameDay(date, today)) btn.classList.add('today');
      if (isSameDay(date, selectedDate)) btn.classList.add('selected');

      if (!disabled) {
        btn.addEventListener('click', () => {
          selectedDate = date;
          selectedSlot = null;
          renderCalendar();
          renderSlots();
          updateHiddenInput();
        });
      }

      daysGrid.appendChild(btn);
    }
  }

  prevBtn.addEventListener('click', () => {
    viewMonth -= 1;
    if (viewMonth < 0) { viewMonth = 11; viewYear -= 1; }
    renderCalendar();
  });

  nextBtn.addEventListener('click', () => {
    viewMonth += 1;
    if (viewMonth > 11) { viewMonth = 0; viewYear += 1; }
    renderCalendar();
  });

  function resetCalendar() {
    selectedDate = null;
    selectedSlot = null;
    viewYear = today.getFullYear();
    viewMonth = today.getMonth();
    renderCalendar();
    renderSlots();
    updateHiddenInput();
  }

  renderCalendar();
  renderSlots();

  window.resetReunionCalendar = resetCalendar;
}

// ===== Registro del Service Worker (para funcionamiento offline / PWA) =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .catch((err) => console.error('Error registrando service worker:', err));
  });
}

// ===== Modal de perfil de abogado =====
const ABOGADOS = {
  david: {
    nombre: 'David Sebastián Ortiz Rodríguez',
    rol: 'Abogado Especialista en Derecho Laboral, Seguridad Social y Derecho Empresarial',
    foto: 'fotos/foto01.jpg',
    especialidad: 'Especialista en Derecho Laboral y de la Seguridad Social, así como en Derecho Empresarial y de los Negocios, de la misma casa universitaria',
    bio: 'Con mención académica en profundización en Derecho Constitucional y Derechos Humanos. Ha desarrollado su trayectoria en destacadas firmas de abogados, donde ha liderado y acompañado procesos complejos en materia laboral, disciplinaria y de seguridad social. Asimismo, ha asesorado jurídicamente a empresas de diversos sectores transporte, retail, grandes superficies y agroindustrial brindando soluciones integrales y adaptadas a las particularidades operativas de cada industria.', 
    detalles: [
      'Universidad: Universidad del Rosario',
      'Experiencia:  Cuenta con amplia experiencia en consultoría jurídica preventiva y curativa, negociación colectiva, estructuración de políticas internas, dirección de procesos disciplinarios y representación judicial en litigios estratégicos.',
    ]
  },
  helen: {
  nombre:'Helen Valentina Ortiz Barahona',
  rol:'Abogada',
  foto:'fotos/foto02.jpg',
  especialidad:'',
  bio:'Ha desarrollado su experiencia profesional en áreas jurídicas de compañías y firmas especializadas, fortaleciendo sus competencias en Derecho Laboral, Seguridad Social y acompañamiento a procesos de Gestión Humana. Actualmente se encuentra vinculada a MORENO ORTIZ ABOGADOS ASOCIADOS S.A.S., apoyando la atención jurídica y administrativa de los asuntos laborales de los clientes de la firma.',
  detalles:[
    'Universidad: Universidad Católica de Colombia, donde obtuvo grado de honor por alcanzar el mejor promedio académico de su promoción y fue eximida de la totalidad de los exámenes preparatorios por su destacado desempeño académico',
    'Experiencia: Derecho Laboral, asesoría jurídica empresarial, procesos disciplinarios, elaboración de documentos laborales, terminaciones contractuales, derechos de petición y acciones de tutela.',
  ]
},
  santiago: {
    nombre: 'Santiago Velasco Vergara',
    rol: 'Abogado especializado en Derecho Laboral y Pensional',
    foto: 'fotos/foto03.jpg',
    especialidad: 'Diplomados en Derecho Laboral y Seguridad Social, Fundamentos de Derecho Administrativo, Administración Inmobiliaria y Litigio Estratégico.',
    bio: 'Amplia trayectoria desempeñándose en reconocidas firmas de abogados y como asesor externo en materia laboral, seguridad social, derecho civil e inmobiliario. Ha representado judicialmente a empresas y organizaciones en procesos ordinarios laborales, litigios civiles e inmobiliarios, así como en controversias relacionadas con el Sistema General de Seguridad Social en Salud y Pensiones.',
    detalles: [
      'Universidad: Universidad Autónoma de Colombia',
      'Experiencia: más de ocho (8) años como asesor jurídico en el sector privado, desempeñándose en reconocidas firmas de abogados y como asesor externo en materia laboral, seguridad social, derecho civil e inmobiliario. Ha representado judicialmente a empresas y organizaciones en procesos ordinarios laborales, litigios civiles e inmobiliarios, así como en controversias relacionadas con el Sistema General de Seguridad Social en Salud y Pensiones.',
    ]
  },
  tania: {
    nombre: 'Tania Lucía Matos Drago',
    rol: 'Abogada Asociada',
    foto: 'fotos/foto04.jpg',
    especialidad: 'Especialista en Gestión de Proyectos para el Desarrollo y Magíster en Gerencia para el Desarrollo',
    bio: 'Su ejercicio profesional se enfoca en la dirección estratégica de áreas de Gestión Humana, el fortalecimiento de las estructuras organizacionales y el acompañamiento a empresas en procesos de reestructuración empresarial. Su práctica profesional se caracteriza por integrar la gestión del talento humano con los objetivos estratégicos de las organizaciones, promoviendo la eficiencia operativa, el fortalecimiento institucional y la sostenibilidad empresarial.',
    detalles: [
      'Universidad: Egresada de la Universidad del Rosario. Especialista en Gestión de Proyectos para el Desarrollo y magíster en Gerencia para el Desarrollo, ambos títulos de posgrado obtenidos en la Universidad Externado de Colombia.',
      'Experiencia: Dirección y coordinación de procesos de Gestión Humana, administración del talento humano, diseño e implementación de estrategias organizacionales y acompañamiento en procesos de transformación y reestructuración empresarial.',
    ]
  }
};

const perfilModal = document.getElementById('perfilModal');

if (perfilModal) {
  const perfilFoto = document.getElementById('perfilFoto');
  const perfilNombre = document.getElementById('perfilNombre');
  const perfilRol = document.getElementById('perfilRol');
  const perfilEspecialidad = document.getElementById('perfilEspecialidad');
  const perfilBio = document.getElementById('perfilBio');
  const perfilDetalles = document.getElementById('perfilDetalles');
  const perfilClose = document.getElementById('perfilClose');

  function abrirPerfil(id) {
    const datos = ABOGADOS[id];
    if (!datos) return;
perfilFoto.style.backgroundImage = `url('${datos.foto}')`;
    perfilNombre.textContent = datos.nombre;
    perfilRol.textContent = datos.rol;
    perfilEspecialidad.textContent = datos.especialidad;
    perfilBio.textContent = datos.bio;

    perfilDetalles.innerHTML = '';
    datos.detalles.forEach((linea) => {
      const li = document.createElement('li');
      li.textContent = linea;
      perfilDetalles.appendChild(li);
    });

    perfilModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function cerrarPerfil() {
    perfilModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.ver-perfil').forEach((btn) => {
    btn.addEventListener('click', () => abrirPerfil(btn.dataset.abogado));
  });

  perfilClose.addEventListener('click', cerrarPerfil);

  perfilModal.addEventListener('click', (e) => {
    if (e.target === perfilModal) cerrarPerfil();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && perfilModal.classList.contains('open')) cerrarPerfil();
  });
}

// ===== Íconos Lucide =====
if (window.lucide) lucide.createIcons();

// ===== CARRUSEL DE NOTICIAS =====

  document.querySelectorAll('.news-carousel').forEach(function (carousel) {
    var track = carousel.querySelector('.news-track');
    var prev = carousel.querySelector('.news-prev');
    var next = carousel.querySelector('.news-next');

    function paso() {
      var card = track.querySelector('.news-card');
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card.offsetWidth + gap;
    }

    function actualizar() {
      var hayDesborde = track.scrollWidth > track.clientWidth + 1;
      prev.hidden = next.hidden = !hayDesborde;
      prev.disabled = track.scrollLeft <= 1;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
    }

    prev.addEventListener('click', function () {
      track.scrollBy({ left: -paso(), behavior: 'smooth' });
    });
    next.addEventListener('click', function () {
      track.scrollBy({ left: paso(), behavior: 'smooth' });
    });

    track.addEventListener('scroll', actualizar);
    window.addEventListener('resize', actualizar);
    actualizar();
  });
