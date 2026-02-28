import { useState } from "react";
import { User, Building2, Mail, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

const Login = () => {
  const [loginType, setLoginType] = useState<"student" | "tpo" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (loginType === "student") {
        const result = await api.loginStudent(email, password);
        if (result.success) {
          localStorage.setItem("isStudentAuthenticated", "true");
          localStorage.setItem("studentEmail", email);
          localStorage.setItem("currentStudent", JSON.stringify(result.student));
          navigate("/student-dashboard");
        } else {
          alert(result.message || "Login failed");
        }
      } else if (loginType === "tpo") {
        const result = await api.loginTPO(email, password);
        if (result.success) {
          localStorage.setItem("isTPOAuthenticated", "true");
          navigate("/tpo-dashboard");
        } else {
          alert(result.message || "Invalid TPO credentials");
        }
      }
    } catch (error) {
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (type: "student" | "tpo") => {
    if (type === "student") {
      setEmail("student@example.com");
      setPassword("student123");
    } else {
      setEmail("bhosalesuchitra9482@gmail.com");
      setPassword("tpo123");
    }
  };

  const handleBack = () => {
    setLoginType(null);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {loginType && (
            <Button variant="ghost" size="sm" onClick={handleBack} className="absolute left-4 top-4">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <CardTitle className="text-2xl">
            {loginType === "student" ? "Student Login" : loginType === "tpo" ? "TPO Login" : "Login"}
          </CardTitle>
          <CardDescription>
            {loginType
              ? `Enter your ${loginType === "student" ? "student" : "TPO"} credentials`
              : "Select your login type to continue"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!loginType ? (
            <div className="space-y-4">
              <Button
                onClick={() => setLoginType("student")}
                className="w-full h-12 text-lg"
              >
                <User className="w-5 h-5 mr-2" />
                Student Login
              </Button>
              <Button
                onClick={() => setLoginType("tpo")}
                className="w-full h-12 text-lg"
                variant="secondary"
              >
                <Building2 className="w-5 h-5 mr-2" />
                TPO Login
              </Button>
              <div className="text-center mt-4">
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                  Back to Home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={`Enter your ${loginType === "student" ? "student" : "official"} email`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="bg-muted p-3 rounded-lg text-sm">
                <p className="font-medium mb-2">Demo Credentials:</p>
                {loginType === "student" ? (
                  <div>
                    <p>Email: <span className="font-mono">student@example.com</span></p>
                    <p>Password: <span className="font-mono">student123</span></p>
                  </div>
                ) : (
                  <div>
                    <p>Email: <span className="font-mono">bhosalesuchitra9482@gmail.com</span></p>
                    <p>Password: <span className="font-mono">tpo123</span></p>
                  </div>
                )}
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 w-full"
                  onClick={() => fillDemoCredentials(loginType as "student" | "tpo")}
                >
                  Fill Demo Credentials
                </Button>
              </div>

              <Button type="submit" className="w-full">
                Login
              </Button>
              {loginType === "student" && (
                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">New Student?</p>
                  <Link 
                    to="/student-registration" 
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Register Here
                  </Link>
                </div>
              )}
              <div className="text-center mt-4">
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                  Back to Home
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
