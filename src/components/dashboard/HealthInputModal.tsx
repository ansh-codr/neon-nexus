import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Moon, Footprints, Brain, Zap, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface HealthInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    sleepHours: number;
    steps: number;
    activityLevel: 'low' | 'medium' | 'high';
    focusLevel: 'low' | 'medium' | 'high';
    stressLevel: 'low' | 'medium' | 'high';
  }) => void;
  examMode?: boolean;
  initialData?: {
    sleepHours: number;
    steps: number;
    activityLevel: 'low' | 'medium' | 'high';
    focusLevel: 'low' | 'medium' | 'high';
    stressLevel: 'low' | 'medium' | 'high';
  };
}

const HealthInputModal = ({ isOpen, onClose, onSave, examMode = false, initialData }: HealthInputModalProps) => {
  const [sleepHours, setSleepHours] = useState(initialData?.sleepHours || 7);
  const [steps, setSteps] = useState(initialData?.steps || 5000);
  const [activityLevel, setActivityLevel] = useState<'low' | 'medium' | 'high'>(initialData?.activityLevel || 'medium');
  const [focusLevel, setFocusLevel] = useState<'low' | 'medium' | 'high'>(initialData?.focusLevel || 'medium');
  const [stressLevel, setStressLevel] = useState<'low' | 'medium' | 'high'>(initialData?.stressLevel || 'medium');

  const accentColor = examMode ? "#a855f7" : "#00ff9d";
  const accentBg = examMode ? "rgba(168, 85, 247, 0.2)" : "rgba(0, 255, 157, 0.2)";

  const handleSave = () => {
    onSave({
      sleepHours,
      steps,
      activityLevel,
      focusLevel,
      stressLevel,
    });
    onClose();
  };

  const LevelSelector = ({ 
    label, 
    icon: Icon, 
    value, 
    onChange 
  }: { 
    label: string; 
    icon: React.ElementType; 
    value: 'low' | 'medium' | 'high'; 
    onChange: (v: 'low' | 'medium' | 'high') => void;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
        <Icon className="w-4 h-4" style={{ color: accentColor }} />
        {label}
      </div>
      <div className="flex gap-2">
        {(['low', 'medium', 'high'] as const).map((level) => (
          <button
            key={level}
            onClick={() => onChange(level)}
            className="flex-1 px-3 py-2 rounded text-xs font-mono uppercase transition-all"
            style={{
              background: value === level ? accentBg : 'rgba(255,255,255,0.05)',
              border: `1px solid ${value === level ? accentColor : 'rgba(255,255,255,0.1)'}`,
              color: value === level ? accentColor : 'rgba(255,255,255,0.5)',
            }}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.8)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md p-6 rounded-lg border bg-card/95 backdrop-blur-xl"
            style={{ borderColor: `${accentColor}40` }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-xl font-display uppercase tracking-wider"
                style={{ color: accentColor }}
              >
                Log Today's Health
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Sleep Hours */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
                    <Moon className="w-4 h-4" style={{ color: accentColor }} />
                    Sleep Hours
                  </div>
                  <span className="text-lg font-mono" style={{ color: accentColor }}>
                    {sleepHours.toFixed(1)}h
                  </span>
                </div>
                <Slider
                  value={[sleepHours]}
                  onValueChange={([v]) => setSleepHours(v)}
                  min={0}
                  max={12}
                  step={0.5}
                  className="w-full"
                />
              </div>

              {/* Steps */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
                    <Footprints className="w-4 h-4" style={{ color: accentColor }} />
                    Steps
                  </div>
                  <span className="text-lg font-mono" style={{ color: accentColor }}>
                    {steps.toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={[steps]}
                  onValueChange={([v]) => setSteps(v)}
                  min={0}
                  max={20000}
                  step={500}
                  className="w-full"
                />
              </div>

              {/* Activity Level */}
              <LevelSelector
                label="Activity Level"
                icon={Zap}
                value={activityLevel}
                onChange={setActivityLevel}
              />

              {/* Focus Level */}
              <LevelSelector
                label="Focus Level"
                icon={Brain}
                value={focusLevel}
                onChange={setFocusLevel}
              />

              {/* Stress Level */}
              <LevelSelector
                label="Stress Level"
                icon={Zap}
                value={stressLevel}
                onChange={setStressLevel}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 font-mono"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 font-mono"
                style={{
                  background: accentBg,
                  border: `1px solid ${accentColor}`,
                  color: accentColor,
                }}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Floating Add Button
export const AddHealthDataButton = ({ onClick, examMode = false }: { onClick: () => void; examMode?: boolean }) => {
  const accentColor = examMode ? "#a855f7" : "#00ff9d";
  
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center z-40 shadow-lg"
      style={{
        background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}40)`,
        border: `2px solid ${accentColor}`,
        boxShadow: `0 0 20px ${accentColor}40`,
      }}
    >
      <Plus className="w-6 h-6" style={{ color: accentColor }} />
    </motion.button>
  );
};

export default HealthInputModal;
