import { useParams } from "react-router-dom";
import { MdSend } from "react-icons/md";
import { useEffect, useState, useRef } from "react";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";

const Chatting = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const socketRef = useRef(null); 

  useEffect(() => {
    if (!userId) return;

    socketRef.current = createSocketConnection();
    const socket = socketRef.current;

    socket.emit("joinChat", { userId, targetUserId });

 
    socket.on("messageReceived", ({ firstName, text }) => {
      setMessages((prevMessages) => [...prevMessages, { firstName, text }]);
    });

  
    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return; 
    socketRef.current.emit("sendMessage", {
      firstName: user.firstName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  return (
    <div className="w-full max-w-2xl h-[85vh] mt-3 mx-auto flex flex-col bg-gray-900 text-white shadow-lg rounded-xl overflow-hidden">
      <div className="bg-gray-800 p-4 text-center font-semibold text-lg">
        Chat Room
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-500">
        {messages.map((msg, index) => (
          <div key={index} className="chat chat-start">
            <div className="chat-header">
              {msg.firstName}
              <time className="text-xs opacity-50 p-2">2 hours ago</time>
            </div>
            <div className="chat-bubble">{msg.text}</div>
            <div className="chat-footer opacity-50 text-white">Seen</div>
          </div>
        ))}
      </div>

      <div className="flex items-center p-3 bg-gray-800 border-t border-gray-700">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-3 text-white bg-gray-700 rounded-lg focus:outline-none placeholder-gray-400"
        />
        <button
          onClick={sendMessage}
          className="ml-3 p-3 bg-teal-500 rounded-full text-white hover:bg-teal-600 transition"
        >
          <MdSend size={24} />
        </button>
      </div>
    </div>
  );
};

export default Chatting;
