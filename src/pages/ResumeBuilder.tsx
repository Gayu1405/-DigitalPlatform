import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  FileText,
  Download,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Award,
  Code,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Languages,
  Star,
  RefreshCw,
  Eye,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

interface ResumeData {
  personal: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
  };
  objective: string;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    percentage: string;
  }>;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
  }>;
  internships: Array<{
    company: string;
    duration: string;
    description: string;
  }>;
  certifications: string[];
  languages: string[];
}

const templates = [
  { id: "fresher", name: "Fresher Resume", description: "Clean and simple template for fresh graduates" },
  { id: "technical", name: "Technical Resume", description: "Focus on technical skills and projects" },
  { id: "modern", name: "Modern Resume", description: "Contemporary design with modern layout" },
];

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [resumeData, setResumeData] = useState<ResumeData>({
    personal: {
      name: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: ""
    },
    objective: "",
    education: [
      { degree: "", institution: "", year: "", percentage: "" }
    ],
    skills: [],
    projects: [
      { name: "", description: "", technologies: "" }
    ],
    internships: [
      { company: "", duration: "", description: "" }
    ],
    certifications: [],
    languages: []
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState("fresher");
  const [generatedResume, setGeneratedResume] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);
  const [aiScore, setAiScore] = useState(0);
  const [skillInput, setSkillInput] = useState("");
  const [certificationInput, setCertificationInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");

  useEffect(() => {
    const isStudent = localStorage.getItem("isStudentAuthenticated");
    if (!isStudent) {
      navigate("/login");
      return;
    }

    const currentStudent = localStorage.getItem("currentStudent");
    if (currentStudent) {
      const student = JSON.parse(currentStudent);
      setResumeData(prev => ({
        ...prev,
        personal: {
          name: `${student.firstName} ${student.lastName}`,
          email: student.email || "",
          phone: student.phone || "",
          location: `${student.city || ""}, ${student.state || ""}`.trim(),
          linkedin: "",
          github: ""
        },
        objective: `To obtain a challenging position in a reputed organization where I can utilize my ${student.branch || "engineering"} skills and knowledge to contribute to the growth of the organization while enhancing my professional skills.`,
        education: [
          {
            degree: student.branch || "B.Tech",
            institution: "Your University",
            year: "2021-2025",
            percentage: student.currentCGPA || "8.5"
          }
        ]
      }));
    }
  }, [navigate]);

  const generateAIResume = () => {
    const resume = `
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
  <header style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px;">
    <h1 style="margin: 0; font-size: 28px;">${resumeData.personal.name}</h1>
    <p style="margin: 5px 0; color: #666;">
      ${resumeData.personal.email} | ${resumeData.personal.phone} | ${resumeData.personal.location}
    </p>
    ${resumeData.personal.linkedin || resumeData.personal.github ? `
    <p style="margin: 5px 0; color: #0066cc;">
      ${resumeData.personal.linkedin ? `LinkedIn: ${resumeData.personal.linkedin}` : ""}
      ${resumeData.personal.github ? ` | GitHub: ${resumeData.personal.github}` : ""}
    </p>
    ` : ""}
  </header>

  <section style="margin-bottom: 20px;">
    <h2 style="background: #333; color: white; padding: 8px 15px; margin: 0 0 15px 0; font-size: 16px;">CAREER OBJECTIVE</h2>
    <p style="margin: 0; line-height: 1.6;">${resumeData.objective}</p>
  </section>

  <section style="margin-bottom: 20px;">
    <h2 style="background: #333; color: white; padding: 8px 15px; margin: 0 0 15px 0; font-size: 16px;">EDUCATION</h2>
    ${resumeData.education?.map(edu => `
    <div style="margin-bottom: 10px;">
      <div style="display: flex; justify-content: space-between;">
        <strong>${edu.degree}</strong>
        <span>${edu.year}</span>
      </div>
      <div style="display: flex; justify-content: space-between; color: #666;">
        <span>${edu.institution}</span>
        <span>CGPA/Percentage: ${edu.percentage}</span>
      </div>
    </div>
    `).join("")}
  </section>

  ${resumeData.skills.length > 0 ? `
  <section style="margin-bottom: 20px;">
    <h2 style="background: #333; color: white; padding: 8px 15px; margin: 0 0 15px 0; font-size: 16px;">TECHNICAL SKILLS</h2>
    <p style="margin: 0; line-height: 1.8;">
      ${resumeData.skills.join(" • ")}
    </p>
  </section>
  ` : ""}

  ${resumeData.projects.length > 0 && resumeData.projects[0].name ? `
  <section style="margin-bottom: 20px;">
    <h2 style="background: #333; color: white; padding: 8px 15px; margin: 0 0 15px 0; font-size: 16px;">PROJECTS</h2>
    ${resumeData.projects.filter(p => p.name).map(project => `
    <div style="margin-bottom: 15px;">
      <div style="display: flex; justify-content: space-between;">
        <strong>${project.name}</strong>
        <span style="color: #666;">${project.technologies}</span>
      </div>
      <p style="margin: 5px 0 0 0; color: #555; font-size: 14px;">${project.description}</p>
    </div>
    `).join("")}
  </section>
  ` : ""}

  ${resumeData.internships.length > 0 && resumeData.internships[0].company ? `
  <section style="margin-bottom: 20px;">
    <h2 style="background: #333; color: white; padding: 8px 15px; margin: 0 0 15px 0; font-size: 16px;">INTERNSHIP EXPERIENCE</h2>
    ${resumeData.internships.filter(i => i.company).map(intern => `
    <div style="margin-bottom: 15px;">
      <div style="display: flex; justify-content: space-between;">
        <strong>${intern.company}</strong>
        <span style="color: #666;">${intern.duration}</span>
      </div>
      <p style="margin: 5px 0 0 0; color: #555; font-size: 14px;">${intern.description}</p>
    </div>
    `).join("")}
  </section>
  ` : ""}

  ${resumeData.certifications.length > 0 ? `
  <section style="margin-bottom: 20px;">
    <h2 style="background: #333; color: white; padding: 8px 15px; margin: 0 0 15px 0; font-size: 16px;">CERTIFICATIONS</h2>
    <ul style="margin: 0; padding-left: 20px;">
      ${resumeData.certifications.map(cert => `<li style="margin-bottom: 5px;">${cert}</li>`).join("")}
    </ul>
  </section>
  ` : ""}

  ${resumeData.languages.length > 0 ? `
  <section style="margin-bottom: 20px;">
    <h2 style="background: #333; color: white; padding: 8px 15px; margin: 0 0 15px 0; font-size: 16px;">LANGUAGES</h2>
    <p style="margin: 0;">${resumeData.languages.join(" • ")}</p>
  </section>
  ` : ""}
</div>
    `;

    setGeneratedResume(resume);
    
    let score = 0;
    if (resumeData.personal.name && resumeData.personal.email) score += 20;
    if (resumeData.objective) score += 15;
    if (resumeData.education[0].degree) score += 15;
    if (resumeData.skills.length >= 5) score += 20;
    if (resumeData.projects.filter(p => p.name).length >= 1) score += 15;
    if (resumeData.internships.filter(i => i.company).length >= 1) score += 15;
    setAiScore(score);

    toast({
      title: "Resume Generated",
      description: `AI Resume Score: ${score}%`,
    });
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addCertification = () => {
    if (certificationInput.trim()) {
      setResumeData(prev => ({
        ...prev,
        certifications: [...prev.certifications, certificationInput.trim()]
      }));
      setCertificationInput("");
    }
  };

  const addLanguage = () => {
    if (languageInput.trim()) {
      setResumeData(prev => ({
        ...prev,
        languages: [...prev.languages, languageInput.trim()]
      }));
      setLanguageInput("");
    }
  };

  const downloadResume = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(generatedResume);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-orange-500";
    return "text-red-500";
  };

  const getImprovements = () => {
    const improvements = [];
    if (!resumeData.personal.linkedin) improvements.push("Add LinkedIn profile link");
    if (!resumeData.personal.github) improvements.push("Add GitHub profile link");
    if (resumeData.skills.length < 5) improvements.push("Add more technical skills");
    if (!resumeData.projects[0]?.name) improvements.push("Add project details");
    if (!resumeData.internships[0]?.company) improvements.push("Add internship experience");
    if (resumeData.certifications.length < 2) improvements.push("Add relevant certifications");
    if (resumeData.languages.length < 1) improvements.push("Add languages you know");
    return improvements;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="glass border-b border-border/30 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
            >
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold">AI Resume Builder</h1>
              <p className="text-sm text-muted-foreground">Create Professional Resumes</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? "Edit" : "Preview"}
            </Button>
            <Button variant="outline" onClick={() => navigate("/student-dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  Select Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedTemplate === template.id 
                          ? "border-primary bg-primary/5" 
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="w-full h-20 bg-muted rounded mb-2 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-center">{template.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input 
                      value={resumeData.personal.name}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, name: e.target.value }
                      }))}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input 
                      value={resumeData.personal.email}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, email: e.target.value }
                      }))}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input 
                      value={resumeData.personal.phone}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, phone: e.target.value }
                      }))}
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input 
                      value={resumeData.personal.location}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, location: e.target.value }
                      }))}
                      placeholder="Mumbai, Maharashtra"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>LinkedIn (Optional)</Label>
                    <Input 
                      value={resumeData.personal.linkedin}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, linkedin: e.target.value }
                      }))}
                      placeholder="linkedin.com/in/username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>GitHub (Optional)</Label>
                    <Input 
                      value={resumeData.personal.github}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, github: e.target.value }
                      }))}
                      placeholder="github.com/username"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Career Objective
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={resumeData.objective}
                  onChange={(e) => setResumeData(prev => ({ ...prev, objective: e.target.value }))}
                  placeholder="Write your career objective..."
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>

            <Card className="glass border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Technical Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add a skill (e.g., Python, Java, React)"
                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                  />
                  <Button onClick={addSkill}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(idx)}>
                      {skill} ×
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resumeData.projects.map((project, idx) => (
                  <div key={idx} className="p-4 border rounded-lg space-y-3">
                    <Input 
                      value={project.name}
                      onChange={(e) => {
                        const newProjects = [...resumeData.projects];
                        newProjects[idx].name = e.target.value;
                        setResumeData(prev => ({ ...prev, projects: newProjects }));
                      }}
                      placeholder="Project Name"
                    />
                    <Textarea 
                      value={project.description}
                      onChange={(e) => {
                        const newProjects = [...resumeData.projects];
                        newProjects[idx].description = e.target.value;
                        setResumeData(prev => ({ ...prev, projects: newProjects }));
                      }}
                      placeholder="Project Description"
                      className="min-h-[80px]"
                    />
                    <Input 
                      value={project.technologies}
                      onChange={(e) => {
                        const newProjects = [...resumeData.projects];
                        newProjects[idx].technologies = e.target.value;
                        setResumeData(prev => ({ ...prev, projects: newProjects }));
                      }}
                      placeholder="Technologies Used (e.g., React, Node.js, MongoDB)"
                    />
                  </div>
                ))}
                <Button variant="outline" onClick={() => setResumeData(prev => ({
                  ...prev,
                  projects: [...prev.projects, { name: "", description: "", technologies: "" }]
                }))}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Project
                </Button>
              </CardContent>
            </Card>

            <Card className="glass border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Internships
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resumeData.internships.map((intern, idx) => (
                  <div key={idx} className="p-4 border rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Input 
                        value={intern.company}
                        onChange={(e) => {
                          const newInterns = [...resumeData.internships];
                          newInterns[idx].company = e.target.value;
                          setResumeData(prev => ({ ...prev, internships: newInterns }));
                        }}
                        placeholder="Company Name"
                      />
                      <Input 
                        value={intern.duration}
                        onChange={(e) => {
                          const newInterns = [...resumeData.internships];
                          newInterns[idx].duration = e.target.value;
                          setResumeData(prev => ({ ...prev, internships: newInterns }));
                        }}
                        placeholder="Duration (e.g., May-June 2024)"
                      />
                    </div>
                    <Textarea 
                      value={intern.description}
                      onChange={(e) => {
                        const newInterns = [...resumeData.internships];
                        newInterns[idx].description = e.target.value;
                        setResumeData(prev => ({ ...prev, internships: newInterns }));
                      }}
                      placeholder="What did you learn? What were your responsibilities?"
                      className="min-h-[80px]"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    value={certificationInput}
                    onChange={(e) => setCertificationInput(e.target.value)}
                    placeholder="Add certification (e.g., AWS Certified)"
                    onKeyPress={(e) => e.key === "Enter" && addCertification()}
                  />
                  <Button onClick={addCertification}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resumeData.certifications.map((cert, idx) => (
                    <Badge key={idx} variant="outline" className="cursor-pointer" onClick={() => setResumeData(prev => ({
                      ...prev,
                      certifications: prev.certifications.filter((_, i) => i !== idx)
                    }))}>
                      {cert} ×
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="w-5 h-5" />
                  Languages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    value={languageInput}
                    onChange={(e) => setLanguageInput(e.target.value)}
                    placeholder="Add language (e.g., English, Hindi)"
                    onKeyPress={(e) => e.key === "Enter" && addLanguage()}
                  />
                  <Button onClick={addLanguage}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resumeData.languages.map((lang, idx) => (
                    <Badge key={idx} variant="secondary" className="cursor-pointer" onClick={() => setResumeData(prev => ({
                      ...prev,
                      languages: prev.languages.filter((_, i) => i !== idx)
                    }))}>
                      {lang} ×
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button onClick={generateAIResume} className="w-full" size="lg">
              <Sparkles className="w-5 h-5 mr-2" />
              Generate AI Resume
            </Button>
          </div>

          <div className="space-y-6">
            <Card className="glass border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  AI Resume Score
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className={`text-4xl font-bold ${getScoreColor(aiScore)}`}>{aiScore}%</p>
                  <Progress value={aiScore} className="mt-2" />
                </div>
                
                {aiScore > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Improvements:</p>
                    {getImprovements().length === 0 ? (
                      <p className="text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Your resume looks great!
                      </p>
                    ) : (
                      <ul className="space-y-1">
                        {getImprovements().map((item, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {generatedResume && (
              <Card className="glass border-border/30">
                <CardHeader>
                  <CardTitle>Download Resume</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button onClick={downloadResume} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
