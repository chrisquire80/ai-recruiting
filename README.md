# SCABBIO - Next-Gen HR Tech Platform

SCABBIO is an enterprise-grade recruiting and talent management platform powered by Artificial Intelligence. It streamlines the hiring process through Voice-to-CV transcription, automated skill gap analysis, employability scoring, and intelligent job matching.

## 🚀 Features

- **Voice CV Wizard**: Converts spoken candidate introductions into structured CV data (JSON) using Google Gemini AI.
- **Skill Matrix**: Visualizes skill gaps between candidates and job requirements using interactive Radar charts.
- **Employability Scoring**: Calculates a weighted score based on customizable factors (Market Demand, Recent Activity, etc.) with predictive grading.
- **AI Job Matching**: Deterministic matching engine combined with Generative AI insights to evaluate candidate fit for specific roles.

## 🛠 Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 6
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS + Lucide Icons
- **Charts**: Recharts
- **AI Integration**: Google GenAI SDK (`@google/genai`)

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Gemini API Key**: Required for AI features (Voice CV & Job Matching analysis).

## ⚙️ Setup & Installation

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Configuration**
    Create a `.env.local` file in the root directory and add your Google Gemini API Key:
    ```env
    VITE_GEMINI_API_KEY=your_actual_api_key_here
    ```
    > **Note**: You can obtain an API key from [Google AI Studio](https://aistudio.google.com/).

3.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The application will launch at `http://0.0.0.0:3000`.

## 🎤 Permissions

This application requires access to the **Microphone** to function correctly (specifically for the Voice CV module).
- Ensure your browser allows microphone access for `localhost`.
- If access is denied, the application will show a warning banner and fallback to mock data mode.

## 🏗 Project Structure

- `src/components`: UI components organized by feature and reusable atoms (`ui/`).
- `src/hooks`: Custom hooks (e.g., `useVoiceRecorder`).
- `src/services`: API integrations (Gemini AI).
- `src/utils`: Business logic helpers (Scoring algorithms, Gap analysis).
- `src/types.ts`: TypeScript definitions for domain models.

---

**Developed for the Google Gemini Developer Competition.**
