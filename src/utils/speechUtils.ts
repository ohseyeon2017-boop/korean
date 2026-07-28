// Web Speech API Utility for Korean Literacy App

export interface SpeakOptions {
  rate?: number; // 0.7 ~ 1.2
  pitch?: number; // 0.8 ~ 1.3
  onEnd?: () => void;
  onError?: (err: any) => void;
}

let activeSpeechUtterance: SpeechSynthesisUtterance | null = null;

export const speakText = (text: string, options: SpeakOptions = {}) => {
  if (!("speechSynthesis" in window)) {
    console.warn("SpeechSynthesis Web API not supported in this browser.");
    if (options.onEnd) options.onEnd();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  utterance.rate = options.rate ?? 0.85; // slightly slower for literacy learners
  utterance.pitch = options.pitch ?? 1.1; // friendly tone

  // Attempt to select best Korean voice
  const voices = window.speechSynthesis.getVoices();
  const koreanVoice = voices.find(
    (v) => v.lang.startsWith("ko") || v.name.includes("Korean") || v.name.includes("Yuna") || v.name.includes("Minji")
  );
  if (koreanVoice) {
    utterance.voice = koreanVoice;
  }

  if (options.onEnd) {
    utterance.onend = () => {
      activeSpeechUtterance = null;
      options.onEnd?.();
    };
  }

  if (options.onError) {
    utterance.onerror = (e) => {
      activeSpeechUtterance = null;
      options.onError?.(e);
    };
  }

  activeSpeechUtterance = utterance;
  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};

// Speech Recognition (STT) wrapper
export class KoreanSpeechRecognizer {
  private recognition: any = null;
  public isSupported: boolean = false;

  constructor() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.isSupported = true;
      this.recognition = new SpeechRecognition();
      this.recognition.lang = "ko-KR";
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
    }
  }

  public startListening(
    onResult: (text: string) => void,
    onError: (err: string) => void,
    onEnd?: () => void
  ) {
    if (!this.isSupported || !this.recognition) {
      onError("이 브라우저에서는 음성 인식을 지원하지 않거나 마이크 권한이 필요합니다.");
      return;
    }

    try {
      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      this.recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === "no-speech") {
          onError("소리가 잘 들리지 않았어요. 마이크 가까이에서 다시 말해볼까요?");
        } else if (event.error === "not-allowed") {
          onError("마이크 사용 권한이 거부되었습니다. 설정에서 마이크를 허용해주세요.");
        } else {
          onError("음성을 듣는 중 오차가 발생했습니다. 다시 시도해주세요!");
        }
      };

      this.recognition.onend = () => {
        onEnd?.();
      };

      this.recognition.start();
    } catch (e: any) {
      onError("음성 인식을 시작할 수 없습니다: " + e.message);
    }
  }

  public stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore stop error
      }
    }
  }
}
