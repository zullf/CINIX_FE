import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import axios from "axios";

const API_BASE_URL = "https://cinix-be.vercel.app"; 

export default function AdminLogin({ onLoginSuccess }) {
  const [formData, setFormData] = useState({ 
    email: "admin@cinix.com", 
    password: "admin123" 
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const params = new URLSearchParams();
      params.append('email', formData.email.trim());
      params.append('password', formData.password.trim());

      console.log("Login Request ke:", `${API_BASE_URL}/admin/login`);

      const response = await axios.post(`${API_BASE_URL}/admin/login`, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true // Tetap biarkan, siapa tau di Production (Vercel ke Vercel) cookie-nya jalan
      });
      
      console.log("RESPONSE LOGIN:", response.data);

      // --- LOGIKA PENYELAMATAN TOKEN ---
      // 1. Cek Token di response body level luar
      let token = response.data.token;
      
      // 2. Kalau gak ada, cek di dalam object user/data (kadang struktur BE beda)
      if (!token && response.data.data && response.data.data.token) {
          token = response.data.data.token;
      }

      if (token) {
          // SIMPAN TOKEN KE SAKU (LocalStorage)
          // Ini kunci supaya fitur lain jalan meski Cookie diblokir browser
          localStorage.setItem("admin_token", token);
          localStorage.setItem("admin_auth", "true");
          onLoginSuccess();
      } else {
          // Kalau Token beneran gak dikirim di body, kita pasrah sama cookie (yang kemungkinan gagal)
          console.warn("Waduh, Backend gak ngirim token di Body. Berdoa semoga Cookie masuk.");
          localStorage.setItem("admin_auth", "true");
          onLoginSuccess();
      }

    } catch (error) {
      console.error("Login Gagal:", error);
      const msg = error.response?.data?.message || "Cek email/password atau koneksi backend.";
      alert(`Gagal Login: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2a4c44]">
      <div className="bg-[#f5f1dc] p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[#2a4c44]">CINIX ADMIN</h1>
          <p className="text-gray-600">Portal Manajemen Bioskop</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#2a4c44] mb-2">Email Admin</label>
            <input type="email" required className="w-full px-4 py-3 rounded-xl border-2 border-[#2a4c44]/20 focus:border-[#2a4c44] bg-white outline-none" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#2a4c44] mb-2">Password</label>
            <input type="password" required className="w-full px-4 py-3 rounded-xl border-2 border-[#2a4c44]/20 focus:border-[#2a4c44] bg-white outline-none" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-[#2a4c44] text-white font-bold rounded-xl hover:bg-[#1e3630] transition-all flex justify-center">
            {loading ? <Loader2 className="animate-spin" /> : "Masuk Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}