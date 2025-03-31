import { useState, useRef } from "react";

function App() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mode, setMode] = useState("translate"); // "translate", "teacher-en"
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleVoiceInput = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.webm");
      formData.append("mode", mode);

      try {
        const res = await fetch("http://localhost:3001/api/whisper", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setInputText(data.transcript);
      } catch (err) {
        console.error(err);
        setInputText("Speech recognition error");
      }
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();

    // Auto stop recording in 6 sec
    setTimeout(() => {
      mediaRecorder.stop();
    }, 6000);
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
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

  return (
    <div style={{
      padding: "1.25rem",
      fontFamily: "sans-serif",
      maxWidth: "37.5rem",
      margin: "0 auto",
      fontSize: "1.125rem", // 18px
      position: "relative" // so that select can be positioned
    }}>
    {/* Select mode — location rigth upper coner*/}
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="translate">Translate RU → EN</option>
          <option value="teacher-en">AI teacher — only English</option>
          <option value="teacher-en-ru" disabled>AI teacher — EN + RU</option>
        </select>
      </div>
      <strong style={{ display: "block", marginTop: "1rem", marginBottom: "1rem" }}>
        Text to translate / Talk to AI
      </strong>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        rows={4}
        style={{ width: "100%", marginBottom: "0.625rem", fontSize: "1.125rem" }}
        placeholder="Type your phrase or tap the microphone 🎙️"
      />
      <div style={{ marginBottom: 10 }}>
        <button onClick={handleVoiceInput}>🎙️ Record</button>
        <button onClick={handleStopRecording} style={{ marginLeft: 10 }}>⏹️ Stop</button>
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
