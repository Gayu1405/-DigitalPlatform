import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  ArrowLeft, 
  Upload, 
  FileText, 
  User, 
  Mail, 
  Phone,
  BookOpen,
  Award,
  Briefcase,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";

interface StudentRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  tenthPercentage: string;
  tenthYear: string;
  tenthBoard: string;
  twelfthPercentage: string;
  twelfthYear: string;
  twelfthBoard: string;
  currentCGPA: string;
  currentSemester: string;
  branch: string;
  rollNumber: string;
  admissionYear: string;
  hasInternship: string;
  internshipCompany: string;
  internshipDuration: string;
  internshipDescription: string;
  hasTraining: string;
  trainingDetails: string;
  resume: File | null;
  internshipCertificate: File | null;
  trainingCertificate: File | null;
  tenthMarksheet: File | null;
  twelfthMarksheet: File | null;
}

const StudentRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<StudentRegistrationData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    tenthPercentage: "",
    tenthYear: "",
    tenthBoard: "",
    twelfthPercentage: "",
    twelfthYear: "",
    twelfthBoard: "",
    currentCGPA: "",
    currentSemester: "",
    branch: "",
    rollNumber: "",
    admissionYear: "",
    hasInternship: "no",
    internshipCompany: "",
    internshipDuration: "",
    internshipDescription: "",
    hasTraining: "no",
    trainingDetails: "",
    resume: null,
    internshipCertificate: null,
    trainingCertificate: null,
    tenthMarksheet: null,
    twelfthMarksheet: null,
  });

  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: string | null}>({});

  const handleInputChange = (field: keyof StudentRegistrationData, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (field: keyof StudentRegistrationData, file: File | null) => {
    if (file) {
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > 5) {
        toast({
          title: "File too large",
          description: "File size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setUploadedFiles(prev => ({
        ...prev,
        [field]: file.name
      }));
    } else {
      setUploadedFiles(prev => ({
        ...prev,
        [field]: null
      }));
    }
    
    handleInputChange(field, file);
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.firstName && 
          formData.lastName && 
          formData.email && 
          formData.password &&
          formData.confirmPassword &&
          formData.phone && 
          formData.dateOfBirth && 
          formData.gender &&
          formData.address &&
          formData.city &&
          formData.state &&
          formData.pincode
        );
      case 2:
        return (
          formData.tenthPercentage && 
          formData.tenthYear && 
          formData.tenthBoard &&
          formData.twelfthPercentage &&
          formData.twelfthYear &&
          formData.twelfthBoard &&
          formData.currentCGPA &&
          formData.currentSemester &&
          formData.branch &&
          formData.rollNumber &&
          formData.admissionYear
        );
      case 3:
        return true;
      case 4:
        return formData.resume && formData.tenthMarksheet && formData.twelfthMarksheet;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields before proceeding.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Password and confirm password do not match.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        tenthPercentage: formData.tenthPercentage,
        tenthYear: formData.tenthYear,
        tenthBoard: formData.tenthBoard,
        twelfthPercentage: formData.twelfthPercentage,
        twelfthYear: formData.twelfthYear,
        twelfthBoard: formData.twelfthBoard,
        currentCGPA: formData.currentCGPA,
        currentSemester: formData.currentSemester,
        branch: formData.branch,
        rollNumber: formData.rollNumber,
        admissionYear: formData.admissionYear,
        hasInternship: formData.hasInternship,
        internshipCompany: formData.internshipCompany,
        internshipDuration: formData.internshipDuration,
        internshipDescription: formData.internshipDescription,
        hasTraining: formData.hasTraining,
        trainingDetails: formData.trainingDetails,
        password: formData.password
      };

      const result = await api.registerStudent(registrationData);
      
      if (result.success) {
        const loginResult = await api.loginStudent(formData.email, formData.password);
        
        if (loginResult.success) {
          localStorage.setItem("isStudentAuthenticated", "true");
          localStorage.setItem("studentEmail", formData.email);
          localStorage.setItem("currentStudent", JSON.stringify(loginResult.student));
          
          toast({
            title: "Registration Successful!",
            description: "Welcome! You are now logged in.",
          });
          
          navigate("/student-dashboard");
        } else {
          toast({
            title: "Registration Successful!",
            description: "Please login with your credentials.",
          });
          navigate("/login");
        }
      } else {
        toast({
          title: "Registration Failed",
          description: result.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to connect to server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const branches = [
    "Computer Science and Engineering",
    "Information Technology",
    "Electronics and Communication Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="glass border-b border-border/30 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate("/login")}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Student Registration</h1>
              <p className="text-sm text-muted-foreground">Final Year B.Tech Students</p>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
      </div>

      <div className="w-full bg-muted/30 h-2">
        <div 
          className="bg-gradient-to-r from-primary to-accent h-2 transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="flex justify-between mb-8">
            {[
              { step: 1, title: "Personal Details", icon: User },
              { step: 2, title: "Academic Details", icon: BookOpen },
              { step: 3, title: "Internship & Training", icon: Briefcase },
              { step: 4, title: "Document Upload", icon: Upload }
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= item.step 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'bg-muted text-muted-foreground border-muted-foreground'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  <item.icon className="w-5 h-5" />
                </motion.div>
                <span className={`text-xs mt-2 ${
                  currentStep >= item.step ? 'text-foreground font-medium' : 'text-muted-foreground'
                }`}>
                  {item.title}
                </span>
              </div>
            ))}
          </div>

          <Card className="glass border-border/30">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit}>
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <User className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h2 className="text-2xl font-bold mb-2">Personal Details</h2>
                      <p className="text-muted-foreground">Please provide your personal information</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          placeholder="Enter your first name"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          placeholder="Enter your last name"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="your.email@college.edu"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          placeholder="Create a password"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          placeholder="Confirm your password"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="+91 9876543210"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Gender *</Label>
                        <RadioGroup
                          value={formData.gender}
                          onValueChange={(value) => handleInputChange("gender", value)}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male">Male</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female">Female</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="other" />
                            <Label htmlFor="other">Other</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address *</Label>
                        <Textarea
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          placeholder="Enter your complete address"
                          rows={3}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          placeholder="Enter your city"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => handleInputChange("state", e.target.value)}
                          placeholder="Enter your state"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          value={formData.pincode}
                          onChange={(e) => handleInputChange("pincode", e.target.value)}
                          placeholder="Enter pincode"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h2 className="text-2xl font-bold mb-2">Academic Details</h2>
                      <p className="text-muted-foreground">Please provide your academic information</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4 md:col-span-2">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Award className="w-5 h-5" />
                          10th Standard Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="tenthPercentage">Percentage (%) *</Label>
                            <Input
                              id="tenthPercentage"
                              type="number"
                              step="0.1"
                              value={formData.tenthPercentage}
                              onChange={(e) => handleInputChange("tenthPercentage", e.target.value)}
                              placeholder="85.5"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="tenthYear">Year of Passing *</Label>
                            <Input
                              id="tenthYear"
                              value={formData.tenthYear}
                              onChange={(e) => handleInputChange("tenthYear", e.target.value)}
                              placeholder="2019"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="tenthBoard">Board *</Label>
                            <Select value={formData.tenthBoard} onValueChange={(value) => handleInputChange("tenthBoard", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select board" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cbse">CBSE</SelectItem>
                                <SelectItem value="state">State Board</SelectItem>
                                <SelectItem value="icse">ICSE</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 md:col-span-2">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Award className="w-5 h-5" />
                          12th Standard Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="twelfthPercentage">Percentage (%) *</Label>
                            <Input
                              id="twelfthPercentage"
                              type="number"
                              step="0.1"
                              value={formData.twelfthPercentage}
                              onChange={(e) => handleInputChange("twelfthPercentage", e.target.value)}
                              placeholder="88.2"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="twelfthYear">Year of Passing *</Label>
                            <Input
                              id="twelfthYear"
                              value={formData.twelfthYear}
                              onChange={(e) => handleInputChange("twelfthYear", e.target.value)}
                              placeholder="2021"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="twelfthBoard">Board *</Label>
                            <Select value={formData.twelfthBoard} onValueChange={(value) => handleInputChange("twelfthBoard", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select board" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cbse">CBSE</SelectItem>
                                <SelectItem value="state">State Board</SelectItem>
                                <SelectItem value="icse">ICSE</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 md:col-span-2">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <GraduationCap className="w-5 h-5" />
                          College Academic Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="rollNumber">Roll Number *</Label>
                            <Input
                              id="rollNumber"
                              value={formData.rollNumber}
                              onChange={(e) => handleInputChange("rollNumber", e.target.value)}
                              placeholder="CS2021001"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="branch">Branch *</Label>
                            <Select value={formData.branch} onValueChange={(value) => handleInputChange("branch", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select branch" />
                              </SelectTrigger>
                              <SelectContent>
                                {branches.map((branch) => (
                                  <SelectItem key={branch} value={branch}>
                                    {branch}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="currentCGPA">Current CGPA *</Label>
                            <Input
                              id="currentCGPA"
                              type="number"
                              step="0.01"
                              value={formData.currentCGPA}
                              onChange={(e) => handleInputChange("currentCGPA", e.target.value)}
                              placeholder="8.75"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="currentSemester">Current Semester *</Label>
                            <Select value={formData.currentSemester} onValueChange={(value) => handleInputChange("currentSemester", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select semester" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="7">7th Semester</SelectItem>
                                <SelectItem value="8">8th Semester</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="admissionYear">Admission Year *</Label>
                            <Input
                              id="admissionYear"
                              value={formData.admissionYear}
                              onChange={(e) => handleInputChange("admissionYear", e.target.value)}
                              placeholder="2021"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <Briefcase className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h2 className="text-2xl font-bold mb-2">Internship & Training</h2>
                      <p className="text-muted-foreground">Provide details about your internships and training</p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Internship Details</h3>
                        <RadioGroup
                          value={formData.hasInternship}
                          onValueChange={(value) => handleInputChange("hasInternship", value)}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="internship-yes" />
                            <Label htmlFor="internship-yes">I have internship experience</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="internship-no" />
                            <Label htmlFor="internship-no">I don't have internship experience</Label>
                          </div>
                        </RadioGroup>

                        {formData.hasInternship === "yes" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="internshipCompany">Company Name</Label>
                              <Input
                                id="internshipCompany"
                                value={formData.internshipCompany}
                                onChange={(e) => handleInputChange("internshipCompany", e.target.value)}
                                placeholder="Enter company name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="internshipDuration">Duration</Label>
                              <Input
                                id="internshipDuration"
                                value={formData.internshipDuration}
                                onChange={(e) => handleInputChange("internshipDuration", e.target.value)}
                                placeholder="3 months"
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="internshipDescription">Work Description</Label>
                              <Textarea
                                id="internshipDescription"
                                value={formData.internshipDescription}
                                onChange={(e) => handleInputChange("internshipDescription", e.target.value)}
                                placeholder="Describe your work and responsibilities"
                                rows={3}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Training Details</h3>
                        <RadioGroup
                          value={formData.hasTraining}
                          onValueChange={(value) => handleInputChange("hasTraining", value)}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="training-yes" />
                            <Label htmlFor="training-yes">I have undergone technical training</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="training-no" />
                            <Label htmlFor="training-no">I haven't undergone training</Label>
                          </div>
                        </RadioGroup>

                        {formData.hasTraining === "yes" && (
                          <div className="space-y-2">
                            <Label htmlFor="trainingDetails">Training Details</Label>
                            <Textarea
                              id="trainingDetails"
                              value={formData.trainingDetails}
                              onChange={(e) => handleInputChange("trainingDetails", e.target.value)}
                              placeholder="Describe your technical training programs"
                              rows={3}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h2 className="text-2xl font-bold mb-2">Document Upload</h2>
                      <p className="text-muted-foreground">Upload your resume and certificates</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="resume">Resume *</Label>
                        <div className="border-2 border-dashed border-border/50 rounded-lg p-4 text-center">
                          <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <input
                            id="resume"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileUpload("resume", e.target.files?.[0] || null)}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('resume')?.click()}
                            className="w-full"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Choose Resume
                          </Button>
                          {uploadedFiles.resume && (
                            <div className="mt-2 text-sm text-green-600 flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {uploadedFiles.resume}
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            PDF, DOC, DOCX (Max 5MB)
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tenthMarksheet">10th Marksheet *</Label>
                        <div className="border-2 border-dashed border-border/50 rounded-lg p-4 text-center">
                          <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <input
                            id="tenthMarksheet"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload("tenthMarksheet", e.target.files?.[0] || null)}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('tenthMarksheet')?.click()}
                            className="w-full"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Choose 10th Marksheet
                          </Button>
                          {uploadedFiles.tenthMarksheet && (
                            <div className="mt-2 text-sm text-green-600 flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {uploadedFiles.tenthMarksheet}
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            PDF, JPG, JPEG, PNG (Max 5MB)
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="twelfthMarksheet">12th Marksheet *</Label>
                        <div className="border-2 border-dashed border-border/50 rounded-lg p-4 text-center">
                          <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <input
                            id="twelfthMarksheet"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload("twelfthMarksheet", e.target.files?.[0] || null)}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('twelfthMarksheet')?.click()}
                            className="w-full"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Choose 12th Marksheet
                          </Button>
                          {uploadedFiles.twelfthMarksheet && (
                            <div className="mt-2 text-sm text-green-600 flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {uploadedFiles.twelfthMarksheet}
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            PDF, JPG, JPEG, PNG (Max 5MB)
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  
                  {currentStep < totalSteps && (
                    <Button type="button" onClick={nextStep}>
                      Next
                    </Button>
                  )}
                  
                  {currentStep === totalSteps && (
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Registering..." : "Complete Registration"}
                    </Button>
                  )}
                </div>
                <div className="text-center mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                      Login
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentRegistration;
