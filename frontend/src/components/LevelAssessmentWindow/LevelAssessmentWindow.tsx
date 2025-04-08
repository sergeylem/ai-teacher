import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { speechApi } from '../../api/speechApi';
import { teacherApi } from '../../api/teacherApi';
import { assessmentApi } from '../../api/assessmentApi';
import { useTeacherDialogue } from '../../hooks/useTeacherDialogue';
import { AssessmentControls } from '../AssessmentControls/AssessmentControls';
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

  const { isRecording, startRecording, stopRecording, getAudioBlob } = useAudioRecorder();
  const { teacherSay, sayWelcomeIfNeeded, isSpeaking } = useTeacherDialogue();

  const transcriptRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [messages, finalResult]);

  const addTeacherMessage = (text: string) => {
    setMessages((prev) => [...prev, { role: 'teacher', text }]);
  };

  const handleStudentReply = async (transcript: string) => {
    const lastQuestion = messages.filter((msg) => msg.role === 'teacher').slice(-1)[0]?.text || '';
    setMessages((prev) => [...prev, { role: 'student', text: transcript }]);

    if (!assessmentId) return;
    await assessmentApi.addEntry({
      assessmentId,
      question: lastQuestion,
      transcription: transcript,
    });

    const currentCount = questionCount + 1;
    setQuestionCount(currentCount);

    if (currentCount % 5 === 0 && currentCount <= 15) {
      setShowOptions(true);
    } else if (currentCount < 15) {
      const next = await teacherApi.askQuestion(transcript, 'level-assessment');
      addTeacherMessage(next.answer);
      await teacherSay(next.answer);
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

  const handleStart = useCallback(async () => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    setMessages([]);
    setShowOptions(false);
    setFinalResult(null);

    const { assessmentId } = await assessmentApi.start(); // Без userId
    setAssessmentId(assessmentId);
    setQuestionCount(1);
    await sayWelcomeIfNeeded((text) => addTeacherMessage(text));
  }, [sayWelcomeIfNeeded]);

  const handleContinue = async () => {
    setShowOptions(false);
    const next = await teacherApi.askQuestion('continue', 'level-assessment');
    addTeacherMessage(next.answer);
    await teacherSay(next.answer);
  };

  const handleFinish = async () => {
    const result = await assessmentApi.complete(assessmentId);
    setFinalResult(result);
  };

  useEffect(() => {
    handleStart();
  }, [handleStart]);

  const renderMessage = (msg: Message, index: number) => {
    const isTeacher = msg.role === 'teacher';
    const label = isTeacher ? 'Ellie 🧑‍🏫' : 'You 🧑';
    const className = isTeacher ? styles.teacher : styles.student;
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
        <AssessmentControls
          isRecording={isRecording}
          isSpeaking={isSpeaking}
          onStart={handleVoiceInput}
          onStop={stopRecording}
          showOptions={showOptions}
          onContinue={handleContinue}
          onFinish={handleFinish}
        />
      )}
    </div>
  );
};
