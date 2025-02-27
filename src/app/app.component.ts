import {Component, NgZone} from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    NgIf
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'salvus-audio-demo';
  transcript: string = '';
  recording: boolean = false;
  recognition: any;
  showMounjaroPrompt: boolean = false;
  showProliaPrompt: boolean = false;
  showMorningPrompt: boolean = false;

  constructor(private ngZone: NgZone) {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
        this.ngZone.run(() => {
          this.transcript = finalTranscript;
          this.checkForKeywords(finalTranscript);
        });
      };

      this.recognition.onend = () => {
        this.ngZone.run(() => {
          this.recording = false;
        });
      };
    }
  }

  startRecording() {
    if (this.recognition) {
      this.transcript = '';
      this.recording = true;
      this.recognition.start();
    }
  }

  stopRecording() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  checkForKeywords(text: string) {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('first time') && lowerText.includes('mounjaro')) {
      this.showMounjaroPrompt = true;
    }
    if (lowerText.includes('prolia') && lowerText.includes('november 15th')) {
      this.showProliaPrompt = true;
    }
    if (lowerText.includes('morning after pill')) {
      this.showMorningPrompt = true;
    }
  }

  sendCareFlow(type: string, send: boolean) {
    if (send) {
      if (type === 'Mounjaro') {
        alert("Care Flow 'Mounjaro' sent to the patient!");
      } else if (type === 'Prolia') {
        alert("Care Flow 'Prolia reminder' scheduled for 15th of May!");
      } else if (type === 'morning') {
        alert("Care Flow 'Morning after pill' send to the patient!");
      }
    }
    this.showMounjaroPrompt = false;
    this.showProliaPrompt = false;
    this.showMorningPrompt = false;
  }
}
