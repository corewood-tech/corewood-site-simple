import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Page Not Found"
        description="The page you are looking for does not exist. Return to the Corewood homepage to explore our AI solutions."
        keywords="404, page not found, corewood"
      />
      <Header />
      <main className="pt-32 pb-24 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-5xl font-display font-bold mb-6 text-[#386641]">404</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
          <Button asChild className="bg-[#386641] hover:bg-[#386641]/90">
            <a href="/">Return to Homepage</a>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
