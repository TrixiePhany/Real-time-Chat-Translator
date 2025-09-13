import { useState } from "react";
import ChatSidebar from "../components/ChatSidebar";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export default function ChatPage() {
  const [rooms] = useState(["General", "Tech", "Spanish", "French"]);
  const [activeRoom, setActiveRoom] = useState("General");
  const [users] = useState([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "You" },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, sender: "Alice", text: "Hello!", translated: "¡Hola!" },
    { id: 2, sender: "You", text: "Hi Alice!", translated: "¡Hola Alice!" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: "You",
      text: input,
      translated: input + " (translated)", // placeholder
    };
    setMessages([...messages, newMsg]);
    setInput("");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <ChatSidebar
        rooms={rooms}
        activeRoom={activeRoom}
        setActiveRoom={setActiveRoom}
        users={users}
      />

      {/* Chat Area */}
      <div className="flex flex-col flex-1 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 text-white">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-4 shadow-lg text-xl font-bold text-center bg-white/10 backdrop-blur-md"
        >
          {activeRoom} Room
        </motion.div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                msg.sender === "You" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-sm p-3 rounded-xl shadow-md ${
                  msg.sender === "You"
                    ? "bg-gradient-to-br from-blue-400 to-purple-500 text-white rounded-br-none"
                    : "bg-white/20 text-white rounded-bl-none"
                }`}
              >
                <p className="text-sm font-semibold">{msg.sender}</p>
                <p>{msg.text}</p>
                <p className="text-xs opacity-70 italic mt-1">
                  {msg.translated}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="p-4 flex gap-3 bg-white/10 backdrop-blur-md"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={sendMessage}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-blue-500 to-purple-700 rounded-lg font-semibold hover:opacity-90 transition"
          >
            <Send className="w-5 h-5" /> Send
          </button>
        </motion.div>
      </div>
    </div>
  );
}
