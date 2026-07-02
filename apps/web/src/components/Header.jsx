import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ setIsCartOpen }) => {
  const location = useLocation();
  const { cartItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  const isActive = (path) => location.pathname === path;
  
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' }
  ];

  return (
    <header className="sticky top-0 z-40 glass-effect border-b border-border shadow-3d-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl shadow-3d-md flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="text-xl font-bold" style={{letterSpacing: '-0.02em'}}>
              DigitalHub
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors relative ${
                  isActive(link.path)
                    ? 'text-primary'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            <a
              href="https://hpanel.hostinger.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Admin Login
            </a>
          </nav>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsCartOpen(true)}
              variant="outline"
              size="icon"
              className="relative shadow-3d-sm hover:shadow-3d-md transition-all"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-3d-sm">
                  {cartItemCount}
                </span>
              )}
            </Button>
            
            <Button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              variant="outline"
              size="icon"
              className="md:hidden shadow-3d-sm"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-card"
          >
            <nav className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-primary'
                      : 'text-card-foreground hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://hpanel.hostinger.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Admin Login
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;