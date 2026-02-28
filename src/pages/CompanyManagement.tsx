import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { 
  Building2, 
  Users, 
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Search,
  Mail,
  Phone,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const branchOptions = ["Computer Science", "Information Technology", "Electronics", "Electrical", "Mechanical", "Civil", "Chemical", "Production"];

const CompanyManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [companies, setCompanies] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isTPOAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const stored = localStorage.getItem("companyDrives");
    if (stored) {
      setCompanies(JSON.parse(stored));
    } else {
      const demoCompanies = [
        {
          id: 1,
          name: "TCS",
          industry: "IT Services",
          jobRole: "Software Engineer",
          ctcRange: "7-9 LPA",
          description: "Tata Consultancy Services is a global IT services and consulting company.",
          contactPerson: "HR Team",
          contactEmail: "careers@tcs.com",
          contactPhone: "+91 1234567890",
          driveDate: "2026-03-15",
          registrationDeadline: "2026-03-10",
          location: "Multiple Locations",
          registrationType: "internal",
          registrationLink: "",
          status: "Active",
          logo: "🏢",
          studentsHired: 0,
          appliedStudents: 0,
          selectedStudents: 0,
          visits: 0,
          lastVisit: "",
          allowedBranches: ["Computer Science", "Information Technology", "Electronics"],
          eligibilityCriteria: {
            branches: ["Computer Science", "Information Technology", "Electronics"],
            minCGPA: 6.0,
            maxBacklogs: 2,
            tenthPercentage: 60,
            twelfthPercentage: 60
          },
          isEligible: true,
          isRegistered: false,
          appliedStudentsList: [],
          sentToStudents: true
        },
        {
          id: 2,
          name: "Wipro",
          industry: "IT Services",
          jobRole: "Project Engineer",
          ctcRange: "5-7 LPA",
          description: "Wipro Limited is a leading global information technology services company.",
          contactPerson: "HR Team",
          contactEmail: "careers@wipro.com",
          contactPhone: "+91 9876543210",
          driveDate: "2026-03-20",
          registrationDeadline: "2026-03-15",
          location: "Bangalore",
          registrationType: "internal",
          registrationLink: "",
          status: "Active",
          logo: "💻",
          studentsHired: 0,
          appliedStudents: 0,
          selectedStudents: 0,
          visits: 0,
          lastVisit: "",
          allowedBranches: ["Computer Science", "Information Technology", "Electronics", "Electrical"],
          eligibilityCriteria: {
            branches: ["Computer Science", "Information Technology", "Electronics", "Electrical"],
            minCGPA: 6.0,
            maxBacklogs: 2,
            tenthPercentage: 60,
            twelfthPercentage: 55
          },
          isEligible: true,
          isRegistered: false,
          appliedStudentsList: [],
          sentToStudents: true
        },
        {
          id: 3,
          name: "Google",
          industry: "Technology",
          jobRole: "Software Developer",
          ctcRange: "25-30 LPA",
          description: "Google LLC is a global technology company specializing in Internet-related services.",
          contactPerson: "HR Team",
          contactEmail: "careers@google.com",
          contactPhone: "+91 9988776655",
          driveDate: "2026-04-01",
          registrationDeadline: "2026-03-25",
          location: "Bangalore/Hyderabad",
          registrationType: "google",
          registrationLink: "https://forms.google.com/example",
          status: "Active",
          logo: "🔍",
          studentsHired: 0,
          appliedStudents: 0,
          selectedStudents: 0,
          visits: 0,
          lastVisit: "",
          allowedBranches: ["Computer Science", "Information Technology"],
          eligibilityCriteria: {
            branches: ["Computer Science", "Information Technology"],
            minCGPA: 8.0,
            maxBacklogs: 0,
            tenthPercentage: 85,
            twelfthPercentage: 85
          },
          isEligible: true,
          isRegistered: false,
          appliedStudentsList: [],
          sentToStudents: true
        },
        {
          id: 4,
          name: "Amazon",
          industry: "E-Commerce",
          jobRole: "Software Development Engineer",
          ctcRange: "20-25 LPA",
          description: "Amazon is a global e-commerce and cloud computing company.",
          contactPerson: "HR Team",
          contactEmail: "careers@amazon.com",
          contactPhone: "+91 9123456789",
          driveDate: "2026-04-10",
          registrationDeadline: "2026-04-05",
          location: "Bangalore",
          registrationType: "internal",
          registrationLink: "",
          status: "Active",
          logo: "📦",
          studentsHired: 0,
          appliedStudents: 0,
          selectedStudents: 0,
          visits: 0,
          lastVisit: "",
          allowedBranches: ["Computer Science", "Information Technology", "Electronics"],
          eligibilityCriteria: {
            branches: ["Computer Science", "Information Technology", "Electronics"],
            minCGPA: 7.5,
            maxBacklogs: 1,
            tenthPercentage: 80,
            twelfthPercentage: 80
          },
          isEligible: true,
          isRegistered: false,
          appliedStudentsList: [],
          sentToStudents: true
        }
      ];
      localStorage.setItem("companyDrives", JSON.stringify(demoCompanies));
      setCompanies(demoCompanies);
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    jobRole: "",
    ctcRange: "",
    description: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    driveDate: "",
    registrationDeadline: "",
    location: "",
    registrationType: "internal",
    registrationLink: "",
    status: "Active",
    eligibilityCriteria: {
      branches: [] as string[],
      minCGPA: 6.0,
      maxBacklogs: 2,
      tenthPercentage: 60,
      twelfthPercentage: 60
    }
  });

  const [companyDocument, setCompanyDocument] = useState<{
    name: string;
    data: string;
    type: string;
  } | null>(null);

  const handleAddCompany = () => {
    const newCompany = {
      id: Date.now(),
      name: formData.name,
      industry: formData.industry,
      jobRole: formData.jobRole,
      ctcRange: formData.ctcRange,
      ctc: formData.ctcRange,
      position: formData.jobRole,
      description: formData.description,
      contactPerson: formData.contactPerson,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      driveDate: formData.driveDate,
      registrationDeadline: formData.registrationDeadline || formData.driveDate,
      location: formData.location,
      registrationType: formData.registrationType,
      registrationLink: formData.registrationLink,
      status: "Active",
      logo: "🏢",
      studentsHired: 0,
      appliedStudents: 0,
      selectedStudents: 0,
      visits: 0,
      lastVisit: "",
      allowedBranches: formData.eligibilityCriteria.branches,
      isEligible: true,
      isRegistered: false,
      appliedStudentsList: [] as any[],
      sentToStudents: true,
      companyDocument: companyDocument
    };
    
    const updatedCompanies = [...companies, newCompany];
    setCompanies(updatedCompanies);
    localStorage.setItem("companyDrives", JSON.stringify(updatedCompanies));
    
    setShowAddDialog(false);
    resetForm();
    
    toast({
      title: "Company Drive Created",
      description: "New company drive has been created and shared with students.",
    });

    setTimeout(() => {
      window.dispatchEvent(new Event('storage'));
    }, 100);
  };

  const handleUpdateCompany = () => {
    const updatedCompanies = companies.map(c => 
      c.id === editingCompany.id ? { ...c, ...formData } : c
    );
    setCompanies(updatedCompanies);
    localStorage.setItem("companyDrives", JSON.stringify(updatedCompanies));
    
    setShowAddDialog(false);
    setEditingCompany(null);
    resetForm();
    
    toast({
      title: "Company Updated",
      description: "Company details have been updated successfully.",
    });
    
    setTimeout(() => {
      window.dispatchEvent(new Event('storage'));
    }, 100);
  };

  const handleEditCompany = (company: any) => {
    setEditingCompany(company);
    setFormData({
      name: company.name || "",
      industry: company.industry || "",
      jobRole: company.jobRole || "",
      ctcRange: company.ctcRange || "",
      description: company.description || "",
      contactPerson: company.contactPerson || "",
      contactEmail: company.contactEmail || "",
      contactPhone: company.contactPhone || "",
      driveDate: company.driveDate || "",
      registrationDeadline: company.registrationDeadline || "",
      location: company.location || "",
      registrationType: company.registrationType || "internal",
      registrationLink: company.registrationLink || "",
      status: company.status || "Active",
      eligibilityCriteria: company.eligibilityCriteria || {
        branches: [],
        minCGPA: 6.0,
        maxBacklogs: 2,
        tenthPercentage: 60,
        twelfthPercentage: 60
      }
    });
    setShowAddDialog(true);
  };

  const handleDeleteCompany = (id: number) => {
    const updatedCompanies = companies.filter(c => c.id !== id);
    setCompanies(updatedCompanies);
    localStorage.setItem("companyDrives", JSON.stringify(updatedCompanies));
    toast({
      title: "Company Deleted",
      description: "Company has been removed successfully.",
    });
    
    setTimeout(() => {
      window.dispatchEvent(new Event('storage'));
    }, 100);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      industry: "",
      jobRole: "",
      ctcRange: "",
      description: "",
      contactPerson: "",
      contactEmail: "",
      contactPhone: "",
      driveDate: "",
      registrationDeadline: "",
      location: "",
      registrationType: "internal",
      registrationLink: "",
      status: "Active",
      eligibilityCriteria: {
        branches: [],
        minCGPA: 6.0,
        maxBacklogs: 2,
        tenthPercentage: 60,
        twelfthPercentage: 60
      }
    });
    setCompanyDocument(null);
  };

  const handleCompanyDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyDocument({
          name: file.name,
          data: reader.result as string,
          type: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Company Management</h1>
              <p className="text-muted-foreground">Create and manage company placement drives</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => navigate("/tpo-dashboard")}>
                Go to TPO Dashboard
              </Button>
              <Button onClick={() => { resetForm(); setEditingCompany(null); setShowAddDialog(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Create Company Drive
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="glass border-border/30">
              <CardContent className="p-6 text-center">
                <Building2 className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4" />
                <h3 className="text-2xl font-bold">{companies.length}</h3>
                <p className="text-muted-foreground">Total Drives</p>
              </CardContent>
            </Card>
            
            <Card className="glass border-border/30">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-4" />
                <h3 className="text-2xl font-bold">{companies.reduce((sum, c) => sum + (c.appliedStudents || 0), 0)}</h3>
                <p className="text-muted-foreground">Total Applications</p>
              </CardContent>
            </Card>
            
            <Card className="glass border-border/30">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mx-auto mb-4" />
                <h3 className="text-2xl font-bold">{companies.reduce((sum, c) => sum + (c.selectedStudents || 0), 0)}</h3>
                <p className="text-muted-foreground">Total Selected</p>
              </CardContent>
            </Card>
          </div>

          <Card className="glass border-border/30 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {filteredCompanies.length === 0 ? (
              <Card className="glass border-border/30">
                <CardContent className="p-12 text-center">
                  <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Company Drives</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first company drive to get started.
                  </p>
                  <Button onClick={() => setShowAddDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Company Drive
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredCompanies.map((company) => (
                <Card key={company.id} className="glass border-border/30 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                          {company.logo || "🏢"}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{company.name}</h3>
                          <p className="text-sm text-muted-foreground">{company.industry}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={company.status === "Active" ? "default" : "outline"}>
                          {company.status}
                        </Badge>
                        {company.companyDocument && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            📄 Document
                          </Badge>
                        )}
                        <Button size="sm" variant="outline" onClick={() => handleEditCompany(company)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteCompany(company.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{company.jobRole}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Drive Details</h4>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Package:</span>
                            <span className="font-bold">{company.ctcRange}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Drive Date:</span>
                            <span className="font-medium">{company.driveDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Deadline:</span>
                            <span className="font-medium">{company.registrationDeadline}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Contact Information</h4>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{company.contactEmail}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{company.contactPhone}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Student Records</h4>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Applied:</span>
                            <span className="font-bold text-blue-600">{company.appliedStudents || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Selected:</span>
                            <span className="font-bold text-green-600">{company.selectedStudents || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingCompany ? "Edit Company Drive" : "Create New Company Drive"}</CardTitle>
              <CardDescription>
                {editingCompany ? "Update the company drive details" : "Fill in the details to create a new placement drive"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Google, Microsoft"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    placeholder="e.g., Technology, Finance"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jobRole">Job Role *</Label>
                <Input
                  id="jobRole"
                  value={formData.jobRole}
                  onChange={(e) => setFormData({...formData, jobRole: e.target.value})}
                  placeholder="e.g., Software Engineer"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ctcRange">CTC Range *</Label>
                  <Input
                    id="ctcRange"
                    value={formData.ctcRange}
                    onChange={(e) => setFormData({...formData, ctcRange: e.target.value})}
                    placeholder="e.g., 10-15 LPA"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g., Bangalore/Hyderabad"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="driveDate">Drive Date *</Label>
                  <Input
                    id="driveDate"
                    type="date"
                    value={formData.driveDate}
                    onChange={(e) => setFormData({...formData, driveDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                  <Input
                    id="registrationDeadline"
                    type="date"
                    value={formData.registrationDeadline}
                    onChange={(e) => setFormData({...formData, registrationDeadline: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                    placeholder="Enter contact person name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                    placeholder="careers@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                  placeholder="+91 9876543210"
                />
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Eligibility Criteria</h4>
                <div className="space-y-3">
                  <div>
                    <Label>Allowed Branches</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {branchOptions.map((branch) => (
                        <Button
                          key={branch}
                          type="button"
                          variant={formData.eligibilityCriteria.branches.includes(branch) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const newBranches = formData.eligibilityCriteria.branches.includes(branch)
                              ? formData.eligibilityCriteria.branches.filter(b => b !== branch)
                              : [...formData.eligibilityCriteria.branches, branch];
                            setFormData({
                              ...formData,
                              eligibilityCriteria: {
                                ...formData.eligibilityCriteria,
                                branches: newBranches
                              }
                            });
                          }}
                        >
                          {branch}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="minCGPA">Min CGPA</Label>
                      <Input
                        id="minCGPA"
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={formData.eligibilityCriteria.minCGPA}
                        onChange={(e) => setFormData({
                          ...formData,
                          eligibilityCriteria: {
                            ...formData.eligibilityCriteria,
                            minCGPA: parseFloat(e.target.value) || 0
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="maxBacklogs">Max Backlogs</Label>
                      <Input
                        id="maxBacklogs"
                        type="number"
                        min="0"
                        value={formData.eligibilityCriteria.maxBacklogs}
                        onChange={(e) => setFormData({
                          ...formData,
                          eligibilityCriteria: {
                            ...formData.eligibilityCriteria,
                            maxBacklogs: parseInt(e.target.value) || 0
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="tenthPercentage">10th %</Label>
                      <Input
                        id="tenthPercentage"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.eligibilityCriteria.tenthPercentage}
                        onChange={(e) => setFormData({
                          ...formData,
                          eligibilityCriteria: {
                            ...formData.eligibilityCriteria,
                            tenthPercentage: parseFloat(e.target.value) || 0
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="twelfthPercentage">12th %</Label>
                      <Input
                        id="twelfthPercentage"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.eligibilityCriteria.twelfthPercentage}
                        onChange={(e) => setFormData({
                          ...formData,
                          eligibilityCriteria: {
                            ...formData.eligibilityCriteria,
                            twelfthPercentage: parseFloat(e.target.value) || 0
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Company Documents (JD/Brochure)</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <Label htmlFor="companyDocument" className="cursor-pointer">
                      <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/80">
                        Upload PDF
                      </div>
                      <Input
                        id="companyDocument"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={handleCompanyDocumentUpload}
                      />
                    </Label>
                    {companyDocument && (
                      <span className="text-sm text-green-600 flex items-center gap-1">
                        ✓ {companyDocument.name}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Upload company brochure, job description, or other documents (PDF, DOC, DOCX)</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter company description"
                  rows={3}
                />
              </div>
            </CardContent>
            <div className="flex justify-end gap-2 p-6 border-t">
              <Button variant="outline" onClick={() => { setShowAddDialog(false); setEditingCompany(null); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={editingCompany ? handleUpdateCompany : handleAddCompany}>
                {editingCompany ? "Update Drive" : "Create Drive"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CompanyManagement;
