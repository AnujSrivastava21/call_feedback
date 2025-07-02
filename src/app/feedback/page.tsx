'use client';

import React, { useState } from 'react';
import AudioUpload from '@/components/AudioUpload';
import AudioPlayer from '@/components/AudioPlayer';
import FeedbackDisplay from '@/components/FeedbackDisplay';

export default function FeedbackPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setFeedback(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/analyze-call', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();

      setFeedback(data);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to analyze audio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-800">
        🎧 Upload Audio for AI Feedback
      </h1>

      <AudioUpload onFileSelect={setFile} />
      {file && <AudioPlayer file={file} />}

      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          className={`mt-4 px-6 py-2 text-lg rounded-md transition duration-200 
            ${!file || loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-md'}
          `}
        >
          {loading ? '⏳ Analyzing...' : '🚀 Analyze Audio'}
        </button>
      </div>

      {feedback && <FeedbackDisplay data={feedback} />}
    </div>
  );
}
