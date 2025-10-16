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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Chat Header */}
        <div className="bg-primary px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Chat Room</h2>
        </div>

        {/* Messages */}
        <div className="h-96 bg-white p-6 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-400">
              <div className="text-center">
                <svg
                  className="w-12 h-12 mx-auto mb-3 text-slate-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  ></path>
                </svg>
                <p className="text-sm">
                  No messages yet. Start a conversation!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.firstName === user.firstName
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      msg.firstName === user.firstName
                        ? "bg-primary text-white rounded-tr-sm"
                        : "bg-slate-100 text-slate-700 rounded-tl-sm"
                    }`}
                  >
                    <p className="text-xs font-medium mb-1 opacity-75">
                      {msg.firstName}
                    </p>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Box */}
        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-slate-400"
            />
            <button
              onClick={sendMessage}
              className="bg-primary hover:bg-blue-700 text-white p-3 rounded-xl transition-colors"
            >
              <MdSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatting;
