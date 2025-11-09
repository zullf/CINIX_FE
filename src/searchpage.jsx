import { useState } from "react";
import {
  Home,
  User,
  MapPin,
  Search,
  Ticket,
  Heart,
  ChevronRight,
} from "lucide-react";

// ===================================================================
// KOMPONEN UNTUK HALAMAN PENCARIAN
// ===================================================================

// Komponen kecil untuk Chip Kota
const CityChip = ({ city, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 rounded-full font-semibold text-sm shadow-md transition-all ${
      isActive
        ? 'bg-[#2d3e50] text-[#fff9e6]'
        : 'bg-[#f5f1dc] text-[#2d3e50] hover:bg-opacity-80'
    }`}
  >
    {city}
  </button>
);

// Komponen kecil untuk Kartu Bioskop
const CinemaCard = ({ name, brand }) => {
  let logo;
  if (brand === 'xxi') {
    // Replikasi logo "Cinema XXI"
    logo = <div className="border border-gray-500 px-3 py-1 text-gray-700 text-sm font-medium w-max">Cinema XXI</div>;
  } else if (brand === 'cgv') {
    // Replikasi logo "CGV"
    logo = <div className="text-red-600 text-3xl font-bold italic">CGV<span className="text-red-400">*</span></div>;
  }

  return (
    <div className="bg-[#f5f1dc] rounded-xl p-5 flex justify-between items-center shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
      <div>
        <h3 className="text-lg font-bold text-[#2d3e50]">{name}</h3>
        <div className="mt-2">{logo}</div>
      </div>
      <ChevronRight size={24} className="text-[#2d3e50] flex-shrink-0" />
    </div>
  );
};

// Komponen Halaman Pencarian (Default Export)
export default function SearchPage({ onNavigateHome }) {
  const [activeCity, setActiveCity] = useState('JAKARTA');
  
  const cities = ['JAKARTA', 'BOGOR', 'DEPOK', 'TANGERANG', 'BEKASI'];
  
  // Data bioskop (bisa difilter berdasarkan activeCity nantinya)
  const allCinemas = [
    { name: 'AEON MALL TANJUNGBARAT XXI', brand: 'xxi', city: 'JAKARTA' },
    { name: 'FX Sudirman CGV', brand: 'cgv', city: 'JAKARTA' },
    { name: 'Gandaria City XXI', brand: 'xxi', city: 'JAKARTA' },
    { name: 'Botani Square XXI', brand: 'xxi', city: 'BOGOR' },
    { name: 'Margo City CGV', brand: 'cgv', city: 'DEPOK' },
  ];

  // Filter bioskop berdasarkan kota yang aktif
  const filteredCinemas = allCinemas.filter(c => c.city === activeCity);

  return (
    <>
      {/* Header Halaman Pencarian */}
      <header className="flex items-center justify-between px-8 py-4 bg-[#f5f1dc] shadow">
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold text-[#2a4c44]">CINIX</div>
          <div className="flex items-center gap-1 ml-4 bg-[#e6ddba] px-3 py-1 rounded-full text-sm">
            <MapPin size={16} />
            <span>Jabodetabek</span>
          </div>
        </div>
        {/* Navigasi baru sesuai gambar */}
        <div className="flex gap-6 text-[#2a4c44] font-semibold">
          <button onClick={onNavigateHome} className="flex items-center gap-2 hover:opacity-70">
            <Home className="text-[#2a4c44]" />
            <span>Home</span>
          </button>
          <button className="flex items-center gap-2 hover:opacity-70">
            <Ticket />
            <span>Tickets</span>
          </button>
          <button className="flex items-center gap-2 hover:opacity-70">
            <Heart />
            <span>Wishlist</span>
          </button>
          <button className="flex items-center gap-2 hover:opacity-70">
            <User />
            <span>Profile</span>
          </button>
        </div>
      </header>

      {/* Konten Halaman Pencarian */}
      <main className="px-6 md:px-10 lg:px-20 py-10">
        <h2 className="text-xl font-semibold text-[#fff9e6] mb-5">
          BIOSKOP / CINEMA
        </h2>
        
        {/* Search Bar */}
        <div className="flex items-center gap-3 bg-[#f5f1dc] rounded-full p-3 shadow-inner">
          <Search size={24} className="text-gray-500 ml-2" />
          <input 
            type="text" 
            placeholder="Cari bioskop..." 
            className="w-full bg-transparent text-lg text-[#2a4c44] placeholder-gray-500 focus:outline-none"
          />
        </div>

        {/* Filter Kota */}
        <div className="flex flex-wrap gap-3 my-6">
          {cities.map(city => (
            <CityChip
              key={city}
              city={city}
              isActive={activeCity === city}
              onClick={() => setActiveCity(city)}
            />
          ))}
        </div>

        {/* Daftar Bioskop */}
        <div className="space-y-4">
          {/* Tampilkan bioskop yang difilter */}
          {filteredCinemas.length > 0 ? (
            filteredCinemas.map(cinema => (
              <CinemaCard 
                key={cinema.name}
                name={cinema.name}
                brand={cinema.brand}
              />
            ))
          ) : (
            // Tampilkan pesan jika tidak ada bioskop di kota tsb
            <p className="text-center text-[#fff9e6]">
              Tidak ada bioskop yang ditemukan untuk {activeCity}.
            </p>
          )}
        </div>
      </main>
    </>
  );
}