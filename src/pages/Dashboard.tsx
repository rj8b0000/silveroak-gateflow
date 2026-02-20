import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  TrendingUp, 
  Users, 
  Calendar,
  FileText,
  Video,
  Star,
  Download,
  Play,
  Timer,
  Target,
  Award,
  Bell,
  GraduationCap
} from 'lucide-react';

const Dashboard = () => {
  const { student } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [annResponse, lbResponse] = await Promise.all([
          api.get('/announcements'),
          api.get('/users/leaderboard')
        ]);

        if (annResponse.success) setAnnouncements(annResponse.data);
        if (lbResponse.success) setLeaderboard(lbResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const quickStats = {
    totalTests: 45,
    completedTests: 12,
    averageScore: 68,
    studyHours: 124,
    rank: 23,
    totalStudents: 156
  };

  const recentTests = [
    { id: 1, name: 'Data Structures & Algorithms', score: 75, date: '2024-01-15', duration: '3h' },
    { id: 2, name: 'Computer Networks', score: 82, date: '2024-01-12', duration: '3h' },
    { id: 3, name: 'Operating Systems', score: 65, date: '2024-01-10', duration: '3h' }
  ];

  const upcomingTests = [
    { id: 1, name: 'Database Management Systems', date: '2024-01-20', type: 'Mock Test' },
    { id: 2, name: 'Software Engineering', date: '2024-01-22', type: 'Speed Test' },
    { id: 3, name: 'Computer Organization', date: '2024-01-25', type: 'Mock Test' }
  ];

  const studyMaterials = [
    { id: 1, title: 'GATE 2024 Syllabus', type: 'PDF', downloads: 1250 },
    { id: 2, title: 'Previous Year Solutions', type: 'PDF', downloads: 890 },
    { id: 3, title: 'Important Formulas', type: 'PDF', downloads: 2100 }
  ];

  const recentLectures = [
    { id: 1, title: 'Dynamic Programming Techniques', instructor: 'Prof. Smith', duration: '45m', watched: 75 },
    { id: 2, title: 'Graph Algorithms', instructor: 'Dr. Johnson', duration: '52m', watched: 100 },
    { id: 3, title: 'Database Normalization', instructor: 'Prof. Wilson', duration: '38m', watched: 30 }
  ];

  const notifications = [
    { id: 1, text: 'New mock test available for Database Systems', type: 'test', time: '2h ago' },
    { id: 2, text: 'GATE 2024 application deadline extended to Jan 30', type: 'announcement', time: '1d ago' },
    { id: 3, text: 'Your rank improved to #23 this week!', type: 'achievement', time: '2d ago' }
  ];

  const alumni = [
    { id: 1, name: 'Rajesh Kumar', year: '2023', rank: 'AIR 45', company: 'Google', image: '/placeholder.svg' },
    { id: 2, name: 'Priya Singh', year: '2022', rank: 'AIR 23', company: 'Microsoft', image: '/placeholder.svg' },
    { id: 3, name: 'Amit Sharma', year: '2021', rank: 'AIR 67', company: 'Amazon', image: '/placeholder.svg' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {student?.name}!
          </h1>
          <p className="text-muted-foreground">
            Continue your GATE preparation journey for {student?.branch || 'your branch'}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tests Completed</p>
                  <p className="text-2xl font-bold">{quickStats.completedTests}/{quickStats.totalTests}</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <Progress value={(quickStats.completedTests / quickStats.totalTests) * 100} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                  <p className="text-2xl font-bold">{quickStats.averageScore}%</p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
              <Progress value={quickStats.averageScore} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Rank</p>
                  <p className="text-2xl font-bold">#{quickStats.rank}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Out of {quickStats.totalStudents} students</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Study Hours</p>
                  <p className="text-2xl font-bold">{quickStats.studyHours}h</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-card border border-border text-foreground">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="tests"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
            >
              Tests
            </TabsTrigger>
            <TabsTrigger
              value="pyqs"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
            >
              PYQs
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
            >
              Resources
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="alumni"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
            >
              Alumni
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Test Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Recent Test Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTests.map((test) => (
                      <div key={test.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                        <div>
                          <p className="font-medium">{test.name}</p>
                          <p className="text-sm text-muted-foreground">{test.date} • {test.duration}</p>
                        </div>
                        <Badge variant={test.score >= 70 ? "default" : "secondary"}>
                          {test.score}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Tests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Tests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingTests.map((test) => (
                      <div key={test.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                        <div>
                          <p className="font-medium">{test.name}</p>
                          <p className="text-sm text-muted-foreground">{test.date}</p>
                        </div>
                        <Badge variant="outline">{test.type}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notifications & Announcements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Recent Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.length > 0 ? (
                    announcements.map((ann) => (
                      <div key={ann._id} className="flex items-start gap-3 p-3 bg-accent/50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{ann.title}</p>
                          <p className="text-sm">{ann.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(ann.createdAt).toLocaleDateString()} • {ann.type}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center">No recent announcements</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Mock Tests
                  </CardTitle>
                  <CardDescription>Full-length GATE pattern tests</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full mb-4">Start New Mock Test</Button>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Features:</p>
                    <ul className="text-sm space-y-1">
                      <li>• 3-hour timed examination</li>
                      <li>• Instant results & analysis</li>
                      <li>• Performance comparison</li>
                      <li>• Question-wise breakdown</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5" />
                    Speed Tests
                  </CardTitle>
                  <CardDescription>Quick topic-wise tests</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full mb-4">Start Speed Test</Button>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Features:</p>
                    <ul className="text-sm space-y-1">
                      <li>• 15-30 minute duration</li>
                      <li>• Subject/chapter selection</li>
                      <li>• Speed tracking metrics</li>
                      <li>• Accuracy analysis</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pyqs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Past Year Questions (Last 5 Years)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[2023, 2022, 2021, 2020, 2019].map((year) => (
                    <Card key={year} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">GATE {year}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Computer Science & Engineering
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button size="sm">
                            View Online
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Recorded Lectures
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentLectures.map((lecture) => (
                      <div key={lecture.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{lecture.title}</p>
                          <p className="text-sm text-muted-foreground">{lecture.instructor} • {lecture.duration}</p>
                          <Progress value={lecture.watched} className="mt-2" />
                        </div>
                        <Button size="sm" variant="outline">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Study Materials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {studyMaterials.map((material) => (
                      <div key={material.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                        <div>
                          <p className="font-medium">{material.title}</p>
                          <p className="text-sm text-muted-foreground">{material.downloads} downloads</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboard.length > 0 ? (
                      leaderboard.map((entry, index) => (
                        <div key={entry._id} className={`flex items-center justify-between p-3 rounded-lg border ${
                          entry._id === student?._id ? 'bg-primary/10 border-primary/20' : 'bg-accent/50 border-transparent'
                        }`}>
                          <div className="flex items-center gap-3">
                            <Badge className={index < 3 ? 'bg-yellow-500' : ''}>#{index + 1}</Badge>
                            <div>
                              <p className="font-medium">{entry.user.name}</p>
                              <p className="text-sm text-muted-foreground">{entry.user.branch}</p>
                            </div>
                          </div>
                          <span className="font-bold">{Math.round(entry.averageScore)}%</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center">No data available</p>
                    )}
                    <p className="text-sm text-muted-foreground text-center">
                      University-wide ranking based on overall performance
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Performance Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{quickStats.studyHours}</p>
                        <p className="text-sm text-muted-foreground">Study Hours</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-500">{quickStats.completedTests}</p>
                        <p className="text-sm text-muted-foreground">Tests Completed</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alumni">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Notable Alumni Success Stories
                </CardTitle>
                <CardDescription>
                  Learn from our successful GATE toppers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {alumni.map((person) => (
                    <Card key={person.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <GraduationCap className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-1">{person.name}</h3>
                        <p className="text-sm text-primary font-medium mb-1">{person.rank}</p>
                        <p className="text-sm text-muted-foreground mb-2">GATE {person.year}</p>
                        <Badge variant="outline">{person.company}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
