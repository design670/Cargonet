import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/fonts.css';

import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/sections.css';
import './styles/steps-carousel.css';
import './styles/icons.css';
import './styles/whatsapp.css';
import './styles/refresh.css';
import './styles/mode-banner.css';
import './styles/fit.css';
import './styles/track-quote.css';
import './styles/testimonials.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
