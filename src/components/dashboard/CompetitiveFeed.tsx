import { motion, AnimatePresence } from "framer-motion";
import { Users, Flame, Trophy, TrendingUp, Sparkles } from "lucide-react";
import { CompetitiveFeedItem, PublicUserSnapshot, getBadge } from "@/firebase/streaks";

interface CompetitiveFeedProps {
  feedItems: CompetitiveFeedItem[];
  leaderboard: PublicUserSnapshot[];
  competitiveInsight?: string;
  currentUserId?: string;
  examMode?: boolean;
}

const FEED_ICONS: Record<CompetitiveFeedItem['type'], typeof Users> = {
  collective: Users,
  streak_extended: Flame,
  top_streak: Trophy,
  milestone: Sparkles,
};

const CompetitiveFeed = ({
  feedItems,
  leaderboard,
  competitiveInsight,
  currentUserId,
  examMode = false,
}: CompetitiveFeedProps) => {
  const primaryColor = examMode ? "#a855f7" : "#00ff9d";
  const primaryColorRgba = examMode ? "rgba(168, 85, 247," : "rgba(0, 255, 157,";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-5 rounded-lg border bg-card/50 backdrop-blur-sm"
      style={{ borderColor: `${primaryColorRgba} 0.3)` }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div
          className="p-1.5 sm:p-2 rounded-lg"
          style={{ background: `${primaryColorRgba} 0.1)` }}
        >
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: primaryColor }} />
        </div>
        <div>
          <h3
            className="font-display text-xs sm:text-sm uppercase tracking-wider"
            style={{ color: primaryColor }}
          >
            Campus Pulse
          </h3>
          <p className="text-[10px] sm:text-xs text-muted-foreground font-mono">
            Aggregate activity • No names shown
          </p>
        </div>
      </div>

      {/* AI Competitive Insight */}
      {competitiveInsight && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-lg border-l-2"
          style={{
            background: `${primaryColorRgba} 0.05)`,
            borderLeftColor: primaryColor,
          }}
        >
          <p className="text-xs sm:text-sm font-mono" style={{ color: primaryColor }}>
            <Sparkles className="w-3 h-3 inline-block mr-1.5 sm:mr-2" />
            {competitiveInsight}
          </p>
        </motion.div>
      )}

      {/* Feed Items */}
      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
        <AnimatePresence mode="popLayout">
          {feedItems.map((item, index) => {
            const Icon = FEED_ICONS[item.type];
            return (
              <motion.div
                key={`${item.type}-${item.date}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg"
                style={{ background: 'rgba(0,0,0,0.2)' }}
              >
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${primaryColorRgba} 0.2)` }}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: primaryColor }} />
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground font-mono flex-1">
                  {item.message}
                </p>
                {item.count && (
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: `${primaryColorRgba} 0.2)`,
                      color: primaryColor,
                    }}
                  >
                    {item.count}
                  </span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {feedItems.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground font-mono">
              Be the first to log today!
            </p>
          </div>
        )}
      </div>

      {/* Mini Leaderboard - Limited Visibility */}
      {leaderboard.length > 0 && (
        <>
          <div className="border-t border-border/50 pt-3 sm:pt-4 mt-3 sm:mt-4">
            <p className="text-[10px] sm:text-xs text-muted-foreground font-mono uppercase tracking-wider mb-2 sm:mb-3">
              Top Dedication This Week
            </p>
            <div className="space-y-1.5 sm:space-y-2">
              {leaderboard.slice(0, 5).map((user, index) => {
                const isCurrentUser = user.userId === currentUserId;
                return (
                  <motion.div
                    key={user.userId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className={`flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg transition-all`}
                    style={{
                      background: isCurrentUser ? `${primaryColorRgba} 0.1)` : 'transparent',
                      boxShadow: isCurrentUser ? `inset 0 0 0 1px ${primaryColor}` : 'none',
                    }}
                  >
                    {/* Rank */}
                    <span
                      className="w-5 sm:w-6 text-center font-mono text-[10px] sm:text-xs font-bold"
                      style={{
                        color:
                          index === 0
                            ? '#eab308'
                            : index === 1
                            ? '#9ca3af'
                            : index === 2
                            ? '#d97706'
                            : 'rgba(255,255,255,0.5)',
                      }}
                    >
                      #{index + 1}
                    </span>

                    {/* Badge */}
                    <span className="text-base sm:text-lg">{user.badge}</span>

                    {/* Name (anonymized option) */}
                    <span className="flex-1 font-mono text-xs sm:text-sm truncate">
                      {isCurrentUser ? 'You' : user.displayName.split(' ')[0]}
                    </span>

                    {/* Dedication Level Badge - hidden on very small screens */}
                    <span
                      className="hidden xs:inline-block text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-mono"
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.7)',
                      }}
                    >
                      {user.dedicationLevel.split(' ')[0]}
                    </span>

                    {/* Streak */}
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <Flame className="w-3 h-3" style={{ color: primaryColor }} />
                      <span
                        className="font-mono text-[10px] sm:text-xs font-bold"
                        style={{ color: primaryColor }}
                      >
                        {user.currentStreak}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Privacy Note */}
          <p className="text-[10px] sm:text-xs text-muted-foreground/50 font-mono mt-3 sm:mt-4 text-center">
            Only dedication levels shown • Your data stays private
          </p>
        </>
      )}
    </motion.div>
  );
};

export default CompetitiveFeed;
