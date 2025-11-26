import { useState, useRef, useCallback } from 'react';

const MOCK_TRANSCRIPT_RESULT = "Hi, my name is Giulia Bianchi. I have been working as a Senior Frontend Developer for the last 5 years. I specialize in React, TypeScript, and modern CSS frameworks like Tailwind. Before that, I worked at Tech Solutions for 2 years as a Junior Developer. I have a degree in Computer Science from Politecnico di Milano. I'm looking for a role where I can lead a small team and architect scalable web applications.";

interface UseVoiceRecorderReturn {
  isRecording: boolean;
  recordingTime: number;
  transcript: string | null;
  permissionError: string | null;
  isProcessingSTT: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  resetRecording: () => void;
}

// Type definition for Web Speech API
interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

export const useVoiceRecorder = (): UseVoiceRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isProcessingSTT, setIsProcessingSTT] = useState(false);
  
  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null); // For SpeechRecognition
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const realTimeTranscriptRef = useRef<string>("");

  const startRecording = useCallback(async () => {
    setPermissionError(null);
    setTranscript(null);
    realTimeTranscriptRef.current = "";
    
    // Feature detection
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setPermissionError("Audio recording is not supported in this browser.");
      return;
    }

    try {
      // 1. Visual Recording (MediaRecorder) - keeps the microphone active and visual
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      // 2. Real Transcription (Web Speech API)
      const SpeechRecognition = (window as unknown as IWindow).SpeechRecognition || (window as unknown as IWindow).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = navigator.language || 'en-US'; // Detect user language (it-IT or en-US)
        
        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          // We append final results to our ref
          if (finalTranscript) {
             realTimeTranscriptRef.current += (" " + finalTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error", event.error);
          // Don't block the UI, just fall back silently or keep recording
        };

        recognitionRef.current = recognition;
        recognition.start();
      } else {
        console.warn("Web Speech API not supported in this browser. Will fall back to Mock.");
      }

      // 3. UI State
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (err: any) {
      console.error("Microphone access denied:", err);
      setIsRecording(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionError("Microphone access denied. Please check browser settings.");
      } else {
        setPermissionError("Could not start recording.");
      }
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!isRecording) return;

    // Stop Media Recorder (Audio Stream)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); 
      mediaRecorderRef.current = null;
    }
    
    // Stop Speech Recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRecording(false);
    setIsProcessingSTT(true);

    // Processing Delay for UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    // DECISION: Use Real Transcript if available, otherwise Mock
    const capturedText = realTimeTranscriptRef.current.trim();
    
    if (capturedText.length > 5) {
      // Use the REAL text spoken by the user
      setTranscript(capturedText);
    } else {
      // Fallback if user didn't speak or browser API failed
      console.info("No speech detected or API unavailable. Using Mock Data.");
      setTranscript(MOCK_TRANSCRIPT_RESULT);
    }
    
    setIsProcessingSTT(false);
  }, [isRecording]);

  const resetRecording = useCallback(() => {
    setTranscript(null);
    setRecordingTime(0);
    setPermissionError(null);
    setIsProcessingSTT(false);
    realTimeTranscriptRef.current = "";
  }, []);

  return {
    isRecording,
    recordingTime,
    transcript,
    permissionError,
    isProcessingSTT,
    startRecording,
    stopRecording,
    resetRecording
  };
};