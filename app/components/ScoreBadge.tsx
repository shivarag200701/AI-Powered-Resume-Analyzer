import React from "react";

interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge = ({ score }: ScoreBadgeProps) => {
  let badgeStyles = "";
  let label = "";

  if (score > 70) {
    badgeStyles = "bg-badge-green text-green-600";
    label = "Strong";
  } else if (score > 49) {
    badgeStyles = "bg-badge-yellow text-yellow-600";
    label = "Good start";
  } else {
    badgeStyles = "bg-badge-red text-red-600";
    label = "Needs Work";
  }

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badgeStyles}`}
    >
      <p>{label}</p>
    </div>
  );
};

export default ScoreBadge;

const ScoreBadgeWithNumber = ({ score }: ScoreBadgeProps) => {
  let badgeStyles = "";
  let label = "";

  if (score > 70) {
    badgeStyles = "bg-badge-green text-green-600";
    label = `${score}/100`;
  } else if (score > 49) {
    badgeStyles = "bg-badge-yellow text-yellow-600";
    label = `${score}/100`;
  } else {
    badgeStyles = "bg-badge-red text-red-600";
    label = `${score}/100`;
  }

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badgeStyles} gap-2`}
    >
      <div className="inline-flex items-center justify-center w-4 h-4 rounded-full border text-xs font-extrabold text-gray-900 opacity-70 hover:opacity-100 transition-opacity">
        i
      </div>
      <p>{label}</p>
    </div>
  );
};

export { ScoreBadgeWithNumber };
