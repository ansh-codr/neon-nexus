import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Component as EtherealShadow } from "@/components/ui/etheral-shadow";
import HealthScoreRing from "@/components/dashboard/HealthScoreRing";
import HealthSnapshot from "@/components/dashboard/HealthSnapshot";
import WeeklyTrends from "@/components/dashboard/WeeklyTrends";
import SmartSuggestions from "@/components/dashboard/SmartSuggestions";
import ExamModeToggle from "@/components/dashboard/ExamModeToggle";
import HealthInputModal, { AddHealthDataButton } from "@/components/dashboard/HealthInputModal";
import { useAuth } from "@/contexts/AuthContext";
import { useHealthData } from "@/hooks/useHealthData";
import { User, Calendar, Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading, setExamMode } = useAuth();
  const { 
    loading: dataLoading, 
    todayData, 
    weeklyData, 
    insights, 
    weeklySummary, 
    saveToday,
    refreshInsights,
    isAuthenticated 
  } = useHealthData();

  const [showInputModal, setShowInputModal] = useState(false);
  const examMode = userProfile?.examMode || false;

  // Get today's date
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Calculate display score
  const displayScore = todayData
    ? (examMode ? Math.min(todayData.healthScore + 8, 100) : todayData.healthScore)
    : 0;

  // Handle exam mode toggle
  const handleExamModeToggle = async (enabled: boolean) => {
    if (isAuthenticated) {
      await setExamMode(enabled);
    }
  };

  // Handle save health data
  const handleSaveHealth = async (data: {
    sleepHours: number;
    steps: number;
    activityLevel: 'low' | 'medium' | 'high';
    focusLevel: 'low' | 'medium' | 'high';
    stressLevel: 'low' | 'medium' | 'high';
  }) => {
    await saveToday(data);
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-background">
        <Navbar />
        
        <div className="absolute inset-0 z-0">
          <EtherealShadow
            color="rgba(0, 255, 157, 0.15)"
            animation={{ scale: 60, speed: 50 }}
            noise={{ opacity: 0.6, scale: 1.2 }}
            sizing="fill"
          />
        </div>

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div
              className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(0, 255, 157, 0.1)',
                border: '2px solid rgba(0, 255, 157, 0.3)',
              }}
            >
              <User className="w-10 h-10 text-primary" />
            </div>
            
            <h1
              className="text-3xl font-display font-bold uppercase tracking-wider mb-4"
              style={{
                color: '#00ff9d',
                textShadow: '0 0 30px rgba(0, 255, 157, 0.5)',
              }}
            >
              Authentication Required
            </h1>
            
            <p className="text-muted-foreground mb-8 font-mono text-sm">
              Sign in to access your personal health dashboard and start tracking your wellness journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/login')}
                className="font-mono uppercase tracking-wider"
                style={{
                  background: 'rgba(0, 255, 157, 0.2)',
                  border: '1px solid #00ff9d',
                  color: '#00ff9d',
                }}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
              <Button
                onClick={() => navigate('/signup')}
                variant="outline"
                className="font-mono uppercase tracking-wider"
              >
                Create Account
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <Navbar />

      {/* Ethereal Shadow Background */}
      <div className="absolute inset-0 z-0">
        <EtherealShadow
          color={examMode ? "rgba(168, 85, 247, 0.2)" : "rgba(0, 255, 157, 0.15)"}
          animation={{ scale: 60, speed: 50 }}
          noise={{ opacity: 0.6, scale: 1.2 }}
          sizing="fill"
        />
      </div>

      {/* Background gradient overlay */}
      <div
        className="absolute inset-0 z-0 transition-all duration-1000"
        style={{
          background: examMode
            ? "radial-gradient(circle at 50% 30%, rgba(168, 85, 247, 0.1) 0%, transparent 60%)"
            : "radial-gradient(circle at 50% 30%, rgba(0, 255, 157, 0.1) 0%, transparent 60%)",
        }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(${examMode ? "rgba(168, 85, 247, 0.1)" : "rgba(0, 255, 157, 0.1)"} 1px, transparent 1px),
              linear-gradient(90deg, ${examMode ? "rgba(168, 85, 247, 0.1)" : "rgba(0, 255, 157, 0.1)"} 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-50 scanlines opacity-20" />

      {/* Main Content */}
      <main className="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider flex items-center gap-2"
                  style={{
                    background: examMode ? "rgba(168, 85, 247, 0.2)" : "rgba(0, 255, 157, 0.2)",
                    border: `1px solid ${examMode ? "rgba(168, 85, 247, 0.5)" : "rgba(0, 255, 157, 0.5)"}`,
                    color: examMode ? "#a855f7" : "#00ff9d",
                  }}
                >
                  <User className="w-3 h-3" />
                  {userProfile?.displayName || user?.email || 'User'}
                </div>
                {!todayData && (
                  <span className="text-xs text-yellow-500 font-mono">• No data today</span>
                )}
              </div>
              <h1
                className="text-3xl sm:text-4xl font-display font-bold uppercase tracking-wider"
                style={{
                  color: examMode ? "#a855f7" : "#00ff9d",
                  textShadow: `0 0 30px ${examMode ? "rgba(168, 85, 247, 0.5)" : "rgba(0, 255, 157, 0.5)"}`,
                }}
              >
                Health Dashboard
              </h1>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-mono">{today}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading state for data */}
        {dataLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: examMode ? "#a855f7" : "#00ff9d" }} />
          </div>
        ) : (
          /* Dashboard Grid */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Health Score & Snapshot */}
            <div className="lg:col-span-1 space-y-6">
              {/* Health Score Ring */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-lg border border-primary/20 bg-card/50 backdrop-blur-sm flex flex-col items-center"
              >
                <h3
                  className="font-display text-sm uppercase tracking-wider mb-6"
                  style={{ color: examMode ? "#a855f7" : "#00ff9d" }}
                >
                  Today's Health Score
                </h3>
                <HealthScoreRing score={displayScore} size={180} examMode={examMode} />
                <p className="text-xs text-muted-foreground font-mono mt-4 text-center">
                  {!todayData
                    ? "Log your health data to see your score"
                    : examMode
                    ? "Adjusted for exam period wellness"
                    : "Based on sleep, activity & focus"}
                </p>
              </motion.div>

              {/* Exam Mode Toggle */}
              <ExamModeToggle enabled={examMode} onToggle={handleExamModeToggle} />
            </div>

            {/* Middle Column - Health Metrics */}
            <div className="lg:col-span-1 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3
                  className="font-display text-sm uppercase tracking-wider mb-4"
                  style={{ color: examMode ? "#a855f7" : "#00ff9d" }}
                >
                  Today's Snapshot
                </h3>
                {todayData ? (
                  <HealthSnapshot
                    sleepHours={todayData.sleepHours}
                    steps={todayData.steps}
                    activityLevel={todayData.activityLevel}
                    focusLevel={todayData.focusLevel}
                    examMode={examMode}
                  />
                ) : (
                  <div
                    className="p-8 rounded-lg border border-dashed text-center"
                    style={{ borderColor: `${examMode ? "#a855f7" : "#00ff9d"}40` }}
                  >
                    <p className="text-muted-foreground font-mono text-sm mb-4">
                      No health data logged today
                    </p>
                    <Button
                      onClick={() => setShowInputModal(true)}
                      className="font-mono text-xs"
                      style={{
                        background: examMode ? "rgba(168, 85, 247, 0.2)" : "rgba(0, 255, 157, 0.2)",
                        border: `1px solid ${examMode ? "#a855f7" : "#00ff9d"}`,
                        color: examMode ? "#a855f7" : "#00ff9d",
                      }}
                    >
                      Log Today's Data
                    </Button>
                  </div>
                )}
              </motion.div>

              {/* Smart Suggestions */}
              <SmartSuggestions 
                insights={insights.length > 0 ? insights : ["Log your health data to get personalized insights!"]} 
                examMode={examMode}
                onRefresh={refreshInsights}
              />
            </div>

            {/* Right Column - Weekly Trends */}
            <div className="lg:col-span-1">
              <WeeklyTrends 
                data={weeklyData} 
                examMode={examMode} 
                summary={weeklySummary || "Start tracking to see your weekly trends!"} 
              />
            </div>
          </div>
        )}

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <p className="text-xs text-muted-foreground/50 font-mono">
            © 2026 NEON NEXUS • Campus Health Tracking • Real-time Data
          </p>
        </motion.div>
      </main>

      {/* Floating Add Button */}
      <AddHealthDataButton onClick={() => setShowInputModal(true)} examMode={examMode} />

      {/* Health Input Modal */}
      <HealthInputModal
        isOpen={showInputModal}
        onClose={() => setShowInputModal(false)}
        onSave={handleSaveHealth}
        examMode={examMode}
        initialData={todayData || undefined}
      />
    </div>
  );
};

export default Dashboard;
