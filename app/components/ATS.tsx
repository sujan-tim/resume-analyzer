type ATSTip = {
  type: "good" | "improve";
  tip: string;
};

type ATSProps = {
  score: number;
  suggestions: ATSTip[];
};

export default function ATS({ score, suggestions }: ATSProps) {
  const textColor =
    score > 69
      ? "text-badge-green-text"
      : score > 49
      ? "text-badge-yellow-text"
      : "text-badge-red-text";

  const bgColor =
    score > 69 ? "bg-badge-green" : score > 49 ? "bg-badge-yellow" : "bg-badge-red";

  return (
    <div className="bg-white rounded-2xl shadow-md w-full p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-black">ATS Score</h3>
        <div className={`score-badge ${bgColor}`}>
          <p className={textColor}>{score}/100</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {suggestions.length > 0 ? (
          suggestions.map((item, index) => (
            <div
              key={`${item.tip}-${index}`}
              className={
                item.type === "good"
                  ? "rounded-xl border border-green-200 bg-green-50 p-3"
                  : "rounded-xl border border-yellow-200 bg-yellow-50 p-3"
              }
            >
              <p className="text-sm text-gray-700">{item.tip}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No ATS suggestions available.</p>
        )}
      </div>
    </div>
  );
}
