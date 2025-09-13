import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthIntroPage from "../src/pages/AuthIntroPage.jsx"
import ChatPage from "./pages/ChatPage.jsx";
import "./i18n.js";
import {io} from "socket.io-client";

const socket = io("http://localhost:8001")

export default function App() {
return <ChatPage />;
}
