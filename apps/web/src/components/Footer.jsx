import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Mail } from 'lucide-react';
import { PARENT_CATEGORIES } from '@/data/categories';
import BrandMark from '@/components/BrandMark';
import { BRAND } from '@/brand';

const Footer = () => {
  const categories = PARENT_CATEGORIES.slice(0, 8);

  return (
    <footer className="bg-secondary text-secondary-foreground mt-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <BrandMark />
            </div>
            <p className="text-sm opacity-80 mb-3">
              {BRAND.mission}
            </p>
            <p className="text-sm font-medium mb-4">
              {BRAND.tagline}
            </p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/Imaginfounder/" className="w-9 h-9 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center shadow-3d-sm" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <span className="font-semibold mb-4 block">Quick links</span>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="opacity-80 hover:opacity-100 hover:text-primary transition-all">Home</Link></li>
              <li><Link to="/products" className="opacity-80 hover:opacity-100 hover:text-primary transition-all">Shop tools</Link></li>
              <li><a href="/#who-its-for" className="opacity-80 hover:opacity-100 hover:text-primary transition-all">Who it is for</a></li>
            </ul>
          </div>

          <div>
            <span className="font-semibold mb-4 block">Start with</span>
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
                <a href={`mailto:${BRAND.supportEmail}`}>{BRAND.supportEmail}</a>
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

        <div className="border-t border-border mt-8 pt-8 text-sm opacity-70">
          <p>&copy; 2026 DigitalHub. Tools that work with your brain.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
