// Export the getIcon function
export const getIcon = (type: "good" | "improve") => {
  if (type === "good") {
    return (
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
        <img src="/icons/check.svg" alt="good" className="w-4 h-4" />
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100">
        <img src="/icons/warning.svg" alt="improve" className="w-4 h-4" />
      </div>
    );
  }
};

// Updated TipCard component
export default function TipCard({ tip }: TipCardProps) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border border-gray-200 shadow-sm ${
        tip.type === "good" ? "bg-[#F6FEF9]" : "bg-[#FFFCF5]"
      }`}
    >
      {getIcon(tip.type)}
      <div className="flex-1">
        <p
          className={`font-medium text-sm ${
            tip.type === "good" ? "text-green-700 " : "text-yellow-700"
          }`}
        >
          {tip.tip}
        </p>
        {tip.explanation && (
          <p className="text-xs text-gray-600 mt-1">{tip.explanation}</p>
        )}
      </div>
    </div>
  );
}
