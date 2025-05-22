
import React from 'react';
import { RecycleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-muted/50 py-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <RecycleIcon className="h-6 w-6 text-eco-green-dark mr-2" strokeWidth={1.5} />
            <span className="text-lg font-bold flutter-text-gradient">E-Cycle</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/register" className="text-muted-foreground hover:text-primary transition-colors">Register Item</Link>
            <Link to="/request" className="text-muted-foreground hover:text-primary transition-colors">Collection Request</Link>
            <Link to="/information" className="text-muted-foreground hover:text-primary transition-colors">Information</Link>
          </div>
        </div>
        
        <div className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground text-center">
          <p>© {new Date().getFullYear()} E-Cycle. All rights reserved.</p>
          <p className="mt-2">Making e-waste management simple and sustainable.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
