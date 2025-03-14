
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#F2E8CF]/30 py-16">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <img 
              src="/lovable-uploads/4e0869d0-5dec-43e1-83e6-d434fdf50bcd.png" 
              alt="Corewood Logo" 
              className="h-8"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Small feedback loops help grow your idea.
            </p>
          </div>
          
          <div className="flex space-x-4">
            {socialLinks.map((link, index) => (
              <a 
                key={index}
                href={link.href} 
                aria-label={link.label}
                className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center transition-colors hover:bg-[#386641]/10 hover:text-[#386641]"
              >
                <link.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-[#A7C957]/30 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} Corewood. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a 
              href="mailto:hello@corewood.info" 
              className="text-xs text-muted-foreground hover:text-[#386641] transition-colors"
            >
              Contact Us
            </a>
            {legalLinks.map((link, index) => (
              <a 
                key={index}
                href={link.href} 
                className="text-xs text-muted-foreground hover:text-[#386641] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

// Social media icons
const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={cn("w-4 h-4", className)}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Bluesky icon
const BlueskyIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={cn("w-4 h-4", className)}
  >
    <path d="M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0" />
    <path d="M7.5 9h9v8.5" />
    <path d="M13 15l3.5 -3.5" />
    <path d="M10 12l-2.5 2.5" />
  </svg>
);

const socialLinks = [
  { icon: LinkedInIcon, href: "https://www.linkedin.com/company/corewood-llc", label: "LinkedIn" },
  { icon: BlueskyIcon, href: "https://bsky.app/profile/corewood.cloud", label: "Bluesky" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

export default Footer;
