import React, { useState, useEffect } from 'react';
import {
  Compass,
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
  X
} from 'lucide-react';

// Estructura de Movilidad por Destino
interface MobilityInfo {
  llegadaAeropuerto: string;
  appsYTransporte: string;
  alquilerYConduccion: string;
  mapasOffline: string;
  costumbresDinero: string;
}

// Preset inteligente de país/ciudad
interface DestinationPreset {
  pais: string;
  destinoDefault: string;
  bandera: string;
  moneda: string;
  enchufe: string;
  voltaje: string;
  clima: string;
  tipoViajeDefault: 'playa' | 'ciudad' | 'frio';
  ambulancia: string;
  consuladoDefault: string;
  consuladoTelDefault: string;
  consuladoDirDefault: string;
  movilidad: MobilityInfo;
}

const DESTINATIONS: Record<string, DestinationPreset> = {
  brasil: {
    pais: 'Brasil',
    destinoDefault: 'Florianópolis',
    bandera: '🇧🇷',
    moneda: 'Real Brasileño (BRL - R$)',
    enchufe: 'Tipo N (3 patitas en rombo) y Tipo C',
    voltaje: '220V en Florianópolis (ideal 100-240V)',
    clima: 'Cálido y playero (27°C a 31°C). Chaparrones de 20 min en verano.',
    tipoViajeDefault: 'playa',
    ambulancia: '192 (SAMU Brasil)',
    consuladoDefault: 'Consulado General de Chile en Florianópolis / Curitiba',
    consuladoTelDefault: '+55 48 3028 9000',
    consuladoDirDefault: 'Av. Beira Mar Norte, Florianópolis - SC',
    movilidad: {
      llegadaAeropuerto: 'Usa transporte oficial en el Aeropuerto Hercílio Luz: toma Uber en el punto de encuentro señalizado o taxis con tarifa prefijada en la ventanilla oficial interior. Nunca aceptes autos informales en el hall.',
      appsYTransporte: 'En Brasil operan Uber y la aplicación local "99" (suele ser más económica que Uber). Para buses en la isla (sistema TICEN / Canasvieiras) se puede pagar con efectivo exacto o tarjeta de transporte.',
      alquilerYConduccion: 'Tu licencia de conducir física chilena al día es 100% válida por convenio Mercosur. En verano hay alto tráfico en las vías hacia las playas del norte; respeta los radares de velocidad (lombadas electrónicas).',
      mapasOffline: 'Antes de salir del hotel, abre Google Maps y descarga el mapa de Florianópolis sin conexión. En playas como Brava o Naufragados la señal de celular suele ser débil.',
      costumbresDinero: 'En Brasil casi todo se paga con tarjeta contactless o débito internacional. Mantén billetes pequeños de 10 o 20 reales en efectivo para comprar caipirinhas o choclo en la arena y para peajes.'
    }
  },
  espana: {
    pais: 'España',
    destinoDefault: 'Madrid',
    bandera: '🇪🇸',
    moneda: 'Euro (EUR - €)',
    enchufe: 'Tipo C y F (2 patitas redondas europeas)',
    voltaje: '230V (Frecuencia 50 Hz)',
    clima: 'Mediterráneo/continental. Caluroso en verano, fresco/frío en invierno.',
    tipoViajeDefault: 'ciudad',
    ambulancia: '112 (Urgencias Sanitarias UE)',
    consuladoDefault: 'Consulado General de Chile en Madrid',
    consuladoTelDefault: '+34 91 308 0555',
    consuladoDirDefault: 'Calle Rafael Calvo 18, Madrid',
    movilidad: {
      llegadaAeropuerto: 'Desde el Aeropuerto Adolfo Suárez Barajas tienes Metro (Línea 8 directa a Nuevos Ministerios), tren de Cercanías Renfe o Taxi oficial con tarifa plana fija de 33€ al centro de Madrid (no dejes que te cobren extras).',
      appsYTransporte: 'El Metro de Madrid y la red de buses EMT son excepcionales. Compra en las máquinas la Tarjeta Multi recargable (sirve para 10 viajes). Para apps privadas operan Cabify, Uber y FreeNow (taxis regulados).',
      alquilerYConduccion: 'En el centro de Madrid no conviene auto por las Zonas de Bajas Emisiones (ZBE) y multas automáticas con cámara. Si viajas a pueblos, tu licencia chilena es aceptada los primeros meses como turista, aunque se recomienda Licencia Internacional.',
      mapasOffline: 'Descarga el mapa sin conexión en Google Maps o utiliza la app Citymapper para ver transbordos exactos de metro y bus en tiempo real.',
      costumbresDinero: 'El pago con tarjeta (contactless) se acepta desde 1 euro en panaderías y taxis. Los billetes de 100€ o más son difíciles de cambiar en comercios pequeños; pide billetes de 20€ o 50€ al cambiar.'
    }
  },
  estados_unidos: {
    pais: 'Estados Unidos',
    destinoDefault: 'Miami, Florida',
    bandera: '🇺🇸',
    moneda: 'Dólar Estadounidense (USD - $)',
    enchufe: 'Tipo A y B (2 clavijas planas paralelas con/sin tierra)',
    voltaje: '120V (Frecuencia 60 Hz - verificar que diga 100-240V)',
    clima: 'Cálido y húmedo (28°C a 33°C). Chaparrones tropicales repentinos en verano.',
    tipoViajeDefault: 'playa',
    ambulancia: '911 (Emergencias Generales)',
    consuladoDefault: 'Consulado General de Chile en Miami',
    consuladoTelDefault: '+1 305 373 8623',
    consuladoDirDefault: '800 Brickell Ave, Miami, FL',
    movilidad: {
      llegadaAeropuerto: 'En Miami (MIA), sigue las señales hacia MIA Mover para ir al centro de autos de alquiler (Rental Car Center) o sube al segundo piso para el punto de recogida de Uber o Lyft.',
      appsYTransporte: 'Uber y Lyft son las apps indispensables y funcionan en minutos. En Miami Beach está el trolley gratuito y en Downtown el Metromover elevado sin costo.',
      alquilerYConduccion: 'En Florida el auto es casi obligatorio. Tu licencia chilena vigente es aceptada para arrendar. Ojo: casi todas las autopistas (Turnpike, Dolphin Expressway) tienen peaje electrónico (SunPass / Toll-by-Plate).',
      mapasOffline: 'Descarga siempre el mapa en Google Maps. Las salidas de las autopistas de 5 carriles son muy rápidas y si pierdes la señal podrías pasarte de largo.',
      costumbresDinero: 'Uso del 100% con tarjeta. El efectivo casi no se usa. En restaurantes la propina ("tip") del 18% al 20% es costumbre cultural obligatoria (a veces ya viene sugerida en la cuenta).'
    }
  },
  argentina: {
    pais: 'Argentina',
    destinoDefault: 'Buenos Aires',
    bandera: '🇦🇷',
    moneda: 'Peso Argentino (ARS - $)',
    enchufe: 'Tipo I (3 patas planas en V) y Tipo C',
    voltaje: '220V (Frecuencia 50 Hz)',
    clima: 'Veranos calurosos y húmedos (28°C a 34°C); inviernos templados y frescos.',
    tipoViajeDefault: 'ciudad',
    ambulancia: '107 (SAME)',
    consuladoDefault: 'Consulado General de Chile en Buenos Aires',
    consuladoTelDefault: '+54 11 4331 6228',
    consuladoDirDefault: 'Diagonal Norte 832, CABA',
    movilidad: {
      llegadaAeropuerto: 'Desde Ezeiza toma Tienda León (bus seguro hasta Retiro) o contrata taxi en las cabinas oficiales dentro de la terminal (Taxi Ezeiza). En Aeroparque (AEP) puedes pedir Uber o taxi de la parada reglamentada.',
      appsYTransporte: 'Cabify, Uber y Didi funcionan fluidamente. Para colectivos (buses) y Subte (metro) es obligatoria la tarjeta plástica SUBE (puedes comprarla en kioscos o estaciones de tren).',
      alquilerYConduccion: 'Licencia chilena física válida por convenio Mercosur. En Buenos Aires el tráfico y el estacionamiento céntrico son complejos, por lo que es mucho mejor moverse en subte o apps.',
      mapasOffline: 'Descarga el mapa de la Ciudad de Buenos Aires en Google Maps o la app oficial BA Cómo Llego.',
      costumbresDinero: 'Para turistas chilenos, pagar con tarjetas de débito/crédito aplica la cotización favorable MEP. Si llevas efectivo (dólares), cámbialos en casas de cambio autorizadas.'
    }
  },
  colombia: {
    pais: 'Colombia',
    destinoDefault: 'Cartagena de Indias',
    bandera: '🇨🇴',
    moneda: 'Peso Colombiano (COP - $)',
    enchufe: 'Tipo A y B (patas planas tipo americano)',
    voltaje: '110V (Frecuencia 60 Hz)',
    clima: 'Tropical cálido y húmedo (30°C promedio). Brisa marina.',
    tipoViajeDefault: 'playa',
    ambulancia: '123 (Emergencias Nacionales)',
    consuladoDefault: 'Consulado General de Chile en Bogotá / Colombia',
    consuladoTelDefault: '+57 601 742 4110',
    consuladoDirDefault: 'Calle 100 No. 11B-27, Bogotá',
    movilidad: {
      llegadaAeropuerto: 'En el Aeropuerto de Cartagena pide tu tiquete oficial de taxi en el tótem de la salida con el valor exacto impreso según tu hotel para evitar sobreprecios.',
      appsYTransporte: 'En Colombia funcionan Uber, InDrive, Cabify y Didi. En Cartagena dentro de la Ciudad Amurallada todo se hace caminando a pie de forma hermosa.',
      alquilerYConduccion: 'No se recomienda alquilar auto para turismo en centros históricos por congestión y falta de estacionamientos.',
      mapasOffline: 'Descarga el mapa de la ciudad en Google Maps antes de pasear por Getsemaní y Bocagrande.',
      costumbresDinero: 'Manejan billetes de alta denominación (miles de pesos). Ten siempre billetes de 2.000, 5.000 y 10.000 COP para propinas y jugos naturales en la calle.'
    }
  },
  peru: {
    pais: 'Perú',
    destinoDefault: 'Cusco / Lima',
    bandera: '🇵🇪',
    moneda: 'Sol Peruano (PEN - S/)',
    enchufe: 'Tipo A y C (universal plano y redondo)',
    voltaje: '220V (Frecuencia 60 Hz)',
    clima: 'En Cusco clima andino seco (días templados 19°C, noches frías 4°C).',
    tipoViajeDefault: 'ciudad',
    ambulancia: '106 (SAMU Perú)',
    consuladoDefault: 'Consulado General de Chile en Lima',
    consuladoTelDefault: '+51 1 710 2200',
    consuladoDirDefault: 'Av. Javier Prado Oeste 790, San Isidro, Lima',
    movilidad: {
      llegadaAeropuerto: 'En Lima usa Taxi Green o Taxi Directo desde el counter oficial. En Cusco coordina el transfer con tu hotel o usa taxis de la terminal con tarifa acordada previa.',
      appsYTransporte: 'Uber y Cabify operan en Lima y zonas céntricas de Cusco. En Cusco para Machu Picchu el tren (PeruRail / Inca Rail) debe reservarse con anticipación.',
      alquilerYConduccion: 'No es aconsejable arrendar auto en ciudades por el estilo de conducción y altura en la sierra; el servicio de chofer o taxi es muy económico.',
      mapasOffline: 'Fundamental descargar mapas offline para el Valle Sagrado donde la cobertura móvil es intermitente.',
      costumbresDinero: 'Importante: En Perú NO aceptan billetes rotos, doblados o rayados (ni soles ni dólares). Revisa siempre que te entreguen billetes en perfecto estado.'
    }
  }
};

