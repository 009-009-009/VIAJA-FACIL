const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update activeTab type and default
code = code.replace(
  "const [activeTab, setActiveTab] = useState<'pasajes_seguro' | 'equipaje' | 'moverte' | 'salud'>('pasajes_seguro');",
  "const [activeTab, setActiveTab] = useState<'pasajes' | 'equipaje' | 'moverte' | 'salud' | 'tips'>('pasajes');"
);

// 2. In openEditInsuranceModal: do not force Assist Card
code = code.replace(
  "compania: trip.salud.seguroCompania || 'Assist Card',",
  "compania: trip.salud.seguroCompania || '',"
);

// In DEFAULT_TRIP:
code = code.replace(
  "seguroCompania: 'Seguro de Viaje Internacional',",
  "seguroCompania: 'Seguro de Viaje', // 100% editable por el usuario"
);

// 3. Update the Top Nav Bar
const topNavOldRegex = /<nav className="max-w-2xl mx-auto grid grid-cols-4 gap-1 w-full" aria-label="Navegación principal">[\s\S]*?<\/nav>/;
const topNavNew = `<nav className="max-w-2xl mx-auto grid grid-cols-5 gap-1 w-full" aria-label="Navegación principal">
            <button
              onClick={() => setActiveTab('pasajes')}
              className={\`py-1.5 px-0.5 rounded-xl text-[10px] sm:text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 w-full cursor-pointer \${
                activeTab === 'pasajes'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }\`}
            >
              <Plane className="w-4 h-4 shrink-0" />
              <span className="truncate w-full text-center">1. Pasajes</span>
            </button>

            <button
              onClick={() => setActiveTab('equipaje')}
              className={\`py-1.5 px-0.5 rounded-xl text-[10px] sm:text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 w-full cursor-pointer \${
                activeTab === 'equipaje'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }\`}
            >
              <Luggage className="w-4 h-4 shrink-0 text-amber-300" />
              <span className="truncate w-full text-center">2. Equipaje</span>
            </button>

            <button
              onClick={() => setActiveTab('moverte')}
              className={\`py-1.5 px-0.5 rounded-xl text-[10px] sm:text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 w-full cursor-pointer \${
                activeTab === 'moverte'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }\`}
            >
              <Car className="w-4 h-4 shrink-0 text-cyan-300" />
              <span className="truncate w-full text-center">3. Moverte</span>
            </button>

            <button
              onClick={() => setActiveTab('salud')}
              className={\`py-1.5 px-0.5 rounded-xl text-[10px] sm:text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 w-full cursor-pointer \${
                activeTab === 'salud'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }\`}
            >
              <Stethoscope className="w-4 h-4 shrink-0 text-emerald-400" />
              <span className="truncate w-full text-center">4. Salud</span>
            </button>

            <button
              onClick={() => setActiveTab('tips')}
              className={\`py-1.5 px-0.5 rounded-xl text-[10px] sm:text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 w-full cursor-pointer \${
                activeTab === 'tips'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                  : 'text-amber-300 hover:text-white hover:bg-slate-900/60'
              }\`}
            >
              <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
              <span className="truncate w-full text-center">5. Reglas Oro</span>
            </button>
          </nav>`;

code = code.replace(topNavOldRegex, topNavNew);
console.log("Top nav updated.");

// 4. Update the Bottom Mobile Nav Bar
const botNavOldRegex = /<nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950\/95 backdrop-blur-md border-t border-slate-800 px-2 py-1\.5 shadow-2xl">[\s\S]*?<\/nav>/;
const botNavNew = `<nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-1.5 py-1.5 shadow-2xl">
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          <button
            onClick={() => {
              setActiveTab('pasajes');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={\`py-1.5 px-0.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 \${
              activeTab === 'pasajes'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }\`}
          >
            <Plane className="w-4 h-4" />
            <span className="truncate">1. Pasajes</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('equipaje');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={\`py-1.5 px-0.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 \${
              activeTab === 'equipaje'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }\`}
          >
            <Luggage className="w-4 h-4 text-amber-300" />
            <span className="truncate">2. Equipaje</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('moverte');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={\`py-1.5 px-0.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 \${
              activeTab === 'moverte'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }\`}
          >
            <Car className="w-4 h-4 text-cyan-300" />
            <span className="truncate">3. Moverte</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('salud');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={\`py-1.5 px-0.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 \${
              activeTab === 'salud'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }\`}
          >
            <Stethoscope className="w-4 h-4 text-emerald-400" />
            <span className="truncate">4. Salud</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('tips');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={\`py-1.5 px-0.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 \${
              activeTab === 'tips'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'text-amber-300 hover:text-white'
            }\`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="truncate">5. Reglas Oro</span>
          </button>
        </div>
      </nav>`;

code = code.replace(botNavOldRegex, botNavNew);
console.log("Bottom mobile nav updated.");

fs.writeFileSync('src/App.tsx', code, 'utf8');
