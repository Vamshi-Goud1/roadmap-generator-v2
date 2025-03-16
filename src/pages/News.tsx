import { Newspaper, Sparkles, Globe, TrendingUp } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import News from "@/components/News";
import { Card, CardContent } from "@/components/ui/card";

const NewsPage = () => {
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
                  <Newspaper className="h-12 w-12 text-primary" />
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-blue-400 mb-6 animate-fade-in">
              Stay Informed with Latest Updates
            </h1>

            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8 animate-fade-in">
              Get the latest news and insights from technology, business, and science sectors to stay ahead in your career.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <Card className="bg-black/50 backdrop-blur-xl border-primary/20 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-primary to-blue-500 p-3 rounded-xl">
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Global Coverage</h3>
                      <p className="text-gray-400 text-sm">Comprehensive news coverage from trusted sources worldwide</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 backdrop-blur-xl border-primary/20 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-primary to-blue-500 p-3 rounded-xl">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Latest Insights</h3>
                      <p className="text-gray-400 text-sm">Fresh perspectives and analysis on emerging trends</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 backdrop-blur-xl border-primary/20 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-primary to-blue-500 p-3 rounded-xl">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Industry Trends</h3>
                      <p className="text-gray-400 text-sm">Stay ahead with the latest industry developments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* News Content */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <News />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default NewsPage; 