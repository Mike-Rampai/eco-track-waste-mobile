
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-r from-eco-green-light/5 to-eco-blue-light/5 px-4">
      <div className="text-center max-w-md">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-eco-green-dark/20 to-eco-blue-dark/20 rounded-full transform rotate-6"></div>
          <div className="relative z-10 bg-muted rounded-full w-24 h-24 flex items-center justify-center mx-auto">
            <span className="text-5xl font-bold text-primary">404</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4 flutter-text-gradient">Page Not Found</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Oops! We couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        <Link to="/">
          <Button className="flutter-button" size="lg">
            <HomeIcon className="h-4 w-4 mr-2" />
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
