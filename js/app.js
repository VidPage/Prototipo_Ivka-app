const turnstiles = [

  {
    id:"TRN-001",
    name:"Centro Histórico",
    address:"Av Juárez CDMX",
    lat:19.4326,
    lng:-99.1332,
    status:"En línea",
    fare:5,
    time:15,
    passes:342,
    earnings:1710
  },

  {
    id:"TRN-002",
    name:"Condesa",
    address:"Av Michoacán",
    lat:19.4105,
    lng:-99.1710,
    status:"En línea",
    fare:6,
    time:20,
    passes:289,
    earnings:1734
  },

  {
    id:"TRN-003",
    name:"Polanco",
    address:"Masaryk",
    lat:19.4330,
    lng:-99.1900,
    status:"Mantenimiento",
    fare:5,
    time:12,
    passes:156,
    earnings:780
  },

  {
    id:"TRN-004",
    name:"Chapultepec",
    address:"Bosque Chapultepec",
    lat:19.4205,
    lng:-99.1819,
    status:"Fuera de línea",
    fare:4,
    time:10,
    passes:0,
    earnings:0
  }

];

/* CLOCK */

function updateClock(){

  const now = new Date();

  document.getElementById("date").innerHTML =
    now.toLocaleDateString("es-MX",{
      weekday:"long",
      day:"numeric",
      month:"long"
    });

  document.getElementById("time").innerHTML =
    now.toLocaleTimeString("es-MX");
}

setInterval(updateClock,1000);

updateClock();

/* METRICS */

const totalEarnings =
  turnstiles.reduce((a,b)=>a+b.earnings,0);

const totalPasses =
  turnstiles.reduce((a,b)=>a+b.passes,0);

document.getElementById("earnings")
.innerHTML = `$${totalEarnings}`;

document.getElementById("passes").innerHTML = totalPasses;

document.getElementById("activeTurnstiles").innerHTML = turnstiles.filter(t=>t.status==="En línea").length + "/" + turnstiles.length;

document.getElementById("avgFare")
.innerHTML =
`$${(
  turnstiles.reduce((a,b)=>a+b.fare,0)
  / turnstiles.length
).toFixed(2)}`;

/* TURNSTILES */

const list =
document.getElementById("turnstileList");

turnstiles.forEach(item=>{

  const color =
    item.status==="En línea"
    ? "#22c55e"
    : item.status==="Mantenimiento"
    ? "#f59e0b"
    : "#ef4444";

  list.innerHTML += `

  <div class="turnstile">

    <div class="turnstile-top">

      <div>

        <h4>${item.name}</h4>

        <span>${item.address}</span>

        <div class="status">

          <div class="status-dot"
          style="background:${color}">
          </div>

          ${item.status}

        </div>

      </div>

        <button class="config-btn"
            onclick="openModal('${item.id}')">
            <i class="fa-solid fa-gear"></i>
        </button>

    </div>

    <div class="turnstile-bottom">

      <div>
        <small>Pasos</small>
        <h4>${item.passes}</h4>
      </div>

      <div>
        <small>Ganancias</small>
        <h4>$${item.earnings}</h4>
      </div>

      <div>
        <small>Tiempo</small>
        <h4>${item.time}s</h4>
      </div>

    </div>

  </div>
  `;
});

/* MAP */

const map = L.map('map')
.setView([19.4326,-99.1332],11);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution:'© OpenStreetMap'
  }
).addTo(map);

turnstiles.forEach(item=>{

  const color =
    item.status==="En línea"
    ? "green"
    : item.status==="Mantenimiento"
    ? "orange"
    : "red";

  const marker = L.circleMarker(
    [item.lat,item.lng],
    {
      radius:10,
      fillColor:color,
      color:"#fff",
      weight:3,
      fillOpacity:1
    }
  ).addTo(map);

  marker.bindPopup(`
  
    <div>

      <div class="popup-title">
        ${item.name}
      </div>

      <div>
        ${item.address}
      </div>

      <div class="popup-status">

        <div class="popup-dot"
        style="background:${color}">
        </div>

        ${item.status}

      </div>

      <hr>

      <strong>Ganancias:</strong>
      $${item.earnings}

      <br>

      <strong>Pasos:</strong>
      ${item.passes}

    </div>
  
  `);
});

/* CHARTS */

new Chart(
  document.getElementById("earningsChart"),
  {
    type:"line",

    data:{
      labels:["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"],

      datasets:[{
        label:"Ganancias",

        data:[4200,3800,5100,4600,6800,7200,5900],

        borderColor:"#314270",

        backgroundColor:"rgba(49,66,112,.2)",

        tension:.4,

        fill:true
      }]
    }
  }
);

new Chart(
  document.getElementById("passesChart"),
  {
    type:"bar",

    data:{
      labels:["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"],

      datasets:[{
        label:"Pasos",

        data:[892,756,1024,934,1358,1456,1187],

        backgroundColor:"#3b82f6",

        borderRadius:12
      }]
    }
  }
);

/* MODAL */

const modal =
document.getElementById("configModal");

