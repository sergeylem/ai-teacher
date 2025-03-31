import { useState, useRef } from "react";

function App() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mode, setMode] = useState("translate"); // "translate", "teacher-en"
  const recognitionRef = useRef(null);


  const handleVoiceInput = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.interimResults = false;
    recognition.continuous = true;
    recognition.lang = mode === "teacher-en" ? "en-US" : "ru-RU";

    let finalTranscript = "";
    let silenceTimeout;

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        }
      }
      setInputText(finalTranscript.trim());

      // reset the timer if the user continues talking
      clearTimeout(silenceTimeout);
      silenceTimeout = setTimeout(() => {
        recognition.stop();
      }, mode === "teacher-en" ? 6000 : 3000); // silenceTimeout depends on mode
    };

    recognition.onend = () => {
      console.log("Recognition completed (by silence or manually)");
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: inputText, mode }),
      });
      const data = await res.json();
      setOutputText(data.answer.trim());
    } catch (err) {
      console.error(err);
      setOutputText("Error request to AI");
    }
  };

  const handleSpeak = () => {
    if (!outputText) return;
    const utterance = new SpeechSynthesisUtterance(outputText);
    utterance.lang = "en-US";
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleStopMic = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div style={{ 
      padding: "1.25rem", 
      fontFamily: "sans-serif", 
      maxWidth: "37.5rem", // 600, 
      margin: "0 auto",
      fontSize: "1.125rem", // 18px
      position: "relative" // so that select can be positioned
      }}>
    {/* Режим выбора — ВЕРХНИЙ ПРАВЫЙ УГОЛ */}
      <div style={{ position: "absolute", top: 20, right: 20 }}>
       <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="translate">Translate RU → EN</option>
          <option value="teacher-en">AI teacher — only English</option>
          <option value="teacher-en-ru" disabled>AI teacher — EN + RU</option>
        </select>
      </div>        
      <strong style={{ display: "block", marginTop: "1rem", marginBottom: "1rem"  }}>Text to translate/Talk to AI</strong>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        rows={4}
        style={{ 
          width: "100%", 
          marginBottom: "0.625rem", // 10,
          fontSize: "1.125rem"
        }}
        placeholder="Type your phrase or tap the microphone 🎙️"
      />
      <div style={{ marginBottom: 10 }}>
        <button onClick={handleVoiceInput}>🎙️ Speak</button>
        <button onClick={handleStopMic} style={{ marginLeft: 10 }}>⏹️ Stop</button>
        <button onClick={handleSubmit} style={{ marginLeft: 10 }}>Send</button>
      </div>
      {outputText && (
        <div style={{ marginTop: 20 }}>
          <strong>Answer:</strong>
          <p>{outputText}</p>
          <button onClick={handleSpeak} disabled={isSpeaking}>🔊 Listen</button>
        </div>
      )}
    </div>
  );
}

export default App;
