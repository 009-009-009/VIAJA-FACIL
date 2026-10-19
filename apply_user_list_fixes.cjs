const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update import to include getEmergencyNumbers
code = code.replace(
  "findCountryPreset\n} from './data/destinations';",
  "findCountryPreset,\n  getEmergencyNumbers\n} from './data/destinations';"
);

// 2. Add numeroPoliciaLocal and numeroBomberosLocal to HealthInfo interface
code = code.replace(
  "  numeroAmbulanciaLocal: string;\n  fondosEmergenciaNotas: string;",
  "  numeroAmbulanciaLocal: string;\n  numeroPoliciaLocal?: string;\n  numeroBomberosLocal?: string;\n  fondosEmergenciaNotas: string;"
);

// 3. In DEFAULT_TRIP:
// - inf-1 listo: false
code = code.replace(
  "{ id: 'inf-1', nombre: 'Cédula física o Pasaporte vigente (en bolso de mano)', categoria: 'infaltable', listo: true }",
  "{ id: 'inf-1', nombre: 'Cédula física o Pasaporte vigente (en bolso de mano)', categoria: 'infaltable', listo: false }"
);

// - in DEFAULT_TRIP.salud: add emergency numbers and clear default hospital so it's not pre-filled with fake data
code = code.replace(
  "    hospitalCercanoNombre: 'UPA 24h Canasvieiras (Urgencias Públicas)',\n    hospitalCercanoDireccion: 'Rua Francisco Faustino dos Santos, Canasvieiras',\n    hospitalCercanoTelefono: '+55 48 3266 0149',\n    numeroAmbulanciaLocal: '192 (SAMU Brasil)',",
  "    hospitalCercanoNombre: '', // Sin pre-llenar hospital ficticio; editable por el viajero\n    hospitalCercanoDireccion: '',\n    hospitalCercanoTelefono: '',\n    numeroAmbulanciaLocal: '192 (SAMU Brasil)',\n    numeroPoliciaLocal: '190 (Policía Militar)',\n    numeroBomberosLocal: '193 (Bombeiros)',"
);

// - in handleGeneratePackList: inf-1 listo: false
code = code.replace(
  "{ id: `inf-1`, nombre: 'Cédula física o Pasaporte vigente (en bolso de mano)', categoria: 'infaltable', listo: true }",
  "{ id: `inf-1`, nombre: 'Cédula física o Pasaporte vigente (en bolso de mano)', categoria: 'infaltable', listo: false }"
);

// 4. Remove the big GPS warning box in Western Union / Puntos de Retiro (Tab 3)
const oldGpsAlertRegex = /\{\/\* ALERTA REAL DE VIAJERO CON GPS Y SUCURSALES DESACTUALIZADAS \*\/\}[\s\S]*?<\/div>\s*<\/div>/;
if (oldGpsAlertRegex.test(code)) {
  code = code.replace(oldGpsAlertRegex, '');
}

// 5. Remove the Seguro warning box in the Flight / Booking modal
const oldSeguroModalAlertRegex = /\{\/\* ALERTA VIAJERA SOBRE EL SEGURO EN EL PASAJE \*\/\}[\s\S]*?<\/div>\s*<\/div>/;
if (oldSeguroModalAlertRegex.test(code)) {
  code = code.replace(oldSeguroModalAlertRegex, '');
}

// 6. Remove "No estás limitado a la capital" in the Configurar Destino modal
code = code.replace(
  /<p className="text-\[11px\] text-slate-400 mt-1\.5">\s*💡 <strong className="text-slate-300">No estás limitado a la capital:<\/strong>[\s\S]*?<\/p>/,
  ''
);

// 7. Add states for targetOrigin, hospital modal, and familiar modal
const targetOriginState = `  // Estados para Origen del Viajero
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
`;

code = code.replace(
  "  // Estados para Selección y Personalización de Destino (País + Ciudad separados)\n  const [targetCountryKey, setTargetCountryKey] = useState<string>(trip.paisKey || 'brasil');",
  targetOriginState + "\n  // Estados para Selección y Personalización de Destino (País + Ciudad separados)\n  const [targetCountryKey, setTargetCountryKey] = useState<string>(trip.paisKey || 'brasil');"
);

