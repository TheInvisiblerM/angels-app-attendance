import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";

import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";

import AttendancePage from "./pages/Attendance";
import MassPage from "./pages/MassPage";
import ChildrenPage from "./pages/ChildrenPage";

const AUTH_USERNAME = "ملايكاوي";
const AUTH_PASSWORD = "12345";

function ProtectedRoute({ children }) {
  const isLogged = localStorage.getItem("logged") === "true";
  return isLogged ? children : <Navigate to="/" />;
}

function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {
    if (user === AUTH_USERNAME && pass === AUTH_PASSWORD) {
      localStorage.setItem("logged", "true");
      window.location.href = "/dashboard";
    } else {
      setError("❌ بيانات غير صحيحة");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <Card className="relative w-full max-w-md shadow-2xl rounded-2xl p-4 backdrop-blur-md bg-white/90 z-10">
        <CardContent>
          <h1 className="text-3xl font-bold mb-2 text-center text-red-900">
            ملائكة كنيسة السيدة العذراء – محرم بك
          </h1>
          <h2 className="text-lg font-semibold text-center mb-4 text-gray-700">
            تسجيل دخول المسؤول
          </h2>
          {error && <p className="text-center text-red-600 mb-2">{error}</p>}
          <div className="space-y-3">
            <input
              onChange={(e) => setUser(e.target.value)}
              placeholder="اسم المستخدم"
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <input
              onChange={(e) => setPass(e.target.value)}
              placeholder="كلمة المرور"
              type="password"
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <Button
            className="w-full mt-4 bg-red-600 hover:bg-red-700 transition-all duration-300 text-white rounded-xl py-3 font-semibold shadow-md"
            onClick={handleLogin}
          >
            تسجيل الدخول
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); setShowButton(true); };
    window.addEventListener("beforeinstallprompt", handler);
    const installedHandler = () => { setShowButton(false); setDeferredPrompt(null); };
    window.addEventListener("appinstalled", installedHandler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowButton(false);
  };

  if (!showButton) return null;

  return (
    <button
      onClick={handleInstall}
      className="fixed bottom-4 right-4 px-4 py-2 bg-red-600 text-white rounded-xl shadow-lg z-50 hover:bg-red-700 transition"
    >
      ➕ تثبيت التطبيق
    </button>
  );
}

export default function App() {
  return (
    <Router>
      <InstallButton />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><ChildrenPage /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
        <Route path="/mass" element={<ProtectedRoute><MassPage /></ProtectedRoute>} />
        <Route path="/children" element={<ProtectedRoute><ChildrenPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}
