'use client';

import {
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { motion, useInView } from 'framer-motion';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, { amount: 0.5 });

  useEffect(() => {
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
  }, [mediaType]);

  // Only attach wheel/touch interceptors while this section is in view.
  // (We still allow normal page scrolling when scrollProgress is 0 or 1
  // and the user scrolls in the non-interactive direction.)
  useEffect(() => {
    setIsActive(isInView);
  }, [isInView]);

  useEffect(() => {
    if (!isActive) return;

    const handleWheel = (e: WheelEvent) => {
      // Check if section is in viewport
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inViewport) return;

      const speed = 0.0009;

      // Expand (scroll down) while progress < 1
      if (e.deltaY > 0 && scrollProgress < 1) {
        e.preventDefault();
        const newProgress = Math.min(scrollProgress + e.deltaY * speed, 1);
        setScrollProgress(newProgress);
        setMediaFullyExpanded(newProgress >= 1);
        setShowContent(newProgress >= 0.75);
        return;
      }

      // Contract (scroll up) while progress > 0
      if (e.deltaY < 0 && scrollProgress > 0) {
        e.preventDefault();
        const newProgress = Math.max(scrollProgress + e.deltaY * speed, 0);
        setScrollProgress(newProgress);
        setMediaFullyExpanded(newProgress >= 1);
        setShowContent(newProgress >= 0.75);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;

      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inViewport) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      // Expand/contract within this section, but allow normal scrolling
      // once we're fully expanded and the user continues scrolling down.
      const expandFactor = 0.005;
      const contractFactor = 0.008;

      // Expand
      if (deltaY > 0 && scrollProgress < 1) {
        e.preventDefault();
        const newProgress = Math.min(scrollProgress + deltaY * expandFactor, 1);
        setScrollProgress(newProgress);
        setMediaFullyExpanded(newProgress >= 1);
        setShowContent(newProgress >= 0.75);
        setTouchStartY(touchY);
        return;
      }

      // Contract
      if (deltaY < 0 && scrollProgress > 0) {
        e.preventDefault();
        const newProgress = Math.max(scrollProgress + deltaY * contractFactor, 0);
        setScrollProgress(newProgress);
        setMediaFullyExpanded(newProgress >= 1);
        setShowContent(newProgress >= 0.75);
        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = (): void => {
      setTouchStartY(0);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY, isActive]);

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  return (
    <div
      ref={sectionRef}
      className="transition-colors duration-700 ease-in-out overflow-x-hidden"
    >
      <section className="relative flex flex-col items-center justify-start min-h-[100dvh]">
        <div className="relative w-full flex flex-col items-center min-h-[100dvh]">
          {/* Background Image */}
          <motion.div
            className="absolute inset-0 z-0 h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            <img
              src={bgImageSrc}
              alt="Background"
              className="w-screen h-screen object-cover object-center"
            />
            <div className="absolute inset-0 bg-background/50" />
          </motion.div>

          <div className="container mx-auto flex flex-col items-center justify-start relative z-10">
            <div className="flex flex-col items-center justify-center w-full h-[100dvh] relative">
              {/* Expanding Media Container */}
              <div
                className="absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-none border border-primary/30"
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: '95vw',
                  maxHeight: '85vh',
                  boxShadow: '0 0 30px hsl(var(--primary) / 0.3)',
                  clipPath: `polygon(
                    0 16px, 16px 0,
                    calc(100% - 16px) 0, 100% 16px,
                    100% calc(100% - 16px), calc(100% - 16px) 100%,
                    16px 100%, 0 calc(100% - 16px)
                  )`,
                }}
              >
                {mediaType === 'video' ? (
                  mediaSrc.includes('youtube.com') ? (
                    <div className="relative w-full h-full pointer-events-none">
                      <iframe
                        width="100%"
                        height="100%"
                        src={
                          mediaSrc.includes('embed')
                            ? mediaSrc +
                              (mediaSrc.includes('?') ? '&' : '?') +
                              'autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1'
                            : mediaSrc.replace('watch?v=', 'embed/') +
                              '?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=' +
                              mediaSrc.split('v=')[1]
                        }
                        className="w-full h-full"
                        style={{
                          clipPath: `polygon(
                            0 16px, 16px 0,
                            calc(100% - 16px) 0, 100% 16px,
                            100% calc(100% - 16px), calc(100% - 16px) 100%,
                            16px 100%, 0 calc(100% - 16px)
                          )`,
                        }}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <div className="absolute inset-0 z-10 pointer-events-none" />
                      <motion.div
                        className="absolute inset-0 bg-background/30"
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  ) : (
                    <div className="relative w-full h-full pointer-events-none">
                      <video
                        src={mediaSrc}
                        poster={posterSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="w-full h-full object-cover"
                        style={{
                          clipPath: `polygon(
                            0 16px, 16px 0,
                            calc(100% - 16px) 0, 100% 16px,
                            100% calc(100% - 16px), calc(100% - 16px) 100%,
                            16px 100%, 0 calc(100% - 16px)
                          )`,
                        }}
                        controls={false}
                        disablePictureInPicture
                      />
                      <div className="absolute inset-0 z-10 pointer-events-none" />
                      <motion.div
                        className="absolute inset-0 bg-background/30"
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  )
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={mediaSrc}
                      alt={title || 'Media content'}
                      className="w-full h-full object-cover"
                      style={{
                        clipPath: `polygon(
                          0 16px, 16px 0,
                          calc(100% - 16px) 0, 100% 16px,
                          100% calc(100% - 16px), calc(100% - 16px) 100%,
                          16px 100%, 0 calc(100% - 16px)
                        )`,
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-background/50"
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.7 - scrollProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}

                {/* Text below media */}
                <div className="flex flex-col items-center text-center relative z-10 mt-4 transition-none">
                  {date && (
                    <p
                      className="text-xl font-terminal text-primary text-glow uppercase tracking-widest"
                      style={{ transform: `translateX(-${textTranslateX}vw)` }}
                    >
                      {date}
                    </p>
                  )}
                  {scrollToExpand && (
                    <p
                      className="text-muted-foreground font-mono text-sm"
                      style={{ transform: `translateX(${textTranslateX}vw)` }}
                    >
                      {scrollToExpand}
                    </p>
                  )}
                </div>
              </div>

              {/* Title Text */}
              <div
                className={`flex items-center justify-center text-center gap-4 w-full relative z-10 transition-none flex-col ${
                  textBlend ? 'mix-blend-difference' : 'mix-blend-normal'
                }`}
              >
                <motion.h2
                  className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary text-glow uppercase tracking-widest transition-none"
                  style={{ transform: `translateX(-${textTranslateX}vw)` }}
                >
                  {firstWord}
                </motion.h2>
                <motion.h2
                  className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-center text-foreground transition-none uppercase tracking-widest"
                  style={{ transform: `translateX(${textTranslateX}vw)` }}
                >
                  {restOfTitle}
                </motion.h2>
              </div>
            </div>

            {/* Content Section (appears after expansion) */}
            <motion.section
              className="flex flex-col w-full px-8 py-10 md:px-16 lg:py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
