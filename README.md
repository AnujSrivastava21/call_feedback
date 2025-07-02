# Call Analyzer

A brief description of what your project does and why it exists.

## 🔧 Tech Stack

- React / Next.js
- TypeScript
- Node.js / Express
- Whisper / Google Speech-to-Text
- MongoDB / MySQL

## 📁 Project Structure
├── app/                        # Main application routes (Next.js app directory)
│   ├── page.tsx               # Main landing page
│   └── api/
│       └── analyze-call/      # API route for audio analysis
│           └── route.ts
├── components/                # Reusable UI components
│   ├── AudioUpload.tsx        # Drag-and-drop or file input for audio
│   ├── AudioPlayer.tsx        # Audio playback UI
│   └── FeedbackDisplay.tsx    # Displays feedback after transcription
├── lib/                       # Core logic and utilities
│   ├── analyzeAudio.ts        # Rule-based scoring and feedback generation
│   └── utils.ts               # Utility/helper functions
├── public/                    # Static files
│   └── sample.mp3             # Sample audio file (optional)
├── styles/                    # CSS modules or global styles
│   └── *.module.css
├── transcribe.py              # (Optional) Whisper-based transcription logic
├── README.md
├── package.json
└── tsconfig.json


