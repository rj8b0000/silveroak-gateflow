import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Simple CAPTCHA component
const SimpleCaptcha = ({ onVerify }: { onVerify: (isValid: boolean) => void }) => {
  const [num1] = useState(Math.floor(Math.random() * 10) + 1);
  const [num2] = useState(Math.floor(Math.random() * 10) + 1);
  const [userAnswer, setUserAnswer] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const correctAnswer = num1 + num2;
    const isValid = parseInt(userAnswer) === correctAnswer;
    setIsVerified(isValid);
    onVerify(isValid);
  }, [userAnswer, num1, num2, onVerify]);

  return (
    <div className="space-y-2">
      <Label htmlFor="captcha">Security Verification</Label>
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">{num1} + {num2} = </span>
        <Input
          id="captcha"
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Answer"
          className="w-20"
        />
        {isVerified && <Shield className="h-4 w-4 text-success" />}
      </div>
    </div>
  );
};

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, student, loading } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  useEffect(() => {
    if (student && !loading) {
      if (!student.branch) {
        navigate('/branch-selection');
      } else {
        navigate('/dashboard');
      }
    }
  }, [student, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent, isSignUp: boolean = false) => {
    e.preventDefault();
    
    if (!isCaptchaVerified) {
      toast({
        title: "Verification Required",
        description: "Please complete the security verification",
        variant: "destructive",
      });
      return;
    }

    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Validate university email domain
    if (!email.endsWith('@university.edu')) {
      toast({
        title: "Invalid Email Domain",
        description: "Only university email addresses (@university.edu) are allowed",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = isSignUp ? await signUp(email, password) : await signIn(email, password);
      
      if (error) {
        toast({
          title: "Authentication Failed",
          description: error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: isSignUp ? "Account created successfully" : "Signed in successfully",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center">
        <div className="text-foreground text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Silver Oak University
          </CardTitle>
          <CardDescription>
            GATE CLUB - Student Access Portal
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="signin" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">First Time</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-signin">University Email</Label>
                  <Input
                    id="email-signin"
                    type="email"
                    placeholder="your.name@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password-signin">Password</Label>
                  <div className="relative">
                    <Input
                      id="password-signin"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <SimpleCaptcha onVerify={setIsCaptchaVerified} />
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting || !isCaptchaVerified}
                >
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
                <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 mb-4">
                  <p className="text-sm text-primary">
                    <strong>First time accessing GATE CLUB?</strong><br/>
                    Enter your university email and create a password for future logins.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email-signup">University Email</Label>
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="your.name@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password-signup">Create Password</Label>
                  <div className="relative">
                    <Input
                      id="password-signup"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a secure password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <SimpleCaptcha onVerify={setIsCaptchaVerified} />
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting || !isCaptchaVerified}
                >
                  {isSubmitting ? "Setting Up..." : "Set Password & Access"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Free resources for Silver Oak University students only
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-800 mb-1">Demo Credentials</p>
              <p className="text-xs text-blue-600">Email: rudraksh@university.edu</p>
              <p className="text-xs text-blue-600">Password: test</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
