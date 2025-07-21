import { useEffect } from "react";

export default function VoiceSearch({ onSearch }) {
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "gu-IN"; // or 'en-IN' / 'hi-IN'
    recognition.continuous = false;
    recognition.interimResults = false;

    const handleResult = (event) => {
      const transcript = event.results[0][0].transcript;
      onSearch(transcript);
    };

    const mic = document.getElementById("micButton");
    if (mic) {
      mic.addEventListener("click", () => {
        recognition.start();
      });
    }

    recognition.addEventListener("result", handleResult);
    recognition.addEventListener("error", (e) => console.error(e));
    recognition.addEventListener("end", () => console.log("Speech ended"));

    return () => {
      recognition.abort();
    };
  }, [onSearch]);

  return (
    <button id="micButton" className="p-2 rounded bg-green-500 text-white">
      🎤 Voice
    </button>
  );
}
