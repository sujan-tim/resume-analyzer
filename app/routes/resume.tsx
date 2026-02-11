import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => ([
    { title :'Resumemind | Review' },
    { name : 'description', content: 'Detailed overview of your Resume' },
]);

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id ?? ""}`);
    }
  }, [auth.isAuthenticated, id, isLoading, navigate]);

  useEffect(() => {
    if (!id || !auth.isAuthenticated) return;

    let mounted = true;
    let currentResumeUrl = "";
    let currentImageUrl = "";

    const loadResume = async () => {
      try {
        const storedResume = await kv.get(`resume:${id}`);
        if (!storedResume || !mounted) return;

        const data = JSON.parse(storedResume) as Resume;
        setFeedback(data.feedback ?? null);

        const resumeBlob = await fs.read(data.resumePath);
        if (resumeBlob && mounted) {
          currentResumeUrl = URL.createObjectURL(resumeBlob);
          setResumeUrl(currentResumeUrl);
        }

        if (data.imagePath) {
          try {
            const imageBlob = await fs.read(data.imagePath);
            if (imageBlob && mounted) {
              currentImageUrl = URL.createObjectURL(imageBlob);
              setImageUrl(currentImageUrl);
            }
          } catch (imageErr) {
            // Keep the page usable even if preview image is missing/corrupt.
            console.warn("Unable to load resume preview image", imageErr);
          }
        }
      } catch (err) {
        console.error("Failed to load resume details", err);
      }
    };

    void loadResume();

    return () => {
      mounted = false;
      if (currentResumeUrl) URL.revokeObjectURL(currentResumeUrl);
      if (currentImageUrl) URL.revokeObjectURL(currentImageUrl);
    };
  }, [auth.isAuthenticated, fs, id, kv]);

  return (
    <main className="!pt-0">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
          <span className="text-gray-800 text-sm font-semibold">
            Back to Home
          </span>
        </Link>
      </nav>
      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">
          {resumeUrl && (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-w-xl:h-fit w-fit">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    className="w-full h-full object-contain rounded-2xl"
                    title="resume"
                    alt="Resume preview"
                  />
                ) : (
                  <div className="bg-white rounded-2xl p-8 min-h-60 min-w-80 flex items-center justify-center">
                    <p className="text-gray-600 text-center">
                      Preview unavailable. Click to open your uploaded PDF.
                    </p>
                  </div>
                )}
              </a>
            </div>
          )}
        </section>
        <section className="feedback-section">
          <h2 className="text-4xl !text-black font-bold mb-6">Resume Feedback</h2>
          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
              <Summary feedback={feedback} />
              <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
              <Details feedback={feedback} />
            </div>
          ) : (
            <img src="/images/resume-scan-2.gif" className="w-full" alt="Loading analysis" />
          )}
        </section>
      </div>
</main>
  );
};

export default Resume;
