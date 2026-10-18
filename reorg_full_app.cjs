const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Rename tab in main condition
code = code.replace(
  "{activeTab === 'pasajes_seguro' && (",
  "{activeTab === 'pasajes' && ("
);

// 2. Extract the insurance block from Tab 1
const startInsuranceInTab1 = "{/* ========================================================================= */}\n            {/* --- SECCIÓN DEDICADA: ¿VIAJAS CON SEGURO DE VIAJE? --- */}";
const endInsuranceInTab1 = "          </div>\n        )}\n\n        {/* ========================================================================= */}\n        {/* --- PÁGINA 2: INFALTABLES & ARMARIO";

let insuranceBlock = "";
const iStart = code.indexOf("{/* --- SECCIÓN DEDICADA: ¿VIAJAS CON SEGURO DE VIAJE? --- */}");
const tab2Marker = "{/* --- PÁGINA 2: INFALTABLES & ARMARIO";

if (iStart !== -1 && code.indexOf(tab2Marker) !== -1) {
  const iEnd = code.lastIndexOf("</div>", code.indexOf(tab2Marker));
  // Look backwards for closing div of insurance section
  console.log("Found iStart at:", iStart);
}

