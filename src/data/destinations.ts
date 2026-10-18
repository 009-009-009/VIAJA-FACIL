// Estructura de Movilidad por Destino
export interface MobilityInfo {
  llegadaAeropuerto: string;
  appsYTransporte: string;
  alquilerYConduccion: string;
  mapasOffline: string;
  costumbresDinero: string;
}

// Preset inteligente de país/ciudad
export interface DestinationPreset {
  pais: string;
  destinoDefault: string;
  ciudadesSugeridas?: string[];
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

export const DESTINATIONS: Record<string, DestinationPreset> = {
  espana: {
    pais: 'España',
    destinoDefault: 'Madrid',
    ciudadesSugeridas: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Ibiza', 'Málaga'],
    bandera: '🇪🇸',
    moneda: 'Euro (EUR - €)',
    enchufe: 'Tipo C y F (2 patitas redondas europeas)',
    voltaje: '230V (Frecuencia 50 Hz)',
    clima: 'Mediterráneo/continental. Caluroso en verano, fresco/frío en invierno.',
    tipoViajeDefault: 'ciudad',
    ambulancia: '112 (Urgencias Sanitarias UE)',
    consuladoDefault: 'Consulado General en Madrid',
    consuladoTelDefault: '+34 91 308 0555',
    consuladoDirDefault: 'Calle Rafael Calvo 18, Madrid',
    movilidad: {
      llegadaAeropuerto: 'Desde el Aeropuerto Adolfo Suárez Barajas tienes Metro (Línea 8 directa a Nuevos Ministerios), tren de Cercanías Renfe o Taxi oficial con tarifa plana fija de 33€ al centro de Madrid (no dejes que te cobren extras).',
      appsYTransporte: 'El Metro de Madrid y la red de buses EMT son excepcionales. Compra en las máquinas la Tarjeta Multi recargable (sirve para 10 viajes). Para apps privadas operan Cabify, Uber y FreeNow (taxis regulados).',
      alquilerYConduccion: 'En el centro de Madrid no conviene auto por las Zonas de Bajas Emisiones (ZBE) y multas automáticas con cámara. Si viajas a pueblos, tu licencia nacional vigente es aceptada los primeros meses como turista, aunque se recomienda Licencia Internacional.',
      mapasOffline: 'Descarga el mapa sin conexión en Google Maps o utiliza la app Citymapper para ver transbordos exactos de metro y bus en tiempo real.',
      costumbresDinero: 'El pago con tarjeta (contactless) se acepta desde 1 euro en panaderías y taxis. Los billetes de 100€ o más son difíciles de cambiar en comercios pequeños; pide billetes de 20€ o 50€ al cambiar.'
    }
  },
  brasil: {
    pais: 'Brasil',
    destinoDefault: 'Florianópolis',
    ciudadesSugeridas: ['Florianópolis', 'Río de Janeiro', 'São Paulo', 'Salvador de Bahía', 'Búzios', 'Gramado'],
    bandera: '🇧🇷',
    moneda: 'Real Brasileño (BRL - R$)',
    enchufe: 'Tipo N (3 patitas en rombo) y Tipo C',
    voltaje: '220V en Florianópolis / 127V en São Paulo/Río (ideal 100-240V)',
    clima: 'Cálido y playero (27°C a 31°C). Chaparrones de 20 min en verano.',
    tipoViajeDefault: 'playa',
    ambulancia: '192 (SAMU Brasil)',
    consuladoDefault: 'Consulado General en Florianópolis / Curitiba',
    consuladoTelDefault: '+55 48 3028 9000',
    consuladoDirDefault: 'Av. Beira Mar Norte, Florianópolis - SC',
    movilidad: {
      llegadaAeropuerto: 'Usa transporte oficial en el Aeropuerto Hercílio Luz: toma Uber en el punto de encuentro señalizado o taxis con tarifa prefijada en la ventanilla oficial interior. Nunca aceptes autos informales en el hall.',
      appsYTransporte: 'En Brasil operan Uber y la aplicación local "99" (suele ser más económica que Uber). Para buses en la isla (sistema TICEN / Canasvieiras) se puede pagar con efectivo exacto o tarjeta de transporte.',
      alquilerYConduccion: 'Tu licencia de conducir física vigente de tu país es 100% válida. En verano hay alto tráfico en las vías hacia las playas del norte; respeta los radares de velocidad (lombadas electrónicas).',
      mapasOffline: 'Antes de salir del hotel, abre Google Maps y descarga el mapa de Florianópolis sin conexión. En playas como Brava o Naufragados la señal de celular suele ser débil.',
      costumbresDinero: 'En Brasil casi todo se paga con tarjeta contactless o débito internacional. Mantén billetes pequeños de 10 o 20 reales en efectivo para comprar caipirinhas o choclo en la arena y para peajes.'
    }
  },
  israel: {
    pais: 'Israel',
    destinoDefault: 'Tel Aviv',
    ciudadesSugeridas: ['Tel Aviv', 'Jerusalén', 'Haifa', 'Eilat', 'Tiberíades', 'Mar Muerto'],
    bandera: '🇮🇱',
    moneda: 'Nuevo Shekel israelí (ILS - ₪)',
    enchufe: 'Tipo C y H (clavijas redondas o en V con tierra)',
    voltaje: '230V (Frecuencia 50 Hz)',
    clima: 'Mediterráneo templado a cálido (22°C a 32°C en la costa; noches frescas en Jerusalén).',
    tipoViajeDefault: 'ciudad',
    ambulancia: '101 (Magen David Adom - Emergencias Médicas)',
    consuladoDefault: 'Embajada / Consulado en Tel Aviv',
    consuladoTelDefault: '+972 3 510 2828',
    consuladoDirDefault: 'Tel Aviv, Israel',
    movilidad: {
      llegadaAeropuerto: 'Desde el Aeropuerto Ben Gurión (TLV) puedes tomar el tren directo de alta frecuencia hacia Tel Aviv Savidor o HaShalom (aprox. 15 min), o taxis oficiales regulados en el nivel G con taxímetro.',
      appsYTransporte: 'Para moverte en trenes y buses de todo el país es indispensable la tarjeta Rav-Kav o las apps Moovit y Pango con pago digital. Gett y Uber operan conectando taxis oficiales.',
      alquilerYConduccion: 'Tu licencia de conducir física vigente es aceptada para turistas. Ojo: en las ciudades el tráfico es intenso; se conduce por la derecha y las autopistas tienen señalización en hebreo e inglés.',
      mapasOffline: 'Descarga el mapa sin conexión en Google Maps antes de salir del hotel.',
      costumbresDinero: 'El uso de tarjeta de crédito/débito contactless está generalizado al 100%. Ten algunos billetes de 20 o 50 shekels para propinas en cafeterías o puestos callejeros.'
    }
  },
  panama: {
    pais: 'Panamá',
    destinoDefault: 'Ciudad de Panamá',
    ciudadesSugeridas: ['Ciudad de Panamá', 'Bocas del Toro', 'San Blas', 'Boquete', 'Playa Venao', 'Colón'],
    bandera: '🇵🇦',
    moneda: 'Dólar Estadounidense / Balboa (USD / PAB - $)',
    enchufe: 'Tipo A y B (2 clavijas planas paralelas tipo americano)',
    voltaje: '120V (Frecuencia 60 Hz)',
    clima: 'Tropical cálido y húmedo (28°C a 32°C). Chubascos tropicales repentinos en las tardes.',
    tipoViajeDefault: 'playa',
    ambulancia: '911 (Sistema Único de Emergencias)',
    consuladoDefault: 'Embajada / Consulado en Ciudad de Panamá',
    consuladoTelDefault: '+507 264 4322',
    consuladoDirDefault: 'Calle 50 y Elvira Méndez, Ciudad de Panamá',
    movilidad: {
      llegadaAeropuerto: 'En el Aeropuerto Internacional de Tocumen (PTY) puedes tomar la nueva línea 2 del Metro de Panamá (conexión directa al centro) o solicitar Uber en el área designada de la terminal.',
      appsYTransporte: 'Uber e InDrive funcionan muy bien y son la opción más cómoda y segura para turistas. Para el Metro y Metrobús se requiere la tarjeta electrónica recargable Metrobus.',
      alquilerYConduccion: 'Tu licencia nacional de conducir vigente es válida por hasta 90 días como turista. En Ciudad de Panamá hay corredores (Norte y Sur) con peaje electrónico Panapass.',
      mapasOffline: 'Descarga mapas offline en Google Maps o Waze antes de salir de tu alojamiento.',
      costumbresDinero: 'La moneda de curso legal es el Dólar estadounidense (USD). Las monedas de Balboa tienen el mismo valor 1:1. El pago con tarjeta es ampliamente aceptado en centros comerciales y restaurantes.'
    }
  },
  estados_unidos: {
    pais: 'Estados Unidos',
    destinoDefault: 'Miami, Florida',
    ciudadesSugeridas: ['Miami', 'Orlando', 'Nueva York', 'Los Ángeles', 'Las Vegas', 'San Francisco'],
    bandera: '🇺🇸',
    moneda: 'Dólar Estadounidense (USD - $)',
    enchufe: 'Tipo A y B (2 clavijas planas paralelas con/sin tierra)',
    voltaje: '120V (Frecuencia 60 Hz - verificar que diga 100-240V)',
    clima: 'Cálido y húmedo (28°C a 33°C). Chaparrones tropicales repentinos en verano.',
    tipoViajeDefault: 'playa',
    ambulancia: '911 (Emergencias Generales)',
    consuladoDefault: 'Consulado General en Miami',
    consuladoTelDefault: '+1 305 373 8623',
    consuladoDirDefault: '800 Brickell Ave, Miami, FL',
    movilidad: {
      llegadaAeropuerto: 'En Miami (MIA), sigue las señales hacia MIA Mover para ir al centro de autos de alquiler (Rental Car Center) o sube al segundo piso para el punto de recogida de Uber o Lyft.',
      appsYTransporte: 'Uber y Lyft son las apps indispensables y funcionan en minutos. En Miami Beach está el trolley gratuito y en Downtown el Metromover elevado sin costo.',
      alquilerYConduccion: 'En Florida el auto es casi obligatorio. Tu licencia de conducir física vigente es aceptada para arrendar. Ojo: casi todas las autopistas (Turnpike, Dolphin Expressway) tienen peaje electrónico (SunPass / Toll-by-Plate).',
      mapasOffline: 'Descarga siempre el mapa en Google Maps. Las salidas de las autopistas de 5 carriles son muy rápidas y si pierdes la señal podrías pasarte de largo.',
      costumbresDinero: 'Uso del 100% con tarjeta. El efectivo casi no se usa. En restaurantes la propina ("tip") del 18% al 20% es costumbre cultural obligatoria (a veces ya viene sugerida en la cuenta).'
    }
  },
  mexico: {
    pais: 'México',
    destinoDefault: 'Cancún',
    ciudadesSugeridas: ['Cancún', 'Ciudad de México', 'Playa del Carmen', 'Tulum', 'Guadalajara', 'Oaxaca'],
    bandera: '🇲🇽',
    moneda: 'Peso Mexicano (MXN - $)',
    enchufe: 'Tipo A y B (2 patas planas tipo americano)',
    voltaje: '127V (Frecuencia 60 Hz)',
    clima: 'Cálido en costas (28°C-33°C); templado en Ciudad de México (15°C-26°C).',
    tipoViajeDefault: 'playa',
    ambulancia: '911 (Emergencias Nacionales)',
    consuladoDefault: 'Consulado General en Ciudad de México',
    consuladoTelDefault: '+52 55 5280 9689',
    consuladoDirDefault: 'Campos Elíseos 188, Polanco, CDMX',
    movilidad: {
      llegadaAeropuerto: 'En aeropuertos (CDMX o Cancún) toma taxis autorizados oficiales en los módulos del interior antes de salir al hall o usa Uber en los puntos señalizados.',
      appsYTransporte: 'Uber, Didi y Cabify son muy económicos y seguros. En CDMX el Metrobús y Metro requieren la tarjeta de Movilidad Integrada.',
      alquilerYConduccion: 'Licencia nacional física vigente válida para turistas.',
      mapasOffline: 'Descarga mapa offline en Google Maps.',
      costumbresDinero: 'En México la propina (10% al 15%) es habitual en restaurantes. Lleva billetes de 50 y 100 pesos para propinas y mercados artesanales.'
    }
  },
  argentina: {
    pais: 'Argentina',
    destinoDefault: 'Buenos Aires',
    ciudadesSugeridas: ['Buenos Aires', 'Bariloche', 'Mendoza', 'Ushuaia', 'Córdoba', 'Iguazú'],
    bandera: '🇦🇷',
    moneda: 'Peso Argentino (ARS - $)',
    enchufe: 'Tipo I (3 patas planas en V) y Tipo C',
    voltaje: '220V (Frecuencia 50 Hz)',
    clima: 'Veranos calurosos y húmedos (28°C a 34°C); inviernos templados y frescos.',
    tipoViajeDefault: 'ciudad',
    ambulancia: '107 (SAME) / 911',
    consuladoDefault: 'Consulado General en Buenos Aires',
    consuladoTelDefault: '+54 11 4331 6228',
    consuladoDirDefault: 'Diagonal Norte 832, CABA',
    movilidad: {
      llegadaAeropuerto: 'Desde Ezeiza toma Tienda León (bus seguro hasta Retiro) o contrata taxi en las cabinas oficiales dentro de la terminal (Taxi Ezeiza). En Aeroparque (AEP) puedes pedir Uber o taxi de la parada reglamentada.',
      appsYTransporte: 'Cabify, Uber y Didi funcionan fluidamente. Para colectivos (buses) y Subte (metro) es obligatoria la tarjeta plástica SUBE (puedes comprarla en kioscos o estaciones de tren).',
      alquilerYConduccion: 'Licencia de conducir física vigente válida por convenios internacionales. En Buenos Aires el tráfico y el estacionamiento céntrico son complejos, por lo que es mucho mejor moverse en subte o apps.',
      mapasOffline: 'Descarga el mapa de la Ciudad de Buenos Aires en Google Maps o la app oficial BA Cómo Llego.',
      costumbresDinero: 'Para turistas extranjeros, pagar con tarjetas internacionales aplica la cotización favorable MEP. Si llevas efectivo (dólares o euros), cámbialos en casas de cambio autorizadas.'
    }
  },
  chile: {
    pais: 'Chile',
    destinoDefault: 'Santiago',
    ciudadesSugeridas: ['Santiago', 'Valparaíso', 'San Pedro de Atacama', 'Viña del Mar', 'Pucón', 'Torres del Paine'],
    bandera: '🇨🇱',
    moneda: 'Peso Chileno (CLP - $)',
    enchufe: 'Tipo C y L (2 y 3 patitas redondas en línea)',
    voltaje: '220V (Frecuencia 50 Hz)',
    clima: 'Mediterráneo templado en zona central, seco en el norte y fresco/lluvioso en el sur y Patagonia.',
    tipoViajeDefault: 'ciudad',
    ambulancia: '131 (SAMU Urgencias Médicas) / Carabineros 133',
    consuladoDefault: 'Ministerio de Relaciones Exteriores',
    consuladoTelDefault: '+56 2 2827 4000',
    consuladoDirDefault: 'Teatinos 180, Santiago',
    movilidad: {
      llegadaAeropuerto: 'Desde el Aeropuerto Arturo Merino Benítez (SCL) usa buses oficiales Centropuerto / Turbus o taxis oficiales oficiales (Transvip, Taxi Oficial). Uber opera en pisos designados.',
      appsYTransporte: 'El Metro de Santiago es rápido y moderno; requiere tarjeta Bip! o pago con código QR en la app Red Metropolitana. Uber, Cabify y Didi funcionan en todo momento.',
      alquilerYConduccion: 'Licencia de conducir física vigente aceptada. Las autopistas de Santiago usan cobro electrónico automático TAG.',
      mapasOffline: 'Descarga mapa de Google Maps antes de excursiones a la cordillera o costa.',
      costumbresDinero: 'Prácticamente el 100% de comercios aceptan tarjeta Redcompra / débito y crédito contactless. Propinas del 10% voluntarias en restaurantes.'
    }
  },
  colombia: {
    pais: 'Colombia',
    destinoDefault: 'Cartagena de Indias',
    ciudadesSugeridas: ['Cartagena de Indias', 'Medellín', 'Bogotá', 'San Andrés', 'Santa Marta', 'Cali'],
    bandera: '🇨🇴',
    moneda: 'Peso Colombiano (COP - $)',
    enchufe: 'Tipo A y B (patas planas tipo americano)',
    voltaje: '110V (Frecuencia 60 Hz)',
    clima: 'Tropical cálido y húmedo (30°C promedio). Brisa marina.',
    tipoViajeDefault: 'playa',
    ambulancia: '123 (Emergencias Nacionales)',
    consuladoDefault: 'Consulado General en Bogotá',
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
    destinoDefault: 'Cusco',
    ciudadesSugeridas: ['Cusco', 'Lima', 'Arequipa', 'Machu Picchu', 'Valle Sagrado', 'Puno'],
    bandera: '🇵🇪',
    moneda: 'Sol Peruano (PEN - S/)',
    enchufe: 'Tipo A y C (universal plano y redondo)',
    voltaje: '220V (Frecuencia 60 Hz)',
    clima: 'En Cusco clima andino seco (días templados 19°C, noches frías 4°C).',
    tipoViajeDefault: 'ciudad',
    ambulancia: '106 (SAMU Perú) / 105',
    consuladoDefault: 'Consulado General en Lima',
    consuladoTelDefault: '+51 1 710 2200',
    consuladoDirDefault: 'Av. Javier Prado Oeste 790, San Isidro, Lima',
    movilidad: {
      llegadaAeropuerto: 'En Lima usa Taxi Green o Taxi Directo desde el counter oficial. En Cusco coordina el transfer con tu hotel o usa taxis de la terminal con tarifa acordada previa.',
      appsYTransporte: 'Uber y Cabify operan en Lima y zonas céntricas de Cusco. En Cusco para Machu Picchu el tren (PeruRail / Inca Rail) debe reservarse con anticipación.',
      alquilerYConduccion: 'No es aconsejable arrendar auto en ciudades por el estilo de conducción y altura en la sierra; el servicio de chofer o taxi es muy económico.',
      mapasOffline: 'Fundamental descargar mapas offline para el Valle Sagrado donde la cobertura móvil es intermitente.',
      costumbresDinero: 'Importante: En Perú NO aceptan billetes rotos, doblados o rayados (ni soles ni dólares). Revisa siempre que te entreguen billetes en perfecto estado.'
    }
  },
  uruguay: {
    pais: 'Uruguay',
    destinoDefault: 'Montevideo',
    ciudadesSugeridas: ['Montevideo', 'Punta del Este', 'Colonia del Sacramento', 'La Paloma', 'Piriápolis'],
    bandera: '🇺🇾',
    moneda: 'Peso Uruguayo (UYU - $)',
    enchufe: 'Tipo C y L (patitas redondas)',
    voltaje: '220V (Frecuencia 50 Hz)',
    clima: 'Templado oceánico (22°C a 29°C en verano).',
    tipoViajeDefault: 'playa',
    ambulancia: '911 / 105 (Emergencias Médicas)',
    consuladoDefault: 'Consulado General en Montevideo',
    consuladoTelDefault: '+598 2707 5588',
    consuladoDirDefault: 'Montevideo, Uruguay',
    movilidad: {
      llegadaAeropuerto: 'Desde el Aeropuerto de Carrasco hay taxis oficiales y remises en la terminal, además de Uber hacia Montevideo o Punta del Este.',
      appsYTransporte: 'Uber y Cabify operan en Montevideo y Punta del Este. En buses locales se puede pagar en efectivo.',
      alquilerYConduccion: 'Licencia de conducir física vigente válida.',
      mapasOffline: 'Descarga mapa sin conexión en Google Maps.',
      costumbresDinero: 'Beneficio turista: en gastronomía y alquileres pagando con tarjeta extranjera devuelven parte del IVA automáticamente.'
    }
  },
  republica_dominicana: {
    pais: 'República Dominicana',
    destinoDefault: 'Punta Cana',
    ciudadesSugeridas: ['Punta Cana', 'Santo Domingo', 'Bayahíbe', 'Puerto Plata', 'Samaná'],
    bandera: '🇩🇴',
    moneda: 'Peso Dominicano / Dólar (DOP - RD$ / USD)',
    enchufe: 'Tipo A y B (clavijas planas tipo americano)',
    voltaje: '120V (Frecuencia 60 Hz)',
    clima: 'Tropical caribeño cálido (27°C a 32°C todo el año).',
    tipoViajeDefault: 'playa',
    ambulancia: '911 (Sistema Nacional de Emergencias)',
    consuladoDefault: 'Consulado en Santo Domingo',
    consuladoTelDefault: '+1 809 532 4223',
    consuladoDirDefault: 'Santo Domingo, República Dominicana',
    movilidad: {
      llegadaAeropuerto: 'En Punta Cana (PUJ) coordina tu transfer previo con el resort o contrata taxis en la parada oficial autorizada.',
      appsYTransporte: 'Uber funciona en Santo Domingo y Santiago. En Punta Cana los traslados turísticos o taxis de hotel son la opción estándar.',
      alquilerYConduccion: 'Se recomienda usar transfers turísticos en lugar de alquilar auto.',
      mapasOffline: 'Descarga mapas offline de la costa en Google Maps.',
      costumbresDinero: 'En zonas turísticas de Punta Cana aceptan dólares USD en efectivo o tarjeta sin problema.'
    }
  },
  costa_rica: {
    pais: 'Costa Rica',
    destinoDefault: 'San José',
    ciudadesSugeridas: ['San José', 'La Fortuna', 'Manuel Antonio', 'Tamarindo', 'Monteverde', 'Tortuguero'],
    bandera: '🇨🇷',
    moneda: 'Colón Costarricense / Dólar (CRC - ₡ / USD)',
    enchufe: 'Tipo A y B (clavijas planas tipo americano)',
    voltaje: '120V (Frecuencia 60 Hz)',
    clima: 'Tropical diverso (playas cálidas, selva lluviosa y montañas templadas).',
    tipoViajeDefault: 'playa',
    ambulancia: '911 (Emergencias Médicas)',
    consuladoDefault: 'Consulado en San José',
    consuladoTelDefault: '+506 2224 4022',
    consuladoDirDefault: 'San José, Costa Rica',
    movilidad: {
      llegadaAeropuerto: 'Taxis oficiales anaranjados en el Aeropuerto Juan Santamaría (SJO) o Uber en los puntos habilitados.',
      appsYTransporte: 'Uber opera en el Gran Área Metropolitana. Para recorrer volcanes y parques nacionales se contratan tours o transfers interurbanos.',
      alquilerYConduccion: 'Para zonas rurales o playas apartadas conviene un auto SUV 4x4.',
      mapasOffline: 'Waze y Google Maps son muy usados; descarga mapas sin conexión para carreteras de montaña.',
      costumbresDinero: 'Aceptan dólares y colones. Tarjetas bancarias aceptadas en casi todos los comercios.'
    }
  },
  italia: {
    pais: 'Italia',
    destinoDefault: 'Roma',
    ciudadesSugeridas: ['Roma', 'Milán', 'Florencia', 'Venecia', 'Nápoles', 'Costa Amalfitana'],
    bandera: '🇮🇹',
    moneda: 'Euro (EUR - €)',
    enchufe: 'Tipo C, F y L (patitas redondas europeas)',
    voltaje: '230V (Frecuencia 50 Hz)',
    clima: 'Mediterráneo. Veranos calurosos (30°C-35°C), inviernos suaves a templados.',
    tipoViajeDefault: 'ciudad',
    ambulancia: '112 / 118 (Emergenza Sanitaria)',
    consuladoDefault: 'Consulado General en Roma / Milán',
    consuladoTelDefault: '+39 06 6840 821',
    consuladoDirDefault: 'Via Po 23, Roma',
    movilidad: {
      llegadaAeropuerto: 'Desde Fiumicino toma el tren directo Leonardo Express a Roma Termini (32 min) o taxi oficial con tarifa plana de 50€ al centro.',
      appsYTransporte: 'Trenitalia e Italo para viajar entre ciudades en alta velocidad. En ciudades compra billetes de metro/bus antes de subir y valídalos en las máquinas.',
      alquilerYConduccion: 'Cuidado con las ZTL (Zona a Traffico Limitato) en centros históricos: tienen cámaras y multan automáticamente a no residentes.',
      mapasOffline: 'Descarga mapa sin conexión en Google Maps.',
      costumbresDinero: 'Pago con tarjeta contactless estándar. Pequeño efectivo para propina o espresso en la barra.'
    }
  },
  francia: {
    pais: 'Francia',
    destinoDefault: 'París',
    ciudadesSugeridas: ['París', 'Niza', 'Lyon', 'Marsella', 'Burdeos', 'Estrasburgo'],
    bandera: '🇫🇷',
    moneda: 'Euro (EUR - €)',
    enchufe: 'Tipo C y E (2 patitas redondas)',
    voltaje: '230V (Frecuencia 50 Hz)',
    clima: 'Templado continental. Agradable en primavera y verano; fresco y lluvioso en otoño e invierno.',
    tipoViajeDefault: 'ciudad',
    ambulancia: '112 / 15 (SAMU Urgencias Sanitarias)',
    consuladoDefault: 'Consulado General en París',
    consuladoTelDefault: '+33 1 44 18 59 60',
    consuladoDirDefault: 'Boulevard de La Tour-Maubourg, París',
    movilidad: {
      llegadaAeropuerto: 'Desde Charles de Gaulle (CDG) toma el tren RER B directo al centro de París o taxi oficial con tarifa fija regulada (56€ margen derecha, 65€ margen izquierda).',
      appsYTransporte: 'El metro de París y la red RER son rápidos y cubren cada rincón. Compra pases Navigo Easy o billetes digitales en tu celular.',
      alquilerYConduccion: 'En París no es recomendable auto; el transporte público y caminar es mil veces mejor.',
      mapasOffline: 'Usa Citymapper o Google Maps con mapas descargados sin conexión.',
      costumbresDinero: 'Pago con tarjeta contactless aceptado desde montos mínimos (incluso una baguette).'
    }
  },
  alemania: {
    pais: 'Alemania',
    destinoDefault: 'Berlín',
    ciudadesSugeridas: ['Berlín', 'Múnich', 'Fráncfort', 'Hamburgo', 'Colonia', 'Dresde'],
    bandera: '🇩🇪',
    moneda: 'Euro (EUR - €)',
    enchufe: 'Tipo C y F (Schuko patitas redondas)',
    voltaje: '230V (Frecuencia 50 Hz)',
    clima: 'Continental moderado. Templado en verano (24°C), frío en invierno.',
    tipoViajeDefault: 'ciudad',
    ambulancia: '112 (Notruf / Emergencias)',
    consuladoDefault: 'Consulado General en Berlín / Frankfurt',
    consuladoTelDefault: '+49 30 7262 030',
    consuladoDirDefault: 'Mohrenstraße 42, Berlín',
    movilidad: {
      llegadaAeropuerto: 'Desde el Aeropuerto BER toma los trenes Airport Express (FEX) o S-Bahn directos al centro.',
      appsYTransporte: 'Red S-Bahn, U-Bahn, tranvías y buses excelentes con la app BVG. Valida siempre tu billete antes de subir.',
      alquilerYConduccion: 'Autobahns famosas con tramos sin límite de velocidad; conduce siempre por la derecha.',
      mapasOffline: 'Descarga mapa sin conexión en Google Maps.',
      costumbresDinero: 'Alemania aún valora el efectivo en bares pequeños o panaderías; lleva billetes de 10€ y 20€.'
    }
  },
  reino_unido: {
    pais: 'Reino Unido',
    destinoDefault: 'Londres',
    ciudadesSugeridas: ['Londres', 'Edimburgo', 'Manchester', 'Liverpool', 'Oxford', 'Belfast'],
    bandera: '🇬🇧',
    moneda: 'Libra Esterlina (GBP - £)',
    enchufe: 'Tipo G (3 patitas rectangulares británicas - requiere adaptador)',
    voltaje: '230V (Frecuencia 50 Hz)',
    clima: 'Oceánico templado con lluvias frecuentes ligeras. Lleva paraguas compacto.',
    tipoViajeDefault: 'ciudad',
    ambulancia: '999 / 112 (Emergency Services)',
    consuladoDefault: 'Consulado General en Londres',
    consuladoTelDefault: '+44 20 7225 1445',
    consuladoDirDefault: 'Palace Gate, Kensington, Londres',
    movilidad: {
      llegadaAeropuerto: 'Desde Heathrow toma la línea Elizabeth Line o el metro Piccadilly Line directo al centro.',
      appsYTransporte: 'El Tube (Metro) y los buses rojos se pagan simplemente apoyando tu tarjeta bancaria contactless o teléfono en los molinetes (sin comprar boletos).',
      alquilerYConduccion: '¡Se conduce por la izquierda! En Londres el auto es desaconsejado por Congestion Charge.',
      mapasOffline: 'Citymapper y Google Maps descargados.',
      costumbresDinero: 'Casi 100% cashless (sin efectivo). Se paga todo con tarjeta.'
    }
  },
  portugal: {
    pais: 'Portugal',
    destinoDefault: 'Lisboa',
    ciudadesSugeridas: ['Lisboa', 'Oporto', 'Faro (Algarve)', 'Sintra', 'Coímbra', 'Madeira'],
    bandera: '🇵🇹',
    moneda: 'Euro (EUR - €)',
    enchufe: 'Tipo C y F (patitas redondas europeas)',
    voltaje: '230V (Frecuencia 50 Hz)',
    clima: 'Mediterráneo suave y soleado (25°C-30°C en verano).',
    tipoViajeDefault: 'ciudad',
    ambulancia: '112 (Emergência Médica)',
    consuladoDefault: 'Consulado General en Lisboa',
    consuladoTelDefault: '+351 21 313 7700',
    consuladoDirDefault: 'Avenida da Liberdade, Lisboa',
    movilidad: {
      llegadaAeropuerto: 'Desde el Aeropuerto de Lisboa el metro Línea Roja conecta directo con la red o Uber por tarifa baja.',
      appsYTransporte: 'Tranvías históricos (como el 28), metro y buses con tarjeta Viva Viagem. Uber y Bolt son muy económicos.',
      alquilerYConduccion: 'Licencia nacional física vigente aceptada. Las autopistas usan peaje electrónico Via Verde.',
      mapasOffline: 'Descarga mapa sin conexión en Google Maps.',
      costumbresDinero: 'Tarjetas contactless aceptadas ampliamente; algo de efectivo para pequeños cafés y pasteles de nata.'
    }
  },
  japon: {
    pais: 'Japón',
    destinoDefault: 'Tokio',
    ciudadesSugeridas: ['Tokio', 'Kioto', 'Osaka', 'Hiroshima', 'Nara', 'Sapporo'],
    bandera: '🇯🇵',
    moneda: 'Yen Japonés (JPY - ¥)',
    enchufe: 'Tipo A y B (2 clavijas planas sin tierra - 100V)',
    voltaje: '100V (Frecuencia 50/60 Hz)',
    clima: 'Cuatro estaciones marcadas. Primavera agradable con cerezos; veranos calurosos y húmedos.',
    tipoViajeDefault: 'ciudad',
    ambulancia: '119 (Ambulancia y Bomberos) / Policía 110',
    consuladoDefault: 'Embajada / Consulado en Tokio',
    consuladoTelDefault: '+81 3 3452 7561',
    consuladoDirDefault: 'Minato-ku, Tokio',
    movilidad: {
      llegadaAeropuerto: 'Desde Narita toma el tren Narita Express (NEX) o Keisei Skyliner; desde Haneda el Tokyo Monorail.',
      appsYTransporte: 'La red ferroviaria y de metro de Tokio es la más puntual del mundo. Usa tarjetas IC Suica o Pasmo (físicas o en Apple Wallet).',
      alquilerYConduccion: 'Se conduce por la izquierda; se requiere Permiso Internacional de Conducir con convenio específico.',
      mapasOffline: 'Google Maps funciona de maravilla para rutas de tren exactas.',
      costumbresDinero: 'Japón aún usa mucho efectivo en restaurantes de ramen, templos y máquinas expendedoras. Lleva siempre billetes de 1.000 y 5.000 yenes. ¡En Japón NO se deja propina (se considera descortés)!'
    }
  },
  canada: {
    pais: 'Canadá',
    destinoDefault: 'Toronto',
    ciudadesSugeridas: ['Toronto', 'Vancouver', 'Montreal', 'Quebec', 'Banff', 'Ottawa'],
    bandera: '🇨🇦',
    moneda: 'Dólar Canadiense (CAD - $)',
    enchufe: 'Tipo A y B (clavijas planas tipo americano)',
    voltaje: '120V (Frecuencia 60 Hz)',
    clima: 'Veranos cálidos y templados (22°C a 28°C); inviernos muy fríos con nieve.',
    tipoViajeDefault: 'ciudad',
    ambulancia: '911 (Emergencias Médicas)',
    consuladoDefault: 'Consulado General en Toronto / Montreal',
    consuladoTelDefault: '+1 416 924 0106',
    consuladoDirDefault: 'Toronto, ON',
    movilidad: {
      llegadaAeropuerto: 'En Toronto el tren UP Express conecta Pearson con Union Station en 25 minutos.',
      appsYTransporte: 'Uber y Lyft funcionan en todas las ciudades principales. Red de transporte público moderna (TTC en Toronto, TransLink en Vancouver).',
      alquilerYConduccion: 'Licencia nacional válida por hasta 90 días.',
      mapasOffline: 'Descarga mapa sin conexión en Google Maps.',
      costumbresDinero: 'Pago con tarjeta contactless estándar en todas partes.'
    }
  },
  turquia: {
    pais: 'Turquía',
    destinoDefault: 'Estambul',
    ciudadesSugeridas: ['Estambul', 'Capadocia', 'Antalya', 'Esmirna', 'Bodrum'],
    bandera: '🇹🇷',
    moneda: 'Lira Turca (TRY - ₺)',
    enchufe: 'Tipo C y F (patitas redondas)',
    voltaje: '230V (Frecuencia 50 Hz)',
    clima: 'Veranos cálidos (28°C-32°C), primaveras templadas ideales para pasear.',
    tipoViajeDefault: 'ciudad',
    ambulancia: '112 (Emergencias Sanitarias)',
    consuladoDefault: 'Consulado en Estambul / Ankara',
    consuladoTelDefault: '+90 212 284 8400',
    consuladoDirDefault: 'Levent, Estambul',
    movilidad: {
      llegadaAeropuerto: 'Desde el nuevo Aeropuerto de Estambul (IST) toma la línea M11 de Metro o buses Havaist directos a Taksim.',
      appsYTransporte: 'La tarjeta Istanbulkart sirve para metro, tranvías históricos y ferris por el Bósforo.',
      alquilerYConduccion: 'En Estambul el tráfico es muy denso; para Capadocia sí es ideal arrendar vehículo.',
      mapasOffline: 'Descarga mapa sin conexión en Google Maps.',
      costumbresDinero: 'Lleva liras turcas para el Gran Bazar y propinas en bazares.'
    }
  },
  grecia: {
    pais: 'Grecia',
    destinoDefault: 'Atenas',
    ciudadesSugeridas: ['Atenas', 'Santorini', 'Miconos', 'Creta', 'Rodas', 'Meteora'],
    bandera: '🇬🇷',
    moneda: 'Euro (EUR - €)',
    enchufe: 'Tipo C y F (patitas redondas)',
    voltaje: '230V (Frecuencia 50 Hz)',
    clima: 'Mediterráneo soleado y caluroso en verano (30°C-36°C) con brisa en las islas.',
    tipoViajeDefault: 'playa',
    ambulancia: '112 / 166 (EKAV Emergencias)',
    consuladoDefault: 'Consulado en Atenas',
    consuladoTelDefault: '+30 210 729 2647',
    consuladoDirDefault: 'Atenas, Grecia',
    movilidad: {
      llegadaAeropuerto: 'Desde el Aeropuerto de Atenas (ATH) toma la Línea 3 de Metro directo a Plaza Syntagma.',
      appsYTransporte: 'La app FREENOW funciona muy bien para taxis en Atenas. Para las islas se viaja en ferris (Blue Star, Seajets).',
      alquilerYConduccion: 'En las islas griegas se alquilan autos pequeños o cuatrimotos; se exige licencia internacional a veces.',
      mapasOffline: 'Descarga mapas de las islas en Google Maps.',
      costumbresDinero: 'Tarjetas aceptadas en casi todos lados; efectivo para propinas o taxis pequeños en islas.'
    }
  },
  suiza: {
    pais: 'Suiza',
    destinoDefault: 'Zúrich',
    ciudadesSugeridas: ['Zúrich', 'Ginebra', 'Lucerna', 'Interlaken', 'Zermatt', 'Berna'],
    bandera: '🇨🇭',
    moneda: 'Franco Suizo (CHF - CHF)',
    enchufe: 'Tipo J y C (3 patitas en triángulo plano)',
    voltaje: '230V (Frecuencia 50 Hz)',
    clima: 'Alpino templado en verano (20°C-25°C), frío con nieve en invierno.',
    tipoViajeDefault: 'frio',
    ambulancia: '144 (Ambulancia) / 112',
    consuladoDefault: 'Consulado en Berna / Ginebra',
    consuladoTelDefault: '+41 31 356 0000',
    consuladoDirDefault: 'Berna, Suiza',
    movilidad: {
      llegadaAeropuerto: 'Desde el Aeropuerto de Zúrich (ZRH) hay trenes cada 5 minutos a la estación central Zürich HB (10 min).',
      appsYTransporte: 'El sistema de trenes suizos SBB es el más eficiente de Europa. El pase Swiss Travel Pass cubre trenes, barcos y buses panorámicos.',
      alquilerYConduccion: 'Vignette anual obligatoria para autopistas suizas.',
      mapasOffline: 'App SBB y Google Maps.',
      costumbresDinero: 'Aceptan tarjetas en todos lados. Se puede pagar con euros en muchas tiendas y devuelven el cambio en francos suizos.'
    }
  },
  paises_bajos: {
    pais: 'Países Bajos',
    destinoDefault: 'Ámsterdam',
    ciudadesSugeridas: ['Ámsterdam', 'Róterdam', 'La Haya', 'Utrecht', 'Eindhoven'],
    bandera: '🇳🇱',
    moneda: 'Euro (EUR - €)',
    enchufe: 'Tipo C y F (patitas redondas europeas)',
    voltaje: '230V (Frecuencia 50 Hz)',
    clima: 'Templado oceánico con lluvia frecuente.',
    tipoViajeDefault: 'ciudad',
    ambulancia: '112 (Emergencias UE)',
    consuladoDefault: 'Consulado en La Haya / Ámsterdam',
    consuladoTelDefault: '+31 70 315 5200',
    consuladoDirDefault: 'La Haya, Países Bajos',
    movilidad: {
      llegadaAeropuerto: 'Desde el Aeropuerto Schiphol hay trenes directos cada 10 min a Ámsterdam Centraal (15 min).',
      appsYTransporte: 'Tranvías y ferries gratuitos detrás de la estación central. ¡La bicicleta es el rey!',
      alquilerYConduccion: 'No se recomienda auto en Ámsterdam; los estacionamientos son los más caros de Europa.',
      mapasOffline: 'Google Maps y app 9292.',
      costumbresDinero: 'Prácticamente 100% pago con tarjeta.'
    }
  },
  emiratos_arabes: {
    pais: 'Emiratos Árabes',
    destinoDefault: 'Dubái',
    ciudadesSugeridas: ['Dubái', 'Abu Dabi', 'Sharjah', 'Ras al Khaimah'],
    bandera: '🇦🇪',
    moneda: 'Dírham de los EAU (AED - د.إ)',
    enchufe: 'Tipo G (3 patitas rectangulares británicas)',
    voltaje: '230V (Frecuencia 50 Hz)',
    clima: 'Desértico cálido. Muy caluroso en verano (38°C-44°C); muy agradable de noviembre a marzo (24°C-28°C).',
    tipoViajeDefault: 'ciudad',
    ambulancia: '998 (Ambulancia) / Policía 999',
    consuladoDefault: 'Consulado General en Dubái / Abu Dabi',
    consuladoTelDefault: '+971 4 330 0810',
    consuladoDirDefault: 'Dubái, EAU',
    movilidad: {
      llegadaAeropuerto: 'Desde el Aeropuerto DXB la línea roja del Metro de Dubái conecta directo con Downtown y Burj Khalifa.',
      appsYTransporte: 'La app Careem (para taxis oficiales Hala y autos privados) y Uber funcionan excelente. El Metro de Dubái es completamente automatizado y climatizado.',
      alquilerYConduccion: 'Autopistas de hasta 7 carriles con peaje Salik. Requiere licencia internacional.',
      mapasOffline: 'Descarga mapa sin conexión en Google Maps.',
      costumbresDinero: 'Pago con tarjeta contactless en el 100% de los establecimientos.'
    }
  },
  tailandia: {
    pais: 'Tailandia',
    destinoDefault: 'Bangkok',
    ciudadesSugeridas: ['Bangkok', 'Phuket', 'Chiang Mai', 'Krabi', 'Koh Samui', 'Pattaya'],
    bandera: '🇹🇭',
    moneda: 'Baht Tailandés (THB - ฿)',
    enchufe: 'Tipo A, B, C y F (universal compatible)',
    voltaje: '220V (Frecuencia 50 Hz)',
    clima: 'Tropical cálido (30°C a 34°C). Temporada de monzones entre julio y octubre.',
    tipoViajeDefault: 'playa',
    ambulancia: '1669 (Ambulancia) / Policía Turística 1155',
    consuladoDefault: 'Embajada en Bangkok',
    consuladoTelDefault: '+66 2 260 0045',
    consuladoDirDefault: 'Bangkok, Tailandia',
    movilidad: {
      llegadaAeropuerto: 'Desde el Aeropuerto Suvarnabhumi (BKK) toma el Airport Rail Link hacia Phaya Thai o taxis oficiales con taxímetro en el nivel 1.',
      appsYTransporte: 'La aplicación Grab y Bolt son indispensables para taxis y traslados seguros. En Bangkok usa el BTS Skytrain y MRT para evitar el tráfico.',
      alquilerYConduccion: 'No se recomienda alquilar motos sin experiencia; la policía tailandesa realiza controles de licencia internacional frecuentes.',
      mapasOffline: 'Descarga mapa de Bangkok y playas en Google Maps.',
      costumbresDinero: 'Tailandia es muy de efectivo para street food y mercados. Los cajeros automáticos (ATM) cobran una tarifa fija de ~220 bahts por retiro internacional; retira montos mayores de una vez.'
    }
  },
  australia: {
    pais: 'Australia',
    destinoDefault: 'Sídney',
    ciudadesSugeridas: ['Sídney', 'Melbourne', 'Brisbane', 'Gold Coast', 'Perth', 'Cairns'],
    bandera: '🇦🇺',
    moneda: 'Dólar Australiano (AUD - $)',
    enchufe: 'Tipo I (3 patitas planas en forma de V)',
    voltaje: '230V (Frecuencia 50 Hz)',
    clima: 'Cálido templado en costas, desértico en el interior.',
    tipoViajeDefault: 'ciudad',
    ambulancia: '000 (Triple Zero Emergencias)',
    consuladoDefault: 'Consulado General en Sídney / Melbourne',
    consuladoTelDefault: '+61 2 9229 0000',
    consuladoDirDefault: 'Sídney, Australia',
    movilidad: {
      llegadaAeropuerto: 'Desde el aeropuerto de Sídney toma el Airport Link (tren a Central Station) o Uber.',
      appsYTransporte: 'Toca tu tarjeta bancaria contactless directamente en trenes, tranvías y ferris (sistema Opal en Sídney, Myki en Melbourne).',
      alquilerYConduccion: 'Se conduce por la izquierda. Tolerancia cero al alcohol al volante.',
      mapasOffline: 'Descarga mapas offline en Google Maps.',
      costumbresDinero: 'Prácticamente libre de efectivo (cashless).'
    }
  },
  ecuador: {
    pais: 'Ecuador',
    destinoDefault: 'Quito',
    ciudadesSugeridas: ['Quito', 'Islas Galápagos', 'Guayaquil', 'Cuenca', 'Baños'],
    bandera: '🇪🇨',
    moneda: 'Dólar Estadounidense (USD - $)',
    enchufe: 'Tipo A y B (clavijas planas tipo americano)',
    voltaje: '120V (Frecuencia 60 Hz)',
    clima: 'Templado en la sierra andina (Quito 18°C-22°C); cálido tropical en la costa y Galápagos.',
    tipoViajeDefault: 'ciudad',
    ambulancia: '911 (Emergencias ECU 911)',
    consuladoDefault: 'Consulado en Quito / Guayaquil',
    consuladoTelDefault: '+593 2 245 3000',
    consuladoDirDefault: 'Quito, Ecuador',
    movilidad: {
      llegadaAeropuerto: 'Desde el Aeropuerto Mariscal Sucre (UIO) toma Aeroservicios bus expreso o taxis oficiales autorizados.',
      appsYTransporte: 'Uber y Cabify funcionan en Quito y Guayaquil.',
      alquilerYConduccion: 'Licencia nacional vigente válida por 90 días.',
      mapasOffline: 'Descarga mapa sin conexión en Google Maps.',
      costumbresDinero: 'Moneda oficial: Dólar estadounidense. Monedas fraccionarias y billetes de 10 o 20 dólares son los más aceptados.'
    }
  },
  bolivia: {
    pais: 'Bolivia',
    destinoDefault: 'La Paz',
    ciudadesSugeridas: ['La Paz', 'Salar de Uyuni', 'Santa Cruz de la Sierra', 'Cochabamba', 'Sucre'],
    bandera: '🇧🇴',
    moneda: 'Boliviano (BOB - Bs)',
    enchufe: 'Tipo A y C (patas planas y redondas)',
    voltaje: '230V / 115V en zonas antiguas (50 Hz)',
    clima: 'Frío y seco de altura en el altiplano (10°C-18°C, noches bajo cero en Uyuni); cálido en Santa Cruz.',
    tipoViajeDefault: 'frio',
    ambulancia: '118 (Emergencias Médicas) / 911',
    consuladoDefault: 'Consulado en La Paz',
    consuladoTelDefault: '+591 2 279 2900',
    consuladoDirDefault: 'La Paz, Bolivia',
    movilidad: {
      llegadaAeropuerto: 'En El Alto (LPB) toma taxis autorizados oficiales en la puerta o transfers con tu hotel.',
      appsYTransporte: 'La red de teleféricos "Mi Teleférico" en La Paz es la más moderna del mundo y conecta toda la ciudad con vistas increíbles.',
      alquilerYConduccion: 'Para el Salar de Uyuni es imprescindible contratar tour con chofer guía 4x4 profesional.',
      mapasOffline: 'Descarga mapas offline antes de ingresar al altiplano.',
      costumbresDinero: 'Efectivo en bolivianos imprescindible para mercados y traslados.'
    }
  },
  paraguay: {
    pais: 'Paraguay',
    destinoDefault: 'Asunción',
    ciudadesSugeridas: ['Asunción', 'Ciudad del Este', 'Encarnación', 'San Bernardino'],
    bandera: '🇵🇾',
    moneda: 'Guaraní Paraguayo (PYG - ₲)',
    enchufe: 'Tipo C (2 patitas redondas)',
    voltaje: '220V (Frecuencia 50 Hz)',
    clima: 'Subtropical cálido a muy caluroso en verano (32°C a 38°C).',
    tipoViajeDefault: 'ciudad',
    ambulancia: '141 (Ambulancia SEME) / 911',
    consuladoDefault: 'Consulado en Asunción',
    consuladoTelDefault: '+595 21 210 000',
    consuladoDirDefault: 'Asunción, Paraguay',
    movilidad: {
      llegadaAeropuerto: 'En el Aeropuerto Silvio Pettirossi toma taxis de la parada oficial o Uber / Bolt.',
      appsYTransporte: 'Bolt y Uber son económicos y funcionan en todo Asunción. Para buses se usa la tarjeta Jaha o Más.',
      alquilerYConduccion: 'Licencia nacional de conducir válida.',
      mapasOffline: 'Descarga mapas en Google Maps.',
      costumbresDinero: 'Billetes de guaraníes de alta denominación. Tarjetas aceptadas en centros comerciales.'
    }
  },
  cuba: {
    pais: 'Cuba',
    destinoDefault: 'La Habana',
    ciudadesSugeridas: ['La Habana', 'Varadero', 'Trinidad', 'Cayo Santa María', 'Viñales'],
    bandera: '🇨🇺',
    moneda: 'Peso Cubano / MLC (CUP - $ / Tarjeta MLC)',
    enchufe: 'Tipo A, B y C (110V y 220V en hoteles)',
    voltaje: '110V / 220V en resorts (60 Hz)',
    clima: 'Tropical cálido (26°C a 31°C todo el año).',
    tipoViajeDefault: 'playa',
    ambulancia: '104 (Ambulancias Médicas)',
    consuladoDefault: 'Consulado en La Habana',
    consuladoTelDefault: '+53 7 204 1222',
    consuladoDirDefault: 'Miramar, La Habana',
    movilidad: {
      llegadaAeropuerto: 'En el Aeropuerto José Martí toma taxis oficiales amarillos o coordina transfer antes de viajar.',
      appsYTransporte: 'Taxis clásicos ("almendrones") y buses turísticos HabanaBusTour.',
      alquilerYConduccion: 'Vía Azul para buses interurbanos seguros.',
      mapasOffline: 'Muy importante: la conexión a internet en la calle es limitada. Descarga maps.me o Google Maps offline antes de volar.',
      costumbresDinero: 'Lleva euros o dólares en efectivo físico en buen estado. Tarjetas emitidas por bancos de EE.UU. no funcionan.'
    }
  },
  egipto: {
    pais: 'Egipto',
    destinoDefault: 'El Cairo',
    ciudadesSugeridas: ['El Cairo', 'Lúxor', 'Asuán', 'Sharm el-Sheij', 'Hurgada', 'Alejandría'],
    bandera: '🇪🇬',
    moneda: 'Libra Egipcia (EGP - E£)',
    enchufe: 'Tipo C y F (patitas redondas europeas)',
    voltaje: '220V (Frecuencia 50 Hz)',
    clima: 'Desértico caluroso (días soleados 30°C-38°C, noches frescas).',
    tipoViajeDefault: 'ciudad',
    ambulancia: '123 (Ambulancias Médicas)',
    consuladoDefault: 'Consulado en El Cairo',
    consuladoTelDefault: '+20 2 2735 0000',
    consuladoDirDefault: 'Zamalek, El Cairo',
    movilidad: {
      llegadaAeropuerto: 'En el Aeropuerto Internacional de El Cairo (CAI) solicita Uber o contrata transfer antes con tu hotel.',
      appsYTransporte: 'Uber funciona muy bien en El Cairo y evita negociar tarifas con taxis blancos.',
      alquilerYConduccion: 'No se recomienda conducir a turistas; el tráfico de El Cairo es caótico.',
      mapasOffline: 'Descarga mapa sin conexión en Google Maps.',
      costumbresDinero: 'Propinas ("baksheesh") son costumbre arraigada para todo servicio. Ten billetes de 5, 10 y 20 libras a mano.'
    }
  }
};

// Helper inteligente para buscar país por nombre aproximado
export function findCountryPreset(query: string): DestinationPreset | undefined {
  if (!query) return undefined;
  const clean = query.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // Coincidencia exacta de clave
  if (DESTINATIONS[clean]) return DESTINATIONS[clean];
  
  // Coincidencia por nombre de país
  const match = Object.values(DESTINATIONS).find(item => {
    const itemPais = item.pais.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return itemPais === clean || itemPais.includes(clean) || clean.includes(itemPais);
  });
  
  return match;
}
