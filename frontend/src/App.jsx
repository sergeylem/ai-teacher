import { useState, useRef } from "react";

function App() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mode, setMode] = useState("teacher-en"); // "translate", "teacher-en"
  const [explanationVisible, setExplanationVisible] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const parseOutput = (text) => {
    const lines = text.split("\n").map(line => line.trim()).filter(Boolean);

    if (mode === 'translate') {
      return { mistake: "", correct: text, explanation: null };
    }

    const mistake = lines.find(line => line.startsWith("❌")) || "";
    const correct = lines.find(line => line.startsWith("✅")) || "";
    const explanationRaw = lines.find(line => line.startsWith("🧠")) || "";

    const lower = explanationRaw.toLowerCase();
    const explanation =
      !explanationRaw ||
        lower.includes("no mistake") ||
        lower.startsWith("✅ correct")
        ? null
        : explanationRaw;

    return { mistake, correct, explanation };
  };

  const handleVoiceInput = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    audioChunksRef.current = [];

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.fftSize = 2048;
    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    let silenceStart = null;
    const maxSilence = 6000; // 6 seconds

    const detectSilence = () => {
      analyser.getByteTimeDomainData(dataArray);
      const average = dataArray.reduce((sum, val) => sum + Math.abs(val - 128), 0) / bufferLength;

      if (average < 2) { // 🧘 very quiet
        if (!silenceStart) silenceStart = Date.now();
        else if (Date.now() - silenceStart > maxSilence) {
          console.log("🛑 Silence detected. Stopping...");
          stopRecording(); // ⏹️ We stop in silence
        }
      } else {
        silenceStart = null; // the sound is back
      }

      if (mediaRecorder.state === "recording") {
        requestAnimationFrame(detectSilence);
      }
    };

    const handleSubmitFromTranscript = async (transcript) => {
      try {
        setExplanationVisible(false);
        const res = await fetch("http://localhost:3001/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: transcript, mode }),
        });
        const data = await res.json();
        setOutputText(data.answer.trim());
      } catch (err) {
        console.error(err);
        setOutputText("Error request to AI");
      }
    };

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
        setExplanationVisible(false); // reset before new speech recognition
        setInputText(data.transcript);
        handleSubmitFromTranscript(data.transcript);
      } catch (err) {
        console.error(err);
        setInputText("Speech recognition error");
      }
    };

    const stopRecording = () => {
      if (mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        stream.getTracks().forEach((track) => track.stop());
        audioContext.close();
      }
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    requestAnimationFrame(detectSilence); // 🧠 start silence monitoring
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
      setExplanationVisible(false); // reset before new response
      setOutputText(data.answer.trim());
    } catch (err) {
      console.error(err);
      setOutputText("Error request to AI");
    }
  };

  const handleSpeak = async () => {
    if (!outputText) return;

    let toSpeak = "";

    if (mode === "translate") {
      toSpeak = outputText;
    } else {
      const { correct, explanation } = parseOutput(outputText);
      toSpeak = explanationVisible && explanation ? explanation : correct;
    }

    if (!toSpeak) return;

    try {
      const res = await fetch("http://localhost:3001/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: toSpeak }),
      });

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    } catch (err) {
      console.error("Speech error", err);
    }
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
      {/* Select mode — top right */}
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <select
          value={mode}
          onChange={(e) => {
            setMode(e.target.value);
            setInputText("");
            setOutputText("");
            setExplanationVisible(false);
          }}
        >
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

      {outputText && (() => {
        const { mistake, correct, explanation } = parseOutput(outputText);
        return (
          <div style={{ marginTop: 20 }}>
            <strong>Answer:</strong>
            {mistake && <p>{mistake}</p>}
            <p>{correct}</p>
            {mode !== 'translate' && !explanationVisible && explanation && (
              <button onClick={() => setExplanationVisible(true)}>🧠 Explanation</button>
            )}
            {mode !== 'translate' && explanationVisible && explanation && <p>{explanation}</p>}
            <button onClick={handleSpeak} style={{ marginLeft: 10 }} disabled={isSpeaking}>🔊 Listen</button>
          </div>
        );
      })()}
    </div>
  );
}

export default App;
