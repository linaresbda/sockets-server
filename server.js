// dlinares - 28/Nov/2019
// Se inicia esta prueba de concepto WwebSockets
// Ejemplo de data que envia el cliente = {"id":"{{idSocket}}","message":"value"}

// Requerimientos
const express = require('express');
const socketio = require('socket.io');
const { getSocketByUser, pushSocket } = require('./Singleton');

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
    console.log(`Connection ok: ${socket.id} ${user}`);
    pushSocket({ id: socket.id, user });
    assignEvents(socket, user);
  }
})

// Asigna eventos al socket
const assignEvents = (socket, user) => {
  socket.on('request', (data) => {
    let recipient = data.recipient;
    if (!recipient || recipient == '') {
      eventResponseOneToAll(data, user);
    } else {
      eventResponseOneToOne(data, user, recipient);
    }
  });
}

// Respuestas

// Emmit a todos los sockets activos
const eventResponseOneToAll = (data, user) => {
  io.sockets.emit('response', `${user}: ${data.message}`); 
};

// Emmit a Socket destino
const eventResponseOneToOne = (data, user, recipient) => {
  let idSockerRecipient = getSocketByUser(recipient);
  if (idSockerRecipient) {
    io.to(idSockerRecipient.id).emit('response', `1to1 - ${user}: ${data.message}`); 
  } else {
    let idSockerUser = getSocketByUser(user);
    io.to(idSockerUser.id).emit('response', 'User is not available'); // Emmit a Socket de origen con error
  }
};