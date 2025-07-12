import React, { useState } from "react";

const VoiceSearch = ({ onSearch }) => {
  const [isListening, setIsListening] = useState(false);
  const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognizer = new recognition();

  recognizer.continuous = false;
  recognizer.lang = "en-IN";

  const startListening = () => {
    setIsListening(true);
    recognizer.start();

    recognizer.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onSearch(transcript);
      setIsListening(false);
    };

    recognizer.onerror = () => {
      setIsListening(false);
    };
  };

  return (
    <div className="text-center">
      <button
        className={`px-4 py-2 rounded-full ${
          isListening ? "bg-red-500" : "bg-blue-600"
        } text-white`}
        onClick={startListening}
      >
        {isListening ? "Listening..." : "🎙 Tap to Speak"}
      </button>
    </div>
  );
};

export default VoiceSearch;