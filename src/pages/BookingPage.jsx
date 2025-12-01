import React, { useState } from "react";
import { Home, User, Ticket, Heart, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function BookingHeader({ onNavigateHome, onNavigateLogin, movieTitle, cinemaName, onBack }) {
  return (
    <header className="flex items-center justify-between px-6 md:px-8 py-4 bg-[#f5f1dc] shadow sticky top-0 z-50">
      <button onClick={onBack} className="flex items-center gap-2 text-[#2a4c44] font-semibold hover:opacity-70 transition">
        <ChevronLeft size={24} />
      </button>

      <div className="flex flex-col items-center">
        <h1 className="text-lg md:text-xl font-bold text-[#2a4c44] text-center line-clamp-1">{movieTitle}</h1>
        <span className="text-xs md:text-sm text-gray-600">{cinemaName}</span>
      </div>

      <div className="flex gap-4 md:gap-6 text-[#2a4c44]">
        <button onClick={onNavigateHome} className="hover:opacity-70"><Home /></button>
        <button onClick={onNavigateLogin} className="hidden md:block hover:opacity-70"><User /></button>
      </div>
    </header>
  );
}

const Seat = ({ status = "available", id, onClick }) => {
  const getSeatClass = () => {
    switch (status) {
      case "selected": return "bg-[#6a8e7f] text-white shadow-md transform scale-105 border-transparent"; 
      case "taken": return "bg-gray-300 text-gray-400 cursor-not-allowed border-transparent";
      default: return "bg-white text-[#2a4c44] hover:bg-[#6a8e7f]/20 border border-gray-300";
    }
  };

  return (
    <button
      onClick={() => onClick(id)}
      disabled={status === "taken"}
      className={`w-7 h-7 md:w-9 md:h-9 rounded-t-lg text-[10px] md:text-xs font-bold transition-all duration-200 ${getSeatClass()}`}
    >
      {id}
    </button>
  );
};

const LegendItem = ({ colorClass, text }) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 rounded ${colorClass}`}></div>
    <span className="text-xs md:text-sm text-[#2a4c44] font-medium">{text}</span>
  </div>
);

const rows = ["K", "J", "I", "H", "G", "F", "E", "D", "C", "B", "A"]; 
const leftSeatNumbers = [8, 7, 6, 5];
const centerSeatNumbers = [4, 3, 2, 1]; 

const createSeats = () => {
  const seats = [];
  rows.forEach((row) => {
    [8,7,6,5].forEach(num => seats.push({ id: `${row}${num}`, row, status: Math.random() < 0.1 ? 'taken' : 'available', block: 'left' }));
    [4,3,2,1].forEach(num => seats.push({ id: `${row}${num}`, row, status: Math.random() < 0.1 ? 'taken' : 'available', block: 'right' }));
  });
  return seats;
};

export default function BookingPage({ movie, cinema, time, onNavigateHome, onNavigateLogin }) {
  const navigate = useNavigate();
  const [allSeats] = useState(createSeats());
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  const ticketPrice = 50000;

  const displayMovie = movie || {
    title: "TRON ARES (2025)",
    poster_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8tq8lygfqv4hEIDsAjS88Rdh-z99CusKQyg&s",
  };
  const displayCinema = cinema || "AEON MALL TANJUNG BARAT XXI";
  const displayTime = time || "12:30";

  const toggleSeat = (id) => {
    if (selectedSeats.includes(id)) {
      setSelectedSeats(selectedSeats.filter((seatId) => seatId !== id));
    } else {
      setSelectedSeats([...selectedSeats, id]);
    }
  };

  const getSeatStatus = (id) => {
    if (selectedSeats.includes(id)) return "selected";
    const seat = allSeats.find((s) => s.id === id);
    return seat ? seat.status : "available";
  };

  const totalPrice = selectedSeats.length * ticketPrice;
  
  const handleProceedToPayment = () => {
     navigate('/payment', {
        state: {
            movie: displayMovie,
            cinema: displayCinema,
            time: displayTime,
            seats: selectedSeats, 
            totalPrice: totalPrice,
            quantity: selectedSeats.length
        }
     });
  };

  return (
    <div className="min-h-screen bg-[#6a8e7f] flex flex-col font-sans">
      <BookingHeader
        onBack={() => navigate(-1)}
        onNavigateHome={onNavigateHome}
        onNavigateLogin={onNavigateLogin}
        movieTitle={displayMovie.title}
        cinemaName={displayCinema}
      />

      <div className="flex-grow flex flex-col lg:flex-row p-4 md:p-6 gap-6 max-w-7xl mx-auto w-full">
        
        <div className="flex-grow bg-[#f5f1dc] p-4 md:p-8 rounded-3xl shadow-xl text-[#2a4c44] flex flex-col items-center">
          <h2 className="text-xl font-black mb-6 self-start">Pilih Kursi</h2>

          <div className="w-full max-w-2xl mb-12 relative">
             <div className="h-2 bg-gray-400 rounded-full w-full shadow-[0_10px_30px_rgba(0,0,0,0.2)]"></div>
             <p className="text-center text-xs font-bold text-gray-400 mt-4 tracking-[0.3em]">LAYAR BIOSKOP</p>
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-gradient-to-b from-white/20 to-transparent blur-xl pointer-events-none"></div>
          </div>

          <div className="flex flex-col gap-2 md:gap-3 overflow-x-auto pb-4 w-full items-center">
            {rows.map((row) => (
              <div key={row} className="flex gap-4 md:gap-8 items-center">
                <div className="flex gap-1 md:gap-2">
                   {[8,7,6,5].map(num => {
                      const id = `${row}${num}`;
                      return <Seat key={id} id={id} status={getSeatStatus(id)} onClick={toggleSeat} />;
                   })}
                </div>
                <div className="flex gap-1 md:gap-2">
                   {[4,3,2,1].map(num => {
                      const id = `${row}${num}`;
                      return <Seat key={id} id={id} status={getSeatStatus(id)} onClick={toggleSeat} />;
                   })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-10 pt-6 border-t border-[#2a4c44]/10 w-full">
            <LegendItem colorClass="bg-white border border-gray-300" text="Tersedia" />
            <LegendItem colorClass="bg-[#6a8e7f]" text="Dipilih" />
            <LegendItem colorClass="bg-gray-300" text="Terisi" />
          </div>
        </div>

        <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white p-6 rounded-3xl shadow-xl sticky top-24">
                <h2 className="text-xl font-black text-[#2a4c44] mb-6">Ringkasan Pesanan</h2>
                
                <div className="flex gap-4 mb-6">
                    <img
                        src={displayMovie.poster_url || displayMovie.img}
                        alt={displayMovie.title}
                        className="w-24 h-36 object-cover rounded-xl shadow-md bg-gray-200"
                    />
                    <div>
                        <h3 className="font-bold text-[#2a4c44] leading-tight mb-1">{displayMovie.title}</h3>
                        <p className="text-sm text-gray-500 font-medium mb-2">{displayCinema}</p>
                        <div className="inline-block bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded font-bold">
                             {displayTime} WIB
                        </div>
                    </div>
                </div>

                <div className="border-t border-dashed border-gray-300 py-4 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Kursi Dipilih</span>
                        <span className="font-bold text-[#2a4c44] text-right max-w-[120px]">
                            {selectedSeats.length > 0 ? selectedSeats.join(", ") : "-"}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Harga Satuan</span>
                        <span className="font-medium">Rp {ticketPrice.toLocaleString('id-ID')}</span>
                    </div>
                </div>

                <div className="border-t border-gray-200 py-4 flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-[#2a4c44]">Total</span>
                    <span className="text-2xl font-black text-amber-500">
                        Rp {totalPrice.toLocaleString('id-ID')}
                    </span>
                </div>

                <button
                    onClick={handleProceedToPayment}
                    disabled={selectedSeats.length === 0}
                    className="w-full py-4 bg-[#2a4c44] text-white font-bold rounded-xl shadow-lg hover:bg-[#1e3630] hover:shadow-xl hover:-translate-y-1 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
                >
                    Lanjut Pembayaran
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}