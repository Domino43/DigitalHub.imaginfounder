import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SuccessPage = ({ setIsCartOpen }) => {
  return (
    <>
      <Helmet>
        <title>Order Successful - DigitalHub</title>
        <meta name="description" content="Your order has been successfully placed. Thank you for your purchase!" />
      </Helmet>
      <Header setIsCartOpen={setIsCartOpen} />
      
      <div className="min-h-[60vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/20 mb-6 shadow-3d-lg">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{letterSpacing: '-0.02em'}}>
            Order successful
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            Thank you for your purchase! Your order has been confirmed and you'll receive an email with your digital products shortly.
          </p>
          
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