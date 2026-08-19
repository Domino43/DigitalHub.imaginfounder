import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';
import { PARENT_CATEGORIES } from '@/data/categories';

const Footer = () => {
  const categories = PARENT_CATEGORIES;

  return (
    <footer className="bg-secondary text-secondary-foreground mt-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl shadow-3d-md flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-xl font-bold" style={{letterSpacing: '-0.02em'}}>
                DigitalHub
              </span>
            </div>
            <p className="text-sm opacity-80 mb-4">
              Premium digital products for moms, daughters, girlfriends, and DIY projects.
            </p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/Imaginfounder/" className="w-9 h-9 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center shadow-3d-sm">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center shadow-3d-sm">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center shadow-3d-sm">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center shadow-3d-sm">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          <div>
            <span className="font-semibold mb-4 block">Quick Links</span>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="opacity-80 hover:opacity-100 hover:text-primary transition-all">Home</Link></li>
              <li><Link to="/products" className="opacity-80 hover:opacity-100 hover:text-primary transition-all">Products</Link></li>
              <li><a href="https://hpanel.hostinger.com" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 hover:text-primary transition-all">Admin Login</a></li>
            </ul>
          </div>
          
          <div>
            <span className="font-semibold mb-4 block">Categories</span>
            <ul className="space-y-2 text-sm">
              {categories.map((category) => (
                <li key={category}>
                  <Link to={`/products?category=${encodeURIComponent(category)}`} className="opacity-80 hover:opacity-100 hover:text-primary transition-all">
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <span className="font-semibold mb-4 block">Contact</span>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 opacity-80">
                <Mail className="h-4 w-4" />
                <span>support@digitalhub.com</span>
              </li>
            </ul>
            <div className="mt-6">
              <span className="font-semibold mb-2 block">Legal</span>
              <ul className="space-y-2 text-sm">
                <li><a href="https://digital-finds.imaginfounder.com/privacy-policy" className="opacity-80 hover:opacity-100 hover:text-primary transition-all">Privacy Policy</a></li>
                <li><a href="https://digital-finds.imaginfounder.com/terms---conditions" className="opacity-80 hover:opacity-100 hover:text-primary transition-all">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-sm opacity-70">
          <p>&copy; 2026 DigitalHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;