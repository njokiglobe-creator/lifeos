"use client";

export default function DawnRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="dawnRing" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff8b5e" />
            <stop offset="50%" stopColor="#ffc15e" />
            <stop offset="100%" stopColor="#6fe3d0" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="url(#dawnRing)"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-display">{score}</span>
        <span className="text-xs text-muted">Discipline Score</span>
      </div>
    </div>
  );
}
