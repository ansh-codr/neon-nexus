import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Component as EtherealShadow } from "@/components/ui/etheral-shadow";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Smartphone, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Activity,
  Footprints,
  Flame,
  Timer,
  MapPin,
  Shield,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { useGoogleFit } from "@/hooks/useGoogleFit";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistance } from "@/firebase/googleFit";

const ConnectFit = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    isConnected, 
    isLoading, 
    error, 
    connect, 
    disconnect, 
    refresh,
    todayData,
    streak,
    dedication,
  } = useGoogleFit();
  
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    if (!user) {
      navigate('/login?redirect=/connect-fit');
      return;
    }
    
    setConnecting(true);
    const success = await connect();
    setConnecting(false);
    
    if (success) {
      // Optional: redirect to dashboard after successful connection
      // navigate('/dashboard');
    }
  };

  const handleDisconnect = () => {
    if (confirm('Disconnect Google Fit? You can reconnect anytime.')) {
      disconnect();
    }
  };

  const features = [
    {
      icon: Footprints,
      title: "Step Tracking",
      desc: "Automatic step counting using phone sensors",
      color: "#00ff9d",
    },
    {
      icon: Flame,
      title: "Calories Burned",
      desc: "Track energy expenditure throughout the day",
      color: "#ff6b35",
    },
    {
      icon: Timer,
      title: "Active Minutes",
      desc: "Monitor daily activity and movement time",
      color: "#00ffff",
    },
    {
      icon: MapPin,
      title: "Distance",
      desc: "Track walking and running distances",
      color: "#ff00ff",
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <Navbar />

      <div className="absolute inset-0 z-0">
        <EtherealShadow
          color="rgba(0, 255, 157, 0.12)"
          animation={{ scale: 60, speed: 50 }}
          noise={{ opacity: 0.6, scale: 1.2 }}
          sizing="fill"
        />
      </div>

      <div className="fixed inset-0 pointer-events-none z-50 scanlines opacity-20" />

      <main className="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <Link to="/dashboard">
          <Button variant="ghost" className="mb-6 text-primary hover:text-primary/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/30 mb-4">
            <Activity className="w-10 h-10 text-primary" />
          </div>
          <h1
            className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wider mb-2"
            style={{ color: "#00ff9d", textShadow: "0 0 30px rgba(0, 255, 157, 0.5)" }}
          >
            Google Fit
          </h1>
          <p className="font-mono text-sm text-muted-foreground max-w-md mx-auto">
            Connect your Android phone to sync real health data. No smartwatch required!
          </p>
        </motion.div>

        {/* Connection Status Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-xl p-6 mb-8 border ${
            isConnected 
              ? 'bg-primary/5 border-primary/30' 
              : 'bg-white/5 border-white/10'
          }`}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isConnected ? 'bg-primary/20' : 'bg-white/10'
              }`}>
                {isConnected ? (
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                ) : (
                  <Smartphone className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className={`font-terminal text-lg ${isConnected ? 'text-primary' : 'text-foreground'}`}>
                  {isConnected ? 'Connected' : 'Not Connected'}
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  {isConnected 
                    ? 'Syncing health data from Google Fit' 
                    : 'Connect to start tracking real data'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {isConnected ? (
                <>
                  <Button
                    onClick={refresh}
                    disabled={isLoading}
                    variant="outline"
                    className="border-primary/30 text-primary hover:bg-primary/10"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    <span className="ml-2 hidden sm:inline">Sync</span>
                  </Button>
                  <Button
                    onClick={handleDisconnect}
                    variant="outline"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleConnect}
                  disabled={connecting || isLoading}
                  className="bg-primary/20 border border-primary text-primary hover:bg-primary/30"
                >
                  {connecting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Activity className="w-4 h-4 mr-2" />
                      Connect Google Fit
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Error display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2"
              >
                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="font-mono text-xs text-red-400">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Connected: Show Today's Data */}
        <AnimatePresence>
          {isConnected && todayData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <h2 className="font-terminal text-sm uppercase text-muted-foreground mb-4">
                Today's Activity
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-lg p-4 border border-primary/20">
                  <Footprints className="w-5 h-5 text-primary mb-2" />
                  <p className="font-display text-2xl text-primary">{todayData.steps.toLocaleString()}</p>
                  <p className="font-mono text-xs text-muted-foreground">Steps</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-orange-500/20">
                  <Flame className="w-5 h-5 text-orange-400 mb-2" />
                  <p className="font-display text-2xl text-orange-400">{todayData.calories}</p>
                  <p className="font-mono text-xs text-muted-foreground">Calories</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-cyan-500/20">
                  <Timer className="w-5 h-5 text-cyan-400 mb-2" />
                  <p className="font-display text-2xl text-cyan-400">{todayData.activeMinutes}</p>
                  <p className="font-mono text-xs text-muted-foreground">Active Min</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-fuchsia-500/20">
                  <MapPin className="w-5 h-5 text-fuchsia-400 mb-2" />
                  <p className="font-display text-2xl text-fuchsia-400">{formatDistance(todayData.distance)}</p>
                  <p className="font-mono text-xs text-muted-foreground">Distance</p>
                </div>
              </div>

              {/* Streak & Dedication */}
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="font-terminal text-xs text-muted-foreground mb-2">Current Streak</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-4xl text-primary">{streak.current}</span>
                    <span className="font-mono text-sm text-muted-foreground">days</span>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground mt-1">
                    Best: {streak.best} days • Active: {streak.activeDays}/7 days
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="font-terminal text-xs text-muted-foreground mb-2">Dedication Level</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl" style={{ 
                      color: dedication.level === 'Legend' ? '#ffd700' :
                             dedication.level === 'Elite' ? '#a855f7' :
                             dedication.level === 'Dedicated' ? '#00ff9d' :
                             dedication.level === 'Committed' ? '#3b82f6' : '#94a3b8'
                    }}>
                      {dedication.level}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground mt-1">
                    {dedication.label} • Score: {dedication.score}/100
                  </p>
                </div>
              </div>

              <p className="font-mono text-xs text-muted-foreground text-center mt-4">
                Last synced: {todayData.lastSynced.toLocaleTimeString()}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Grid */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="font-terminal text-sm uppercase text-muted-foreground mb-4">
              What You Get
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <feature.icon 
                    className="w-8 h-8 mb-3" 
                    style={{ color: feature.color }} 
                  />
                  <h3 className="font-terminal text-sm text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="font-mono text-xs text-muted-foreground">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 rounded-lg p-4 border border-white/10"
        >
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-terminal text-sm text-foreground mb-1">
                Privacy First
              </h3>
              <p className="font-mono text-xs text-muted-foreground">
                Your health data is read-only. We never modify or share your Google Fit data. 
                All processing happens locally in your browser. You can disconnect anytime.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Requirements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="font-terminal text-xs text-muted-foreground/50 mb-2">
            Requirements
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Android phone with Google Fit app installed • Google account • No smartwatch needed
          </p>
          <a 
            href="https://play.google.com/store/apps/details?id=com.google.android.apps.fitness"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 font-mono text-xs text-primary hover:underline"
          >
            Get Google Fit on Play Store
            <ExternalLink className="w-3 h-3" />
          </a>
        </motion.div>
      </main>
    </div>
  );
};

export default ConnectFit;
