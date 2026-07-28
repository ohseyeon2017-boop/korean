import React, { useState } from "react";
import { Volume2, HelpCircle, CheckCircle, XCircle, Sparkles, RefreshCw, Trophy } from "lucide-react";
import { QUIZ_ITEMS } from "../data/hangulData";

interface QuizSectionProps {
  onSpeak: (text: string) => void;
  onQuizComplete: (isCorrect: boolean) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ onSpeak, onQuizComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuiz = QUIZ_ITEMS[currentIndex];

  const handleOptionClick = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
    onSpeak(currentQuiz.options[index]);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) {
      onSpeak("정답을 골라주세요!");
      return;
    }

    setIsSubmitted(true);
    const isCorrect = selectedOption === currentQuiz.correctIndex;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      onSpeak(`정답이에요! 참 잘했어요! '${currentQuiz.targetWord}' 맞혔습니다! 🌟`);
      onQuizComplete(true);
    } else {
      onSpeak(`아쉬워요! 정답은 '${currentQuiz.targetWord}' 예요. 다 함께 다시 도전해봐요!`);
      onQuizComplete(false);
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    if (currentIndex < QUIZ_ITEMS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Loop back or reset
      setCurrentIndex(0);
    }
  };

  return (
    <section className="bg-white/60 backdrop-blur-xl rounded-[32px] p-6 border border-white/80 shadow-xl my-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/80 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/80 border border-white flex items-center justify-center text-xl shadow-xs">
            🧠
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">한글 낱말 퀴즈 게임</h2>
            <p className="text-xs font-bold text-slate-600">
              소리와 그림 힌트를 듣고 알맞은 글자를 맞춰보세요! (진행: {currentIndex + 1} / {QUIZ_ITEMS.length})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-4 py-2 bg-white/70 backdrop-blur-md text-slate-800 rounded-full border border-white/90 font-black text-xs shadow-2xs">
          <Trophy className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>맞힌 개수: {score}개</span>
        </div>
      </div>

      {/* Quiz Main Card */}
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-md rounded-[28px] p-6 border border-white/90 shadow-md flex flex-col items-center">
        {/* Audio Prompt Button */}
        <button
          onClick={() => onSpeak(currentQuiz.questionAudioText)}
          className="w-full py-3 px-4 bg-blue-50 hover:bg-blue-100 text-slate-800 font-bold text-base rounded-2xl border border-blue-200 flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-98 mb-4"
        >
          <Volume2 className="w-6 h-6 text-blue-500 animate-bounce" />
          <span>🔊 질문 다시 듣기</span>
        </button>

        {/* Emoji Hint */}
        <div className="text-7xl my-2 p-5 bg-white rounded-3xl border border-slate-200 shadow-inner transform hover:scale-105 transition-transform">
          {currentQuiz.emojiHint}
        </div>

        {/* 4 Options Grid */}
        <div className="grid grid-cols-2 gap-3 w-full my-4">
          {currentQuiz.options.map((option, idx) => {
            let btnStyle = "bg-white/70 backdrop-blur-md text-slate-800 border-white/90 hover:bg-white";

            if (selectedOption === idx) {
              btnStyle = "bg-blue-500 text-white border-blue-600 ring-4 ring-blue-200/80 shadow-md scale-102 font-black";
            }

            if (isSubmitted) {
              if (idx === currentQuiz.correctIndex) {
                btnStyle = "bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200/80 shadow-md font-black";
              } else if (selectedOption === idx && idx !== currentQuiz.correctIndex) {
                btnStyle = "bg-rose-500 text-white border-rose-600 opacity-80 font-black";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isSubmitted}
                className={`py-4 px-3 rounded-2xl border-2 text-2xl font-black transition-all flex items-center justify-center gap-2 active:scale-95 shadow-2xs ${btnStyle}`}
              >
                <span>{option}</span>
                {isSubmitted && idx === currentQuiz.correctIndex && (
                  <CheckCircle className="w-6 h-6 text-amber-300" />
                )}
                {isSubmitted && selectedOption === idx && idx !== currentQuiz.correctIndex && (
                  <XCircle className="w-6 h-6 text-white" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="w-full mt-2 flex items-center justify-center">
          {!isSubmitted ? (
            <button
              onClick={handleCheckAnswer}
              disabled={selectedOption === null}
              className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-black text-base rounded-2xl shadow-md shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>정답 확인하기</span>
            </button>
          ) : (
            <button
              onClick={handleNextQuiz}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-base rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5 text-white" />
              <span>다음 문제 풀기</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
