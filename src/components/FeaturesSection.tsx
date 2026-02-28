import { motion } from "framer-motion";
import { Zap, Target, CheckCircle, Clock, BarChart3, Mail, Shield } from "lucide-react";
import codingBg from "@/assets/coding-bg.webp";

const features = [
  {
    icon: Zap,
    title: "Smart Automation",
    description: "Eliminates manual errors and repetitive work.",
  },
  {
    icon: Target,
    title: "Eligibility Clarity",
    description: "Students see only relevant opportunities.",
  },
  {
    icon: CheckCircle,
    title: "Efficiency",
    description: "Faster recruitment & data management.",
  },
  {
    icon: BarChart3,
    title: "Insights & Analytics",
    description: "Better decisions through reports.",
  },
  {
    icon: Mail,
    title: "Automated Communication System",
    description: "Integrated email notifications for drive alerts, shortlisting updates, interview schedules, and results.",
  },
  {
    icon: Shield,
    title: "Admin-Level Data Controls",
    description: "Enables TPO administrators to filter, analyze, and export student records efficiently (PDF / Excel).",
  },
];

const FeaturesSection = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={codingBg} alt="" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-background/90" />
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Why Choose <span className="text-gradient">Our Platform</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Streamlined placement management for institutions and students
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-6 hover:glow-border transition-all duration-300 group"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