interface SimpleBooking {
  id: string;
  tipo: 'vuelo' | 'seguro' | 'transporte';
  titulo: string;
  codigo: string;
  fecha: string;
  hora: string;
  escala?: string;
  maletaDirecta?: boolean;
  telefonoContacto?: string;
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
  seguroTelefono: string;
  hospitalCercanoNombre: string;
  hospitalCercanoDireccion: string;
  hospitalCercanoTelefono: string;
  numeroAmbulanciaLocal: string;
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
}

const DEFAULT_TRIP: SimpleTrip = {
  id: 'florianopolis-viaja-facil-v10',
  nombre: 'Vacaciones en Florianópolis, Brasil',
  origen: 'Santiago de Chile',
  destino: 'Florianópolis',
  paisKey: 'brasil',
  pais: 'Brasil',
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
    seguroCompania: 'Asistencia Médica de Viaje',
    seguroPoliza: 'POL-BR-99120',
    seguroTelefono: '+55 11 3132 1000',
    hospitalCercanoNombre: 'UPA 24h Canasvieiras (Urgencias Públicas)',
    hospitalCercanoDireccion: 'Rua Francisco Faustino dos Santos, Canasvieiras',
    hospitalCercanoTelefono: '+55 48 3266 0149',
    numeroAmbulanciaLocal: '192 (SAMU Brasil)',
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
      titulo: 'Vuelo JetSmart Santiago ➔ Florianópolis',
      codigo: '13N7JY',
      fecha: '2026-12-23',
      hora: '07:45 AM',
      escala: 'Vuelo directo (Sin escalas)',
      maletaDirecta: true,
      telefonoContacto: '+56 2 2731 8787',
      notas: 'Llegada al Aeropuerto Hercílio Luz (FLN).'
    },
    {
      id: 'pas-2',
      tipo: 'seguro',
      titulo: 'Certificado de Asistencia Médica Internacional',
      codigo: 'POL-BR-99120',
      fecha: '2026-12-23 al 2026-12-30',
      hora: '24 horas',
      telefonoContacto: '+55 11 3132 1000',
      notas: 'Llamar antes de acudir al centro médico para coordinación.'
    }
  ],
  equipaje: [
    // Infaltables
    { id: 'inf-1', nombre: 'Cédula física o Pasaporte vigente (en bolso de mano)', categoria: 'infaltable', listo: true },
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
          salud: {
            ...DEFAULT_TRIP.salud,
            ...(parsed.salud || {})
          }
        };
      } catch (e) {
        console.error('Error loading trip', e);
      }
    }
    return DEFAULT_TRIP;
  });

  const [activeTab, setActiveTab] = useState<'pasajes_seguro' | 'equipaje' | 'moverte' | 'salud'>('pasajes_seguro');
  const [showSosModal, setShowSosModal] = useState(false);
  const [showChangeCountryModal, setShowChangeCountryModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Smart Packing
  const [packDestinationType, setPackDestinationType] = useState<'playa' | 'ciudad' | 'frio'>(trip.tipoViaje);
  const [packDays, setPackDays] = useState<number>(trip.diasViaje);
  const [newItemName, setNewItemName] = useState('');

  // Modales
  const [isAddingBooking, setIsAddingBooking] = useState(false);
  const [newBookingType, setNewBookingType] = useState<'vuelo' | 'seguro' | 'transporte'>('vuelo');
  const [newBookingTitle, setNewBookingTitle] = useState('');
  const [newBookingCode, setNewBookingCode] = useState('');
  const [newBookingDate, setNewBookingDate] = useState('');
  const [newBookingTime, setNewBookingTime] = useState('');
  const [newBookingHasLayover, setNewBookingHasLayover] = useState(false);
  const [newBookingLayoverInfo, setNewBookingLayoverInfo] = useState('');
  const [newBookingBagDirect, setNewBookingBagDirect] = useState(true);
  const [newBookingPhone, setNewBookingPhone] = useState('');
  const [newBookingFile, setNewBookingFile] = useState<{ name: string; url: string } | null>(null);

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

  // Estado para Personalizar Destino a Mano
  const [isCustomizingCountry, setIsCustomizingCountry] = useState(false);
  const [customDestinationForm, setCustomDestinationForm] = useState({
    pais: '',
    destino: '',
    moneda: '',
    enchufe: '',
    clima: ''
  });

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

  // Cambio DINÁMICO de País y Destino predeterminado
  // ¡Actualiza automáticamente Moneda, Clima, Enchufe, Ambulancia, Consulado Y la Guía de Movilidad Completa!
  const handleSelectCountryPreset = (countryKey: string) => {
    const preset = DESTINATIONS[countryKey];
    if (!preset) return;

    setTrip((prev) => ({
      ...prev,
      paisKey: countryKey,
      pais: preset.pais,
      destino: preset.destinoDefault,
      nombre: `Viaje a ${preset.destinoDefault}, ${preset.pais}`,
      moneda: preset.moneda,
      enchufe: preset.enchufe,
      voltaje: preset.voltaje,
      clima: preset.clima,
      tipoViaje: preset.tipoViajeDefault,
      consuladoNombre: preset.consuladoDefault,
      consuladoTelefono: preset.consuladoTelDefault,
      consuladoDireccion: preset.consuladoDirDefault,
      movilidad: preset.movilidad,
      salud: {
        ...prev.salud,
        numeroAmbulanciaLocal: preset.ambulancia
      }
    }));

    setPackDestinationType(preset.tipoViajeDefault);
    setShowChangeCountryModal(false);
  };

  // Guardar destino personalizado manual
  const handleSaveCustomDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDestinationForm.pais || !customDestinationForm.destino) return;

    setTrip((prev) => ({
      ...prev,
      paisKey: 'custom',
      pais: customDestinationForm.pais,
      destino: customDestinationForm.destino,
      nombre: `Viaje a ${customDestinationForm.destino}, ${customDestinationForm.pais}`,
      moneda: customDestinationForm.moneda || 'Moneda Local',
      enchufe: customDestinationForm.enchufe || 'Revisar tipo de clavija',
      voltaje: 'Consultar voltaje local',
      clima: customDestinationForm.clima || 'Clima de temporada',
      movilidad: {
        llegadaAeropuerto: `Usa transporte oficial autorizado en el aeropuerto o terminal de ${customDestinationForm.destino}. Evita captadores no autorizados.`,
        appsYTransporte: `Averigua si en ${customDestinationForm.pais} opera Uber u otra app local de transporte y cómo funciona el pago de buses/metro.`,
        alquilerYConduccion: `Consulta si exigen Licencia de Conducir Internacional o si basta tu licencia nacional para conducir en ${customDestinationForm.pais}.`,
        mapasOffline: `Descarga el mapa sin conexión de ${customDestinationForm.destino} en Google Maps antes de salir del hotel.`,
        costumbresDinero: `Lleva una parte en efectivo de ${customDestinationForm.moneda || 'moneda local'} y activa tus tarjetas de débito/crédito para el extranjero.`
      }
    }));

    setIsCustomizingCountry(false);
    setShowChangeCountryModal(false);
  };

  const handleGenerateSmartPacking = () => {
    const days = Math.max(1, packDays);
    const bottomsCount = days <= 3 ? 2 : days <= 7 ? 3 : 4;
    const topsCount = days <= 3 ? 3 : days <= 7 ? 5 : 7;

    const newLuggageList: LuggageItem[] = [
      { id: `inf-1`, nombre: 'Cédula física o Pasaporte vigente (en bolso de mano)', categoria: 'infaltable', listo: true },
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
    if (!newBookingTitle.trim() || !newBookingCode.trim()) return;

    const newBooking: SimpleBooking = {
      id: `booking-${Date.now()}`,
      tipo: newBookingType,
      titulo: newBookingTitle.trim(),
      codigo: newBookingCode.trim(),
      fecha: newBookingDate || 'Fecha por confirmar',
      hora: newBookingTime || '',
      escala: newBookingHasLayover ? (newBookingLayoverInfo.trim() || 'Con escala') : 'Vuelo directo',
      maletaDirecta: newBookingHasLayover ? newBookingBagDirect : true,
      telefonoContacto: newBookingPhone.trim() || undefined,
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
    setNewBookingDate('');
    setNewBookingTime('');
    setNewBookingHasLayover(false);
    setNewBookingLayoverInfo('');
    setNewBookingPhone('');
    setNewBookingFile(null);
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
              onClick={() => setShowChangeCountryModal(true)}
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
          <nav className="max-w-2xl mx-auto grid grid-cols-4 gap-1 w-full" aria-label="Navegación principal">
            <button
              onClick={() => setActiveTab('pasajes_seguro')}
              className={`py-1.5 px-0.5 rounded-xl text-[10px] sm:text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 w-full cursor-pointer ${
                activeTab === 'pasajes_seguro'
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
              <span className="truncate w-full text-center">3. Moverte</span>
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
          </nav>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-3 sm:px-4 py-4 space-y-4">
        
        {/* ========================================================================= */}
        {/* --- PÁGINA 1: MIS PASAJES & SEGURO (CON EL CUADRO RESUMEN Y CAMBIAR DESTINO) --- */}
        {/* ========================================================================= */}
        {activeTab === 'pasajes_seguro' && (
          <div className="space-y-4">
            {/* El Cuadrito Resumen (ÚNICAMENTE en esta primera página) */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/50 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {trip.origen} ➔ {trip.destino}, {trip.pais}
                </span>
                <button
                  onClick={() => setShowChangeCountryModal(true)}
                  className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg text-[11px] font-bold flex items-center gap-1 border border-amber-500/30 cursor-pointer transition"
                >
                  <Globe2 className="w-3 h-3" /> Cambiar Destino
                </button>
              </div>

              <h2 className="text-base sm:text-lg font-black text-white">{trip.nombre}</h2>
              <p className="text-xs text-slate-300 mt-1">
                Contacto familiar en Chile: <strong className="text-cyan-300">{trip.familiarNombre} ({trip.familiarTelefono})</strong>
              </p>

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

            {/* Listado de Pasajes y Seguro */}
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white">Pasajes de Vuelo &amp; Póliza de Seguro</h3>
                <p className="text-xs text-slate-400">Ten a mano tus códigos, información de escalas y comprobantes.</p>
              </div>
              <button
                onClick={() => setIsAddingBooking(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition shadow cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" /> Agregar
              </button>
            </div>

            <div className="space-y-3">
              {trip.pasajesYDocumentos.map((doc) => (
                <div key={doc.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      {doc.tipo === 'vuelo' ? (
                        <Plane className="w-4 h-4 text-cyan-400 shrink-0" />
                      ) : (
                        <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      <span className="font-bold text-white text-sm">{doc.titulo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black px-2.5 py-1 rounded bg-blue-500/20 text-cyan-300 border border-blue-500/40">
                        {doc.codigo}
                      </span>
                      <button
                        onClick={() => deleteBooking(doc.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {doc.fecha}
                    </span>
                    {doc.hora && (
                      <span className="flex items-center gap-1 text-cyan-300">
                        <Clock className="w-3.5 h-3.5" /> {doc.hora}
                      </span>
                    )}
                  </div>

                  {doc.escala && (
                    <div className="mt-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                      <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                        <CornerDownRight className="w-3.5 h-3.5" />
                        <span>{doc.escala}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 pl-5">
                        {doc.maletaDirecta ? (
                          <span className="text-emerald-400 font-medium">✓ Tu equipaje facturado va directo al destino final (no lo retiras en la escala).</span>
                        ) : (
                          <span className="text-amber-400 font-medium">⚠️ Debes retirar tu maleta en la escala y volver a facturarla.</span>
                        )}
                      </div>
                    </div>
                  )}

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

                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => copyToClipboard(doc.codigo, doc.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1 transition cursor-pointer"
                    >
                      {copiedKey === doc.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === doc.id ? '¡Código copiado!' : 'Copiar código'}</span>
                    </button>

                    {doc.telefonoContacto && (
                      <a
                        href={`tel:${doc.telefonoContacto}`}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1 transition"
                      >
                        <Phone className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Llamar ({doc.telefonoContacto})</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* --- PÁGINA 2: INFALTABLES & ARMARIO (CON DINERO SEPARADO MUY VISIBLE) --- */}
        {/* ========================================================================= */}
        {activeTab === 'equipaje' && (
          <div className="space-y-4">
            
            {/* 1. SECCIÓN DESTACADA Y MUY VISIBLE: DINERO Y TARJETAS SEPARADAS */}
            <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-500/70 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-amber-200 uppercase tracking-wide">
                    💳 Regla de Oro: Dinero y Tarjetas Separadas
                  </h3>
                  <span className="text-[11px] text-amber-300/90 font-medium">
                    Evita quedarte sin fondos si pierdes tu bolso en la calle
                  </span>
                </div>
              </div>

              {/* Los 3 Consejos Vitales */}
              <div className="space-y-2 mt-3 text-xs text-slate-300">
                <div className="p-2.5 bg-slate-950/90 rounded-xl border border-amber-500/30 flex items-start gap-2.5">
                  <span className="text-base shrink-0">👛</span>
                  <div>
                    <strong className="text-white block font-bold mb-0.5">
                      1. Dinero del momento (Gasto diario):
                    </strong>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Lleva solo el efectivo necesario para el día en una billetera pequeña o bolsillo frontal. Si sufres un descuido o robo callejero, solo perderás lo del día.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-950/90 rounded-xl border border-amber-500/30 flex items-start gap-2.5">
                  <span className="text-base shrink-0">🔐</span>
                  <div>
                    <strong className="text-white block font-bold mb-0.5">
                      2. El "Grueso" del dinero del viaje:
                    </strong>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      <strong>NUNCA salgas a la calle con todo el dinero de tus vacaciones en la cartera.</strong> Guarda el fondo principal en la caja fuerte de tu posada/hotel o en un cinturón secreto pegado al cuerpo bajo la ropa.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-950/90 rounded-xl border border-amber-500/30 flex items-start gap-2.5">
                  <span className="text-base shrink-0">🏦</span>
                  <div>
                    <strong className="text-white block font-bold mb-0.5">
                      3. Tarjetas bancarias y aviso de viaje:
                    </strong>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Lleva 2 tarjetas distintas si tienes. Deja una en el hotel de respaldo por si el cajero retiene una o se extravía. <strong>Avisa a tu banco o activa compras internacionales</strong> desde la app bancaria antes de salir de tu país.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. LOS INFALTABLES (Lo que no se compra en destino) */}
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
                      <span className="text-[9px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded uppercase shrink-0">
                        Obligatorio
                      </span>
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

            {/* 
              2. BANNER ROJO VITAL EN COLOR DE ALERTA MÁXIMA: 
              NUNCA DEJAR LA MALETA O MOCHILA CON DESCONOCIDOS 
            */}
            <div className="bg-gradient-to-r from-red-950 via-rose-950 to-red-950 border-2 border-red-500 rounded-2xl p-4 shadow-2xl text-xs text-red-100 relative overflow-hidden">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-red-600 text-white shrink-0 shadow-lg shadow-red-600/40">
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-red-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider shadow">
                      ALERTA VITAL DE SEGURIDAD
                    </span>
                    <h4 className="font-black text-red-100 text-sm tracking-tight">
                      ¡NUNCA dejes tu maleta o mochila encargada a un desconocido!
                    </h4>
                  </div>
                  
                  <p className="leading-relaxed text-red-100 text-xs">
                    Ni para ir al baño 2 minutos, ni para comprar agua o un café, <strong>por muy simpático, amable, educado o adulto mayor que parezca.</strong>
                  </p>

                  <div className="p-2.5 bg-black/40 rounded-xl border border-red-500/40 text-[11px] text-red-200 space-y-1">
                    <p>
                      ⚠️ <strong>Peligro no visualizado:</strong> Le ocurre mucho a jóvenes que se hacen amigos rápido y a adultos mayores que conversan con Raimundo y todo el mundo en aeropuertos, terminales de buses o playas.
                    </p>
                    <p className="font-bold text-white">
                      ⚖️ <strong>Regla legal internacional:</strong> Si la policía o aduana revisa tu bolso y alguien introdujo una sustancia prohibida o un objeto ilegal, TÚ respondes penalmente por todo lo que vaya dentro.
                    </p>
                  </div>

                  <p className="font-extrabold text-amber-300 text-xs pt-1 flex items-center gap-1">
                    👉 Si viajas sola/o o en pareja, lleva tu bolso contigo hasta dentro del baño o usa la custodia oficial de equipajes de la terminal.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. LOS 5 PILARES EDUCATIVOS DE MOVILIDAD (ADAPTADOS DINÁMICAMENTE AL DESTINO) */}
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
        {/* --- PÁGINA 4: SALUD & URGENCIAS REALES --- */}
        {/* ========================================================================= */}
        {activeTab === 'salud' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-rose-950/60 to-slate-900 border-2 border-rose-500/50 rounded-2xl p-4 flex items-start gap-3 text-xs text-rose-200 shadow-md">
              <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-bold mb-0.5">
                  ¿Emergencia mayor o problema legal grave en {trip.pais}?
                </strong>
                <p className="leading-relaxed">
                  Para situaciones críticas, asistencia consular oficial o trámites con tu familia, toca el botón <strong>"Ficha SOS"</strong> en la parte superior.
                </p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-emerald-400" />
                  Salud en el Extranjero: Datos Reales
                </h3>
                <button
                  onClick={() => {
                    setHealthForm(trip.salud);
                    setIsEditingHealth(true);
                  }}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" /> Rellenar / Editar
                </button>
              </div>

              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                Nadie te atenderá gratis en el extranjero por cortesía. Completa tus datos antes de viajar y llévalos en tu bolsillo:
              </p>

              <div className="space-y-3">
                {/* Seguro */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Póliza de Asistencia Médica:</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${trip.salud.tieneSeguro ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      {trip.salud.tieneSeguro ? '✓ Seguro Contratado' : '⚠️ Sin seguro'}
                    </span>
                  </div>

                  {trip.salud.tieneSeguro ? (
                    <div>
                      <div className="text-white font-bold text-sm">{trip.salud.seguroCompania}</div>
                      <div className="text-xs text-cyan-300 font-mono mt-0.5">Póliza: {trip.salud.seguroPoliza}</div>
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        {trip.salud.seguroTelefono && (
                          <a
                            href={`tel:${trip.salud.seguroTelefono}`}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                          >
                            <Phone className="w-3 h-3" /> Llamar Central 24h ({trip.salud.seguroTelefono})
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-amber-300 mt-1">
                      No has registrado seguro médico. Si requieres atención en {trip.pais}, deberás pagar en efectivo o tarjeta de crédito en el centro de salud.
                    </p>
                  )}
                </div>

                {/* Urgencias y Ambulancia */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Ambulancia y Hospital Cercano:</span>
                  
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Ambulancia Oficial en {trip.pais}:</span>
                      <strong className="text-red-400 font-mono text-sm">{trip.salud.numeroAmbulanciaLocal}</strong>
                    </div>
                    <a
                      href={`tel:${trip.salud.numeroAmbulanciaLocal.replace(/[^0-9]/g, '')}`}
                      className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-xs"
                    >
                      Llamar Ambulancia
                    </a>
                  </div>

                  <div className="text-xs text-slate-300 pt-1">
                    <span className="text-slate-400 block text-[11px]">Centro Médico / Clínica más cercano al hotel:</span>
                    <strong className="text-white block mt-0.5">{trip.salud.hospitalCercanoNombre || 'No especificado (averiguar al llegar)'}</strong>
                    <p className="text-slate-300 text-[11px] mt-0.5">{trip.salud.hospitalCercanoDireccion}</p>
                    {trip.salud.hospitalCercanoTelefono && (
                      <p className="text-cyan-300 font-mono text-[11px] mt-0.5">Tel: {trip.salud.hospitalCercanoTelefono}</p>
                    )}

                    {/* Botones de acción rápida: Copiar dirección y Llamar */}
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {trip.salud.hospitalCercanoDireccion && (
                        <button
                          onClick={() => copyToClipboard(trip.salud.hospitalCercanoDireccion, 'dir_hospital')}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                        >
                          {copiedKey === 'dir_hospital' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                          <span>{copiedKey === 'dir_hospital' ? '¡Dirección copiada!' : 'Copiar dirección para Uber / Waze'}</span>
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
                </div>

                {/* FICHA MÉDICA BÁSICA DEL VIAJERO */}
                <div className="bg-gradient-to-br from-slate-950 via-slate-950 to-emerald-950/20 p-3.5 rounded-xl border border-emerald-500/30 space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5" />
                      Ficha Médica Básica del Viajero
                    </span>
                    <button
                      onClick={() => {
                        setHealthForm(trip.salud);
                        setIsEditingHealth(true);
                      }}
                      className="text-cyan-400 text-[11px] font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" /> Editar
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

                {/* CONSEJO DE RESPALDO FÍSICO POR SI SE DESCARGA EL CELULAR */}
                <div className="p-3.5 bg-gradient-to-r from-amber-950/30 via-slate-950 to-slate-950 rounded-xl border border-amber-500/40 text-xs text-slate-300 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 text-amber-300 font-bold">
                    <span className="text-base">📝</span>
                    <span className="uppercase text-[11px] tracking-wider">Tip de Oro: El Respaldo Escrito en Papel</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Si tu celular se queda sin batería, se moja o se extravía en la calle, no podrás abrir esta app ni tus pasajes.
                    <strong className="text-white block mt-1">
                      Lleva siempre un papelito doblado en tu billetera física con:
                    </strong>
                  </p>
                  <ul className="text-[11px] text-amber-200/90 list-disc list-inside space-y-0.5 pl-1">
                    <li>Nombre exacto, dirección y teléfono del lugar donde te alojas (para mostrárselo a un taxista o policía local).</li>
                    <li>Teléfono de contacto de tu familiar en Chile y número de tu póliza de seguro médico.</li>
                  </ul>
                  <p className="text-[10px] text-slate-400 italic pt-0.5">
                    Este sencillo papelito te salvará de cualquier apuro si te quedas incomunicada lejos del hotel.
                  </p>
                </div>

                {/* Nota de reembolso */}
                {trip.salud.fondosEmergenciaNotas && (
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                    <strong className="text-slate-200 block mb-0.5">Nota de Fondo de Emergencia:</strong>
                    {trip.salud.fondosEmergenciaNotas}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 
        BARRA FLOTANTE INFERIOR FIJA PARA CELULARES (sm:hidden):
        Garantiza que en teléfonos móviles los 4 botones estén siempre accesibles al alcance del pulgar.
      */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 shadow-2xl">
        <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
          <button
            onClick={() => {
              setActiveTab('pasajes_seguro');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`py-1.5 px-0.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 ${
              activeTab === 'pasajes_seguro'
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
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* --- MODAL: CAMBIAR PAÍS / DESTINO INTELIGENTE --- */}
      {/* ========================================================================= */}
      {showChangeCountryModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-md w-full shadow-2xl relative text-xs my-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-white text-base">Elegir País o Destino</h3>
              </div>
              <button
                onClick={() => {
                  setShowChangeCountryModal(false);
                  setIsCustomizingCountry(false);
                }}
                className="text-slate-400 hover:text-white p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-300 text-xs mt-2 mb-3">
              Al elegir un país, la app <strong>actualiza automáticamente</strong> la moneda, enchufe, clima, consulado y la <strong>guía de transporte y movilidad</strong> con los datos reales de esa ciudad.
            </p>

            {!isCustomizingCountry ? (
              <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
                {Object.entries(DESTINATIONS).map(([key, item]) => (
                  <button
                    key={key}
                    onClick={() => handleSelectCountryPreset(key)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                      trip.paisKey === key
                        ? 'bg-blue-950/60 border-blue-500/70 shadow-md'
                        : 'bg-slate-950 hover:bg-slate-800 border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.bandera}</span>
                        <strong className="text-white text-sm">{item.pais} ({item.destinoDefault})</strong>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {item.moneda.split('(')[0].trim()} • {item.enchufe.split('(')[0].trim()}
                      </span>
                    </div>
                    {trip.paisKey === key && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                        <Check className="w-3 h-3" /> Activo
                      </span>
                    )}
                  </button>
                ))}

                <button
                  onClick={() => setIsCustomizingCountry(true)}
                  className="w-full p-3 bg-slate-950 hover:bg-slate-800 border border-dashed border-amber-500/50 rounded-2xl text-left flex items-center justify-between text-amber-300 font-bold cursor-pointer mt-2"
                >
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    <span>¿Vas a otro destino? Escribir mi propio país</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveCustomDestination} className="space-y-3 mt-2">
                <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-300 text-[11px]">
                  Escribe el país y ciudad que vas a visitar. La app configurará tu bitácora para tu nuevo destino:
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">País *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Italia, Francia, México..."
                    value={customDestinationForm.pais}
                    onChange={(e) => setCustomDestinationForm({ ...customDestinationForm, pais: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Ciudad o Región *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Roma, París, Cancún..."
                    value={customDestinationForm.destino}
                    onChange={(e) => setCustomDestinationForm({ ...customDestinationForm, destino: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Moneda Local</label>
                  <input
                    type="text"
                    placeholder="Ej: Euro (EUR), Peso Mexicano (MXN)..."
                    value={customDestinationForm.moneda}
                    onChange={(e) => setCustomDestinationForm({ ...customDestinationForm, moneda: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tipo de Enchufe</label>
                  <input
                    type="text"
                    placeholder="Ej: Tipo C y F (patitas redondas)..."
                    value={customDestinationForm.enchufe}
                    onChange={(e) => setCustomDestinationForm({ ...customDestinationForm, enchufe: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCustomizingCountry(false)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                  >
                    Volver a lista
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold"
                  >
                    Guardar y Aplicar
                  </button>
                </div>
              </form>
            )}

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  setShowChangeCountryModal(false);
                  setIsCustomizingCountry(false);
                }}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
              >
                Cerrar
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
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-lg w-full shadow-2xl relative text-xs my-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-white text-base">Ficha de Emergencia y Consulado</h3>
              </div>
              <button
                onClick={() => setShowSosModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-sm"
              >
                ✕ Cerrar
              </button>
            </div>

            <p className="text-[11px] text-slate-300 mt-2 mb-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              Datos clave para asistencia médica crítica, contacto consular oficial o trámites con tu familia en Chile.
            </p>

            <div className="space-y-2.5">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-blue-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Consulado Oficial en {trip.pais}:</span>
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
                    className="text-cyan-400 text-[11px] hover:underline"
                  >
                    Editar datos
                  </button>
                </div>
                <strong className="text-white text-xs block mt-0.5">{trip.consuladoNombre}</strong>
                <p className="text-slate-300 text-[11px] mt-0.5">{trip.consuladoDireccion}</p>
                <div className="mt-2.5">
                  <a
                    href={`tel:${trip.consuladoTelefono}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
                  >
                    <Phone className="w-3.5 h-3.5" /> Llamar al Consulado ({trip.consuladoTelefono})
                  </a>
                </div>
              </div>

              {/* Hotel / Alojamiento (Dato Sagrado si te pierdes) */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-amber-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-amber-400" />
                    Mi Hotel / Alojamiento (Dato Sagrado si te pierdes):
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
                  {trip.alojamiento.telefono && (
                    <a
                      href={`tel:${trip.alojamiento.telefono.replace(/[^0-9+]/g, '')}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5" /> Llamar al Hotel ({trip.alojamiento.telefono})
                    </a>
                  )}

                  {trip.alojamiento.direccion && (
                    <button
                      onClick={() => copyToClipboard(trip.alojamiento.direccion, 'dir_hotel_sos')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                    >
                      {copiedKey === 'dir_hotel_sos' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{copiedKey === 'dir_hotel_sos' ? '¡Dirección copiada!' : 'Copiar dirección para taxi'}</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Contacto Familiar en Chile:</span>
                <strong className="text-cyan-300 text-xs block mt-0.5">{trip.familiarNombre}</strong>
                <div className="mt-2">
                  <a
                    href={`tel:${trip.familiarTelefono}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Llamar ({trip.familiarTelefono})</span>
                  </a>
                </div>
              </div>

              {/* Protocolo de Hotel en Emergencia Grave */}
              <div className="bg-gradient-to-r from-blue-950/40 via-slate-950 to-slate-950 p-3.5 rounded-xl border border-blue-500/30 text-xs text-slate-300 space-y-1.5 shadow-sm">
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <span className="text-base">🛎️</span>
                  <span className="uppercase text-[10px] tracking-wider">Regla de Hotel ante Emergencia Médica Grave:</span>
                </div>
                <p className="text-[11px] text-slate-200 leading-relaxed">
                  Si tú o tu acompañante sufren una <strong>emergencia médica grave u hospitalización</strong> cerca de la fecha de regreso, <strong>NO hagas el check-out de inmediato</strong> dejando las pertenencias desamparadas.
                </p>
                <p className="text-[11px] text-cyan-200 font-medium">
                  👉 Llama primero al seguro o notifica a la administración del hotel para <strong>solicitar una extensión de cortesía por fuerza mayor</strong> o custodia segura mientras interviene el consulado o llega un familiar.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowSosModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
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
      {/* --- MODAL: AGREGAR PASAJE O SEGURO --- */}
      {/* ========================================================================= */}
      {isAddingBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-md w-full shadow-2xl relative text-xs my-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">Agregar Pasaje de Vuelo o Seguro</h3>
              <button onClick={() => setIsAddingBooking(false)} className="text-slate-400 hover:text-white p-1">✕</button>
            </div>

            <form onSubmit={handleAddBooking} className="space-y-3 mt-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tipo de Documento</label>
                <select
                  value={newBookingType}
                  onChange={(e) => setNewBookingType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="vuelo">Vuelo / Pasaje Aéreo</option>
                  <option value="seguro">Seguro de Viaje</option>
                  <option value="transporte">Traslado / Bus / Tren</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nombre o Aerolínea *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: JetSmart vuelo a Florianópolis"
                  value={newBookingTitle}
                  onChange={(e) => setNewBookingTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Código de Reserva (o Póliza) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: 13N7JY"
                  value={newBookingCode}
                  onChange={(e) => setNewBookingCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono uppercase"
                />
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

              {/* Escala */}
              {newBookingType === 'vuelo' && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">¿El vuelo tiene escala en otro aeropuerto?</span>
                    <input
                      type="checkbox"
                      checked={newBookingHasLayover}
                      onChange={(e) => setNewBookingHasLayover(e.target.checked)}
                      className="w-4 h-4 text-cyan-500 rounded"
                    />
                  </div>

                  {newBookingHasLayover && (
                    <div className="space-y-2 pt-1 border-t border-slate-800">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-0.5">Aeropuerto o Ciudad de la escala:</label>
                        <input
                          type="text"
                          placeholder="Ej: Escala de 2h en São Paulo (GRU)"
                          value={newBookingLayoverInfo}
                          onChange={(e) => setNewBookingLayoverInfo(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="chkBag"
                          checked={newBookingBagDirect}
                          onChange={(e) => setNewBookingBagDirect(e.target.checked)}
                          className="w-3.5 h-3.5 text-emerald-500 rounded"
                        />
                        <label htmlFor="chkBag" className="text-[11px] text-slate-300 cursor-pointer">
                          Mi maleta va directo al destino final (no la retiro en la escala)
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Archivo adjunto */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Adjuntar Comprobante o Foto del Pasaje (Opcional)
                </label>
                <label className="border border-dashed border-slate-700 hover:border-cyan-500 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer bg-slate-950/60 transition">
                  <Upload className="w-5 h-5 text-cyan-400 mb-1" />
                  <span className="text-[11px] text-slate-300 font-medium">
                    {newBookingFile ? newBookingFile.name : 'Toca para adjuntar tu foto o PDF'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, setNewBookingFile)}
                  />
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingBooking(false)}
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-lg w-full shadow-2xl relative text-xs my-6">
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

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Número de Póliza</label>
                      <input
                        type="text"
                        value={healthForm.seguroPoliza}
                        onChange={(e) => setHealthForm({ ...healthForm, seguroPoliza: e.target.value })}
                        placeholder="Ej: POL-12345"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Teléfono 24h del Seguro</label>
                      <input
                        type="tel"
                        value={healthForm.seguroTelefono}
                        onChange={(e) => setHealthForm({ ...healthForm, seguroTelefono: e.target.value })}
                        placeholder="Ej: +55 11 3132 1000"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
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
