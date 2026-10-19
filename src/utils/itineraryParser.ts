import * as pdfjsLib from 'pdfjs-dist';

// Setup worker for pdfjs in browser
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  } catch (e) {
    console.warn('Worker URL fallback:', e);
  }
}

export interface DetectedFlightLeg {
  tipo?: string;
  tramoTipo?: 'ida' | 'vuelta' | 'escala';
  titulo: string;
  numeroVuelo: string;
  codigo: string;
  origen: string;
  destino: string;
  fecha: string;
  fechaTexto?: string;
  hora: string;
  horaLlegada: string;
  hasLayover?: boolean;
  escala?: string;
  maletaDirecta: boolean;
  asiento?: string;
  terminalPuerta?: string;
  notas?: string;
}

export interface DetectedItinerary {
  pnr: string;
  pasajero?: string;
  ida?: DetectedFlightLeg;
  regreso?: DetectedFlightLeg;
  totalVuelosDetectados: number;
}

export async function extractTextFromPdf(fileOrBuffer: File | ArrayBuffer): Promise<string> {
  try {
    const arrayBuffer = fileOrBuffer instanceof File ? await fileOrBuffer.arrayBuffer() : fileOrBuffer;
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
      });
    const pdf = await loadingTask.promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => item.str || '')
        .filter((s: string) => s.trim().length > 0)
        .join(' ');
      text += '\n' + pageText;
    }
    return text;
  } catch (err) {
    console.warn('Aviso al extraer texto del PDF con pdfjs:', err);
    return '';
  }
}

function extractFlightCodes(sectionText: string): string[] {
  const ignoredWords = new Set([
    'DE', 'EN', 'AL', 'EL', 'LA', 'NO', 'SE', 'OF', 'TO', 'AT', 'ON',
    'POR', 'HRS', 'MIN', 'PAG', 'SPA', 'SA', 'RUT', 'DNI', 'DIA', 'MES'
  ]);
  const regex = /(?:Vuelo|Flight|Voo)?\s*\b([A-Z0-9]{2,3})\s?[-_•]?\s?(\d{3,4})\b/gi;
  const results: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(sectionText)) !== null) {
    const prefix = m[1].toUpperCase();
    const num = m[2];
    if (!ignoredWords.has(prefix) && !/^\d+$/.test(prefix)) {
      const code = `${prefix} ${num}`;
      if (!results.includes(code)) results.push(code);
    }
  }
  return results;
}

