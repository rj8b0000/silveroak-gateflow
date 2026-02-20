import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Filter,
  Clock,
  Star,
  Bookmark,
  Calendar,
  BookOpen,
  TrendingUp
} from 'lucide-react';

interface PYQPaper {
  id: string;
  year: number;
  session: 'Feb' | 'Oct';
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  downloads: number;
  views: number;
  topics: string[];
  duration: string;
  marks: number;
  isBookmarked: boolean;
  pdfUrl: string;
  solutionUrl?: string;
}

const PYQs = () => {
  const { student } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedSession, setSelectedSession] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'year' | 'downloads' | 'difficulty'>('year');

  // Sample data - would come from API
  const pyqPapers: PYQPaper[] = [
    {
      id: '1',
      year: 2023,
      session: 'Feb',
      subject: 'Computer Science',
      difficulty: 'Medium',
      downloads: 2450,
      views: 5620,
      topics: ['Data Structures', 'Algorithms', 'Operating Systems', 'DBMS'],
      duration: '3 hours',
      marks: 100,
      isBookmarked: true,
      pdfUrl: '/papers/gate-2023-cs.pdf',
      solutionUrl: '/solutions/gate-2023-cs-solutions.pdf'
    },
    {
      id: '2',
      year: 2023,
      session: 'Oct',
      subject: 'Computer Science',
      difficulty: 'Hard',
      downloads: 1890,
      views: 4120,
      topics: ['Computer Networks', 'Software Engineering', 'TOC', 'COA'],
      duration: '3 hours',
      marks: 100,
      isBookmarked: false,
      pdfUrl: '/papers/gate-2023-oct-cs.pdf',
      solutionUrl: '/solutions/gate-2023-oct-cs-solutions.pdf'
    },
    {
      id: '3',
      year: 2022,
      session: 'Feb',
      subject: 'Computer Science',
      difficulty: 'Medium',
      downloads: 3120,
      views: 7890,
      topics: ['Data Structures', 'Algorithms', 'Mathematics', 'Digital Logic'],
      duration: '3 hours',
      marks: 100,
      isBookmarked: true,
      pdfUrl: '/papers/gate-2022-cs.pdf',
      solutionUrl: '/solutions/gate-2022-cs-solutions.pdf'
    },
    {
      id: '4',
      year: 2021,
      session: 'Feb',
      subject: 'Computer Science',
      difficulty: 'Easy',
      downloads: 2780,
      views: 6450,
      topics: ['Programming', 'Data Structures', 'DBMS', 'Operating Systems'],
      duration: '3 hours',
      marks: 100,
      isBookmarked: false,
      pdfUrl: '/papers/gate-2021-cs.pdf'
    },
    {
      id: '5',
      year: 2020,
      session: 'Feb',
      subject: 'Computer Science',
      difficulty: 'Hard',
      downloads: 2340,
      views: 5670,
      topics: ['Algorithms', 'TOC', 'Compiler Design', 'Computer Networks'],
      duration: '3 hours',
      marks: 100,
      isBookmarked: false,
      pdfUrl: '/papers/gate-2020-cs.pdf',
      solutionUrl: '/solutions/gate-2020-cs-solutions.pdf'
    }
  ];

  const allTopics = [...new Set(pyqPapers.flatMap(paper => paper.topics))];
  const years = [...new Set(pyqPapers.map(paper => paper.year))].sort((a, b) => b - a);

  const filteredPapers = pyqPapers.filter(paper => {
    const matchesSearch = paper.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesYear = selectedYear === 'all' || paper.year.toString() === selectedYear;
    const matchesSession = selectedSession === 'all' || paper.session === selectedSession;
    const matchesDifficulty = selectedDifficulty === 'all' || paper.difficulty === selectedDifficulty;
    const matchesTopic = selectedTopic === 'all' || paper.topics.includes(selectedTopic);

    return matchesSearch && matchesYear && matchesSession && matchesDifficulty && matchesTopic;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'year':
        return b.year - a.year;
      case 'downloads':
        return b.downloads - a.downloads;
      case 'difficulty':
        const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
      default:
        return 0;
    }
  });

  const toggleBookmark = (paperId: string) => {
    // API call to toggle bookmark
    console.log('Toggling bookmark for paper:', paperId);
  };

  const downloadPaper = (paper: PYQPaper) => {
    // API call to track download and initiate download
    console.log('Downloading paper:', paper.id);
  };

  const viewPaper = (paper: PYQPaper) => {
    // Open PDF viewer
    console.log('Viewing paper:', paper.id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Past Year Questions (PYQs)
          </h1>
          <p className="text-muted-foreground">
            Last 5 years of GATE papers for {student?.branch}
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Papers</p>
                  <p className="text-2xl font-bold">{pyqPapers.length}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Years Covered</p>
                  <p className="text-2xl font-bold">2019-2023</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bookmarked</p>
                  <p className="text-2xl font-bold">{pyqPapers.filter(p => p.isBookmarked).length}</p>
                </div>
                <Bookmark className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Downloads</p>
                  <p className="text-2xl font-bold">{pyqPapers.reduce((sum, p) => sum + p.downloads, 0).toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search papers, topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label>Year</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Session</Label>
                <Select value={selectedSession} onValueChange={setSelectedSession}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Sessions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sessions</SelectItem>
                    <SelectItem value="Feb">February</SelectItem>
                    <SelectItem value="Oct">October</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Difficulty</Label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Sort By</Label>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="year">Year</SelectItem>
                    <SelectItem value="downloads">Downloads</SelectItem>
                    <SelectItem value="difficulty">Difficulty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Papers Grid/List */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {filteredPapers.length} Papers Found
            </h2>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPapers.map((paper) => (
                <Card key={paper.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">GATE {paper.year}</CardTitle>
                        <CardDescription>{paper.session} Session</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBookmark(paper.id)}
                        className={paper.isBookmarked ? 'text-yellow-500' : 'text-muted-foreground'}
                      >
                        {paper.isBookmarked ? <Star className="h-4 w-4 fill-current" /> : <Star className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Badge className={getDifficultyColor(paper.difficulty)}>
                          {paper.difficulty}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {paper.duration}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {paper.topics.slice(0, 3).map((topic, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                        {paper.topics.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{paper.topics.length - 3} more
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{paper.downloads.toLocaleString()} downloads</span>
                        <span>{paper.views.toLocaleString()} views</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => viewPaper(paper)} className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => downloadPaper(paper)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {paper.solutionUrl && (
                        <Button size="sm" variant="ghost" className="w-full text-xs">
                          <BookOpen className="h-4 w-4 mr-1" />
                          Solutions Available
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPapers.map((paper) => (
                <Card key={paper.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold">GATE {paper.year} - {paper.session} Session</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getDifficultyColor(paper.difficulty)}>
                              {paper.difficulty}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{paper.duration}</span>
                            <span className="text-sm text-muted-foreground">
                              {paper.downloads.toLocaleString()} downloads
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBookmark(paper.id)}
                          className={paper.isBookmarked ? 'text-yellow-500' : 'text-muted-foreground'}
                        >
                          {paper.isBookmarked ? <Star className="h-4 w-4 fill-current" /> : <Star className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" onClick={() => viewPaper(paper)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => downloadPaper(paper)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PYQs;
