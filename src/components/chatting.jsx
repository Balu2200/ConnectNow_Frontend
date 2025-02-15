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
    <div className="w-full max-w-md h-[85vh] mt-3 mx-auto flex flex-col bg-gradient-to-r from-gray-900 to-black text-white shadow-lg rounded-xl overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-4 text-center font-semibold text-lg">
        Chat Room
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-800 scrollbar-thin scrollbar-thumb-gray-600">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl max-w-[80%] break-words shadow-md ${
              msg.firstName === user.firstName
                ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white ml-auto"
                : "bg-gray-700 text-white mr-auto"
            }`}
          >
            <p className="text-sm font-semibold">{msg.firstName}</p>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="flex items-center p-3 bg-gray-900 border-t border-gray-700">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-3 text-white bg-gray-800 rounded-lg focus:outline-none placeholder-gray-400"
        />
        <button
          onClick={sendMessage}
          className="ml-3 p-3 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full text-white hover:from-blue-600 hover:to-blue-800 transition"
        >
          <MdSend size={24} />
        </button>
      </div>
    </div>
  );
};

export default Chatting;
