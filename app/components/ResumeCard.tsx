import { Link } from "react-router";
import ScoreCircle from "./scoreCircle";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  return (
    <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          {companyName && <h2 className="!text-black font-bold break-words">{companyName}</h2>}
          {jobTitle && <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>}
          {!companyName && !jobTitle && <h2 className="!text-black font-bold break-words">Resume</h2>}
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>
      {imagePath && (
        <div className="gradient-border animate-in fade-in duration-1000">
          <div className="bg-white/90 rounded-xl p-2">
            <div className="aspect-[4/5] w-full">
              <img src={imagePath} alt="resume" className="block h-full w-full object-contain" />
            </div>
          </div>
        </div>
      )}
    </Link>
  );
};

export default ResumeCard;
