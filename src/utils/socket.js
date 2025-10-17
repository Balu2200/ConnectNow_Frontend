import io from "socket.io-client";

// Socket.IO connects to the server root, not the API path
const SOCKET_URL = "https://connectnow-backend-zjl4.onrender.com";

export const createSocketConnection = () => {
  return io(SOCKET_URL, {
    withCredentials: true,
    transports: ["websocket", "polling"],
  });
};
