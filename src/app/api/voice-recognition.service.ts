import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives?: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: { transcript: string };
  }>;
};

@Injectable({ providedIn: 'root' })
export class VoiceRecognitionService {
  private recognition?: SpeechRecognitionInstance;
  private restartOnEnd = false;
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);

    // ✅ Only initialize in browser
    if (this.isBrowser) {
      this.initialize();
    }
  }

  get isSupported(): boolean {
    return this.isBrowser && Boolean(this.recognition);
  }

  start(onResult: (text: string, isFinal: boolean) => void): boolean {
  if (!this.recognition) return false;

  this.restartOnEnd = false;
  const recognition = this.recognition;

  recognition.onresult = (event: any) => {
    let finalText = '';
    let interimText = '';

    // ✅ Only process NEW results since resultIndex (prevents repeating)
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const res = event.results[i];
      const transcript = (res[0]?.transcript ?? '').trim();

      if (res.isFinal) finalText += transcript + ' ';
      else interimText += transcript + ' ';
    }

    finalText = finalText.trim();
    interimText = interimText.trim();

    // If we got any final, treat as final; else interim update
    if (finalText) onResult(finalText, true);
    else onResult(interimText, false);
  };

  recognition.onerror = () => this.stop();

  // recognition.onend = () => {
  //   if (this.restartOnEnd) recognition.start();
  // };

  recognition.start();
  return true;
}

  stop(): void {
    this.restartOnEnd = false;
    this.recognition?.stop();
  }

  private initialize(): void {
    // ✅ Double-guard even in browser mode
    if (typeof window === 'undefined') return;

    const w = window as any;

    const SpeechRecognitionCtor: SpeechRecognitionConstructor | undefined =
      w.SpeechRecognition || w.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    this.recognition = recognition;
  }
}
