import { type FormEvent, useState } from "react";
import FileUploader from '~/components/FileUploader';
import Navbar from '~/components/Navbar';
import { generateUUID } from '~/components/utils';
import { convertPdfToImage } from '~/lib/pdf2image';
import { usePuterStore } from '~/lib/puter';
import { prepareInstructions, AIResponseFormat } from '../../constants';
import { useNavigate } from "react-router";


const Upload = () => {
  const { fs, ai, kv, auth } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (f: File | null) => setFile(f);

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string | null;
    jobTitle: string | null;
    jobDescription: string | null;
    file: File;
  }) => {
    // Ensure user is signed in before performing Puter operations
    if (!auth?.isAuthenticated) {
      setStatusText('Please sign in to analyze your resume');
      return;
    }

    setIsProcessing(true);
    setStatusText('Analyzing your resume...');

    try {
      const uploadedFile = await fs.upload([file]);
      if (!uploadedFile) throw new Error('failed to upload file');

      setStatusText('Converting to image...');
      const imageFile = await convertPdfToImage(file);

      let imagePath = "";
      if (imageFile?.file) {
        setStatusText('Extracting resume data...');
        const uploadedImage = await fs.upload([imageFile.file]);
        if (uploadedImage?.path) imagePath = uploadedImage.path;
      } else {
        const conversionError = imageFile?.error ?? "failed to convert pdf to image";
        console.warn("PDF preview conversion failed, continuing without preview image:", conversionError);
      }

      setStatusText('Getting AI feedback...');
      const uuid = generateUUID();
      const data = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath,
        companyName,
        jobTitle,
        jobDescription,
        feedback: null as any,
      };

      await kv.set(`resume:${uuid}`, JSON.stringify(data));
      setStatusText('Analyzing your resume...');

      const prompt = prepareInstructions({
        jobTitle: jobTitle ?? '',
        jobDescription: jobDescription ?? '',
        AIResponseFormat,
      });

      const feedback = await ai.feedback(uploadedFile.path, prompt);
      if (!feedback) throw new Error('failed to analyze resume');

      let feedbackText = '';
      if (typeof feedback === 'string') {
        feedbackText = feedback;
      } else if (typeof feedback?.message?.content === 'string') {
        feedbackText = feedback.message.content as string;
      } else if (Array.isArray(feedback?.message?.content)) {
        const first = feedback.message.content[0] as any;
        feedbackText = first?.text ?? JSON.stringify(feedback.message.content);
      } else {
        feedbackText = JSON.stringify(feedback.message?.content ?? feedback);
      }

      try {
        data.feedback = JSON.parse(feedbackText);
      } catch (err) {
        data.feedback = { raw: feedbackText } as any;
      }

      await kv.set(`resume:${uuid}`, JSON.stringify(data));
      setStatusText('Analysis complete! Redirecting to results...');
      console.log({ data });
      navigate(`/resume/${uuid}`);
    } 
    
    catch (err: any) {
      const msg = err instanceof Error ? err.message : JSON.stringify(err);
      setStatusText(`Error: ${msg}`);
      console.error('Analyze failed', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const companyName = (formData.get('companyName') as string) ?? null;
    const jobTitle = (formData.get('Jobtitle') as string) ?? null;
    const jobDescription = (formData.get('job-description') as string) ?? null;

    if (!file) {
      setStatusText('Please upload a resume file');
      return;
    }

    if (!auth?.isAuthenticated) {
      setStatusText('Please sign in to analyze your resume');
      return;
    }

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover ">
      <Navbar />
      <section className="main-section">
        <div className="page-heading">
          <h1> Feedback for your dream job</h1>

          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img src="images/resume-scan.gif" className="w-full" />
            </>
          ) : (
            <h2>Upload your resume to get feedback</h2>
          )}

          {statusText.startsWith("Error:") && (
            <p className="text-red-600 text-sm">{statusText}</p>
          )}

          <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8 w-full">
              <div className='form-div'>
                <label htmlFor="companyName">Company Name</label>
                <input type="text" name="companyName" placeholder='Company Name' />
              </div>

              <div className='form-div'>
                <label htmlFor="Jobtitle">Job Title Name</label>
                <input type="text" name="Jobtitle" placeholder='Job Title Name' />
              </div>

              <div className='form-div'>
                <label htmlFor="job-description">Job Description</label>
                <textarea rows={5} name="job-description" placeholder='Job Description' />
              </div>

              <div className='form-div'>
                <label htmlFor="uploader">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>

              {auth?.isAuthenticated ? (
                <button className="primary-button" type="submit" disabled={isProcessing}>
                  {isProcessing ? "Analyzing..." : "Analyze Resume"}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button type="button" className="primary-button" onClick={() => auth.signIn()}>
                    Sign in with Puter to analyze
                  </button>
                  <p className="text-sm text-gray-500">or click Analyze after signing in</p>
                </div>
              )}
            </form>
        </div>
      </section>
    </main>
  );
};

export default Upload;
