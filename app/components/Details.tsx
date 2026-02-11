type DetailSection = {
  title: string;
  score: number;
  tips: {
    type: "good" | "improve";
    tip: string;
    explanation: string;
  }[];
};

const Section = ({ title, score, tips }: DetailSection) => {
  return (
    <div className="bg-white rounded-2xl shadow-md w-full p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-semibold">{title}</p>
        <p className="text-lg text-gray-600">{score}/100</p>
      </div>

      <div className="flex flex-col gap-3">
        {tips.length > 0 ? (
          tips.map((tip, index) => (
            <div
              key={`${tip.tip}-${index}`}
              className={
                tip.type === "good"
                  ? "rounded-xl border border-green-200 bg-green-50 p-3"
                  : "rounded-xl border border-yellow-200 bg-yellow-50 p-3"
              }
            >
              <p className="font-medium text-gray-800">{tip.tip}</p>
              <p className="text-sm text-gray-600 mt-1">{tip.explanation}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No detailed suggestions available.</p>
        )}
      </div>
    </div>
  );
};

export default function Details({ feedback }: { feedback: Feedback }) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <Section
        title="Tone & Style"
        score={feedback.toneAndStyle.score}
        tips={feedback.toneAndStyle.tips}
      />
      <Section
        title="Content"
        score={feedback.content.score}
        tips={feedback.content.tips}
      />
      <Section
        title="Structure"
        score={feedback.structure.score}
        tips={feedback.structure.tips}
      />
      <Section
        title="Skills"
        score={feedback.skills.score}
        tips={feedback.skills.tips}
      />
    </div>
  );
}
