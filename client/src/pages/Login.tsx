import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

const Login = () => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [otpExpiry, setOtpExpiry] = useState(0);
  
  const { toast } = useToast();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Handle resend countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCountdown > 0) {
      interval = setInterval(() => {
        setResendCountdown(prev => prev - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [resendCountdown]);

  // Handle OTP expiry countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpExpiry > 0) {
      interval = setInterval(() => {
        setOtpExpiry(prev => prev - 1);
        if (otpExpiry <= 1) {
          setStep('email');
          toast({
            title: "OTP Expired",
            description: "Please request a new OTP",
            variant: "destructive"
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpExpiry, toast]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://sevipure-server.onrender.com/api/auth/login-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setStep('otp');
        setResendCountdown(60); // 1 minute
        setResendDisabled(true);
        setOtpExpiry(120); // 2 minutes
        toast({
          title: "OTP Sent",
          description: "Check your email for the 5-digit OTP",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send OTP",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 5) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 5-digit OTP",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://sevipure-server.onrender.com/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (response.ok) {
        // Login the user
        login(data.user, data.token);
        
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        
        // Redirect to homepage
        navigate('/');
      } else {
        toast({
          title: "Invalid OTP",
          description: data.message || "Please check your OTP and try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://sevipure-server.onrender.com/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setResendCountdown(60);
        setResendDisabled(true);
        setOtpExpiry(120);
        toast({
          title: "New OTP Sent",
          description: "Check your email for the new OTP",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to resend OTP",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Don't render if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="shadow-natural">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                {step === 'email' ? 'Welcome Back' : 'Enter OTP'}
              </CardTitle>
              <CardDescription>
                {step === 'email' 
                  ? 'Sign in to your SeviPure account to continue shopping'
                  : `We've sent a 5-digit OTP to ${email}`
                }
              </CardDescription>
            </CardHeader>

            {step === 'email' ? (
              <form onSubmit={handleSendOTP}>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-primary hover:underline font-medium">
                      Sign up here
                    </Link>
                  </div>
                </CardFooter>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP}>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 5-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 5))}
                      className="text-center text-2xl font-mono tracking-widest"
                      maxLength={5}
                      required
                    />
                    <div className="text-center text-sm text-muted-foreground">
                      OTP expires in {formatTime(otpExpiry)}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify & Login'}
                  </Button>

                  <div className="flex items-center justify-between w-full">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep('email')}
                      className="flex items-center space-x-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back</span>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleResendOTP}
                      disabled={resendDisabled || loading}
                      className="flex items-center space-x-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>
                        {resendDisabled 
                          ? `Resend in ${resendCountdown}s` 
                          : 'Resend OTP'
                        }
                      </span>
                    </Button>
                  </div>
                </CardFooter>
              </form>
            )}
          </Card>
        </div>
      </div>


    </div>
  );
};

export default Login;