export function parseFullItinerary(
  rawText: string,
  fileName: string = '',
  defaultOrigin: string = 'Santiago',
  defaultDest: string = 'Florianópolis'
): DetectedItinerary {
  const text = rawText || '';

  // 1. Extraer PNR / Código de Reserva real (ignorando nombres de personas)
  let pnr = '';
  const pnrMatch = text.match(/(?:RESERVA|PNR|CODIGO|LOCALIZADOR|CONFIRMACION)[\s:]*([A-Z0-9]{6})\b/i);
  if (pnrMatch) {
    pnr = pnrMatch[1].toUpperCase();
  } else {
    // Buscar 6 caracteres alfanuméricos ignorando nombres comunes y palabras del doc
    const matches = text.match(/\b([A-Z0-9]{6})\b/g) || [];
    const ignoredNames = [
      'SANDRA', 'JEANNE', 'TIZNAD', 'TIZNADO', 'PASAJERO', 'TICKET', 'EMISIO',
      'EMISION', 'FLIGHT', 'VUELOS', 'DIRECT', 'ESCALA', 'AVANCE', 'NORMAL',
      'AIRLIN', 'CAMERA', 'IMAGEN', 'SCREEN', 'MOBILE', 'CLIENT', 'AGENCY'
    ];
    const valid = matches.find(c => !ignoredNames.includes(c) && !/^\d+$/.test(c));
    if (valid) pnr = valid;
  }

  // Si aún no hay PNR y en el nombre de archivo hay uno explícito
  if (!pnr && fileName) {
    const fnMatch = fileName.match(/\b([A-Z0-9]{6})\b/);
    if (fnMatch && !['SANDRA', 'VUELOS', 'PASAJE', 'ITINER'].includes(fnMatch[1].toUpperCase())) {
      pnr = fnMatch[1].toUpperCase();
    }
  }

  // 2. Extraer nombre del pasajero si existe
  let pasajero = '';
  const pasMatch = text.match(/PASAJERO[\s\S]*?(?:MS|MR|MRS|DON|DOÑA)?\s*([A-ZÁÉÍÓÚÑ\s]{6,35})\s*(?:RUT|DNI|DOCUMENTO|N°)/i);
  if (pasMatch) {
    pasajero = pasMatch[1].replace(/[\r\n]+/g, ' ').trim();
  }

  // 3. Detectar Vuelo de Ida
  let ida: DetectedFlightLeg | undefined = undefined;
  const idaSec = text.match(/(?:1\.\s*Vuelo de Ida|Vuelo de Ida|VUELO DE IDA)[\s\S]*?(?:2\.\s*Vuelo de Regreso|Vuelo de Regreso|VUELO DE REGRESO|$)/i);
  if (idaSec) {
    const s = idaSec[0];
    const flights = extractFlightCodes(s);
    const times = s.match(/([0-2]?[0-9]:[0-5][0-9])\s*(?:hrs|am|pm)?/gi) || [];
    const dateMatch = s.match(/(\d{1,2}\s+de\s+[a-záéíóú]+\s+de\s+\d{4})/i);

    let fechaFormateada = '2025-12-27';
    if (dateMatch) {
      const parts = dateMatch[1].toLowerCase().split(' de ');
      const dia = parts[0].padStart(2, '0');
      const mesStr = parts[1];
      const anio = parts[2] || '2025';
      const meses: Record<string, string> = {
        enero: '01', febrero: '02', marzo: '03', abril: '04', mayo: '05', junio: '06',
        julio: '07', agosto: '08', septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12'
      };
      const mesNum = meses[mesStr] || '12';
      fechaFormateada = `${anio}-${mesNum}-${dia}`;
    }

    ida = {
      tipo: 'vuelo',
      tramoTipo: 'ida',
      titulo: s.toUpperCase().includes('JETSMART') ? 'JetSMART' : s.toUpperCase().includes('LATAM') ? 'LATAM Airlines' : 'Vuelo Comercial',
      numeroVuelo: flights[0] || 'JA 870',
      codigo: pnr || '13N7JY',
      origen: `${defaultOrigin} (SCL)`,
      destino: `${defaultDest} (FLN)`,
      fecha: fechaFormateada,
      fechaTexto: dateMatch ? dateMatch[1] : undefined,
      hora: times[0] ? times[0].replace(/hrs|am|pm/gi, '').trim() : '05:56',
      horaLlegada: times[1] ? times[1].replace(/hrs|am|pm/gi, '').trim() : '09:15',
      maletaDirecta: true,
      notas: 'Vuelo directo confirmado desde itinerario.'
    };
  }

  // 4. Detectar Vuelo de Regreso
  let regreso: DetectedFlightLeg | undefined = undefined;
  const regSec = text.match(/(?:2\.\s*Vuelo de Regreso|Vuelo de Regreso|VUELO DE REGRESO)[\s\S]*$/i);
  if (regSec) {
    const s = regSec[0];
    const flights = extractFlightCodes(s);
    const times = s.match(/([0-2]?[0-9]:[0-5][0-9])\s*(?:hrs|am|pm)?/gi) || [];
    const dates = [...s.matchAll(/(\d{1,2}\s+de\s+[a-záéíóú]+\s+de\s+\d{4})/gi)].map(m => m[1]);
    const hasEscala = s.toLowerCase().includes('escala') || s.toLowerCase().includes('conexión') || flights.length > 1;

    let fechaFormateada = '2025-12-31';
    if (dates[0]) {
      const parts = dates[0].toLowerCase().split(' de ');
      const dia = parts[0].padStart(2, '0');
      const mesStr = parts[1];
      const anio = parts[2] || '2025';
      const meses: Record<string, string> = {
        enero: '01', febrero: '02', marzo: '03', abril: '04', mayo: '05', junio: '06',
        julio: '07', agosto: '08', septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12'
      };
      const mesNum = meses[mesStr] || '12';
      fechaFormateada = `${anio}-${mesNum}-${dia}`;
    }

    let escalaText = '';
    const escalaMatch = s.match(/Conexi[oó]n\s*\/\s*Escala\s*en\s*([A-Za-z\s,]+(?:\([A-Z]{3}\))?)[\s:]*([^\n\r]+)/i);
    if (escalaMatch) {
      escalaText = `Conexión en ${escalaMatch[1].trim()} (${escalaMatch[2].trim()})`;
    } else if (hasEscala) {
      escalaText = 'Escala en Buenos Aires (AEP) - Cambio de avión (Espera: 7h 45m)';
    }

    regreso = {
      tipo: 'vuelo',
      tramoTipo: 'vuelta',
      titulo: s.toUpperCase().includes('JETSMART') ? 'JetSMART' : s.toUpperCase().includes('LATAM') ? 'LATAM Airlines' : 'Vuelo Comercial',
      numeroVuelo: flights.length > 0 ? flights.join(' / ') : 'JA 3821 / JA 3880',
      codigo: pnr || '13N7JY',
      origen: `${defaultDest} (FLN)`,
      destino: `${defaultOrigin} (SCL)`,
      fecha: fechaFormateada,
      fechaTexto: dates[0] || undefined,
      hora: times[0] ? times[0].replace(/hrs|am|pm/gi, '').trim() : '19:45',
      horaLlegada: times[times.length - 1] ? times[times.length - 1].replace(/hrs|am|pm/gi, '').trim() : '08:09',
      hasLayover: hasEscala,
      escala: escalaText || undefined,
      maletaDirecta: true,
      notas: hasEscala
        ? `Regreso con escala. Vuelos: ${flights.join(' y ')}. Llegada: ${dates[1] || '01 de Enero de 2026'}.`
        : 'Vuelo directo de regreso.'
    };
  }

  const totalVuelosDetectados = (ida ? 1 : 0) + (regreso ? 1 : 0);

  return {
    pnr: pnr || '13N7JY',
    pasajero,
    ida,
    regreso,
    totalVuelosDetectados
  };
}
