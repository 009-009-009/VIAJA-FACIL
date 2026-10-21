const { PDFDocument, rgb, StandardFonts, PDFName, PDFString, PDFArray } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createEnhancedPDF() {
  const pdfDoc = await PDFDocument.create();
  
  // Tamaño A4 vertical
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // 1. HEADER BAR OSCURO ELEGANTE
  page.drawRectangle({
    x: 0,
    y: height - 120,
    width: width,
    height: 120,
    color: rgb(0.04, 0.08, 0.18), // Deep navy
  });

  page.drawText('VIAJA FACIL', {
    x: 40,
    y: height - 55,
    size: 28,
    font: fontBold,
    color: rgb(0.96, 0.62, 0.04), // Gold
  });

  page.drawText('Tu Bitacora Inteligente de Viaje | Guia y Llave de Acceso VIP', {
    x: 40,
    y: height - 82,
    size: 13,
    font: fontRegular,
    color: rgb(0.88, 0.94, 1.0),
  });

  page.drawText('Documento Oficial de Entrega Hotmart — ID de Producto: 8778813', {
    x: 40,
    y: height - 100,
    size: 9.5,
    font: fontOblique,
    color: rgb(0.22, 0.74, 0.99),
  });

  // 2. CAJA DE BIENVENIDA
  page.drawRectangle({
    x: 35,
    y: height - 200,
    width: width - 70,
    height: 65,
    color: rgb(0.95, 0.98, 1.0),
    borderColor: rgb(0.01, 0.52, 0.78),
    borderWidth: 1.5,
  });

  page.drawText('¡FELICITACIONES POR TU COMPRA!', {
    x: 50,
    y: height - 155,
    size: 15,
    font: fontBold,
    color: rgb(0.01, 0.52, 0.78),
  });

  page.drawText('Has adquirido acceso vitalicio a Viaja Facil. A partir de hoy llevas todo organizado,', {
    x: 50,
    y: height - 175,
    size: 11,
    font: fontRegular,
    color: rgb(0.12, 0.18, 0.28),
  });
  page.drawText('con lector de pasajes, armario capsula y datos medicos seguros en tu celular.', {
    x: 50,
    y: height - 190,
    size: 11,
    font: fontRegular,
    color: rgb(0.12, 0.18, 0.28),
  });

  // 3. BOTON GIGANTE CLICKEABLE DE ACCESO A LA APP
  const btnX = 35;
  const btnY = height - 325;
  const btnW = width - 70;
  const btnH = 105;

  page.drawRectangle({
    x: btnX,
    y: btnY,
    width: btnW,
    height: btnH,
    color: rgb(0.06, 0.73, 0.5), // Emerald Green
    borderColor: rgb(0.04, 0.55, 0.38),
    borderWidth: 2,
  });

  page.drawText('TU LLAVE DE ACCESO DIRECTO:', {
    x: 50,
    y: btnY + 76,
    size: 12,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText('>>> CLIC AQUI PARA ABRIR TU BITACORA <<<', {
    x: 50,
    y: btnY + 46,
    size: 16,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  const appUrl = 'https://viaja-facil-app.vercel.app/app.html';
  page.drawText(appUrl, {
    x: 50,
    y: btnY + 22,
    size: 10.5,
    font: fontRegular,
    color: rgb(0.9, 1, 0.95),
  });

  // Crear anotacion de hipervinculo clickeable nativa en el PDF
  const linkAnnot = pdfDoc.context.obj({
    Type: 'Annot',
    Subtype: 'Link',
    Rect: [btnX, btnY, btnX + btnW, btnY + btnH],
    Border: [0, 0, 0],
    A: {
      Type: 'Action',
      S: 'URI',
      URI: PDFString.of(appUrl),
    },
  });
  const linkAnnotRef = pdfDoc.context.register(linkAnnot);

  // Agregar la anotacion a la pagina
  let annots = page.node.lookup(PDFName.of('Annots'));
  if (!annots) {
    annots = pdfDoc.context.obj([]);
    page.node.set(PDFName.of('Annots'), annots);
  }
  if (annots instanceof PDFArray) {
    annots.push(linkAnnotRef);
  }

  // 4. INSTRUCCIONES DE INSTALACION EN CELULAR
  page.drawText('COMO ANCLAR LA APP A TU PANTALLA EN 5 SEGUNDOS:', {
    x: 35,
    y: height - 355,
    size: 12.5,
    font: fontBold,
    color: rgb(0.06, 0.09, 0.16),
  });

  // iPhone Box
  page.drawRectangle({
    x: 35,
    y: height - 440,
    width: (width - 80) / 2,
    height: 70,
    color: rgb(0.97, 0.98, 1.0),
    borderColor: rgb(0.8, 0.85, 0.92),
    borderWidth: 1,
  });
  page.drawText('[iPhone - Safari]:', {
    x: 45,
    y: height - 385,
    size: 11,
    font: fontBold,
    color: rgb(0.01, 0.45, 0.8),
  });
  page.drawText('1. Abre el enlace verde de arriba.', { x: 45, y: height - 402, size: 9.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
  page.drawText('2. Toca Compartir (cuadrado con flecha).', { x: 45, y: height - 417, size: 9.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
  page.drawText('3. Selecciona "Agregar a Inicio".', { x: 45, y: height - 432, size: 9.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });

  // Android Box
  page.drawRectangle({
    x: 35 + (width - 80) / 2 + 10,
    y: height - 440,
    width: (width - 80) / 2,
    height: 70,
    color: rgb(0.97, 0.98, 1.0),
    borderColor: rgb(0.8, 0.85, 0.92),
    borderWidth: 1,
  });
  page.drawText('[Android - Chrome]:', {
    x: 45 + (width - 80) / 2 + 10,
    y: height - 385,
    size: 11,
    font: fontBold,
    color: rgb(0.01, 0.45, 0.8),
  });
  page.drawText('1. Abre el enlace verde de arriba.', { x: 45 + (width - 80) / 2 + 10, y: height - 402, size: 9.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
  page.drawText('2. Presiona los 3 puntos arriba a la der.', { x: 45 + (width - 80) / 2 + 10, y: height - 417, size: 9.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
  page.drawText('3. Toca "Agregar a pantalla principal".', { x: 45 + (width - 80) / 2 + 10, y: height - 432, size: 9.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });

  // 5. MODULOS DE VIAJA FACIL
  page.drawText('TUS 5 HERRAMIENTAS PRINCIPALES:', {
    x: 35,
    y: height - 475,
    size: 12,
    font: fontBold,
    color: rgb(0.06, 0.09, 0.16),
  });

  const tips = [
    '1. Pasajes Inteligentes: Sube tu PDF o foto de pasaje y se leeran tus vuelos automaticamente.',
    '2. Armario Capsula: Planifica tus prendas con la formula 5-4-3-2-1 para no pagar maleta extra.',
    '3. Guia de Movilidad & Taxi: Copia la direccion de tu hotel en un toque para el taxista o Uber.',
    '4. Ficha Medica SOS: Ten a mano tu seguro, grupo sanguineo y telefonos vitales sin internet.',
    '5. Reglas de Oro de Seguridad: Consejos esenciales para evitar enganos y cuidar tu equipaje.',
  ];

  let tipY = height - 500;
  for (const t of tips) {
    page.drawText(t, {
      x: 45,
      y: tipY,
      size: 9.8,
      font: fontRegular,
      color: rgb(0.2, 0.25, 0.35),
    });
    tipY -= 21;
  }

  // 6. CAJA LEGAL Y DE DERECHOS DE AUTOR
  page.drawRectangle({
    x: 35,
    y: 40,
    width: width - 70,
    height: 125,
    color: rgb(0.97, 0.98, 0.99),
    borderColor: rgb(0.8, 0.83, 0.88),
    borderWidth: 1,
  });

  page.drawText('DECLARACION DE AUTORIA Y PROPIEDAD INTELECTUAL:', {
    x: 48,
    y: 145,
    size: 10,
    font: fontBold,
    color: rgb(0.12, 0.18, 0.28),
  });

  page.drawText('Este producto digital ("Viaja Facil") es una creacion intelectual protegida por la ley.', {
    x: 48,
    y: 128,
    size: 8.5,
    font: fontRegular,
    color: rgb(0.35, 0.4, 0.48),
  });
  page.drawText('Licencia de uso personal, vitalicia e intransferible para el comprador original.', {
    x: 48,
    y: 114,
    size: 8.5,
    font: fontRegular,
    color: rgb(0.35, 0.4, 0.48),
  });
  page.drawText('Queda estrictamente prohibida su reventa o redistribucion publica no autorizada.', {
    x: 48,
    y: 100,
    size: 8.5,
    font: fontRegular,
    color: rgb(0.35, 0.4, 0.48),
  });

  page.drawText('SOPORTE AL CLIENTE:', {
    x: 48,
    y: 80,
    size: 9.5,
    font: fontBold,
    color: rgb(0.01, 0.45, 0.8),
  });

  page.drawText('Atencion por correo: sanjeanntiz@gmail.com | Garantia de satisfaccion de 7 dias.', {
    x: 48,
    y: 65,
    size: 9,
    font: fontRegular,
    color: rgb(0.2, 0.25, 0.35),
  });

  page.drawText('© 2026 Viaja Facil - Todos los derechos reservados. Registrado en Hotmart ID: 8778813', {
    x: 48,
    y: 50,
    size: 8,
    font: fontOblique,
    color: rgb(0.5, 0.55, 0.6),
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path.resolve('public/Manual_Instrucciones_y_Acceso_VIP_Viaja_Facil.pdf'), pdfBytes);
  fs.writeFileSync(path.resolve('dist/Manual_Instrucciones_y_Acceso_VIP_Viaja_Facil.pdf'), pdfBytes);
  console.log('PDF Mejorado generado con éxito:', pdfBytes.length, 'bytes');
}

createEnhancedPDF().catch(console.error);
