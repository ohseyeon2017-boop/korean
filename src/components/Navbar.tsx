import React, { useState } from "react";
import { Star, Award, Settings, Volume2, VolumeX, Sparkles, UserCheck, RefreshCw } from "lucide-react";
import { StudentProfile } from "../types";

interface NavbarProps {
  profile: StudentProfile;
  onUpdateName: (newName: string) => void;
  onOpenStickerBoard: () => void;
  onOpenSettings: () => void;
  onOpenAITutor: () => void;
  onSyncGoogleSheets: () => void;
  isSyncingGas: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  onUpdateName,
  onOpenStickerBoard,
  onOpenSettings,
  onOpenAITutor,
  onSyncGoogleSheets,
  isSyncingGas,
  soundEnabled,
  onToggleSound,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(profile.name);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onUpdateName(tempName.trim());
      setIsEditingName(false);
    }
  };

  return (
    <header className="bg-white/40 backdrop-blur-xl border-b border-white/60 px-4 py-3.5 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Student Welcome */}
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 flex items-center justify-center shadow-xs text-2xl transform hover:scale-105 transition-transform">
            🏫
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                한빛 한글 <span className="text-blue-500">AI 튜터</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold border border-blue-200">
                  초등 학습
                </span>
              </h1>
            </div>

            {/* Student Name Display / Inline Edit */}
            <div className="flex items-center gap-1.5 mt-0.5 text-sm font-bold text-slate-600">
              <span>안녕!</span>
              {isEditingName ? (
                <form onSubmit={handleNameSubmit} className="flex items-center gap-1">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="px-2.5 py-0.5 rounded-xl border border-blue-400 bg-white/90 text-xs font-bold text-slate-900 w-24 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-0.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-bold shadow-xs"
                  >
                    확인
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => {
                    setTempName(profile.name);
                    setIsEditingName(true);
                  }}
                  className="px-2.5 py-0.5 bg-white/60 hover:bg-white/90 backdrop-blur-md rounded-xl border border-white/80 text-slate-800 flex items-center gap-1 transition-all"
                  title="학생 이름 수정하기"
                >
                  <span className="underline decoration-blue-500 decoration-2 underline-offset-2">
                    {profile.name}
                  </span>
                  <span className="text-xs text-slate-500">✏️</span>
                </button>
              )}
              <span>학생 ⭐</span>
            </div>
          </div>
        </div>

        {/* Quick Action Center: AI Tutor Call, Star Counter, Sticker Board, Google Sheets Sync, Settings */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* AI Voice Tutor Main Button */}
          <button
            onClick={onOpenAITutor}
            className="px-4 py-2.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-black text-sm shadow-md shadow-blue-500/20 border border-blue-400/50 flex items-center gap-2 transition-all transform active:scale-95"
            title="한글 샘 AI 선생님과 음성 대화하기"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI 한글 선생님</span>
          </button>

          {/* Star Point Display */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/80 text-slate-800 font-black text-sm shadow-xs">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400 animate-spin-slow" />
            <span>별 {profile.stars}개</span>
          </div>

          {/* Sticker Board Trigger Button */}
          <button
            onClick={onOpenStickerBoard}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 hover:bg-white/80 backdrop-blur-md border border-white/80 text-slate-800 font-black text-sm shadow-xs transition-all active:scale-95"
            title="칭찬 스티커판 보기"
          >
            <Award className="w-5 h-5 text-rose-500" />
            <span>스티커판 ({profile.unlockedStickerIds.length}개)</span>
          </button>

          {/* Google Sheets Sync Button */}
          <button
            onClick={onSyncGoogleSheets}
            disabled={isSyncingGas}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/60 hover:bg-white/80 backdrop-blur-md border border-white/80 text-slate-700 font-bold text-xs shadow-xs transition-all active:scale-95 disabled:opacity-50"
            title="구글 시트로 학습 기록 저장하기"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-600 ${isSyncingGas ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">시트 저장</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2.5 rounded-full bg-white/60 hover:bg-white/80 backdrop-blur-md border border-white/80 text-slate-700 shadow-xs transition-all"
            title={soundEnabled ? "음성/소리 끄기" : "음성/소리 켜기"}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-rose-500" />}
          </button>

          {/* Teacher Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-full bg-slate-800 text-white shadow-lg flex items-center justify-center hover:bg-slate-900 transition-all active:scale-95"
            title="교사 설정 및 배포 가이드"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
