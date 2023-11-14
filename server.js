const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http); // Si deseas usar Socket.IO para enviar datos a tu aplicación web en tiempo real

// MQTT
const mqtt = require('mqtt');
const mqttClient = mqtt.connect('mqtt://mqtt-dashboard.com'); // Cambia la URL si es necesario

// Cuando el cliente MQTT se conecta
mqttClient.on('connect', () => {
  console.log('Conectado al servidor MQTT');
  // Suscríbete a los temas de temperatura y humedad
  mqttClient.subscribe('t/esp32');
  mqttClient.subscribe('h/esp32');
});

// Cuando se recibe un mensaje MQTT
mqttClient.on('message', (topic, message) => {
  // Envía los datos a tu aplicación web (puedes usar Socket.IO, Express, u otros métodos aquí)
  // Por ejemplo, con Socket.IO:
  io.emit('mqttData', { topic, message: message.toString() });
});
// Configura una ruta para el archivo CSS
app.get('/styles.css', (req, res) => {
  res.sendFile(__dirname + '/styles.css');
});

// Configura una ruta para tu aplicación web si deseas mostrar los datos en una página web
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // Crea un archivo HTML para mostrar los datos
});

// En el servidor Node.js
io.on('connection', (socket) => {
  // Cuando se recibe el evento para encender el foco
  socket.on('encenderFoco', (message) => {
    mqttClient.publish('led/esp32', message); // Enviar el mensaje MQTT al dispositivo Arduino
  });

  // Cuando se recibe el evento para apagar el foco
  socket.on('apagarFoco', (message) => {
    mqttClient.publish('led/esp32', message); // Enviar el mensaje MQTT al dispositivo Arduino
  });
});



// Inicia el servidor HTTP
const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`Servidor Node.js en funcionamiento en el puerto ${port}`);
});