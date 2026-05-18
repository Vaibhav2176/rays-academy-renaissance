import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Home, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SEO from "@/components/shared/SEO";

const ThankYou = () => {
  const location = useLocation();
  const formType = (location.state as { formType?: string } | null)?.formType ?? "your enquiry";

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-background to-secondary/30 px-4 py-24">
      <SEO
        title="Thank You – Rays Academy Bhopal"
        description="Thank you for reaching out to Rays Academy. Our team will contact you shortly."
        canonical="/thank-you"
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl"
      >
        <Card className="border-0 shadow-2xl overflow-hidden">
          <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-primary" />
          <CardContent className="p-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              Thank You!
            </h1>
            <p className="text-muted-foreground text-lg mb-2">
              We have received {formType}.
            </p>
            <p className="text-muted-foreground mb-8">
              A member of the Rays Academy team will reach out to you within 24 hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" /> Back to Home
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="tel:+919303333490">
                  <Phone className="w-4 h-4 mr-2" /> Call Us
                </a>
              </Button>
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                <a
                  href="https://wa.me/917024057876"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ThankYou;
