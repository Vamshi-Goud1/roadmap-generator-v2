import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import '@/styles/animations.css';
import { 
  Map, 
  FileText, 
  History as HistoryIcon, 
  Newspaper,
  Brain,
  Sparkles,
  Target,
  Bot,
  Lightbulb,
  TrendingUp,
  BarChart,
  Rocket,
  CheckCircle2,
  Image as ImageIcon,
  ChevronRight,
  Users,
  LineChart,
  PieChart,
  ArrowUpRight
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import News from "@/components/News";

const features = [
    {
      id: 'roadmap',
      icon: <Brain className="h-6 w-6 text-primary" />,
      title: "AI-Powered Roadmaps",
      description: "Generate personalized career paths with advanced AI algorithms that understand your goals and aspirations.",
      image: "/images/Roadmap.jpeg",
      stats: "90% Accuracy"
    },
    {
      id: 'resume',
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: "Smart Resume Analysis",
      description: "Extract key skills and requirements using AI to optimize your resume for job applications.",
      image: "/images/Resume.jpeg",
      stats: "2x Faster Hiring"
    },
    {
      id: 'updates',
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
      title: "Real-time Industry Updates",
      description: "Stay informed with AI-curated news and trends in education, technology, and job markets.",
      image: "/images/News.jpeg",
      stats: "24/7 Updates"
    }
];

const statistics = [
    {
      title: "Success Rate",
      value: "95%",
      description: "in career transitions",
      icon: <LineChart className="h-5 w-5" />
    },
    {
      title: "Active Users",
      value: "10K+",
      description: "professionals using our platform",
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Skills Matched",
      value: "98%",
      description: "accuracy in skill mapping",
      icon: <PieChart className="h-5 w-5" />
    }
];

const Home = () => {
  const [activeTab, setActiveTab] = useState('features');
  const [imageError, setImageError] = useState<{[key: string]: boolean}>({});
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsVisible(true);
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = (currentScroll / totalScroll) * 100;
      setScrollProgress(progress);
      document.documentElement.style.setProperty('--scroll', `${progress}%`);
    };
    window.addEventListener('scroll', handleScroll);
    setIsVisible(true); // Trigger initial animation
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (mainRef.current) {
        const rect = mainRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleImageError = (imageId: string) => {
    setImageError(prev => ({
      ...prev,
      [imageId]: true
    }));
  };

  const aiCapabilities = [
    {
      icon: <Target className="h-5 w-5" />,
      title: "Personalized Learning Paths",
      description: "AI adapts to your experience level and goals"
    },
    {
      icon: <Bot className="h-5 w-5" />,
      title: "Natural Language Processing",
      description: "Advanced AI understands your career aspirations"
    },
    {
      icon: <Lightbulb className="h-5 w-5" />,
      title: "Smart Recommendations",
      description: "Get tailored resource suggestions and next steps"
    },
    {
      icon: <BarChart className="h-5 w-5" />,
      title: "Skill Gap Analysis",
      description: "Identify and bridge your skill gaps effectively"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-black text-white overflow-hidden relative">
      {/* Scroll Progress Bar */}
      <div className="progress-bar" />

      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-float-reverse" />
      </div>

      {/* Cursor Gradient Effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-transform duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`
        }}
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23FFFFFF' fill-opacity='0.1'/%3E%3C/svg%3E")`,
        backgroundSize: '40px 40px',
        transform: `translateY(${scrollProgress * 0.2}px)`
      }} />

      <Navbar />
      
      <main ref={mainRef} className="flex-grow relative">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-32 px-6 min-h-[90vh] flex items-center">
          <div 
            className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] transition-transform duration-300"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-primary/5 to-transparent opacity-20"></div>
          <div className="absolute top-1/2 -right-64 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          
          <div className="max-w-7xl mx-auto relative w-full">
            <div className={`text-center max-w-3xl mx-auto transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 border border-primary/20 backdrop-blur-sm hover:scale-105 transition-transform">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">AI-Powered Career Development</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-primary/60">
                Shape Your Future with AI
              </h1>
              
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Harness the power of artificial intelligence to create your personalized career roadmap, optimize your resume, and stay ahead of industry trends.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <div className="transform hover:scale-105 active:scale-95 transition-transform">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-600 group">
                    <Link to="/roadmap" className="flex items-center gap-2">
                      Get Started
                      <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
                <div className="transform hover:scale-105 active:scale-95 transition-transform">
                  <Button variant="outline" size="lg" className="border-primary/20 bg-primary/10 text-white hover:bg-primary/20 backdrop-blur-sm">
                    <Link to="/keywords" className="flex items-center gap-2">
                      Try Demo
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 opacity-0 translate-y-4 animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary/80 to-white">
                Powerful Features for Smarter Career Planning
              </h2>
              <p className="text-gray-400">Experience the next generation of career development tools</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-20">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className="opacity-0 translate-y-4 animate-fade-in-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <Card className="bg-gradient-to-br from-gray-900 to-black border-primary/10 hover:border-primary/20 transition-all group backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/20">
                    <CardContent className="p-6">
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center hover:rotate-180 transition-transform duration-500">
                            {feature.icon}
                          </div>
                          <span className="text-primary/80 text-sm font-medium">{feature.stats}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-primary transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-gray-400 mb-6">
                          {feature.description}
                        </p>
                        <div className="aspect-video rounded-xl overflow-hidden bg-gray-800 relative">
                          {imageError[feature.id] ? (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                              <ImageIcon className="h-12 w-12 mb-2" />
                              <span className="text-sm">Image not available</span>
                            </div>
                          ) : (
                            <img 
                              src={feature.image}
                              alt={feature.title}
                              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                              onError={() => handleImageError(feature.id)}
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Statistics Section */}
            <div className="grid md:grid-cols-3 gap-8">
              {statistics.map((stat, index) => (
                <div
                  key={index}
                  className="opacity-0 translate-y-4 animate-fade-in-up bg-gray-900/50 rounded-2xl p-6 border border-primary/10 hover:border-primary/20 transition-all backdrop-blur-sm hover:shadow-lg hover:shadow-primary/20 hover:scale-105"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary hover:rotate-180 transition-transform duration-500">
                      {stat.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{stat.title}</h4>
                      <p className="text-sm text-gray-400">{stat.description}</p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* News Section */}
        <section className="py-20 px-6 bg-black/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 opacity-0 translate-y-4 animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary/80 to-white">
                Latest Industry Updates
              </h2>
              <p className="text-gray-400">Stay informed with AI-curated news and insights</p>
            </div>
            <News />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home; 