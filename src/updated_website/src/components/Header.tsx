import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-lg shadow-sm" : "bg-transparent",
        mobileMenuOpen ? "bg-background" : ""
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/lovable-uploads/4e0869d0-5dec-43e1-83e6-d434fdf50bcd.png"
            alt="Corewood Logo"
            className="h-10"
          />
          <div className="hidden md:block">
            <span className="text-xs text-muted-foreground">Introducing</span>
            <h2 className="font-semibold text-[#386641]">Masquer</h2>
          </div>
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/masquer" className="inline-flex">
            <Button variant="ghost" className="text-sm">Masquer</Button>
          </Link>
          <Link to="/services" className="inline-flex">
            <Button variant="ghost" className="text-sm">Services</Button>
          </Link>
          <Link to="/pricing" className="inline-flex">
            <Button variant="ghost" className="text-sm">Pricing</Button>
          </Link>
          <Link to="/contact">
            <Button className="text-sm shadow-lg shadow-[#386641]/20 bg-[#386641] hover:bg-[#386641]/90 transition-all duration-300">
              Get Started
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden flex items-center p-2 text-muted-foreground hover:text-foreground focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      <div
        className={cn(
          "md:hidden w-full overflow-hidden transition-all duration-300",
          mobileMenuOpen ? "max-h-64 opacity-100 mt-4" : "max-h-0 opacity-0"
        )}
      >
        <div className="space-y-2 p-2 flex flex-col">
          <Link to="/masquer" onClick={() => setMobileMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-left">Masquer</Button>
          </Link>
          <Link to="/services" onClick={() => setMobileMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-left">Services</Button>
          </Link>
          <Link to="/pricing" onClick={() => setMobileMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-left">Pricing</Button>
          </Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
            <Button className="w-full justify-start bg-[#386641] hover:bg-[#386641]/90">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
