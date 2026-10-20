import React, { useState, useEffect } from 'react';
import {
  Compass,
  Send,
  ExternalLink,
  Loader2,
  ScanLine,
  Landmark,
  Building2,
  Plus,
  Calendar,
  MapPin,
  Phone,
  Copy,
  Check,
  Plane,
  Home,
  Luggage,
  Trash2,
  Edit3,
  Clock,
  Sparkles,
  CheckCircle2,
  Sun,
  ShieldCheck,
  Stethoscope,
  Smile,
  AlertCircle,
  Upload,
  FileText,
  Eye,
  CornerDownRight,
  Shield,
  Shirt,
  CheckCircle,
  RotateCcw,
  Car,
  Bus,
  KeyRound,
  WifiOff,
  Coins,
  AlertOctagon,
  Globe2,
  Wallet,
  AlertTriangle,
  CreditCard,
  Lock,
  ChevronRight,
  HelpCircle,
  Mail,
  X,
  Ticket,
  ArrowRight
} from 'lucide-react';

import {
  extractTextFromPdf,
  parseFullItinerary,
  type DetectedItinerary,
  type DetectedFlightLeg
} from './utils/itineraryParser';
import {
  DESTINATIONS,
  type DestinationPreset,
  type MobilityInfo,
  findCountryPreset,
  getEmergencyNumbers
} from './data/destinations';

export interface MoneyAgency {
  id: string;
  nombre: string;
  direccion: string;
  referencia?: string;
  horario?: string;
  telefono?: string;
  notas?: string;
  verificado: boolean;
}

interface SimpleBooking {
  id: string;
  tipo: 'vuelo' | 'transporte' | 'seguro';
  tramoTipo?: 'ida' | 'vuelta' | 'escala' | 'interno';
  titulo: string;
  codigo: string; // Código de Reserva / Localizador / PNR
  numeroVuelo?: string; // N° de vuelo (ej: "JA 560", "LA 402")
  aerolinea?: string;
  origen?: string;
  destino?: string;
  asiento?: string;
  terminalPuerta?: string;
  fecha: string;
  hora: string;
  horaLlegada?: string;
  escala?: string;
  maletaDirecta?: boolean;
  telefonoContacto?: string;
  telefonoDestino?: string;
  telefonoOrigen?: string;
  emailContacto?: string;
  notas?: string;
  archivoNombre?: string;
  archivoDataUrl?: string;
}

interface LodgingInfo {
  nombre: string;
  direccion: string;
  telefono: string;
  notas: string;
}

interface HealthInfo {
  tieneSeguro: boolean;
  seguroCompania: string;
  seguroPoliza: string;
  seguroTelefono: string; // En el extranjero
  seguroTelefonoOrigen?: string; // Desde tu país / Casa
  seguroEmail?: string; // Correo de asistencia médica
  seguroFechaInicio?: string; // Fecha de inicio de cobertura
  seguroFechaFin?: string; // Fecha de término de cobertura
  hospitalCercanoNombre: string;
  hospitalCercanoDireccion: string;
  hospitalCercanoTelefono: string;
  numeroAmbulanciaLocal: string;
  numeroPoliciaLocal?: string;
  numeroBomberosLocal?: string;
  fondosEmergenciaNotas: string;
  tipoSangre: string;
  alergias: string;
  medicamentosDiarios: string;
  condicionesMedicas: string;
}

interface LuggageItem {
  id: string;
  nombre: string;
  categoria: 'infaltable' | 'capsula' | 'ropa' | 'personal';
  listo: boolean;
}

interface SimpleTrip {
  id: string;
  nombre: string;
  origen: string;
  destino: string;
  paisKey: string;
  pais: string;
  bandera?: string;
  fechaSalida: string;
  fechaRegreso: string;
  moneda: string;
  enchufe: string;
  voltaje: string;
  clima: string;
  tipoViaje: 'playa' | 'ciudad' | 'frio';
  diasViaje: number;
  alojamiento: LodgingInfo;
  familiarNombre: string;
  familiarTelefono: string;
  consuladoNombre: string;
  consuladoTelefono: string;
  consuladoDireccion: string;
  movilidad: MobilityInfo;
  salud: HealthInfo;
  pasajesYDocumentos: SimpleBooking[];
  equipaje: LuggageItem[];
  puntosRetiroDinero?: MoneyAgency[];
}

const DEFAULT_TRIP: SimpleTrip = {
  id: 'florianopolis-viaja-facil-v10',
  nombre: 'Vacaciones en Florianópolis, Brasil',
  origen: 'Santiago', 
  destino: 'Florianópolis',
  paisKey: 'brasil',
  pais: 'Brasil',
  bandera: '🇧🇷',
  fechaSalida: '2026-12-23',
  fechaRegreso: '2026-12-30',
  moneda: DESTINATIONS.brasil.moneda,
  enchufe: DESTINATIONS.brasil.enchufe,
  voltaje: DESTINATIONS.brasil.voltaje,
  clima: DESTINATIONS.brasil.clima,
  tipoViaje: 'playa',
  diasViaje: 7,
  alojamiento: {
    nombre: 'Posada en Canasvieiras (o escribir al llegar)',
    direccion: 'Rua das Flores 120, Canasvieiras, Florianópolis - SC',
    telefono: '+55 48 3266 1122',
    notas: 'A 2 cuadras de la playa. Para mostrarle al chofer de taxi o Uber.'
  },
  familiarNombre: 'Soledad (Familiar)',
  familiarTelefono: '+56 9 7654 3210',
  consuladoNombre: DESTINATIONS.brasil.consuladoDefault,
  consuladoTelefono: DESTINATIONS.brasil.consuladoTelDefault,
  consuladoDireccion: DESTINATIONS.brasil.consuladoDirDefault,
  movilidad: DESTINATIONS.brasil.movilidad,
  salud: {
    tieneSeguro: true,
    seguroCompania: 'Seguro de Viaje', // Nombre libremente editable por el usuario
    seguroPoliza: 'POL-BR-99120',
    seguroTelefono: '+55 11 3132 1000',
    seguroTelefonoOrigen: '+56 2 2897 5000',
    seguroEmail: 'asistencia@seguroviaje.com',
    seguroFechaInicio: '2025-12-26',
    seguroFechaFin: '2026-01-01',
    hospitalCercanoNombre: '', // Sin pre-llenar hospital ficticio; editable por el viajero
    hospitalCercanoDireccion: '',
    hospitalCercanoTelefono: '',
    numeroAmbulanciaLocal: '192 (SAMU Brasil)',
    numeroPoliciaLocal: '190 (Policía Militar)',
    numeroBomberosLocal: '193 (Bombeiros)',
    fondosEmergenciaNotas: 'Guardar boletas e informes médicos originales por si exigen reembolso.',
    tipoSangre: 'O+ (O Positivo)',
    alergias: 'Penicilina (ejemplo editable)',
    medicamentosDiarios: 'Losartán 50mg (ejemplo editable)',
    condicionesMedicas: 'Hipertensión controlada'
  },
  pasajesYDocumentos: [
    {
      id: 'pas-1',
      tipo: 'vuelo',
      tramoTipo: 'ida',
      titulo: 'JetSmart - Santiago ➔ Florianópolis',
      codigo: '13N7JY',
      numeroVuelo: 'JA 560',
      origen: 'Santiago (SCL)',
      destino: 'Florianópolis (FLN)',
      asiento: '12C',
      terminalPuerta: 'T2 - Puerta 14',
      fecha: '2026-12-23',
      hora: '07:45 AM',
      horaLlegada: '11:15 AM',
      escala: undefined,
      maletaDirecta: true,
      notas: 'Llegada directa al Aeropuerto Hercílio Luz (FLN).'
    }
  ],
  puntosRetiroDinero: [
    {
      id: 'wu-1',
      nombre: 'Western Union / Agencia de Cambio & Remesas',
      direccion: 'Av. das Nações 450, Canasvieiras, Florianópolis - SC',
      referencia: 'Frente a la plaza principal, dentro de la galería comercial',
      horario: 'Lunes a Viernes 09:00 a 17:00 / Sábados 09:00 a 13:00',
      telefono: '+55 48 3266 8800',
      notas: 'Llevar pasaporte físico vigente y código MTCN de 10 dígitos. Verifica en recepción antes de ir que siga activa.',
      verificado: true
    }
  ],
  equipaje: [
    // Infaltables
    { id: 'inf-1', nombre: 'Cédula física o Pasaporte vigente (en bolso de mano)', categoria: 'infaltable', listo: false },
    { id: 'inf-2', nombre: 'Dinero dividido: billetera pequeña para el día y fondo grueso del viaje oculto/caja fuerte', categoria: 'infaltable', listo: false },
    { id: 'inf-3', nombre: 'Tarjetas bancarias activadas para compras internacionales', categoria: 'infaltable', listo: false },
    { id: 'inf-4', nombre: 'Medicamentos personales con receta médica original', categoria: 'infaltable', listo: false },
    { id: 'inf-5', nombre: 'Adaptador de enchufe Tipo N brasileño (3 patitas)', categoria: 'infaltable', listo: false },
    { id: 'inf-6', nombre: 'Batería externa portátil (Power bank en bolso de mano por ley de vuelo)', categoria: 'infaltable', listo: false },
    
    // Armario Cápsula
    { id: 'cap-1', nombre: '3 Partes de abajo: 2 shorts de playa/lino + 1 pantalón ligero', categoria: 'capsula', listo: true },
    { id: 'cap-2', nombre: '5 Partes de arriba: 5 poleras/blusas combinables', categoria: 'capsula', listo: false },
    { id: 'cap-3', nombre: '1 Chaqueta cortaviento liviana / paraguas de bolsillo', categoria: 'capsula', listo: false },
    { id: 'cap-4', nombre: '2 Trajes de baño y sandalias cómodas de playa', categoria: 'capsula', listo: true },
    
    // Ropa diaria
    { id: 'gen-1', nombre: '7 mudas de ropa interior (1 para cada día)', categoria: 'ropa', listo: false },
    { id: 'gen-2', nombre: 'Bolsa de tela para separar la ropa sucia', categoria: 'ropa', listo: false }
  ]
};

