import { motion } from "framer-motion";
import { Clock, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import codingBg from "@/assets/coding-bg.webp";

const programs = [
  {
    title: "Full Stack Development",
    duration: "6 Months",
    students: "1200+",
    tags: ["React", "Node.js", "MongoDB"],
  },
  {
    title: "Data Science & AI",
    duration: "5 Months",
    students: "800+",
    tags: ["Python", "ML", "TensorFlow"],
  },
  {
    title: "Cloud & DevOps",
    duration: "4 Months",
    students: "600+",
    tags: ["AWS", "Docker", "Kubernetes"],
  },
  {
    title: "Cybersecurity",
    duration: "5 Months",
    students: "450+",
    tags: ["Ethical Hacking", "SIEM", "Forensics"],
  },
];

const ProgramsSection = () => {
  return (
    <section id="programs" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={codingBg} alt="" className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-background/85" />
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Training <span className="text-gradient">Programs</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Industry-driven curricula designed to make you job-ready
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {programs.map((program, i) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-6 hover:glow-border transition-all duration-300 group"
            >
              <h3 className="text-xl font-bold text-foreground mb-3">{program.title}</h3>
              <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><Clock size={14} /> {program.duration}</span>
                <span className="flex items-center gap-1"><Users size={14} /> {program.students}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                {program.tags.map((tag) => (
                  <span key={tag} className="text-xs font-mono px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                    {tag}
                  </span>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary hover:bg-primary/10 p-0">
                Learn More <ArrowRight size={14} />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
