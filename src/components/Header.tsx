import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BookOpen, Users, Trophy, Menu, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
// import { ThemeToggle } from "@/components/theme-toggle";
// import universityLogo from "@/assets/university-logo.png";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { student, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="bg-background border-b border-border shadow-soft sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* University Logo & Branding */}
          <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate(student ? '/dashboard' : '/')}>
            <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">SOU</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-primary">Silver Oak University</h1>
              <p className="text-sm text-muted-foreground -mt-1">GATE CLUB</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/tests" className="text-foreground hover:text-primary transition-colors">
              Tests
            </Link>
            <Link to="/pyqs" className="text-foreground hover:text-primary transition-colors">
              PYQs
            </Link>
            <Link to="/study-resources" className="text-foreground hover:text-primary transition-colors">
              Resources
            </Link>
            <Link to="/community" className="text-foreground hover:text-primary transition-colors">
              Community
            </Link>
            <Link to="/connect-mentor" className="text-foreground hover:text-primary transition-colors">
              Mentors
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {student ? (
              <>
                <div
                  className="hidden md:flex items-center space-x-2 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => navigate('/dashboard')}
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {student.name}
                  </span>
                </div>
                <Button variant="outline" onClick={handleSignOut} className="hidden md:inline-flex">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => navigate('/auth')} className="hidden md:inline-flex">
                Student Access
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link
                    to="/tests"
                    className="text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Tests
                  </Link>
                  <Link
                    to="/pyqs"
                    className="text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    PYQs
                  </Link>
                  <Link
                    to="/study-resources"
                    className="text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Resources
                  </Link>
                  <Link
                    to="/community"
                    className="text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Community
                  </Link>
                  <Link
                    to="/connect-mentor"
                    className="text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Mentors
                  </Link>
                  
                  <div className="pt-4 border-t">
                    {student ? (
                      <>
                        <div
                          className="pb-2 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => {
                            navigate('/dashboard');
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <p className="text-sm font-medium">{student.name}</p>
                        </div>
                        <Button variant="outline" onClick={handleSignOut} className="w-full">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" onClick={() => navigate('/auth')} className="w-full">
                        Student Access
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
