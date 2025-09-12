import { useState } from "react";

export default function InputBox() {
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim()) {
      console.log("Send:", input);
      setInput("");
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 border rounded-lg px-4 py-2 focus:outline-none"
        placeholder="Type a message..."
      />
      <button
        onClick={sendMessage}
        className="bg-blue-600 text-white px-4 rounded-lg"
      >
        Send
      </button>
    </div>
  );
}