// 8. In openChangeDestinationModal: setTargetOrigin
code = code.replace(
  "  const openChangeDestinationModal = () => {\n    setTargetCountryKey(trip.paisKey || 'brasil');",
  "  const openChangeDestinationModal = () => {\n    setTargetOrigin(trip.origen || 'Santiago');\n    setTargetCountryKey(trip.paisKey || 'brasil');"
);

// 9. In handleApplyDestination: update origen and clean hospital if country changed, and set 3 emergency numbers
const oldApplyDestRegex = /const handleApplyDestination = \(e\?: React\.FormEvent\) => \{[\s\S]*?setShowChangeCountryModal\(false\);\s*\};/;
const newApplyDest = `const handleApplyDestination = (e?: React.FormEvent) => {
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
          nombre: \`Viaje a \${finalCity}, \${finalCountry}\`,
          moneda: finalMoneda,
          enchufe: finalEnchufe,
          voltaje: finalVoltaje,
          clima: finalClima,
          consuladoNombre: matched ? matched.consuladoDefault : \`Consulado / Embajada en \${finalCountry}\`,
          consuladoTelefono: matched ? matched.consuladoTelDefault : '+1 800 000 000',
          consuladoDireccion: matched ? matched.consuladoDirDefault : \`Capital de \${finalCountry}\`,
          movilidad: matched ? matched.movilidad : {
            llegadaAeropuerto: \`Usa transporte oficial autorizado en el aeropuerto o terminal de \${finalCity}. Evita transportes informales.\`,
            appsYTransporte: \`Averigua si en \${finalCountry} opera Uber u otra app local y cómo funciona el pago de buses/metro.\`,
            alquilerYConduccion: \`Consulta si exigen Licencia de Conducir Internacional o si basta tu licencia nacional en \${finalCountry}.\`,
            mapasOffline: \`Descarga el mapa sin conexión de \${finalCity} en Google Maps antes de salir del hotel.\`,
            costumbresDinero: \`Lleva una parte en efectivo de \${finalMoneda} y activa tus tarjetas de débito/crédito para compras en el extranjero.\`
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
          nombre: \`Viaje a \${finalCity}, \${preset.pais}\`,
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
  };`;

code = code.replace(oldApplyDestRegex, newApplyDest);

// 10. In Configurar Destino modal, insert Origen input right before the City input
const originInputHtml = `<div className="space-y-1">
                <label className="text-slate-300 font-bold block text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    🛫 Tu Ciudad o País de Origen *
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">¿Desde dónde sales?</span>
                </label>
                <input
                  type="text"
                  required
                  value={targetOrigin}
                  onChange={(e) => setTargetOrigin(e.target.value)}
                  placeholder="Ej: Santiago, Buenos Aires, Lima, Madrid, Bogotá, Miami, etc."
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-white font-bold text-xs outline-none transition"
                />
              </div>

              `;

code = code.replace(
  '<div className="space-y-1">\n                <div className="flex items-center justify-between gap-2">',
  originInputHtml + '<div className="space-y-1">\n                <div className="flex items-center justify-between gap-2">'
);

// 11. In Home screen summary card, add "Editar" button next to familiar
code = code.replace(
  `<p className="text-xs text-slate-300 mt-1">\n                Contacto familiar en casa: <strong className="text-cyan-300">{trip.familiarNombre} ({trip.familiarTelefono})</strong>\n              </p>`,
  `<div className="flex items-center justify-between gap-2 mt-1">
                <p className="text-xs text-slate-300">
                  Contacto familiar en casa: <strong className="text-cyan-300">{trip.familiarNombre} {trip.familiarTelefono ? \`(\${trip.familiarTelefono})\` : ''}</strong>
                </p>
                <button
                  type="button"
                  onClick={openEditFamiliarModal}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-[10px] font-bold flex items-center gap-1 transition cursor-pointer shrink-0"
                >
                  <Edit3 className="w-3 h-3" /> Editar
                </button>
              </div>`
);

