import { useParams, useNavigate } from "react-router-dom";
import { MdSend, MdArrowBack, MdMoreVert } from "react-icons/md";
import { useEffect, useState, useRef } from "react";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const Chatting = () => {
  const { targetUserId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline] = useState(true); // Can be enhanced with real online status
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!userId) return;

    socketRef.current = createSocketConnection();
    const socket = socketRef.current;

    socket.emit("joinChat", { userId, targetUserId });

    socket.on("messageReceived", ({ firstName, text }) => {
      const timestamp = new Date().toISOString();
      setMessages((prevMessages) => [
        ...prevMessages,
        { firstName, text, timestamp },
      ]);
      setIsTyping(false);
    });

    socket.on("userTyping", () => {
      setIsTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
    });

    return () => {
      socket.disconnect();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="h-screen flex flex-col max-w-5xl mx-auto">
        {/* Modern Chat Header */}
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <MdArrowBack size={24} className="text-slate-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-700 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                    {user?.firstName?.[0]?.toUpperCase() || "U"}
                  </div>
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-accent rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Chat Conversation
                  </h2>
                  <p className="text-sm text-slate-500 flex items-center">
                    {isOnline ? (
                      <>
                        <span className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></span>
                        Active now
                      </>
                    ) : (
                      "Offline"
                    )}
                  </p>
                </div>
              </div>
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <MdMoreVert size={24} className="text-slate-600" />
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-slate-50">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-primary"
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
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No messages yet
                </h3>
                <p className="text-slate-500 max-w-sm">
                  Start the conversation by sending a message below
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              <AnimatePresence>
                {messages.map((msg, index) => {
                  const isOwnMessage = msg.firstName === user.firstName;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${
                        isOwnMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex items-end space-x-2 max-w-lg ${
                          isOwnMessage ? "flex-row-reverse space-x-reverse" : ""
                        }`}
                      >
                        {/* Avatar */}
                        {!isOwnMessage && (
                          <div className="w-8 h-8 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center text-white text-sm font-medium mb-1">
                            {msg.firstName?.[0]?.toUpperCase() || "?"}
                          </div>
                        )}

                        {/* Message Bubble */}
                        <div className="flex flex-col">
                          <div
                            className={`px-4 py-3 rounded-2xl shadow-sm ${
                              isOwnMessage
                                ? "bg-gradient-to-br from-primary to-blue-700 text-white rounded-br-sm"
                                : "bg-white text-slate-800 border border-slate-200 rounded-bl-sm"
                            }`}
                          >
                            {!isOwnMessage && (
                              <p className="text-xs font-semibold mb-1 opacity-70">
                                {msg.firstName}
                              </p>
                            )}
                            <p className="text-sm leading-relaxed break-words">
                              {msg.text}
                            </p>
                          </div>
                          <span
                            className={`text-xs text-slate-400 mt-1 px-2 ${
                              isOwnMessage ? "text-right" : "text-left"
                            }`}
                          >
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>

                        {/* Avatar for own messages */}
                        {isOwnMessage && (
                          <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-700 rounded-full flex items-center justify-center text-white text-sm font-medium mb-1">
                            {msg.firstName?.[0]?.toUpperCase() || "?"}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-2 text-slate-500 text-sm mt-2"
            >
              <div className="flex space-x-1 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
                <div
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Modern Input Area */}
        <div className="bg-white border-t border-slate-200 px-6 py-4 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-slate-400 resize-none transition-all shadow-sm hover:border-slate-400"
                  style={{
                    minHeight: "48px",
                    maxHeight: "120px",
                  }}
                />
                <div className="absolute right-3 bottom-3 text-xs text-slate-400">
                  {newMessage.length > 0 && <span>{newMessage.length}</span>}
                </div>
              </div>
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-gradient-to-br from-primary to-blue-700 hover:from-blue-700 hover:to-primary text-white p-4 rounded-2xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md transform active:scale-95"
              >
                <MdSend size={22} />
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              Press{" "}
              <kbd className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-600 font-mono">
                Enter
              </kbd>{" "}
              to send •{" "}
              <kbd className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-600 font-mono">
                Shift+Enter
              </kbd>{" "}
              for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatting;
