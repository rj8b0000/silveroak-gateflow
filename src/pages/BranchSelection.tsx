import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Computer, 
  Building, 
  Cog, 
  Zap, 
  Radio, 
  Atom, 
  Plane,
  GraduationCap 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const branches = [
  {
    id: 'CE',
    name: 'Computer Engineering',
    description: 'Software, algorithms, and computing systems',
    icon: Computer,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'CIVIL',
    name: 'Civil Engineering',
    description: 'Infrastructure, construction, and structural design',
    icon: Building,
    color: 'from-gray-500 to-gray-600'
  },
  {
    id: 'ME',
    name: 'Mechanical Engineering',
    description: 'Machines, thermodynamics, and manufacturing',
    icon: Cog,
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'EE',
    name: 'Electrical Engineering',
    description: 'Power systems, electronics, and circuits',
    icon: Zap,
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 'EC',
    name: 'Electronics & Communication',
    description: 'Communication systems and signal processing',
    icon: Radio,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'IT',
    name: 'Information Technology',
    description: 'Computer systems and digital infrastructure',
    icon: Atom,
    color: 'from-green-500 to-green-600'
  },
];

const BranchSelection = () => {
  const navigate = useNavigate();
  const { student, updateBranchSelection } = useAuth();
  const { toast } = useToast();
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBranchSelect = async () => {
    if (!selectedBranch) {
      toast({
        title: "Selection Required",
        description: "Please select your engineering branch",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await updateBranchSelection(selectedBranch);
      
      if (error) {
        toast({
          title: "Update Failed",
          description: error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Branch Selected!",
          description: "Your engineering branch has been set successfully",
        });
        navigate('/dashboard');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="shadow-elegant">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-foreground mb-2">
              Welcome {student?.name}!
            </CardTitle>
            <CardDescription className="text-lg">
              Select your engineering branch to customize your GATE preparation experience
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {branches.map((branch) => {
                const IconComponent = branch.icon;
                const isSelected = selectedBranch === branch.id;
                
                return (
                  <Card
                    key={branch.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                      isSelected 
                        ? 'ring-2 ring-primary bg-primary/5 shadow-glow' 
                        : 'hover:bg-accent/50'
                    }`}
                    onClick={() => setSelectedBranch(branch.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`mx-auto mb-4 h-12 w-12 rounded-full bg-gradient-to-r ${branch.color} flex items-center justify-center`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{branch.name}</h3>
                      <p className="text-sm text-muted-foreground">{branch.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={handleBranchSelect}
                disabled={!selectedBranch || isSubmitting}
                size="lg"
                className="min-w-48"
              >
                {isSubmitting ? "Setting up..." : "Continue to Dashboard"}
              </Button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                This selection will customize your study materials and mock tests
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BranchSelection;
