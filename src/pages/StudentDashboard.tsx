import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Building2,
  Bell,
  LogOut,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Eye,
  Send,
  Search,
  Filter,
  FileText,
  BookOpen,
  File,
  Edit,
  Brain,
  Code,
  ClipboardList,
  Upload,
  Paperclip,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState({
    name: "John Doe",
    email: "john.doe@college.edu",
    phone: "+91 9876543210",
    branch: "Computer Science",
    year: "3rd Year",
    rollNumber: "CS2021001",
    cgpa: "8.5",
    backlog: "0"
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [campusDrives, setCampusDrives] = useState<any[]>([]);
  const [appliedDrives, setAppliedDrives] = useState<any[]>([]);
  const [selectedResume, setSelectedResume] = useState<File | null>(null);
  const [uploadingDriveId, setUploadingDriveId] = useState<number | null>(null);
  const [uploadedFileNames, setUploadedFileNames] = useState<Record<number, string>>({});
  const [resumeData, setResumeData] = useState<Record<number, string>>({});
  const [selectedFiles, setSelectedFiles] = useState<Record<number, File>>({});
  const [certificateData, setCertificateData] = useState<Record<number, {name: string, data: string}[]>>({});
  const [selectedCertificates, setSelectedCertificates] = useState<Record<number, File[]>>({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successDriveName, setSuccessDriveName] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [previewNotificationPdf, setPreviewNotificationPdf] = useState<{data: string, name: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const certificateInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isStudentAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const savedStudent = localStorage.getItem("currentStudent");
    if (savedStudent) {
      const student = JSON.parse(savedStudent);
      setStudentData({
        name: `${student.firstName} ${student.lastName}`,
        email: student.email,
        phone: student.phone || "+91 9876543210",
        branch: student.branch || "Computer Science",
        year: `${student.currentSemester}th Year`,
        rollNumber: student.rollNumber || "CS2021001",
        cgpa: student.currentCGPA || "8.5",
        backlog: "0"
      });
    } else {
      const savedEmail = localStorage.getItem("studentEmail");
      if (savedEmail) {
        setStudentData(prev => ({ ...prev, email: savedEmail }));
      }
    }

    loadDrives();
    
    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
    
    const interval = setInterval(() => {
      loadDrives();
      const storedNotifications = localStorage.getItem("notifications");
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    }, 3000);
    
    const handleStorageChange = () => {
      loadDrives();
      const storedNotifications = localStorage.getItem("notifications");
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotificationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markNotificationAsRead = (id: number) => {
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  const markAllNotificationsAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  const loadDrives = () => {
    const stored = localStorage.getItem("companyDrives");
    const currentStudent = localStorage.getItem("currentStudent");
    const currentEmail = currentStudent ? JSON.parse(currentStudent).email : localStorage.getItem("studentEmail");
    
    if (stored) {
      const drives = JSON.parse(stored).map((drive: any) => ({
        ...drive,
        eligibility: drive.eligibilityCriteria || {
          branches: drive.allowedBranches || [],
          minCGPA: drive.eligibilityCriteria?.minCGPA || 0,
          maxBacklogs: drive.eligibilityCriteria?.maxBacklogs || 0,
          tenthPercentage: drive.eligibilityCriteria?.tenthPercentage || 0,
          twelfthPercentage: drive.eligibilityCriteria?.twelfthPercentage || 0
        },
        isRegistered: drive.appliedStudentsList?.some((s: any) => s.email === currentEmail) || false,
        isEligible: true
      }));
      setCampusDrives(drives);
      setAppliedDrives(drives.filter((d: any) => d.isRegistered));
    } else {
      setCampusDrives([]);
      setAppliedDrives([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isStudentAuthenticated");
    localStorage.removeItem("studentEmail");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const checkStudentEligibility = (drive: any) => {
    return true;
  };

  const handleResumeUpload = (driveId: number) => {
    const fileInput = document.getElementById(`resume-upload-${driveId}`) as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      setSelectedFiles(prev => ({ ...prev, [driveId]: file }));
      setSelectedResume(file);
      setUploadingDriveId(driveId);
      setUploadedFileNames(prev => ({ ...prev, [driveId]: file.name }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeData(prev => ({ ...prev, [driveId]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCertificateUpload = (driveId: number) => {
    const fileInput = document.getElementById(`certificate-upload-${driveId}`) as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const currentCerts = selectedCertificates[driveId] || [];
      setSelectedCertificates(prev => ({ ...prev, [driveId]: [...currentCerts, file] }));
      setUploadingDriveId(driveId);
      setUploadedFileNames(prev => ({ ...prev, [driveId]: (prev[driveId] || "") + " " + file.name }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const currentCertData = certificateData[driveId] || [];
        setCertificateData(prev => ({ 
          ...prev, 
          [driveId]: [...currentCertData, { name: file.name, data: reader.result as string }] 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCertificate = (driveId: number, index: number) => {
    const currentCerts = [...(selectedCertificates[driveId] || [])];
    currentCerts.splice(index, 1);
    setSelectedCertificates(prev => ({ ...prev, [driveId]: currentCerts }));
    
    const currentCertData = [...(certificateData[driveId] || [])];
    currentCertData.splice(index, 1);
    setCertificateData(prev => ({ ...prev, [driveId]: currentCertData }));
  };

  const registerStudent = (driveId: number, studentApplication: any, driveName?: string) => {
    const storedCompanies = localStorage.getItem("companyDrives");
    if (storedCompanies) {
      const companies = JSON.parse(storedCompanies);
      const updatedCompanies = companies.map((c: any) => {
        if (c.id === driveId) {
          const appliedStudentsList = c.appliedStudentsList || [];
          
          if (appliedStudentsList.some((s: any) => s.id === studentApplication.id || s.email === studentApplication.email)) {
            toast({ title: "Already Registered", description: "You have already applied for this drive." });
            return c;
          }

          return {
            ...c,
            appliedStudents: (c.appliedStudents || 0) + 1,
            appliedStudentsList: [...appliedStudentsList, studentApplication]
          };
        }
        return c;
      });
      localStorage.setItem("companyDrives", JSON.stringify(updatedCompanies));
      
      setTimeout(() => {
        loadDrives();
        window.dispatchEvent(new Event('storage'));
      }, 100);
      
      setSuccessDriveName(driveName || "the drive");
      setShowSuccessDialog(true);
    } else {
      toast({ title: "Error", description: "No companies found" });
    }
  };

  const handleRegisterForDrive = (driveId: number) => {
    const storedCompanies = localStorage.getItem("companyDrives");
    
    if (!storedCompanies) {
      toast({ title: "Error", description: "No companies found" });
      return;
    }

    let allDrives;
    try {
      allDrives = JSON.parse(storedCompanies);
    } catch (e) {
      toast({ title: "Error", description: "Failed to parse company data" });
      return;
    }
    
    const drive = allDrives.find((d: any) => d.id === driveId);
    
    if (!drive) {
      toast({ title: "Error", description: "Drive not found" });
      return;
    }

    const savedStudent = localStorage.getItem("currentStudent");
    const student = savedStudent ? JSON.parse(savedStudent) : null;

    if (!student || (!student.id && !student.email)) {
      toast({ title: "Login Required", description: "Please login as student first." });
      return;
    }

    const fileInput = document.getElementById(`resume-upload-${driveId}`) as HTMLInputElement;
    const certInput = document.getElementById(`certificate-upload-${driveId}`) as HTMLInputElement;
    
    if (!fileInput || !fileInput.files || !fileInput.files[0]) {
      toast({ 
        title: "Resume Required", 
        description: "Please upload your resume before registering for the drive." 
      });
      return;
    }

    if (!certInput || !certInput.files || certInput.files.length === 0) {
      toast({ 
        title: "Certificate Required", 
        description: "Please upload at least one certificate before registering for the drive." 
      });
      return;
    }

    const file = fileInput.files[0];
    const certFiles = certInput.files;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const resumeDataLoaded = reader.result as string;
      
      const certDataArray = certificateData[driveId] || [];
      
      const studentApplication = {
        id: student.id || `APP-${Date.now()}`,
        name: student.firstName && student.lastName ? `${student.firstName} ${student.lastName}` : student.name || student.email,
        email: student.email || "",
        rollNumber: student.rollNumber || "",
        branch: student.branch || "",
        cgpa: student.currentCGPA || "",
        appliedDate: new Date().toISOString().split('T')[0],
        status: "Applied",
        resume: {
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
          data: resumeDataLoaded
        },
        certificates: certDataArray
      };
      
      registerStudent(driveId, studentApplication, drive.name);
      
      fileInput.value = '';
      certInput.value = '';
      setUploadedFileNames(prev => ({ ...prev, [driveId]: "" }));
      setSelectedFiles(prev => ({ ...prev, [driveId]: undefined as any }));
      setSelectedCertificates(prev => ({ ...prev, [driveId]: [] }));
      setCertificateData(prev => ({ ...prev, [driveId]: [] }));
      
      setTimeout(() => {
        loadDrives();
        window.dispatchEvent(new Event('storage'));
      }, 200);
    };
    reader.readAsDataURL(file);
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
              <h1 className="text-xl font-bold">Student Dashboard</h1>
              <p className="text-sm text-muted-foreground">{studentData.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative" ref={notificationRef}>
              <Button variant="outline" size="sm" onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}>
                <Bell className="w-4 h-4 mr-2" />
                Notifications
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </Button>
              {showNotificationDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-background border rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b flex justify-between items-center">
                    <span className="font-semibold">Notifications</span>
                    {notifications.filter(n => !n.isRead).length > 0 && (
                      <Button size="sm" variant="ghost" onClick={markAllNotificationsAsRead}>
                        Mark all read
                      </Button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-3 text-sm text-muted-foreground">No notifications</p>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div key={n.id} className={`p-3 border-b hover:bg-muted/50 ${!n.isRead ? 'bg-blue-50' : ''}`} onClick={(e) => { if ((e.target as HTMLElement).closest('.pdf-btn')) return; markNotificationAsRead(n.id); }}>
                          <div className="flex justify-between items-start">
                            <p className="font-medium text-sm">{n.title}</p>
                            {!n.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                          </div>
                          <p className="text-xs text-muted-foreground">{n.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{new Date(n.date).toLocaleDateString()}</p>
                          {n.pdf && (
                            <Button size="sm" variant="outline" className="mt-2 pdf-btn" onClick={() => setPreviewNotificationPdf(n.pdf)}>
                              <FileText className="w-4 h-4 mr-1" />
                              View PDF
                            </Button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 5 && (
                    <div className="p-2 text-center text-sm text-muted-foreground border-t">
                      +{notifications.length - 5} more
                    </div>
                  )}
                </div>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="glass border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{studentData.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {studentData.email}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Branch & Year</p>
                    <p className="font-medium">{studentData.branch} - {studentData.year}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">CGPA</p>
                    <p className="font-medium">{studentData.cgpa}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Roll Number</p>
                    <p className="font-medium">{studentData.rollNumber}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="campus" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="campus">Campus Drives</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="campus" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Available Campus Drives</h3>
              <div className="flex gap-2">
                <Badge variant="outline">
                  <Building2 className="w-3 h-3 mr-1" />
                  Total: {campusDrives.length}
                </Badge>
                <Badge variant="outline">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Eligible: {campusDrives.filter(d => checkStudentEligibility(d)).length}
                </Badge>
              </div>
            </div>

            {campusDrives.length === 0 ? (
              <Card className="glass border-border/30">
                <CardContent className="p-12 text-center">
                  <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Campus Drives Available</h3>
                  <p className="text-muted-foreground">
                    No company drives have been posted yet. Check back later!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {campusDrives.map((drive) => {
                  const isEligible = checkStudentEligibility(drive);
                  const deadline = drive.registrationDeadline || drive.driveDate || "";
                  const daysLeft = deadline ? Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
                  
                  return (
                    <Card key={drive.id} className="glass border-border/30">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                                {drive.logo || "🏢"}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold">{drive.name}</h3>
                                <p className="text-medium text-primary">{drive.jobRole}</p>
                              </div>
                              <div className="flex gap-2">
                                {isEligible ? (
                                  <Badge variant="default">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Eligible
                                  </Badge>
                                ) : (
                                  <Badge variant="destructive">
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Not Eligible
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">CTC:</span>
                                <span className="ml-1 font-medium">{drive.ctcRange}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Location:</span>
                                <span className="ml-1 font-medium">{drive.location}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Drive Date:</span>
                                <span className="ml-1 font-medium">{drive.driveDate}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">⏰ {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}</span>
                              </div>
                            </div>

                            <div className="bg-muted/50 rounded-lg p-3">
                              <p className="text-sm text-muted-foreground">{drive.description}</p>
                            </div>

                            {drive.companyDocument && (
                              <div className="glass border-border/30 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    <span className="text-sm font-medium">Company Document Available</span>
                                  </div>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="border-primary/30 text-primary hover:bg-primary/10"
                                    onClick={() => {
                                      if (drive.companyDocument?.data) {
                                        const link = document.createElement('a');
                                        link.href = drive.companyDocument.data;
                                        link.download = drive.companyDocument.name;
                                        link.click();
                                      }
                                    }}
                                  >
                                    <Download className="w-4 h-4 mr-1" />
                                    Download
                                  </Button>
                                </div>
                              </div>
                            )}

                            <div className="glass border-border/30 rounded-lg p-3">
                              <h4 className="font-medium mb-2">Eligibility Criteria</h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Branches:</span>
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {(drive.eligibility?.branches || []).map((branch: string, idx: number) => (
                                      <Badge key={idx} variant="outline" className="mr-1 text-xs">
                                        {branch}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Min CGPA: {drive.eligibility?.minCGPA || 0}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Max Backlogs: {drive.eligibility?.maxBacklogs || 0}</span>
                                </div>
                              </div>
                            </div>

                            <div className="border-t pt-3">
                                <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-muted-foreground">Registration Type:</span>
                                  <Badge variant="default">
                                    Internal Registration
                                  </Badge>
                                </div>
                                {drive.isRegistered ? (
                                  <Button size="sm" variant="secondary" disabled>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Already Applied
                                  </Button>
                                ) : (
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <div className="flex items-center gap-2">
                                      <Paperclip className="w-4 h-4" />
                                      <label className="cursor-pointer">
                                        <Input
                                          id={`resume-upload-${drive.id}`}
                                          type="file"
                                          accept=".pdf,.doc,.docx"
                                          className="hidden"
                                          onChange={() => handleResumeUpload(drive.id)}
                                        />
                                        <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/80">
                                          {uploadedFileNames[drive.id] || "Choose Resume"}
                                        </span>
                                      </label>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                      <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        <label className="cursor-pointer">
                                          <Input
                                            id={`certificate-upload-${drive.id}`}
                                            type="file"
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                            multiple
                                            className="hidden"
                                            onChange={() => handleCertificateUpload(drive.id)}
                                          />
                                          <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                            {certificateData[drive.id]?.length ? `${certificateData[drive.id].length} Certificate(s) Added` : "Upload Certificates"}
                                          </span>
                                        </label>
                                      </div>
                                      {certificateData[drive.id]?.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                          {certificateData[drive.id].map((cert: any, idx: number) => (
                                            <div key={idx} className="flex items-center gap-1 bg-muted/50 rounded px-2 py-1 text-xs">
                                              <FileText className="w-3 h-3" />
                                              <span className="max-w-[100px] truncate">{cert.name}</span>
                                              <button 
                                                type="button"
                                                onClick={() => handleRemoveCertificate(drive.id, idx)}
                                                className="text-red-500 hover:text-red-700 ml-1"
                                              >
                                                ×
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    <Button 
                                      size="sm"
                                      disabled={!uploadedFileNames[drive.id] || !certificateData[drive.id]?.length}
                                      onClick={() => handleRegisterForDrive(drive.id)}
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Register Now
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">My Applications</h3>
              <Badge variant="outline">
                <CheckCircle className="w-3 h-3 mr-1" />
                Applied: {appliedDrives.length}
              </Badge>
            </div>

            {appliedDrives.length === 0 ? (
              <Card className="glass border-border/30">
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't applied to any company drives yet.
                  </p>
                  <Button onClick={() => document.querySelector('[data-value="campus"]')?.dispatchEvent(new Event('click', { bubbles: true }))}>
                    Browse Campus Drives
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {appliedDrives.map((drive) => {
                  const myApplication = drive.appliedStudentsList?.find((s: any) => s.email === studentData.email);
                  return (
                    <Card key={drive.id} className="glass border-border/30">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                              {drive.logo || "🏢"}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">{drive.name}</h3>
                              <p className="text-medium text-primary">{drive.jobRole}</p>
                            </div>
                          </div>
                          <Badge variant={drive.status === "Active" ? "default" : "outline"}>
                            {drive.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">CTC:</span>
                            <span className="ml-1 font-medium">{drive.ctcRange}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Location:</span>
                            <span className="ml-1 font-medium">{drive.location}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Drive Date:</span>
                            <span className="ml-1 font-medium">{drive.driveDate}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Applied On:</span>
                            <span className="ml-1 font-medium">{myApplication?.appliedDate || "N/A"}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Status:</span>
                              {myApplication?.status === "Selected" ? (
                                <Badge className="bg-green-500 hover:bg-green-600">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Congratulations! You are Selected
                                </Badge>
                              ) : myApplication?.status === "Rejected" ? (
                                <Badge variant="destructive">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Not Selected - Better Luck Next Time
                                </Badge>
                              ) : (
                                <Badge variant="default">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {myApplication?.status || "Applied"} - Under Review
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              {myApplication?.resume && (
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-green-500" />
                                  <span className="text-sm text-green-600">Resume: {myApplication.resume.name}</span>
                                </div>
                              )}
                              {(myApplication?.certificate || myApplication?.certificates) && (
                                <div className="flex flex-col gap-1">
                                  {myApplication?.certificates?.length > 0 ? (
                                    myApplication.certificates.map((cert: any, idx: number) => (
                                      <div key={idx} className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm text-blue-600">Certificate {idx + 1}: {cert.name}</span>
                                      </div>
                                    ))
                                  ) : myApplication?.certificate && (
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-blue-500" />
                                      <span className="text-sm text-blue-600">Certificate: {myApplication.certificate.name}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

        </Tabs>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-6 h-6" />
              Successfully Registered!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-lg font-medium mb-2">Congratulations!</p>
            <p className="text-muted-foreground">
              You have successfully registered for <strong>{successDriveName}</strong>.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              You can track your application in "My Applications" tab.
            </p>
          </div>
          <div className="flex justify-center">
            <Button onClick={() => setShowSuccessDialog(false)} className="bg-green-600 hover:bg-green-700">
              Great! Thank You
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewNotificationPdf} onOpenChange={() => setPreviewNotificationPdf(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>PDF Attachment - {previewNotificationPdf?.name}</DialogTitle>
          </DialogHeader>
          <div className="h-[70vh] overflow-auto">
            {previewNotificationPdf?.data && (
              <iframe 
                src={previewNotificationPdf.data} 
                className="w-full h-full" 
                title="PDF Preview"
              />
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              onClick={() => {
                if (previewNotificationPdf?.data) {
                  const link = document.createElement('a');
                  link.href = previewNotificationPdf.data;
                  link.download = previewNotificationPdf.name;
                  link.click();
                }
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentDashboard;
