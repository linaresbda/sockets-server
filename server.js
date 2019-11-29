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

// Evento de conexión,
io.on('connect', (socket) => {
  let user = socket.handshake.query.user;
  if (!user) {
    console.log(`Connection refused: ${socket.id}`);
    socket.disconnect(true);
  } else {
    console.log(`Connection ok: ${socket.id}`);
    assignEvents(socket, user);
  }
})

// Asigna eventos al socket
const assignEvents = (socket, user) => {
  socket.on('request', (data) => {
    eventResponseOneToAll(data, user);
    // eventResponseOneToOne(data);
  });
}

// Respuestas
const eventResponseOneToAll = (data, user) => {
  io.sockets.emit('response', `${user}: ${data.message}`); // Emmit a todos los sockets
};
const eventResponseOneToOne = (data, user) => {
  io.to(data.id).emit('response', `1to1 - ${user}: ${data.message}`); // Emmit a Socket especifico
};