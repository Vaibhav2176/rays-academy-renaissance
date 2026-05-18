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
import ThankYou from "./pages/ThankYou";

import Class6to8 from "./pages/courses/Class6to8";
import Class9 from "./pages/courses/Class9";
import Class10 from "./pages/courses/Class10";
import Class11 from "./pages/courses/Class11";
import Class12 from "./pages/courses/Class12";
import IITJEE from "./pages/courses/IITJEE";
import NEET from "./pages/courses/NEET";
import NDA from "./pages/courses/NDA";
import CUET from "./pages/courses/CUET";
import RSAT from "./pages/RSAT";

import StudyMaterial from "./pages/StudyMaterial";
import SMClass6to8 from "./pages/study-material/SMClass6to8";
import SMClass9 from "./pages/study-material/SMClass9";
import SMClass10 from "./pages/study-material/SMClass10";
import SMClass11 from "./pages/study-material/SMClass11";
import SMClass12 from "./pages/study-material/SMClass12";
import SMJEE from "./pages/study-material/SMJEE";
import SMNEET from "./pages/study-material/SMNEET";
import SMNDA from "./pages/study-material/SMNDA";
import SMCUET from "./pages/study-material/SMCUET";
import PreviousYearQuestions from "./pages/study-material/PreviousYearQuestions";
import SamplePapers from "./pages/study-material/SamplePapers";
import FormulaSheets from "./pages/study-material/FormulaSheets";
import ImportantQuestions from "./pages/study-material/ImportantQuestions";
import RevisionNotes from "./pages/study-material/RevisionNotes";
import { NCERTClass6, NCERTClass7, NCERTClass8, NCERTClass9, NCERTClass10, NCERTClass11, NCERTClass12 } from "./pages/study-material/NCERTPages";
import {
  PYQClass9, PYQClass10, PYQClass11, PYQClass12, PYQNeet, PYQJee, PYQNda,
  SPClass9, SPClass10, SPClass11, SPClass12, SPNeet, SPJee, SPNda,
} from "./pages/study-material/ClassWiseResources";

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
              <Route path="/class-6-8" element={<Class6to8 />} />
              <Route path="/courses/class-9" element={<Class9 />} />
              <Route path="/class-9" element={<Class9 />} />
              <Route path="/courses/class-10" element={<Class10 />} />
              <Route path="/class-10" element={<Class10 />} />
              <Route path="/courses/class-11" element={<Class11 />} />
              <Route path="/class-11" element={<Class11 />} />
              <Route path="/courses/class-12" element={<Class12 />} />
              <Route path="/class-12" element={<Class12 />} />
              <Route path="/courses/iit-jee" element={<IITJEE />} />
              <Route path="/iit-jee-coaching-bhopal" element={<IITJEE />} />
              <Route path="/courses/neet" element={<NEET />} />
              <Route path="/neet-coaching-bhopal" element={<NEET />} />
              <Route path="/courses/nda" element={<NDA />} />
              <Route path="/nda-coaching-bhopal" element={<NDA />} />
              <Route path="/courses/cuet" element={<CUET />} />
              <Route path="/cuet-coaching-bhopal" element={<CUET />} />
              <Route path="/rsat" element={<RSAT />} />

              {/* Study Material */}
              <Route path="/study-material" element={<StudyMaterial />} />
              <Route path="/study-material/class-6-8" element={<SMClass6to8 />} />
              <Route path="/study-material/class-9" element={<SMClass9 />} />
              <Route path="/study-material/class-10" element={<SMClass10 />} />
              <Route path="/class-10-study-material" element={<SMClass10 />} />
              <Route path="/study-material/class-11" element={<SMClass11 />} />
              <Route path="/study-material/class-12" element={<SMClass12 />} />
              <Route path="/study-material/iit-jee" element={<SMJEE />} />
              <Route path="/jee-study-material" element={<SMJEE />} />
              <Route path="/study-material/neet" element={<SMNEET />} />
              <Route path="/neet-study-material" element={<SMNEET />} />
              <Route path="/study-material/nda" element={<SMNDA />} />
              <Route path="/study-material/cuet" element={<SMCUET />} />
              <Route path="/study-material/previous-year-questions" element={<PreviousYearQuestions />} />
              <Route path="/study-material/sample-papers" element={<SamplePapers />} />
              <Route path="/sample-papers" element={<SamplePapers />} />
              <Route path="/study-material/formula-sheets" element={<FormulaSheets />} />
              <Route path="/formula-sheets" element={<FormulaSheets />} />
              <Route path="/study-material/important-questions" element={<ImportantQuestions />} />
              <Route path="/study-material/revision-notes" element={<RevisionNotes />} />
              <Route path="/study-material/ncert/class-6" element={<NCERTClass6 />} />
              <Route path="/study-material/ncert/class-7" element={<NCERTClass7 />} />
              <Route path="/study-material/ncert/class-8" element={<NCERTClass8 />} />
              <Route path="/study-material/ncert/class-9" element={<NCERTClass9 />} />
              <Route path="/study-material/ncert/class-10" element={<NCERTClass10 />} />
              <Route path="/study-material/ncert/class-11" element={<NCERTClass11 />} />
              <Route path="/study-material/ncert/class-12" element={<NCERTClass12 />} />

              {/* Class-wise PYQ pages */}
              <Route path="/study-material/pyq/class-9" element={<PYQClass9 />} />
              <Route path="/study-material/pyq/class-10" element={<PYQClass10 />} />
              <Route path="/study-material/pyq/class-11" element={<PYQClass11 />} />
              <Route path="/study-material/pyq/class-12" element={<PYQClass12 />} />
              <Route path="/study-material/pyq/neet" element={<PYQNeet />} />
              <Route path="/study-material/pyq/jee" element={<PYQJee />} />
              <Route path="/study-material/pyq/nda" element={<PYQNda />} />

              {/* Class-wise Sample Paper pages */}
              <Route path="/study-material/sample-papers/class-9" element={<SPClass9 />} />
              <Route path="/study-material/sample-papers/class-10" element={<SPClass10 />} />
              <Route path="/study-material/sample-papers/class-11" element={<SPClass11 />} />
              <Route path="/study-material/sample-papers/class-12" element={<SPClass12 />} />
              <Route path="/study-material/sample-papers/neet" element={<SPNeet />} />
              <Route path="/study-material/sample-papers/jee" element={<SPJee />} />
              <Route path="/study-material/sample-papers/nda" element={<SPNda />} />

              <Route path="/faculty" element={<Faculty />} />
              <Route path="/results" element={<Results />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/portal" element={<Portal />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
