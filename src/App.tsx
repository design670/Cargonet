import { WhatsAppFab } from './components/WhatsAppFab';
import { useReveal } from './hooks/useReveal';
import { Closing } from './sections/Closing';
import { Faq } from './sections/Faq';
import { Footer } from './sections/Footer';
import { Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { HowItWorks } from './sections/HowItWorks';
import { QuickActions } from './sections/QuickActions';
import { Quote } from './sections/Quote';
import { Services } from './sections/Services';
import { WhyUs } from './sections/WhyUs';

export default function App() {
  useReveal();
  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" tabIndex={-1}>
        <Hero />
        <QuickActions />
        <Services />
        <HowItWorks />
        <WhyUs />
        <Quote />
        <Faq />
        <Closing />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
