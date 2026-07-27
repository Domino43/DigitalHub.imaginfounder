import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Download, Loader2, FileText, Package } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Product ID to display name mapping
const PRODUCT_NAMES = {
  'mock-daily-planner': 'Premium Aesthetic Daily Planner',
  'mock-digital-stickers': 'Whimsical Digital Stickers Bundle',
  'mock-website-template': 'Modern Minimalist Creator Website Template',
  'mock-childrens-book': 'The Magical Forest Adventures',
  'mock-tshirt-design': 'Streetwear Typography T-Shirt Vector Pack',
  'mock-figma-uikit': 'AuraUI - Glassmorphic Design System & UI Kit',
  'mock-gallery-app': 'ArtDisplay - Minimalist Portfolio Gallery React App',
  'mock-software-tool': 'CodeSwift - Desktop Markdown Editor & Snippet Manager',
  'mock-stock-photos': 'Candid Warm Tone Creator Workspace Stock Photo Pack',
  'mock-adhd-budget-planner': 'ADHD-Friendly Budget & Habit Planner'
};

const SuccessPage = ({ setIsCartOpen }) => {
  const [searchParams] = useSearchParams();
  const [downloadLinks, setDownloadLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get order info from URL params (passed from checkout) or from cart
  const orderId = searchParams.get('order_id') || `order_${Date.now()}`;
  const productIdsParam = searchParams.get('products') || '';

  useEffect(() => {
    const generateDownloadLinks = async () => {
      try {
        // If no products in URL, try to get from localStorage (cart)
        let productIds = productIdsParam 
          ? productIdsParam.split(',').filter(Boolean)
          : [];

        // If no products specified, show all mock products as demo
        if (productIds.length === 0) {
          productIds = Object.keys(PRODUCT_NAMES);
        }

        // Generate tokens via API
        const response = await fetch('/api/generate-tokens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, productIds })
        });

        if (response.ok) {
          const data = await response.json();
          const links = data.tokens.map(({ productId, token }) => ({
            productId,
            productName: PRODUCT_NAMES[productId] || productId,
            downloadUrl: `/api/download?token=${token}&product=${productId}`
          }));
          setDownloadLinks(links);
        } else {
          // Fallback: generate links without token (for demo mode)
          const links = productIds.map(productId => ({
            productId,
            productName: PRODUCT_NAMES[productId] || productId,
            downloadUrl: `/api/download?token=demo&product=${productId}`
          }));
          setDownloadLinks(links);
        }
      } catch (err) {
        console.error('Download link generation failed:', err);
        setError('Unable to generate download links. Please contact support.');
      } finally {
        setLoading(false);
      }
    };

    generateDownloadLinks();
  }, [orderId, productIdsParam]);

  return (
    <>
      <Helmet>
        <title>Order Successful - DigitalHub</title>
        <meta name="description" content="Your order has been successfully placed. Download your digital products here." />
      </Helmet>
      <Header setIsCartOpen={setIsCartOpen} />
      
      <div className="min-h-[60vh] px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/20 mb-6 shadow-3d-lg">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{letterSpacing: '-0.02em'}}>
              Order successful
            </h1>
            
            <p className="text-xl text-muted-foreground mb-2">
              Thank you for your purchase! Your order has been confirmed.
            </p>
            <p className="text-sm text-muted-foreground">
              Order ID: <span className="font-mono font-semibold">{orderId}</span>
            </p>
          </div>

          {/* Download Section */}
          <div className="card-3d soft-reflection p-8 mb-8">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Download className="h-6 w-6 text-primary" />
              Your Digital Downloads
            </h2>
            <p className="text-muted-foreground mb-6">
              Download links are valid for 7 days. Save your files to a safe location.
            </p>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <span className="ml-3 text-muted-foreground">Preparing your downloads...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-destructive mb-4">{error}</p>
                <p className="text-sm text-muted-foreground">
                  Contact <a href="mailto:support@digitalhub.com" className="text-primary underline">support@digitalhub.com</a> with your order ID.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {downloadLinks.map((link, index) => (
                  <motion.div
                    key={link.productId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{link.productName}</p>
                        <p className="text-xs text-muted-foreground">Digital download</p>
                      </div>
                    </div>
                    <a
                      href={link.downloadUrl}
                      download
                      className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all shadow-3d-sm hover:shadow-3d-md active:scale-[0.98]"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="card-3d p-6 mb-8 bg-primary/5 border-primary/20">
            <div className="flex gap-3">
              <Package className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">Important Download Information</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Download links expire in 7 days</li>
                  <li>Each file is licensed for single-user use</li>
                  <li>Save your files immediately after download</li>
                  <li>Need help? Email support@digitalhub.com</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-3d-md hover:shadow-3d-lg transition-all">
                Continue Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="outline" className="shadow-3d-sm hover:shadow-3d-md transition-all">
                Back to Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </>
  );
};

export default SuccessPage;