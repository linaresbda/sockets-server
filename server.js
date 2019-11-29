// dlinares - 28/Nov/2019
// Se inicia esta prueba de concepto WwebSockets
// Ejemplo de data que envia el cliente = {"id":"{{idSocket}}","message":"value"}

// Requerimientos
const express = require('express');
const socketio = require('socket.io');

// Vars
const port = 80;

// Configuración servidor web (express)
const app = express();
app.set("port", port);

// Inicia servidor web (express)
const server = app.listen(app.get('port'), () => {
  console.log(`server start on port ${app.get('port')}`);
});

// Inicia Sockets
const io = socketio(server);

// Evento de conección,
io.on('connect', (socket) => {
  console.log("new connection socketId:", socket.id);
  assignEvents(socket);
})

// Asigna eventos al socket
const assignEvents = (socket) => {
  socket.on('request', (data) => {
    eventResponseOneToAll(data);
    eventResponseOneToOne(data);
  });
}

// Respuestas
const eventResponseOneToAll = (data) => {
  io.sockets.emit('response', `Response: ${data.message}`); // Emmit a todos los sockets
};
const eventResponseOneToOne = (data) => {
  io.to(data.id).emit('response', `Response: ${data.message}`); // Emmit a Socket especifico
};