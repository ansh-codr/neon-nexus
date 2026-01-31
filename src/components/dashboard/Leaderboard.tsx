import { motion } from "framer-motion";
import { Trophy, Medal, TrendingUp, Crown } from "lucide-react";

export interface LeaderboardUser {
  id: string;
  name: string;
  score: number;
  rank: number;
  avatar?: string;
  streak?: number;
}

interface LeaderboardProps {
  users: LeaderboardUser[];
  examMode?: boolean;
  currentUserId?: string;
}

const Leaderboard = ({ users, examMode = false, currentUserId }: LeaderboardProps) => {
  const primaryColor = examMode ? "#a855f7" : "#00ff9d";
  const primaryColorRgba = examMode ? "rgba(168, 85, 247," : "rgba(0, 255, 157,";

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-xs font-mono text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBackground = (rank: number) => {
    switch (rank) {
      case 1:
        return "linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(234, 179, 8, 0.05) 100%)";
      case 2:
        return "linear-gradient(135deg, rgba(156, 163, 175, 0.2) 0%, rgba(156, 163, 175, 0.05) 100%)";
      case 3:
        return "linear-gradient(135deg, rgba(217, 119, 6, 0.2) 0%, rgba(217, 119, 6, 0.05) 100%)";
      default:
        return `${primaryColorRgba} 0.05)`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-lg border bg-card/50 backdrop-blur-sm"
      style={{ borderColor: `${primaryColorRgba} 0.3)` }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-2 rounded-lg"
          style={{ background: `${primaryColorRgba} 0.1)` }}
        >
          <Trophy className="w-5 h-5" style={{ color: primaryColor }} />
        </div>
        <div>
          <h3
            className="font-display text-sm uppercase tracking-wider"
            style={{ color: primaryColor }}
          >
            Campus Leaderboard
          </h3>
          <p className="text-xs text-muted-foreground font-mono">Top health scores this week</p>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-3 rounded-lg border transition-all duration-300 hover:scale-[1.02] ${
              currentUserId === user.id ? "ring-2" : ""
            }`}
            style={{
              background: getRankBackground(user.rank),
              borderColor:
                user.rank <= 3
                  ? user.rank === 1
                    ? "rgba(234, 179, 8, 0.3)"
                    : user.rank === 2
                    ? "rgba(156, 163, 175, 0.3)"
                    : "rgba(217, 119, 6, 0.3)"
                  : `${primaryColorRgba} 0.2)`,
              ringColor: currentUserId === user.id ? primaryColor : "transparent",
            }}
          >
            <div className="flex items-center gap-3">
              {/* Rank */}
              <div className="w-8 h-8 flex items-center justify-center">
                {getRankIcon(user.rank)}
              </div>

              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold uppercase"
                style={{
                  background: `${primaryColorRgba} 0.2)`,
                  border: `2px solid ${primaryColorRgba} 0.5)`,
                  color: primaryColor,
                }}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user.name.charAt(0)
                )}
              </div>

              {/* Name & Streak */}
              <div className="flex-1">
                <p className="font-mono text-sm font-medium">
                  {user.name}
                  {currentUserId === user.id && (
                    <span className="ml-2 text-xs" style={{ color: primaryColor }}>
                      (You)
                    </span>
                  )}
                </p>
                {user.streak && user.streak > 1 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="w-3 h-3" />
                    <span>{user.streak} day streak</span>
                  </div>
                )}
              </div>

              {/* Score */}
              <div className="text-right">
                <p
                  className="font-display text-lg font-bold"
                  style={{
                    color:
                      user.rank === 1
                        ? "#eab308"
                        : user.rank === 2
                        ? "#9ca3af"
                        : user.rank === 3
                        ? "#d97706"
                        : primaryColor,
                  }}
                >
                  {user.score}
                </p>
                <p className="text-xs text-muted-foreground font-mono">pts</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-border/50 text-center">
        <p className="text-xs text-muted-foreground font-mono">
          Updated in real-time • Keep tracking to climb!
        </p>
      </div>
    </motion.div>
  );
};

export default Leaderboard;
