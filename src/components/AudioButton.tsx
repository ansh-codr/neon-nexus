import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface AudioButtonProps {
  src?: string;
  volume?: number;
}

const AudioButton = ({ src = "/audio/loop.mp3", volume = 0.4 }: AudioButtonProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio(src);
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    audioRef.current.muted = true;

    // Try to play (will be muted initially)
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {
      setIsPlaying(false);
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [src, volume]);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.muted = false;
        if (!isPlaying) {
          audioRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch(console.error);
        }
      } else {
        audioRef.current.muted = true;
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.3 }}
      onClick={toggleMute}
      className="relative p-2.5 rounded-full transition-all duration-300 group"
      style={{
        backgroundColor: 'rgba(10, 10, 20, 0.8)',
        border: isMuted ? '2px solid rgba(255, 0, 255, 0.5)' : '2px solid rgba(0, 255, 157, 0.8)',
        boxShadow: isMuted 
          ? '0 0 10px rgba(255, 0, 255, 0.3)' 
          : '0 0 15px rgba(0, 255, 157, 0.5), 0 0 30px rgba(0, 255, 157, 0.2)',
      }}
      title={isMuted ? 'Click to Unmute 🔊' : 'Click to Mute 🔇'}
    >
      {isMuted ? (
        // Muted Icon
        <svg 
          className="w-5 h-5 transition-colors" 
          style={{ color: '#ff00ff' }}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" 
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" 
          />
        </svg>
      ) : (
        // Unmuted Icon with sound waves
        <svg 
          className="w-5 h-5 transition-colors" 
          style={{ color: '#00ff9d' }}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" 
          />
        </svg>
      )}
      
      {/* Pulsing ring animation when playing */}
      {!isMuted && (
        <span 
          className="absolute inset-0 rounded-full border-2 animate-ping opacity-30"
          style={{ borderColor: 'rgba(0, 255, 157, 0.6)' }}
        />
      )}
    </motion.button>
  );
};

export default AudioButton;
