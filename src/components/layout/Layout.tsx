import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppFloat from '../WhatsAppFloat';
import RSATPopup from '../RSATPopup';
import RSATFloatingButton from '../RSATFloatingButton';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat />
      <RSATFloatingButton />
      <RSATPopup />
    </div>
  );
};

export default Layout;
