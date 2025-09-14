import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import ChatSidebar from "../components/ChatSidebar";
import { socket } from "../socket";

export default function ChatPage() {
  const [rooms] = useState(["General", "Tech", "Spanish", "French"]);
  const [activeRoom, setActiveRoom] = useState("General");
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  //  user info localStorage
  const user = JSON.parse(localStorage.getItem("chatUser")) || {
    username: "Guest",
    lang: "en",
  };

useEffect(() => {
  socket.connect();

  socket.emit("joinRoom", { room: activeRoom });

  const handleHistory = (history) => setMessages(history);
  const handleReceive = (msg) => setMessages((prev) => [...prev, msg]);
  const handleUsers = (roomUsers) => setUsers(roomUsers);

  socket.on("chatHistory", handleHistory);
  socket.on("receiveMessage", handleReceive);
  socket.on("roomUsers", handleUsers);

  return () => {
    socket.off("chatHistory", handleHistory);
    socket.off("receiveMessage", handleReceive);
    socket.off("roomUsers", handleUsers);
    socket.disconnect();
  };
}, [activeRoom]);


const sendMessage = () => {
  if (!input.trim()) return;
  socket.emit("sendMessage", { text: input, room: activeRoom });
  setInput("");
};

  return (
    <div className="flex h-screen">
      <ChatSidebar rooms={rooms} activeRoom={activeRoom} setActiveRoom={setActiveRoom} users={users} />
      <div className="flex flex-col flex-1 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 text-white">
        {/* Header */}
        <motion.div className="p-4 shadow-lg text-xl font-bold text-center bg-white/10 backdrop-blur-md">
          {activeRoom} Room ({user.lang.toUpperCase()})
        </motion.div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === user.username ? "justify-end" : "justify-start"}`}>
              <div className="max-w-sm p-3 rounded-xl shadow-md bg-white/20 text-white">
                <p className="text-sm font-semibold">{msg.sender}</p>
                <p>{msg.text}</p>
                <p className="text-xs opacity-70 italic mt-1">{msg.translated}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 flex gap-3 bg-white/10 backdrop-blur-md">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button onClick={sendMessage} className="px-4 py-2 bg-gradient-to-br from-blue-500 to-purple-700 rounded-lg font-semibold">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
