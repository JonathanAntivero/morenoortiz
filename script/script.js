// ===== Menú móvil =====
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
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
    rol: 'Socio',
    especialidad: 'Derecho laboral empresarial y relaciones colectivas',
    bio: 'Cuenta con amplia trayectoria asesorando a empresas de distintos sectores en la prevención y gestión de riesgos laborales, así como en procesos de negociación colectiva.',
    detalles: [
      'Universidad: (completar)',
      'Años de experiencia: (completar)',
      'Idiomas: Español, Inglés'
    ]
  },
  camila: {
    nombre: 'María Camila Gómez Valencia',
    rol: 'Asociada Senior',
    especialidad: 'Derecho laboral individual y seguridad social',
    bio: 'Se especializa en el acompañamiento de empresas en temas de contratación, terminación de contratos y cumplimiento en materia de seguridad social.',
    detalles: [
      'Universidad: (completar)',
      'Años de experiencia: (completar)',
      'Idiomas: Español, Inglés'
    ]
  },
  andres: {
    nombre: 'Andrés Felipe Molina Castaño',
    rol: 'Asociado',
    especialidad: 'Procesos disciplinarios y litigios laborales',
    bio: 'Enfocado en el diseño y defensa de procesos disciplinarios, así como en la representación de empresas en litigios laborales ante distintas instancias.',
    detalles: [
      'Universidad: (completar)',
      'Años de experiencia: (completar)',
      'Idiomas: Español'
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