import { useState } from "react";

function App() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleVoiceInput = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "ru-RU";
    recognition.start();

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setInputText(speechResult);
    };
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: inputText }),
      });
      const data = await res.json();
      setOutputText(data.answer);
    } catch (err) {
      console.error(err);
      setOutputText("Ошибка запроса к AI");
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
    <div style={{ padding: 20, fontFamily: "sans-serif", maxWidth: 600, margin: "0 auto" }}>
      <h2>AI English Assistant</h2>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        rows={4}
        style={{ width: "100%", marginBottom: 10 }}
        placeholder="Напиши или нажми на микрофон 🎙️"
      />
      <div style={{ marginBottom: 10 }}>
        <button onClick={handleVoiceInput}>🎙️ Говори</button>
        <button onClick={handleSubmit} style={{ marginLeft: 10 }}>Отправить</button>
      </div>
      {outputText && (
        <div style={{ marginTop: 20 }}>
          <strong>Ответ:</strong>
          <p>{outputText}</p>
          <button onClick={handleSpeak} disabled={isSpeaking}>🔊 Прослушать</button>
        </div>
      )}
    </div>
  );
}

export default App;
