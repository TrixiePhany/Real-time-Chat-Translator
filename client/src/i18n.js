import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        welcome: "Welcome to Real-time Chat Translator",
        intro: "Chat with anyone, anywhere — in your language.",
        login: "Login",
        signup: "Sign Up",
        email: "Email",
        password: "Password",
        username: "Username",
        language: "Preferred Language",
      },
    },
    hi: {
      translation: {
        welcome: "रीयल-टाइम चैट ट्रांसलेटर में आपका स्वागत है",
        intro: "किसी से भी, कहीं भी — अपनी भाषा में चैट करें।",
        login: "लॉगिन",
        signup: "साइन अप",
        email: "ईमेल",
        password: "पासवर्ड",
        username: "उपयोगकर्ता नाम",
        language: "पसंदीदा भाषा",
      },
    },
    es: {
      translation: {
        welcome: "Bienvenido al Traductor de Chat en Tiempo Real",
        intro: "Chatea con cualquiera, en cualquier lugar — en tu idioma.",
        login: "Iniciar sesión",
        signup: "Registrarse",
        email: "Correo electrónico",
        password: "Contraseña",
        username: "Nombre de usuario",
        language: "Idioma preferido",
      },
    },
    fr: {
      translation: {
        welcome: "Bienvenue sur le Traducteur de Chat en Temps Réel",
        intro: "Discutez avec n'importe qui, n'importe où — dans votre langue.",
        login: "Connexion",
        signup: "S'inscrire",
        email: "E-mail",
        password: "Mot de passe",
        username: "Nom d'utilisateur",
        language: "Langue préférée",
      },
    },
    zh: {
      translation: {
        welcome: "欢迎使用实时聊天翻译器",
        intro: "随时随地与任何人聊天 — 用你的语言。",
        login: "登录",
        signup: "注册",
        email: "电子邮件",
        password: "密码",
        username: "用户名",
        language: "首选语言",
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
