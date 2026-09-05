import './globals.css';
import { CartProvider } from '../components/CartProvider';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';

export const metadata = {
  title: { default: '6ix to Go — Retro Streetwear India', template: '%s — 6ix to Go' },
  description: '6ix products at a time. Y2K-inspired streetwear, limited drops and clothing with character. Inspired by LA. Built in India.',
  icons: { icon: '/brand/logo-colour.svg' }
};
export default function RootLayout({children}){return <html lang="en"><body><CartProvider><Header/><main>{children}</main><Footer/><CartDrawer/></CartProvider></body></html>}
