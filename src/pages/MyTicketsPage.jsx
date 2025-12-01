import React, { useState, useEffect } from "react";
import { History, Clapperboard, Calendar, Clock, MapPin, Ticket, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TicketHeader from "../components/TicketHeader";

export default function MyTicketsPage({ user }) {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (user && user.id) {
        const storageKey = `tickets_${user.id}`;
        const savedTickets = JSON.parse(localStorage.getItem(storageKey) || "[]");
        setTickets(savedTickets);
    } else {
        setTickets([]);
    }
  }, [user]); 

  const clearHistory = () => {
      if(user && user.id && confirm("Hapus semua riwayat pesanan?")) {
          const storageKey = `tickets_${user.id}`;
          localStorage.removeItem(storageKey);
          setTickets([]);
      }
  };

  return (
    <div className="min-h-screen bg-[#6a8e7f] font-sans pb-20">
      <TicketHeader onNavigateHome={() => navigate('/')} user={user} />

      <main className="container mx-auto px-4 md:px-8 py-10 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-[#fff9e6] tracking-tight drop-shadow-md">
                Tiket Saya
            </h1>
            {tickets.length > 0 && (
                <button onClick={clearHistory} className="text-red-300 hover:text-red-100 flex items-center gap-1 text-sm bg-black/20 px-3 py-1 rounded-full transition">
                    <Trash2 size={14} /> Clear History
                </button>
            )}
        </div>

        <div className="space-y-6">
            {tickets.length > 0 ? (
                tickets.map((ticket) => (
                    <div key={ticket.id} className="bg-white rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row relative group hover:-translate-y-1 transition-transform duration-300 animate-in slide-in-from-bottom-2">
                        <div className="w-full md:w-40 h-48 md:h-auto relative bg-gray-200 shrink-0">
                             <img 
                                src={ticket.movie_poster} 
                                alt={ticket.movie_title} 
                                className="w-full h-full object-cover"
                                onError={(e) => {e.target.onerror = null; e.target.src = "https://via.placeholder.com/150";}}
                             />
                             <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow z-10">
                                 {ticket.status}
                             </div>
                        </div>

                        <div className="flex-1 p-6 flex flex-col justify-between relative overflow-hidden">
                             <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_1px_1px,#2a4c44_1px,transparent_0)] bg-[length:10px_10px]"></div>

                             <div className="relative z-10">
                                 <h2 className="text-2xl font-black text-[#2a4c44] mb-2 leading-tight">{ticket.movie_title}</h2>
                                 <div className="flex flex-col gap-2 text-sm text-gray-600 font-medium">
                                     <div className="flex items-center gap-2">
                                         <MapPin size={16} className="text-amber-500"/> {ticket.cinema_name}
                                     </div>
                                     <div className="flex flex-wrap items-center gap-4">
                                         <div className="flex items-center gap-2">
                                             <Clock size={16} className="text-amber-500"/> {ticket.showtime}
                                         </div>
                                         <div className="flex items-center gap-2">
                                             <Ticket size={16} className="text-amber-500"/> {ticket.quantity} Tiket
                                         </div>
                                     </div>
                                     <div className="mt-3 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg w-fit">
                                         <span className="text-[#2a4c44] font-bold text-xs uppercase tracking-wide">Kursi:</span>
                                         <span className="text-amber-700 font-black">{ticket.seats.join(", ")}</span>
                                     </div>
                                 </div>
                             </div>

                             <div className="mt-6 flex justify-between items-end border-t border-dashed border-gray-300 pt-4 relative z-10">
                                 <div className="text-xs text-gray-400 font-mono">
                                     ID: #{ticket.id}
                                 </div>
                                 <div className="text-xl font-black text-amber-600">
                                     {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(ticket.total_amount)}
                                 </div>
                             </div>
                        </div>

                        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[#6a8e7f] rounded-full z-20 hidden md:block"></div>
                    </div>
                ))
            ) : (
                <div className="text-center py-20 bg-white/10 rounded-3xl border-2 border-dashed border-white/30 text-white/60">
                    <Clapperboard size={48} className="mx-auto mb-4 opacity-50"/>
                    <p className="text-xl font-bold">Belum ada tiket.</p>
                    <p className="text-sm mt-1">Order tiket pertamamu sekarang!</p>
                </div>
            )}
        </div>

      </main>
    </div>
  );
}