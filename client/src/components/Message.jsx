export default function Message({ text, sender }) {
  const isUser = sender === "You";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-lg max-w-xs ${
          isUser
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 text-black rounded-bl-none"
        }`}
      >
        <p className="text-sm">{sender}</p>
        <p>{text}</p>
      </div>
    </div>
  );
}
