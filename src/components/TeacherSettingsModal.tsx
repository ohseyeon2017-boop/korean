import React, { useState } from "react";
import { X, Key, Link as LinkIcon, Volume2, Save, Copy, Check, ExternalLink, HelpCircle, RefreshCw, FileText } from "lucide-react";
import { AppSettings } from "../types";
import { GAS_SCRIPT_CODE_TEMPLATE, sendLearningLogToGAS } from "../utils/gasSyncUtils";

interface TeacherSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
  studentName: string;
  onUpdateStudentName: (name: string) => void;
  onSpeakTest: (speed: number, pitch: number) => void;
  onResetProgress: () => void;
}

export const TeacherSettingsModal: React.FC<TeacherSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  studentName,
  onUpdateStudentName,
  onSpeakTest,
  onResetProgress,
}) => {
  const [activeTab, setActiveTab] = useState<"settings" | "guide" | "script">("settings");
  const [geminiApiKey, setGeminiApiKey] = useState(settings.geminiApiKey || "");
  const [gasWebAppUrl, setGasWebAppUrl] = useState(settings.gasWebAppUrl || "");
  const [ttsSpeed, setTtsSpeed] = useState(settings.ttsSpeed || 0.85);
  const [ttsPitch, setTtsPitch] = useState(settings.ttsPitch || 1.1);
  const [tempStudentName, setTempStudentName] = useState(studentName || "민수");

  const [copiedCode, setCopiedCode] = useState(false);
  const [testGasStatus, setTestGasStatus] = useState<string | null>(null);
  const [isTestingGas, setIsTestingGas] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings({
      geminiApiKey,
      gasWebAppUrl,
      ttsSpeed,
      ttsPitch,
    });
    if (tempStudentName.trim()) {
      onUpdateStudentName(tempStudentName.trim());
    }
    onClose();
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GAS_SCRIPT_CODE_TEMPLATE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleTestGasUrl = async () => {
    if (!gasWebAppUrl || !gasWebAppUrl.startsWith("http")) {
      setTestGasStatus("❌ 올바른 HTTP/HTTPS Web App URL을 입력해주세요.");
      return;
    }

    setIsTestingGas(true);
    setTestGasStatus("연동 테스트 전송 중...");

    const res = await sendLearningLogToGAS(gasWebAppUrl, {
      studentName: tempStudentName || "테스트 학생",
      date: new Date().toLocaleString("ko-KR"),
      learnedWordsCount: 1,
      quizAccuracy: "100%",
      handwritingCount: 1,
      durationMinutes: 1,
      timestamp: Date.now(),
    });

    setIsTestingGas(false);
    if (res.success) {
      setTestGasStatus("✅ 구글 시트 연동 성공! 테스트 전송이 완료되었습니다.");
    } else {
      setTestGasStatus("❌ 전송 실패: " + res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white/80 backdrop-blur-2xl rounded-[36px] border border-white/90 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 text-white flex items-center justify-center font-black text-xl shadow-md">
              ⚙️
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">교사 전용 환경 설정 및 배포 가이드</h3>
              <p className="text-xs font-bold text-slate-600">
                Gemini API 키, 구글 시트 연동 URL, TTS 발음 속도 설정 및 배포 방법
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

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 mb-4 shrink-0">
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              activeTab === "settings"
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                : "bg-white/60 hover:bg-white text-slate-700 border border-white/80"
            }`}
          >
            <Key className="w-4 h-4" />
            <span>기본 설정</span>
          </button>

          <button
            onClick={() => setActiveTab("guide")}
            className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              activeTab === "guide"
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                : "bg-white/60 hover:bg-white text-slate-700 border border-white/80"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>배포 및 가이드</span>
          </button>

          <button
            onClick={() => setActiveTab("script")}
            className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              activeTab === "script"
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                : "bg-white/60 hover:bg-white text-slate-700 border border-white/80"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>GAS 스크립트 코드</span>
          </button>
        </div>

        {/* Tab 1: Settings */}
        {activeTab === "settings" && (
          <div className="overflow-y-auto pr-1 flex-1 space-y-4 text-sm text-slate-800">
            {/* Student Name Edit */}
            <div className="bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-white/90 shadow-2xs">
              <label className="block text-xs font-black text-slate-900 mb-1">지도 학생 이름 / 별명</label>
              <input
                type="text"
                value={tempStudentName}
                onChange={(e) => setTempStudentName(e.target.value)}
                className="w-full px-3 py-2 bg-white/90 rounded-xl border border-slate-300 font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="예: 민수"
              />
            </div>

            {/* Gemini API Key */}
            <div className="bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-white/90 shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-black text-slate-900 flex items-center gap-1">
                  <Key className="w-4 h-4 text-blue-500" />
                  Gemini API Key (선택사항 / LocalStorage 저장)
                </label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5"
                >
                  API 키 발급받기 <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                className="w-full px-3 py-2 bg-white/90 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="AI Studio에서 발급받은 Gemini API Key 입력"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                * AI Studio 환경에서는 서버 환경 변수(GEMINI_API_KEY)가 자동 적용됩니다.
              </p>
            </div>

            {/* Google Apps Script Web App URL */}
            <div className="bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-white/90 shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-black text-slate-900 flex items-center gap-1">
                  <LinkIcon className="w-4 h-4 text-emerald-600" />
                  구글 시트 연동용 GAS Web App URL
                </label>
                <button
                  onClick={handleTestGasUrl}
                  disabled={isTestingGas}
                  className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-lg shadow-2xs flex items-center gap-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingGas ? "animate-spin" : ""}`} />
                  <span>연동 테스트</span>
                </button>
              </div>
              <input
                type="text"
                value={gasWebAppUrl}
                onChange={(e) => setGasWebAppUrl(e.target.value)}
                className="w-full px-3 py-2 bg-white/90 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="https://script.google.com/macros/s/.../exec"
              />
              {testGasStatus && (
                <div className="mt-2 text-xs font-bold p-2 bg-white rounded-lg border border-slate-300 text-slate-900">
                  {testGasStatus}
                </div>
              )}
            </div>

            {/* Speech Sliders */}
            <div className="bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-white/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 flex items-center gap-1">
                  <Volume2 className="w-4 h-4 text-blue-500" />
                  한글 읽어주기 말하기 속도 & 목소리 톤
                </span>
                <button
                  onClick={() => onSpeakTest(ttsSpeed, ttsPitch)}
                  className="text-xs bg-blue-500 hover:bg-blue-600 text-white font-bold px-2.5 py-1 rounded-lg"
                >
                  발음 테스트
                </button>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>말하기 속도: {ttsSpeed.toFixed(2)}x (느림~보통)</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.2"
                  step="0.05"
                  value={ttsSpeed}
                  onChange={(e) => setTtsSpeed(parseFloat(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>목소리 톤(Pitch): {ttsPitch.toFixed(2)} (상냥하고 밝은 톤)</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.4"
                  step="0.05"
                  value={ttsPitch}
                  onChange={(e) => setTtsPitch(parseFloat(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>

            {/* Reset Data */}
            <div className="pt-2">
              <button
                onClick={() => {
                  if (confirm("학생의 별 포인트와 스티커 진행 상황을 초기화하시겠습니까?")) {
                    onResetProgress();
                  }
                }}
                className="text-xs text-rose-600 hover:text-rose-800 font-bold underline"
              >
                학습 데이터 및 스티커 초기화하기
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Deployment Guide */}
        {activeTab === "guide" && (
          <div className="overflow-y-auto pr-1 flex-1 space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
            <div className="bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-white/90 shadow-2xs">
              <h4 className="font-black text-slate-900 text-base mb-1">
                1. 컴퓨터에서 바로 열어보기 (Local / Standalone)
              </h4>
              <ol className="list-decimal list-inside space-y-1 font-medium text-slate-700">
                <li>이 프로젝트 코드는 React + Vite 환경에서 구동됩니다.</li>
                <li>로컬 컴퓨터의 브라우저에서 언제든지 웹 앱 URL로 접속하여 이용할 수 있습니다.</li>
                <li>[교사 설정]에서 설정한 API 키와 구글 시트 URL은 브라우저 LocalStorage에 안전히 보관됩니다.</li>
              </ol>
            </div>

            <div className="bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-white/90 shadow-2xs">
              <h4 className="font-black text-slate-900 text-base mb-1">
                2. 구글 시트 연동 앱스 스크립트(GAS) 설정법
              </h4>
              <ol className="list-decimal list-inside space-y-1 font-medium text-slate-700">
                <li>구글 드라이브에서 새 '구글 스프레드시트'를 하나 만듭니다.</li>
                <li>상단 메뉴 [확장 프로그램] → [Apps Script] 클릭!</li>
                <li>
                  [GAS 스크립트 코드] 탭에 있는 코드를 복사해서 Apps Script 편집기에 붙여넣고 저장합니다.
                </li>
                <li>
                  우측 상단 [배포] → [새 배포] → 톱니바퀴 [웹 앱] 선택 → 액세스 권한: <b>누구나(Anyone)</b>로 설정 후
                  배포!
                </li>
                <li>생성된 Web App URL을 본 설정 창의 [구글 시트 연동 URL]에 붙여넣습니다.</li>
              </ol>
            </div>

            <div className="bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-white/90 shadow-2xs">
              <h4 className="font-black text-slate-900 text-base mb-1">
                3. 깃허브(GitHub Pages) 무료 배포 방법
              </h4>
              <ol className="list-decimal list-inside space-y-1 font-medium text-slate-700">
                <li>본 프로젝트의 소스코드를 깃허브(GitHub) 저장소에 업로드(Push)합니다.</li>
                <li>GitHub 저장소의 <b>Settings</b> → <b>Pages</b> 메뉴로 이동합니다.</li>
                <li>Source를 <b>GitHub Actions</b> 또는 <b>main branch / (root or dist)</b>로 선택하고 저장합니다.</li>
                <li>약 1~2분 뒤 나만의 GitHub Pages 웹사이트 링크가 생성되어 학생들에게 공유할 수 있습니다!</li>
              </ol>
            </div>
          </div>
        )}

        {/* Tab 3: Copyable GAS Code */}
        {activeTab === "script" && (
          <div className="overflow-y-auto pr-1 flex-1 flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900">
                구글 시트 연동용 Apps Script (Code.gs) 전체 코드
              </span>
              <button
                onClick={handleCopyScript}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow-2xs"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? "복사 완료!" : "전체 코드 복사하기"}</span>
              </button>
            </div>

            <pre className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs overflow-x-auto flex-1 leading-relaxed shadow-inner">
              {GAS_SCRIPT_CODE_TEMPLATE}
            </pre>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-200/80 mt-4 shrink-0 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-black text-sm flex items-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>설정 저장하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
