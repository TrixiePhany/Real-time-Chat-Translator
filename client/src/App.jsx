import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthIntroPage from "./pages/AuthIntroPage";
import ChatPage from "./pages/ChatPage";

// helper: check if user logged in
const isAuthenticated = () => {
  return !!localStorage.getItem("token"); // true if JWT exists
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public: Login/Signup */}
        <Route path="/" element={<AuthIntroPage />} />

        {/* Protected: Chat Page */}
        <Route
          path="/chat"
          element={
            isAuthenticated() ? <ChatPage /> : <Navigate to="/" replace />
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
