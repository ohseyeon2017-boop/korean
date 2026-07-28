import React from "react";
import { X, Award, Star, Sparkles, Check } from "lucide-react";
import { Sticker } from "../types";

interface StickerBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  stickers: Sticker[];
  studentName: string;
  totalStars: number;
  onSpeak: (text: string) => void;
}

export const StickerBoardModal: React.FC<StickerBoardModalProps> = ({
  isOpen,
  onClose,
  stickers,
  studentName,
  totalStars,
  onSpeak,
}) => {
  if (!isOpen) return null;

  const unlockedCount = stickers.filter((s) => s.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white/80 backdrop-blur-2xl rounded-[36px] border border-white/90 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3.5 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white border border-rose-400 flex items-center justify-center text-2xl shadow-md">
              💮
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-1.5">
                참 잘했어요! 칭찬 스티커판
                <Sparkles className="w-5 h-5 text-amber-400 fill-amber-300" />
              </h3>
              <p className="text-xs font-bold text-slate-600">
                {studentName} 학생이 차곡차곡 모은 소중한 칭찬 도장이에요!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white/60 hover:bg-white text-slate-800 rounded-full border border-white/80 transition-all shadow-xs"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stats Summary Banner */}
        <div className="grid grid-cols-2 gap-3 mb-4 shrink-0">
          <div className="bg-white/70 backdrop-blur-md p-3.5 rounded-2xl border border-white/90 flex items-center gap-3 shadow-2xs">
            <Award className="w-8 h-8 text-rose-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-500">획득한 스티커</div>
              <div className="text-xl font-black text-slate-900">
                {unlockedCount} / {stickers.length}개
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-md p-3.5 rounded-2xl border border-white/90 flex items-center gap-3 shadow-2xs">
            <Star className="w-8 h-8 text-amber-400 fill-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-500">누적 별 포인트</div>
              <div className="text-xl font-black text-slate-900">{totalStars}개</div>
            </div>
          </div>
        </div>

        {/* Stickers Grid */}
        <div className="overflow-y-auto pr-1 flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stickers.map((stk) => (
              <div
                key={stk.id}
                onClick={() => {
                  if (stk.unlocked) {
                    onSpeak(`칭찬 스티커! ${stk.title}! ${stk.subtitle}`);
                  } else {
                    onSpeak(`아직 모으지 못한 스티커예요. 한글 공부를 더 해서 달성해보세요!`);
                  }
                }}
                className={`group relative rounded-2xl p-4 border text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-between ${
                  stk.unlocked
                    ? "bg-white/80 backdrop-blur-md border-white/90 shadow-md hover:-translate-y-1 hover:shadow-lg"
                    : "bg-slate-100/50 border-slate-200 opacity-50 grayscale"
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-xs mb-2 border-2 ${
                    stk.unlocked ? stk.badgeBg + " border-white text-white" : "bg-slate-300 border-slate-400 text-slate-500"
                  }`}
                >
                  {stk.icon}
                </div>

                <div className="font-black text-sm text-slate-900 mb-0.5">{stk.title}</div>
                <div className="text-[11px] font-medium text-slate-600 line-clamp-2">{stk.subtitle}</div>

                {stk.unlocked && (
                  <div className="mt-2 text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 border border-emerald-200">
                    <Check className="w-3 h-3" />
                    <span>달성 완료</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Audio Cheering Button */}
        <div className="mt-4 pt-3 border-t border-slate-200/80 shrink-0 text-center">
          <button
            onClick={() =>
              onSpeak(
                `우와! ${studentName} 학생은 벌써 스티커를 ${unlockedCount}개나 모았어요! 한글 공부를 정말 잘하고 있어요!`
              )
            }
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-black text-sm rounded-2xl shadow-md shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>선생님 칭찬 응원 듣기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
