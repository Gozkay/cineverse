import Navbar from "./Navbar";
import Footer from "./Footer";

function MainLayout({ children }) {
  return (
    <div className="relative z-0 min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      {/* Added relative layout configuration to main container element */}
      <main className="relative flex-1 w-full h-full">
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;