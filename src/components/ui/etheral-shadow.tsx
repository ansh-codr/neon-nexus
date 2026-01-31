'use client';

import React, { useRef, useId, useEffect, useState, CSSProperties } from 'react';
import { animate, useMotionValue, AnimationPlaybackControls, motion } from 'framer-motion';

// Type definitions
interface ResponsiveImage {
    src: string;
    alt?: string;
    srcSet?: string;
}

interface AnimationConfig {
    preview?: boolean;
    scale: number;
    speed: number;
}

interface NoiseConfig {
    opacity: number;
    scale: number;
}

interface AudioConfig {
    src: string;
    autoPlay?: boolean;
    loop?: boolean;
    volume?: number;
}

interface ShadowOverlayProps {
    type?: 'preset' | 'custom';
    presetIndex?: number;
    customImage?: ResponsiveImage;
    sizing?: 'fill' | 'stretch';
    color?: string;
    animation?: AnimationConfig;
    noise?: NoiseConfig;
    audio?: AudioConfig;
    style?: CSSProperties;
    className?: string;
    children?: React.ReactNode;
}

function mapRange(
    value: number,
    fromLow: number,
    fromHigh: number,
    toLow: number,
    toHigh: number
): number {
    if (fromLow === fromHigh) {
        return toLow;
    }
    const percentage = (value - fromLow) / (fromHigh - fromLow);
    return toLow + percentage * (toHigh - toLow);
}

const useInstanceId = (): string => {
    const id = useId();
    const cleanId = id.replace(/:/g, "");
    const instanceId = `shadowoverlay-${cleanId}`;
    return instanceId;
};

export function Component({
    sizing = 'fill',
    color = 'rgba(128, 128, 128, 1)',
    animation,
    noise,
    audio,
    style,
    className,
    children
}: ShadowOverlayProps) {
    const id = useInstanceId();
    const animationEnabled = animation && animation.scale > 0;
    const feColorMatrixRef = useRef<SVGFEColorMatrixElement>(null);
    const hueRotateMotionValue = useMotionValue(180);
    const hueRotateAnimation = useRef<AnimationPlaybackControls | null>(null);
    
    // Audio state
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);

    const displacementScale = animation ? mapRange(animation.scale, 1, 100, 20, 100) : 0;
    const animationDuration = animation ? mapRange(animation.speed, 1, 100, 1000, 50) : 1;

    // Audio setup
    useEffect(() => {
        if (audio?.src) {
            audioRef.current = new Audio(audio.src);
            audioRef.current.loop = audio.loop ?? true;
            audioRef.current.volume = audio.volume ?? 0.5;
            audioRef.current.muted = true;
            
            // Try to play (will be muted initially)
            if (audio.autoPlay !== false) {
                audioRef.current.play().then(() => {
                    setIsPlaying(true);
                }).catch(() => {
                    // Autoplay blocked, will play on user interaction
                    setIsPlaying(false);
                });
            }

            return () => {
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current = null;
                }
            };
        }
    }, [audio?.src, audio?.loop, audio?.volume, audio?.autoPlay]);

    // Handle mute toggle
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

    useEffect(() => {
        if (feColorMatrixRef.current && animationEnabled) {
            if (hueRotateAnimation.current) {
                hueRotateAnimation.current.stop();
            }
            hueRotateMotionValue.set(0);
            hueRotateAnimation.current = animate(hueRotateMotionValue, 360, {
                duration: animationDuration / 25,
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 0,
                ease: "linear",
                delay: 0,
                onUpdate: (value: number) => {
                    if (feColorMatrixRef.current) {
                        feColorMatrixRef.current.setAttribute("values", String(value));
                    }
                }
            });

            return () => {
                if (hueRotateAnimation.current) {
                    hueRotateAnimation.current.stop();
                }
            };
        }
    }, [animationEnabled, animationDuration, hueRotateMotionValue]);

    return (
        <>
            <div
                className={className}
                style={{
                    overflow: "hidden",
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    ...style
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: -displacementScale,
                        filter: animationEnabled ? `url(#${id}) blur(4px)` : "none"
                    }}
                >
                {animationEnabled && (
                    <svg style={{ position: "absolute" }}>
                        <defs>
                            <filter id={id}>
                                <feTurbulence
                                    result="undulation"
                                    numOctaves="2"
                                    baseFrequency={`${mapRange(animation.scale, 0, 100, 0.001, 0.0005)},${mapRange(animation.scale, 0, 100, 0.004, 0.002)}`}
                                    seed="0"
                                    type="turbulence"
                                />
                                <feColorMatrix
                                    ref={feColorMatrixRef}
                                    in="undulation"
                                    type="hueRotate"
                                    values="180"
                                />
                                <feColorMatrix
                                    in="dist"
                                    result="circulation"
                                    type="matrix"
                                    values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0"
                                />
                                <feDisplacementMap
                                    in="SourceGraphic"
                                    in2="circulation"
                                    scale={displacementScale}
                                    result="dist"
                                />
                                <feDisplacementMap
                                    in="dist"
                                    in2="undulation"
                                    scale={displacementScale}
                                    result="output"
                                />
                            </filter>
                        </defs>
                    </svg>
                )}
                <div
                    style={{
                        backgroundColor: color,
                        maskImage: `url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')`,
                        maskSize: sizing === "stretch" ? "100% 100%" : "cover",
                        maskRepeat: "no-repeat",
                        maskPosition: "center",
                        width: "100%",
                        height: "100%"
                    }}
                />
            </div>

            {children && (
                <div
                    style={{
                        position: "relative",
                        zIndex: 10,
                        width: "100%",
                        height: "100%"
                    }}
                >
                    {children}
                </div>
            )}

            {noise && noise.opacity > 0 && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `url("https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png")`,
                        backgroundSize: noise.scale * 200,
                        backgroundRepeat: "repeat",
                        opacity: noise.opacity / 2,
                        pointerEvents: "none"
                    }}
                />
            )}
            </div>

            {/* Audio Mute/Unmute Button - Rendered outside the overflow container */}
            {audio?.src && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    onClick={toggleMute}
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        zIndex: 9999,
                        padding: '16px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(10, 10, 20, 0.9)',
                        backdropFilter: 'blur(12px)',
                        border: isMuted ? '2px solid rgba(255, 0, 255, 0.5)' : '2px solid rgba(0, 255, 157, 0.8)',
                        cursor: 'pointer',
                        boxShadow: isMuted 
                            ? '0 0 15px rgba(255, 0, 255, 0.4), inset 0 0 10px rgba(255, 0, 255, 0.1)' 
                            : '0 0 25px rgba(0, 255, 157, 0.6), 0 0 50px rgba(0, 255, 157, 0.3), inset 0 0 15px rgba(0, 255, 157, 0.1)',
                        transition: 'all 0.3s ease'
                    }}
                    title={isMuted ? 'Click to Unmute 🔊' : 'Click to Mute 🔇'}
                >
                    {isMuted ? (
                        // Muted Icon
                        <svg 
                            style={{ width: '28px', height: '28px', color: '#ff00ff' }}
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
                            style={{ width: '28px', height: '28px', color: '#00ff9d' }}
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
                            style={{
                                position: 'absolute',
                                inset: '-4px',
                                borderRadius: '50%',
                                border: '2px solid rgba(0, 255, 157, 0.6)',
                                animation: 'pulse-audio 1.5s ease-in-out infinite'
                            }} 
                        />
                    )}
                </motion.button>
            )}

            <style>{`
                @keyframes pulse-audio {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.5; }
                }
            `}</style>
        </>
    );
}
