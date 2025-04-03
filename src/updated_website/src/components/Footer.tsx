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
              {/* "Small feedback loops help grow your idea." text removed */}
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
    viewBox="0 0 600 530"
    fill="currentColor"
    className={cn("w-4 h-4", className)}
  >
    <path d="m135.72 44.03c66.496 49.921 138.02 151.14 164.28 205.46 26.262-54.316 97.782-155.54 164.28-205.46 47.98-36.021 125.72-63.892 125.72 24.795 0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.3797-3.6904-10.832-3.7077-7.8964-0.0174-2.9357-1.1937 0.51669-3.7077 7.8964-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.4491-163.25-81.433-5.9562-21.282-16.111-152.36-16.111-170.07 0-88.687 77.742-60.816 125.72-24.795z" />
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
