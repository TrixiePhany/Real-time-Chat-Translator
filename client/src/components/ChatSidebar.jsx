import { motion } from "framer-motion";
import { Users, Hash } from "lucide-react";

const langFlags = {
  en: "🇺🇸", // English
  hi: "🇮🇳", // Hindi
  es: "🇪🇸", // Spanish
  fr: "🇫🇷", // French
  zh: "🇨🇳", // Chinese
};

export default function ChatSidebar({ rooms, activeRoom, setActiveRoom, users }) {
  return (
    <motion.div
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen w-64 bg-gradient-to-b from-purple-700 to-blue-600 text-white flex flex-col"
    >
      {/* Rooms Section */}
      <div className="p-4 border-b border-white/20">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Hash className="w-5 h-5" /> Rooms
        </h2>
        <ul className="space-y-2">
          {rooms.map((room) => (
            <li
              key={room}
              onClick={() => setActiveRoom(room)}
              className={`cursor-pointer p-2 rounded-lg transition ${
                activeRoom === room
                  ? "bg-white/20 font-semibold"
                  : "hover:bg-white/10"
              }`}
            >
              #{room}
            </li>
          ))}
        </ul>
      </div>

      {/* Users Section */}
      <div className="p-4 flex-1 overflow-y-auto">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Users className="w-5 h-5" /> Users
        </h2>
        <ul className="space-y-2">
          {users.map((user) => (
            <li
              key={user.id}
              className="p-2 bg-white/10 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-400"></span>
                {user.name}
              </div>
              <span className="text-sm flex items-center gap-1 bg-white/20 px-2 py-1 rounded-lg">
                {langFlags[user.lang] || "🌐"} {user.lang.toUpperCase()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
