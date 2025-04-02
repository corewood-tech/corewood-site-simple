import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
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

        <div className="flex items-center space-x-4">
          <Link to="/masquer" className="hidden md:inline-flex">
            <Button variant="ghost" className="text-sm">Masquer</Button>
          </Link>
          <Link to="/services" className="hidden md:inline-flex">
            <Button variant="ghost" className="text-sm">Services</Button>
          </Link>
          <Link to="/pricing" className="hidden md:inline-flex">
            <Button variant="ghost" className="text-sm">Pricing</Button>
          </Link>
          <Link to="/contact">
            <Button className="text-sm shadow-lg shadow-[#386641]/20 bg-[#386641] hover:bg-[#386641]/90 transition-all duration-300">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
