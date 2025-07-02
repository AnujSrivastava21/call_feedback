'use client';
import React from 'react';

type FeedbackData = {
  transcript: string;
  scores?: {
    [key: string]: number;
  };
  overallFeedback?: string;
  observation?: string;
};

type Props = {
  data: FeedbackData;
};

const FeedbackDisplay: React.FC<Props> = ({ data }) => {
  const {
    transcript,
    scores = {}, // ✅ Avoid undefined crash
    overallFeedback = '',
    observation = '',
  } = data;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg space-y-6 mt-8 border">
      {/* 📝 Transcript */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-1">📝 Transcript</h2>
        <p className="text-gray-700">{transcript}</p>
      </div>

      {/* ✅ Scores (if available) */}
      {Object.keys(scores).length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">✅ Parameter Scores</h2>
          <ul className="space-y-2">
            {Object.entries(scores).map(([key, value]) => (
              <li key={key} className="text-gray-700">
                <div className="flex justify-between items-center">
                  <span>{key}</span>
                  <span className="font-medium">{value}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 📝 Overall Feedback */}
      {overallFeedback && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">📝 Overall Feedback</h2>
          <p className="text-gray-700">{overallFeedback}</p>
        </div>
      )}

      {/* 🔍 Observation */}
      {observation && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">🔍 Observation</h2>
          <p className="text-gray-700">{observation}</p>
        </div>
      )}
    </div>
  );
};

export default FeedbackDisplay;
