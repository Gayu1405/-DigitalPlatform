import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Users } from "lucide-react";
import { api } from "@/lib/api";

interface Drive {
  id: number;
  name: string;
  jobRole: string;
  ctcRange: string;
  location: string;
  driveDate: string;
  driveTime: string;
  registrationDeadline: string;
  appliedStudents: number;
  requiredStudents: number;
  status: string;
  type?: string;
}

const PlacementsSection = () => {
  const navigate = useNavigate();
  const [drives, setDrives] = useState<Drive[]>([]);

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const data = await api.getDrives();
        setDrives(data);
      } catch (error) {
        console.error("Failed to fetch drives:", error);
      }
    };

    fetchDrives();
    const interval = setInterval(fetchDrives, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return { day: "", month: "" };
    const date = new Date(dateStr);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("en-GB", { month: "short" }).toUpperCase()
    };
  };

  const handleRegister = () => {
    navigate("/login");
  };

  return (
    <section id="placements" className="py-24">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Don't Miss <span className="text-gradient">Out</span>
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Stay updated with placement drives
            </p>
            <Button size="lg" className="gap-2" onClick={() => navigate("/login")}>Apply Now</Button>
          </motion.div>

          <div className="space-y-4">
            {drives.slice(0, 4).map((drive, i) => {
                const { day, month } = formatDate(drive.drive_date || drive.driveDate);
                return (
                  <motion.div
                    key={drive.id}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="glass rounded-xl p-5 hover:glow-border transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 rounded-lg p-3 text-center min-w-[60px]">
                        <span className="text-lg font-bold text-primary block">{day}</span>
                        <span className="text-xs text-muted-foreground">{month}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{drive.name}</h4>
                        <p className="text-sm text-muted-foreground">{drive.job_role || drive.jobRole}</p>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {drive.drive_time || drive.driveTime || "9:00 AM - 5:00 PM"}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {drive.location || "Main Auditorium"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={12} />
                            {drive.required_students || drive.requiredStudents || 150} spots
                          </span>
                        </div>
                      </div>
                      <Button size="sm" onClick={handleRegister}>
                        Register
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlacementsSection;
