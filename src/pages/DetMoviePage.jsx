import React, { useState } from "react";
import { Clock, Filter, Search, PlayCircle, Lock, X, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DetailHeader from "../components/detMovieHeader";

const DateChip = ({ day, date, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-16 h-20 rounded-2xl transition-all duration-300 border-2 ${
      isActive
        ? "bg-[#f5f1dc] text-[#2a4c44] border-[#f5f1dc] shadow-lg scale-105"
        : "bg-transparent text-[#f5f1dc] border-white/20 hover:border-amber-400/50 hover:bg-white/5"
    }`}
  >
    <span className="text-xs font-medium opacity-80">{day}</span>
    <span className="font-black text-2xl">{date}</span>
  </button>
);

const CityChip = ({ city, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
      isActive
        ? "bg-amber-400 text-[#2a4c44] shadow-lg shadow-amber-400/20 scale-105"
        : "bg-[#2a4c44]/40 border border-white/20 text-white hover:bg-[#2a4c44] hover:border-amber-400"
    }`}
  >
    {city}
  </button>
);

export default function DetailPage({
  movie,
  onNavigateHome,
  onNavigateLogin,
  onNavigateBooking,
  user,
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("jadwal");
  const [activeDate, setActiveDate] = useState("11");
  const [activeCity, setActiveCity] = useState("JAKARTA");
  
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [isWishlisted, setIsWishlisted] = useState(false);

  const dates = [
    { day: "SUN", date: "09" }, { day: "MON", date: "10" },
    { day: "TUE", date: "11" }, { day: "WED", date: "12" },
    { day: "THR", date: "13" }, { day: "FRI", date: "14" },
  ];
  const cities = ["JAKARTA", "BOGOR", "DEPOK", "TANGERANG", "BEKASI"];
  
  const displayMovie = movie || {
    title: "TRON ARES (2025)",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8tq8lygfqv4hEIDsAjS88Rdh-z99CusKQyg&s",
    release: "10 Oktober",
    genres: "Sci-fi, Action",
    duration: "2h 10m",
  };

  const cinemaToShow = {
    name: "AEON MALL TANJUNG BARAT XXI",
    brand: "Cinema XXI",
    times: ["12:30", "14:30", "16:40", "18:50"],
  };

  const handleBook = (time) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (typeof onNavigateBooking === "function") {
      onNavigateBooking(displayMovie, cinemaToShow.name, time);
    } else {
      console.error("Error: onNavigateBooking prop is missing!");
    }
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="min-h-screen bg-[#6a8e7f] relative">
      <DetailHeader
        onNavigateHome={onNavigateHome}
        onNavigateLogin={onNavigateLogin}
      />
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl p-6 w-80 shadow-2xl relative animate-in zoom-in-95 duration-200 text-center mx-4">
              <button 
                onClick={() => setShowLoginModal(false)} 
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Lock className="text-red-500 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#2a4c44] mb-2">Akses Dibatasi</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Anda harus login terlebih dahulu untuk memilih kursi dan memesan tiket.
              </p>
              <div className="flex flex-col gap-3">
                 <button 
                    onClick={onNavigateLogin} 
                    className="w-full bg-[#2a4c44] text-white py-2.5 rounded-lg font-bold hover:bg-[#1e3630] transition shadow-lg active:scale-95"
                 >
                    Login Sekarang
                 </button>
                 <button 
                    onClick={() => setShowLoginModal(false)} 
                    className="w-full bg-gray-100 text-gray-600 py-2.5 rounded-lg font-bold hover:bg-gray-200 transition active:scale-95"
                 >
                    Nanti Saja
                 </button>
              </div>
           </div>
        </div>
      )}

      <main className="px-6 md:px-10 py-10 text-[#f5f1dc]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black mb-6 tracking-tight">Detail Film</h2>
          
          <div className="flex flex-col md:flex-row gap-8 items-start relative">
            
            <div className="relative w-full md:w-64 aspect-[2/3] flex-shrink-0">
                <img
                src={displayMovie.poster_url || displayMovie.img}
                alt={displayMovie.title}
                className="w-full h-full object-cover rounded-xl shadow-2xl border-2 border-white/10"
                onError={(e) => {e.target.onerror = null; e.target.src = "https://via.placeholder.com/300x450?text=No+Image";}}
                />

                <button
                    onClick={handleToggleWishlist}
                    className="absolute top-3 right-3 p-3 bg-white/20 backdrop-blur-md rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 border border-white/30 group"
                >
                    <Heart 
                        size={24} 
                        className={`transition-all duration-300 ${isWishlisted ? "fill-red-500 text-red-500" : "text-white group-hover:text-red-300"}`} 
                    />
                </button>
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-medium text-amber-300">
                Tayang : {displayMovie.release || "Coming Soon"}
              </span>
              <h1 className="text-4xl md:text-5xl font-black my-2 leading-tight">
                {displayMovie.title}
              </h1>
              <span className="text-lg text-gray-200">{displayMovie.genres}</span>

              {displayMovie.duration && (
                <span className="text-lg mt-2 flex items-center gap-2 font-semibold">
                  <Clock size={20} className="text-amber-400"/>
                  {displayMovie.duration}
                </span>
              )}

              <button className="flex items-center gap-3 mt-8 bg-white/10 hover:bg-white/20 w-max px-6 py-3 rounded-full transition-all group border border-white/20">
                  <PlayCircle size={32} className="text-amber-400 group-hover:scale-110 transition-transform"/>
                  <span className="text-lg font-bold">Lihat Trailer</span>
              </button>
            </div>
          </div>

          <div className="mt-12">
            <div className="flex gap-8 border-b-2 border-white/20">
              {["jadwal", "detail"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xl font-bold pb-3 capitalize transition-colors ${
                    activeTab === tab
                      ? "border-b-4 border-amber-400 text-amber-400 -mb-0.5"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "jadwal" && (
              <div className="py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex gap-3 overflow-x-auto py-2 pb-4 scrollbar-hide">
                  {dates.map((d) => (
                    <DateChip
                      key={d.date}
                      day={d.day}
                      date={d.date}
                      isActive={activeDate === d.date}
                      onClick={() => setActiveDate(d.date)}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-4 my-6 bg-[#2a4c44]/30 p-3 rounded-xl backdrop-blur-sm border border-white/5">
                  <button className="p-2 rounded-lg bg-[#2a4c44] hover:bg-[#3a6a5e] text-white transition">
                    <Filter size={20} />
                  </button>
                  <div className="text-red-500 text-2xl font-black italic tracking-tighter px-2">
                    CGV<span className="text-red-400">*</span>
                  </div>
                  <div className="flex-grow h-px bg-white/10 mx-2"></div>
                  <button className="p-2 rounded-lg bg-[#2a4c44] hover:bg-[#3a6a5e] text-white transition">
                    <Search size={20} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {cities.map((c) => (
                    <CityChip
                      key={c}
                      city={c}
                      isActive={activeCity === c}
                      onClick={() => setActiveCity(c)}
                    />
                  ))}
                </div>

                <div className="bg-[#f5f1dc] rounded-2xl p-6 shadow-xl text-[#2d3e50]">
                  <div className="mb-4">
                    <h3 className="text-xl font-black text-[#2a4c44]">
                      {cinemaToShow.name}
                    </h3>
                    <div className="mt-1 inline-block border border-gray-400 px-2 py-0.5 rounded text-xs font-bold text-gray-600 uppercase tracking-wide">
                      {cinemaToShow.brand}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {cinemaToShow.times.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleBook(time)}
                        className="py-2 px-1 border-2 border-[#2a4c44]/20 text-[#2a4c44] font-bold rounded-lg hover:bg-[#2a4c44] hover:text-white hover:border-[#2a4c44] transition-all duration-200 active:scale-95 text-sm"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "detail" && (
              <div className="py-8 text-lg leading-relaxed text-white/80 animate-in fade-in duration-300">
                <p>Sinopsis lengkap, cast, dan informasi kru film akan ditampilkan di sini.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}