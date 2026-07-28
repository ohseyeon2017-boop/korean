import React, { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, Sparkles, X, Heart, Award, RefreshCw } from "lucide-react";
import { KoreanSpeechRecognizer } from "../utils/speechUtils";

interface VoiceAITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  initialTargetWord?: string;
  onSpeak: (text: string) => void;
  geminiApiKey: string;
  onEarnStar: () => void;
}

export const VoiceAITutorModal: React.FC<VoiceAITutorModalProps> = ({
  isOpen,
  onClose,
  studentName,
  initialTargetWord = "사과",
  onSpeak,
  geminiApiKey,
  onEarnStar,
}) => {
  const [targetWord, setTargetWord] = useState(initialTargetWord);
  const [isListening, setIsListening] = useState(false);
  const [speechText, setSpeechText] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const speechRecognizer = new KoreanSpeechRecognizer();

  useEffect(() => {
    if (initialTargetWord) {
      setTargetWord(initialTargetWord);
    }
  }, [initialTargetWord]);

  if (!isOpen) return null;

  const handleStartListening = () => {
    setErrorMessage("");
    setSpeechText("");
    setAiResponse("");

    if (!speechRecognizer.isSupported) {
      setErrorMessage("이 브라우저에서는 음성 인식을 지원하지 않거나 마이크 권한이 필요합니다.");
      return;
    }

    setIsListening(true);
    speechRecognizer.startListening(
      (text) => {
        setSpeechText(text);
        setIsListening(false);
        // Request Gemini AI feedback
        fetchAIFeedback(text);
      },
      (err) => {
        setIsListening(false);
        setErrorMessage(err);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const handleStopListening = () => {
    setIsListening(false);
    speechRecognizer.stopListening();
  };

  const fetchAIFeedback = async (recognizedSpeech: string) => {
    setIsLoadingAi(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/gemini/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName,
          targetWord,
          userSpeech: recognizedSpeech,
          actionType: "speech_practice",
          apiKey: geminiApiKey,
        }),
      });

      const data = await res.json();

      if (data.success && data.feedback) {
        setAiResponse(data.feedback);
        onSpeak(data.feedback);
        onEarnStar();
      } else if (data.fallbackFeedback) {
        setAiResponse(data.fallbackFeedback);
        onSpeak(data.fallbackFeedback);
        onEarnStar();
      } else {
        const fallback = `${studentName} 학생, '${targetWord}' 소리를 아주 예쁘고 정확하게 말했네요! 참 잘했어요! 🌟`;
        setAiResponse(fallback);
        onSpeak(fallback);
        onEarnStar();
      }
    } catch (err: any) {
      console.error("AI Feedback Error:", err);
      const fallback = `${studentName} 학생, 정말 훌륭해요! 소리 내어 도전해줘서 자랑스러워요! 🌟`;
      setAiResponse(fallback);
      onSpeak(fallback);
      onEarnStar();
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white/80 backdrop-blur-2xl rounded-[36px] border border-white/90 shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-white/60 hover:bg-white text-slate-800 rounded-full border border-white/80 transition-all shadow-xs"
        >
          <X className="w-6 h-6" />
        </button>

        {/* AI Tutor Avatar Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-16 h-16 rounded-3xl bg-blue-500 border border-blue-400 text-white shadow-md flex items-center justify-center text-3xl animate-bounce">
            🐥
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-1.5">
              한글 샘 AI
              <Sparkles className="w-5 h-5 text-amber-400 fill-amber-300" />
            </h3>
            <p className="text-xs font-bold text-slate-600">
              {studentName} 학생과 함께하는 소리 연습시간!
            </p>
          </div>
        </div>

        {/* Target Word Display & Change Input */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-white/90 text-center shadow-xs my-3">
          <span className="text-xs font-bold text-slate-600">연습할 글자/단어:</span>
          <div className="flex items-center justify-center gap-2 mt-1">
            <input
              type="text"
              value={targetWord}
              onChange={(e) => setTargetWord(e.target.value)}
              className="text-4xl font-black text-slate-900 text-center w-40 bg-white/90 border border-slate-300 rounded-2xl px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={() => onSpeak(targetWord)}
              className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-sm transition-transform active:scale-95"
              title="소리 들려주기"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Microphone Interactive Area */}
        <div className="flex flex-col items-center justify-center my-6 text-center">
          {isListening ? (
            <button
              onClick={handleStopListening}
              className="w-24 h-24 rounded-full bg-rose-500 border-4 border-rose-200 flex items-center justify-center shadow-xl animate-pulse text-white transition-transform active:scale-95"
            >
              <MicOff className="w-12 h-12" />
            </button>
          ) : (
            <button
              onClick={handleStartListening}
              className="w-24 h-24 rounded-full bg-blue-500 hover:bg-blue-600 border-4 border-blue-200 flex items-center justify-center shadow-xl shadow-blue-500/30 text-white transition-all active:scale-95 hover:rotate-3"
            >
              <Mic className="w-12 h-12 text-amber-300" />
            </button>
          )}

          <p className="text-sm font-black text-slate-800 mt-3">
            {isListening
              ? "듣고 있어요! 소리 내어 또박또박 말해보세요..."
              : "마이크 버튼을 누르고 크게 말해보세요!"}
          </p>

          {/* Recognized Speech Bubble */}
          {speechText && (
            <div className="mt-3 bg-blue-50 text-blue-900 px-4 py-2 rounded-2xl border border-blue-200 text-sm font-bold shadow-2xs">
              학생 음성 인지: "{speechText}"
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-3 bg-rose-50 text-rose-900 px-4 py-2 rounded-2xl border border-rose-200 text-xs font-bold">
              {errorMessage}
            </div>
          )}
        </div>

        {/* AI Tutor Speech Response Box */}
        {isLoadingAi ? (
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-white flex items-center justify-center gap-2 text-slate-800 font-bold text-sm">
            <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
            <span>선생님이 다정한 피드백을 생각하고 있어요...</span>
          </div>
        ) : aiResponse ? (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-white shadow-md relative animate-fade-in">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-slate-800 flex items-center gap-1">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                한글 샘 선생님의 피드백
              </span>
              <button
                onClick={() => onSpeak(aiResponse)}
                className="text-xs bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg text-slate-800 font-bold flex items-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>다시 듣기</span>
              </button>
            </div>
            <p className="text-base font-bold text-slate-900 leading-relaxed">
              "{aiResponse}"
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
