import { useEffect } from 'react';
import ScrollExpandMedia from './ScrollExpandMedia';
import doctorBg from '@/assets/doctor-bg.jpg';
import GlitchText from './GlitchText';

const ScrollExpandHero = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc="https://videos.pexels.com/video-files/5377684/5377684-uhd_2560_1440_25fps.mp4"
      bgImageSrc={doctorBg}
      title="Campus Health"
      date="PS-98 // Health Tracker"
      scrollToExpand="↓ Scroll to Expand ↓"
      textBlend
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <GlitchText as="h3" className="text-3xl md:text-4xl text-primary mb-4">
            Your Health, Tracked
          </GlitchText>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 border border-primary/30 cyber-chamfer bg-card/50 backdrop-blur-sm">
            <h4 className="font-display text-xl text-primary uppercase tracking-wide mb-3">
              Overview
            </h4>
            <p className="font-mono text-muted-foreground leading-relaxed">
              <span className="text-primary">&gt;</span> Track your daily health metrics including sleep, steps, and exercise. 
              Our AI-powered system provides personalized insights to help you maintain 
              peak performance during your academic journey.
            </p>
          </div>
          
          <div className="p-6 border border-secondary/30 cyber-chamfer bg-card/50 backdrop-blur-sm">
            <h4 className="font-display text-xl text-secondary uppercase tracking-wide mb-3">
              Mission
            </h4>
            <p className="font-mono text-muted-foreground leading-relaxed">
              <span className="text-secondary">&gt;</span> Students struggle to balance academics with wellness. 
              We provide the tools and data to make informed health decisions, 
              ensuring you never have to choose between grades and well-being.
            </p>
          </div>
        </div>
      </div>
    </ScrollExpandMedia>
  );
};

export default ScrollExpandHero;
