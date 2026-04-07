import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ScrollToTop from "@/components/ScrollToTop";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Faculty from "./pages/Faculty";
import Results from "./pages/Results";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Portal from "./pages/Portal";
import NotFound from "./pages/NotFound";

import Class6to8 from "./pages/courses/Class6to8";
import Class9 from "./pages/courses/Class9";
import Class10 from "./pages/courses/Class10";
import Class11 from "./pages/courses/Class11";
import Class12 from "./pages/courses/Class12";
import IITJEE from "./pages/courses/IITJEE";
import NEET from "./pages/courses/NEET";
import NDA from "./pages/courses/NDA";
import CUET from "./pages/courses/CUET";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/class-6-8" element={<Class6to8 />} />
              <Route path="/courses/class-9" element={<Class9 />} />
              <Route path="/courses/class-10" element={<Class10 />} />
              <Route path="/courses/class-11" element={<Class11 />} />
              <Route path="/courses/class-12" element={<Class12 />} />
              <Route path="/courses/iit-jee" element={<IITJEE />} />
              <Route path="/courses/neet" element={<NEET />} />
              <Route path="/courses/nda" element={<NDA />} />
              <Route path="/courses/cuet" element={<CUET />} />
              <Route path="/faculty" element={<Faculty />} />
              <Route path="/results" element={<Results />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/portal" element={<Portal />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
