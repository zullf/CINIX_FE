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
  Ticket,
  Heart,
} from "lucide-react";

// Impor halaman-halaman lain
import SearchPage from "./searchpage.jsx";
import DetailPage from "./detailmovie.jsx";
import LoginPage from "./loginpage.jsx";
import SignUpPage from "./signup.jsx";
import PaymentPage from "./payment.jsx"; // Impor baru

// ===================================================================
// KOMPONEN HEADER UTAMA (untuk Homepage)
// ===================================================================
function MainHeader({
  onNavigateSearch,
  onNavigateHome,
  onNavigateLogin,
}) {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-[#f5f1dc] shadow">
      <div className="flex items-center gap-4">
        <div className="text-3xl font-bold text-[#2a4c44]">CINIX</div>
        <div className="flex items-center gap-1 ml-4 bg-[#e6ddba] px-3 py-1 rounded-full text-sm">
          <MapPin size={16} />
          <span>Jabodetabek</span>
        </div>
      </div>
      <div className="flex gap-6 text-[#2a4c44] font-semibold">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 hover:opacity-70"
        >
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
        <button
          onClick={onNavigateLogin}
          className="flex items-center gap-2 hover:opacity-70"
        >
          <User />
          <span>Profile</span>
        </button>
      </div>
    </header>
  );
}

