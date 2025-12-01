import React, { useState } from "react";
import { ArrowLeft, Calendar, Clock, MapPin, Ticket, ShieldCheck, Loader2, QrCode, Wallet, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://cinix-be.vercel.app/payment";

const formatIDR = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};
const PaymentHeader = ({ onBack }) => (
  <div className="bg-white shadow-sm px-6 py-4 flex items-center gap-4 sticky top-0 z-50">
    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition"><ArrowLeft className="text-[#2a4c44]" /></button>
    <h1 className="text-xl font-bold text-[#2a4c44]">Ringkasan Pembayaran</h1>
  </div>
);

const MovieSummaryCard = ({ movie, cinema, time, quantity, seats }) => (
  <div className="bg-white rounded-3xl p-6 shadow-lg mb-6 flex gap-6 items-start animate-in slide-in-from-bottom-2">
    <img 
      src={movie.poster_url || movie.img} 
      alt={movie.title} 
      className="w-24 h-36 object-cover rounded-xl shadow-md bg-gray-200"
      onError={(e) => {e.target.onerror = null; e.target.src = "https://via.placeholder.com/150";}}
    />
    <div className="flex-1">
      <h2 className="text-2xl font-black text-[#2a4c44] mb-2 leading-tight">{movie.title}</h2>
      <div className="flex flex-col gap-2 text-sm text-gray-600 font-medium">
        <div className="flex items-center gap-2"><MapPin size={16} className="text-amber-500"/> {cinema}</div>
        <div className="flex items-center gap-2"><Calendar size={16} className="text-amber-500"/> {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        <div className="flex items-center gap-2"><Clock size={16} className="text-amber-500"/> {time}</div>
        <div className="flex items-center gap-2"><Ticket size={16} className="text-amber-500"/> {quantity} Tiket ({seats.join(", ")})</div>
      </div>
    </div>
  </div>
);

const PaymentMethodItem = ({ id, name, iconUrl, isSelected, onClick }) => (
    <div 
      onClick={() => onClick(id)}
      className={`border-2 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all duration-200 ${
        isSelected ? "border-amber-500 bg-amber-50 shadow-md transform scale-[1.01]" : "border-gray-100 hover:border-gray-300 bg-white"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-10 rounded-lg flex items-center justify-center border border-gray-100 bg-white p-1 shadow-sm overflow-hidden">
           {iconUrl ? (
             <img src={iconUrl} alt={name} className="w-full h-full object-contain" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
           ) : null}
           <div style={{ display: iconUrl ? 'none' : 'block' }}>
               {id === 'qris' ? <QrCode className="text-gray-600" /> : <Wallet className="text-blue-500" />}
           </div>
        </div>
        <span className="font-bold text-gray-700 text-lg">{name}</span>
      </div>
      {isSelected && <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-sm"><div className="w-2.5 h-2.5 bg-white rounded-full"></div></div>}
    </div>
);

const PriceSummary = ({ pricePerTicket, quantity, adminFee, totalAmount }) => (
  <div className="bg-white rounded-3xl p-6 shadow-lg mb-8">
    <h3 className="font-bold text-[#2a4c44] mb-4 text-lg">Rincian Biaya</h3>
    <div className="space-y-3 text-sm font-medium">
      <div className="flex justify-between text-gray-500"><span>Tiket ({quantity}x)</span><span>{formatIDR(pricePerTicket * quantity)}</span></div>
      <div className="flex justify-between text-gray-500"><span>Biaya Layanan</span><span>{formatIDR(adminFee)}</span></div>
      <div className="border-t border-dashed border-gray-300 my-3 pt-4 flex justify-between items-center">
        <span className="font-bold text-[#2a4c44] text-lg">Total Bayar</span>
        <span className="font-black text-amber-600 text-xl">{formatIDR(totalAmount)}</span>
      </div>
    </div>
  </div>
);
export default function PaymentPage({ onNavigateHome, movie, cinema, time, user, quantity, seats }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("qris");

  const pricePerTicket = 50000;
  const adminFee = 3000;
  const totalAmount = (pricePerTicket * (quantity || 1)) + adminFee;

  const methods = [
    { id: "qris", name: "QRIS", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Commons_QR_code.png/600px-Commons_QR_code.png" },
    { id: "dana", name: "DANA", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/1200px-Logo_dana_blue.svg.png" },
    { id: "gopay", name: "GoPay", icon: "https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg" }
  ];

  const handlePayment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("Sesi Anda habis. Silakan login ulang.");
        navigate('/login');
        return;
      }
      
      const payload = {
        schedule_id: "02c0037c-3b6e-40f0-939a-b6ac42cd086e",
        seats: seats, 
        amount: totalAmount
      };

      console.log("PAYLOAD KE BE:", payload);
      const response = await axios.post(API_BASE_URL, payload, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log("RESPONSE SUKSES:", response.data);
      const responseData = response.data;
      const midtransUrl = responseData.snap?.redirect_url || 
                          responseData.payment?.midtrans_response?.redirect_url;

      if (midtransUrl) {
          if (user && user.id) {
              const storageKey = `tickets_${user.id}`;
              const existingTickets = JSON.parse(localStorage.getItem(storageKey) || "[]");
              const newTicketUI = {
                  id: responseData.booking?.id_booking || Date.now(), 
                  movie_title: movie.title,
                  movie_poster: movie.poster_url || movie.img,
                  cinema_name: cinema,
                  showtime: time,
                  seats: seats,
                  quantity: quantity,
                  total_amount: totalAmount,
                  status: "Menunggu Pembayaran", 
                  payment_link: midtransUrl 
              };
              
              const updatedTickets = [newTicketUI, ...existingTickets]; 
              localStorage.setItem(storageKey, JSON.stringify(updatedTickets));
          }
          window.location.href = midtransUrl; 
      } else {
          alert("Gagal mendapatkan link pembayaran.");
      }

    } catch (error) {
      console.error("ERROR PAYMENT:", error);
      
      if (error.response) {
          if (error.response.status === 401) {
              alert("Sesi login berakhir. Backend menolak token Anda. Silakan Login Ulang.");
              localStorage.removeItem("token");
              navigate('/login');
          } 
          else {
              const msg = error.response.data?.message || "Gagal memproses transaksi.";
              alert(`Gagal: ${msg}`);
          }
      } else {
          alert("Terjadi kesalahan jaringan.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!movie) return <div className="p-10 text-center">Data tidak ditemukan. <button onClick={onNavigateHome}>Home</button></div>;

  return (
    <div className="min-h-screen bg-[#f5f1dc] font-sans pb-20 relative">
      <PaymentHeader onBack={() => navigate(-1)} />

      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 flex flex-col items-center">
            <Loader2 size={48} className="text-amber-500 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-[#2a4c44]">Menghubungkan ke Pembayaran...</h2>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-6 py-8">
        <MovieSummaryCard movie={movie} cinema={cinema} time={time} quantity={quantity} seats={seats} />
        
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
           <h3 className="font-bold text-[#2a4c44] mb-4">Metode Pembayaran</h3>
           <div className="space-y-3">
               {methods.map((method) => (
                   <PaymentMethodItem key={method.id} id={method.id} name={method.name} iconUrl={method.icon} isSelected={paymentMethod === method.id} onClick={setPaymentMethod} />
               ))}
           </div>
        </div>

        <PriceSummary pricePerTicket={pricePerTicket} quantity={quantity} adminFee={adminFee} totalAmount={totalAmount} />

        <button 
          onClick={handlePayment}
          disabled={loading} 
          className="w-full bg-[#2a4c44] text-white py-4 rounded-full font-bold text-lg hover:bg-[#1e3630] transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Sedang Memproses..." : <><ShieldCheck /> Lanjut ke Pembayaran</>}
        </button>
      </div>
    </div>
  );
}