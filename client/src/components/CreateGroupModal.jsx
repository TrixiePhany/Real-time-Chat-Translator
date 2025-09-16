import { useState } from "react";
import { motion } from "framer-motion";

export default function CreateGroupModal({ isOpen, onClose, onSuccess, users }) {
  const [name, setName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleToggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8001/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          members: selectedUsers,
        }),
      });

      if (!res.ok) throw new Error("Failed to create group");
      const data = await res.json();

      onSuccess(data.group);
      onClose();
    } catch (err) {
      console.error("❌ Group creation failed:", err.message);
      alert("Error creating group");
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black rounded-lg shadow-lg w-96 p-6"
      >
        <h2 className="text-xl text-white font-bold mb-4">Create New Group</h2>
        <form onSubmit={handleSubmit} className="space-y-4 ">
          <input
            type="text"
            placeholder="Group Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />

          <div className="max-h-40 overflow-y-auto border text-white rounded-lg p-2">
            {users.map((u) => (
              <label
                key={u.id}
                className="flex items-center gap-2 p-1 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(u.id)}
                  onChange={() => handleToggleUser(u.id)}
                />
                {u.name}
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-500"
            >
              Create
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
