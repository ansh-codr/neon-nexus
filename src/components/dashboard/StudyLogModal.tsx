import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Clock, Brain, Target, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface StudyLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: StudyLogData) => Promise<void>;
  examMode?: boolean;
}

export interface StudyLogData {
  studyHours: number;
  focusLevel: 'low' | 'medium' | 'high';
  productivity: 'low' | 'medium' | 'high';
  subjects: string[];
}

const FOCUS_LEVELS: { value: 'low' | 'medium' | 'high'; label: string; emoji: string }[] = [
  { value: 'low', label: 'Distracted', emoji: '😵‍💫' },
  { value: 'medium', label: 'Moderate', emoji: '🤔' },
  { value: 'high', label: 'Deep Focus', emoji: '🎯' },
];

const PRODUCTIVITY_LEVELS: { value: 'low' | 'medium' | 'high'; label: string; emoji: string }[] = [
  { value: 'low', label: 'Light', emoji: '🌱' },
  { value: 'medium', label: 'Productive', emoji: '📚' },
  { value: 'high', label: 'Crushing It', emoji: '🔥' },
];

const StudyLogModal = ({ isOpen, onClose, onSave, examMode = false }: StudyLogModalProps) => {
  const [studyHours, setStudyHours] = useState(2);
  const [focusLevel, setFocusLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [productivity, setProductivity] = useState<'low' | 'medium' | 'high'>('medium');
  const [subjectInput, setSubjectInput] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const primaryColor = examMode ? "#a855f7" : "#00ff9d";
  const primaryColorRgba = examMode ? "rgba(168, 85, 247," : "rgba(0, 255, 157,";

  const handleAddSubject = () => {
    if (subjectInput.trim() && !subjects.includes(subjectInput.trim())) {
      setSubjects([...subjects, subjectInput.trim()]);
      setSubjectInput('');
    }
  };

  const handleRemoveSubject = (subject: string) => {
    setSubjects(subjects.filter(s => s !== subject));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        studyHours,
        focusLevel,
        productivity,
        subjects,
      });
      onClose();
      // Reset form
      setStudyHours(2);
      setFocusLevel('medium');
      setProductivity('medium');
      setSubjects([]);
    } catch (error) {
      console.error('Error saving study log:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-[10%] sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md z-50"
          >
            <div
              className="rounded-lg border p-6 backdrop-blur-xl max-h-[80vh] overflow-y-auto"
              style={{
                background: 'rgba(10, 10, 10, 0.95)',
                borderColor: `${primaryColorRgba} 0.3)`,
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ background: `${primaryColorRgba} 0.2)` }}
                  >
                    <BookOpen className="w-5 h-5" style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <h2
                      className="font-display text-lg uppercase tracking-wider"
                      style={{ color: primaryColor }}
                    >
                      Log Study Session
                    </h2>
                    <p className="text-xs text-muted-foreground font-mono">
                      Track your study progress
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Study Hours */}
              <div className="mb-6">
                <Label className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4" style={{ color: primaryColor }} />
                  <span className="font-mono text-sm">Study Duration</span>
                </Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[studyHours]}
                    onValueChange={(value) => setStudyHours(value[0])}
                    min={0.5}
                    max={12}
                    step={0.5}
                    className="flex-1"
                  />
                  <span
                    className="font-display text-xl font-bold min-w-[60px] text-right"
                    style={{ color: primaryColor }}
                  >
                    {studyHours}h
                  </span>
                </div>
              </div>

              {/* Focus Level */}
              <div className="mb-6">
                <Label className="flex items-center gap-2 mb-3">
                  <Brain className="w-4 h-4" style={{ color: primaryColor }} />
                  <span className="font-mono text-sm">Focus Level</span>
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {FOCUS_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setFocusLevel(level.value)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        focusLevel === level.value ? 'ring-2' : ''
                      }`}
                      style={{
                        background:
                          focusLevel === level.value
                            ? `${primaryColorRgba} 0.2)`
                            : 'rgba(255,255,255,0.05)',
                        borderColor:
                          focusLevel === level.value
                            ? primaryColor
                            : 'rgba(255,255,255,0.1)',
                        ringColor: primaryColor,
                      }}
                    >
                      <span className="text-xl block mb-1">{level.emoji}</span>
                      <span className="text-xs font-mono">{level.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Productivity */}
              <div className="mb-6">
                <Label className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4" style={{ color: primaryColor }} />
                  <span className="font-mono text-sm">Productivity</span>
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {PRODUCTIVITY_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setProductivity(level.value)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        productivity === level.value ? 'ring-2' : ''
                      }`}
                      style={{
                        background:
                          productivity === level.value
                            ? `${primaryColorRgba} 0.2)`
                            : 'rgba(255,255,255,0.05)',
                        borderColor:
                          productivity === level.value
                            ? primaryColor
                            : 'rgba(255,255,255,0.1)',
                        ringColor: primaryColor,
                      }}
                    >
                      <span className="text-xl block mb-1">{level.emoji}</span>
                      <span className="text-xs font-mono">{level.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Subjects */}
              <div className="mb-6">
                <Label className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4" style={{ color: primaryColor }} />
                  <span className="font-mono text-sm">Subjects (optional)</span>
                </Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSubject()}
                    placeholder="Add subject..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAddSubject}
                    variant="outline"
                    className="px-3"
                    style={{ borderColor: primaryColor, color: primaryColor }}
                  >
                    Add
                  </Button>
                </div>
                {subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((subject) => (
                      <span
                        key={subject}
                        className="px-2 py-1 rounded-full text-xs font-mono flex items-center gap-1"
                        style={{
                          background: `${primaryColorRgba} 0.2)`,
                          color: primaryColor,
                        }}
                      >
                        {subject}
                        <button
                          onClick={() => handleRemoveSubject(subject)}
                          className="hover:opacity-70"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full font-mono uppercase tracking-wider"
                style={{
                  background: `${primaryColorRgba} 0.2)`,
                  border: `1px solid ${primaryColor}`,
                  color: primaryColor,
                }}
              >
                {saving ? (
                  <span className="animate-pulse">Saving...</span>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Log Study Session
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StudyLogModal;
