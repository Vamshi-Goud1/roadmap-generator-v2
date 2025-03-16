import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Brain, 
  Menu,
  Home,
  Route,
  FileSearch,
  Newspaper,
  History,
  MessageSquare 
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const authenticatedNavigation = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "AI Chat",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    name: "Roadmap Generator",
    href: "/roadmap",
    icon: Route,
  },
  {
    name: "Resume Keywords",
    href: "/keywords",
    icon: FileSearch,
  },
  {
    name: "News",
    href: "/news",
    icon: Newspaper,
  },
  {
    name: "History",
    href: "/history",
    icon: History,
  },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      location.pathname !== "/" ? 'bg-[#0A1229]/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
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

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {authenticatedNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-[#94A3B8] hover:text-[#60A5FA] transition-colors flex items-center gap-2",
                    location.pathname === item.href && "text-[#60A5FA]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Avatar className="h-8 w-8 ring-2 ring-[#1D4ED8]/20 bg-[#1D4ED8]/10">
                  <AvatarImage src={user.photoURL || ''} />
                  <AvatarFallback className="bg-[#1D4ED8]/10 text-[#60A5FA]">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="border-[#1D4ED8]/20 text-[#60A5FA] hover:bg-[#1D4ED8]/10 hover:text-[#60A5FA]"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  className="border-[#1D4ED8]/20 bg-[#1D4ED8]/10 text-white hover:bg-[#1D4ED8]/20 hover:text-white"
                >
                  Try Demo
                </Button>
                <Button
                  onClick={handleSignIn}
                  className="bg-[#1D4ED8] text-white hover:bg-[#1D4ED8]/90"
                >
                  Sign In
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="md:hidden"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-[#0A1229] border-[#1a2236]">
                <div className="flex flex-col space-y-4">
                  {authenticatedNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          "text-[#94A3B8] hover:text-[#60A5FA] transition-colors flex items-center gap-2 p-2 rounded-lg",
                          location.pathname === item.href && "text-[#60A5FA] bg-[#1D4ED8]/10"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
