
import { ArrowRight, CheckCircle, Map, FileText, Newspaper, Laptop } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Index = () => {
  const features = [
    {
      icon: <Map className="h-8 w-8 text-primary" />,
      title: "AI Career Roadmap Generator",
      description: "Get a personalized step-by-step career path with learning resources, skills, and milestones.",
      link: "/roadmap",
      linkText: "Generate Your Roadmap"
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Resume Keywords Extractor",
      description: "Optimize your resume for ATS systems by extracting key skills and keywords from job descriptions.",
      link: "/resume",
      linkText: "Analyze Job Descriptions"
    },
    {
      icon: <Newspaper className="h-8 w-8 text-primary" />,
      title: "Tech & Education News",
      description: "Stay updated with the latest news in technology, education, and career trends.",
      link: "/news",
      linkText: "Browse Latest News"
    }
  ];

  const benefits = [
    "Personalized career guidance",
    "ATS-optimized resumes",
    "Up-to-date industry news",
    "Save and share your roadmaps",
    "One-stop career platform"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="hero-gradient py-20 px-6 md:py-28">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white animate-fade-in">
                  Shape Your Future <span className="text-primary">Career</span> With AI
                </h1>
                <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 animate-slide-up">
                  Your all-in-one platform for career planning, resume optimization, and industry news designed specifically for college students.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link to="/roadmap">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 md:pl-10">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80" 
                  alt="Students collaborating" 
                  className="rounded-lg shadow-2xl animate-fade-in" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-gray-50 dark:bg-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Powerful Features for Your Career Journey
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Our AI-powered tools help you plan your career path, optimize your resume, and stay updated with industry trends.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{feature.description}</p>
                  <Link to={feature.link}>
                    <Button variant="outline" className="w-full">
                      {feature.linkText} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  Why Students Love FutureFocus
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                  We're dedicated to helping college students navigate their career journey with confidence.
                </p>
                
                <ul className="mt-8 space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-10">
                  <Link to="/signup">
                    <Button size="lg">
                      Create Free Account
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 md:pl-10">
                <img 
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                  alt="Student using laptop" 
                  className="rounded-lg shadow-2xl" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-primary text-white">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Jumpstart Your Career?
            </h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto text-blue-100">
              Join thousands of students already using FutureFocus to plan their career path, optimize their resumes, and stay updated with industry trends.
            </p>
            <div className="mt-10">
              <Link to="/signup">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                  Get Started For Free
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
