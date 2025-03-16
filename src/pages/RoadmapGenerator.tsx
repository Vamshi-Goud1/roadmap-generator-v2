import { useState, useRef, useEffect } from "react";
import { Map, Target, BookOpen, GraduationCap, Download, Loader2, Bot, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast-simple";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { generateRoadmapWithGemini } from "@/utils/geminiClient";
import html2pdf from 'html2pdf.js';
import { useAuth } from "@/lib/auth";
import { addToHistory } from "@/services/historyService";
import "@/styles/roadmap.css";

interface Resource {
  name: string;
  link: string;
}

interface RoadmapStep {
  title: string;
  description: string;
  resources: Resource[];
}

interface RoadmapData {
  title?: string;
  steps: RoadmapStep[];
}

const RoadmapGenerator = () => {
  const [careerGoal, setCareerGoal] = useState("");
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { showToast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Add new ref for intersection observer
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!roadmap) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-line-draw');
          }
        });
      },
      { threshold: 0.2 }
    );

    stepsRef.current.forEach((step) => {
      if (step) observer.observe(step);
    });

    return () => observer.disconnect();
  }, [roadmap]);

  const saveToHistory = async (data: RoadmapData) => {
    if (!user) {
      console.log('User not logged in, skipping history save');
      return;
    }

    try {
      await addToHistory({
        userId: user.uid,
        type: 'roadmap',
        data,
        query: careerGoal
      });
      console.log('Successfully saved to history');
    } catch (error) {
      console.error('Error saving to history:', error);
      showToast("Failed to save to history", "error", "Error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!careerGoal.trim()) {
      showToast("Please enter a career goal", "error", "Error");
      return;
    }

    setLoading(true);
    
    try {
      const roadmapData = await generateRoadmapWithGemini(careerGoal);
      setRoadmap(roadmapData);
      await saveToHistory(roadmapData);
      showToast(`Your career roadmap for ${careerGoal} is ready!`, "success", "Roadmap Generated");
    } catch (error) {
      console.error("Error generating roadmap:", error);
      showToast(
        error instanceof Error ? error.message : "Failed to generate roadmap. Please try again later.",
        "error",
        "Oops!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!contentRef.current || !roadmap) return;
    
    setExporting(true);
    try {
      const opt = {
        margin: [0.5, 0.5],
        filename: `${careerGoal.toLowerCase().replace(/\s+/g, '-')}-roadmap.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          backgroundColor: '#ffffff',
        },
        jsPDF: { 
          unit: 'in', 
          format: 'letter', 
          orientation: 'portrait'
        }
      };

      // Add print-specific styles
      const style = document.createElement('style');
      style.textContent = `
        @media print {
          body { background: white !important; }
          * { color: black !important; }
          .dark\\:text-white { color: black !important; }
          .dark\\:text-gray-300 { color: #374151 !important; }
          .border-l-primary { border-left-color: #3b82f6 !important; }
          .bg-primary\\/10 { background-color: #dbeafe !important; }
          .text-primary { color: #2563eb !important; }
        }
      `;
      document.head.appendChild(style);
      
      await html2pdf().set(opt).from(contentRef.current).save();
      
      // Clean up styles
      document.head.removeChild(style);
      
      showToast("Your career roadmap has been exported as a PDF file.", "success", "Roadmap Exported");
    } catch (error) {
      console.error("Error exporting roadmap:", error);
      showToast("Failed to export roadmap. Please try again.", "error", "Export Failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      
      <main className="flex-grow">
        <section className="relative py-20 px-6 overflow-hidden">
          {/* Animated background gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/30 rounded-full blur-3xl opacity-20 animate-pulse" />

          <div className="max-w-7xl mx-auto text-center relative">
            <div className="flex items-center justify-center mb-6 animate-fade-in">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-full blur opacity-75 group-hover:opacity-100 animate-pulse" />
                <div className="relative bg-black rounded-full p-4">
                  <Bot className="h-12 w-12 text-primary" />
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-blue-400 mb-6 animate-fade-in">
              AI Career Roadmap Generator
            </h1>

            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8 animate-fade-in">
              Enter your desired career goal and let our AI create a personalized roadmap with resources and milestones to help you achieve it.
            </p>

            <div className="p-4 bg-black/50 backdrop-blur-xl border border-primary/20 rounded-xl inline-block animate-fade-in">
              <div className="flex items-center gap-3">
                <Bot className="h-5 w-5 text-primary animate-pulse" />
                <p className="text-sm text-blue-300">
                  <span className="font-medium">AI Powered:</span> Using Google's Gemini for intelligent roadmap generation
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <Card className="mb-8 bg-black/50 backdrop-blur-xl border border-primary/20">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="career-goal" className="block text-lg font-medium text-white mb-3">
                      What is your dream career?
                    </label>
                    <div className="flex gap-4">
                      <div className="relative flex-grow">
                        <Input
                          id="career-goal"
                          placeholder="E.g., Software Engineer, Data Scientist"
                          value={careerGoal}
                          onChange={(e) => setCareerGoal(e.target.value)}
                          className="pl-12 bg-black/50 border-primary/20 text-white placeholder:text-gray-400"
                          required
                        />
                        <Bot className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={loading || !careerGoal}
                        className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-600"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating
                          </>
                        ) : (
                          <>
                            Generate Roadmap
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {roadmap && (
              <div
                className="mt-12"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-primary">
                    Your Career Roadmap
                  </h2>
                  <Button 
                    variant="outline" 
                    onClick={handleExportPDF}
                    disabled={exporting}
                    className="border-primary/20 text-primary hover:bg-primary/10"
                  >
                    {exporting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Export as PDF
                      </>
                    )}
                  </Button>
                </div>

                <div ref={contentRef} className="relative space-y-8">
                  {/* Vertical connecting line */}
                  <div className="absolute left-[2.25rem] top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary via-blue-400 to-primary/30" />

                  {roadmap.steps.map((step: RoadmapStep, index: number) => (
                    <div
                      key={index}
                      ref={el => stepsRef.current[index] = el}
                      className="relative"
                    >
                      <Card className="ml-16 border-l-4 border-l-primary bg-black/50 backdrop-blur-xl border-primary/20 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-6">
                            <div className="absolute -left-16 bg-gradient-to-br from-primary to-blue-500 p-4 rounded-full">
                              {index < 3 ? (
                                <BookOpen className="h-6 w-6 text-white" />
                              ) : (
                                <GraduationCap className="h-6 w-6 text-white" />
                              )}
                            </div>
                            <div className="flex-grow">
                              <h3 className="text-xl font-semibold text-white mb-2">
                                {step.title}
                              </h3>
                              <p className="text-gray-300 mb-4">
                                {step.description}
                              </p>
                              {step.resources.length > 0 && (
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium text-primary">
                                    Recommended Resources:
                                  </h4>
                                  <ul className="space-y-1">
                                    {step.resources.map((resource, idx) => (
                                      <li key={idx}>
                                        <a
                                          href={resource.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                          {resource.name}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default RoadmapGenerator;
