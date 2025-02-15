import { useParams } from "react-router-dom";
import { MdSend } from "react-icons/md";
import { useState } from "react";

const Chatting = () => {

  const { targetUserId } = useParams();
  const[messages, setMessages] = useState([{text:"hello"}]);
  


  return (
    <div className="w-full max-w-2xl h-screen mt-3 mx-auto flex flex-col bg-gray-900 text-white shadow-lg rounded-xl overflow-hidden">
      <div className="bg-gray-800 p-4 text-center font-semibold text-lg">
        Chat Room
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-700">
        {messages.map((msg,index) =>{
          return (
            <div key={index} className="chat chat-start">
              <div className="chat-header"> 
                Vasu pasumarthi
                <time className="text-xs opacity-50 p-2">2 hours ago</time>
              </div>
              <div className="chat-bubble">{msg.text}</div>
              <div className="chat-footer opacity-50">Seen</div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center p-3 bg-gray-800 border-t border-gray-700">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 p-3 text-white bg-gray-700 rounded-lg focus:outline-none placeholder-gray-400"
        />
        <button className="ml-3 p-3 bg-teal-500 rounded-full text-white hover:bg-teal-600 transition">
          <MdSend size={24} />
        </button>
      </div>
    </div>
  );
};

export default Chatting;
