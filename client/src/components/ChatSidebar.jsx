import { motion } from "framer-motion";
import { Users, LogOut, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateGroupModal from "./CreateGroupModal";
import Lottie from "lottie-react";
import chatAnimation from "../assets/animations/chat.json";

const langFlags = {
  en: "🇺🇸",
  hi: "🇮🇳",
  es: "🇪🇸",
  fr: "🇫🇷",
  zh: "🇨🇳",
};

export default function ChatSidebar({
  groups,
  activeGroup,
  setActiveGroup,
  users,
  currentUser,
  refreshGroups,
  setActiveRoom,
}) {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      {/* Sidebar */}
      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-screen w-100 bg-gradient-to-b from-purple-700 to-blue-600 text-white flex flex-col"
      >
        {/* Profile Header */}
        <div className="p-4 border-b border-white/20 flex items-center gap-3 bg-white/10 rounded-b-lg">
          <span className="text-2xl">{langFlags[currentUser?.lang] || "🌐"}</span>
          <div>
            <p className="font-bold">{currentUser?.username}</p>
            <small className="opacity-80">{currentUser?.lang?.toUpperCase()}</small>
          </div>
        </div>

        {/* Groups Section */}
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Groups</h2>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition"
            >
              <PlusCircle className="w-4 h-4 " /> New
            </button>
          </div>
          <ul className="space-y-2">
            {groups.map((group) => (
              <li
                key={group._id}
                onClick={() => {
                  setActiveGroup(group);
                  setActiveRoom({ type: "group", ...group });
                }}
                className={`cursor-pointer p-2 rounded-lg transition ${
                  activeGroup?._id === group._id
                    ? "bg-white/20 font-semibold"
                    : "hover:bg-white/10"
                }`}
              >
                👥 {group.name}
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
            {users
              .filter((u) => u.username !== currentUser.username) 
              .map((u) => (
                <li
                  key={u._id}
                  className="p-2 bg-white/10 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-400"></span>
                    {u.username}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm bg-white/20 px-2 py-1 rounded-lg">
                      {langFlags[u.lang] || "🌐"} {u.lang?.toUpperCase()}
                    </span>
                    <button
                      onClick={() => setActiveRoom({ type: "dm", user: u })}
                      className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 rounded-md"
                    >
                      💬
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>

        {/* Chat Animation */}
          <Lottie animationData={chatAnimation} loop={true} className="w-60 h-50" />

        {/* Logout */}
        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-white text-purple-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </motion.div>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(newGroup) => {
          refreshGroups();
          setActiveGroup(newGroup);
          setActiveRoom({ type: "group", ...newGroup });
        }}
        users={users}
      />
    </>
  );
}