// ===================================================================
// KOMPONEN CAROUSEL (untuk Homepage)
// ===================================================================
function MovieCarousel({ onNavigateDetail }) {
  const originalMovies = [
    {
      title: "Stollen Girl",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSW0trXZ0E9GJ7bFXfr98f0UOGcMWJneYrDLw&s",
      release: "10 Oktober",
      genres: "Action, Thriller",
      duration: "2h 5m",
    },
    {
      title: "Tron Ares (2025)",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8tq8lygfqv4hEIDsAjS88Rdh-z99CusKQyg&s",
      release: "10 Oktober",
      genres: "Sci-fi, Action",
      duration: "2h 10m",
    },
    {
      title: "Chainsaw Man",
      img: "https://m.media-amazon.com/images/M/MV5BNDQzMjc2ZDQtMjY2NS00M2UxLTg2OTktNWVjZmY5YjA4MzVhXkEyXkFqcGc@._V1_.jpg",
      release: "12 Oktober",
      genres: "Anime, Action",
      duration: "1h 45m",
    },
    {
      title: "Black Phone 2",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0XQBg8-xS-u8bh5ntG5eolzWzRU8TMs4HDQ&s",
      release: "15 Oktober",
      genres: "Horror, Thriller",
      duration: "1h 55m",
    },
  ];

  // Logika Looping Carousel (Triple List)
  const displayMovies = [
    ...originalMovies,
    ...originalMovies,
    ...originalMovies,
  ];
  const [currentSlide, setCurrentSlide] = useState(originalMovies.length); // Mulai di list tengah
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const slideDistance = 21.5; // w-80 (20rem) + gap-6 (1.5rem)

  const nextSlide = () => {
    setTransitionEnabled(true);
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    setTransitionEnabled(true);
    setCurrentSlide((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    if (currentSlide === originalMovies.length * 2) {
      setTransitionEnabled(false);
      setCurrentSlide(originalMovies.length);
    }
    if (currentSlide === originalMovies.length - 1) {
      setTransitionEnabled(false);
      setCurrentSlide(originalMovies.length * 2 - 1);
    }
  };

  let dotIndex = (currentSlide % originalMovies.length);

  const transitionClass = transitionEnabled
    ? "transition-transform duration-500 ease-in-out"
    : "";

  return (
    <section className="py-10 px-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#fff9e6]">
          Sedang tayang di cinema!
        </h2>
        <Search size={24} className="text-[#fff9e6] cursor-pointer" />
      </div>

      <div className="overflow-hidden">
        <div
          className={`flex gap-6 ${transitionClass}`}
          style={{
            transform: `translateX(-${currentSlide * slideDistance}rem)`,
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {displayMovies.map((movie, index) => (
            <div
              key={index}
              className="flex-shrink-0 cursor-pointer group"
              onClick={() => onNavigateDetail(movie)} // Navigasi saat diklik
            >
              <img
                src={movie.img}
                alt={movie.title}
                className="w-80 h-112 object-cover rounded-xl shadow-lg group-hover:opacity-80 transition-opacity"
              />
              <p className="mt-2 text-[#fff9e6] text-center font-semibold">
                {movie.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 text-[#fff9e6]">
        <button
          onClick={prevSlide}
          className="p-2 bg-[#fff9e6] rounded-full shadow hover:bg-gray-200 transition"
        >
          <ArrowLeft size={20} className="text-[#2a4c44]" />
        </button>
        <div className="flex gap-1.5">
          {originalMovies.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${
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
  );
}

// ===================================================================
// KOMPONEN HOMEPAGE
// ===================================================================
function HomePage({ onNavigateSearch, onNavigateDetail, onNavigateLogin }) {
  return (
    <div className="min-h-screen bg-[#6a8e7f] text-gray-900 font-sans">
      <MainHeader
        onNavigateSearch={onNavigateSearch}
        onNavigateHome={() => {}} // Sudah di home
        onNavigateLogin={onNavigateLogin}
      />

      {/* Banner */}
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

      {/* Movie Carousel */}
      <MovieCarousel onNavigateDetail={onNavigateDetail} />
    </div>
  );
}

// ===================================================================
// KOMPONEN APP UTAMA (ROUTER)
// ===================================================================
export default function Cinix() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Fungsi Navigasi
  const handleNavigateHome = () => setCurrentPage("home");
  const handleNavigateSearch = () => setCurrentPage("search");
  const handleNavigateLogin = () => setCurrentPage("login");
  const handleNavigateSignUp = () => setCurrentPage("register");

  const handleNavigateDetail = (movie) => {
    setSelectedMovie(movie);
    setCurrentPage("detail");
  };

  const handleNavigatePayment = (movie, cinema, time) => {
    setSelectedMovie(movie);
    setSelectedCinema(cinema);
    setSelectedTime(time);
    setCurrentPage("payment");
  };

  // Render Halaman berdasarkan State
  switch (currentPage) {
    case "home":
      return (
        <HomePage
          onNavigateSearch={handleNavigateSearch}
          onNavigateDetail={handleNavigateDetail}
          onNavigateLogin={handleNavigateLogin}
        />
      );
    case "search":
      return (
        <SearchPage
          onNavigateHome={handleNavigateHome}
          onNavigateLogin={handleNavigateLogin}
        />
      );
    case "detail":
      return (
        <DetailPage
          movie={selectedMovie}
          onNavigateHome={handleNavigateHome}
          onNavigateLogin={handleNavigateLogin}
          onNavigatePayment={handleNavigatePayment} // Prop baru
        />
      );
    case "login":
      return (
        <LoginPage
          onNavigateHome={handleNavigateHome}
          onNavigateSignUp={handleNavigateSignUp}
        />
      );
    case "register":
      return (
        <SignUpPage
          onNavigateHome={handleNavigateHome}
          onNavigateLogin={handleNavigateLogin}
        />
      );
    case "payment":
      return (
        <PaymentPage
          movie={selectedMovie}
          cinema={selectedCinema}
          time={selectedTime}
          onNavigateHome={handleNavigateHome}
          onNavigateLogin={handleNavigateLogin}
          onNavigateBack={() => setCurrentPage("detail")} // Kembali ke detail
        />
      );
    default:
      return (
        <HomePage
          onNavigateSearch={handleNavigateSearch}
          onNavigateDetail={handleNavigateDetail}
          onNavigateLogin={handleNavigateLogin}
        />
      );
  }
}