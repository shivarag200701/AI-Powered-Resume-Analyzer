import React from "react";
import Navbar from "~/components/Navbar";
import { useState } from "react";
import type { FormEvent } from "react";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2image";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "constants/index";

const upload = () => {
  const { auth, ai, fs, isLoading, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const handleFileSelect = (file: File) => {
    setFile(file);
  };

  const handleAnalyze = async (
    companyName: string,
    jobTitle: string,
    jobDescription: string,
    file: File
  ) => {
    setIsProcessing(true);
    setStatusText("Uploading the file.....");
    try {
      const uploadedFile = await fs.upload([file]);

      if (!uploadedFile) {
        setStatusText("Error:failed to upload");
        return;
      }

      setStatusText("Coverting to image.....");
      const imageFile = await convertPdfToImage(file);
      if (!imageFile.file) {
        setStatusText("Error:failed to convert to image");
        return;
      }
      setStatusText("Uploading the image.....");
      const uploadedImage = await fs.upload([imageFile.file]);
      if (!uploadedImage) {
        setStatusText("Error:failed to upload image");
        return;
      }

      setStatusText("Generating  data......");

      const uuid = generateUUID();

      const data = {
        uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage.path,
        companyName,
        jobTitle,
        jobDescription,
        feedback: "",
      };
      await kv.set(`resume:${uuid}`, JSON.stringify(data));
      setStatusText("Analyzing the resume.....");

      //AI analysis
      const feedback = await ai.feedback(
        uploadedFile.path,
        prepareInstructions({ jobTitle, jobDescription })
      );
      console.log("feedback", feedback);

      if (!feedback) {
        setStatusText("Error:failed to analyze the resume");
        return;
      }

      const feedbackText =
        typeof feedback.message.content === "string"
          ? feedback.message.content
          : feedback.message.content[0].text;

      data.feedback = JSON.parse(feedbackText);
      await kv.set(`resume:${uuid}`, JSON.stringify(data));
      setStatusText("Analysis complete, redirecting to resume page.....");
      console.log("uuid", uuid);

      navigate(`/resume/${uuid}`);
    } catch (error) {
      setStatusText("Error:failed to analyze the resume");
      console.log("error", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) return;

    handleAnalyze(companyName, jobTitle, jobDescription, file);
  };
  return (
    <main className="bg-[url('/public/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart feedback for your dream job</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img src="/images/resume-scan.gif" className="w-full" />
            </>
          ) : (
            <h2>Drop your resume for an ATS score and improvement tips</h2>
          )}
          {!isProcessing && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  name="company-name"
                  placeholder="Company Name"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input type="text" name="job-title" placeholder="Job Title" />
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  rows={5}
                  name="job-description"
                  placeholder="Job Description"
                />
              </div>
              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>
              <button type="submit" className="primary-button">
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default upload;
