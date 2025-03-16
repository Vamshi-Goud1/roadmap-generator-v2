import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import Home from '@/pages/Home';
import RoadmapGenerator from '@/pages/RoadmapGenerator';
import ResumeKeywords from '@/pages/ResumeKeywords';
import UserHistory from '@/pages/UserHistory';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import NotFound from "@/pages/NotFound";
import NewsPage from "@/pages/News";
import Chat from '@/pages/Chat';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route 
        path="/roadmap" 
        element={
          <ProtectedRoute>
            <RoadmapGenerator />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/keywords" 
        element={
          <ProtectedRoute>
            <ResumeKeywords />
          </ProtectedRoute>
        } 
      />
      <Route path="/news" element={<NewsPage />} />
      <Route 
        path="/history" 
        element={
          <ProtectedRoute>
            <UserHistory />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/chat" 
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        } 
      />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes; 