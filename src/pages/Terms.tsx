import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Component as EtherealShadow } from "@/components/ui/etheral-shadow";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";

const Terms = () => {
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
            <FileText className="w-8 h-8 text-primary" />
            <h1
              className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wider"
              style={{ color: "#00ff9d", textShadow: "0 0 30px rgba(0, 255, 157, 0.5)" }}
            >
              Terms of Service
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
            <h2 className="font-terminal text-lg text-primary mb-3">1. Acceptance of Terms</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              By accessing and using Neon Nexus ("the App"), you agree to be bound by these Terms of 
              Service. If you do not agree to these terms, please do not use the App.
            </p>
          </section>

          <section className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="font-terminal text-lg text-primary mb-3">2. Description of Service</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              Neon Nexus is a health and wellness dashboard that helps users track their physical 
              activity, study habits, and overall wellness. The App integrates with Google Fit to 
              display health metrics and provides gamification features to encourage healthy habits.
            </p>
          </section>

          <section className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="font-terminal text-lg text-primary mb-3">3. User Accounts</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              You may sign in using your Google account. You are responsible for:
            </p>
            <ul className="list-disc list-inside font-mono text-sm text-muted-foreground mt-2 space-y-1">
              <li>Maintaining the security of your account</li>
              <li>All activities that occur under your account</li>
              <li>Ensuring the accuracy of information you provide</li>
            </ul>
          </section>

          <section className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="font-terminal text-lg text-primary mb-3">4. Acceptable Use</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              You agree not to:
            </p>
            <ul className="list-disc list-inside font-mono text-sm text-muted-foreground mt-2 space-y-1">
              <li>Use the App for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the App's functionality</li>
              <li>Submit false or misleading health data</li>
              <li>Harass or harm other users through competitive features</li>
            </ul>
          </section>

          <section className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="font-terminal text-lg text-primary mb-3">5. Health Disclaimer</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              <span className="text-yellow-400">Important:</span> Neon Nexus is not a medical device 
              and should not be used for medical diagnosis or treatment. The health metrics displayed 
              are for informational and motivational purposes only. Always consult healthcare 
              professionals for medical advice.
            </p>
          </section>

          <section className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="font-terminal text-lg text-primary mb-3">6. Third-Party Services</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              The App integrates with Google Fit and Firebase. Your use of these services is subject 
              to their respective terms of service and privacy policies. We are not responsible for 
              the accuracy of data provided by third-party services.
            </p>
          </section>

          <section className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="font-terminal text-lg text-primary mb-3">7. Limitation of Liability</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              The App is provided "as is" without warranties of any kind. We are not liable for any 
              damages arising from your use of the App, including but not limited to data loss, 
              service interruptions, or inaccurate health information.
            </p>
          </section>

          <section className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="font-terminal text-lg text-primary mb-3">8. Changes to Terms</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              We reserve the right to modify these terms at any time. Continued use of the App after 
              changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="font-terminal text-lg text-primary mb-3">9. Contact</h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              For questions about these terms, contact us at:{" "}
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

export default Terms;
