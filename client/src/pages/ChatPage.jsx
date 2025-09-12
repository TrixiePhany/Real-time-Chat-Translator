import ChatBox from "../components/ChatBox.jsx";
import InputBox from "../components/ InputBox.jsx";

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 text-center font-bold">
        🌍 Real-Time Chat Translator
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-4">
        <ChatBox />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <InputBox />
      </div>
    </div>
  );
}
