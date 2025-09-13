import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import worldAnimation from "../assets/animations/world.json"; 

export default function AuthIntroPage() {
  const { t, i18n } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", username: "", lang: "en" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setForm({ ...form, lang });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isLogin ? "Login" : "Signup", form);
  };

  return (
    <div className="flex overflow-x-hidden h-screen">
      {/* Left: Auth */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        transition={{ duration: 0.6 }}
        className="w-1/2 flex flex-col justify-center items-center bg-white shadow-lg p-20 relative"
      >
        {/* Language Selector */}
        <div className="absolute top-4 bg-gradient-to-br from-blue-500 to-purple-700 text-bold right-4">
          <select
            value={form.lang}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="zh">中文</option>
          </select>
        </div>

        <h1 className="text-3xl text-blue-500 font-bold mb-6">
          {isLogin ? t("login") : t("signup")}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 text-black w-3/4">
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder={t("username")}
              value={form.username}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder={t("email")}
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder={t("password")}
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-br from-blue-500 to-purple-700 text-white p-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            {isLogin ? t("login") : t("signup")}
          </button>
        </form>
        <p
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 text-xl mt-6 cursor-pointer hover:underline"
        >
          {isLogin ? t("signup") : t("login")}?
        </p>
      </motion.div>

      {/* Right: Intro with Lottie */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        transition={{ duration: 0.6 }}
        className="w-dvw flex flex-col justify-center items-left bg-gradient-to-br from-blue-500 to-purple-700 text-white  "
      >
        {/* World Animation */}
        <div className="w-dvh h-dvw align-left ">
          <Lottie animationData={worldAnimation} loop={true} />
        </div>

        <h1 className="text-7xl max-w-3xl font-bold text-left p-4 drop-shadow-lg">
          {t("welcome")}
        </h1>
        <p className="text-lg  p-5 text-left opacity-90 leading-relaxed">
          {t("intro")}
        </p>
      </motion.div>
    </div>
  );
}
