// dlinares - 28/Nov/2019
// Se inicia esta prueba de concepto WwebSockets
// Ejemplo de data que envia el cliente = {"id":"{{idSocket}}","message":"value"}
const express = require('express');
const socketio = require('socket.io');

const port = 80;

// configuramos servidor web
const app = express();
app.set("port", port);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb' }));
app.disable('x-powered-by');

// iniciamos servidor web
const server = app.listen(app.get('port'), () => {
  console.log(`server start on port ${app.get('port')}`);
});

// sockets
const io = socketio(server);
// Evento de conección,
io.on('connect', (socket) => {
  console.log("new connection socketId:", socket.id);
  //Events
  socket.on('request', (data) => {
    // console.log(data);
    eventResponse(data);
  });
})

const eventResponse = (data) => {
  // io.sockets.emit('response', `Response: ${data}`); // Emmit a todos los sockets
  io.to(data.id).emit('response', data.message); // Emmit a Socket especifico
}; 