'use client';
import { useState } from 'react';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Proof from '@/components/Proof';
import Portfolio from '@/components/Portfolio';
import Services from '@/components/Services';
import Process from '@/components/Process';
import Testimonials from '@/components/Testimonials';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import Lightbox from '@/components/Lightbox';
import Drawer from '@/components/Drawer';
import CustomCursor from '@/components/CustomCursor';
import AudioPlayer from '@/components/AudioPlayer';
import Timecode from '@/components/Timecode';
import FilmLeader from '@/components/FilmLeader';
import SceneHeading from '@/components/SceneHeading';
import DialogueSubtitle from '@/components/DialogueSubtitle';

export default function ClientShell({ videos }) {
  const [contactOpen, setContactOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [toast, setToast] = useState(null);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 40;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const openLightbox = (p, ev) => {
    if (ev && typeof ev.clientX === 'number') {
      setOrigin({ x: ev.clientX, y: ev.clientY });
    } else {
      setOrigin({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }
    setLightbox(p);
  };
  const closeLightbox = () => setLightbox(null);
  const navLightbox = (dir) => {
    const idx = videos.findIndex(v => (v.id || v.youtubeId) === (lightbox.id || lightbox.youtubeId));
    setLightbox(videos[(idx + dir + videos.length) % videos.length]);
  };
  const jumpLightbox = (project) => setLightbox(project);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  return (
    <>
      <FilmLeader />
      <CustomCursor />
      <AudioPlayer paused={!!lightbox} />
      <DialogueSubtitle paused={!!lightbox || contactOpen} />
      <Timecode />
      <SceneHeading />
      <div className="grain" />
      <div className="vignette" />

      <Nav onContact={() => setContactOpen(true)} onScrollTo={scrollTo} />
      <Hero onContact={() => setContactOpen(true)} onScrollTo={scrollTo} />
      <Proof />
      <Portfolio videos={videos} onOpen={openLightbox} />
      <Services />
      <Process />
      <Testimonials />
      <CTA onContact={() => setContactOpen(true)} onToast={showToast} />
      <Footer onContact={() => setContactOpen(true)} />

      <Lightbox project={lightbox} videos={videos} origin={origin} onClose={closeLightbox} onNav={navLightbox} onJump={jumpLightbox} />
      <Drawer open={contactOpen} onClose={() => setContactOpen(false)} />

      <div className={'toast' + (toast ? ' show' : '')}>
        <span className="check">✓</span>
        <span>{toast}</span>
      </div>
    </>
  );
}
