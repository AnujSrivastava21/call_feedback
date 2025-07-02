'use client';

import React, { useRef, useState, useEffect } from 'react';

type Props = {
  file: File;
};

const AudioPlayer: React.FC<Props> = ({ file }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);

    // ✅ Cleanup: revoke object URL on unmount or file change
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  // ✅ Don't render anything if no file or no URL
  if (!file || !url) return null;

  return (
    <div className="my-4">
      <audio
        ref={audioRef}
        src={url}
        controls
        className="w-full mt-2"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        Your browser does not support the audio element.
      </audio>
      <button
        className="mt-2 px-4 py-1 bg-blue-500 text-white rounded"
        onClick={togglePlay}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
};

export default AudioPlayer;
