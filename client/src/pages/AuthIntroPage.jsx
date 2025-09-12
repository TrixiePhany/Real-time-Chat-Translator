import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function AuthIntroPage() {
  const { t, i18n } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", username: "", lang: "en" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setForm({ ...form, lang });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isLogin ? "Login" : "Signup", form);
  };

  return (
    <div className="flex h-screen">
      {/* Left*/}
      <motion.div 
        initial={{ x: -100, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        transition={{ duration: 0.6 }}
        className="w-1/2 flex flex-col justify-center items-center bg-white shadow-lg p-8 relative"
      >
        <div className="absolute bg-gradient-to-br from-blue-500 to-purple-700 rounded-50% top-4 right-4">
          <select
            value={form.lang}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className=" p-2 text-bold"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="zh">中文</option>
          </select>
        </div>

        <h1 className="text-3xl text-blue-500 font-bold mb-6">{isLogin ? t("login") : t("signup")}</h1>
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

          <button type="submit" className="w-full bg-gradient-to-br from-blue-500 to-purple-700 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition">
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

      {/* Right*/}
      <motion.div 
        initial={{ x: 100, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        transition={{ duration: 0.6 }}
        className="w-1/2 flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-purple-700 text-white p-12"
      >
        <h1 className="text-4xl font-bold text-center p-10 mb-6">{t("welcome")}</h1>
        <p className="text-lg max-w-md text-center leading-relaxed">{t("intro")}</p>
      </motion.div>
    </div>
  );
}
