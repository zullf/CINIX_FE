import { useState } from "react";
import {
  Home,
  Star,
  List,
  User,
  MapPin,
  ArrowLeft,
  ArrowRight,
  Search,
  Glasses,
  Film,
} from "lucide-react";

export default function Cinix() {
  // --- PERUBAHAN 1: Buat daftar film asli ---
  // Kita akan sebut ini 'originalMovies'
  const originalMovies = [
    { title: "Stollen Girl", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSW0trXZ0E9GJ7bFXfr98f0UOGcMWJneYrDLw&s" },
    { title: "Tron Series", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8tq8lygfqv4hEIDsAjS88Rdh-z99CusKQyg&s" },
    { title: "Chainsaw Man", img: "https://m.media-amazon.com/images/M/MV5BNDQzMjc2ZDQtMjY2NS00M2UxLTg2OTktNWVjZmY5YjA4MzVhXkEyXkFqcGc@._V1_.jpg" },
    { title: "Black Phone 2", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0XQBg8-xS-u8bh5ntG5eolzWzRU8TMs4HDQ&s" },
  ];

  // --- PERUBAHAN 2: Buat daftar 'display' dengan klon ---
  const firstClone = originalMovies[0];
  const lastClone = originalMovies[originalMovies.length - 1];
  const displayMovies = [lastClone, ...originalMovies, firstClone];

  // --- PERUBAHAN 3: Mulai 'currentSlide' di 1 (item asli pertama) ---
  const [currentSlide, setCurrentSlide] = useState(1);
  
  // --- PERUBAHAN 4: State untuk mengontrol transisi CSS ---
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  // Lebar poster (w-40 -> 10rem) + gap (gap-6 -> 1.5rem) = 11.5rem
  const slideDistance = 11.5;

  // --- PERUBAHAN 5: Logika 'Next' dan 'Prev' yang diperbarui ---
  const nextSlide = () => {
    // Aktifkan transisi untuk slide normal
    setTransitionEnabled(true); 
    // Maju ke slide berikutnya
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    // Aktifkan transisi untuk slide normal
    setTransitionEnabled(true);
    // Mundur ke slide sebelumnya
    setCurrentSlide((prev) => prev - 1);
  };

  // --- PERUBAHAN 6: Handler 'onTransitionEnd' (Inti dari 'looping') ---
  const handleTransitionEnd = () => {
    // Cek jika kita mendarat di KLON PERTAMA (di paling kanan)
    if (currentSlide === originalMovies.length + 1) {
      setTransitionEnabled(false); // Matikan animasi
      setCurrentSlide(1); // Lompat ke item asli pertama
    }

    // Cek jika kita mendarat di KLON TERAKHIR (di paling kiri)
    if (currentSlide === 0) {
      setTransitionEnabled(false); // Matikan animasi
      setCurrentSlide(originalMovies.length); // Lompat ke item asli terakhir
    }
  };

  // --- PERUBAHAN 7: Logika untuk 'dots' agar tetap sinkron ---
  // Kita perlu mengubah 'currentSlide' (yang sekarang 0-5) kembali ke 'dotIndex' (0-3)
  let dotIndex = currentSlide - 1;
  if (currentSlide === 0) {
    dotIndex = originalMovies.length - 1; // Jika di klon kiri, tunjuk dot terakhir
  } else if (currentSlide === originalMovies.length + 1) {
    dotIndex = 0; // Jika di klon kanan, tunjuk dot pertama
  }

  // --- PERUBAHAN 8: Kelas transisi dinamis ---
  const transitionClass = transitionEnabled
    ? "transition-transform duration-500 ease-in-out"
    : "";

  return (
    <div className="min-h-screen bg-[#6a8e7f] text-gray-900 font-sans">
      {/* Header (Tidak berubah) */}
      <header className="flex items-center justify-between px-8 py-4 bg-[#f5f1dc] shadow">
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold text-[#2a4c44]">CINIX</div> 
          <div className="flex items-center gap-1 ml-4 bg-[#e6ddba] px-3 py-1 rounded-full text-sm">
            <MapPin size={16} />
            <span>Jabodetabek</span>
          </div>
        </div>
        <div className="flex gap-6 text-gray-700">
          <Home className="text-[#2a4c44] cursor-pointer" /> 
          <Star className="cursor-pointer" />
          <List className="cursor-pointer" />
          <User className="cursor-pointer" />
        </div>
      </header>

      {/* Banner (Tidak berubah) */}
      <div className="bg-[#2d3e50] text-[#fff9e6] py-10 flex justify-center items-center gap-4 md:gap-8 relative">
        <Glasses size={64} className="text-orange-400 -rotate-12" />
        <span 
          className="text-7xl md:text-8xl font-bold tracking-widest"
          style={{ fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif' }}
        >
          CINIX
        </span>
        <Film size={64} className="text-yellow-300 rotate-12" />
      </div>

      {/* Movie Section */}
      <section className="py-10 px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#fff9e6]">
            Sedang tayang di cinema!
          </h2>
          <Search size={24} className="text-[#fff9e6] cursor-pointer" />
        </div>

        {/* --- Carousel Slider --- */}
        <div className="overflow-hidden">
          {/* --- PERUBAHAN 9: Tambahkan onTransitionEnd dan className dinamis --- */}
          <div
            className={`flex gap-6 ${transitionClass}`}
            style={{ transform: `translateX(-${currentSlide * slideDistance}rem)` }}
            onTransitionEnd={handleTransitionEnd} 
          >
            {/* --- PERUBAHAN 10: Render 'displayMovies' (bukan 'movies') --- */}
            {displayMovies.map((movie, index) => (
              <div
                key={index} // 'key' di sini harus unik, jadi 'index' tidak masalah
                className="flex-shrink-0" 
              >
                <img
                  src={movie.img}
                  alt={movie.title}
                  className="w-40 h-56 object-cover rounded-xl shadow-lg"
                />
                <p className="mt-2 text-[#fff9e6] text-center">{movie.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Kontrol (Tombol & Dots) */}
        <div className="flex justify-between items-center mt-6 text-[#fff9e6]">
          <button 
            onClick={prevSlide} 
            className="p-2 bg-[#fff9e6] rounded-full shadow hover:bg-gray-200 transition"
          >
            <ArrowLeft size={20} className="text-[#2a4c44]" />
          </button>
          
          <div className="flex gap-1.5">
            {/* --- PERUBAHAN 11: Map 'originalMovies' untuk dots --- */}
            {originalMovies.map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${ 
                  // --- PERUBAHAN 12: Gunakan 'dotIndex' untuk perbandingan ---
                  i === dotIndex ? "bg-[#fff9e6]" : "bg-gray-400"
                }`}
              ></div>
            ))}
          </div>

          <button 
            onClick={nextSlide} 
            className="p-2 bg-[#fff9e6] rounded-full shadow hover:bg-gray-200 transition"
          >
            <ArrowRight size={20} className="text-[#2a4c44]" />
          </button>
        </div>
      </section>
    </div>
  );
}