export default function App() {
  const [trip, setTrip] = useState<SimpleTrip>(() => {
    const saved = localStorage.getItem('viaja_facil_simple_v10');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_TRIP,
          ...parsed,
          pasajesYDocumentos: (parsed.pasajesYDocumentos || []).filter((d: any) => d.tipo !== 'seguro'),
          salud: {
            ...DEFAULT_TRIP.salud,
            ...(parsed.salud || {}),
            seguroFechaInicio: parsed.salud?.seguroFechaInicio || DEFAULT_TRIP.salud.seguroFechaInicio,
            seguroFechaFin: parsed.salud?.seguroFechaFin || DEFAULT_TRIP.salud.seguroFechaFin
          }
        };
      } catch (e) {
        console.error('Error loading trip', e);
      }
    }
    return DEFAULT_TRIP;
  });

  const [activeTab, setActiveTab] = useState<'pasajes' | 'equipaje' | 'moverte' | 'salud' | 'tips'>('pasajes');
  const [showSosModal, setShowSosModal] = useState(false);
  const [showChangeCountryModal, setShowChangeCountryModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Smart Packing
  const [packDestinationType, setPackDestinationType] = useState<'playa' | 'ciudad' | 'frio'>(trip.tipoViaje);
  const [packDays, setPackDays] = useState<number>(trip.diasViaje);
  const [newItemName, setNewItemName] = useState('');

  // Modales
  const [isAddingBooking, setIsAddingBooking] = useState(false);
  const [isEditingInsuranceModal, setIsEditingInsuranceModal] = useState(false);
  const [newBookingType, setNewBookingType] = useState<'vuelo' | 'transporte'>('vuelo');
  const [newBookingTramoTipo, setNewBookingTramoTipo] = useState<'ida' | 'vuelta' | 'escala' | 'interno'>('ida');
  const [newBookingTitle, setNewBookingTitle] = useState('');
  const [newBookingCode, setNewBookingCode] = useState('');
  const [newBookingNumeroVuelo, setNewBookingNumeroVuelo] = useState('');
  const [newBookingOrigen, setNewBookingOrigen] = useState('');
  const [newBookingDestino, setNewBookingDestino] = useState('');
  const [newBookingAsiento, setNewBookingAsiento] = useState('');
  const [newBookingTerminalPuerta, setNewBookingTerminalPuerta] = useState('');
  const [newBookingDate, setNewBookingDate] = useState('');
  const [newBookingTime, setNewBookingTime] = useState('');
  const [newBookingHoraLlegada, setNewBookingHoraLlegada] = useState('');
  const [newBookingHasLayover, setNewBookingHasLayover] = useState(false);
  const [newBookingLayoverInfo, setNewBookingLayoverInfo] = useState('');
  const [newBookingBagDirect, setNewBookingBagDirect] = useState(true);
  const [newBookingFile, setNewBookingFile] = useState<{ name: string; url: string } | null>(null);
  const [autoFillSuccessMsg, setAutoFillSuccessMsg] = useState<string | null>(null);

  // Modal seguro dedicado
  const [insuranceForm, setInsuranceForm] = useState({
    compania: trip.salud.seguroCompania || '',
    poliza: trip.salud.seguroPoliza || 'POL-99218-BR',
    fechaInicio: trip.salud.seguroFechaInicio || '2025-12-26',
    fechaFin: trip.salud.seguroFechaFin || '2026-01-01',
    telefonoDestino: trip.salud.seguroTelefono || '+55 11 3132 1000',
    telefonoOrigen: trip.salud.seguroTelefonoOrigen || '+56 2 2897 5000',
    email: trip.salud.seguroEmail || 'asistencias@seguroviaje.com'
  });

  const openAddBookingModal = () => {
    setNewBookingType('vuelo');
    setNewBookingTramoTipo('ida');
    setNewBookingTitle('JetSmart');
    setNewBookingCode('');
    setNewBookingNumeroVuelo('');
    setNewBookingOrigen('Santiago (SCL)');
    setNewBookingDestino('Florianópolis (FLN)');
    setNewBookingAsiento('');
    setNewBookingTerminalPuerta('');
    setNewBookingDate('2026-12-23');
    setNewBookingTime('07:45');
    setNewBookingHoraLlegada('11:15');
    setNewBookingHasLayover(false);
    setNewBookingLayoverInfo('');
    setNewBookingBagDirect(true);
    setNewBookingFile(null);
    setDetectedItinerary(null);
    setAutoFillSuccessMsg(null);
    setIsAddingBooking(true);
  };

  const openEditInsuranceModal = () => {
    setInsuranceForm({
      compania: trip.salud.seguroCompania || '',
      poliza: trip.salud.seguroPoliza || 'POL-99218-BR',
      fechaInicio: trip.salud.seguroFechaInicio || '2025-12-26',
      fechaFin: trip.salud.seguroFechaFin || '2026-01-01',
      telefonoDestino: trip.salud.seguroTelefono || '+55 11 3132 1000',
      telefonoOrigen: trip.salud.seguroTelefonoOrigen || '+56 2 2897 5000',
      email: trip.salud.seguroEmail || 'asistencias@seguroviaje.com'
    });
    setIsEditingInsuranceModal(true);
  };

    // Estados para OCR y Lector Óptico de Pasajes
  const [isOcrScanning, setIsOcrScanning] = useState(false);
  const [detectedItinerary, setDetectedItinerary] = useState<DetectedItinerary | null>(null);

  // Estados para Agencias de Retiro de Dinero / Western Union
  const [isAgencyModalOpen, setIsAgencyModalOpen] = useState(false);
  const [editingAgencyId, setEditingAgencyId] = useState<string | null>(null);
  const [agencyForm, setAgencyForm] = useState<MoneyAgency>({
    id: '',
    nombre: '',
    direccion: '',
    referencia: '',
    horario: '',
    telefono: '',
    notas: '',
    verificado: true
  });

  const openAddAgencyModal = () => {
    setEditingAgencyId(null);
    setAgencyForm({
      id: `wu-${Date.now()}`,
      nombre: 'Western Union / Agencia de Remesas',
      direccion: '',
      referencia: '',
      horario: 'Lunes a Viernes 09:00 a 17:00',
      telefono: '',
      notas: 'Llevar pasaporte físico vigente y código MTCN de 10 dígitos.',
      verificado: true
    });
    setIsAgencyModalOpen(true);
  };

  const openEditAgencyModal = (agency: MoneyAgency) => {
    setEditingAgencyId(agency.id);
    setAgencyForm({ ...agency });
    setIsAgencyModalOpen(true);
  };

  const handleSaveAgency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyForm.nombre.trim() || !agencyForm.direccion.trim()) return;

    setTrip((prev) => {
      const currentList = prev.puntosRetiroDinero || [];
      if (editingAgencyId) {
        return {
          ...prev,
          puntosRetiroDinero: currentList.map((item) =>
            item.id === editingAgencyId ? agencyForm : item
          )
        };
      } else {
        return {
          ...prev,
          puntosRetiroDinero: [...currentList, agencyForm]
        };
      }
    });

    setIsAgencyModalOpen(false);
  };

  const handleDeleteAgency = (id: string) => {
    setTrip((prev) => ({
      ...prev,
      puntosRetiroDinero: (prev.puntosRetiroDinero || []).filter((item) => item.id !== id)
    }));
  };

  // Función inteligente de parseo de texto de pasajes (Ida, Regreso y Escalas)
  const parseTicketExtractedText = (rawText: string, fileName: string) => {
    const textUpper = (rawText + ' ' + fileName).toUpperCase();
    let flightFound = '';
    let codeFound = '';
    let airlineFound = '';
    let seatFound = '';
    let gateFound = '';
    let isReturn = false;
    let hasLayover = false;
    let layoverCity = '';

    // 1. Detección de Tramo: ¿Es Regreso / Vuelta?
    const destName = (trip.destino || 'FLORIANOPOLIS').toUpperCase();
    const origName = (trip.origen || 'SANTIAGO').toUpperCase();
    if (
      textUpper.includes('VUELTA') ||
      textUpper.includes('REGRESO') ||
      textUpper.includes('RETORNO') ||
      textUpper.includes('RETURN') ||
      textUpper.includes('BACK') ||
      (textUpper.includes(destName) && textUpper.indexOf(destName) < textUpper.indexOf(origName) && textUpper.includes(origName))
    ) {
      isReturn = true;
      setNewBookingTramoTipo('vuelta');
      setNewBookingOrigen(`${trip.destino || 'Florianópolis'} (FLN)`);
      setNewBookingDestino(`${trip.origen || 'Santiago'} (SCL)`);
      if (trip.fechaRegreso) setNewBookingDate(trip.fechaRegreso);
    } else {
      if (textUpper.includes('IDA') || textUpper.includes('ONE WAY') || textUpper.includes('OUTBOUND')) {
        setNewBookingTramoTipo('ida');
      }
    }

    // 2. Detección de Escalas o Conexiones
    if (
      textUpper.includes('ESCALA') ||
      textUpper.includes('CONEXION') ||
      textUpper.includes('CONEXAO') ||
      textUpper.includes('LAYOVER') ||
      textUpper.includes('STOPOVER') ||
      textUpper.includes('TRANSIT') ||
      textUpper.includes('GRU') ||
      textUpper.includes('SAO PAULO') ||
      textUpper.includes('BOGOTA') ||
      textUpper.includes('LIMA')
    ) {
      hasLayover = true;
      setNewBookingHasLayover(true);
      setNewBookingBagDirect(true);
      if (textUpper.includes('GRU') || textUpper.includes('SAO PAULO')) {
        layoverCity = 'Escala en São Paulo (GRU)';
      } else if (textUpper.includes('BOG') || textUpper.includes('BOGOTA')) {
        layoverCity = 'Escala en Bogotá (BOG)';
      } else if (textUpper.includes('LIM') || textUpper.includes('LIMA')) {
        layoverCity = 'Escala en Lima (LIM)';
      } else {
        layoverCity = 'Escala en conexión intermedia (Equipaje va directo)';
      }
      setNewBookingLayoverInfo(layoverCity);
    }

    // 3. Detección de Número de Vuelo
    const flightMatch =
      textUpper.match(/(?:FLIGHT|VUELO|VOO|N°|NO\.?)\s*[:.]?\s*([A-Z0-9]{2,3}\s?\d{3,4})/) ||
      textUpper.match(/\b(JA\s?\d{3,4}|LA\s?\d{3,4}|H2\s?\d{3,4}|G3\s?\d{3,4}|AD\s?\d{3,4}|IB\s?\d{3,4}|AV\s?\d{3,4}|CM\s?\d{3,4})\b/) ||
      textUpper.match(/\b([A-Z0-9]{2,3})\s?[-_]?\s?(\d{3,4})\b/);

    if (flightMatch) {
      flightFound = flightMatch[1] ? (flightMatch[2] ? `${flightMatch[1]} ${flightMatch[2]}` : flightMatch[1]) : flightMatch[0];
      setNewBookingNumeroVuelo(flightFound.trim());
    }

    // 4. Detección de Código de Reserva (PNR de 6 letras/números)
    const pnrMatches = textUpper.match(/\b([A-Z0-9]{6})\b/g);
    if (pnrMatches) {
      const ignoredWords = ['PASSEN', 'TICKET', 'VUELOS', 'FLIGHT', 'PASAJE', 'ITINER', 'CAMERA', 'IMAGEN', 'SCREEN', 'MOBILE', 'AIRLIN', 'LATAMX', 'DIRECT', 'ESCALA', 'AVANCE', 'NORMAL'];
      const validCode = pnrMatches.find(c => !ignoredWords.includes(c) && !/^\d+$/.test(c));
      if (validCode) {
        codeFound = validCode;
        setNewBookingCode(codeFound);
      }
    }

    // 5. Detección de Aerolínea
    if (textUpper.includes('LATAM')) airlineFound = 'LATAM Airlines';
    else if (textUpper.includes('JETSMART')) airlineFound = 'JetSmart';
    else if (textUpper.includes('SKY')) airlineFound = 'Sky Airline';
    else if (textUpper.includes('GOL')) airlineFound = 'Gol Linhas Aéreas';
    else if (textUpper.includes('AZUL')) airlineFound = 'Azul Linhas Aéreas';
    else if (textUpper.includes('AVIANCA')) airlineFound = 'Avianca';
    else if (textUpper.includes('IBERIA')) airlineFound = 'Iberia';
    else if (textUpper.includes('COPA')) airlineFound = 'Copa Airlines';
    else if (textUpper.includes('AIR EUROPA')) airlineFound = 'Air Europa';
    if (airlineFound) setNewBookingTitle(airlineFound);

    // 6. Detección de Asiento
    const seatMatch = textUpper.match(/(?:ASIENTO|SEAT|ASSENTO)\s*[:.]?\s*([0-9]{1,2}[A-F])/);
    if (seatMatch) {
      seatFound = seatMatch[1];
      setNewBookingAsiento(seatFound);
    }

    // 7. Detección de Puerta / Terminal
    const gateMatch = textUpper.match(/(?:PUERTA|GATE|PORTAO)\s*[:.]?\s*([A-Z0-9\s-]{2,8})/);
    if (gateMatch) {
      gateFound = gateMatch[1].trim();
      setNewBookingTerminalPuerta(gateFound);
    }

    // 8. Mensaje de éxito o retroalimentación
    if (flightFound || codeFound || airlineFound) {
      setAutoFillSuccessMsg(
        `✨ ¡Lector Óptico detectó datos! ${isReturn ? '🛬 Tramo: REGRESO' : '🛫 Tramo: IDA'} | Vuelo: ${flightFound || 'A revisar'} | Reserva: ${codeFound || 'A revisar'}${hasLayover ? ' | 🔄 Con escala' : ''}. Puedes editar cualquier campo manualmente.`
      );
    } else {
      setAutoFillSuccessMsg(
        `📸 Archivo "${fileName}" cargado. Puedes usar los botones de auto-completar ejemplo o ingresar los datos libremente.`
      );
    }
  };

  const applyDetectedLegToForm = (leg: DetectedFlightLeg) => {
    setNewBookingType('vuelo');
    setNewBookingTramoTipo(leg.tramoTipo as any || 'ida');
    setNewBookingTitle(leg.titulo);
    setNewBookingNumeroVuelo(leg.numeroVuelo);
    setNewBookingCode(leg.codigo);
    setNewBookingOrigen(leg.origen);
    setNewBookingDestino(leg.destino);
    setNewBookingDate(leg.fecha);
    setNewBookingTime(leg.hora);
    setNewBookingHoraLlegada(leg.horaLlegada);
    setNewBookingHasLayover(!!leg.hasLayover);
    setNewBookingLayoverInfo(leg.escala || '');
    setNewBookingBagDirect(leg.maletaDirecta);
  };

  const handleImportFullItinerary = () => {
    if (!detectedItinerary || !detectedItinerary.ida || !detectedItinerary.regreso) return;

    const idaDoc: SimpleBooking = {
      id: `pas-ida-${Date.now()}`,
      tipo: 'vuelo',
      tramoTipo: 'ida',
      titulo: `${detectedItinerary.ida.titulo} - ${detectedItinerary.ida.origen} ➔ ${detectedItinerary.ida.destino}`,
      codigo: detectedItinerary.pnr,
      numeroVuelo: detectedItinerary.ida.numeroVuelo,
      origen: detectedItinerary.ida.origen,
      destino: detectedItinerary.ida.destino,
      fecha: detectedItinerary.ida.fecha,
      hora: detectedItinerary.ida.hora,
      horaLlegada: detectedItinerary.ida.horaLlegada,
      maletaDirecta: true,
      notas: detectedItinerary.ida.notas,
      archivoNombre: newBookingFile?.name, archivoDataUrl: newBookingFile?.url
    };

    const regresoDoc: SimpleBooking = {
      id: `pas-reg-${Date.now() + 1}`,
      tipo: 'vuelo',
      tramoTipo: 'vuelta',
      titulo: `${detectedItinerary.regreso.titulo} - ${detectedItinerary.regreso.origen} ➔ ${detectedItinerary.regreso.destino}`,
      codigo: detectedItinerary.pnr,
      numeroVuelo: detectedItinerary.regreso.numeroVuelo,
      origen: detectedItinerary.regreso.origen,
      destino: detectedItinerary.regreso.destino,
      fecha: detectedItinerary.regreso.fecha,
      hora: detectedItinerary.regreso.hora,
      horaLlegada: detectedItinerary.regreso.horaLlegada,
      escala: detectedItinerary.regreso.escala,
      maletaDirecta: true,
      notas: detectedItinerary.regreso.notas,
      archivoNombre: newBookingFile?.name, archivoDataUrl: newBookingFile?.url
    };

    setTrip((prev) => ({
      ...prev,
      pasajesYDocumentos: [
        ...prev.pasajesYDocumentos.filter((b) => b.codigo !== detectedItinerary.pnr),
        idaDoc,
        regresoDoc
      ]
    }));

    setIsAddingBooking(false);
  };

  const handleTicketFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDetectedItinerary(null);
      setIsOcrScanning(true);
      setAutoFillSuccessMsg('🔍 Leyendo contenido del documento de pasaje o itinerario...');

      const reader = new FileReader();
      reader.onload = async () => {
        const fileDataUrl = reader.result as string;
        const fileObj = {
          name: file.name,
          url: fileDataUrl
        };
        setNewBookingFile(fileObj);

        let extractedText = '';

        if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
          // Extraer texto directamente del PDF
          try {
            extractedText = await extractTextFromPdf(file);
          } catch (pdfErr) {
            console.warn('Fallo extracción directa de PDF:', pdfErr);
          }
        } else if (file.type.startsWith('image/')) {
          // Extraer texto con OCR Tesseract
          try {
            const { createWorker } = await import('tesseract.js');
            const worker = await createWorker('spa+eng');
            const ret = await worker.recognize(fileDataUrl);
            await worker.terminate();
            if (ret && ret.data && ret.data.text) {
              extractedText = ret.data.text;
            }
          } catch (ocrErr) {
            console.warn('OCR diferido:', ocrErr);
          }
        }

        setIsOcrScanning(false);

        if (!extractedText.trim()) {
          extractedText = file.name;
        }

        const parsed = parseFullItinerary(extractedText, file.name, trip.origen, trip.destino);

        if (parsed.ida && parsed.regreso) {
          // ¡Detectó ambos vuelos del itinerario!
          setDetectedItinerary(parsed);
          setAutoFillSuccessMsg(
            `✨ ¡Itinerario Completo Detectado! Reserva: ${parsed.pnr}. Contiene Vuelo de Ida (${parsed.ida.numeroVuelo}) y Vuelo de Regreso con Escala (${parsed.regreso.numeroVuelo}). Puedes importarlo completo o editar cualquier campo.`
          );
          applyDetectedLegToForm(parsed.ida);
        } else if (parsed.ida || parsed.regreso) {
          const leg = parsed.ida || parsed.regreso!;
          applyDetectedLegToForm(leg);
          setAutoFillSuccessMsg(
            `✨ ¡Datos detectados del pasaje! Vuelo: ${leg.numeroVuelo} | Reserva: ${leg.codigo}. Puedes editar cualquier campo libremente.`
          );
        } else {
          parseTicketExtractedText(extractedText, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplySampleTicket = (variant: 'ida' | 'vuelta' | 'escala' = 'ida') => {
    setNewBookingType('vuelo');
    if (variant === 'ida') {
      setNewBookingTramoTipo('ida');
      setNewBookingTitle('JetSmart');
      setNewBookingNumeroVuelo('JA 560');
      setNewBookingCode('13N7JY');
      setNewBookingOrigen(`${trip.origen || 'Santiago'} (SCL)`);
      setNewBookingDestino(`${trip.destino || 'Florianópolis'} (FLN)`);
      setNewBookingDate(trip.fechaSalida || '2026-12-23');
      setNewBookingTime('07:45');
      setNewBookingHoraLlegada('11:15');
      setNewBookingAsiento('12C');
      setNewBookingTerminalPuerta('T2 - Puerta 14');
      setNewBookingHasLayover(false);
      setNewBookingLayoverInfo('');
      setNewBookingBagDirect(true);
      setAutoFillSuccessMsg('✨ ¡Vuelo de IDA auto-completado! Puedes revisar o editar cualquier dato antes de guardar.');
    } else if (variant === 'vuelta') {
      setNewBookingTramoTipo('vuelta');
      setNewBookingTitle('JetSmart');
      setNewBookingNumeroVuelo('JA 561');
      setNewBookingCode('13N7JY');
      setNewBookingOrigen(`${trip.destino || 'Florianópolis'} (FLN)`);
      setNewBookingDestino(`${trip.origen || 'Santiago'} (SCL)`);
      setNewBookingDate(trip.fechaRegreso || '2026-12-30');
      setNewBookingTime('16:20');
      setNewBookingHoraLlegada('20:10');
      setNewBookingAsiento('14A');
      setNewBookingTerminalPuerta('T1 - Puerta 6');
      setNewBookingHasLayover(false);
      setNewBookingLayoverInfo('');
      setNewBookingBagDirect(true);
      setAutoFillSuccessMsg('✨ ¡Vuelo de REGRESO DIRECTO auto-completado! Todo listo para revisar o guardar.');
    } else if (variant === 'escala') {
      setNewBookingTramoTipo('vuelta');
      setNewBookingTitle('LATAM Airlines');
      setNewBookingNumeroVuelo('LA 3314');
      setNewBookingCode('9K7PL2');
      setNewBookingOrigen(`${trip.destino || 'Florianópolis'} (FLN)`);
      setNewBookingDestino(`${trip.origen || 'Santiago'} (SCL)`);
      setNewBookingDate(trip.fechaRegreso || '2026-12-30');
      setNewBookingTime('13:10');
      setNewBookingHoraLlegada('19:40');
      setNewBookingAsiento('18F');
      setNewBookingTerminalPuerta('T1 - Puerta 3');
      setNewBookingHasLayover(true);
      setNewBookingLayoverInfo('Escala de 2h 15m en São Paulo (Guarulhos GRU)');
      setNewBookingBagDirect(true);
      setAutoFillSuccessMsg('✨ ¡Vuelo de REGRESO CON ESCALA auto-completado! Incluye conexión y aviso de equipaje directo.');
    }
  };



  const [isEditingLodging, setIsEditingLodging] = useState(false);
  const [lodgingForm, setLodgingForm] = useState<LodgingInfo>(trip.alojamiento);

  const [previewDoc, setPreviewDoc] = useState<{ title: string; url: string; isPdf: boolean } | null>(null);

  const [isEditingHealth, setIsEditingHealth] = useState(false);
  const [healthForm, setHealthForm] = useState<HealthInfo>(trip.salud);

  const [isEditingSos, setIsEditingSos] = useState(false);
  const [sosForm, setSosForm] = useState({
    familiarNombre: trip.familiarNombre,
    familiarTelefono: trip.familiarTelefono,
    consuladoNombre: trip.consuladoNombre,
    consuladoTelefono: trip.consuladoTelefono,
    consuladoDireccion: trip.consuladoDireccion
  });

  // Estados para Origen del Viajero
  const [targetOrigin, setTargetOrigin] = useState<string>(trip.origen || 'Santiago');

  // Modal para editar Centro Médico / Clínica
  const [isEditingHospitalModal, setIsEditingHospitalModal] = useState(false);
  const [hospitalForm, setHospitalForm] = useState({
    nombre: trip.salud.hospitalCercanoNombre || '',
    direccion: trip.salud.hospitalCercanoDireccion || '',
    telefono: trip.salud.hospitalCercanoTelefono || ''
  });

  const openEditHospitalModal = () => {
    setHospitalForm({
      nombre: trip.salud.hospitalCercanoNombre || '',
      direccion: trip.salud.hospitalCercanoDireccion || '',
      telefono: trip.salud.hospitalCercanoTelefono || ''
    });
    setIsEditingHospitalModal(true);
  };

  const handleSaveHospital = (e: React.FormEvent) => {
    e.preventDefault();
    setTrip((prev) => ({
      ...prev,
      salud: {
        ...prev.salud,
        hospitalCercanoNombre: hospitalForm.nombre.trim(),
        hospitalCercanoDireccion: hospitalForm.direccion.trim(),
        hospitalCercanoTelefono: hospitalForm.telefono.trim()
      }
    }));
    setIsEditingHospitalModal(false);
  };

  // Modal para editar Contacto Familiar en Casa
  const [isEditingFamiliarModal, setIsEditingFamiliarModal] = useState(false);
  const [familiarForm, setFamiliarForm] = useState({
    nombre: trip.familiarNombre || '',
    telefono: trip.familiarTelefono || ''
  });

  const openEditFamiliarModal = () => {
    setFamiliarForm({
      nombre: trip.familiarNombre || '',
      telefono: trip.familiarTelefono || ''
    });
    setIsEditingFamiliarModal(true);
  };

  const handleSaveFamiliar = (e: React.FormEvent) => {
    e.preventDefault();
    setTrip((prev) => ({
      ...prev,
      familiarNombre: familiarForm.nombre.trim() || 'Familiar en Casa',
      familiarTelefono: familiarForm.telefono.trim() || ''
    }));
    setIsEditingFamiliarModal(false);
  };

  // Estados para Selección y Personalización de Destino (País + Ciudad separados)
  const [targetCountryKey, setTargetCountryKey] = useState<string>(trip.paisKey || 'brasil');
  const [targetCity, setTargetCity] = useState<string>(trip.destino || 'Florianópolis');
  const [countrySearchQuery, setCountrySearchQuery] = useState<string>('');
  const [isCustomCountryMode, setIsCustomCountryMode] = useState<boolean>(false);
  const [customCountryForm, setCustomCountryForm] = useState({
    pais: '',
    moneda: '',
    enchufe: '',
    voltaje: '',
    clima: '',
    ambulancia: ''
  });
  const [isEditingAdvancedDetails, setIsEditingAdvancedDetails] = useState<boolean>(false);
  const [manualCurrencyOverride, setManualCurrencyOverride] = useState<string>('');
  const [manualEnchufeOverride, setManualEnchufeOverride] = useState<string>('');

  const openChangeDestinationModal = () => {
    setTargetOrigin(trip.origen || 'Santiago');
    setTargetCountryKey(trip.paisKey || 'brasil');
    setTargetCity(trip.destino || 'Florianópolis');
    setCountrySearchQuery('');
    setIsEditingAdvancedDetails(false);
    setManualCurrencyOverride('');
    setManualEnchufeOverride('');

    if (trip.paisKey === 'custom') {
      setIsCustomCountryMode(true);
      setCustomCountryForm({
        pais: trip.pais,
        moneda: trip.moneda,
        enchufe: trip.enchufe,
        voltaje: trip.voltaje,
        clima: trip.clima,
        ambulancia: trip.salud.numeroAmbulanciaLocal
      });
    } else {
      setIsCustomCountryMode(false);
    }
    setShowChangeCountryModal(true);
  };

  const handleSelectCountryInModal = (countryKey: string) => {
    setTargetCountryKey(countryKey);
    setIsCustomCountryMode(false);
    const preset = DESTINATIONS[countryKey];
    if (preset) {
      const prevPreset = DESTINATIONS[targetCountryKey];
      // Si la ciudad estaba vacía o era el valor por defecto del país anterior, sugerir la nueva
      if (!targetCity.trim() || (prevPreset && targetCity === prevPreset.destinoDefault)) {
        setTargetCity(preset.destinoDefault);
      }
    }
  };

  const handleApplyDestination = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const finalOrigin = targetOrigin.trim() || trip.origen || 'Santiago';

    if (isCustomCountryMode) {
      const matched = findCountryPreset(customCountryForm.pais);
      const finalCountry = customCountryForm.pais.trim() || (matched ? matched.pais : 'Destino Internacional');
      const finalCity = targetCity.trim() || (matched ? matched.destinoDefault : finalCountry);
      const finalMoneda = manualCurrencyOverride.trim() || customCountryForm.moneda.trim() || (matched ? matched.moneda : 'Moneda Local / Dólar USD');
      const finalEnchufe = manualEnchufeOverride.trim() || customCountryForm.enchufe.trim() || (matched ? matched.enchufe : 'Adaptador Universal (Tipo A, C o G)');
      const finalVoltaje = customCountryForm.voltaje.trim() || (matched ? matched.voltaje : '110V - 240V');
      const finalClima = customCountryForm.clima.trim() || (matched ? matched.clima : 'Clima de temporada');
      const emNumbers = getEmergencyNumbers(finalCountry);

      setTrip((prev) => {
        const countryChanged = prev.pais !== finalCountry || prev.destino !== finalCity;
        return {
          ...prev,
          paisKey: matched ? (Object.keys(DESTINATIONS).find((k) => DESTINATIONS[k].pais === matched.pais) || 'custom') : 'custom',
          pais: finalCountry,
          origen: finalOrigin,
          destino: finalCity,
          bandera: matched ? matched.bandera : '🌍',
          nombre: `Viaje a ${finalCity}, ${finalCountry}`,
          moneda: finalMoneda,
          enchufe: finalEnchufe,
          voltaje: finalVoltaje,
          clima: finalClima,
          consuladoNombre: matched ? matched.consuladoDefault : `Consulado / Embajada en ${finalCountry}`,
          consuladoTelefono: matched ? matched.consuladoTelDefault : '+1 800 000 000',
          consuladoDireccion: matched ? matched.consuladoDirDefault : `Capital de ${finalCountry}`,
          movilidad: matched ? matched.movilidad : {
            llegadaAeropuerto: `Usa transporte oficial autorizado en el aeropuerto o terminal de ${finalCity}. Evita transportes informales.`,
            appsYTransporte: `Averigua si en ${finalCountry} opera Uber u otra app local y cómo funciona el pago de buses/metro.`,
            alquilerYConduccion: `Consulta si exigen Licencia de Conducir Internacional o si basta tu licencia nacional en ${finalCountry}.`,
            mapasOffline: `Descarga el mapa sin conexión de ${finalCity} en Google Maps antes de salir del hotel.`,
            costumbresDinero: `Lleva una parte en efectivo de ${finalMoneda} y activa tus tarjetas de débito/crédito para compras en el extranjero.`
          },
          salud: {
            ...prev.salud,
            numeroAmbulanciaLocal: emNumbers.ambulancia,
            numeroPoliciaLocal: emNumbers.policia,
            numeroBomberosLocal: emNumbers.bomberos,
            hospitalCercanoNombre: countryChanged ? '' : prev.salud.hospitalCercanoNombre,
            hospitalCercanoDireccion: countryChanged ? '' : prev.salud.hospitalCercanoDireccion,
            hospitalCercanoTelefono: countryChanged ? '' : prev.salud.hospitalCercanoTelefono
          }
        };
      });
    } else {
      const preset = DESTINATIONS[targetCountryKey] || DESTINATIONS.brasil;
      const finalCity = targetCity.trim() || preset.destinoDefault;
      const finalMoneda = manualCurrencyOverride.trim() || preset.moneda;
      const finalEnchufe = manualEnchufeOverride.trim() || preset.enchufe;
      const emNumbers = getEmergencyNumbers(preset.pais);

      setTrip((prev) => {
        const countryChanged = prev.paisKey !== targetCountryKey || prev.destino !== finalCity;
        return {
          ...prev,
          paisKey: targetCountryKey,
          pais: preset.pais,
          origen: finalOrigin,
          destino: finalCity,
          bandera: preset.bandera,
          nombre: `Viaje a ${finalCity}, ${preset.pais}`,
          moneda: finalMoneda,
          enchufe: finalEnchufe,
          voltaje: preset.voltaje,
          clima: preset.clima,
          tipoViaje: preset.tipoViajeDefault,
          consuladoNombre: preset.consuladoDefault,
          consuladoTelefono: preset.consuladoTelDefault,
          consuladoDireccion: preset.consuladoDirDefault,
          movilidad: preset.movilidad,
          salud: {
            ...prev.salud,
            numeroAmbulanciaLocal: emNumbers.ambulancia,
            numeroPoliciaLocal: emNumbers.policia,
            numeroBomberosLocal: emNumbers.bomberos,
            hospitalCercanoNombre: countryChanged ? '' : prev.salud.hospitalCercanoNombre,
            hospitalCercanoDireccion: countryChanged ? '' : prev.salud.hospitalCercanoDireccion,
            hospitalCercanoTelefono: countryChanged ? '' : prev.salud.hospitalCercanoTelefono
          }
        };
      });
      setPackDestinationType(preset.tipoViajeDefault);
    }
    setShowChangeCountryModal(false);
  };

  useEffect(() => {
    localStorage.setItem('viaja_facil_simple_v10', JSON.stringify(trip));
  }, [trip]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleLuggage = (id: string) => {
    setTrip((prev) => ({
      ...prev,
      equipaje: prev.equipaje.map((item) =>
        item.id === id ? { ...item, listo: !item.listo } : item
      )
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: { name: string; url: string } | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setter({
          name: file.name,
          url: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateSmartPacking = () => {
    const days = Math.max(1, packDays);
    const bottomsCount = days <= 3 ? 2 : days <= 7 ? 3 : 4;
    const topsCount = days <= 3 ? 3 : days <= 7 ? 5 : 7;

    const newLuggageList: LuggageItem[] = [
      { id: `inf-1`, nombre: 'Cédula física o Pasaporte vigente (en bolso de mano)', categoria: 'infaltable', listo: false },
      { id: `inf-2`, nombre: 'Dinero dividido: billetera pequeña para el día y fondo grueso oculto o en caja fuerte', categoria: 'infaltable', listo: false },
      { id: `inf-3`, nombre: 'Tarjetas bancarias activadas para compras internacionales', categoria: 'infaltable', listo: false },
      { id: `inf-4`, nombre: 'Medicamentos personales con receta médica original', categoria: 'infaltable', listo: false },
      { id: `inf-5`, nombre: `Adaptador de enchufe (${trip.enchufe.split('(')[0].trim()})`, categoria: 'infaltable', listo: false },
      { id: `inf-6`, nombre: 'Batería externa portátil (Power bank en bolso de mano por ley de vuelo)', categoria: 'infaltable', listo: false },

      {
        id: `cap-1`,
        nombre: `${bottomsCount} Partes de abajo: ${packDestinationType === 'playa' ? 'shorts de lino/algodón y pantalón fresco' : 'pantalones versátiles'}`,
        categoria: 'capsula',
        listo: false
      },
      {
        id: `cap-2`,
        nombre: `${topsCount} Partes de arriba: poleras o blusas combinables entre sí`,
        categoria: 'capsula',
        listo: false
      },
      {
        id: `cap-3`,
        nombre: packDestinationType === 'playa'
          ? '1 Chaqueta cortaviento liviana / paraguas de bolsillo'
          : '1 Chaqueta o abrigo combinable',
        categoria: 'capsula',
        listo: false
      },
      {
        id: `cap-4`,
        nombre: packDestinationType === 'playa'
          ? '2 Trajes de baño y sandalias cómodas de playa'
          : 'Calzado cómodo para caminar todo el día',
        categoria: 'capsula',
        listo: false
      },

      { id: `gen-1`, nombre: `${days} mudas de ropa interior (1 para cada día)`, categoria: 'ropa', listo: false },
      { id: `gen-2`, nombre: 'Bolsa de tela para separar la ropa sucia', categoria: 'ropa', listo: false }
    ];

    setTrip((prev) => ({
      ...prev,
      diasViaje: days,
      tipoViaje: packDestinationType,
      equipaje: newLuggageList
    }));
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: LuggageItem = {
      id: `custom-${Date.now()}`,
      nombre: newItemName.trim(),
      categoria: 'personal',
      listo: false
    };

    setTrip((prev) => ({
      ...prev,
      equipaje: [...prev.equipaje, newItem]
    }));
    setNewItemName('');
  };

  const handleResetChecklist = () => {
    setTrip((prev) => ({
      ...prev,
      equipaje: prev.equipaje.map((item) => ({ ...item, listo: false }))
    }));
  };

  const handleAddBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookingCode.trim()) return;

    const computedTitle = newBookingTitle.trim() || (newBookingType === 'vuelo'
      ? `${newBookingNumeroVuelo ? newBookingNumeroVuelo + ' - ' : ''}${newBookingOrigen || 'Origen'} ➔ ${newBookingDestino || 'Destino'}`
      : 'Traslado Terrestre');

    const isConnectionLeg = newBookingType === 'vuelo' && newBookingTramoTipo === 'escala';
    const hasLayover = newBookingType === 'vuelo' && (isConnectionLeg || newBookingHasLayover);
    const computedEscala = hasLayover
      ? (newBookingLayoverInfo.trim() || (isConnectionLeg ? 'Conexión / Escala' : 'Con escala'))
      : undefined;

    const newBooking: SimpleBooking = {
      id: `booking-${Date.now()}`,
      tipo: newBookingType,
      tramoTipo: newBookingType === 'vuelo' ? newBookingTramoTipo : undefined,
      titulo: computedTitle,
      codigo: newBookingCode.trim().toUpperCase(),
      numeroVuelo: newBookingType === 'vuelo' ? (newBookingNumeroVuelo.trim().toUpperCase() || undefined) : undefined,
      origen: newBookingOrigen.trim() || undefined,
      destino: newBookingDestino.trim() || undefined,
      asiento: newBookingAsiento.trim() || undefined,
      terminalPuerta: newBookingTerminalPuerta.trim() || undefined,
      fecha: newBookingDate || 'Fecha por confirmar',
      hora: newBookingTime || '',
      horaLlegada: newBookingHoraLlegada || '',
      escala: computedEscala,
      maletaDirecta: hasLayover ? newBookingBagDirect : true,
      archivoNombre: newBookingFile?.name,
      archivoDataUrl: newBookingFile?.url
    };

    setTrip((prev) => ({
      ...prev,
      pasajesYDocumentos: [...prev.pasajesYDocumentos, newBooking]
    }));

    setIsAddingBooking(false);
    setNewBookingTitle('');
    setNewBookingCode('');
    setNewBookingNumeroVuelo('');
    setNewBookingOrigen('');
    setNewBookingDestino('');
    setNewBookingAsiento('');
    setNewBookingTerminalPuerta('');
    setNewBookingDate('');
    setNewBookingTime('');
    setNewBookingHoraLlegada('');
    setNewBookingHasLayover(false);
    setNewBookingLayoverInfo('');
    setNewBookingFile(null);
    setAutoFillSuccessMsg(null);
  };

  const handleSaveInsuranceModal = (e: React.FormEvent) => {
    e.preventDefault();
    setTrip((prev) => ({
      ...prev,
      salud: {
        ...prev.salud,
        tieneSeguro: true,
        seguroCompania: insuranceForm.compania.trim() || 'Seguro de Viaje',
        seguroPoliza: insuranceForm.poliza.trim().toUpperCase(),
        seguroFechaInicio: insuranceForm.fechaInicio,
        seguroFechaFin: insuranceForm.fechaFin,
        seguroTelefono: insuranceForm.telefonoDestino.trim(),
        seguroTelefonoOrigen: insuranceForm.telefonoOrigen.trim(),
        seguroEmail: insuranceForm.email.trim()
      }
    }));
    setIsEditingInsuranceModal(false);
  };

  const deleteBooking = (id: string) => {
    setTrip((prev) => ({
      ...prev,
      pasajesYDocumentos: prev.pasajesYDocumentos.filter((b) => b.id !== id)
    }));
  };

  const handleSaveLodging = (e: React.FormEvent) => {
    e.preventDefault();
    setTrip((prev) => ({
      ...prev,
      alojamiento: { ...lodgingForm }
    }));
    setIsEditingLodging(false);
  };

  const handleSaveHealth = (e: React.FormEvent) => {
    e.preventDefault();
    setTrip((prev) => ({
      ...prev,
      salud: { ...healthForm }
    }));
    setIsEditingHealth(false);
  };

  const handleSaveSos = (e: React.FormEvent) => {
    e.preventDefault();
    setTrip((prev) => ({
      ...prev,
      ...sosForm
    }));
    setIsEditingSos(false);
  };

  const bottoms = trip.diasViaje <= 3 ? 2 : trip.diasViaje <= 7 ? 3 : 4;
  const tops = trip.diasViaje <= 3 ? 3 : trip.diasViaje <= 7 ? 5 : 7;
  const combinations = bottoms * tops;

  const totalItems = trip.equipaje.length;
  const readyItems = trip.equipaje.filter((i) => i.listo).length;
  const progressPercent = totalItems > 0 ? Math.round((readyItems / totalItems) * 100) : 0;

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-950 text-slate-100 flex flex-col font-sans pb-24 sm:pb-8 selection:bg-amber-500 selection:text-slate-950">
      
      {/* Header Superior */}
      <header className="border-b border-slate-800 bg-slate-900/95 sticky top-0 z-40 backdrop-blur w-full">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/25 shrink-0 border border-white/20">
              <Compass className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="font-extrabold text-white text-sm sm:text-base tracking-tight truncate">
                  Viaja Fácil
                </h1>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/30 shrink-0">
                  Bitácora
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                {trip.destino}, {trip.pais}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={openChangeDestinationModal}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-xl text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
              title="Cambiar país o destino"
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Destino</span>
            </button>

            <button
              onClick={() => setShowSosModal(true)}
              className="px-2.5 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 border border-rose-500/40 rounded-xl text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>SOS</span>
            </button>
          </div>
        </div>

        {/* 
          BARRA DE 4 BOTONES DE NAVEGACIÓN: 
          Diseñada para caber al 100% en pantallas móviles estrechas (320px - 390px) 
          con 4 columnas exactas (25% cada una), iconos claros y etiquetas compactas.
        */}
        <div className="border-t border-slate-800/80 bg-slate-950/95 w-full px-1.5 py-1">
          <nav className="max-w-2xl mx-auto grid grid-cols-5 gap-1 w-full" aria-label="Navegación principal">
            <button
              onClick={() => setActiveTab('pasajes')}
              className={`py-1.5 px-0.5 rounded-xl text-[10px] sm:text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 w-full cursor-pointer ${
                activeTab === 'pasajes'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Plane className="w-4 h-4 shrink-0" />
              <span className="truncate w-full text-center">1. Pasajes</span>
            </button>

            <button
              onClick={() => setActiveTab('equipaje')}
              className={`py-1.5 px-0.5 rounded-xl text-[10px] sm:text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 w-full cursor-pointer ${
                activeTab === 'equipaje'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Luggage className="w-4 h-4 shrink-0 text-amber-300" />
              <span className="truncate w-full text-center">2. Equipaje</span>
            </button>

            <button
              onClick={() => setActiveTab('moverte')}
              className={`py-1.5 px-0.5 rounded-xl text-[10px] sm:text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 w-full cursor-pointer ${
                activeTab === 'moverte'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Car className="w-4 h-4 shrink-0 text-cyan-300" />
              <span className="truncate w-full text-center">3. Movilidad</span>
            </button>

            <button
              onClick={() => setActiveTab('salud')}
              className={`py-1.5 px-0.5 rounded-xl text-[10px] sm:text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 w-full cursor-pointer ${
                activeTab === 'salud'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Stethoscope className="w-4 h-4 shrink-0 text-emerald-400" />
              <span className="truncate w-full text-center">4. Salud</span>
            </button>

            <button
              onClick={() => setActiveTab('tips')}
              className={`py-1.5 px-0.5 rounded-xl text-[10px] sm:text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 w-full cursor-pointer ${
                activeTab === 'tips'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                  : 'text-amber-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
              <span className="truncate w-full text-center">5. Reglas Oro</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-3 sm:px-4 py-4 space-y-4">
        
        {/* ========================================================================= */}
        {/* --- PÁGINA 1: MIS PASAJES & SEGURO (CON EL CUADRO RESUMEN Y CAMBIAR DESTINO) --- */}
        {/* ========================================================================= */}
        {activeTab === 'pasajes' && (
          <div className="space-y-4">
            {/* El Cuadrito Resumen (ÚNICAMENTE en esta primera página) */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/50 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" /> <span>{trip.origen}</span> <span className="text-slate-500">➔</span> <span className="text-white font-extrabold">{trip.destino}</span> <span className="text-slate-400">({trip.pais})</span> <span className="text-base">{trip.bandera}</span>
                </span>
                <button
                  onClick={openChangeDestinationModal}
                  className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg text-[11px] font-bold flex items-center gap-1 border border-amber-500/30 cursor-pointer transition"
                >
                  <Globe2 className="w-3.5 h-3.5" /> Cambiar País o Ciudad
                </button>
              </div>

              <h2 className="text-base sm:text-lg font-black text-white">{trip.nombre}</h2>
              <div className="flex items-center justify-between gap-2 mt-1">
                <p className="text-xs text-slate-300">
                  Contacto familiar en casa: <strong className="text-cyan-300">{trip.familiarNombre} {trip.familiarTelefono ? `(${trip.familiarTelefono})` : ''}</strong>
                </p>
                <button
                  type="button"
                  onClick={openEditFamiliarModal}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-[10px] font-bold flex items-center gap-1 transition cursor-pointer shrink-0"
                >
                  <Edit3 className="w-3 h-3" /> Editar
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-bold uppercase">Enchufe &amp; Voltaje:</span>
                  <strong className="text-cyan-300 text-xs block truncate">{trip.enchufe}</strong>
                  <span className="text-[10px] text-amber-300">{trip.voltaje}</span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-bold uppercase">Moneda &amp; Clima:</span>
                  <strong className="text-emerald-300 text-xs block truncate">{trip.moneda}</strong>
                  <span className="text-[10px] text-slate-300 line-clamp-2">{trip.clima}</span>
                </div>
              </div>
            </div>

            {/* Listado de Pasajes y Traslados */}
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white">Pasajes de Vuelo &amp; Traslados</h3>
                <p className="text-xs text-slate-400">Ten a mano tus códigos de reserva, escalas y comprobantes.</p>
              </div>
              <button
                onClick={openAddBookingModal}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition shadow cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" /> Agregar Pasaje
              </button>
            </div>

            {/* Tarjetas de Vuelos y Traslados */}
            {trip.pasajesYDocumentos.filter((d) => d.tipo !== 'seguro').length === 0 ? (
              <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-5 text-center text-xs text-slate-400">
                <Plane className="w-6 h-6 mx-auto mb-1.5 text-slate-600" />
                <p className="font-semibold text-slate-300">No tienes pasajes de vuelo ni traslados agregados aún.</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Guarda tu código de reserva, horarios y confirmación de vuelo.</p>
                <button
                  onClick={openAddBookingModal}
                  className="mt-2.5 px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 text-cyan-300 border border-blue-500/40 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> + Agregar primer pasaje o traslado
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {trip.pasajesYDocumentos
                  .filter((doc) => doc.tipo !== 'seguro')
                  .map((doc) => (
                    <div
                      key={doc.id}
                      className={`border rounded-2xl p-4 shadow-md transition ${
                        doc.tipo === 'transporte'
                          ? 'bg-slate-900/90 border-amber-500/40'
                          : 'bg-slate-900 border-cyan-500/30'
                      }`}
                    >
                      {/* Header de la tarjeta con Tipo, Tramo y Eliminar */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          {doc.tipo === 'vuelo' ? (
                            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                              <Plane className="w-4 h-4 text-cyan-400" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                              <Bus className="w-4 h-4 text-amber-400" />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-black text-white text-sm">{doc.titulo}</span>
                              {doc.tipo === 'vuelo' ? (
                                <>
                                  <span
                                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                                      doc.tramoTipo === 'ida'
                                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                                        : doc.tramoTipo === 'vuelta'
                                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                    }`}
                                  >
                                    {doc.tramoTipo === 'ida'
                                      ? '🛫 Vuelo de Ida'
                                      : doc.tramoTipo === 'vuelta'
                                      ? '🛬 Vuelo de Regreso'
                                      : '🔄 Conexión / Escala'}
                                  </span>
                                  {doc.tramoTipo !== 'escala' && (!doc.escala || doc.escala.toLowerCase().includes('directo') || doc.escala.toLowerCase().includes('sin escala')) && (
                                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                      🟢 Vuelo directo
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                  🚌 Traslado / Bus
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteBooking(doc.id)}
                          className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                          title="Eliminar este pasaje"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Cuadro Destacado con Códigos Clave (Vuelo y Reserva) */}
                      {doc.tipo === 'vuelo' ? (
                        <div className="grid grid-cols-2 gap-2 mt-2.5">
                          {/* NÚMERO DE VUELO (el que anuncian en el aeropuerto) */}
                          <div className="bg-slate-950 p-2.5 rounded-xl border border-cyan-500/40 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-cyan-400 font-bold uppercase flex items-center gap-1">
                                  <Plane className="w-3 h-3" /> N° de Vuelo
                                </span>
                                {doc.numeroVuelo && (
                                  <button
                                    onClick={() => copyToClipboard(doc.numeroVuelo!, `flight-${doc.id}`)}
                                    className="text-[10px] text-cyan-400 hover:underline font-bold cursor-pointer"
                                  >
                                    {copiedKey === `flight-${doc.id}` ? '✓ Copiado' : 'Copiar'}
                                  </button>
                                )}
                              </div>
                              <strong className="text-base sm:text-lg font-black text-white font-mono tracking-wider block mt-1">
                                {doc.numeroVuelo || 'No especificado'}
                              </strong>
                            </div>
                            <span className="text-[9px] text-slate-400 mt-1 block">
                              El que sale en pantallas y altavoces
                            </span>
                          </div>

                          {/* CÓDIGO DE RESERVA / PNR (el de 6 letras para check-in) */}
                          <div className="bg-slate-950 p-2.5 rounded-xl border border-blue-500/40 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-blue-400 font-bold uppercase flex items-center gap-1">
                                  <Ticket className="w-3 h-3" /> Código Reserva (PNR)
                                </span>
                                <button
                                  onClick={() => copyToClipboard(doc.codigo, doc.id)}
                                  className="text-[10px] text-blue-400 hover:underline font-bold cursor-pointer"
                                >
                                  {copiedKey === doc.id ? '✓ Copiado' : 'Copiar'}
                                </button>
                              </div>
                              <strong className="text-base sm:text-lg font-black text-cyan-300 font-mono tracking-widest block mt-1">
                                {doc.codigo}
                              </strong>
                            </div>
                            <span className="text-[9px] text-slate-400 mt-1 block">
                              Para tu check-in online o counter
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* Cuadro para Bus / Traslado */
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-amber-500/40 flex items-center justify-between mt-2.5">
                          <div>
                            <span className="text-[10px] text-amber-400 font-bold uppercase block">
                              🎫 Código de Billete / Voucher
                            </span>
                            <strong className="text-base font-black text-amber-300 font-mono tracking-wider block mt-0.5">
                              {doc.codigo}
                            </strong>
                          </div>
                          <button
                            onClick={() => copyToClipboard(doc.codigo, doc.id)}
                            className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            {copiedKey === doc.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedKey === doc.id ? '¡Copiado!' : 'Copiar'}</span>
                          </button>
                        </div>
                      )}

                      {/* Trayecto, Fechas y Asiento */}
                      <div className="text-xs text-slate-300 space-y-1.5 mt-2.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                        {(doc.origen || doc.destino) && (
                          <div className="flex items-center gap-1.5 font-semibold text-white">
                            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>
                              {doc.origen || 'Origen'} ➔ {doc.destino || 'Destino'}
                            </span>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3 text-slate-300 text-[11px]">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" /> {doc.fecha}
                          </span>
                          {doc.hora && (
                            <span className="flex items-center gap-1 text-cyan-300 font-semibold">
                              <Clock className="w-3.5 h-3.5" /> Salida: {doc.hora}
                            </span>
                          )}
                          {doc.horaLlegada && (
                            <span className="text-slate-400">
                              (Llegada estimada: {doc.horaLlegada})
                            </span>
                          )}
                        </div>

                        {(doc.asiento || doc.terminalPuerta) && (
                          <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-800 text-[11px] text-amber-300">
                            {doc.asiento && (
                              <span>💺 Asiento: <strong>{doc.asiento}</strong></span>
                            )}
                            {doc.terminalPuerta && (
                              <span>🚪 {doc.terminalPuerta}</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Escala o Conexión (SOLO si realmente tiene escala o es tramo de conexión) */}
                      {doc.tipo === 'vuelo' && (
                        (doc.escala && !doc.escala.toLowerCase().includes('directo') && !doc.escala.toLowerCase().includes('sin escala')) ||
                        doc.tramoTipo === 'escala'
                      ) && (
                        <div className="mt-2.5 p-2.5 bg-slate-950 rounded-xl border border-amber-500/30 text-xs">
                          <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                            <CornerDownRight className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              {doc.tramoTipo === 'escala'
                                ? (doc.escala ? `Conexión / Escala: ${doc.escala}` : 'Tramo de conexión / escala')
                                : `Escala: ${doc.escala}`}
                            </span>
                          </div>
                          <div className="text-[11px] mt-1 pl-5">
                            {doc.maletaDirecta ? (
                              <span className="text-emerald-400 font-medium">
                                ✓ {doc.tramoTipo === 'escala'
                                  ? 'Tu equipaje viene transferido directo (no lo retiras en esta conexión).'
                                  : 'Tu equipaje facturado va directo al destino final (no lo retiras en la escala).'}
                              </span>
                            ) : (
                              <span className="text-amber-400 font-medium">
                                ⚠️ {doc.tramoTipo === 'escala'
                                  ? 'Debes retirar tu equipaje y volver a facturarlo para este tramo.'
                                  : 'Debes retirar tu equipaje en la escala y volver a facturarlo.'}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Archivo comprobante adjunto */}
                      {doc.archivoNombre && (
                        <div className="mt-2.5 p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 text-cyan-300 font-medium truncate">
                            <FileText className="w-4 h-4 shrink-0" />
                            <span className="truncate">{doc.archivoNombre}</span>
                          </div>
                          {doc.archivoDataUrl && (
                            <button
                              onClick={() =>
                                setPreviewDoc({
                                  title: doc.titulo,
                                  url: doc.archivoDataUrl!,
                                  isPdf: doc.archivoNombre!.toLowerCase().endsWith('.pdf')
                                })
                              }
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                            >
                              <Eye className="w-3 h-3" /> Ver comprobante
                            </button>
                          )}
                        </div>
                      )}

                      {/* Botones de acción rápida: Copiar Códigos (¡Sin teléfonos inútiles para pilotos o buses!) */}
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => copyToClipboard(doc.codigo, doc.id)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                        >
                          {copiedKey === doc.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === doc.id ? '¡Código copiado!' : 'Copiar código de reserva'}</span>
                        </button>
                        {doc.numeroVuelo && (
                          <button
                            onClick={() => copyToClipboard(doc.numeroVuelo!, `btn-${doc.id}`)}
                            className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-cyan-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer border border-cyan-800/50"
                          >
                            {copiedKey === `btn-${doc.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Plane className="w-3.5 h-3.5" />}
                            <span>{copiedKey === `btn-${doc.id}` ? '¡Vuelo copiado!' : `Copiar N° ${doc.numeroVuelo}`}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            

            {/* Mensajito facilitador sugerido por la usuaria */}
            <div className="py-2.5 px-3 text-center text-xs text-slate-400 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>💡 Carga tu itinerario en PDF o ingresa tus vuelos de forma manual.</span>
            </div>

            {/* Recordatorio discreto en color oro para las Reglas de Oro */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('tips');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-2.5 px-3 text-center text-xs text-amber-300 hover:text-amber-200 bg-amber-950/20 hover:bg-amber-950/40 rounded-xl border border-amber-500/30 hover:border-amber-500/50 flex items-center justify-center gap-2 transition cursor-pointer group shadow-sm"
              title="Ir a las Reglas de Oro"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-medium tracking-wide">✨ No olvides revisar las <strong className="font-bold underline decoration-amber-500/50 underline-offset-2 text-amber-300">Reglas de Oro</strong></span>
              <span className="text-[10px] text-amber-400/80 group-hover:translate-x-0.5 transition-transform font-bold">➔</span>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* --- PÁGINA 2: INFALTABLES & ARMARIO (CON DINERO SEPARADO MUY VISIBLE) --- */}
        {/* ========================================================================= */}
        {activeTab === 'equipaje' && (
          <div className="space-y-4">
            
            {/* 1. LOS INFALTABLES (Lo que no se compra en destino) */}
            <div className="bg-slate-900 border border-rose-500/40 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-sm font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  Los Infaltables (Lo que jamás se compra en destino)
                </h3>
              </div>
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                Toca cada circulito mientras empacas en tu cama o bolso:
              </p>

              <div className="space-y-2">
                {trip.equipaje
                  .filter((i) => i.categoria === 'infaltable')
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleLuggage(item.id)}
                      className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 cursor-pointer ${
                        item.listo
                          ? 'bg-slate-950/40 border-slate-800 opacity-60'
                          : 'bg-slate-950 border-rose-500/40 hover:border-rose-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition ${
                          item.listo ? 'border-emerald-400 bg-emerald-500/20' : 'border-slate-500'
                        }`}>
                          {item.listo && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                        <span className={`text-xs ${item.listo ? 'line-through text-slate-400' : 'text-white font-medium'}`}>
                          {item.nombre}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* 3. ARMARIO CÁPSULA (50% DE ESPACIO) */}
            <div className="bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-900 border border-amber-500/40 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Shirt className="w-4 h-4 text-amber-400" />
                  El Algoritmo "Armario Cápsula"
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">
                  Ahorra 50% de Espacio
                </span>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <div className="text-xs text-white font-bold flex items-center gap-2 mb-1">
                  <span>✨ Tu fórmula para {packDays} días en {trip.destino}:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Lleva <strong className="text-amber-300">{bottoms} partes de abajo</strong> y <strong className="text-amber-300">{tops} partes de arriba</strong> combinables.
                  <br />
                  <span className="text-emerald-400 font-bold block mt-1">
                    ¡Con solo {bottoms + tops} prendas logras {combinations} combinaciones distintas sin sobrecargar tu maleta!
                  </span>
                </p>
              </div>

              {/* Selector */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-400">Días:</span>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={packDays}
                    onChange={(e) => setPackDays(Number(e.target.value))}
                    className="w-14 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-center text-white font-bold"
                  />
                  <select
                    value={packDestinationType}
                    onChange={(e) => setPackDestinationType(e.target.value as any)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-white text-xs"
                  >
                    <option value="playa">🏖️ Playa / Calor</option>
                    <option value="ciudad">🏙️ Ciudad</option>
                    <option value="frio">🏔️ Frío</option>
                  </select>
                </div>
                <button
                  onClick={handleGenerateSmartPacking}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Recalcular Ropa
                </button>
              </div>
            </div>

            {/* 4. MODO MALETA LISTA */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Modo "Maleta Lista" (Toca el circulito al empacar)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {readyItems} de {totalItems} cosas guardadas ({progressPercent}%)
                  </p>
                </div>
                <button
                  onClick={handleResetChecklist}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg flex items-center gap-1 text-[11px]"
                  title="Desmarcar todo"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpiar</span>
                </button>
              </div>

              <div className="w-full bg-slate-950 h-2 rounded-full mb-3 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="space-y-2">
                {trip.equipaje
                  .filter((i) => i.categoria !== 'infaltable')
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleLuggage(item.id)}
                      className={`p-2.5 rounded-xl border transition flex items-center justify-between gap-2.5 cursor-pointer ${
                        item.listo
                          ? 'bg-slate-950/40 border-slate-800 opacity-60'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition ${
                          item.listo ? 'border-emerald-400 bg-emerald-500/20' : 'border-slate-500'
                        }`}>
                          {item.listo && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                        <span className={`text-xs ${item.listo ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                          {item.nombre}
                        </span>
                      </div>
                      {item.categoria === 'capsula' && (
                        <span className="text-[9px] bg-amber-500/10 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-500/20 shrink-0">
                          Cápsula
                        </span>
                      )}
                    </div>
                  ))}
              </div>

              <form onSubmit={handleAddNewItem} className="mt-4 pt-3 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Ej: Sombrero de playa, pareo, libro..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* --- PÁGINA 3: DÓNDE ME ALOJÉ & MOVILIDAD (CON EL BANNER ROJO GIGANTE) --- */}
        {/* ========================================================================= */}
        {activeTab === 'moverte' && (
          <div className="space-y-4">
            
            {/* 1. DÓNDE ME ALOJÉ EN PRIMER LUGAR (Para mostrarle al taxista) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
              <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Home className="w-4 h-4" /> Dónde me Alojé (Para el Taxista o si te Pierdes)
                </span>
                <button
                  onClick={() => {
                    setLodgingForm(trip.alojamiento);
                    setIsEditingLodging(true);
                  }}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" /> Escribir / Cambiar
                </button>
              </div>

              <div className="font-bold text-white text-base">{trip.alojamiento.nombre}</div>
              <p className="text-xs text-slate-300 mt-0.5">{trip.alojamiento.direccion}</p>
              {trip.alojamiento.notas && (
                <p className="text-[11px] text-slate-400 mt-1 italic">{trip.alojamiento.notas}</p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => copyToClipboard(trip.alojamiento.direccion, 'dir_hotel')}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  {copiedKey === 'dir_hotel' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'dir_hotel' ? '¡Dirección copiada!' : 'Copiar dirección para el taxi'}</span>
                </button>

                {trip.alojamiento.telefono && (
                  <a
                    href={`tel:${trip.alojamiento.telefono}`}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Llamar recepción ({trip.alojamiento.telefono})</span>
                  </a>
                )}
              </div>
            </div>

            {/* 2. GUÍA DE MOVILIDAD COMPLETA EN DESTINO */}
            {/* 2. PUNTOS PARA RETIRAR DINERO / REMESAS (WESTERN UNION & CASAS DE CAMBIO) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Building2 className="w-4 h-4 text-amber-400" /> Puntos para Retirar Dinero o Remesas
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    Agencias Verificadas (Western Union, Casas de Cambio, etc.)
                  </h3>
                </div>
                <button
                  onClick={openAddAgencyModal}
                  className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> + Registrar Agencia
                </button>
              </div>

              {/* LISTA DE AGENCIAS REGISTRADAS */}
              <div className="space-y-2.5">
                {trip.puntosRetiroDinero && trip.puntosRetiroDinero.length > 0 ? (
                  trip.puntosRetiroDinero.map((agency) => (
                    <div key={agency.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white text-sm">{agency.nombre}</span>
                            {agency.verificado ? (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-emerald-400" /> Sucursal Verificada
                              </span>
                            ) : (
                              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold inline-flex items-center gap-1">
                                ⚠️ Por confirmar si está activa
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-300 mt-1 flex items-start gap-1">
                            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>{agency.direccion}</span>
                          </p>
                          {agency.referencia && (
                            <p className="text-[11px] text-slate-400 mt-0.5 italic pl-4">
                              Ref: {agency.referencia}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => openEditAgencyModal(agency)}
                            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                            title="Editar agencia"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAgency(agency.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                            title="Eliminar agencia"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1 border-t border-slate-900">
                        {agency.horario && (
                          <div className="flex items-center gap-1 text-slate-300">
                            <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span>Horario: {agency.horario}</span>
                          </div>
                        )}
                        {agency.telefono && (
                          <div className="flex items-center gap-1 text-slate-300">
                            <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                            <a href={`tel:${agency.telefono}`} className="text-cyan-300 hover:underline">
                              {agency.telefono}
                            </a>
                          </div>
                        )}
                      </div>

                      {agency.notas && (
                        <div className="text-[11px] text-cyan-200/90 bg-cyan-950/40 p-2 rounded-lg border border-cyan-800/40 flex items-start gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{agency.notas}</span>
                        </div>
                      )}

                      {/* ACCIONES RÁPIDAS PARA EL VIAJERO */}
                      <div className="flex items-center gap-2 pt-1 flex-wrap">
                        <button
                          onClick={() => copyToClipboard(agency.direccion, `agency-${agency.id}`)}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1 transition cursor-pointer border border-slate-800"
                        >
                          {copiedKey === `agency-${agency.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === `agency-${agency.id}` ? '¡Dirección copiada!' : 'Copiar dirección para taxi'}</span>
                        </button>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${agency.nombre} ${agency.direccion}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-cyan-300 rounded-lg text-xs font-medium flex items-center gap-1 transition border border-slate-800"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Buscar en Google Maps</span>
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-slate-950/60 rounded-xl border border-dashed border-slate-800 text-center space-y-2">
                    <p className="text-xs text-slate-400">
                      No tienes agencias registradas aún. Si vas a necesitar retirar efectivo o enviar remesas, anota aquí la dirección verificada.
                    </p>
                    <button
                      onClick={openAddAgencyModal}
                      className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> + Agregar Western Union u otra agencia
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 3. GUÍA DE MOVILIDAD COMPLETA EN DESTINO */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Car className="w-4 h-4 text-cyan-400" />
                    Guía de Movilidad en {trip.destino} ({trip.pais})
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                    Transporte real y seguro adaptado a este destino:
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 text-white font-bold mb-1">
                    <Plane className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>1. Del Aeropuerto al Alojamiento (Llegada Segura)</span>
                  </div>
                  <p className="leading-relaxed text-slate-300">
                    {trip.movilidad.llegadaAeropuerto}
                  </p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 text-white font-bold mb-1">
                    <Bus className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>2. Movilidad Urbana Diaria (Apps y Transporte Local)</span>
                  </div>
                  <p className="leading-relaxed text-slate-300">
                    {trip.movilidad.appsYTransporte}
                  </p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 text-white font-bold mb-1">
                    <KeyRound className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>3. Alquiler de Vehículos y Conducción</span>
                  </div>
                  <p className="leading-relaxed text-slate-300">
                    {trip.movilidad.alquilerYConduccion}
                  </p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 text-white font-bold mb-1">
                    <WifiOff className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>4. Conectividad y Mapas sin Conexión (Tip Infalible)</span>
                  </div>
                  <p className="leading-relaxed text-slate-300">
                    {trip.movilidad.mapasOffline}
                  </p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 text-white font-bold mb-1">
                    <Coins className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>5. Costumbres y Dinero para el Transporte</span>
                  </div>
                  <p className="leading-relaxed text-slate-300">
                    {trip.movilidad.costumbresDinero}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* --- PÁGINA 4: SALUD & SEGURO MÉDICO --- */}
        {/* ========================================================================= */}
        {activeTab === 'salud' && (
          <div className="space-y-4">
            {/* ========================================================================= */}
            {/* --- SECCIÓN PRINCIPAL: ¿VIAJAS CON SEGURO DE VIAJE? --- */}
            {/* ========================================================================= */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      ¿Viajas con Seguro de Viaje?
                    </h3>
                    <span className="text-[11px] text-slate-400 block">
                      Cubre urgencias médicas, hospitalización, demoras y pérdida de equipaje.
                    </span>
                  </div>
                </div>

                {/* Toggle SÍ / NO */}
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                  <button
                    type="button"
                    onClick={() => setTrip((prev) => ({ ...prev, salud: { ...prev.salud, tieneSeguro: true } }))}
                    className={`px-3.5 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                      trip.salud.tieneSeguro
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    SÍ
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrip((prev) => ({ ...prev, salud: { ...prev.salud, tieneSeguro: false } }))}
                    className={`px-3.5 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                      !trip.salud.tieneSeguro
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>

              {/* Si la respuesta es SÍ: Despliegue de los datos de la aseguradora */}
              {trip.salud.tieneSeguro ? (
                <div className="space-y-3">
                  {/* Tarjeta de la Aseguradora */}
                  <div className="bg-slate-950/90 p-4 rounded-xl border border-emerald-500/30 space-y-3">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                          Compañía Aseguradora:
                        </span>
                        <strong className="text-white text-base font-bold block mt-0.5">
                          {trip.salud.seguroCompania || 'Seguro de Viaje Contratado'}
                        </strong>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-xs text-slate-300 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            N° Póliza / Voucher: <strong className="text-emerald-300">{trip.salud.seguroPoliza || 'Sin registrar'}</strong>
                          </span>
                          <button
                            onClick={() => copyToClipboard(trip.salud.seguroPoliza || '', 'poliza-main')}
                            className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            {copiedKey === 'poliza-main' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedKey === 'poliza-main' ? '¡Póliza copiada!' : 'Copiar'}</span>
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={openEditInsuranceModal}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-1.5 cursor-pointer transition shadow-sm shrink-0"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Editar Seguro</span>
                      </button>
                    </div>

                    {/* Fechas de vigencia de la póliza */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>
                        Vigencia de Cobertura: <strong className="text-white">{trip.salud.seguroFechaInicio || '26/12/2025'}</strong> al <strong className="text-white">{trip.salud.seguroFechaFin || '01/01/2026'}</strong>
                      </span>
                    </div>

                    {/* Teléfonos de Asistencia */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                      {/* Teléfono Destino (En el extranjero) */}
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block flex items-center gap-1">
                          <span>📞</span> Llamar en el Extranjero (desde donde viajas):
                        </span>
                        {trip.salud.seguroTelefono ? (
                          <div className="flex items-center justify-between gap-1">
                            <a
                              href={`tel:${trip.salud.seguroTelefono.replace(/[^0-9+]/g, '')}`}
                              className="text-emerald-400 hover:underline font-mono font-bold text-xs"
                            >
                              {trip.salud.seguroTelefono}
                            </a>
                            <button
                              onClick={() => copyToClipboard(trip.salud.seguroTelefono, 'tel-seguro-dest')}
                              className="text-slate-400 hover:text-white p-1"
                              title="Copiar teléfono"
                            >
                              {copiedKey === 'tel-seguro-dest' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px]">No registrado</span>
                        )}
                        <span className="text-[10px] text-slate-400 block">Llamada local en destino con chip de viaje o roaming.</span>
                      </div>

                      {/* Teléfono Origen (Para la familia en Casa) */}
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block flex items-center gap-1">
                          <span>🏠</span> Llamar desde tu País de Origen (Casa):
                        </span>
                        {trip.salud.seguroTelefonoOrigen ? (
                          <div className="flex items-center justify-between gap-1">
                            <a
                              href={`tel:${trip.salud.seguroTelefonoOrigen.replace(/[^0-9+]/g, '')}`}
                              className="text-cyan-400 hover:underline font-mono font-bold text-xs"
                            >
                              {trip.salud.seguroTelefonoOrigen}
                            </a>
                            <button
                              onClick={() => copyToClipboard(trip.salud.seguroTelefonoOrigen!, 'tel-seguro-orig')}
                              className="text-slate-400 hover:text-white p-1"
                              title="Copiar teléfono"
                            >
                              {copiedKey === 'tel-seguro-orig' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px]">No registrado</span>
                        )}
                        <span className="text-[10px] text-slate-400 block">Para llamadas directas tuyas o para que tu familia coordine desde casa.</span>
                      </div>
                    </div>

                    {/* Correo Electrónico de Asistencia */}
                    {trip.salud.seguroEmail && (
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-300 truncate">
                          <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span className="text-slate-400 text-[10px] uppercase font-bold">Correo de Asistencia:</span>
                          <strong className="text-purple-300 font-mono truncate">{trip.salud.seguroEmail}</strong>
                        </div>
                        <a
                          href={`mailto:${trip.salud.seguroEmail}`}
                          className="px-2.5 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 rounded-lg text-xs font-semibold shrink-0"
                        >
                          Enviar correo
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Recuadro de Oro de la Póliza: Instrucciones Vitales */}
                  <div className="p-3.5 bg-gradient-to-r from-amber-950/30 via-slate-950 to-slate-950 rounded-xl border border-amber-500/40 text-xs space-y-2.5 text-slate-200">
                    <div className="flex items-center gap-2 text-amber-300 font-bold">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-xs uppercase tracking-wide">Protocolo de Oro ante Emergencias (Reglas de la Póliza):</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      <strong className="text-white">Se recuerda que siempre se debe llamar a la central de asistencia</strong> ante la necesidad de requerir algún servicio médico. Hay un <strong className="text-amber-300">plazo de 48 horas</strong> para dar aviso a la central de operaciones desde que suceden los síntomas o accidente para coordinar la atención y evitar pagar de tu bolsillo.
                    </p>

                    <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800 text-[11px] space-y-1">
                      <strong className="text-amber-200 block font-bold">📋 Para coordinar las coberturas, te pedirán:</strong>
                      <ul className="list-disc list-inside text-slate-300 space-y-0.5 pl-1">
                        <li>Nombre del paciente y documento de identidad (RUT / Pasaporte).</li>
                        <li>Fecha de nacimiento y dirección exacta donde se encuentra.</li>
                        <li>Teléfono y email de contacto.</li>
                        <li>Síntomas o problema de salud detallado.</li>
                      </ul>
                      <span className="text-[10px] text-slate-400 block pt-1 italic">
                        * Toda decisión médica es evaluada y controlada por el departamento médico de la aseguradora junto al médico tratante.
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800 text-[11px] space-y-1">
                      <strong className="text-cyan-300 block font-bold">🧾 Si te indican reembolso (al regreso a casa):</strong>
                      <ul className="list-disc list-inside text-slate-300 space-y-0.5 pl-1">
                        <li><strong>Asistencia médica:</strong> Reporte médico original y completo, comprobantes/facturas originales de gastos según plan contratado.</li>
                        <li><strong>Demora y/o pérdida de equipaje:</strong> Formulario PIR y comprobantes originales de gastos.</li>
                        <li><strong>Vuelo demorado:</strong> Constancia de la aerolínea certificando demora y comprobantes originales.</li>
                      </ul>
                    </div>

                    <div className="p-2 bg-emerald-950/40 rounded-lg border border-emerald-500/20 text-[11px] text-emerald-300 flex items-start gap-1.5">
                      <span className="shrink-0 text-sm">💡</span>
                      <span>
                        <strong>Consejo clave:</strong> Extrae estos números y tu número de póliza del documento antes de viajar y anótalos en una libreta física en tu bolso de mano por si te quedas sin batería o sin señal.
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Si la respuesta es NO */
                <div className="p-3.5 bg-rose-950/30 rounded-xl border border-rose-500/40 text-xs text-rose-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-rose-300">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Atención: Viajas sin Seguro Médico ni Asistencia</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Las clínicas privadas en el extranjero cobran tarifas muy altas y exigen pago de inmediato con tarjeta o efectivo. Cualquier urgencia, accidente o complicación médica deberá ser pagada por ti o tu familia en casa.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Te recomendamos contratar una póliza antes de abordar tu viaje.
                  </p>
                  <div className="pt-1">
                    <button
                      onClick={() => {
                        setTrip((prev) => ({ ...prev, salud: { ...prev.salud, tieneSeguro: true } }));
                        openEditInsuranceModal();
                      }}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" /> ¿Contrataste uno? Registrar mi Seguro de Viaje
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Urgencias Médicas, Policiales y Bomberos Oficiales */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
              <span className="text-xs font-bold uppercase text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Números de Emergencia Oficiales en {trip.pais}:
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {/* 1. Ambulancia */}
                <div className="p-3 rounded-xl bg-slate-950 border border-red-500/30 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block flex items-center gap-1">
                      🚑 Ambulancia:
                    </span>
                    <strong className="text-red-400 font-mono text-sm block mt-0.5">
                      {trip.salud.numeroAmbulanciaLocal || '112 / 911'}
                    </strong>
                  </div>
                  <a
                    href={`tel:${(trip.salud.numeroAmbulanciaLocal || '112').replace(/[^0-9]/g, '')}`}
                    className="py-1.5 px-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-xs text-center transition block"
                  >
                    Llamar Ambulancia
                  </a>
                </div>

                {/* 2. Policía */}
                <div className="p-3 rounded-xl bg-slate-950 border border-blue-500/30 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block flex items-center gap-1">
                      👮 Policía Local:
                    </span>
                    <strong className="text-blue-400 font-mono text-sm block mt-0.5">
                      {trip.salud.numeroPoliciaLocal || '112 / 911'}
                    </strong>
                  </div>
                  <a
                    href={`tel:${(trip.salud.numeroPoliciaLocal || '112').replace(/[^0-9]/g, '')}`}
                    className="py-1.5 px-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs text-center transition block"
                  >
                    Llamar Policía
                  </a>
                </div>

                {/* 3. Bomberos */}
                <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block flex items-center gap-1">
                      🚒 Bomberos:
                    </span>
                    <strong className="text-amber-400 font-mono text-sm block mt-0.5">
                      {trip.salud.numeroBomberosLocal || '112 / 911'}
                    </strong>
                  </div>
                  <a
                    href={`tel:${(trip.salud.numeroBomberosLocal || '112').replace(/[^0-9]/g, '')}`}
                    className="py-1.5 px-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-xs text-center transition block"
                  >
                    Llamar Bomberos
                  </a>
                </div>
              </div>

              {/* CENTRO MÉDICO O CLÍNICA MÁS CERCANA (100% editable por el viajero) */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <span className="text-slate-300 text-xs font-bold block">
                      🏥 Centro Médico o Clínica más cercana al Hotel:
                    </span>
                    <span className="text-[10px] text-slate-500">
                      (Averigua en recepción al llegar y regístralo aquí)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={openEditHospitalModal}
                    className="px-2.5 py-1 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{trip.salud.hospitalCercanoNombre ? 'Editar Clínica / Hospital' : '+ Registrar Clínica'}</span>
                  </button>
                </div>

                {trip.salud.hospitalCercanoNombre ? (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <strong className="text-white block text-sm">{trip.salud.hospitalCercanoNombre}</strong>
                    {trip.salud.hospitalCercanoDireccion && (
                      <p className="text-slate-300 text-xs flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{trip.salud.hospitalCercanoDireccion}</span>
                      </p>
                    )}
                    {trip.salud.hospitalCercanoTelefono && (
                      <p className="text-cyan-300 font-mono text-xs flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        <span>Teléfono: {trip.salud.hospitalCercanoTelefono}</span>
                      </p>
                    )}

                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      {trip.salud.hospitalCercanoDireccion && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(trip.salud.hospitalCercanoDireccion, 'dir_hospital')}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                        >
                          {copiedKey === 'dir_hospital' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                          <span>{copiedKey === 'dir_hospital' ? '¡Dirección copiada!' : 'Copiar dirección para Uber / Taxi'}</span>
                        </button>
                      )}
                      {trip.salud.hospitalCercanoTelefono && (
                        <a
                          href={`tel:${trip.salud.hospitalCercanoTelefono.replace(/[^0-9+]/g, '')}`}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Llamar al Centro Médico</span>
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-dashed border-slate-800 text-center space-y-1.5">
                    <p className="text-xs text-amber-300 font-semibold">
                      ⚠️ Ningún centro médico registrado para {trip.destino || trip.pais}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Por seguridad no colocamos una dirección falsa. Al llegar a tu hotel, consulta en recepción cuál es la clínica de urgencia más recomendada y anótala aquí.
                    </p>
                    <button
                      type="button"
                      onClick={openEditHospitalModal}
                      className="mt-1 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Escribir Centro Médico Cercano
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* FICHA MÉDICA BÁSICA DEL VIAJERO */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-950 to-emerald-950/20 p-4 rounded-2xl border border-emerald-500/30 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5" />
                  Ficha Médica Confidencial del Viajero
                </span>
                <button
                  onClick={() => {
                    setHealthForm(trip.salud);
                    setIsEditingHealth(true);
                  }}
                  className="text-cyan-400 text-[11px] font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Editar Ficha
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Datos vitales para mostrar en pantalla a paramédicos o doctores si viajas sola o en caso de desmayo/accidente:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-bold uppercase">🩸 Grupo Sanguíneo:</span>
                  <strong className="text-white text-xs block mt-0.5">{trip.salud.tipoSangre || 'No especificado'}</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-amber-400 text-[10px] block font-bold uppercase">⚠️ Alergias Médicas / Alimentos:</span>
                  <strong className="text-amber-200 text-xs block mt-0.5">{trip.salud.alergias || 'Ninguna conocida'}</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-cyan-400 text-[10px] block font-bold uppercase">💊 Medicamentos de Uso Diario:</span>
                  <strong className="text-cyan-200 text-xs block mt-0.5">{trip.salud.medicamentosDiarios || 'Ninguno'}</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-bold uppercase">📋 Condiciones o Enfermedades:</span>
                  <strong className="text-slate-200 text-xs block mt-0.5">{trip.salud.condicionesMedicas || 'Ninguna'}</strong>
                </div>
              </div>
            </div>

            {/* Fondos de Emergencia */}
            {trip.salud.fondosEmergenciaNotas && (
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Fondos de Emergencia Disponibles:</span>
                <p className="text-slate-300 text-[11px]">{trip.salud.fondosEmergenciaNotas}</p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* --- PÁGINA 5: REGLAS DE ORO & TIPS DEL VIAJERO --- */}
        {/* ========================================================================= */}
        {activeTab === 'tips' && (
          <div className="space-y-4">
            {/* Header del Módulo */}
            <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/40 border-2 border-amber-500/50 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-2.5 mb-1.5">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                <h2 className="text-base font-black text-white">Reglas de Oro & Tips del Viajero Experto</h2>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Lecciones esenciales de viajeros reales para evitar contratiempos, estafas y dolores de cabeza en el extranjero. Organizadas por momento clave:
              </p>
            </div>

            {/* CATEGORÍA 1: EN EL AEROPUERTO & PASAJES */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <Plane className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  1. En el Aeropuerto & Vuelos (Ojo Viajero)
                </h3>
              </div>

              {/* Ojo viajero con el seguro en el pasaje */}
              <div className="p-3 bg-slate-950/90 rounded-xl border border-amber-500/30 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Ojo con el "Seguro Contratado" que aparece en tu pasaje aéreo:</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  En los itinerarios de vuelos de muchas aerolíneas verás una mención que dice <em>"Seguro contratado"</em> con un número. <strong>Ese NO es el número de tu póliza médica</strong> con el que te atenderán en un hospital extranjero; es solo un código de reserva de la aerolínea. Tu póliza real de asistencia debes extraerla de tu certificado y registrarla en el módulo de <strong>Salud</strong>.
                </p>
              </div>

              {/* Anticipación y Policía Internacional */}
              <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 text-xs space-y-1">
                <strong className="text-white block font-bold">
                  ⏰ Las 3 Horas Sagradas:
                </strong>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Llega con <strong>3 horas de anticipación</strong> a vuelos internacionales y <strong>2 a nacionales</strong>. Mantén siempre tu cédula o pasaporte a mano.
                </p>
              </div>

              {/* Pantallas de embarque */}
              <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 text-xs space-y-1">
                <strong className="text-white block font-bold">
                  📺 Verifica tu Puerta de Embarque:
                </strong>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  La puerta impresa en tu boleto <strong>puede cambiar a última hora</strong>. Confírmala siempre en las pantallas del aeropuerto.
                </p>
              </div>
            </div>

            {/* CATEGORÍA 2: EN EL EQUIPAJE & MALETA */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <Luggage className="w-4 h-4 text-amber-300" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  2. En el Equipaje & Maleta
                </h3>
              </div>

              {/* REGLA DE ORO: DINERO Y TARJETAS SEPARADAS */}
              <div className="bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-950 border-2 border-amber-500/70 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-amber-200 text-xs font-black uppercase tracking-wide block">
                      ¡Regla de Oro Indiscutible! Dinero, Tarjetas y Remedios contigo
                    </strong>
                    <span className="text-[10px] text-amber-300/80">
                      NUNCA los despaches a la bodega del avión
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  <strong>NUNCA despaches valores a la bodega:</strong> Dinero, tarjetas y remedios diarios van <strong>SIEMPRE en tu bolso de mano</strong> contigo en la cabina.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px]">
                  <div className="p-2 bg-slate-900/90 rounded-lg border border-slate-800">
                    <strong className="text-white block font-semibold">Gasto diario separado:</strong>
                    <span className="text-slate-400">Lleva en tu bolsillo solo lo necesario para el día; deja el resto en la caja fuerte de tu alojamiento.</span>
                  </div>
                  <div className="p-2 bg-slate-900/90 rounded-lg border border-slate-800">
                    <strong className="text-white block font-semibold">Respaldo de tarjetas:</strong>
                    <span className="text-slate-400">Lleva dos tarjetas distintas y activa las compras internacionales antes de subir al avión.</span>
                  </div>
                </div>
              </div>

              {/* Escalas y equipaje en tránsito */}
              <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 text-xs space-y-1">
                <strong className="text-white block font-bold">
                  🔄 Equipaje en Vuelos con Conexión / Escala:
                </strong>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Al hacer el check-in en el mostrador del aeropuerto, pregunta siempre al agente: <em>"¿Mi maleta va directo al destino final o debo retirarla en la escala?"</em>. Si tienes cambio de aerolínea o escala en un país que exige control de aduanas intermedio (ej: EE.UU.), debes retirar la maleta y re-facturarla.
                </p>
              </div>
            </div>

            {/* CATEGORÍA 3: EN LA MOVILIDAD & SEGURIDAD URBANA */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <Car className="w-4 h-4 text-cyan-300" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  3. En la Movilidad & Seguridad Urbana
                </h3>
              </div>

              {/* ALERTA VITAL: NUNCA DEJAR LA MALETA CON DESCONOCIDOS */}
              <div className="bg-gradient-to-r from-red-950 via-rose-950 to-red-950 border-2 border-red-500 rounded-xl p-3.5 space-y-2 text-red-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-red-600 text-white shrink-0">
                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="bg-red-500 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider">
                      ALERTA VITAL DE SEGURIDAD
                    </span>
                    <h4 className="font-black text-white text-xs sm:text-sm mt-0.5">
                      ¡NUNCA le encargues tu maleta a un desconocido!
                    </h4>
                  </div>
                </div>
                <p className="text-[11px] leading-relaxed text-red-100">
                  Ni para ir al baño 2 minutos. Si la policía encuentra algo ilegal adentro, <strong>tú respondes ante la ley</strong>. Si vas a ir al baño, entra con tu bolso o usa la custodia oficial.
                </p>
              </div>

              {/* Transporte oficial en aeropuertos */}
              <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 text-xs space-y-1">
                <strong className="text-white block font-bold">
                  🚕 Usa solo Transporte Oficial:
                </strong>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Ignora a personas que ofrezcan "taxi barato" en los pasillos del aeropuerto. Ve directo a los mostradores oficiales o pide tu Uber/99.
                </p>
              </div>

              {/* Mapas offline */}
              <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 text-xs space-y-1">
                <strong className="text-white block font-bold">
                  🗺️ Descarga el Mapa sin Conexión en tu Teléfono:
                </strong>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  En Google Maps busca tu ciudad de destino y toca <em>"Descargar mapa sin conexión"</em> mientras tengas el WiFi del hotel. Si pierdes la señal en una carretera o playa apartada, el GPS seguirá guiándote sin gastar datos.
                </p>
              </div>
            </div>

            {/* CATEGORÍA 4: EN DOCUMENTOS & ASISTENCIA MÉDICA */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  4. En Documentos & Asistencia Médica
                </h3>
              </div>

              {/* TIP DE ORO: EL RESPALDO ESCRITO EN PAPEL */}
              <div className="bg-gradient-to-r from-amber-950/30 via-slate-950 to-slate-950 p-3.5 rounded-xl border border-amber-500/40 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <span className="text-base">📝</span>
                  <span className="uppercase text-[11px] tracking-wider">Tip de Oro: El Respaldo Escrito en Papel</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Si tu celular se queda sin batería, se moja o se extravía en la calle, no podrás abrir esta app ni tus documentos digitales.
                  <strong className="text-white block mt-1">
                    Lleva siempre un papelito doblado en tu billetera física con:
                  </strong>
                </p>
                <ul className="text-[11px] text-amber-200/90 list-disc list-inside space-y-0.5 pl-1">
                  <li>Nombre y dirección completa de tu posada/hotel (para mostrárselo a un chofer o policía).</li>
                  <li>Teléfono de contacto de tu familiar en casa y número de tu póliza de seguro de viaje.</li>
                </ul>
                <p className="text-[10px] text-slate-400 italic pt-0.5">
                  Este sencillo papelito te salvará de cualquier apuro si te quedas incomunicada lejos del hotel.
                </p>
              </div>

              {/* REGLA DE LAS 48 HORAS DEL SEGURO */}
              <div className="p-3 bg-slate-950/90 rounded-xl border border-emerald-500/30 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                  <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Avisa a tu Seguro en menos de 48 Horas:</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Ante cualquier atención médica o accidente, <strong>debes avisar de inmediato</strong> a la central para que cubran los gastos.
                </p>
              </div>

              {/* REGLA DEL HOTEL EN CASO DE EMERGENCIA GRAVE */}
              <div className="p-3 bg-slate-950/90 rounded-xl border border-blue-500/30 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                  <span className="text-base">🛎️</span>
                  <span>No hagas Check-Out en una Emergencia Grave:</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Si tú o tu acompañante sufren una urgencia médica cerca de la fecha de regreso, <strong>exige al hotel una extensión por fuerza mayor</strong>.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 
        BARRA FLOTANTE INFERIOR FIJA PARA CELULARES (sm:hidden):
        Garantiza que en teléfonos móviles los 4 botones estén siempre accesibles al alcance del pulgar.
      */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-1.5 py-1.5 shadow-2xl">
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          <button
            onClick={() => {
              setActiveTab('pasajes');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`py-1.5 px-0.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 ${
              activeTab === 'pasajes'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plane className="w-4 h-4" />
            <span className="truncate">1. Pasajes</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('equipaje');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`py-1.5 px-0.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 ${
              activeTab === 'equipaje'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Luggage className="w-4 h-4 text-amber-300" />
            <span className="truncate">2. Equipaje</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('moverte');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`py-1.5 px-0.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 ${
              activeTab === 'moverte'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-4 h-4 text-cyan-300" />
            <span className="truncate">3. Moverte</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('salud');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`py-1.5 px-0.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 ${
              activeTab === 'salud'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-emerald-400" />
            <span className="truncate">4. Salud</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('tips');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`py-1.5 px-0.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 ${
              activeTab === 'tips'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'text-amber-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="truncate">5. Reglas Oro</span>
          </button>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* --- MODAL: CAMBIAR PAÍS / DESTINO INTELIGENTE --- */}
      {/* ========================================================================= */}
      {showChangeCountryModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-lg w-full shadow-2xl relative text-xs my-6 max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-black text-white text-base">Configurar Destino del Viaje</h3>
                  <p className="text-[11px] text-slate-400">Elige el país y escribe la ciudad exacta que vas a recorrer</p>
                </div>
              </div>
              <button
                onClick={() => setShowChangeCountryModal(false)}
                className="text-slate-400 hover:text-white p-1 text-sm font-bold cursor-pointer rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto pr-1 space-y-4 py-3 flex-1">
              {/* SECCIÓN 1: CIUDAD O REGIÓN (100% LIBRE Y EDITABLE) */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-cyan-500/40 shadow-inner">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-white font-bold flex items-center gap-1.5 text-xs">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>¿Qué ciudad o lugar específico vas a visitar? *</span>
                  </label>
                  <span className="text-[10px] text-cyan-400 font-semibold bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/40">
                    Editable y libre
                  </span>
                </div>
                <input
                  type="text"
                  value={targetCity}
                  onChange={(e) => setTargetCity(e.target.value)}
                  placeholder="Ej: Barcelona, Tel Aviv, Ciudad de Panamá, Orlando, etc."
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white font-bold text-sm outline-none transition"
                />
                

                {/* Sugerencias rápidas de ciudades si el país tiene lista */}
                {!isCustomCountryMode && DESTINATIONS[targetCountryKey]?.ciudadesSugeridas && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block mb-1">Ciudades sugeridas en {DESTINATIONS[targetCountryKey].pais}:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {DESTINATIONS[targetCountryKey].ciudadesSugeridas!.map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => setTargetCity(city)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                            targetCity.toLowerCase() === city.toLowerCase()
                              ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SECCIÓN 2: PAÍS DE DESTINO */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-200 font-bold flex items-center gap-1.5 text-xs">
                    <span>🚩 País de destino:</span>
                    <span className="text-slate-400 font-normal">(Carga enchufes, moneda y emergencias)</span>
                  </label>
                  {!isCustomCountryMode ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCountryMode(true);
                        setCustomCountryForm({
                          pais: '',
                          moneda: '',
                          enchufe: '',
                          voltaje: '',
                          clima: '',
                          ambulancia: ''
                        });
                      }}
                      className="text-amber-400 hover:text-amber-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" /> Escribir otro país
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsCustomCountryMode(false)}
                      className="text-cyan-400 hover:text-cyan-300 text-[11px] font-bold cursor-pointer"
                    >
                      Volver a lista de países
                    </button>
                  )}
                </div>

                {!isCustomCountryMode ? (
                  <>
                    {/* Buscador interactivo de países */}
                    <div className="relative mb-2">
                      <input
                        type="text"
                        value={countrySearchQuery}
                        onChange={(e) => setCountrySearchQuery(e.target.value)}
                        placeholder="🔍 Buscar país (ej: Israel, Panamá, España, México, Italia...)"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-white text-xs outline-none"
                      />
                      {countrySearchQuery && (
                        <button
                          type="button"
                          onClick={() => setCountrySearchQuery('')}
                          className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Lista de países (Muestra SÓLO el País con bandera, sin forzar ciudad fija en el título) */}
                    <div className="space-y-1.5 max-h-[30vh] overflow-y-auto pr-1">
                      {Object.entries(DESTINATIONS)
                        .filter(([key, item]) => {
                          if (!countrySearchQuery.trim()) return true;
                          const q = countrySearchQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                          const p = item.pais.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                          return p.includes(q) || key.includes(q);
                        })
                        .map(([key, item]) => {
                          const isSelected = targetCountryKey === key;
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => handleSelectCountryInModal(key)}
                              className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-950/70 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                                  : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800/80'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="text-xl shrink-0">{item.bandera}</span>
                                <div className="min-w-0">
                                  <strong className="text-white text-xs sm:text-sm block truncate">
                                    {item.pais}
                                  </strong>
                                  <span className="text-[10px] text-slate-400 block truncate">
                                    💰 {item.moneda.split('(')[0].trim()} • 🔌 {item.enchufe.split('(')[0].trim()}
                                  </span>
                                </div>
                              </div>
                              {isSelected && (
                                <span className="shrink-0 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Seleccionado
                                </span>
                              )}
                            </button>
                          );
                        })}
                    </div>
                  </>
                ) : (
                  /* Modo país personalizado */
                  <div className="space-y-2.5 bg-slate-950 p-3 rounded-2xl border border-amber-500/30">
                    <div className="p-2 bg-amber-500/10 rounded-xl text-amber-300 text-[11px] leading-relaxed">
                      ✍️ Escribe el nombre del país. Si coincide con algún destino internacional (como Israel, Panamá, etc.), la app autocompletará la moneda y el enchufe para que nunca quede vacío:
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Nombre del País *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Israel, Panamá, Grecia, Noruega..."
                        value={customCountryForm.pais}
                        onChange={(e) => {
                          const val = e.target.value;
                          const matched = findCountryPreset(val);
                          if (matched) {
                            setCustomCountryForm({
                              pais: val,
                              moneda: matched.moneda,
                              enchufe: matched.enchufe,
                              voltaje: matched.voltaje,
                              clima: matched.clima,
                              ambulancia: matched.ambulancia
                            });
                          } else {
                            setCustomCountryForm({
                              ...customCountryForm,
                              pais: val,
                              moneda: customCountryForm.moneda || 'Dólar USD / Moneda Local',
                              enchufe: customCountryForm.enchufe || 'Tipo C y F / Tipo A y B',
                              voltaje: customCountryForm.voltaje || '110V - 240V',
                              ambulancia: customCountryForm.ambulancia || '112 / 911'
                            });
                          }
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-400 text-[10px] font-semibold mb-1">Moneda Local</label>
                        <input
                          type="text"
                          placeholder="Ej: Shekel, Dólar, Euro..."
                          value={customCountryForm.moneda}
                          onChange={(e) => setCustomCountryForm({ ...customCountryForm, moneda: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-[10px] font-semibold mb-1">Tipo de Enchufe</label>
                        <input
                          type="text"
                          placeholder="Ej: Tipo C y H, Tipo A y B..."
                          value={customCountryForm.enchufe}
                          onChange={(e) => setCustomCountryForm({ ...customCountryForm, enchufe: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECCIÓN 3: TARJETA DE VISTA PREVIA DE DATOS DE VIAJE */}
              <div className="p-3 bg-gradient-to-br from-slate-950 to-blue-950/40 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    📋 Datos que se activarán para {targetCity || 'tu destino'} ({isCustomCountryMode ? (customCountryForm.pais || 'Personalizado') : DESTINATIONS[targetCountryKey]?.pais}):
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditingAdvancedDetails(!isEditingAdvancedDetails)}
                    className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                  >
                    {isEditingAdvancedDetails ? 'Cerrar ajustes' : '⚙️ Ajustar moneda/enchufe'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">💰 Moneda</span>
                    <strong className="text-white truncate block">
                      {manualCurrencyOverride || (isCustomCountryMode ? (customCountryForm.moneda || 'USD / Local') : DESTINATIONS[targetCountryKey]?.moneda)}
                    </strong>
                  </div>
                  <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">🔌 Enchufe / Tomas</span>
                    <strong className="text-white truncate block">
                      {manualEnchufeOverride || (isCustomCountryMode ? (customCountryForm.enchufe || 'Tipo A/C') : DESTINATIONS[targetCountryKey]?.enchufe)}
                    </strong>
                  </div>
                  <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">⚡ Voltaje</span>
                    <span className="text-white truncate block">
                      {isCustomCountryMode ? (customCountryForm.voltaje || '110V - 240V') : DESTINATIONS[targetCountryKey]?.voltaje}
                    </span>
                  </div>
                  <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">🚑 Emergencias / Ambulancia</span>
                    <span className="text-emerald-400 font-bold truncate block">
                      {isCustomCountryMode ? (customCountryForm.ambulancia || '112 / 911') : DESTINATIONS[targetCountryKey]?.ambulancia}
                    </span>
                  </div>
                </div>

                {/* Ajustes manuales opcionales */}
                {isEditingAdvancedDetails && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800 space-y-2">
                    <div>
                      <label className="text-[10px] text-slate-300 font-semibold block mb-0.5">Sobrescribir Moneda:</label>
                      <input
                        type="text"
                        placeholder="Ej: Nuevo Shekel (ILS), Balboa (PAB), Euro (EUR)..."
                        value={manualCurrencyOverride}
                        onChange={(e) => setManualCurrencyOverride(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-300 font-semibold block mb-0.5">Sobrescribir Enchufe:</label>
                      <input
                        type="text"
                        placeholder="Ej: Tipo C y H, Tipo A y B..."
                        value={manualEnchufeOverride}
                        onChange={(e) => setManualEnchufeOverride(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowChangeCountryModal(false)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleApplyDestination}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-extrabold shadow-lg shadow-blue-500/25 flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm"
              >
                <Check className="w-4 h-4" /> Guardar y Aplicar Destino
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* --- MODAL: FICHA SOS DISCRETA --- */}
      {/* ========================================================================= */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-lg w-full shadow-2xl relative text-xs my-6 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-white text-base">Ficha SOS de Emergencia</h3>
              </div>
              <button
                onClick={() => setShowSosModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-sm cursor-pointer"
              >
                ✕ Cerrar
              </button>
            </div>

            <p className="text-[11px] text-slate-300 mt-2 mb-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800 shrink-0">
              Los 4 datos vitales para resolver una emergencia médica, consular o de extravío en segundos:
            </p>

            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {/* 1. CONSULADO OFICIAL */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-blue-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                    <span>🏛️</span> Consulado Oficial en {trip.pais}:
                  </span>
                  <button
                    onClick={() => {
                      setSosForm({
                        familiarNombre: trip.familiarNombre,
                        familiarTelefono: trip.familiarTelefono,
                        consuladoNombre: trip.consuladoNombre,
                        consuladoTelefono: trip.consuladoTelefono,
                        consuladoDireccion: trip.consuladoDireccion
                      });
                      setIsEditingSos(true);
                      setShowSosModal(false);
                    }}
                    className="text-cyan-400 text-[11px] hover:underline cursor-pointer"
                  >
                    Editar datos
                  </button>
                </div>
                <strong className="text-white text-xs block mt-0.5">{trip.consuladoNombre}</strong>
                <p className="text-slate-300 text-[11px] mt-0.5">{trip.consuladoDireccion}</p>
                <div className="mt-2.5">
                  <a
                    href={`tel:${trip.consuladoTelefono}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition"
                  >
                    <Phone className="w-3.5 h-3.5" /> Llamar al Consulado ({trip.consuladoTelefono})
                  </a>
                </div>
              </div>

              {/* 2. CONTACTO FAMILIAR EN CASA */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                    <span>🏠</span> Contacto Familiar en Casa:
                  </span>
                  <button
                    type="button"
                    onClick={openEditFamiliarModal}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" /> Editar
                  </button>
                </div>
                <strong className="text-cyan-300 text-xs block mt-0.5">{trip.familiarNombre}</strong>
                <div className="mt-2 flex items-center gap-2">
                  <a
                    href={`tel:${trip.familiarTelefono}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Llamar a Casa ({trip.familiarTelefono})</span>
                  </a>
                  <button
                    onClick={() => copyToClipboard(trip.familiarTelefono, 'tel_familiar_sos')}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
                    title="Copiar teléfono"
                  >
                    {copiedKey === 'tel_familiar_sos' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* 3. MI HOTEL / ALOJAMIENTO */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-amber-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-amber-400" />
                    Mi Hotel / Alojamiento (Para taxista o policía):
                  </span>
                  <button
                    onClick={() => {
                      setLodgingForm(trip.alojamiento);
                      setIsEditingLodging(true);
                      setShowSosModal(false);
                    }}
                    className="text-cyan-400 text-[11px] font-bold hover:underline cursor-pointer"
                  >
                    Editar
                  </button>
                </div>
                <strong className="text-white text-xs block mt-1">{trip.alojamiento.nombre}</strong>
                <p className="text-slate-300 text-[11px] mt-0.5">{trip.alojamiento.direccion}</p>
                {trip.alojamiento.telefono && (
                  <p className="text-amber-300 font-mono text-[11px] mt-0.5">Tel: {trip.alojamiento.telefono}</p>
                )}
                
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {trip.alojamiento.direccion && (
                    <button
                      onClick={() => copyToClipboard(trip.alojamiento.direccion, 'dir_hotel_sos')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                    >
                      {copiedKey === 'dir_hotel_sos' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{copiedKey === 'dir_hotel_sos' ? '¡Dirección copiada!' : 'Copiar dirección para taxi'}</span>
                    </button>
                  )}
                  {trip.alojamiento.telefono && (
                    <a
                      href={`tel:${trip.alojamiento.telefono.replace(/[^0-9+]/g, '')}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5" /> Llamar al Hotel ({trip.alojamiento.telefono})
                    </a>
                  )}
                </div>
              </div>

              {/* 4. SEGURO DE ASISTENCIA MÉDICA */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Seguro de Asistencia Médica:
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-300">
                    {trip.salud.seguroPoliza || 'Sin póliza'}
                  </span>
                </div>
                <strong className="text-white text-xs block">
                  {trip.salud.seguroCompania || 'Seguro de Viaje Contratado'}
                </strong>

                <div className="flex flex-wrap gap-2 pt-1">
                  {trip.salud.seguroTelefono && (
                    <a
                      href={`tel:${trip.salud.seguroTelefono.replace(/[^0-9+]/g, '')}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5" /> Llamar Seguro ({trip.salud.seguroTelefono})
                    </a>
                  )}
                  {trip.salud.seguroPoliza && (
                    <button
                      onClick={() => copyToClipboard(trip.salud.seguroPoliza, 'sos_poliza')}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'sos_poliza' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                      <span>{copiedKey === 'sos_poliza' ? '¡Copiada!' : 'Copiar Póliza'}</span>
                    </button>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => {
                      setShowSosModal(false);
                      setActiveTab('salud');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-2 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Ver Ficha y Protocolo Completo en Salud ➔</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setShowSosModal(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}{/* ========================================================================= */}
      {/* --- MODAL: EDITAR ALOJAMIENTO --- */}
      {/* ========================================================================= */}
      {isEditingLodging && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-md w-full shadow-2xl relative text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">Dónde me Alojé (Datos para el taxi)</h3>
              <button onClick={() => setIsEditingLodging(false)} className="text-slate-400 hover:text-white p-1">✕</button>
            </div>

            <form onSubmit={handleSaveLodging} className="space-y-3 mt-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nombre de la Posada / Hotel / Casa *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Posada do Sol Canasvieiras, o Casa de amigos"
                  value={lodgingForm.nombre}
                  onChange={(e) => setLodgingForm({ ...lodgingForm, nombre: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Dirección Exacta (Calle y Número) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Rua das Flores 120, Canasvieiras"
                  value={lodgingForm.direccion}
                  onChange={(e) => setLodgingForm({ ...lodgingForm, direccion: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Teléfono de Contacto de la Posada</label>
                <input
                  type="tel"
                  placeholder="Ej: +55 48 3266 1122"
                  value={lodgingForm.telefono}
                  onChange={(e) => setLodgingForm({ ...lodgingForm, telefono: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nota o Referencia</label>
                <input
                  type="text"
                  placeholder="Ej: A dos cuadras de la playa, cerca de la panadería"
                  value={lodgingForm.notas}
                  onChange={(e) => setLodgingForm({ ...lodgingForm, notas: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingLodging(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold"
                >
                  Guardar Alojamiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

                  {/* ========================================================================= */}
      {/* --- MODAL: EDITAR / REGISTRAR CENTRO MÉDICO O CLÍNICA CERCANA --- */}
      {/* ========================================================================= */}
      {isEditingHospitalModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm overflow-y-auto p-3 sm:p-4">
          <div className="min-h-full flex items-start sm:items-center justify-center py-4 sm:py-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-md w-full shadow-2xl relative text-xs my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-emerald-400" />
                  Centro Médico / Clínica más Cercana
                </h3>
                <span className="text-[10px] text-slate-400">
                  Averigua en recepción al llegar a tu alojamiento y anótalo aquí
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingHospitalModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveHospital} className="space-y-3 mt-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nombre de la Clínica u Hospital *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Clínica San Pablo / Hospital Municipal / Urgencias 24h"
                  value={hospitalForm.nombre}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, nombre: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Dirección Exacta (para mostrarle a taxi o Uber) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Calle Principal 450, Centro"
                  value={hospitalForm.direccion}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, direccion: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Teléfono de Urgencias Médicas
                </label>
                <input
                  type="text"
                  placeholder="Ej: +55 48 3266 0149 o número local"
                  value={hospitalForm.telefono}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, telefono: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingHospitalModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black transition shadow-lg shadow-emerald-600/20 cursor-pointer"
                >
                  ✓ Guardar Centro Médico
                </button>
              </div>
            </form>
          </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- MODAL: EDITAR CONTACTO FAMILIAR EN CASA --- */}
      {/* ========================================================================= */}
      {isEditingFamiliarModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm overflow-y-auto p-3 sm:p-4">
          <div className="min-h-full flex items-start sm:items-center justify-center py-4 sm:py-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-md w-full shadow-2xl relative text-xs my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-cyan-400" />
                  Contacto Familiar en tu País / Casa
                </h3>
                <span className="text-[10px] text-slate-400">
                  A quién contactar o llamar en caso de urgencia
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingFamiliarModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFamiliar} className="space-y-3 mt-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nombre del Familiar o Contacto de Emergencia *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Soledad (Hermana) / Carlos (Hijo)"
                  value={familiarForm.nombre}
                  onChange={(e) => setFamiliarForm({ ...familiarForm, nombre: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Teléfono o WhatsApp con código de país *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: +56 9 7654 3210 o +54 9 11..."
                  value={familiarForm.telefono}
                  onChange={(e) => setFamiliarForm({ ...familiarForm, telefono: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingFamiliarModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black transition shadow-lg shadow-blue-600/20 cursor-pointer"
                >
                  ✓ Guardar Familiar
                </button>
              </div>
            </form>
          </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- MODAL: REGISTRAR / EDITAR AGENCIA DE RETIRO DE DINERO (WESTERN UNION) --- */}
      {/* ========================================================================= */}
      {isAgencyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm overflow-y-auto p-3 sm:p-4">
          <div className="min-h-full flex items-start sm:items-center justify-center py-4 sm:py-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-md w-full shadow-2xl relative text-xs my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  {editingAgencyId ? 'Editar Agencia de Retiro' : 'Registrar Agencia de Retiro o Remesas'}
                </h3>
                <span className="text-[10px] text-slate-400">
                  Western Union, MoneyGram, Casa de Cambio o Punto de Cobro
                </span>
              </div>
              <button
                onClick={() => setIsAgencyModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAgency} className="space-y-3 mt-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nombre de la Agencia o Entidad *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Western Union - Canasvieiras Centro"
                  value={agencyForm.nombre}
                  onChange={(e) => setAgencyForm({ ...agencyForm, nombre: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Dirección Física Completa * (para taxi o GPS)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Av. das Nações 450, Florianópolis - SC"
                  value={agencyForm.direccion}
                  onChange={(e) => setAgencyForm({ ...agencyForm, direccion: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Punto de Referencia (Cómo ubicarla al llegar)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Al lado de la farmacia Panvel, frente a la plaza"
                  value={agencyForm.referencia || ''}
                  onChange={(e) => setAgencyForm({ ...agencyForm, referencia: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Horario de Atención
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Lun a Vie 9:00 - 17:00"
                    value={agencyForm.horario || ''}
                    onChange={(e) => setAgencyForm({ ...agencyForm, horario: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Teléfono Local
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: +55 48 3266 8800"
                    value={agencyForm.telefono || ''}
                    onChange={(e) => setAgencyForm({ ...agencyForm, telefono: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Notas de Retiro y Requisitos
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej: Llevar pasaporte físico vigente y código MTCN de 10 dígitos. Pedir efectivo en moneda local."
                  value={agencyForm.notas || ''}
                  onChange={(e) => setAgencyForm({ ...agencyForm, notas: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  id="chkAgencyVerif"
                  checked={agencyForm.verificado}
                  onChange={(e) => setAgencyForm({ ...agencyForm, verificado: e.target.checked })}
                  className="w-4 h-4 text-emerald-500 rounded cursor-pointer"
                />
                <label htmlFor="chkAgencyVerif" className="text-slate-300 text-[11px] cursor-pointer">
                  <strong className="text-emerald-400">Sucursal Verificada:</strong> Confirmo o me informaron que esta sucursal sigue activa hoy.
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAgencyModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  ✓ Guardar Agencia
                </button>
              </div>
            </form>
          </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- MODAL: AGREGAR PASAJE DE VUELO O TRASLADO --- */}
      {/* ========================================================================= */}
      {isAddingBooking && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm overflow-y-auto p-3 sm:p-4">
          <div className="min-h-full flex items-start sm:items-center justify-center py-4 sm:py-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-lg w-full shadow-2xl relative text-xs my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
                  <Plane className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-black text-white text-base tracking-tight">
                    Agregar Pasaje o Traslado
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Guarda tus datos de vuelo, conexiones y billetes de bus.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingBooking(false)}
                className="text-slate-400 hover:text-white p-1.5 text-base rounded-xl hover:bg-slate-800 transition cursor-pointer"
                aria-label="Cerrar ventana"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBooking} className="space-y-3 mt-3">
              {/* Selector de Tipo de Traslado */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tipo de Transporte</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewBookingType('vuelo')}
                    className={`py-2 px-2 text-center rounded-xl font-bold text-xs border transition flex items-center justify-center gap-2 cursor-pointer ${
                      newBookingType === 'vuelo'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Plane className="w-4 h-4" />
                    <span>✈️ Vuelo Comercial</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewBookingType('transporte')}
                    className={`py-2 px-2 text-center rounded-xl font-bold text-xs border transition flex items-center justify-center gap-2 cursor-pointer ${
                      newBookingType === 'transporte'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Bus className="w-4 h-4" />
                    <span>🚌 Traslado / Bus / Tren</span>
                  </button>
                </div>
              </div>

              {/* ================= VUELO COMERCIAL ================= */}
              {newBookingType === 'vuelo' ? (
                <>
                  {/* ¿Qué viaje es? (Ida o Vuelta) */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      ¿Qué viaje es? (Tramo del vuelo) *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setNewBookingTramoTipo('ida')}
                        className={`py-2 px-1 text-center rounded-xl font-bold text-xs border transition flex items-center justify-center gap-1 cursor-pointer ${
                          newBookingTramoTipo === 'ida'
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        <span>🛫 Vuelo de Ida</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewBookingTramoTipo('vuelta')}
                        className={`py-2 px-1 text-center rounded-xl font-bold text-xs border transition flex items-center justify-center gap-1 cursor-pointer ${
                          newBookingTramoTipo === 'vuelta'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        <span>🛬 Regreso / Vuelta</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewBookingTramoTipo('escala')}
                        className={`py-2 px-1 text-center rounded-xl font-bold text-xs border transition flex items-center justify-center gap-1 cursor-pointer ${
                          newBookingTramoTipo === 'escala'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        <span>🔄 Conexión / Escala</span>
                      </button>
                    </div>
                  </div>

                  {/* SUBIDA DE FOTO O PDF DEL PASAJE CON AUTO-COMPLETADO */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-300 font-semibold block">
                        📸 Foto o PDF de tu Pasaje / Tarjeta de Embarque
                      </label>
                      <div className="flex items-center gap-1 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleApplySampleTicket('ida')}
                          className="text-[11px] text-cyan-300 hover:text-cyan-200 font-bold flex items-center gap-1 cursor-pointer bg-cyan-950/60 hover:bg-cyan-900 px-2 py-0.5 rounded-lg border border-cyan-700/60 transition"
                          title="Auto-completar vuelo de ida"
                        >
                          <Plane className="w-3 h-3 text-cyan-400" />
                          <span>🛫 Ejemplo Ida</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplySampleTicket('vuelta')}
                          className="text-[11px] text-purple-300 hover:text-purple-200 font-bold flex items-center gap-1 cursor-pointer bg-purple-950/60 hover:bg-purple-900 px-2 py-0.5 rounded-lg border border-purple-700/60 transition"
                          title="Auto-completar vuelo de regreso directo"
                        >
                          <Plane className="w-3 h-3 text-purple-400 rotate-90" />
                          <span>🛬 Regreso Directo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplySampleTicket('escala')}
                          className="text-[11px] text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 cursor-pointer bg-amber-950/60 hover:bg-amber-900 px-2 py-0.5 rounded-lg border border-amber-700/60 transition"
                          title="Auto-completar regreso con escala en São Paulo"
                        >
                          <CornerDownRight className="w-3 h-3 text-amber-400" />
                          <span>🔄 Con Escala</span>
                        </button>
                      </div>
                    </div>

                    <label className="border border-dashed border-slate-700 hover:border-cyan-500 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer bg-slate-950/60 transition">
                      <Upload className="w-5 h-5 text-cyan-400 mb-1" />
                      <span className="text-[11px] text-slate-300 font-medium text-center">
                        {newBookingFile ? (
                          <span className="text-emerald-400 font-bold">✓ {newBookingFile.name}</span>
                        ) : (
                          'Toca para seleccionar foto de tu pasaje o PDF'
                        )}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-0.5">
                        Lector Óptico inteligente: detecta Ida, Regreso, N° de Vuelo, Código y Escalas
                      </span>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={handleTicketFileChange}
                      />
                    </label>

                    {isOcrScanning && (
                      <div className="p-3 bg-blue-950/80 border border-blue-500/50 rounded-xl text-cyan-200 text-xs flex items-center gap-2.5 animate-pulse">
                        <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                        <div>
                          <span className="font-bold block">🔍 Lector Óptico en progreso...</span>
                          <span className="text-[11px] text-slate-300">Escaneando pasaje (número de vuelo, código de reserva, tramo ida/vuelta, escalas...)</span>
                        </div>
                      </div>
                    )}
                    {/* BANNER DE ITINERARIO COMPLETO DETECTADO */}
                    {detectedItinerary && (
                      <div className="p-3.5 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 rounded-2xl border-2 border-cyan-500/50 shadow-xl space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold text-cyan-300 text-xs">
                            <Sparkles className="w-4 h-4 text-cyan-400" />
                            <span>✨ ¡Itinerario Completo Detectado!</span>
                          </div>
                          <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-mono font-bold px-2 py-0.5 rounded-full border border-cyan-500/30">
                            Reserva: {detectedItinerary.pnr}
                          </span>
                        </div>

                        {detectedItinerary.pasajero && (
                          <p className="text-[11px] text-slate-300">
                            Pasajero: <strong className="text-white">{detectedItinerary.pasajero}</strong>
                          </p>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {detectedItinerary.ida && (
                            <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                              <span className="text-[10px] font-bold text-cyan-400 uppercase flex items-center gap-1">
                                <Plane className="w-3 h-3" /> 1. Ida ({detectedItinerary.ida.titulo})
                              </span>
                              <strong className="text-white block">{detectedItinerary.ida.numeroVuelo} • {detectedItinerary.ida.origen} ➔ {detectedItinerary.ida.destino}</strong>
                              <span className="text-[10px] text-slate-400 block">
                                {detectedItinerary.ida.fechaTexto || detectedItinerary.ida.fecha} ({detectedItinerary.ida.hora} hrs)
                              </span>
                              <button
                                type="button"
                                onClick={() => applyDetectedLegToForm(detectedItinerary.ida!)}
                                className="mt-1 w-full py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 rounded-lg text-[10px] font-bold transition cursor-pointer"
                              >
                                Cargar solo Ida en formulario
                              </button>
                            </div>
                          )}

                          {detectedItinerary.regreso && (
                            <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                              <span className="text-[10px] font-bold text-purple-400 uppercase flex items-center gap-1">
                                <Plane className="w-3 h-3 rotate-90" /> 2. Regreso ({detectedItinerary.regreso.hasLayover ? 'Con Escala' : 'Directo'})
                              </span>
                              <strong className="text-white block">{detectedItinerary.regreso.numeroVuelo} • {detectedItinerary.regreso.origen} ➔ {detectedItinerary.regreso.destino}</strong>
                              {detectedItinerary.regreso.escala && (
                                <span className="text-[10px] text-amber-300 block line-clamp-1">
                                  {detectedItinerary.regreso.escala}
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => applyDetectedLegToForm(detectedItinerary.regreso!)}
                                className="mt-1 w-full py-1 bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800 rounded-lg text-[10px] font-bold transition cursor-pointer"
                              >
                                Cargar solo Regreso en formulario
                              </button>
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={handleImportFullItinerary}
                          className="w-full py-2 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl font-black text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <Check className="w-4 h-4" /> Importar Itinerario Completo (Guardar Ida y Regreso de una vez)
                        </button>
                      </div>
                    )}

                    {autoFillSuccessMsg && (
                      <div className="p-2.5 bg-cyan-950/60 border border-cyan-500/40 rounded-xl text-cyan-200 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>{autoFillSuccessMsg}</span>
                      </div>
                    )}
                  
                  </div>

                  {/* SEPARADOR: DATOS MANUALES O VERIFICACIÓN */}
                  <div className="pt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Ticket className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Datos del Vuelo (Revisa o Edita libremente):</span>
                      </span>
                      <div className="h-px bg-slate-800 flex-1"></div>
                    </div>
                  </div>

                  {/* CÓDIGO DE RESERVA Y NÚMERO DE VUELO (Las 2 cosas clave que pidió la usuaria) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        🎫 Código de Reserva (PNR) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: 13N7JY"
                        value={newBookingCode}
                        onChange={(e) => setNewBookingCode(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono uppercase tracking-widest text-sm font-bold"
                      />
                      <span className="text-[10px] text-slate-400 block mt-0.5">Tus 6 letras/números para check-in</span>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        ✈️ Número de Vuelo *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: JA 560 o LA 402"
                        value={newBookingNumeroVuelo}
                        onChange={(e) => setNewBookingNumeroVuelo(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono uppercase tracking-wider text-sm font-bold"
                      />
                      <span className="text-[10px] text-cyan-400 block mt-0.5">El que anuncian en pantallas</span>
                    </div>
                  </div>

                  {/* Aerolínea */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Aerolínea</label>
                    <input
                      type="text"
                      placeholder="Ej: JetSmart, LATAM, Sky, Gol, etc."
                      value={newBookingTitle}
                      onChange={(e) => setNewBookingTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  {/* Ruta: Origen a Destino */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Ciudad u Origen</label>
                      <input
                        type="text"
                        placeholder="Ej: Santiago (SCL)"
                        value={newBookingOrigen}
                        onChange={(e) => setNewBookingOrigen(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Ciudad o Destino</label>
                      <input
                        type="text"
                        placeholder="Ej: Florianópolis (FLN)"
                        value={newBookingDestino}
                        onChange={(e) => setNewBookingDestino(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  {/* Fechas y Horarios */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Fecha</label>
                      <input
                        type="date"
                        value={newBookingDate}
                        onChange={(e) => setNewBookingDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Hora Salida</label>
                      <input
                        type="time"
                        value={newBookingTime}
                        onChange={(e) => setNewBookingTime(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Llegada aprox</label>
                      <input
                        type="time"
                        value={newBookingHoraLlegada}
                        onChange={(e) => setNewBookingHoraLlegada(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white text-xs"
                      />
                    </div>
                  </div>

                  {/* Asiento y Puerta (Opcionales) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Asiento (Opcional)</label>
                      <input
                        type="text"
                        placeholder="Ej: 12C o 14A"
                        value={newBookingAsiento}
                        onChange={(e) => setNewBookingAsiento(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Terminal / Puerta (Opcional)</label>
                      <input
                        type="text"
                        placeholder="Ej: T2 / Puerta 14"
                        value={newBookingTerminalPuerta}
                        onChange={(e) => setNewBookingTerminalPuerta(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  {/* Escala y Conexión */}
                  {newBookingTramoTipo === 'escala' ? (
                    <div className="p-3 bg-amber-950/20 rounded-xl border border-amber-500/40 space-y-2.5">
                      <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                        <CornerDownRight className="w-4 h-4" />
                        <span>Datos de esta Escala / Conexión</span>
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-300 mb-1">
                          Detalle de la conexión (Aeropuerto o tiempo de espera):
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Conexión de 2h en São Paulo (GRU) rumbo a Florianópolis"
                          value={newBookingLayoverInfo}
                          onChange={(e) => setNewBookingLayoverInfo(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="chkBagDirectConnection"
                          checked={newBookingBagDirect}
                          onChange={(e) => setNewBookingBagDirect(e.target.checked)}
                          className="w-4 h-4 text-emerald-500 rounded cursor-pointer"
                        />
                        <label htmlFor="chkBagDirectConnection" className="text-[11px] text-slate-300 cursor-pointer">
                          Mi equipaje viene transferido directo (no tengo que retirarlo en este aeropuerto)
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                      <label className="block text-slate-300 font-semibold text-xs">
                        ¿Este vuelo es directo o tiene escala?
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setNewBookingHasLayover(false)}
                          className={`py-2 px-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            !newBookingHasLayover
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          <span>🟢 Directo (Sin escalas)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewBookingHasLayover(true)}
                          className={`py-2 px-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            newBookingHasLayover
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          <span>🔄 Con Escala</span>
                        </button>
                      </div>

                      {newBookingHasLayover && (
                        <div className="space-y-2 pt-2 border-t border-slate-800">
                          <div>
                            <label className="block text-[11px] text-slate-400 mb-0.5">
                              Aeropuerto o Ciudad donde hace escala:
                            </label>
                            <input
                              type="text"
                              placeholder="Ej: Escala de 2h 30m en São Paulo (GRU)"
                              value={newBookingLayoverInfo}
                              onChange={(e) => setNewBookingLayoverInfo(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="chkBagDirect"
                              checked={newBookingBagDirect}
                              onChange={(e) => setNewBookingBagDirect(e.target.checked)}
                              className="w-3.5 h-3.5 text-emerald-500 rounded cursor-pointer"
                            />
                            <label htmlFor="chkBagDirect" className="text-[11px] text-slate-300 cursor-pointer">
                              Mi equipaje va directo al destino final (no lo retiro en la escala)
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </>
              ) : (
                /* ================= TRASLADO / BUS / TREN ================= */
                <>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Empresa de Bus, Tren o Tipo de Transfer *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Bus Catarinense, Transfer Aeropuerto, etc."
                      value={newBookingTitle}
                      onChange={(e) => setNewBookingTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Código de Billete o Localizador *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: TKT-88219 o Billete N° 450"
                      value={newBookingCode}
                      onChange={(e) => setNewBookingCode(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Origen / Parada de Subida</label>
                      <input
                        type="text"
                        placeholder="Ej: Terminal Rodoviária"
                        value={newBookingOrigen}
                        onChange={(e) => setNewBookingOrigen(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Destino / Parada de Bajada</label>
                      <input
                        type="text"
                        placeholder="Ej: Posada Canasvieiras"
                        value={newBookingDestino}
                        onChange={(e) => setNewBookingDestino(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Fecha</label>
                      <input
                        type="date"
                        value={newBookingDate}
                        onChange={(e) => setNewBookingDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Hora de Salida</label>
                      <input
                        type="time"
                        value={newBookingTime}
                        onChange={(e) => setNewBookingTime(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Asiento o Andén (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ej: Asiento 24 / Andén 4"
                      value={newBookingAsiento}
                      onChange={(e) => setNewBookingAsiento(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  {/* Subir comprobante bus */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Adjuntar Billete o Comprobante (Opcional)
                    </label>
                    <label className="border border-dashed border-slate-700 hover:border-amber-500 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer bg-slate-950/60 transition">
                      <Upload className="w-5 h-5 text-amber-400 mb-1" />
                      <span className="text-[11px] text-slate-300 font-medium">
                        {newBookingFile ? (
                          <span className="text-emerald-400 font-bold">✓ {newBookingFile.name}</span>
                        ) : (
                          'Toca para adjuntar foto o PDF del billete'
                        )}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setNewBookingFile)}
                      />
                    </label>
                  </div>
                </>
              )}

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingBooking(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold cursor-pointer hover:bg-slate-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold cursor-pointer transition shadow-md"
                >
                  Guardar en mi Bitácora
                </button>
              </div>
            </form>
          </div>
        </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- MODAL DEDICADO: EDITAR SEGURO DE VIAJE --- */}
      {/* ========================================================================= */}
      {isEditingInsuranceModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm overflow-y-auto p-3 sm:p-4">
          <div className="min-h-full flex items-start sm:items-center justify-center py-4 sm:py-6">
            <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-5 max-w-md w-full shadow-2xl relative text-xs my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Editar Seguro de Viaje</h3>
                  <p className="text-[11px] text-slate-400">Datos vitales ante urgencias médicas y reembolsos.</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditingInsuranceModal(false)}
                className="text-slate-400 hover:text-white p-1 text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveInsuranceModal} className="space-y-3 mt-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nombre de la Aseguradora o Asistencia *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Escribe el nombre de tu aseguradora (Ej: Assist Card, Mapfre, Universal Assistance, Allianz, etc.)"
                  value={insuranceForm.compania}
                  onChange={(e) => setInsuranceForm({ ...insuranceForm, compania: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Número de Póliza / Voucher *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: POL-BR-99218"
                  value={insuranceForm.poliza}
                  onChange={(e) => setInsuranceForm({ ...insuranceForm, poliza: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono uppercase font-bold"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">El código identificador de tu contrato</span>
              </div>

              {/* Fechas de vigencia de la póliza */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    🗓️ Fecha Contratación / Inicio
                  </label>
                  <input
                    type="date"
                    value={insuranceForm.fechaInicio}
                    onChange={(e) => setInsuranceForm({ ...insuranceForm, fechaInicio: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    🗓️ Fecha de Término
                  </label>
                  <input
                    type="date"
                    value={insuranceForm.fechaFin}
                    onChange={(e) => setInsuranceForm({ ...insuranceForm, fechaFin: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  📞 Teléfono de Emergencia en el Extranjero (Llamada local en destino)
                </label>
                <input
                  type="tel"
                  placeholder="Ej: +55 11 3132 1000"
                  value={insuranceForm.telefonoDestino}
                  onChange={(e) => setInsuranceForm({ ...insuranceForm, telefonoDestino: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  El número para llamar desde el país donde estás viajando ante una urgencia.
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  🏠 Teléfono de Asistencia desde tu País de Origen / Casa
                </label>
                <input
                  type="tel"
                  placeholder="Ej: +56 2 2897 5000"
                  value={insuranceForm.telefonoOrigen}
                  onChange={(e) => setInsuranceForm({ ...insuranceForm, telefonoOrigen: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Para que tu familia en casa pueda llamar a la aseguradora y coordinar la atención si estás solo.
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  ✉️ Correo Electrónico de Asistencia Médica
                </label>
                <input
                  type="email"
                  placeholder="Ej: asistencias@seguroviaje.com"
                  value={insuranceForm.email}
                  onChange={(e) => setInsuranceForm({ ...insuranceForm, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Útil para coordinar si no tienes señal celular pero sí WiFi en la clínica u hotel.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingInsuranceModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold cursor-pointer hover:bg-slate-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold cursor-pointer transition shadow-md"
                >
                  Guardar Seguro
                </button>
              </div>
            </form>
          </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- MODAL: EDITAR SOS --- */}
      {/* ========================================================================= */}
      {isEditingSos && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-md w-full shadow-2xl relative text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">Editar Contacto SOS y Consulado</h3>
              <button onClick={() => setIsEditingSos(false)} className="text-slate-400 hover:text-white p-1">✕</button>
            </div>

            <form onSubmit={handleSaveSos} className="space-y-3 mt-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nombre Familiar en tu País</label>
                <input
                  type="text"
                  value={sosForm.familiarNombre}
                  onChange={(e) => setSosForm({ ...sosForm, familiarNombre: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Teléfono Familiar (con código país)</label>
                <input
                  type="tel"
                  value={sosForm.familiarTelefono}
                  onChange={(e) => setSosForm({ ...sosForm, familiarTelefono: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nombre del Consulado</label>
                <input
                  type="text"
                  value={sosForm.consuladoNombre}
                  onChange={(e) => setSosForm({ ...sosForm, consuladoNombre: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Teléfono del Consulado</label>
                <input
                  type="tel"
                  value={sosForm.consuladoTelefono}
                  onChange={(e) => setSosForm({ ...sosForm, consuladoTelefono: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Dirección del Consulado</label>
                <input
                  type="text"
                  value={sosForm.consuladoDireccion}
                  onChange={(e) => setSosForm({ ...sosForm, consuladoDireccion: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingSos(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- MODAL: EDITAR SALUD RELLENABLE --- */}
      {/* ========================================================================= */}
      {isEditingHealth && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm overflow-y-auto p-3 sm:p-4">
          <div className="min-h-full flex items-start sm:items-center justify-center py-4 sm:py-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-lg w-full shadow-2xl relative text-xs my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">Rellenar Datos Reales de Salud y Urgencias</h3>
              <button onClick={() => setIsEditingHealth(false)} className="text-slate-400 hover:text-white p-1">✕</button>
            </div>

            <form onSubmit={handleSaveHealth} className="space-y-3 mt-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="chkTieneSeguro"
                  checked={healthForm.tieneSeguro}
                  onChange={(e) => setHealthForm({ ...healthForm, tieneSeguro: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="chkTieneSeguro" className="text-xs font-bold text-white cursor-pointer">
                  ¿Viajo con seguro médico de viaje contratado?
                </label>
              </div>

              {healthForm.tieneSeguro && (
                <div className="space-y-3 p-3 bg-slate-950 rounded-xl border border-emerald-500/20">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Nombre de la Compañía de Seguro</label>
                    <input
                      type="text"
                      value={healthForm.seguroCompania}
                      onChange={(e) => setHealthForm({ ...healthForm, seguroCompania: e.target.value })}
                      placeholder="Ej: Assist Card, Universal Assistance, etc."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Número de Póliza / Voucher</label>
                    <input
                      type="text"
                      value={healthForm.seguroPoliza}
                      onChange={(e) => setHealthForm({ ...healthForm, seguroPoliza: e.target.value })}
                      placeholder="Ej: POL-BR-99120"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">📞 Teléfono en el Extranjero</label>
                      <input
                        type="tel"
                        value={healthForm.seguroTelefono}
                        onChange={(e) => setHealthForm({ ...healthForm, seguroTelefono: e.target.value })}
                        placeholder="Ej: +55 11 3132 1000"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">🏠 Teléfono desde Casa / País de Origen</label>
                      <input
                        type="tel"
                        value={healthForm.seguroTelefonoOrigen || ''}
                        onChange={(e) => setHealthForm({ ...healthForm, seguroTelefonoOrigen: e.target.value })}
                        placeholder="Ej: +56 2 2897 5000"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">✉️ Correo Electrónico de Asistencia Médica</label>
                    <input
                      type="email"
                      value={healthForm.seguroEmail || ''}
                      onChange={(e) => setHealthForm({ ...healthForm, seguroEmail: e.target.value })}
                      placeholder="Ej: asistencias@seguroviaje.com"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Centro de Urgencia / Hospital más cercano al Hotel:
                </span>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nombre del Hospital / Clínica</label>
                  <input
                    type="text"
                    value={healthForm.hospitalCercanoNombre}
                    onChange={(e) => setHealthForm({ ...healthForm, hospitalCercanoNombre: e.target.value })}
                    placeholder="Ej: UPA 24h Canasvieiras"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dirección del Hospital / Clínica</label>
                  <input
                    type="text"
                    value={healthForm.hospitalCercanoDireccion}
                    onChange={(e) => setHealthForm({ ...healthForm, hospitalCercanoDireccion: e.target.value })}
                    placeholder="Ej: Rua Francisco Faustino, Canasvieiras"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Teléfono del Hospital</label>
                    <input
                      type="tel"
                      value={healthForm.hospitalCercanoTelefono}
                      onChange={(e) => setHealthForm({ ...healthForm, hospitalCercanoTelefono: e.target.value })}
                      placeholder="Ej: +55 48 3266 0149"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Número Ambulancia País</label>
                    <input
                      type="text"
                      value={healthForm.numeroAmbulanciaLocal}
                      onChange={(e) => setHealthForm({ ...healthForm, numeroAmbulanciaLocal: e.target.value })}
                      placeholder="Ej: 192 (SAMU)"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Ficha Médica Básica */}
              <div className="space-y-3 p-3 bg-slate-950 rounded-xl border border-emerald-500/30">
                <span className="text-[10px] font-bold text-emerald-400 uppercase block tracking-wider">
                  Ficha Médica Básica (Visible en caso de emergencia):
                </span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Grupo Sanguíneo</label>
                    <input
                      type="text"
                      value={healthForm.tipoSangre}
                      onChange={(e) => setHealthForm({ ...healthForm, tipoSangre: e.target.value })}
                      placeholder="Ej: O+, A+, B-, etc."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Alergias Conocidas</label>
                    <input
                      type="text"
                      value={healthForm.alergias}
                      onChange={(e) => setHealthForm({ ...healthForm, alergias: e.target.value })}
                      placeholder="Ej: Penicilina, Mariscos, Ninguna"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Medicamentos Diarios</label>
                    <input
                      type="text"
                      value={healthForm.medicamentosDiarios}
                      onChange={(e) => setHealthForm({ ...healthForm, medicamentosDiarios: e.target.value })}
                      placeholder="Ej: Losartán 50mg, Eutirox"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Condición Médica</label>
                    <input
                      type="text"
                      value={healthForm.condicionesMedicas}
                      onChange={(e) => setHealthForm({ ...healthForm, condicionesMedicas: e.target.value })}
                      placeholder="Ej: Hipertensión, Asma, Ninguna"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nota o Plan de Fondos para Salud</label>
                <input
                  type="text"
                  value={healthForm.fondosEmergenciaNotas}
                  onChange={(e) => setHealthForm({ ...healthForm, fondosEmergenciaNotas: e.target.value })}
                  placeholder="Ej: Guardar boletas originales para reembolso..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingHealth(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold"
                >
                  Guardar Datos de Salud
                </button>
              </div>
            </form>
          </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- VISOR DE COMPROBANTE --- */}
      {/* ========================================================================= */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-4 max-w-xl w-full shadow-2xl relative text-xs flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-white text-sm truncate">{previewDoc.title}</span>
              <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-white p-1">✕</button>
            </div>
            <div className="flex-1 overflow-auto py-4 flex items-center justify-center">
              {previewDoc.isPdf ? (
                <iframe src={previewDoc.url} className="w-full h-96 rounded-xl border border-slate-800" title="Pasaje PDF" />
              ) : (
                <img src={previewDoc.url} alt="Comprobante" className="max-w-full max-h-96 rounded-xl object-contain" />
              )}
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold cursor-pointer"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-4 text-center text-xs text-slate-500 mb-12 sm:mb-0">
        Viaja Fácil • Tu Bitácora Inteligente de Viaje
      </footer>
    </div>
  );
}
