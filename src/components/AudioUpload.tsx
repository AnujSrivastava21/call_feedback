// src/components/AudioUpload.tsx

'use client';
import React, { useState } from 'react';

type Props = {
  onFileSelect: (file: File) => void;
};

const AudioUpload: React.FC<Props> = ({ onFileSelect }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValid = file.type === 'audio/mpeg' || file.type === 'audio/wav';
    if (!isValid) {
      alert('Please upload a .mp3 or .wav file');
      return;
    }

    setFileName(file.name);
    onFileSelect(file);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-400 rounded-lg bg-gray-50 w-full">
      <label
        htmlFor="file-upload"
        className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-md shadow-md transition hover:bg-blue-700 hover:shadow-lg"
      >
        🎵 Choose Audio File (.mp3 / .wav)
      </label>

      <input
        id="file-upload"
        type="file"
        accept=".mp3,.wav"
        onChange={handleFileChange}
        className="hidden"
      />

      {fileName && (
        <p className="mt-3 text-green-600 text-sm">
          ✅ Selected: <span className="font-medium">{fileName}</span>
        </p>
      )}
    </div>
  );
};

export default AudioUpload;
