const numeroRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function fetchSensorData(callback) {
  setTimeout(() => {
    const info = {
      temperatura: numeroRandom(20, 50),
      humedad: numeroRandom(30, 90),
      presion: numeroRandom(900, 1100)
    };
    callback(info);
  }, 1000);
}

function GuardarBaseDatos(info, callback) {
  localStorage.setItem("sensorData", JSON.stringify(info));
  callback("Datos guardados correctamente"); 
}

function triggerAlert(message, value) {
  const alertBox = document.getElementById("alert-box");
  const msg = document.getElementById("alert-message");

  msg.textContent = message;

  if (value > 40){
    alertBox.classList.remove("hidden");

    const alertEvent = new CustomEvent("sensorAlert", { detail: message });
    document.dispatchEvent(alertEvent);

    setTimeout(() => {
        alertBox.classList.add("hidden");
    }, 5000);
  }
  
}

function actualizarTemperatura(value) {
  document.querySelector('#temp-sensor .value').textContent = `${value} °C`;
  if (value > 40) {
    triggerAlert(`Temperatura alta: ${value} °C`, value);
  }else {
    triggerAlert("")
  }
}

function actualizarHumedad(value) {
  document.querySelector('#humedad-sensor .value').textContent = `${value} %`;
}

function actualizarPresion(value) {
  document.querySelector('#presion-sensor .value').textContent = `${value} hPa`;
}

document.addEventListener("dataReceived", (e) => {
  console.log("📡 Nuevos datos recibidos:", e.detail);
});

document.addEventListener("sensorAlert", (e) => {
  console.warn("🚨 Alerta del sensor:", e.detail);
});

function actualizarSensores() {
  fetchSensorData((info) => {
    const infoEvent = new CustomEvent("dataReceived", { detail: info });
    document.dispatchEvent(infoEvent);

    handleSensor("temperatura", info.temperatura, actualizarTemperatura);
    handleSensor("humedad", info.humedad, actualizarHumedad);
    handleSensor("presion", info.presion, actualizarPresion);

    GuardarBaseDatos(info, (msg) => {
      console.log(msg);
    });
  });
}

function handleSensor(type, value, callback) {
  console.log(`📊 Sensor ${type}: ${value}`);
  callback(value);
}

setInterval(actualizarSensores, 5000);
actualizarSensores(); 