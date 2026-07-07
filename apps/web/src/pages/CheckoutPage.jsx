import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { motion } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// PayPal Client ID - will be loaded from environment
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'YOUR_PAYPAL_CLIENT_ID';

function CheckoutPage({ setIsCartOpen }) {
  const navigate = useNavigate();
  const { cart, getCartTotal, getCartItems, clearCart } = useCart();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const cartItems = getCartItems();
  const totalAmount = getCartTotal();

  useEffect(() => {
    // Redirect if cart is empty
    if (cartItems.length === 0) {
      navigate('/products');
    }
  }, [cartItems, navigate]);

  /**
   * Create PayPal order
   */
  const createOrder = async (data, actions) => {
    try {
      // Format cart items for PayPal
      const items = cartItems.map(item => ({
        id: item.product.id,
        title: item.product.title,
        price_in_cents: item.variant.price_in_cents,
        quantity: item.quantity,
      }));

      // Call our backend to create PayPal order
      const response = await fetch('/api/paypal-create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await response.json();
      return orderData.id;

    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: 'Error',
        description: 'Failed to initialize payment. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  /**
   * Capture PayPal order after approval
   */
  const onApprove = async (data, actions) => {
    setIsProcessing(true);

    try {
      // Call our backend to capture the order
      const response = await fetch('/api/paypal-capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderID: data.orderID }),
      });

      if (!response.ok) {
        throw new Error('Failed to capture payment');
      }

      const captureData = await response.json();

      // Extract product IDs from the captured order
      const productIds = captureData.productIds || [];

      // Clear cart
      clearCart();

      // Redirect to success page with product IDs for download
      const params = new URLSearchParams();
      if (productIds.length > 0) {
        params.set('products', productIds.join(','));
      }
      params.set('order', data.orderID);

      toast({
        title: 'Payment Successful!',
        description: 'Redirecting to your downloads...',
      });

      navigate(`/success?${params.toString()}`);

    } catch (error) {
      console.error('Capture error:', error);
      toast({
        title: 'Payment Error',
        description: 'Your payment was processed but we could not complete the order. Please contact support.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Handle PayPal error
   */
  const onError = (err) => {
    console.error('PayPal error:', err);
    toast({
      title: 'Payment Error',
      description: 'Something went wrong with PayPal. Please try again.',
      variant: 'destructive',
    });
    setIsProcessing(false);
  };

  /**
   * Handle PayPal cancel
   */
  const onCancel = () => {
    toast({
      title: 'Payment Cancelled',
      description: 'Your PayPal payment was cancelled.',
    });
    setIsProcessing(false);
  };

  // Format currency
  const formatPrice = (cents) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  return (
    <PayPalScriptProvider options={{
      clientId: PAYPAL_CLIENT_ID,
      currency: 'USD',
      intent: 'capture',
    }}>
      <div className="min-h-screen bg-background flex flex-col">
        <Header setIsCartOpen={setIsCartOpen} />

        <Helmet>
          <title>Checkout - DigitalHub</title>
          <meta name="description" content="Complete your purchase securely with PayPal on DigitalHub." />
        </Helmet>

        <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Back button */}
            <Button
n                      layout: 'vertical',
                      color: 'gold',
                      shape: 'rect',
                      label: 'paypal',
                    }}
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                    onCancel={onCancel}
                    disabled={isProcessing}
                  />
                </div>
              )}
            </div>

            {/* Security Notice */}
            <div className="text-center text-sm text-muted-foreground">
              <p>🔒 Secure checkout powered by PayPal</p>
              <p className="mt-1">Your payment information is encrypted and secure</p>
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </PayPalScriptProvider>
  );
}

export default CheckoutPage;
