import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Github, Twitter, Linkedin, Mail, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast-simple';
import { subscribeToNewsletter } from '@/api/newsletter';
import { submitFeedback } from '@/api/feedback';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const currentYear = new Date().getFullYear();

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubscribe = async () => {
    if (!validateEmail(email)) {
      showToast("Please enter a valid email address.", "error", "Invalid Email");
      return;
    }

    setIsLoading(true);
    try {
      const response = await subscribeToNewsletter(email);
      
      if (response.success) {
        showToast(response.message, "success", "Successfully Subscribed!");
        setEmail('');
      } else {
        showToast(response.message, "error", "Subscription Failed");
      }
    } catch (error) {
      showToast("There was an error subscribing to the newsletter. Please try again.", "error", "Subscription Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      showToast("Your thoughts matter to us. Please share your feedback before submitting.", "error", "Please Add Feedback");
      return;
    }

    setIsLoading(true);
    try {
      const response = await submitFeedback(feedback);
      
      if (response.success) {
        showToast("Thank you for helping us improve. Your feedback has been successfully submitted.", "success", "✨ Feedback Received!");
        setFeedback('');
      } else {
        showToast("We couldn't submit your feedback at this time. Please try again later.", "error", "Something Went Wrong");
      }
    } catch (error) {
      showToast("There was a problem connecting to our servers. Please check your connection and try again.", "error", "Connection Error");
    } finally {
      setIsLoading(false);
    }
  };

  const footerLinks = [
    {
      title: 'Product',
      links: [
        { name: 'Roadmap Generator', href: '/roadmap' },
        { name: 'Resume Keywords', href: '/keywords' },
        { name: 'Industry News', href: '/news' },
        { name: 'Career History', href: '/history' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '#' },
        { name: 'API Reference', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Community', href: '#' },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
      ]
    }
  ];

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'Email', icon: Mail, href: 'mailto:contact@futurefocus.ai' },
  ];

  return (
    <footer className="relative mt-20 border-t border-white/10 bg-black">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-primary/5 to-black pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Feedback Section */}
        <div className="py-12">
          <div className="relative rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl p-8 md:p-12 shadow-2xl overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/30 rounded-full blur-3xl opacity-20" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl opacity-20" />

            <div className="relative flex flex-col md:flex-row items-start justify-between gap-8">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-primary/80 to-white mb-4">
                  Share Your Thoughts
                </h2>
                <p className="text-gray-400 max-w-md">
                  Help us improve your experience. We value your feedback and continuously strive to enhance our services based on your input.
                </p>
              </div>
              <div className="flex flex-col gap-4 w-full md:w-[400px]">
                <Textarea
                  placeholder="Tell us what you think..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="bg-black/50 border-primary/20 text-white placeholder:text-gray-400 min-h-[120px] resize-none"
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSubmitFeedback}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-600"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Feedback
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-lg blur opacity-60 group-hover:opacity-80 transition-all"></div>
                <div className="relative bg-black rounded-lg p-1">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-primary/60">
                FutureFocus
              </span>
            </Link>
            <p className="text-sm text-gray-400">
              Empowering careers through AI-driven insights and personalized guidance.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a 
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-primary transition-colors"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{social.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-white mb-4">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-400 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} FutureFocus. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="#" className="text-sm text-gray-400 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="text-sm text-gray-400 hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="#" className="text-sm text-gray-400 hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
