import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGalleryImages } from '@/hooks/useGalleryImages';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

const Gallery = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [currentCategory, setCurrentCategory] = useState('academy');
  
  const { data: images, isLoading } = useGalleryImages();
  
  const galleryImages = useMemo(() => {
    if (!images) return { academy: [], events: [], achievements: [] };
    
    return images.reduce((acc, image) => {
      const category = image.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(image.image_url);
      return acc;
    }, {} as Record<string, string[]>);
  }, [images]);
  
  const categories = ['academy', 'events', 'achievements'].filter(
    cat => galleryImages[cat]?.length > 0
  );

  const openLightbox = (category: string, index: number) => {
    setCurrentCategory(category);
    setCurrentImage(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    const imgs = galleryImages[currentCategory] || [];
    setCurrentImage((prev) => (prev + 1) % imgs.length);
  };

  const prevImage = () => {
    const imgs = galleryImages[currentCategory] || [];
    setCurrentImage((prev) => (prev - 1 + imgs.length) % imgs.length);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-rays-blue-700 to-primary" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-rays-blue-400/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground mb-6">
              Our Gallery
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Explore our memorable moments, achievements, and inspiring journeys
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="academy" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
              <TabsTrigger value="academy">Academy</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            {['academy', 'events', 'achievements'].map((category) => (
              <TabsContent key={category} value={category}>
                <motion.div
                  initial="initial"
                  animate="animate"
                  variants={stagger}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {(galleryImages[category] || []).map((image, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      whileHover={{ scale: 1.02 }}
                      className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
                      onClick={() => openLightbox(category, index)}
                    >
                      <img
                        src={image}
                        loading="lazy"
                        alt={`Gallery ${category} ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-primary-foreground font-medium">View Image</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              onClick={closeLightbox}
            >
              <X className="w-6 h-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>

            <motion.img
              key={currentImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={(galleryImages[currentCategory] || [])[currentImage]}
              alt="Gallery"
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              <ChevronRight className="w-8 h-8" />
            </Button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {currentImage + 1} / {(galleryImages[currentCategory] || []).length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
