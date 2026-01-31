import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Component as EtherealShadow } from "@/components/ui/etheral-shadow";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";

const Privacy = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <Navbar />

      <div className="absolute inset-0 z-0">
        <EtherealShadow
          color="rgba(0, 255, 157, 0.1)"
          animation={{ scale: 60, speed: 50 }}
          noise={{ opacity: 0.6, scale: 1.2 }}
          sizing="fill"
        />
      </div>

      <main className="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <Link to="/">
          <Button variant="ghost" className="mb-6 text-primary hover:text-primary/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <h1
              className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wider"
              style={{ color: "#00ff9d", textShadow: "0 0 30px rgba(0, 255, 157, 0.5)" }}
            >
              Privacy Policy
            </h1>
          </div>
          <p className="font-mono text-sm text-muted-foreground">
            Last updated: January 31, 2026
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert max-w-none space-y-6"
        >
          <section className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="font-terminal text-lg text-primary mb-3">1. Information We Collect</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              When you use Neon Nexus, we may collect:
            </p>
            <ul className="list-disc list-inside font-mono text-sm text-muted-foreground mt-2 space-y-1">
              <li>Account information (email, display name) via Google Sign-In</li>
              <li>Health and fitness data from Google Fit (steps, calories, active minutes, distance)</li>
              <li>Study session logs you manually input</li>
              <li>App usage data for improving our services</li>
            </ul>
          </section>

          <section className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="font-terminal text-lg text-primary mb-3">2. How We Use Your Data</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              Your data is used to:
            </p>
            <ul className="list-disc list-inside font-mono text-sm text-muted-foreground mt-2 space-y-1">
              <li>Display your personal health dashboard</li>
              <li>Calculate streaks and dedication scores</li>
              <li>Generate personalized health insights</li>
              <li>Show your progress on leaderboards (with your consent)</li>
            </ul>
          </section>

          <section className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="font-terminal text-lg text-primary mb-3">3. Google Fit Data</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              We access Google Fit data in <span className="text-primary">read-only mode</span>. We never modify, 
              delete, or write data to your Google Fit account. Data processing happens locally in your 
              browser. You can disconnect Google Fit at any time from your dashboard.
            </p>
          </section>

          <section className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="font-terminal text-lg text-primary mb-3">4. Data Storage</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              Your health data is stored securely using Firebase (Google Cloud). We use industry-standard 
              encryption and security practices. We do not sell or share your personal health data with 
              third parties.
            </p>
          </section>

          <section className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="font-terminal text-lg text-primary mb-3">5. Your Rights</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              You have the right to:
            </p>
            <ul className="list-disc list-inside font-mono text-sm text-muted-foreground mt-2 space-y-1">
              <li>Access your personal data</li>
              <li>Request deletion of your account and data</li>
              <li>Disconnect third-party services (Google Fit) at any time</li>
              <li>Opt out of leaderboard visibility</li>
            </ul>
          </section>

          <section className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="font-terminal text-lg text-primary mb-3">6. Contact Us</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              For privacy concerns or data requests, contact us at:{" "}
              <a href="mailto:dodgehellcatansh@gmail.com" className="text-primary hover:underline">
                dodgehellcatansh@gmail.com
              </a>
            </p>
          </section>
        </motion.div>
      </main>
    </div>
  );
};

export default Privacy;
