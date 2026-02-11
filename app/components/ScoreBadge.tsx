type ScoreBadgeProps = {
  score: number;
};

const getBadgeConfig = (score: number) => {
  if (score > 69) {
    return {
      label: "Strong",
      className: "bg-badge-green text-badge-green-text",
    };
  }

  if (score > 49) {
    return {
      label: "Good Start",
      className: "bg-badge-yellow text-badge-yellow-text",
    };
  }

  return {
    label: "Need Work",
    className: "bg-badge-red text-badge-red-text",
  };
};

export default function ScoreBadge({ score }: ScoreBadgeProps) {
  const { label, className } = getBadgeConfig(score);

  return (
    <div className={`score-badge ${className}`}>
      <p>{label}</p>
    </div>
  );
}
