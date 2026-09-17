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

// ===== Formulario de reunión =====
const reunionForm = document.getElementById('reunionForm');
const formStatus = document.getElementById('formStatus');

if (reunionForm) {
  reunionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Acá se puede conectar a un backend, email o servicio externo.
    formStatus.textContent = '¡Gracias! Recibimos su solicitud y nos pondremos en contacto a la brevedad.';
    reunionForm.reset();
    document.querySelectorAll('.chip.selected').forEach((c) => c.classList.remove('selected'));
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
