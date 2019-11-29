const _ = require('underscore');

class SingletonSockets {
  constructor() {
    if (!SingletonSockets.instance) {
      SingletonSockets.instance = new Sockets();
    }
  }

  getInstance() {
    return SingletonSockets.instance;
  }

  newInstance() {
    SingletonSockets.instance = new Sockets();
  }
}

class Sockets {
  constructor() {
    this._list;
  }

  get List() {
    return this._list || [];
  }

  set List(value) {
    return this._list = value;
  }
}

// Obtiene el socket del usuario solicitado
const getSocketByUser = (user) => {
  var sockets = new SingletonSockets().getInstance();
  let socket = _.find(sockets.List, ele => { return ele.user == user });
  return socket;
}

// Logica para reemplazar el ultimo socket por usuario
const pushSocket = (obj) => {
  var sockets = new SingletonSockets().getInstance();
  let index = _.findIndex(sockets.List, ele => { return ele.user == obj.user });
  if (index < 0) {
    sockets.List = [obj, ...sockets.List];
  } else {
    sockets.List[index] = obj;
  }
}

module.exports = { getSocketByUser, pushSocket };
