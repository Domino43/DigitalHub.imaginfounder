import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Heart, Home, Sparkles } from 'lucide-react';
import { getProducts, getProductQuantities } from '@/api/EcommerceApi';
import ProductCard3D from '@/components/ProductCard3D';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CATEGORY_TREE } from '@/data/categories';
import { BRAND } from '@/brand';

const featuredCategories = CATEGORY_TREE.slice(0, 6);

const HomePage = ({ setIsCartOpen }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const productsResponse = await getProducts({ limit: '8' });

        if (productsResponse.products.length > 0) {
          const productIds = productsResponse.products.map(p => p.id);
          const quantitiesResponse = await getProductQuantities({
            fields: 'inventory_quantity',
            product_ids: productIds
          });

          const variantQuantityMap = new Map();
          quantitiesResponse.variants.forEach(variant => {
            variantQuantityMap.set(variant.id, variant.inventory_quantity);
          });

          const productsWithQuantities = productsResponse.products.map(product => ({
            ...product,
            variants: product.variants.map(variant => ({
              ...variant,
              inventory_quantity: variantQuantityMap.get(variant.id) ?? variant.inventory_quantity
            }))
          }));

          setFeaturedProducts(productsWithQuantities.slice(0, 8));
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <>
      <Helmet>
        <title>DigitalHub — ADHD-friendly tools that work with your brain</title>
        <meta name="description" content="DigitalHub makes ADHD-friendly planners, printables, and kid tools. Clear pages. One next step. Built for adults with ADHD and parents of ADHD kids." />
      </Helmet>
      <Header setIsCartOpen={setIsCartOpen} />

      <section className="relative min-h-[88dvh] flex items-center overflow-hidden bg-background">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-24 -right-16 w-80 h-80 rounded-[2.5rem] bg-primary/10" />
          <div className="absolute bottom-10 left-8 w-24 h-24 rounded-full bg-accent/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl"
          >
            <p className="inline-flex items-center rounded-full border border-primary/30 bg-card px-3 py-1 text-sm font-medium text-primary mb-6">
              {BRAND.badge}
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold mb-5 text-balance" style={{letterSpacing: '-0.02em'}}>
              {BRAND.tagline}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              {BRAND.mission}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/products">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-3d-md text-base px-7 py-6">
                  Shop ADHD-friendly tools
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#who-its-for">
                <Button variant="outline" size="lg" className="text-base px-7 py-6">
                  See who it is for
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="who-its-for" className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-3" style={{letterSpacing: '-0.02em'}}>
              Built for ADHD brains, and the people who love them
            </h2>
            <p className="text-lg text-muted-foreground">
              {BRAND.valueProposition}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Brain, ...BRAND.audiences[0] },
              { icon: Heart, ...BRAND.audiences[1] },
              { icon: Home, ...BRAND.audiences[2] },
            ].map((item) => (
              <div key={item.title} className="card-3d p-7">
                <item.icon className="h-7 w-7 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-3" style={{letterSpacing: '-0.02em'}}>
              Why DigitalHub feels different
            </h2>
            <p className="text-lg text-muted-foreground">
              We design against overwhelm. Every page should answer: what do I do next?
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {BRAND.principles.map((principle) => (
              <div key={principle} className="flex items-start gap-3 rounded-2xl bg-card border border-border p-5">
                <Sparkles className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                <p className="font-medium">{principle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-3" style={{letterSpacing: '-0.02em'}}>
              Start here
            </h2>
            <p className="text-lg text-muted-foreground">
              Low-friction tools first. Browse the rest when you have the energy.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card-3d h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <ProductCard3D key={product.id} product={product} index={index} />
              ))}
            </div>
          )}

          <div className="mt-12">
            <Link to="/products">
              <Button variant="outline" size="lg" className="shadow-3d-sm">
                Browse the full shop
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-3" style={{letterSpacing: '-0.02em'}}>
              Shop by need
            </h2>
            <p className="text-lg text-muted-foreground">
              Six starting points. Not eighteen competing choices.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCategories.map((category) => (
              <Link key={category.name} to={`/products?category=${encodeURIComponent(category.name)}`}>
                <div className="card-3d p-8 h-full">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {category.name}
                  </h3>
                  {category.children?.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {category.children.slice(0, 3).join(' · ')}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;
