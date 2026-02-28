import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Building2, 
  Users, 
  GraduationCap,
  Bell,
  LogOut,
  Plus,
  CheckCircle,
  Clock,
  Video,
  CalendarClock,
  BarChart3,
  User,
  Filter,
  Download,
  Mail,
  TrendingUp,
  UsersRound,
  Award,
  Target,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const TPODashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [companyDrives, setCompanyDrives] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [cgpaFilter, setCgpaFilter] = useState<string>("all");
  const [percentageFilter, setPercentageFilter] = useState<string>("all");
  const [companyFilter, setCompanyFilter] = useState<string>("all");
  const [selectedDriveForRounds, setSelectedDriveForRounds] = useState<number | null>(null);
  const [roundResults, setRoundResults] = useState<any[]>([]);
  const [previewResume, setPreviewResume] = useState<{data: string, name: string} | null>(null);
  const [previewCertificate, setPreviewCertificate] = useState<{data: string, name: string} | null>(null);
  const [studentStatuses, setStudentStatuses] = useState<Record<string, string>>({});
  const [schedules, setSchedules] = useState<any[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [newSchedule, setNewSchedule] = useState({
    title: "",
    type: "drive",
    date: "",
    time: "",
    description: "",
    company: ""
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [notifications, setNotifications] = useState<any[]>([]);
  const [dbStudents, setDbStudents] = useState<any[]>([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [newNotification, setNewNotification] = useState({ title: "", message: "", type: "general" });
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [notificationPdf, setNotificationPdf] = useState<{data: string, name: string} | null>(null);
  const [showSimpleModal, setShowSimpleModal] = useState(false);

  const updateStudentStatus = async (driveId: number, studentEmail: string, status: string, studentName?: string, companyName?: string) => {
    console.log('updateStudentStatus called:', { driveId, studentEmail, status, studentName, companyName });
    
    const key = `${driveId}-${studentEmail}`;
    const newStatuses = { ...studentStatuses, [key]: status };
    setStudentStatuses(newStatuses);
    
    const storedCompanies = localStorage.getItem("companyDrives");
    if (storedCompanies) {
      const companies = JSON.parse(storedCompanies);
      const updatedCompanies = companies.map((c: any) => {
        if (c.id === driveId) {
          const updatedList = c.appliedStudentsList.map((s: any) => {
            if (s.email === studentEmail) {
              return { ...s, status: status };
            }
            return s;
          });
          
          let selectedCount = c.selectedStudents || 0;
          if (status === "Selected") {
            selectedCount = updatedList.filter((s: any) => s.status === "Selected").length;
          }
          
          return {
            ...c,
            appliedStudentsList: updatedList,
            selectedStudents: selectedCount
          };
        }
        return c;
      });
      localStorage.setItem("companyDrives", JSON.stringify(updatedCompanies));
      setCompanyDrives(updatedCompanies);
    }
    
    if (status === "Selected" && studentEmail && companyName) {
      const subject = `Congratulations! You have been selected for ${companyName}`;
      const body = `Dear ${studentName || 'Student'},\n\nCongratulations! You have been selected for ${companyName}.\n\nBest regards,\nTPO Team`;
      
      console.log('===== EMAIL DEBUG =====');
      console.log('studentEmail:', studentEmail);
      console.log('companyName:', companyName);
      console.log('dbStudents:', dbStudents);
      
      // Find student from database to get correct email
      const dbStudent = dbStudents.find((s: any) => s.email === studentEmail);
      const finalEmail = dbStudent?.email || studentEmail;
      console.log('Final email to send:', finalEmail);
      console.log('======================');
      
      // Send email
      try {
        const emailResponse = await fetch('http://localhost:3001/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: finalEmail, subject, body })
        });
        const emailResult = await emailResponse.json();
        console.log('Email result:', emailResult);
        
        toast({
          title: "Student Selected & Email Sent",
          description: `Email sent to ${finalEmail}`,
        });
      } catch (e: any) {
        console.error('Email error:', e);
        toast({
          title: "Student Selected (Email Failed)",
          description: `Error: ${e.message}`,
          variant: "destructive",
        });
      }
    } else if (status === "Rejected" && studentEmail && companyName) {
      const subject = `Update regarding ${companyName} placement drive`;
      const body = `Dear ${studentName || 'Student'},\n\nThank you for applying to ${companyName}. After careful consideration, we regret to inform you that you have not been selected this time.\n\nWe encourage you to apply for future opportunities.\n\nBest regards,\nTPO Team`;
      
      let emailSent = false;
      let emailError = '';
      try {
        const emailResponse = await fetch('http://localhost:3001/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: studentEmail, subject, body })
        });
        const emailResult = await emailResponse.json();
        console.log('Email response:', emailResult);
        emailSent = emailResult.success;
        if (!emailResult.success) {
          emailError = emailResult.message;
        }
      } catch (e: any) {
        console.error('Email error:', e);
        emailError = e.message;
      }
      
      if (emailSent) {
        toast({
          title: "Student Dismissed & Email Sent",
          description: `Student has been dismissed. Email notification sent to ${studentEmail}`,
        });
      } else {
        toast({
          title: "Student Dismissed (Email Failed)",
          description: `Student dismissed but email could not be sent to ${studentEmail}. Error: ${emailError}`,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: status === "Selected" ? "Student Selected" : "Student Dismissed",
        description: `Student has been ${status.toLowerCase()} for this drive.`,
      });
    }
  };

  const getStudentStatus = (driveId: number, studentEmail: string) => {
    const key = `${driveId}-${studentEmail}`;
    if (studentStatuses[key]) {
      return studentStatuses[key];
    }
    const drive = companyDrives.find((d: any) => d.id === driveId);
    if (drive?.appliedStudentsList) {
      const student = drive.appliedStudentsList.find((s: any) => s.email === studentEmail);
      if (student?.status) {
        return student.status;
      }
    }
    return "Applied";
  };

  const DRIVE_ROUNDS = [
    { id: 1, name: "Pre-Placement Talk", status: "pending" },
    { id: 2, name: "Aptitude Test", status: "pending" },
    { id: 3, name: "Technical Test", status: "pending" },
    { id: 4, name: "Technical Interview", status: "pending" },
    { id: 5, name: "HR Interview", status: "pending" },
    { id: 6, name: "Final Result", status: "pending" }
  ];

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isTPOAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetch('http://localhost:3001/api/students')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched students from DB:', data);
        setDbStudents(data);
      })
      .catch(err => console.error('Error fetching students:', err));

    const storedDrives = localStorage.getItem("companyDrives");
    if (storedDrives) {
      const parsedDrives = JSON.parse(storedDrives);
      setCompanyDrives(parsedDrives);
      
      const storedStatuses: Record<string, string> = {};
      parsedDrives.forEach((drive: any) => {
        if (drive.appliedStudentsList) {
          drive.appliedStudentsList.forEach((student: any) => {
            if (student.status) {
              const key = `${drive.id}-${student.email}`;
              storedStatuses[key] = student.status;
            }
          });
        }
      });
      setStudentStatuses(storedStatuses);
    }

    const storedStudents = localStorage.getItem("studentRegistrations");
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    }

    const storedRounds = localStorage.getItem("roundResults");
    if (storedRounds) {
      setRoundResults(JSON.parse(storedRounds));
    }

    const storedSchedules = localStorage.getItem("schedules");
    if (storedSchedules) {
      setSchedules(JSON.parse(storedSchedules));
    }

    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }

    const interval = setInterval(() => {
      const storedDrives = localStorage.getItem("companyDrives");
      if (storedDrives) {
        setCompanyDrives(JSON.parse(storedDrives));
      }
      const storedStudents = localStorage.getItem("studentRegistrations");
      if (storedStudents) {
        setStudents(JSON.parse(storedStudents));
      }
      const storedNotifications = localStorage.getItem("notifications");
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    }, 3000);

    const handleStorageChange = () => {
      const storedDrives = localStorage.getItem("companyDrives");
      if (storedDrives) {
        setCompanyDrives(JSON.parse(storedDrives));
      }
      const storedStudents = localStorage.getItem("studentRegistrations");
      if (storedStudents) {
        setStudents(JSON.parse(storedStudents));
      }
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
  const [emailStatus, setEmailStatus] = useState<string>('');

  const testEmail = async () => {
    const testEmailAddress = 'gayatrikadam1405@gmail.com';
    setEmailStatus('Starting email test...');
    console.log('Test email clicked');
    
    try {
      setEmailStatus('Calling API...');
      console.log('Calling API at http://localhost:3001/api/send-email');
      
      const response = await fetch('http://localhost:3001/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: testEmailAddress,
          subject: 'TEST - TPO System Working!',
          body: 'This is a test email from TPO System. If you receive this, the email system is working!'
        })
      });
      
      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response result:', result);
      
      setEmailStatus('Result: ' + JSON.stringify(result));
      
      if (result.success) {
        toast({ title: "Email Sent!", description: `Test email sent to ${testEmailAddress}. Check your Gmail inbox!` });
      } else {
        toast({ title: "Email Failed", description: result.message, variant: "destructive" });
      }
    } catch (e: any) {
      console.error('Error:', e);
      setEmailStatus('Error: ' + e.message);
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotificationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isTPOAuthenticated");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  const getStudentField = (student: any, field: string) => {
    return student[field] ?? student[field.replace(/_([a-z])/g, (_, c) => c.toUpperCase())] ?? '';
  };

  const studentsToUse = dbStudents.length > 0 ? dbStudents : students;

  const filteredStudents = studentsToUse.map(s => ({
    ...s,
    firstName: s.first_name || s.firstName,
    lastName: s.last_name || s.lastName,
    currentCGPA: s.current_cgpa || s.currentCGPA,
    tenthPercentage: s.tenth_percentage || s.tenthPercentage,
    twelfthPercentage: s.twelfth_percentage || s.twelfthPercentage,
    phone: s.phone
  })).filter(student => {
    const cgpa = parseFloat(getStudentField(student, 'current_cgpa')) || 0;
    const tenth = parseFloat(getStudentField(student, 'tenth_percentage')) || 0;
    const twelfth = parseFloat(getStudentField(student, 'twelfth_percentage')) || 0;
    
    if (branchFilter !== "all" && getStudentField(student, 'branch') !== branchFilter) return false;
    if (cgpaFilter === "above8" && cgpa < 8) return false;
    if (cgpaFilter === "above7" && cgpa < 7) return false;
    if (cgpaFilter === "above6" && cgpa < 6) return false;
    if (percentageFilter === "above90" && (tenth < 90 || twelfth < 90)) return false;
    if (percentageFilter === "above80" && (tenth < 80 || twelfth < 80)) return false;
    if (percentageFilter === "above70" && (tenth < 70 || twelfth < 70)) return false;
    
    if (companyFilter !== "all") {
      const selectedDrive = companyDrives.find(d => d.id.toString() === companyFilter);
      if (selectedDrive) {
        const hasApplied = selectedDrive.appliedStudentsList?.some((s: any) => s.email === getStudentField(student, 'email'));
        if (!hasApplied) return false;
      }
    }
    
    return true;
  });

  const getBranchStats = () => {
    const branchCounts: Record<string, number> = {};
    students.forEach(s => {
      const branch = s.branch || "Unknown";
      branchCounts[branch] = (branchCounts[branch] || 0) + 1;
    });
    return branchCounts;
  };

  const getCompanyStats = () => {
    const stats: Record<string, { applied: number; selected: number }> = {};
    companyDrives.forEach(drive => {
      stats[drive.name] = {
        applied: drive.appliedStudents || 0,
        selected: drive.selectedStudents || 0
      };
    });
    return stats;
  };

  const getPackageDistribution = () => {
    const ranges = { "3-5 LPA": 0, "5-10 LPA": 0, "10-15 LPA": 0, "15+ LPA": 0 };
    companyDrives.forEach(drive => {
      const ctc = parseFloat(drive.ctcRange?.replace(/[^0-9]/g, "")) || 0;
      if (ctc >= 3 && ctc < 5) ranges["3-5 LPA"]++;
      else if (ctc >= 5 && ctc < 10) ranges["5-10 LPA"]++;
      else if (ctc >= 10 && ctc < 15) ranges["10-15 LPA"]++;
      else if (ctc >= 15) ranges["15+ LPA"]++;
    });
    return ranges;
  };

  const getGenderStats = () => {
    let male = 0, female = 0, other = 0;
    students.forEach(s => {
      if (s.gender === "male") male++;
      else if (s.gender === "female") female++;
      else other++;
    });
    return { male, female, other };
  };

  const handleAddSchedule = () => {
    if (!newSchedule.title || !newSchedule.date) {
      toast({ title: "Error", description: "Title and date are required", variant: "destructive" });
      return;
    }
    const schedule = {
      id: Date.now(),
      ...newSchedule
    };
    const updatedSchedules = [...schedules, schedule];
    setSchedules(updatedSchedules);
    localStorage.setItem("schedules", JSON.stringify(updatedSchedules));
    setNewSchedule({ title: "", type: "drive", date: "", time: "", description: "", company: "" });
    setShowScheduleModal(false);
    toast({ title: "Schedule Added", description: "New schedule has been added successfully" });
  };

  const handleEditSchedule = (schedule: any) => {
    setEditingSchedule(schedule);
    setNewSchedule({
      title: schedule.title,
      type: schedule.type,
      date: schedule.date,
      time: schedule.time,
      description: schedule.description,
      company: schedule.company
    });
    setShowScheduleModal(true);
  };

  const handleUpdateSchedule = () => {
    if (!newSchedule.title || !newSchedule.date) {
      toast({ title: "Error", description: "Title and date are required", variant: "destructive" });
      return;
    }
    const updatedSchedules = schedules.map(s => 
      s.id === editingSchedule.id ? { ...s, ...newSchedule } : s
    );
    setSchedules(updatedSchedules);
    localStorage.setItem("schedules", JSON.stringify(updatedSchedules));
    setNewSchedule({ title: "", type: "drive", date: "", time: "", description: "", company: "" });
    setEditingSchedule(null);
    setShowScheduleModal(false);
    toast({ title: "Schedule Updated", description: "Schedule has been updated successfully" });
  };

  const handleDeleteSchedule = (id: number) => {
    const updatedSchedules = schedules.filter(s => s.id !== id);
    setSchedules(updatedSchedules);
    localStorage.setItem("schedules", JSON.stringify(updatedSchedules));
    toast({ title: "Schedule Deleted", description: "Schedule has been deleted successfully" });
  };

  const getAllEvents = () => {
    const driveEvents = companyDrives.map(drive => ({
      id: `drive-${drive.id}`,
      title: drive.name,
      type: "drive",
      date: drive.driveDate,
      time: drive.driveTime || "09:00",
      description: `${drive.jobRole} | ${drive.ctcRange}`,
      company: drive.name
    }));
    return [...driveEvents, ...schedules].filter(e => e.date);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    return { daysInMonth, startingDay };
  };

  const getEventsForDay = (day: number) => {
    const monthStr = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${currentMonth.getFullYear()}-${monthStr}-${dayStr}`;
    return getAllEvents().filter(e => e.date === dateStr);
  };

  const handlePostNotification = () => {
    if (!newNotification.title || !newNotification.message) {
      toast({ title: "Error", description: "Title and message are required", variant: "destructive" });
      return;
    }
    const notification = {
      id: Date.now(),
      ...newNotification,
      pdf: notificationPdf,
      date: new Date().toISOString(),
      isRead: false
    };
    const updatedNotifications = [notification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    setNewNotification({ title: "", message: "", type: "general" });
    setNotificationPdf(null);
    setShowSimpleModal(false);
    toast({ title: "Notification Posted", description: "Notification has been posted successfully" });
  };

  const handleDeleteNotification = (id: number) => {
    const updatedNotifications = notifications.filter(n => n.id !== id);
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    toast({ title: "Notification Deleted", description: "Notification has been deleted" });
  };

  const updateStudentRoundStatus = (driveId: number, roundId: number, studentEmail: string, status: string) => {
    const key = `${driveId}-${roundId}`;
    const existingResults = [...roundResults];
    const existingIndex = existingResults.findIndex(r => r.key === key);
    
    if (existingIndex >= 0) {
      existingResults[existingIndex].students[studentEmail] = status;
    } else {
      const newResult = {
        key,
        driveId,
        roundId,
        roundName: DRIVE_ROUNDS.find(r => r.id === roundId)?.name || "",
        students: { [studentEmail]: status }
      };
      existingResults.push(newResult);
    }
    
    setRoundResults(existingResults);
    localStorage.setItem("roundResults", JSON.stringify(existingResults));
    
    toast({
      title: "Status Updated",
      description: `Student ${status} for ${DRIVE_ROUNDS.find(r => r.id === roundId)?.name}`,
    });
  };

  const getStudentRoundStatus = (driveId: number, roundId: number, studentEmail: string) => {
    const key = `${driveId}-${roundId}`;
    const result = roundResults.find(r => r.key === key);
    return result?.students[studentEmail] || "pending";
  };

  const getRoundProgress = (driveId: number, roundId: number) => {
    const drive = companyDrives.find(d => d.id === driveId);
    if (!drive || !drive.appliedStudentsList) return { completed: 0, total: 0 };
    
    const key = `${driveId}-${roundId}`;
    const result = roundResults.find(r => r.key === key);
    if (!result) return { completed: 0, total: drive.appliedStudentsList.length };
    
    const completed = Object.values(result.students).filter(s => s !== "pending").length;
    return { completed, total: drive.appliedStudentsList.length };
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
              <h1 className="text-xl font-bold">TPO Dashboard</h1>
              <p className="text-sm text-muted-foreground">Placement Management System</p>
              <Button size="sm" variant="outline" className="mt-2" onClick={testEmail}>
                Test Email
              </Button>
              {emailStatus && (
                <p className="text-xs mt-2 p-2 bg-gray-100 rounded">{emailStatus}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative" ref={notificationRef}>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  console.log("View Notifications button clicked");
                  setShowNotificationDropdown(!showNotificationDropdown);
                }}
              >
                <Bell className="w-4 h-4 mr-2" />
                View Notifications
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
                    <Button size="sm" variant="ghost" onClick={() => setShowSimpleModal(true)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-3 text-sm text-muted-foreground">No notifications</p>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div key={n.id} className="p-3 border-b hover:bg-muted/50">
                          <div className="flex justify-between items-start">
                            <p className="font-medium text-sm">{n.title}</p>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteNotification(n.id)}>×</Button>
                          </div>
                          <p className="text-xs text-muted-foreground">{n.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{new Date(n.date).toLocaleDateString()}</p>
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
          className="space-y-6"
        >
          <Tabs defaultValue="company-drives" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="company-drives">Company Drives</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="selection">Selection</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>

            <TabsContent value="company-drives" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Company Drives</h3>
                  <p className="text-sm text-muted-foreground">
                    View all company drives and student applications
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => navigate('/company-management')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Drive
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="glass border-border/30">
                  <CardContent className="p-6 text-center">
                    <Building2 className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-3" />
                    <h3 className="text-2xl font-bold">{companyDrives.length}</h3>
                    <p className="text-muted-foreground">Total Drives</p>
                  </CardContent>
                </Card>
                <Card className="glass border-border/30">
                  <CardContent className="p-6 text-center">
                    <Users className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-3" />
                    <h3 className="text-2xl font-bold">{companyDrives.reduce((sum, d) => sum + (d.appliedStudents || 0), 0)}</h3>
                    <p className="text-muted-foreground">Total Applications</p>
                  </CardContent>
                </Card>
                <Card className="glass border-border/30">
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center mx-auto mb-3" />
                    <h3 className="text-2xl font-bold">{companyDrives.reduce((sum, d) => sum + (d.selectedStudents || 0), 0)}</h3>
                    <p className="text-muted-foreground">Total Selected</p>
                  </CardContent>
                </Card>
              </div>

              {companyDrives.length === 0 ? (
                <Card className="glass border-border/30">
                  <CardContent className="p-12 text-center">
                    <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Company Drives</h3>
                    <p className="text-muted-foreground mb-4">
                      No company drives have been created yet.
                    </p>
                    <Button onClick={() => navigate('/company-management')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Company Drive
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {companyDrives.map((drive) => (
                    <Card key={drive.id} className="glass border-border/30">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                              {drive.logo || "🏢"}
                            </div>
                            <div>
                              <CardTitle>{drive.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {drive.jobRole} | {drive.ctcRange} | {drive.location}
                              </p>
                            </div>
                          </div>
                          <Badge variant={drive.status === "Active" ? "default" : "outline"}>
                            {drive.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Drive Date:</span>
                            <span className="ml-1 font-medium">{drive.driveDate || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Deadline:</span>
                            <span className="ml-1 font-medium">{drive.registrationDeadline || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Applied:</span>
                            <span className="ml-1 font-bold text-blue-600">{drive.appliedStudents || 0}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Selected:</span>
                            <span className="ml-1 font-bold text-green-600">{drive.selectedStudents || 0}</span>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Applied Students ({drive.appliedStudentsList?.length || 0})
                          </h4>
                          {drive.appliedStudentsList && drive.appliedStudentsList.length > 0 ? (
                            <Table>
                                <TableHeader>
                                <TableRow>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Roll Number</TableHead>
                                  <TableHead>Branch</TableHead>
                                  <TableHead>CGPA</TableHead>
                                  <TableHead>Resume</TableHead>
                                  <TableHead>Certificate</TableHead>
                                  <TableHead>Applied Date</TableHead>
                                  <TableHead>Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {drive.appliedStudentsList.map((student: any) => (
                                  <TableRow key={student.id}>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>{student.rollNumber}</TableCell>
                                    <TableCell>{student.branch}</TableCell>
                                    <TableCell>{student.cgpa}</TableCell>
                                    <TableCell>
                                      {student.resume ? (
                                        <div className="flex gap-2">
                                          <Button 
                                            size="sm" 
                                            variant="default"
                                            className="bg-green-500 hover:bg-green-600"
                                            onClick={() => {
                                              if (student.resume.data) {
                                                setPreviewResume({
                                                  data: student.resume.data,
                                                  name: student.resume.name
                                                });
                                              } else {
                                                toast({
                                                  title: "Resume Preview",
                                                  description: `File: ${student.resume.name}`,
                                                });
                                              }
                                            }}
                                          >
                                            <FileText className="w-4 h-4 mr-1" />
                                            View
                                          </Button>
                                          <Button 
                                            size="sm" 
                                            variant="outline"
                                            onClick={() => {
                                              if (student.resume.data) {
                                                const link = document.createElement('a');
                                                link.href = student.resume.data;
                                                link.download = student.resume.name;
                                                link.click();
                                                toast({
                                                  title: "Resume Downloaded",
                                                  description: `Downloading ${student.resume.name}`,
                                                });
                                              }
                                            }}
                                          >
                                            <Download className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      ) : (
                                        <Badge variant="outline">No Resume</Badge>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {(student.certificate || student.certificates) ? (
                                        <div className="flex flex-col gap-2">
                                          {student.certificates?.length > 0 ? (
                                            student.certificates.map((cert: any, idx: number) => (
                                              <div key={idx} className="flex gap-2">
                                                <Button 
                                                  size="sm" 
                                                  variant="default"
                                                  className="bg-blue-500 hover:bg-blue-600"
                                                  onClick={() => {
                                                    if (cert.data) {
                                                      setPreviewCertificate({
                                                        data: cert.data,
                                                        name: cert.name
                                                      });
                                                    } else {
                                                      toast({
                                                        title: "Certificate Preview",
                                                        description: `File: ${cert.name}`,
                                                      });
                                                    }
                                                  }}
                                                >
                                                  <FileText className="w-4 h-4 mr-1" />
                                                  Cert {idx + 1}
                                                </Button>
                                                {cert.data && (
                                                  <Button 
                                                    size="sm" 
                                                    variant="outline"
                                                    onClick={() => {
                                                      const link = document.createElement('a');
                                                      link.href = cert.data;
                                                      link.download = cert.name;
                                                      link.click();
                                                      toast({
                                                        title: "Certificate Downloaded",
                                                        description: `Downloading ${cert.name}`,
                                                      });
                                                    }}
                                                  >
                                                    <Download className="w-4 h-4" />
                                                  </Button>
                                                )}
                                              </div>
                                            ))
                                          ) : student.certificate && (
                                            <div className="flex gap-2">
                                              <Button 
                                                size="sm" 
                                                variant="default"
                                                className="bg-blue-500 hover:bg-blue-600"
                                                onClick={() => {
                                                  if (student.certificate.data) {
                                                    setPreviewCertificate({
                                                      data: student.certificate.data,
                                                      name: student.certificate.name
                                                    });
                                                  } else {
                                                    toast({
                                                      title: "Certificate Preview",
                                                      description: `File: ${student.certificate.name}`,
                                                    });
                                                  }
                                                }}
                                              >
                                                <FileText className="w-4 h-4 mr-1" />
                                                View
                                              </Button>
                                              {student.certificate.data && (
                                                <Button 
                                                  size="sm" 
                                                  variant="outline"
                                                  onClick={() => {
                                                    const link = document.createElement('a');
                                                    link.href = student.certificate.data;
                                                    link.download = student.certificate.name;
                                                    link.click();
                                                    toast({
                                                      title: "Certificate Downloaded",
                                                      description: `Downloading ${student.certificate.name}`,
                                                    });
                                                  }}
                                                >
                                                  <Download className="w-4 h-4" />
                                                </Button>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <Badge variant="outline">No Certificate</Badge>
                                      )}
                                    </TableCell>
                                    <TableCell>{student.appliedDate}</TableCell>
                                    <TableCell>
                                      {getStudentStatus(drive.id, student.email) === "Selected" ? (
                                        <Badge className="bg-green-500 hover:bg-green-600">Selected</Badge>
                                      ) : getStudentStatus(drive.id, student.email) === "Rejected" ? (
                                        <Badge variant="destructive">Rejected</Badge>
                                      ) : (
                                        <div className="flex gap-2">
                                          <Button 
                                            size="sm" 
                                            className="bg-green-500 hover:bg-green-600"
                                            onClick={() => updateStudentStatus(drive.id, student.email, "Selected", student.name, drive.name)}
                                          >
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Select
                                          </Button>
                                          <Button 
                                            size="sm" 
                                            variant="destructive"
                                            onClick={() => updateStudentStatus(drive.id, student.email, "Rejected", student.name, drive.name)}
                                          >
                                            <LogOut className="w-4 h-4 mr-1" />
                                            Dismiss
                                          </Button>
                                        </div>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <p className="text-muted-foreground text-sm">No students have applied yet.</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="students" className="space-y-6">
              <Card className="glass border-border/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-500" />
                    Student Database
                  </CardTitle>
                  <CardDescription>View and filter all registered students</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <Select onValueChange={setCompanyFilter} defaultValue={companyFilter}>
                      <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Filter by Company Drive" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Companies</SelectItem>
                        {companyDrives.map(drive => (
                          <SelectItem key={drive.id} value={drive.id.toString()}>
                            {drive.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select onValueChange={setBranchFilter} defaultValue={branchFilter}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by Branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Branches</SelectItem>
                        <SelectItem value="Computer Science and Engineering">Computer Science</SelectItem>
                        <SelectItem value="Electronics and Telecommunication">Electronics</SelectItem>
                        <SelectItem value="Mechanical Engineering">Mechanical</SelectItem>
                        <SelectItem value="Civil Engineering">Civil</SelectItem>
                        <SelectItem value="Electrical Engineering">Electrical</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select onValueChange={setCgpaFilter} defaultValue={cgpaFilter}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by CGPA" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All CGPA</SelectItem>
                        <SelectItem value="above8">CGPA Above 8</SelectItem>
                        <SelectItem value="above7">CGPA Above 7</SelectItem>
                        <SelectItem value="above6">CGPA Above 6</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select onValueChange={setPercentageFilter} defaultValue={percentageFilter}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by Percentage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Percentages</SelectItem>
                        <SelectItem value="above90">10th & 12th Above 90%</SelectItem>
                        <SelectItem value="above80">10th & 12th Above 80%</SelectItem>
                        <SelectItem value="above70">10th & 12th Above 70%</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => { setBranchFilter("all"); setCgpaFilter("all"); setPercentageFilter("all"); setCompanyFilter("all"); }}>
                      <Filter className="w-4 h-4 mr-2" />
                      Clear Filters
                    </Button>
                    <Button variant="outline" onClick={() => {
                      const csvContent = [
                        ["Roll Number", "First Name", "Last Name", "Email", "Branch", "CGPA", "10th Percentage", "12th Percentage", "Internship", "Gender", "Phone"],
                        ...filteredStudents.map(s => [
                          s.rollNumber || "",
                          s.firstName || "",
                          s.lastName || "",
                          s.email || "",
                          s.branch || "",
                          s.currentCGPA || "",
                          s.tenthPercentage || "",
                          s.twelfthPercentage || "",
                          s.hasInternship === "yes" ? "Yes" : "No",
                          s.gender || "",
                          s.phone || ""
                        ])
                      ].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");

                      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                      const link = document.createElement("a");
                      const url = URL.createObjectURL(blob);
                      link.setAttribute("href", url);
                      link.setAttribute("download", `students_data_${new Date().toISOString().split('T')[0]}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      
                      toast({
                        title: "Data Exported",
                        description: `${filteredStudents.length} students exported to CSV successfully.`,
                      });
                    }}>
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{students.length}</div>
                      <p className="text-sm text-muted-foreground">Total Students</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{filteredStudents.length}</div>
                      <p className="text-sm text-muted-foreground">Filtered Students</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {students.filter(s => parseFloat(s.currentCGPA) >= 8).length}
                      </div>
                      <p className="text-sm text-muted-foreground">Above 8 CGPA</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {students.filter(s => s.hasInternship === "yes").length}
                      </div>
                      <p className="text-sm text-muted-foreground">With Internship</p>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Roll No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>CGPA</TableHead>
                        <TableHead>10th %</TableHead>
                        <TableHead>12th %</TableHead>
                        <TableHead>Internship</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.slice(0, 20).map((student, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{student.rollNumber || "N/A"}</TableCell>
                          <TableCell>{student.firstName} {student.lastName}</TableCell>
                          <TableCell>{student.branch || "N/A"}</TableCell>
                          <TableCell>{student.currentCGPA || "N/A"}</TableCell>
                          <TableCell>{student.tenthPercentage || "N/A"}%</TableCell>
                          <TableCell>{student.twelfthPercentage || "N/A"}%</TableCell>
                          <TableCell>
                            <Badge variant={student.hasInternship === "yes" ? "default" : "outline"}>
                              {student.hasInternship === "yes" ? "Yes" : "No"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredStudents.length > 20 && (
                    <p className="text-sm text-muted-foreground text-center">
                      Showing 20 of {filteredStudents.length} students
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="selection" className="space-y-6">
              <Card className="glass border-border/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Selected Students
                  </CardTitle>
                  <CardDescription>View all students who have been selected for company drives</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {companyDrives.reduce((sum, d) => {
                          const selected = d.appliedStudentsList?.filter((s: any) => s.status === "Selected").length || 0;
                          return sum + selected;
                        }, 0)}
                      </div>
                      <p className="text-sm text-muted-foreground">Total Selected</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {companyDrives.reduce((sum, d) => sum + (d.appliedStudents || 0), 0)}
                      </div>
                      <p className="text-sm text-muted-foreground">Total Applied</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {companyDrives.length}
                      </div>
                      <p className="text-sm text-muted-foreground">Total Drives</p>
                    </div>
                  </div>

                  {companyDrives.filter(d => d.appliedStudentsList?.some((s: any) => s.status === "Selected")).length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Students Selected Yet</h3>
                      <p className="text-muted-foreground">
                        Select students from the Company Drives tab to see them here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {companyDrives.map((drive) => {
                        const selectedStudents = drive.appliedStudentsList?.filter((s: any) => s.status === "Selected") || [];
                        if (selectedStudents.length === 0) return null;
                        
                        return (
                          <Card key={drive.id} className="glass border-border/30">
                            <CardHeader className="glass border-border/30">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
                                    {drive.logo || "🏢"}
                                  </div>
                                  <div>
                                    <CardTitle className="text-lg">{drive.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">{drive.jobRole} | {drive.ctcRange}</p>
                                  </div>
                                </div>
                                <Badge className="bg-primary">
                                  {selectedStudents.length} Selected
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="p-0">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Roll Number</TableHead>
                                    <TableHead>Branch</TableHead>
                                    <TableHead>CGPA</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Resume</TableHead>
                                    <TableHead>Certificate</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {selectedStudents.map((student: any) => (
                                    <TableRow key={student.email}>
                                      <TableCell className="font-medium">{student.name}</TableCell>
                                      <TableCell>{student.rollNumber}</TableCell>
                                      <TableCell>{student.branch}</TableCell>
                                      <TableCell>{student.cgpa}</TableCell>
                                      <TableCell className="text-sm">{student.email}</TableCell>
                                      <TableCell>
                                        {student.resume ? (
                                          <Button 
                                            size="sm" 
                                            variant="outline"
                                            onClick={() => {
                                              if (student.resume.data) {
                                                setPreviewResume({
                                                  data: student.resume.data,
                                                  name: student.resume.name
                                                });
                                              }
                                            }}
                                          >
                                            <FileText className="w-4 h-4 mr-1" />
                                            View
                                          </Button>
                                        ) : (
                                          <Badge variant="outline">No Resume</Badge>
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {student.certificate ? (
                                          <Button 
                                            size="sm" 
                                            variant="outline"
                                            onClick={() => {
                                              if (student.certificate.data) {
                                                setPreviewCertificate({
                                                  data: student.certificate.data,
                                                  name: student.certificate.name
                                                });
                                              }
                                            }}
                                          >
                                            <FileText className="w-4 h-4 mr-1" />
                                            View
                                          </Button>
                                        ) : (
                                          <Badge variant="outline">No Certificate</Badge>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="glass border-border/30">
                  <CardContent className="p-6 text-center">
                    <Building2 className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-3" />
                    <h3 className="text-2xl font-bold">{companyDrives.length}</h3>
                    <p className="text-muted-foreground">Total Companies</p>
                  </CardContent>
                </Card>
                <Card className="glass border-border/30">
                  <CardContent className="p-6 text-center">
                    <Users className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-3" />
                    <h3 className="text-2xl font-bold">{students.length}</h3>
                    <p className="text-muted-foreground">Total Students</p>
                  </CardContent>
                </Card>
                <Card className="glass border-border/30">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center mx-auto mb-3" />
                    <h3 className="text-2xl font-bold">
                      {companyDrives.reduce((sum, d) => sum + (d.selectedStudents || 0), 0)}
                    </h3>
                    <p className="text-muted-foreground">Total Placed</p>
                  </CardContent>
                </Card>
                <Card className="glass border-border/30">
                  <CardContent className="p-6 text-center">
                    <Award className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-3" />
                    <h3 className="text-2xl font-bold">
                      {students.length > 0 ? Math.round((companyDrives.reduce((sum, d) => sum + (d.selectedStudents || 0), 0) / students.length) * 100) : 0}%
                    </h3>
                    <p className="text-muted-foreground">Placement Rate</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass border-border/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UsersRound className="w-5 h-5 text-blue-500" />
                      Branch-wise Placement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(getBranchStats()).map(([branch, count]) => (
                        <div key={branch} className="flex items-center justify-between">
                          <span className="text-sm">{branch}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={(count / students.length) * 100} className="w-24 h-2" />
                            <span className="text-sm font-medium">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-border/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-500" />
                      Company-wise Selection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {companyDrives.slice(0, 5).map((drive) => (
                        <div key={drive.id} className="flex items-center justify-between">
                          <span className="text-sm">{drive.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-green-600">{drive.selectedStudents || 0} selected</span>
                            <span className="text-sm text-muted-foreground">/ {drive.appliedStudents || 0} applied</span>
                          </div>
                        </div>
                      ))}
                      {companyDrives.length === 0 && (
                        <p className="text-muted-foreground text-center py-4">No company data</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-border/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-500" />
                      Package Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(getPackageDistribution()).map(([range, count]) => (
                        <div key={range} className="flex items-center justify-between">
                          <span className="text-sm">{range}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={companyDrives.length > 0 ? (count / companyDrives.length) * 100 : 0} className="w-24 h-2" />
                            <span className="text-sm font-medium">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-border/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-orange-500" />
                      Gender Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(() => {
                        const gender = getGenderStats();
                        const total = gender.male + gender.female + gender.other || 1;
                        return (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Male</span>
                              <div className="flex items-center gap-2">
                                <Progress value={(gender.male / total) * 100} className="w-24 h-2" />
                                <span className="text-sm font-medium">{gender.male}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Female</span>
                              <div className="flex items-center gap-2">
                                <Progress value={(gender.female / total) * 100} className="w-24 h-2" />
                                <span className="text-sm font-medium">{gender.female}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Other</span>
                              <div className="flex items-center gap-2">
                                <Progress value={(gender.other / total) * 100} className="w-24 h-2" />
                                <span className="text-sm font-medium">{gender.other}</span>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="statistics" className="space-y-6">
              <Card className="glass border-border/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-500" />
                    Placement Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{companyDrives.length}</div>
                      <p className="text-sm text-muted-foreground">Total Drives</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {companyDrives.reduce((sum, d) => sum + (d.appliedStudents || 0), 0)}
                      </div>
                      <p className="text-sm text-muted-foreground">Total Applications</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {companyDrives.reduce((sum, d) => sum + (d.selectedStudents || 0), 0)}
                      </div>
                      <p className="text-sm text-muted-foreground">Total Selected</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {companyDrives.reduce((sum, d) => sum + (d.visits || 0), 0)}
                      </div>
                      <p className="text-sm text-muted-foreground">Company Visits</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6">
              <Card className="glass border-border/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CalendarClock className="w-5 h-5 text-blue-500" />
                      Schedule Management
                    </CardTitle>
                    <Button onClick={() => { setEditingSchedule(null); setNewSchedule({ title: "", type: "drive", date: "", time: "", description: "", company: "" }); setShowScheduleModal(true); }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Schedule
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
                        ←
                      </Button>
                      <h3 className="text-lg font-semibold">
                        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </h3>
                      <Button variant="outline" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
                        →
                      </Button>
                    </div>
                    <Button variant="outline" onClick={() => setCurrentMonth(new Date())}>
                      Today
                    </Button>
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center font-medium p-2 bg-muted rounded">
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: getDaysInMonth(currentMonth).startingDay }).map((_, i) => (
                      <div key={`empty-${i}`} className="h-24 border rounded" />
                    ))}
                    {Array.from({ length: getDaysInMonth(currentMonth).daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const events = getEventsForDay(day);
                      const isToday = new Date().getDate() === day && 
                        new Date().getMonth() === currentMonth.getMonth() && 
                        new Date().getFullYear() === currentMonth.getFullYear();
                      return (
                        <div key={day} className={`h-24 border rounded p-1 ${isToday ? 'bg-blue-50' : ''} overflow-y-auto`}>
                          <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : ''}`}>{day}</div>
                          {events.slice(0, 2).map((event, idx) => (
                            <div key={idx} className={`text-xs p-1 rounded mb-1 truncate ${event.type === 'drive' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                              {event.title}
                            </div>
                          ))}
                          {events.length > 2 && <div className="text-xs text-muted">+{events.length - 2} more</div>}
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Upcoming Events</h4>
                    {getAllEvents().filter(e => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5).map((event, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${event.type === 'drive' ? 'bg-green-500' : 'bg-blue-500'}`} />
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm text-muted-foreground">{event.date} {event.time} • {event.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditSchedule(event)}>
                            <FileText className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteSchedule(event.id)}>
                            <LogOut className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {getAllEvents().filter(e => new Date(e.date) >= new Date()).length === 0 && (
                      <p className="text-muted-foreground text-center py-4">No upcoming events</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input value={newSchedule.title} onChange={(e) => setNewSchedule({...newSchedule, title: e.target.value})} placeholder="Event title" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <Select value={newSchedule.type} onValueChange={(v) => setNewSchedule({...newSchedule, type: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="drive">Company Drive</SelectItem>
                          <SelectItem value="interview">Interview</SelectItem>
                          <SelectItem value="training">Training</SelectItem>
                          <SelectItem value="meeting">Meeting</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Date</label>
                        <Input type="date" value={newSchedule.date} onChange={(e) => setNewSchedule({...newSchedule, date: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Time</label>
                        <Input type="time" value={newSchedule.time} onChange={(e) => setNewSchedule({...newSchedule, time: e.target.value})} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Company (optional)</label>
                      <Input value={newSchedule.company} onChange={(e) => setNewSchedule({...newSchedule, company: e.target.value})} placeholder="Company name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Input value={newSchedule.description} onChange={(e) => setNewSchedule({...newSchedule, description: e.target.value})} placeholder="Event description" />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => { setShowScheduleModal(false); setEditingSchedule(null); }}>Cancel</Button>
                      <Button onClick={editingSchedule ? handleUpdateSchedule : handleAddSchedule}>
                        {editingSchedule ? 'Update' : 'Add'} Schedule
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showNotificationModal} onOpenChange={setShowNotificationModal}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Post New Notification</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input value={newNotification.title} onChange={(e) => setNewNotification({...newNotification, title: e.target.value})} placeholder="Notification title" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <Select value={newNotification.type} onValueChange={(v) => setNewNotification({...newNotification, type: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="drive">Company Drive</SelectItem>
                          <SelectItem value="training">Training</SelectItem>
                          <SelectItem value="placement">Placement</SelectItem>
                          <SelectItem value="deadline">Deadline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Message</label>
                      <Input value={newNotification.message} onChange={(e) => setNewNotification({...newNotification, message: e.target.value})} placeholder="Notification message" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Attach PDF (optional)</label>
                      <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        {notificationPdf ? (
                          <div className="flex items-center justify-between">
                            <span className="text-sm truncate">{notificationPdf.name}</span>
                            <Button size="sm" variant="ghost" onClick={() => setNotificationPdf(null)}>×</Button>
                          </div>
                        ) : (
                          <label className="cursor-pointer">
                            <input type="file" accept=".pdf" className="hidden" onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  setNotificationPdf({ data: reader.result as string, name: file.name });
                                };
                                reader.readAsDataURL(file);
                              }
                            }} />
                            <div className="text-muted-foreground">
                              <FileText className="w-8 h-8 mx-auto mb-2" />
                              <p className="text-sm">Click to upload PDF</p>
                            </div>
                          </label>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setShowNotificationModal(false)}>Cancel</Button>
                      <Button onClick={handlePostNotification}>Post Notification</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <Dialog open={!!previewResume} onOpenChange={() => setPreviewResume(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Resume Preview - {previewResume?.name}</DialogTitle>
          </DialogHeader>
          <div className="h-[70vh] overflow-auto">
            {previewResume?.data && (
              previewResume.name.toLowerCase().endsWith('.pdf') ? (
                <iframe 
                  src={previewResume.data} 
                  className="w-full h-full" 
                  title="Resume Preview"
                />
              ) : (
                <div className="p-4">
                  <div className="bg-white border rounded-lg p-8 text-center">
                    <FileText className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">{previewResume.name}</p>
                    <p className="text-muted-foreground mb-4">Document uploaded successfully</p>
                    <Button 
                      onClick={() => {
                        if (previewResume?.data) {
                          const link = document.createElement('a');
                          link.href = previewResume.data;
                          link.download = previewResume.name;
                          link.click();
                        }
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Resume
                    </Button>
                  </div>
                </div>
              )
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewCertificate} onOpenChange={() => setPreviewCertificate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Certificate Preview - {previewCertificate?.name}</DialogTitle>
          </DialogHeader>
          <div className="h-[70vh] overflow-auto">
            {previewCertificate?.data && (
              previewCertificate.name.toLowerCase().endsWith('.pdf') ? (
                <iframe 
                  src={previewCertificate.data} 
                  className="w-full h-full" 
                  title="Certificate Preview"
                />
              ) : (
                <div className="p-4">
                  <div className="bg-white border rounded-lg p-8 text-center">
                    <FileText className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">{previewCertificate.name}</p>
                    <p className="text-muted-foreground mb-4">Certificate uploaded successfully</p>
                    <Button 
                      onClick={() => {
                        if (previewCertificate?.data) {
                          const link = document.createElement('a');
                          link.href = previewCertificate.data;
                          link.download = previewCertificate.name;
                          link.click();
                        }
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Certificate
                    </Button>
                  </div>
                </div>
              )
            )}
          </div>
        </DialogContent>
      </Dialog>

      {showSimpleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-background border rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Post New Notification</h2>
              <button 
                onClick={() => setShowSimpleModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Title</label>
                <Input 
                  value={newNotification.title} 
                  onChange={(e) => setNewNotification({...newNotification, title: e.target.value})} 
                  placeholder="Notification title" 
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Type</label>
                <Select value={newNotification.type} onValueChange={(v) => setNewNotification({...newNotification, type: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="drive">Company Drive</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="placement">Placement</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Message</label>
                <Input 
                  value={newNotification.message} 
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})} 
                  placeholder="Notification message" 
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Attach PDF (optional)</label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  {notificationPdf ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm truncate">{notificationPdf.name}</span>
                      <Button size="sm" variant="ghost" onClick={() => setNotificationPdf(null)}>×</Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <input 
                        type="file" 
                        accept=".pdf" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              setNotificationPdf({ data: reader.result as string, name: file.name });
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                      />
                      <div className="text-muted-foreground">
                        <FileText className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Click to upload PDF</p>
                      </div>
                    </label>
                  )}
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowSimpleModal(false)}>Cancel</Button>
                <Button onClick={handlePostNotification}>Post Notification</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TPODashboard;
