import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthIntroPage from "./pages/AuthIntroPage";
import ChatPage from "./pages/ChatPage";

const isAuthenticated = () => {
  return !!localStorage.getItem("token"); 
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthIntroPage />} />

        <Route
          path="/chat"
          element={
            isAuthenticated() ? <ChatPage /> : <Navigate to="/" replace />
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
