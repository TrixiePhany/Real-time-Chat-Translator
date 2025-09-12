import { useState } from "react";
import Message from "./Message";

export default function ChatBox() {
  const [messages] = useState([
    { id: 1, text: "Hello!", sender: "Alice" },
    { id: 2, text: "¡Hola!", sender: "Bob" },
  ]);

  return (
    <div className="space-y-2">
      {messages.map((msg) => (
        <Message key={msg.id} text={msg.text} sender={msg.sender} />
      ))}
    </div>
  );
}
