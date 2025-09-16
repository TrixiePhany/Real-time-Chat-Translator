import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import ChatSidebar from "../components/ChatSidebar";
import { socket } from "../socket";
import { getGroups, getAllUsers } from "../api";

export default function ChatPage() {
  const [groups, setGroups] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("chatUser")) || {
    username: "Guest",
    lang: "en",
  };

  // fetch groups
  const refreshGroups = async () => {
    try {
      const res = await getGroups();
      setGroups(res.data || []);
      if (!activeRoom && res.data.length > 0) {
        setActiveRoom({ type: "group", ...res.data[0] });
      }
    } catch (err) {
      console.error(" Failed to fetch groups:", err.message);
    }
  };

  // fetch all users
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await getAllUsers();
        setUsers(res.data || []);
      } catch (err) {
        console.error(" Failed to fetch users:", err);
      }
    }
    fetchUsers();
  }, []);

  // socket join
  useEffect(() => {
    if (!activeRoom) return;
    socket.connect();

    if (activeRoom.type === "group") {
      socket.emit("joinRoom", { room: activeRoom._id });
    } else if (activeRoom.type === "dm") {
      socket.emit("joinDirectRoom", {
        from: currentUser.username,
        to: activeRoom.user.username,
      });
    }

    const handleHistory = (history) => setMessages(history);
    const handleReceive = (msg) => setMessages((prev) => [...prev, msg]);

    socket.on("chatHistory", handleHistory);
    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("chatHistory", handleHistory);
      socket.off("receiveMessage", handleReceive);
      socket.disconnect();
    };
  }, [activeRoom]);

  // send message
  const sendMessage = () => {
    if (!input.trim() || !activeRoom) return;

    if (activeRoom.type === "group") {
      socket.emit("sendMessage", { text: input, room: activeRoom._id });
    } else if (activeRoom.type === "dm") {
      socket.emit("sendDM", {
        text: input,
        from: currentUser.username,
        to: activeRoom.user.username,
      });
    }

    setInput("");
  };

  useEffect(() => {
    refreshGroups();
  }, []);

  return (
    <div className="flex h-screen w-screen">
      <ChatSidebar
        groups={groups}
        users={users}
        activeGroup={activeRoom?.type === "group" ? activeRoom : null}
        setActiveGroup={(g) => setActiveRoom({ type: "group", ...g })}
        setActiveRoom={setActiveRoom}
        currentUser={currentUser}
        refreshGroups={refreshGroups}
      />

      <div className="flex flex-col flex-1 bg-indigo-500 text-white">
        {/* Header */}
        <motion.div className="p-4 shadow-lg text-xl font-bold text-center bg-white/10 backdrop-blur-md">
          {activeRoom
            ? activeRoom.type === "group"
              ? `${activeRoom.name} Room (${currentUser.lang.toUpperCase()})`
              : `DM with ${activeRoom.user?.username || "Unknown"}`
            : "Select a room or user"}
        </motion.div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <p className="text-center text-white/70 italic">
              No messages yet...
            </p>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === currentUser.username ? "justify-end" : "justify-start"
              }`}
            >
              <div className="max-w-sm p-3 rounded-xl shadow-md bg-white/20 text-white">
                <p className="text-sm font-semibold">{msg.sender}</p>
                <p>{msg.text}</p>
                {/* translated text only for groups */}
                {activeRoom.type === "group" && msg.translated && (
                  <p className="text-xs opacity-70 italic mt-1">{msg.translated}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        {activeRoom && (
          <div className="p-4 flex gap-3 bg-white/30 backdrop-blur-md">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                activeRoom.type === "group"
                  ? "Type a group message..."
                  : `Message ${activeRoom.user.username}`
              }
              className="flex-1 px-4 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-gradient-to-br from-blue-500 to-purple-700 rounded-lg font-semibold"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