function openModal(id){

  const data = turnstiles.find(t => t.id === id);
  if(!data) return;

  modal.classList.remove("hidden");

  document.getElementById("modalTitle").innerText = data.name;

  document.getElementById("fareInput").value = data.fare;
  document.getElementById("timeInput").value = data.time;

  document.getElementById("deviceId").innerText = data.id;
  document.getElementById("deviceStatus").innerText = data.status;
  document.getElementById("deviceAddress").innerText = data.address;
  document.getElementById("deviceCoords").innerText =
    `${data.lat}, ${data.lng}`;
}


document.getElementById("closeModal")
.addEventListener("click",()=>{

  modal.classList.add("hidden");
});

document.getElementById("cancelModal")
.addEventListener("click",()=>{

  modal.classList.add("hidden");
});

/* SIDEBAR */

const menuLinks =
document.querySelectorAll(".menu a");

menuLinks.forEach(link=>{

  link.addEventListener("click",(e)=>{

    e.preventDefault();

    menuLinks.forEach(l=>
      l.classList.remove("active")
    );

    link.classList.add("active");

    const section =
      document.getElementById(
        link.dataset.section
      );

    section.scrollIntoView({
      behavior:"smooth"
    });

  });

});

/* TOAST */

function showToast(type,title,message){

  const toast =
  document.createElement("div");

  toast.className =
  `toast ${type}`;

  toast.innerHTML = `

    <i class="
      fa-solid
      ${type === "success"
      ? "fa-circle-check"
      : "fa-circle-xmark"}
    "></i>

    <div>

      <h4>${title}</h4>

      <p>${message}</p>

    </div>
  `;

  document.body.appendChild(toast);

  setTimeout(()=>{

    toast.remove();

  },3500);
}

/* DIAGNOSTIC */

function runDiagnostic(){

  showToast(
    "success",
    "Diagnóstico completado",
    "Todos los sensores funcionan correctamente."
  );
}

/* SYNC */

function syncDate(){

  showToast(
    "success",
    "Sincronización exitosa",
    "La fecha y hora fueron actualizadas correctamente."
  );
}

/* RESET */

function resetCounters(){

  showToast(
    "success",
    "Contadores reiniciados",
    "Las métricas del torniquete fueron restablecidas."
  );
}

/* SAVE */

document.querySelector(".save")
.addEventListener("click",()=>{

  showToast(
    "success",
    "Configuración guardada",
    "Los cambios fueron aplicados correctamente."
  );

  modal.classList.add("hidden");
});

/* INDIVIDUAL METRICS */

const metricsContainer =
document.getElementById(
  "individualMetrics"
);

turnstiles.forEach(item=>{

  const avgHour =
    Math.round(item.passes / 12);

  const efficiency =
    item.status === "En línea"
    ? 98
    : item.status === "Mantenimiento"
    ? 65
    : 0;

  const incomePerPass =
    item.passes > 0
    ? (item.earnings / item.passes)
      .toFixed(2)
    : "0.00";

  const statusColor =
    item.status === "En línea"
    ? "#22c55e"
    : item.status === "Mantenimiento"
    ? "#f59e0b"
    : "#ef4444";

  metricsContainer.innerHTML += `

    <div class="individual-card">

      <!-- HEADER -->

      <div class="individual-header">
        <div>
          <h2>${item.name}</h2>
          <p>${item.address}</p>
          <span>
            ID: ${item.id}
          </span>
        </div>
        
        <div class="header-right">
             <button class="config-btn"
                onclick="openModal('${item.id}')">
                <i class="fa-solid fa-gear"></i>
            </button>
            <div class="individual-status">
                <div
                    class="individual-status-dot"
                    style="background:${statusColor}">
                    </div>
                ${item.status}
                </div>
        </div>
      </div>

      <!-- BODY -->

      <div class="individual-body">

        <!-- TOP -->

        <div class="metrics-mini-grid">

          <div class="metric-mini green-soft">

            <i class="fa-solid fa-dollar-sign"></i>

            <h2>
              $${item.earnings}
            </h2>

            <p>
              Ganancias Hoy
            </p>

          </div>

          <div class="metric-mini blue-soft">

            <i class="fa-solid fa-users"></i>

            <h2>
              ${item.passes}
            </h2>

            <p>
              Pasos Totales
            </p>

          </div>

          <div class="metric-mini purple-soft">

            <i class="fa-solid fa-chart-line"></i>

            <h2>
              ${avgHour}
            </h2>

            <p>
              Promedio/Hora
            </p>

          </div>

          <div class="metric-mini orange-soft">

            <i class="fa-solid fa-clock"></i>

            <h2>
              ${item.time}s
            </h2>

            <p>
              Tiempo de Paso
            </p>

          </div>

        </div>

        <!-- BOTTOM -->

        <div class="bottom-stats">

          <div class="bottom-stat">

            <span>
              Tarifa Actual
            </span>

            <strong>
              $${item.fare}
            </strong>

          </div>

          <div class="bottom-stat">

            <span>
              Eficiencia
            </span>

            <strong>
              ${efficiency}%
            </strong>

          </div>

          <div class="bottom-stat">

            <span>
              Ingresos/Paso
            </span>

            <strong>
              $${incomePerPass}
            </strong>

          </div>

        </div>

      </div>

    </div>
  `;
});

// SIDEBAR COLLAPSE INIT
// SIDEBAR COLLAPSE SOLO DESKTOP
if(window.innerWidth > 700){
  document.body.classList.add("sidebar-collapsed");
}