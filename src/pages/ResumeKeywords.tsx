import { useState, useRef } from "react";
import { FileText, Search, Copy, ClipboardList, Loader2, Download, Bot, Sparkles, Target, Brain, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { extractKeywords as extractKeywordsAI } from "@/utils/geminiClient";
import * as html2pdf from 'html2pdf.js';
import { useAuth } from '@/lib/auth';
import { addToHistory } from "@/services/historyService";
import "@/styles/roadmap.css";

interface KeywordResult {
  keywords: string[];
  skills: string[];
  technologies: string[];
  analysis: string;
}

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <Card className="bg-black/50 backdrop-blur-xl border-primary/20 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20">
    <CardContent className="pt-6">
      <div className="flex items-start gap-4">
        <div className="bg-gradient-to-br from-primary to-blue-500 p-3 rounded-xl">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ResumeKeywords = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [keywords, setKeywords] = useState<KeywordResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportingRoadmap, setExportingRoadmap] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Success",
        description: "Keywords copied to clipboard",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy keywords",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await extractKeywordsAI(jobDescription);
      setKeywords(result);
      
      if (user) {
        await addToHistory({
          type: 'keywords',
          data: result,
          timestamp: new Date()
        });
      }

      toast({
        title: "Success",
        description: "Keywords extracted successfully",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to extract keywords. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    if (!contentRef.current) return;
    setExporting(true);

    try {
      const element = contentRef.current;
      const opt = {
        margin: 1,
        filename: 'resume-keywords.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
      toast({
        title: "Success",
        description: "PDF exported successfully",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export PDF",
        variant: "destructive"
      });
    } finally {
      setExporting(false);
    }
  };

  const exportRoadmapToPDF = async () => {
    if (!contentRef.current) return;
    setExportingRoadmap(true);

    try {
      const element = contentRef.current;
      const opt = {
        margin: 1,
        filename: 'career-roadmap.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
      toast({
        title: "Success",
        description: "Roadmap exported successfully",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export roadmap",
        variant: "destructive"
      });
    } finally {
      setExportingRoadmap(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
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
                  <Brain className="h-12 w-12 text-primary" />
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-blue-400 mb-6 animate-fade-in">
              AI-Powered Resume Keywords Analyzer
            </h1>

            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8 animate-fade-in">
              Optimize your resume with AI-extracted keywords from job descriptions. Get instant insights into required skills, technologies, and qualifications.
            </p>

            <div className="p-4 bg-black/50 backdrop-blur-xl border border-primary/20 rounded-xl inline-block animate-fade-in">
              <div className="flex items-center gap-3">
                <Bot className="h-5 w-5 text-primary animate-pulse" />
                <p className="text-sm text-blue-300">
                  <span className="font-medium">AI Powered:</span> Using Google's Gemini for intelligent keyword extraction
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 px-6 relative">
          <div className="max-w-7xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Key Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={Sparkles}
                title="Smart Keyword Extraction"
                description="AI analyzes job descriptions to identify crucial keywords, skills, and qualifications that employers are looking for."
              />
              <FeatureCard
                icon={Target}
                title="Skills Analysis"
                description="Get detailed insights into required technical skills, soft skills, and experience levels mentioned in the job posting."
              />
              <FeatureCard
                icon={Brain}
                title="AI-Powered Insights"
                description="Receive intelligent suggestions for resume optimization based on the analyzed job requirements."
              />
              <FeatureCard
                icon={ClipboardList}
                title="Custom Reports"
                description="Generate comprehensive reports with categorized keywords and detailed analysis of job requirements."
              />
              <FeatureCard
                icon={Download}
                title="Export Options"
                description="Export your results as PDF, including a detailed roadmap for skill development and resume enhancement."
              />
              <FeatureCard
                icon={CheckCircle2}
                title="ATS Optimization"
                description="Ensure your resume passes Applicant Tracking Systems by including the right keywords and phrases."
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-5xl mx-auto">
            <Card className="mb-8 bg-black/50 backdrop-blur-xl border border-primary/20">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="job-description" className="block text-lg font-medium text-white mb-3">
                      Paste Job Description
                    </label>
                    <div className="space-y-4">
                      <Textarea
                        id="job-description"
                        placeholder="Paste the job description here to extract relevant keywords..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="min-h-[200px] bg-black/50 border-primary/20 text-white placeholder:text-gray-400 resize-none"
                        required
                      />
                      <Button 
                        type="submit" 
                        disabled={loading || !jobDescription}
                        className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-600"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing Job Description
                          </>
                        ) : (
                          <>
                            Extract Keywords
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {keywords && (
              <div ref={contentRef} className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-primary">
                    Analysis Results
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(keywords.keywords.join(', '))}
                      className="border-primary/20 text-primary hover:bg-primary/10"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Keywords
                    </Button>
                    <Button
                      variant="outline"
                      onClick={exportToPDF}
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
                          Export PDF
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <Card className="bg-black/50 backdrop-blur-xl border-primary/20">
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Key Skills Required</h3>
                        <div className="flex flex-wrap gap-2">
                          {keywords.skills.map((skill, index) => (
                            <Badge
                              key={index}
                              className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Technologies & Tools</h3>
                        <div className="flex flex-wrap gap-2">
                          {keywords.technologies.map((tech, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Important Keywords</h3>
                        <div className="flex flex-wrap gap-2">
                          {keywords.keywords.map((keyword, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="border-primary/20 text-gray-300 hover:bg-primary/10 transition-colors"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Analysis & Recommendations</h3>
                        <p className="text-gray-300 whitespace-pre-wrap">{keywords.analysis}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/50 backdrop-blur-xl border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white">Career Development Roadmap</h3>
                      <Button
                        variant="outline"
                        onClick={exportRoadmapToPDF}
                        disabled={exportingRoadmap}
                        className="border-primary/20 text-primary hover:bg-primary/10"
                      >
                        {exportingRoadmap ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Exporting...
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            Export Roadmap
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-gray-400 mb-6">
                      Based on the analyzed requirements, here's a suggested roadmap for skill development and career growth.
                    </p>
                    <div className="space-y-4">
                      {keywords.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gradient-to-r from-primary/5 to-transparent border border-primary/10 rounded-lg"
                        >
                          <h4 className="text-white font-medium mb-2">{skill}</h4>
                          <ul className="text-sm text-gray-400 space-y-1">
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                              Focus on practical applications and real-world projects
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                              Consider relevant certifications or courses
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                              Build portfolio projects demonstrating this skill
                            </li>
                          </ul>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ResumeKeywords;
