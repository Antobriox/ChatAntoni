import './App.css';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import { LiMensaje, UlMensajes } from './ui-components';

const socket = io('http://localhost:3000');

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    socket.on('connectado', () => setIsConnected(true));

    socket.on('mensaje_enviar', (data) => {
      setMensajes((mensajes) => [...mensajes, data]);
    });

    return () => {
      socket.off('connectado');
      socket.off('mensaje_enviar');
    };
  }, []);

  const enviarMensaje = () => {
    socket.emit('mensaje_enviar', {
      usuario: nombreUsuario,
      mensaje: nuevoMensaje,
    });
  };

  const unirseAlChat = () => {
    socket.emit('unirse_al_chat', nombreUsuario);
    setIsConnected(true);
  };

  return (
    <div className="App">
      <div className="App-container">
        <div className="App-header">{isConnected ? 'SI ESTAS CONECTADO' : 'NO ESTAS CONECTADO'}</div>
        <div className="App-content">
          <UlMensajes>
            {mensajes.map((mensaje, index) => (
              <LiMensaje key={index}>
                {mensaje.usuario}: {mensaje.mensaje}
              </LiMensaje>
            ))}
          </UlMensajes>
        </div>
        <div className="App-footer">
          {isConnected ? (
            <>
              <input type="text" onChange={(e) => setNuevoMensaje(e.target.value)} />
              <button onClick={enviarMensaje}>Enviar</button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Ingrese su nombre"
                onChange={(e) => setNombreUsuario(e.target.value)}
              />
              <button onClick={unirseAlChat}>Unirse al chat</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
