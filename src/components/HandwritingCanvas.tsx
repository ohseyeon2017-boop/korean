import React, { useRef, useState, useEffect } from "react";
import { Eraser, RotateCcw, CheckCircle2, Sparkles, Volume2, Edit3 } from "lucide-react";
import { HANDWRITING_ITEMS } from "../data/hangulData";

interface HandwritingCanvasProps {
  selectedText: string;
  onSelectTextChange: (text: string) => void;
  onSpeak: (text: string) => void;
  onCompleteHandwriting: (text: string) => void;
}

export const HandwritingCanvas: React.FC<HandwritingCanvasProps> = ({
  selectedText,
  onSelectTextChange,
  onSpeak,
  onCompleteHandwriting,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#4F46E5"); // default indigo
  const [brushSize, setBrushSize] = useState(16);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isRainbow, setIsRainbow] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Rainbow color counter
  const rainbowHueRef = useRef(0);

  useEffect(() => {
    clearCanvas();
  }, [selectedText]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setShowCelebration(false);
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawn(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (isRainbow) {
      rainbowHueRef.current = (rainbowHueRef.current + 5) % 360;
      ctx.strokeStyle = `hsl(${rainbowHueRef.current}, 90%, 50%)`;
    } else {
      ctx.strokeStyle = brushColor;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleDone = () => {
    if (!hasDrawn) {
      onSpeak("가이드 선을 따라 글씨를 먼저 손가락이나 마우스로 써주세요!");
      return;
    }

    setShowCelebration(true);
    onSpeak(`우와! ${selectedText} 글씨를 정말 멋지게 따라 썼어요! 칭찬 스티커와 별을 선물로 줄게요! 🌟`);
    onCompleteHandwriting(selectedText);

    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
  };

  return (
    <section className="bg-white/60 backdrop-blur-xl rounded-[32px] p-6 border border-white/80 shadow-xl my-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/80 pb-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/80 border border-white flex items-center justify-center text-xl shadow-xs">
            ✍️
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">한글 따라 쓰기 캔버스</h2>
            <p className="text-xs font-bold text-slate-600">
              흐리게 표시된 가이드선 위에 마우스나 손가락으로 글씨를 따라 적어보세요!
            </p>
          </div>
        </div>

        {/* Quick Speak Target Word */}
        <button
          onClick={() => onSpeak(selectedText)}
          className="px-4 py-2 rounded-full bg-white/70 hover:bg-white/90 text-slate-800 font-bold text-xs flex items-center gap-1.5 shadow-xs border border-white/90 transition-all active:scale-95"
        >
          <Volume2 className="w-4 h-4 text-blue-500" />
          <span>'{selectedText}' 소리듣기</span>
        </button>
      </div>

      {/* Target Word Quick Selection Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        <span className="text-xs font-black text-slate-600 shrink-0">연습 단어 선택:</span>
        {HANDWRITING_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTextChange(item.targetText)}
            className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-black transition-all shrink-0 border ${
              selectedText === item.targetText
                ? "bg-blue-500 text-white border-blue-400 shadow-md shadow-blue-500/20 scale-105"
                : "bg-white/60 hover:bg-white/90 text-slate-700 border-white/80"
            }`}
          >
            {item.targetText}
          </button>
        ))}
      </div>

      {/* Canvas Area Container */}
      <div className="relative max-w-xl mx-auto bg-slate-50/80 backdrop-blur-md rounded-[32px] border-4 border-dashed border-slate-300 shadow-xl overflow-hidden p-3 flex flex-col items-center">
        {/* Canvas Background Crosshair & Faint Text Overlay */}
        <div className="relative w-full h-80 bg-white/60 rounded-[24px] flex items-center justify-center overflow-hidden border border-slate-200">
          {/* Crosshair guide lines (십자선가이드) */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-full h-0.5 bg-slate-200 border-t border-dashed border-slate-300"></div>
            <div className="absolute top-0 bottom-0 w-0.5 bg-slate-200 border-l border-dashed border-slate-300"></div>
          </div>

          {/* Faint Guide Character Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-[140px] font-black text-slate-300/60 tracking-wider">
              {selectedText}
            </span>
          </div>

          {/* Drawing Canvas */}
          <canvas
            ref={canvasRef}
            width={520}
            height={300}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"
          />

          {/* Celebration Animation Overlay */}
          {showCelebration && (
            <div className="absolute inset-0 z-20 bg-blue-500/90 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center text-white animate-bounce rounded-[24px]">
              <Sparkles className="w-16 h-16 text-yellow-300 mb-2 animate-spin-slow" />
              <h3 className="text-3xl font-black">참 잘했어요! 🌟</h3>
              <p className="text-base font-bold text-blue-100 mt-1">
                '{selectedText}' 따라 쓰기 완료! 스티커 & 별 포인트 지급!
              </p>
            </div>
          )}
        </div>

        {/* Toolbar: Colors, Eraser, Clear, Done */}
        <div className="w-full mt-3 p-3 bg-white/70 backdrop-blur-md rounded-2xl border border-white/90 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          {/* Color Palettes */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black text-slate-700">색상:</span>
            {[
              { color: "#3B82F6", label: "파랑" },
              { color: "#F43F5E", label: "빨강" },
              { color: "#10B981", label: "초록" },
              { color: "#F59E0B", label: "주황" },
              { color: "#1E293B", label: "검정" },
            ].map((c) => (
              <button
                key={c.color}
                onClick={() => {
                  setIsRainbow(false);
                  setBrushColor(c.color);
                }}
                className={`w-7 h-7 rounded-full border-2 transition-transform shadow-xs ${
                  !isRainbow && brushColor === c.color ? "scale-125 border-slate-900 ring-2 ring-blue-300" : "border-white"
                }`}
                style={{ backgroundColor: c.color }}
                title={c.label}
              />
            ))}

            {/* Rainbow Brush Button */}
            <button
              onClick={() => setIsRainbow(true)}
              className={`px-2.5 py-1 rounded-full text-xs font-black text-white bg-gradient-to-r from-red-500 via-green-500 to-blue-500 border-2 transition-transform shadow-xs ${
                isRainbow ? "scale-110 ring-2 ring-blue-300 border-slate-900" : "border-white"
              }`}
            >
              무지개 🌈
            </button>
          </div>

          {/* Brush Size & Canvas Utility Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsRainbow(false);
                setBrushColor("#F8FAFC"); // eraser using canvas slate bg color
              }}
              className="p-2 bg-white/80 hover:bg-white text-slate-800 rounded-xl border border-slate-200 font-bold text-xs flex items-center gap-1 shadow-2xs"
              title="지우개"
            >
              <Eraser className="w-4 h-4 text-rose-500" />
              <span>지우개</span>
            </button>

            <button
              onClick={clearCanvas}
              className="p-2 bg-white/80 hover:bg-white text-slate-800 rounded-xl border border-slate-200 font-bold text-xs flex items-center gap-1 shadow-2xs"
              title="다시 쓰기"
            >
              <RotateCcw className="w-4 h-4 text-slate-600" />
              <span>지우기</span>
            </button>

            {/* DONE BUTTON */}
            <button
              onClick={handleDone}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>참 잘했어요!</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
