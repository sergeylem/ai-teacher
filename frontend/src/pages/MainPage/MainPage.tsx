import React, { useState } from 'react';
import { AppMode } from '@/models/types';
import styles from './MainPage.module.css';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { speechApi } from '../../api/speechApi';
import { teacherApi } from '../../api/teacherApi';
import { parseOutput } from '../../utils/parseOutput';
import { ModeSelector } from '../../components/ModeSelector/ModeSelector';
import { VoiceControls } from '../../components/VoiceControls/VoiceControls';
import { ResponseDisplay } from '../../components/ResponseDisplay/ResponseDisplay';
import { TextArea } from '../../components/Common/TextArea/TextArea';
import { LevelAssessmentWindow } from '../../components/LevelAssessmentWindow/LevelAssessmentWindow';

export const MainPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mode, setMode] = useState<AppMode>('speech-correction');
  const [explanationVisible, setExplanationVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { isRecording, startRecording, stopRecording, getAudioBlob } = useAudioRecorder();

  const handleVoiceInput = async () => {
    try {
      const { mediaRecorder } = await startRecording(() => {
        console.log('Silence detected, stopping recording');
        stopRecording();
      });

      mediaRecorder.onstop = async () => {
        const audioBlob = getAudioBlob();
        if (!audioBlob) return;

        setIsProcessing(true);
        try {
          const formData = new FormData();
          formData.append('file', audioBlob, 'audio.webm');
          formData.append('mode', mode);

          const { transcript } = await speechApi.recognizeSpeech(formData);
          setInputText(transcript);
          await handleSubmit(transcript);
        } catch (error) {
          console.error('Speech recognition error:', error);
          setInputText('Speech recognition error');
        } finally {
          setIsProcessing(false);
        }
      };
    } catch (error) {
      console.error('Recording error:', error);
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (text?: string) => {
    const input = text || inputText;
    if (!input.trim()) return;

    setIsProcessing(true);
    try {
      setExplanationVisible(false);
      const { answer } = await teacherApi.askQuestion(input, mode);
      setOutputText(answer.trim());
    } catch (error) {
      console.error('API request error:', error);
      setOutputText('Error requesting AI response');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSpeak = async (text: string) => {
    if (!text || isSpeaking) return;
    setIsSpeaking(true);

    try {
      const audioBlob = await speechApi.synthesizeSpeech(text);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => setIsSpeaking(false);
      await audio.play();
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
    }
  };

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    setInputText('');
    setOutputText('');
    setExplanationVisible(false);
  };

  const parsedOutput = parseOutput(outputText, mode);

  return (
    <div className={styles.container}>
      <ModeSelector mode={mode} onChange={handleModeChange} />

      {mode === 'level-assessment' ? (
        <LevelAssessmentWindow />
      ) : (
        <>
          <h1 className={styles.title}>Talk to AI or Type Text</h1>

          <TextArea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tap the microphone or Type your phrase 🎙️"
            disabled={isRecording}
            rows={4}
          />

          <VoiceControls
            onStartRecording={handleVoiceInput}
            onStopRecording={stopRecording}
            onSubmit={() => handleSubmit()}
            isRecording={isRecording}
            isProcessing={isProcessing}
          />

          {outputText && (
            <ResponseDisplay
              output={parsedOutput}
              mode={mode}
              explanationVisible={explanationVisible}
              onShowExplanation={() => setExplanationVisible(true)}
              onSpeak={handleSpeak}
              isSpeaking={isSpeaking}
            />
          )}

          {isProcessing && !isRecording && (
            <div className={styles.loadingIndicator}>Processing...</div>
          )}
        </>
      )}
    </div>
  );
};