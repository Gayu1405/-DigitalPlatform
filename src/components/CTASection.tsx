import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, MapPin, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import codingBg from "@/assets/coding-bg.webp";

const CTASection = () => {
  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={codingBg} alt="" className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-background/85" />
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-10 sm:p-16 text-center max-w-3xl mx-auto glow-border"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Ready to <span className="text-gradient">Transform</span> Your Career?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Join thousands of professionals who launched successful tech careers through our platform.
          </p>
          
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-center gap-3 text-foreground">
              <Phone className="w-5 h-5 text-primary" />
              <span>9860919124</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-foreground">
              <MapPin className="w-5 h-5 text-primary" />
              <span>Pradnya Academy, Kolhapur, Maharashtra, India</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-foreground">
              <Mail className="w-5 h-5 text-primary" />
              <span>pradnyaacademy2017@gmail.com</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="gap-2 text-base">
              <Link to="/login">
                Get Started <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