// 12. In SOS modal, add "Editar Familiar" button on the card
code = code.replace(
  `{/* 2. CONTACTO FAMILIAR EN CASA */}\n              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">\n                <span className="text-slate-400 text-[10px] uppercase font-bold block flex items-center gap-1">\n                  <span>🏠</span> Contacto Familiar en Casa:\n                </span>`,
  `{/* 2. CONTACTO FAMILIAR EN CASA */}\n              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">\n                <div className="flex items-center justify-between mb-1">\n                  <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">\n                    <span>🏠</span> Contacto Familiar en Casa:\n                  </span>\n                  <button\n                    type="button"\n                    onClick={openEditFamiliarModal}\n                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"\n                  >\n                    <Edit3 className="w-3 h-3" /> Editar\n                  </button>\n                </div>`
);

// 13. In SALUD tab: Render 3 Emergency numbers (Ambulancia, Policía, Bomberos) and the editable Hospital card
const oldUrgenciasSection = `{/* Urgencias y Ambulancia */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-md">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Ambulancia y Hospital Cercano:</span>
              
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Ambulancia Oficial en {trip.pais}:</span>
                  <strong className="text-red-400 font-mono text-sm">{trip.salud.numeroAmbulanciaLocal}</strong>
                </div>
                <a
                  href={\`tel:\${trip.salud.numeroAmbulanciaLocal.replace(/[^0-9]/g, '')}\`}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-xs"
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

                {/* Botones de acción rápida */}
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {trip.salud.hospitalCercanoDireccion && (
                    <button
                      onClick={() => copyToClipboard(trip.salud.hospitalCercanoDireccion, 'dir_hospital')}
                      className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                    >
                      {copiedKey === 'dir_hospital' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{copiedKey === 'dir_hospital' ? '¡Dirección copiada!' : 'Copiar dirección para Uber / Waze'}</span>
                    </button>
                  )}
                  {trip.salud.hospitalCercanoTelefono && (
                    <a
                      href={\`tel:\${trip.salud.hospitalCercanoTelefono.replace(/[^0-9+]/g, '')}\`}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Llamar al Centro Médico</span>
                    </a>
                  )}
                </div>
              </div>
            </div>`;

const newUrgenciasSection = `{/* Urgencias Médicas, Policiales y Bomberos Oficiales */}
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
                    href={\`tel:\${(trip.salud.numeroAmbulanciaLocal || '112').replace(/[^0-9]/g, '')}\`}
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
                    href={\`tel:\${(trip.salud.numeroPoliciaLocal || '112').replace(/[^0-9]/g, '')}\`}
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
                    href={\`tel:\${(trip.salud.numeroBomberosLocal || '112').replace(/[^0-9]/g, '')}\`}
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
                          href={\`tel:\${trip.salud.hospitalCercanoTelefono.replace(/[^0-9+]/g, '')}\`}
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
            </div>`;

code = code.replace(oldUrgenciasSection, newUrgenciasSection);

// 14. Add the modals for editing Hospital and editing Familiar before closing modals section
const newModalsCode = `      {/* ========================================================================= */}
      {/* --- MODAL: EDITAR / REGISTRAR CENTRO MÉDICO O CLÍNICA CERCANA --- */}
      {/* ========================================================================= */}
      {isEditingHospitalModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-md w-full shadow-2xl relative text-xs my-6">
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
      )}

      {/* ========================================================================= */}
      {/* --- MODAL: EDITAR CONTACTO FAMILIAR EN CASA --- */}
      {/* ========================================================================= */}
      {isEditingFamiliarModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-md w-full shadow-2xl relative text-xs my-6">
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
      )}
`;

code = code.replace(
  '{/* ========================================================================= */}\n      {/* --- MODAL: REGISTRAR / EDITAR AGENCIA DE RETIRO DE DINERO (WESTERN UNION) --- */}',
  newModalsCode + '\n      {/* ========================================================================= */}\n      {/* --- MODAL: REGISTRAR / EDITAR AGENCIA DE RETIRO DE DINERO (WESTERN UNION) --- */}'
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('apply_user_list_fixes applied successfully. App.tsx length:', code.length);
