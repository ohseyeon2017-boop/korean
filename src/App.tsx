import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { CardSection } from "./components/CardSection";
import { HandwritingCanvas } from "./components/HandwritingCanvas";
import { QuizSection } from "./components/QuizSection";
import { VoiceAITutorModal } from "./components/VoiceAITutorModal";
import { StickerBoardModal } from "./components/StickerBoardModal";
import { TeacherSettingsModal } from "./components/TeacherSettingsModal";

import { StudentProfile, AppSettings, Sticker, LearningLog } from "./types";
import { INITIAL_STICKERS } from "./data/hangulData";
import { speakText } from "./utils/speechUtils";
import { sendLearningLogToGAS } from "./utils/gasSyncUtils";
import { Sparkles, Star, Award, CheckCircle, RefreshCw, Volume2, Heart } from "lucide-react";

const STORAGE_KEY_PROFILE = "HANGUL_AI_STUDENT_PROFILE_V1";
const STORAGE_KEY_SETTINGS = "HANGUL_AI_TEACHER_SETTINGS_V1";
const STORAGE_KEY_STICKERS = "HANGUL_AI_STICKERS_V1";

export default function App() {
  // 1. Profile State
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      name: "지우",
      stars: 3,
      unlockedStickerIds: ["stk_1"],
      learnedCardIds: [],
      handwritingCount: 0,
      quizCorrectCount: 0,
      quizTotalCount: 0,
      studyStartTime: Date.now(),
    };
  });

  // 2. Settings State
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      geminiApiKey: "",
      gasWebAppUrl: "",
      ttsSpeed: 0.85,
      ttsPitch: 1.1,
    };
  });

  // 3. Stickers State
  const [stickers, setStickers] = useState<Sticker[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STICKERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return INITIAL_STICKERS;
  });

  // UI Navigation & Modals
  const [selectedHandwritingText, setSelectedHandwritingText] = useState("사과");
  const [voiceTargetWord, setVoiceTargetWord] = useState("사과");

  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [isStickerBoardOpen, setIsStickerBoardOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSyncingGas, setIsSyncingGas] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save State to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STICKERS, JSON.stringify(stickers));
  }, [stickers]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Speak helper
  const handleSpeak = (text: string) => {
    if (!soundEnabled) return;
    speakText(text, {
      rate: settings.ttsSpeed,
      pitch: settings.ttsPitch,
    });
  };

  // Unlock Sticker Helper
  const unlockSticker = (stickerId: string) => {
    setStickers((prev) =>
      prev.map((s) => {
        if (s.id === stickerId && !s.unlocked) {
          const unlockedStk = { ...s, unlocked: true, unlockedAt: new Date().toISOString() };
          showToast(`🎉 새로운 칭찬 스티커 획득! [${s.title}]`);
          handleSpeak(`축하해요! 새로운 칭찬 스티커 [${s.title}]를 받았어요!`);
          return unlockedStk;
        }
        return s;
      })
    );

    setProfile((prev) => {
      if (!prev.unlockedStickerIds.includes(stickerId)) {
        return {
          ...prev,
          unlockedStickerIds: [...prev.unlockedStickerIds, stickerId],
        };
      }
      return prev;
    });
  };

  // Earn Star Helper
  const handleEarnStar = (amount = 1) => {
    setProfile((prev) => {
      const newStars = prev.stars + amount;
      if (newStars >= 10) {
        unlockSticker("stk_6"); // 별 10개 모음 스티커
      }
      return { ...prev, stars: newStars };
    });
  };

  // Card Learned
  const handleMarkCardLearned = (cardId: string) => {
    setProfile((prev) => {
      if (!prev.learnedCardIds.includes(cardId)) {
        const updated = [...prev.learnedCardIds, cardId];
        if (updated.length >= 5) {
          unlockSticker("stk_2"); // 목소리 왕
        }
        if (updated.length >= 10) {
          unlockSticker("stk_7"); // 열정 가득왕
        }
        return {
          ...prev,
          learnedCardIds: updated,
          stars: prev.stars + 1,
        };
      }
      return prev;
    });
  };

  // Voice Practice Call
  const handleOpenVoicePractice = (targetText: string) => {
    setVoiceTargetWord(targetText);
    setIsAITutorOpen(true);
  };

  // Select Handwriting Call
  const handleSelectHandwriting = (targetText: string) => {
    setSelectedHandwritingText(targetText);
    const element = document.getElementById("handwriting-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Complete Handwriting
  const handleCompleteHandwriting = (text: string) => {
    setProfile((prev) => {
      const newCount = prev.handwritingCount + 1;
      if (newCount >= 1) {
        unlockSticker("stk_3"); // 멋진 필기왕
      }
      return {
        ...prev,
        handwritingCount: newCount,
        stars: prev.stars + 1,
      };
    });
  };

  // Complete Quiz
  const handleQuizComplete = (isCorrect: boolean) => {
    setProfile((prev) => {
      const newTotal = prev.quizTotalCount + 1;
      const newCorrect = prev.quizCorrectCount + (isCorrect ? 1 : 0);

      if (newCorrect >= 3) {
        unlockSticker("stk_4"); // 한글 퀴즈 박사
      }

      return {
        ...prev,
        quizTotalCount: newTotal,
        quizCorrectCount: newCorrect,
        stars: prev.stars + (isCorrect ? 1 : 0),
      };
    });
  };

  // Sync Google Sheets (GAS)
  const handleSyncGoogleSheets = async () => {
    if (!settings.gasWebAppUrl) {
      showToast("⚙️ [교사 설정]에서 구글 시트 Web App URL을 먼저 등록해주세요!");
      setIsSettingsOpen(true);
      return;
    }

    setIsSyncingGas(true);

    const durationMinutes = Math.max(1, Math.round((Date.now() - profile.studyStartTime) / (1000 * 60)));
    const accuracyStr = profile.quizTotalCount > 0
      ? `${Math.round((profile.quizCorrectCount / profile.quizTotalCount) * 100)}% (${profile.quizCorrectCount}/${profile.quizTotalCount})`
      : "퀴즈 미실시";

    const logData: LearningLog = {
      studentName: profile.name,
      date: new Date().toLocaleString("ko-KR"),
      learnedWordsCount: profile.learnedCardIds.length,
      quizAccuracy: accuracyStr,
      handwritingCount: profile.handwritingCount,
      durationMinutes,
      timestamp: Date.now(),
    };

    const result = await sendLearningLogToGAS(settings.gasWebAppUrl, logData);
    setIsSyncingGas(false);

    if (result.success) {
      showToast("✅ 구글 시트에 학습 기록이 저장되었습니다!");
      handleSpeak(`${profile.name} 학생의 오늘 공부 기록이 선생님 구글 시트에 저장되었어요!`);
    } else {
      showToast(`❌ 전송 실패: ${result.message}`);
    }
  };

  // Reset Progress
  const handleResetProgress = () => {
    setProfile({
      name: profile.name,
      stars: 0,
      unlockedStickerIds: ["stk_1"],
      learnedCardIds: [],
      handwritingCount: 0,
      quizCorrectCount: 0,
      quizTotalCount: 0,
      studyStartTime: Date.now(),
    });
    setStickers(INITIAL_STICKERS);
    showToast("학습 기록 및 스티커판이 초기화되었습니다.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100 text-slate-800 font-sans pb-16 selection:bg-blue-300 relative overflow-hidden">
      {/* Background Ambient Glowing Orbs for Frosted Glass Effect */}
      <div className="fixed top-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-300 opacity-25 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-yellow-300 opacity-25 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-300 opacity-15 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Top Classroom Navigation Bar */}
      <Navbar
        profile={profile}
        onUpdateName={(newName) => setProfile((prev) => ({ ...prev, name: newName }))}
        onOpenStickerBoard={() => setIsStickerBoardOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAITutor={() => setIsAITutorOpen(true)}
        onSyncGoogleSheets={handleSyncGoogleSheets}
        isSyncingGas={isSyncingGas}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-4 space-y-6 relative z-10">
        {/* Banner: Student Learning Progress Dashboard */}
        <section className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[32px] p-6 shadow-xl text-slate-800 transition-all">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/80 border border-white shadow-md flex items-center justify-center text-3xl">
                🐥
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>{profile.name} 학생, 환영해요!</span>
                  <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-bounce" />
                </h2>
                <p className="text-xs sm:text-sm font-bold text-slate-600 mt-0.5">
                  소리를 듣고, 말해보고, 직접 쓰면서 한글을 재미있게 배워보아요!
                </p>
              </div>
            </div>

            {/* Quick Stats Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-white/70 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/90 flex items-center gap-2.5 shadow-sm">
                <span className="text-xl">📚</span>
                <div className="text-xs font-black">
                  <div className="text-slate-500">공부한 카드</div>
                  <div className="text-sm text-slate-900 font-black">{profile.learnedCardIds.length}개 완료</div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/90 flex items-center gap-2.5 shadow-sm">
                <span className="text-xl">✍️</span>
                <div className="text-xs font-black">
                  <div className="text-slate-500">따라 쓰기</div>
                  <div className="text-sm text-slate-900 font-black">{profile.handwritingCount}회 성공</div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/90 flex items-center gap-2.5 shadow-sm">
                <span className="text-xl">🧠</span>
                <div className="text-xs font-black">
                  <div className="text-slate-500">퀴즈 맞힘</div>
                  <div className="text-sm text-slate-900 font-black">
                    {profile.quizCorrectCount} / {profile.quizTotalCount}개
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Audio-centric Jamo & Word Cards */}
        <CardSection
          onSpeak={handleSpeak}
          onVoicePractice={handleOpenVoicePractice}
          onSelectHandwriting={handleSelectHandwriting}
          learnedCardIds={profile.learnedCardIds}
          onMarkCardLearned={handleMarkCardLearned}
        />

        {/* Section 2: Interactive Handwriting Canvas */}
        <div id="handwriting-section">
          <HandwritingCanvas
            selectedText={selectedHandwritingText}
            onSelectTextChange={(t) => setSelectedHandwritingText(t)}
            onSpeak={handleSpeak}
            onCompleteHandwriting={handleCompleteHandwriting}
          />
        </div>

        {/* Section 3: Elementary Word Quiz Game */}
        <QuizSection onSpeak={handleSpeak} onQuizComplete={handleQuizComplete} />
      </main>

      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900/90 text-white backdrop-blur-xl px-6 py-3.5 rounded-full border border-white/30 shadow-2xl font-black text-sm flex items-center gap-2 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating AI Tutor Voice Call Trigger Button */}
      <button
        onClick={() => setIsAITutorOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-5 py-3.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-xl backdrop-blur-md border border-blue-300/50 transition-all active:scale-95 flex items-center gap-2.5 hover:shadow-2xl"
        title="한글 샘 AI와 소리 내어 연습하기"
      >
        <span className="text-2xl">🎤</span>
        <span className="font-black text-sm hidden sm:inline">AI 선생님과 말해요!</span>
      </button>

      {/* Modals */}
      <VoiceAITutorModal
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
        studentName={profile.name}
        initialTargetWord={voiceTargetWord}
        onSpeak={handleSpeak}
        geminiApiKey={settings.geminiApiKey}
        onEarnStar={() => handleEarnStar(1)}
      />

      <StickerBoardModal
        isOpen={isStickerBoardOpen}
        onClose={() => setIsStickerBoardOpen(false)}
        stickers={stickers}
        studentName={profile.name}
        totalStars={profile.stars}
        onSpeak={handleSpeak}
      />

      <TeacherSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={(newSettings) => setSettings(newSettings)}
        studentName={profile.name}
        onUpdateStudentName={(name) => setProfile((prev) => ({ ...prev, name }))}
        onSpeakTest={(speed, pitch) =>
          speakText(`${profile.name} 학생, 소리 조절 테스트입니다! 참 잘했어요!`, {
            rate: speed,
            pitch: pitch,
          })
        }
        onResetProgress={handleResetProgress}
      />
    </div>
  );
}
