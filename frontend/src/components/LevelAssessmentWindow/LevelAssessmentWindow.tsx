import React, { useEffect, useRef, useState } from 'react';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { speechApi } from '../../api/speechApi';
import { teacherApi } from '../../api/teacherApi';
import { assessmentApi } from '../../api/assessmentApi';
import styles from './LevelAssessmentWindow.module.css';

interface Message {
  role: 'teacher' | 'student';
  text: string;
}

export const LevelAssessmentWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [assessmentId, setAssessmentId] = useState<string>('');
  const [questionCount, setQuestionCount] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [finalResult, setFinalResult] = useState<{ finalLevel: string; summary: string } | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [initialPromptSent, setInitialPromptSent] = useState(false);
  const [hasIntroMessage, setHasIntroMessage] = useState(false);

  const { isRecording, startRecording, stopRecording, getAudioBlob } = useAudioRecorder();
  const { speak, isSpeaking } = useSpeechSynthesis();

  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [messages, finalResult]);

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const teacherSay = async (text: string, skipSpeak = false) => {
    if (!hasIntroMessage) setHasIntroMessage(true);
    setMessages(prev => [...prev, { role: 'teacher', text }]);
    if (!skipSpeak) {
      await wait(500);
      await speak(text);
    }
  };

  const handleStudentReply = async (transcript: string) => {
    const question = messages.filter(msg => msg.role === 'teacher').slice(-1)[0]?.text || '';
    setMessages(prev => [...prev, { role: 'student', text: transcript }]);

    if (!assessmentId) return;
    await assessmentApi.addEntry({ assessmentId, question, transcription: transcript });

    const currentCount = questionCount + 1;
    setQuestionCount(currentCount);

    if (currentCount % 5 === 0 && currentCount <= 15) {
      setShowOptions(true);
    } else if (currentCount < 15) {
      const next = await teacherApi.askQuestion(transcript, 'level-assessment');
      await wait(600);
      teacherSay(next.answer);
    } else {
      await handleFinish();
    }
  };

  const handleVoiceInput = async () => {
    const { mediaRecorder } = await startRecording(() => {
      stopRecording();
    });

    mediaRecorder.onstop = async () => {
      const audioBlob = getAudioBlob();
      if (!audioBlob) return;
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('mode', 'level-assessment');
      const { transcript } = await speechApi.recognizeSpeech(formData);
      await handleStudentReply(transcript);
    };
  };

  const handleStart = async () => {
    if (initialPromptSent || hasIntroMessage) return;
    setInitialPromptSent(true);
    const { assessmentId } = await assessmentApi.start('demo-user');
    setAssessmentId(assessmentId);
    setQuestionCount(1);
    setHasStarted(true);
    await teacherSay("Hi! How are you? Let's get to know each other. My name is Ellie. What's your name?", false);
  };

  const handleContinue = async () => {
    setShowOptions(false);
    const next = await teacherApi.askQuestion('continue', 'level-assessment');
    await wait(600);
    teacherSay(next.answer);
  };

  const handleFinish = async () => {
    const result = await assessmentApi.complete(assessmentId);
    setFinalResult(result);
  };

  useEffect(() => {
    if (!initialPromptSent && !hasIntroMessage) {
      handleStart();
    }
  }, [initialPromptSent, hasIntroMessage]);

  const renderMessage = (msg: Message, index: number) => {
    const isTeacher = msg.role === 'teacher';
    const label = isTeacher ? 'Ellie 🧑‍🏫' : 'You 🧑';
    const isIntro = isTeacher && index === 0;
    const className = isTeacher
      ? isIntro
        ? `${styles.teacher} ${styles.teacherIntro}`
        : styles.teacher
      : styles.student;
    return (
      <p key={index} className={className}>
        <strong>{label}:</strong> {msg.text}
      </p>
    );
  };

  return (
    <div className={styles.window}>
      <div className={styles.transcriptArea} ref={transcriptRef}>
        {messages.map(renderMessage)}
        {finalResult && (
          <div className={styles.result}>
            <h3>Your level: {finalResult.finalLevel}</h3>
            <p>{finalResult.summary}</p>
          </div>
        )}
      </div>

      {!finalResult && (
        <div className={styles.controls}>
          {!isRecording && !isSpeaking ? (
            <button onClick={handleVoiceInput} className={styles.record}>🎙️ Record</button>
          ) : (
            <button onClick={stopRecording} className={styles.stop}>⏹️ Stop</button>
          )}

          {showOptions && (
            <div className={styles.options}>
              <button onClick={handleContinue}>Continue</button>
              <button onClick={handleFinish}>Stop</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
