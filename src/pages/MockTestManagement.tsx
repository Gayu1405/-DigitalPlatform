import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  BarChart3,
  Target,
  FileText,
  Download,
  Send,
  MessageSquare,
  Brain,
  Code,
  Users,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MockTest {
  id: number;
  title: string;
  type: "aptitude" | "technical" | "coding";
  duration: number;
  totalQuestions: number;
  scheduledDate: string;
  status: "scheduled" | "active" | "completed";
  participants: number;
}

interface MockInterview {
  id: number;
  studentName: string;
  type: "hr" | "technical";
  scheduledDate: string;
  time: string;
  status: "scheduled" | "completed" | "pending";
  feedback?: string;
  rating?: number;
}

interface TestResult {
  testId: number;
  studentEmail: string;
  score: number;
  totalQuestions: number;
  timeTaken: number;
  completedAt: string;
}

const MockTestManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [mockInterviews, setMockInterviews] = useState<MockInterview[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [showCreateTest, setShowCreateTest] = useState(false);
  const [showScheduleInterview, setShowScheduleInterview] = useState(false);
  const [selectedTest, setSelectedTest] = useState<MockTest | null>(null);
  const [testInProgress, setTestInProgress] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [testStartTime, setTestStartTime] = useState<number>(0);

  const [newTest, setNewTest] = useState({
    title: "",
    type: "aptitude" as "aptitude" | "technical" | "coding",
    duration: 30,
    totalQuestions: 20,
    scheduledDate: ""
  });

  const [newInterview, setNewInterview] = useState({
    studentId: "",
    type: "hr" as "hr" | "technical",
    scheduledDate: "",
    time: ""
  });

  const sampleQuestions = [
    { id: 1, question: "What is the time complexity of binary search?", options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"], correct: 2 },
    { id: 2, question: "Which data structure uses LIFO principle?", options: ["Queue", "Stack", "Array", "Linked List"], correct: 1 },
    { id: 3, question: "What is the output of 2+2*2?", options: ["6", "8", "4", "10"], correct: 0 },
    { id: 4, question: "Which sorting algorithm has best case O(n log n)?", options: ["Bubble Sort", "Quick Sort", "Selection Sort", "Insertion Sort"], correct: 1 },
    { id: 5, question: "What is a deadlock in operating systems?", options: ["Memory overflow", "Circular wait for resources", "CPU overload", "Network failure"], correct: 1 },
    { id: 6, question: "Which SQL command is used to retrieve data?", options: ["INSERT", "UPDATE", "SELECT", "DELETE"], correct: 2 },
    { id: 7, question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks Text Mark Language"], correct: 0 },
    { id: 8, question: "What is the base of hexadecimal number system?", options: ["8", "10", "16", "2"], correct: 2 },
    { id: 9, question: "Which protocol is used for web pages?", options: ["FTP", "HTTP", "SMTP", "TCP"], correct: 1 },
    { id: 10, question: "What is the full form of CPU?", options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Core Processing Unit"], correct: 0 }
  ];

  useEffect(() => {
    const isStudent = localStorage.getItem("isStudentAuthenticated");
    if (!isStudent) {
      navigate("/login");
      return;
    }

    const storedTests = localStorage.getItem("mockTests");
    if (storedTests) {
      setMockTests(JSON.parse(storedTests));
    } else {
      const demoTests: MockTest[] = [
        { id: 1, title: "Aptitude Test - Batch 1", type: "aptitude", duration: 30, totalQuestions: 20, scheduledDate: "2026-02-25", status: "scheduled", participants: 45 },
        { id: 2, title: "Technical MCQ - Programming", type: "technical", duration: 45, totalQuestions: 30, scheduledDate: "2026-02-28", status: "scheduled", participants: 38 },
        { id: 3, title: "Coding Challenge - Easy", type: "coding", duration: 60, totalQuestions: 3, scheduledDate: "2026-03-01", status: "scheduled", participants: 25 },
        { id: 4, title: "Aptitude Test - Batch 2", type: "aptitude", duration: 30, totalQuestions: 20, scheduledDate: "2026-02-15", status: "completed", participants: 50 },
      ];
      localStorage.setItem("mockTests", JSON.stringify(demoTests));
      setMockTests(demoTests);
    }

    const storedInterviews = localStorage.getItem("mockInterviews");
    if (storedInterviews) {
      setMockInterviews(JSON.parse(storedInterviews));
    } else {
      const currentStudent = JSON.parse(localStorage.getItem("currentStudent") || "{}");
      const demoInterviews: MockInterview[] = [
        { id: 1, studentName: "John Doe", type: "hr", scheduledDate: "2026-02-22", time: "10:00 AM", status: "completed", feedback: "Good communication skills. Work on situational questions.", rating: 4 },
        { id: 2, studentName: "John Doe", type: "technical", scheduledDate: "2026-02-26", time: "2:00 PM", status: "scheduled" },
      ];
      localStorage.setItem("mockInterviews", JSON.stringify(demoInterviews));
      setMockInterviews(demoInterviews);
    }

    const storedResults = localStorage.getItem("testResults");
    if (storedResults) {
      setTestResults(JSON.parse(storedResults));
    }

    const storedStudents = localStorage.getItem("studentRegistrations");
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    }
  }, [navigate]);

  const handleStartTest = (test: MockTest) => {
    setSelectedTest(test);
    setTestInProgress(true);
    setCurrentQuestion(0);
    setAnswers({});
    setTestStartTime(Date.now());
    toast({
      title: "Test Started",
      description: `${test.title} - ${test.duration} minutes`,
    });
  };

  const handleSubmitTest = () => {
    if (!selectedTest) return;

    let correct = 0;
    sampleQuestions.slice(0, selectedTest.totalQuestions).forEach((q, idx) => {
      if (answers[idx] === q.correct.toString()) correct++;
    });

    const score = Math.round((correct / selectedTest.totalQuestions) * 100);
    const timeTaken = Math.round((Date.now() - testStartTime) / 60000);

    const currentStudent = JSON.parse(localStorage.getItem("currentStudent") || "{}");
    const result: TestResult = {
      testId: selectedTest.id,
      studentEmail: currentStudent.email,
      score,
      totalQuestions: selectedTest.totalQuestions,
      timeTaken,
      completedAt: new Date().toISOString()
    };

    const updatedResults = [...testResults, result];
    setTestResults(updatedResults);
    localStorage.setItem("testResults", JSON.stringify(updatedResults));

    setTestInProgress(false);
    setSelectedTest(null);

    toast({
      title: "Test Completed",
      description: `Your score: ${score}% (${correct}/${selectedTest.totalQuestions})`,
    });
  };

  const getTestIcon = (type: string) => {
    switch (type) {
      case "aptitude": return <Brain className="w-5 h-5" />;
      case "technical": return <Code className="w-5 h-5" />;
      case "coding": return <Code className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "aptitude": return "bg-blue-500";
      case "technical": return "bg-green-500";
      case "coding": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  if (testInProgress && selectedTest) {
    const questions = sampleQuestions.slice(0, selectedTest.totalQuestions);
    const currentQ = questions[currentQuestion];

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{selectedTest.title}</CardTitle>
              <Badge variant="outline">Question {currentQuestion + 1} of {questions.length}</Badge>
            </div>
            <Progress value={(currentQuestion + 1) / questions.length * 100} />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-lg font-medium">{currentQ.question}</p>
            </div>
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => (
                <Button
                  key={idx}
                  variant={answers[currentQuestion] === idx.toString() ? "default" : "outline"}
                  className="w-full justify-start text-left h-auto p-4"
                  onClick={() => setAnswers({ ...answers, [currentQuestion]: idx.toString() })}
                >
                  <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                  {option}
                </Button>
              ))}
            </div>
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              {currentQuestion === questions.length - 1 ? (
                <Button onClick={handleSubmitTest}>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Test
                </Button>
              ) : (
                <Button onClick={() => setCurrentQuestion(currentQuestion + 1)}>
                  Next
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <h1 className="text-xl font-bold">Mock Test & Interview</h1>
              <p className="text-sm text-muted-foreground">Practice & Improve Your Skills</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/student-dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="tests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tests">Mock Tests</TabsTrigger>
            <TabsTrigger value="interviews">Mock Interviews</TabsTrigger>
          </TabsList>

          <TabsContent value="tests" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="glass border-border/30">
                <CardContent className="p-6 text-center">
                  <Brain className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-3" />
                  <h3 className="text-2xl font-bold">{mockTests.filter(t => t.type === "aptitude").length}</h3>
                  <p className="text-muted-foreground">Aptitude Tests</p>
                </CardContent>
              </Card>
              <Card className="glass border-border/30">
                <CardContent className="p-6 text-center">
                  <Code className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-3" />
                  <h3 className="text-2xl font-bold">{mockTests.filter(t => t.type === "technical").length}</h3>
                  <p className="text-muted-foreground">Technical Tests</p>
                </CardContent>
              </Card>
              <Card className="glass border-border/30">
                <CardContent className="p-6 text-center">
                  <Target className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-3" />
                  <h3 className="text-2xl font-bold">{testResults.length}</h3>
                  <p className="text-muted-foreground">Tests Completed</p>
                </CardContent>
              </Card>
              <Card className="glass border-border/30">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center mx-auto mb-3" />
                  <h3 className="text-2xl font-bold">
                    {testResults.length > 0 ? Math.round(testResults.reduce((a, b) => a + b.score, 0) / testResults.length) : 0}%
                  </h3>
                  <p className="text-muted-foreground">Avg Score</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Available Tests</h3>
              {mockTests.map((test) => {
                const myResult = testResults.find(r => r.testId === test.id);
                return (
                  <Card key={test.id} className="glass border-border/30">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-lg ${getTypeColor(test.type)}/10 flex items-center justify-center`}>
                            {getTestIcon(test.type)}
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold">{test.title}</h4>
                            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {test.duration} min
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                {test.totalQuestions} questions
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {test.scheduledDate}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={test.status === "completed" ? "default" : "secondary"}>
                            {test.status}
                          </Badge>
                          {myResult && (
                            <Badge variant="outline" className="bg-green-50">
                              Score: {myResult.score}%
                            </Badge>
                          )}
                        </div>
                      </div>
                      {test.status !== "completed" && !myResult && (
                        <div className="mt-4 pt-4 border-t">
                          <Button onClick={() => handleStartTest(test)}>
                            <Play className="w-4 h-4 mr-2" />
                            Start Test
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="interviews" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="glass border-border/30">
                <CardContent className="p-6 text-center">
                  <Users className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-3" />
                  <h3 className="text-2xl font-bold">{mockInterviews.length}</h3>
                  <p className="text-muted-foreground">Total Interviews</p>
                </CardContent>
              </Card>
              <Card className="glass border-border/30">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-3" />
                  <h3 className="text-2xl font-bold">{mockInterviews.filter(i => i.status === "completed").length}</h3>
                  <p className="text-muted-foreground">Completed</p>
                </CardContent>
              </Card>
              <Card className="glass border-border/30">
                <CardContent className="p-6 text-center">
                  <Clock className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center mx-auto mb-3" />
                  <h3 className="text-2xl font-bold">{mockInterviews.filter(i => i.status === "scheduled").length}</h3>
                  <p className="text-muted-foreground">Scheduled</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">My Mock Interviews</h3>
              {mockInterviews.length === 0 ? (
                <Card className="glass border-border/30">
                  <CardContent className="p-12 text-center">
                    <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Mock Interviews Scheduled</h3>
                    <p className="text-muted-foreground">
                      Contact your TPO or faculty to schedule mock interviews.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {mockInterviews.map((interview) => (
                    <Card key={interview.id} className="glass border-border/30">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-lg ${interview.type === "hr" ? "bg-blue-500/10" : "bg-green-500/10"} flex items-center justify-center`}>
                              <MessageSquare className={`w-6 h-6 ${interview.type === "hr" ? "text-blue-500" : "text-green-500"}`} />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold">
                                {interview.type === "hr" ? "HR Interview" : "Technical Interview"}
                              </h4>
                              <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {interview.scheduledDate}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {interview.time}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant={interview.status === "completed" ? "default" : interview.status === "scheduled" ? "secondary" : "outline"}>
                              {interview.status}
                            </Badge>
                            {interview.rating && (
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span key={star} className={star <= interview.rating! ? "text-yellow-500" : "text-gray-300"}>★</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        {interview.feedback && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm font-medium mb-1">Feedback:</p>
                            <p className="text-sm text-muted-foreground">{interview.feedback}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MockTestManagement;
