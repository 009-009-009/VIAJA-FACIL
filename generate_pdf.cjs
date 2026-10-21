const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createGuidePDF() {
  const pdfDoc = await PDFDocument.create();
  
  // Page 1: Bienvenida, Enlace de Acceso y Manual
  const page1 = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page1.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Background Header Bar (Deep Navy)
  page1.drawRectangle({
    x: 0,
    y: height - 120,
    width: width,
    height: 120,
    color: rgb(0.04, 0.07, 0.15), // #0a1226
  });

  // Header Title
  page1.drawText('VIAJA FACIL', {
    x: 40,
    y: height - 55,
    size: 26,
    font: fontBold,
    color: rgb(0.96, 0.62, 0.04), // Gold #f59e0b
  });

  page1.drawText('Tu Bitacora Inteligente de Viaje — Manual de Acceso y Uso VIP', {
    x: 40,
    y: height - 80,
    size: 13,
    font: fontRegular,
    color: rgb(0.85, 0.92, 0.98),
  });

  page1.drawText('Documento Oficial de Entrega de Producto y Declaracion de Autoria', {
    x: 40,
    y: height - 98,
    size: 9,
    font: fontOblique,
    color: rgb(0.4, 0.7, 0.9),
  });

  // Welcome message box
  page1.drawRectangle({
    x: 40,
    y: height - 210,
    width: width - 80,
    height: 75,
    color: rgb(0.95, 0.98, 1.0),
    borderColor: rgb(0.01, 0.52, 0.78),
    borderWidth: 1.5,
  });

  page1.drawText('¡FELICITACIONES POR TU COMPRA!', {
    x: 55,
    y: height - 150,
    size: 14,
    font: fontBold,
    color: rgb(0.01, 0.52, 0.78),
  });

  page1.drawText('Has adquirido acceso vitalicio a Viaja Facil. A partir de hoy, tu viaje estara', {
    x: 55,
    y: height - 172,
    size: 10.5,
    font: fontRegular,
    color: rgb(0.15, 0.2, 0.3),
  });
  page1.drawText('completamente organizado y protegido, incluso sin internet y en cualquier parte del mundo.', {
    x: 55,
    y: height - 188,
    size: 10.5,
    font: fontRegular,
    color: rgb(0.15, 0.2, 0.3),
  });

  // Access Link Box (Emerald Green Highlight)
  page1.drawRectangle({
    x: 40,
    y: height - 330,
    width: width - 80,
    height: 100,
    color: rgb(0.93, 0.98, 0.95),
    borderColor: rgb(0.06, 0.73, 0.5),
    borderWidth: 2,
  });

  page1.drawText('TU ENLACE EXCLUSIVO DE ACCESO A LA APLICACION:', {
    x: 55,
    y: height - 250,
    size: 11,
    font: fontBold,
    color: rgb(0.04, 0.45, 0.3),
  });

  const appUrl = 'https://viaja-facil-app-git-main-009-009-009s-projects.vercel.app/app.html';
  page1.drawText(appUrl, {
    x: 55,
    y: height - 275,
    size: 10.5,
    font: fontBold,
    color: rgb(0.01, 0.45, 0.8),
  });

  page1.drawText('* Guarda este enlace en tus favoritos de WhatsApp o navegador.', {
    x: 55,
    y: height - 298,
    size: 9.5,
    font: fontRegular,
    color: rgb(0.3, 0.35, 0.4),
  });
  page1.drawText('* No requiere contrasenas molestas: tus datos viven privados en tu telefono.', {
    x: 55,
    y: height - 314,
    size: 9.5,
    font: fontRegular,
    color: rgb(0.3, 0.35, 0.4),
  });

  // Instructions Section
  page1.drawText('GUIA RAPIDA DE INSTALACION EN TU CELULAR (5 SEGUNDOS)', {
    x: 40,
    y: height - 365,
    size: 13,
    font: fontBold,
    color: rgb(0.06, 0.09, 0.16),
  });

  // Step 1: iPhone
  page1.drawText('1. En iPhone (Safari):', {
    x: 40,
    y: height - 395,
    size: 11,
    font: fontBold,
    color: rgb(0.1, 0.15, 0.25),
  });
  page1.drawText('Abre el enlace en Safari, toca el boton Compartir (icono de cuadrado con flecha hacia arriba)', {
    x: 55,
    y: height - 412,
    size: 10,
    font: fontRegular,
    color: rgb(0.25, 0.3, 0.38),
  });
  page1.drawText('y selecciona "Agregar a Inicio". El icono de Viaja Facil quedara en tu pantalla como una app nativa.', {
    x: 55,
    y: height - 428,
    size: 10,
    font: fontRegular,
    color: rgb(0.25, 0.3, 0.38),
  });

  // Step 2: Android
  page1.drawText('2. En Android (Google Chrome):', {
    x: 40,
    y: height - 455,
    size: 11,
    font: fontBold,
    color: rgb(0.1, 0.15, 0.25),
  });
  page1.drawText('Abre el enlace en Chrome, presiona los 3 puntos arriba a la derecha y selecciona', {
    x: 55,
    y: height - 472,
    size: 10,
    font: fontRegular,
    color: rgb(0.25, 0.3, 0.38),
  });
  page1.drawText('"Agregar a la pantalla principal" o "Instalar aplicacion". Se anclara de inmediato.', {
    x: 55,
    y: height - 488,
    size: 10,
    font: fontRegular,
    color: rgb(0.25, 0.3, 0.38),
  });

  // Step 3: Modulos y Funciones
  page1.drawText('COMO APROVECHAR AL MAXIMO TUS 5 MODULOS:', {
    x: 40,
    y: height - 525,
    size: 12,
    font: fontBold,
    color: rgb(0.06, 0.09, 0.16),
  });

  const modules = [
    '• Pasajes Inteligentes: Carga tu pasaje en PDF o foto. El lector optico extraera tus vuelos y codigos.',
    '• Armario Capsula 5-4-3-2-1: Optimiza tu maleta de mano para viajar ligero sin pagar exceso de equipaje.',
    '• Guia de Movilidad & Taxi: Registra la direccion de tu hotel y usa el boton de copia rapida para Uber.',
    '• Ficha Medica SOS: Guarda tu grupo sanguineo, poliza de seguro y contactos vitales de emergencia.',
    '• Reglas de Oro de Seguridad: Consulta las advertencias vitales sobre custodia de equipaje y estafas.',
  ];

  let modY = height - 548;
  for (const m of modules) {
    page1.drawText(m, {
      x: 45,
      y: modY,
      size: 9.5,
      font: fontRegular,
      color: rgb(0.2, 0.25, 0.35),
    });
    modY -= 20;
  }

  // Legal and Authorship Box
  page1.drawRectangle({
    x: 40,
    y: 45,
    width: width - 80,
    height: 125,
    color: rgb(0.97, 0.97, 0.98),
    borderColor: rgb(0.8, 0.82, 0.85),
    borderWidth: 1,
  });

  page1.drawText('DECLARACION DE AUTORIA Y PROPIEDAD INTELECTUAL:', {
    x: 55,
    y: 152,
    size: 10,
    font: fontBold,
    color: rgb(0.1, 0.15, 0.25),
  });

  page1.drawText('Este producto digital ("Viaja Facil") es una creacion intelectual protegida por las leyes de derecho de autor.', {
    x: 55,
    y: 136,
    size: 8.5,
    font: fontRegular,
    color: rgb(0.3, 0.35, 0.4),
  });
  page1.drawText('Queda expresamente prohibida su reventa, distribucion publica no autorizada o copia total o parcial del software.', {
    x: 55,
    y: 122,
    size: 8.5,
    font: fontRegular,
    color: rgb(0.3, 0.35, 0.4),
  });
  page1.drawText('El comprador adquiere una licencia de uso personal, vitalicia e intransferible.', {
    x: 55,
    y: 108,
    size: 8.5,
    font: fontRegular,
    color: rgb(0.3, 0.35, 0.4),
  });

  page1.drawText('SOPORTE Y ASISTENCIA AL CLIENTE:', {
    x: 55,
    y: 86,
    size: 9.5,
    font: fontBold,
    color: rgb(0.01, 0.45, 0.8),
  });

  page1.drawText('Contacto de Soporte: sanjeanntiz@gmail.com | Garantia Hotmart de 7 dias.', {
    x: 55,
    y: 70,
    size: 9,
    font: fontRegular,
    color: rgb(0.2, 0.25, 0.35),
  });

  page1.drawText('© 2026 Viaja Facil - Todos los derechos reservados. Registrado en Hotmart ID: 8778813', {
    x: 55,
    y: 54,
    size: 8,
    font: fontOblique,
    color: rgb(0.45, 0.5, 0.55),
  });

  const pdfBytes = await pdfDoc.save();
  
  // Guardar en public/ y en raíz
  fs.writeFileSync(path.resolve('public/Manual_Instrucciones_y_Acceso_VIP_Viaja_Facil.pdf'), pdfBytes);
  fs.writeFileSync(path.resolve('dist/Manual_Instrucciones_y_Acceso_VIP_Viaja_Facil.pdf'), pdfBytes);
  console.log('PDF creado exitosamente con tamaño:', pdfBytes.length, 'bytes');
}

createGuidePDF().catch(console.error);
