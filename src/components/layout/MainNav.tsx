import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Brain, FileText, History, Newspaper, Clock, MessageSquare } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function MainNav() {
  const location = useLocation();
  const { user } = useAuth();

  const navigation = [
    { name: 'Home', href: '/', icon: Brain },
    { name: 'Roadmap Generator', href: '/roadmap', icon: FileText },
    { name: 'Resume Keywords', href: '/keywords', icon: History },
    { name: 'News', href: '/news', icon: Newspaper },
  ];

  // Add history and chat to navigation if user is logged in
  const authenticatedNavigation = user ? [
    ...navigation,
    { name: 'History', href: '/history', icon: Clock },
    { name: 'AI Chat', href: '/chat', icon: MessageSquare },
  ] : navigation;

  return (
    <div className="flex gap-6 md:gap-10">
      <Link to="/" className="flex items-center gap-2">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-lg blur opacity-60 group-hover:opacity-80 transition-all"></div>
          <div className="relative bg-black rounded-lg p-1">
            <Brain className="h-6 w-6 text-primary" />
          </div>
        </div>
        <span className="hidden md:inline-block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-primary/60">
          FutureFocus
        </span>
      </Link>
      <nav className="hidden md:flex gap-6">
        {authenticatedNavigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                location.pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 