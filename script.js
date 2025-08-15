// Utilidades
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ===== Navegación móvil ===== */
const nav = $('#mainNav');
$('#navToggle').addEventListener('click', () => nav.classList.toggle('show'));
$$('#mainNav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('show')));

/* ===== Footer año ===== */
$('#year').textContent = new Date().getFullYear();

/* ====== Formulario Citas: validación, guardado y descarga .txt ====== */
const formCita = $('#formCita');
const tablaWrap = $('#tablaCitasWrap');
const tabla = $('#tablaCitas');

const STORAGE_KEY = 'citas-mecanica';

function leerCitas() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function escribirCitas(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}
function fila(c, i) {
  return `<tr>
    <td>${i + 1}</td>
    <td>${c.nombre}</td>
    <td>${c.telefono}</td>
    <td>${c.email}</td>
    <td>${c.fecha}</td>
    <td>${c.auto}</td>
    <td>${c.servicio}</td>
    <td>${c.detalle || '-'}</td>
  </tr>`;
}
function renderTabla() {
  const citas = leerCitas();
  if (!citas.length) { tablaWrap.hidden = true; return; }
  tablaWrap.hidden = false;
  tabla.innerHTML = `
    <thead><tr>
      <th>#</th><th>Nombre</th><th>Tel</th><th>Correo</th><th>Fecha</th><th>Vehículo</th><th>Servicio</th><th>Detalle</th>
    </tr></thead>
    <tbody>${citas.map(fila).join('')}</tbody>`;
}
renderTabla();

// Validación simple + guardado
formCita.addEventListener('submit', (e) => {
  e.preventDefault();

  let ok = true;
  $$('.field', formCita).forEach(f => {
    const input = $('input, select, textarea', f);
    const err = $('.error', f);
    input.checkValidity();
    if (!input.validity.valid) {
      err.textContent = input.validationMessage || 'Campo inválido';
      ok = false;
    } else {
      err.textContent = '';
    }
  });
  if (!ok) return;

  const data = Object.fromEntries(new FormData(formCita).entries());
  const citas = leerCitas();
  citas.push(data);
  escribirCitas(citas);
  renderTabla();
  formCita.reset();
  alert('¡Cita guardada localmente!');
});

// Descargar .txt con las citas
$('#btnDescargar').addEventListener('click', () => {
  const citas = leerCitas();
  if (!citas.length) {
    alert('No hay citas guardadas.');
    return;
  }
  const lines = citas.map((c, i) =>
    `Cita ${i + 1}
Nombre: ${c.nombre}
Teléfono: ${c.telefono}
Correo: ${c.email}
Fecha: ${c.fecha}
Vehículo: ${c.auto}
Servicio: ${c.servicio}
Detalle: ${c.detalle || ''}

`).join('\n');

  const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: 'citas_taller.txt' });
  document.body.append(a); a.click(); a.remove(); URL.revokeObjectURL(url);
});

/* ====== Contacto: validación básica ====== */
const formContacto = $('#formContacto');
formContacto.addEventListener('submit', (e) => {
  let ok = true;
  $$('.field', formContacto).forEach(f => {
    const input = $('input, textarea', f);
    const err = $('.error', f);
    input.checkValidity();
    if (!input.validity.valid) {
      err.textContent = input.validationMessage || 'Campo inválido';
      ok = false;
    } else { err.textContent = ''; }
  });
  if (!ok) e.preventDefault();
});
