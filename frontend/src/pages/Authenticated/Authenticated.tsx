import React, { useState } from 'react';
import { AppMode } from '../../models/types';
import { ModeSelector } from '../../components/ModeSelector/ModeSelector';
import { LevelAssessmentWindow } from '../../components/LevelAssessmentWindow/LevelAssessmentWindow';
import { ResponseDisplay } from '../../components/ResponseDisplay/ResponseDisplay';
import { VoiceControls } from '../../components/VoiceControls/VoiceControls';
import { TextArea } from '../../components/Common/TextArea/TextArea';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { speechApi } from '../../api/speechApi';
import { teacherApi } from '../../api/teacherApi';
import { parseOutput } from '../../utils/parseOutput';
import styles from './Authenticated.module.css';

export const Authenticated: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('speech-correction');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [explanationVisible, setExplanationVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { isRecording, startRecording, stopRecording, getAudioBlob } = useAudioRecorder();

  const handleSubmit = async (text?: string) => {
    const input = text || inputText;
    if (!input.trim()) return;
    setIsProcessing(true);
    try {
      setExplanationVisible(false);
      const { answer } = await teacherApi.askQuestion(input, mode);
      setOutputText(answer.trim());
    } catch (error) {
      console.error('API error:', error);
      setOutputText('Error getting response.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceInput = async () => {
    try {
      const { mediaRecorder } = await startRecording(() => stopRecording());
      mediaRecorder.onstop = async () => {
        const audioBlob = getAudioBlob();
        if (!audioBlob) return;

        setIsProcessing(true);
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.webm');
        formData.append('mode', mode);

        try {
          const { transcript } = await speechApi.recognizeSpeech(formData);
          setInputText(transcript);
          await handleSubmit(transcript);
        } catch (err) {
          console.error('Speech recognition error:', err);
          setInputText('Speech recognition error');
        } finally {
          setIsProcessing(false);
        }
      };
    } catch (err) {
      console.error('Recording error:', err);
      setIsProcessing(false);
    }
  };

  const handleSpeak = async (text: string) => {
    if (!text || isSpeaking) return;
    setIsSpeaking(true);
    try {
      const audioBlob = await speechApi.synthesizeSpeech(text);
      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio(url);
      audio.onended = () => {
        URL.revokeObjectURL(url);
        setIsSpeaking(false);
      };
      audio.onerror = () => setIsSpeaking(false);
      await audio.play();
    } catch (err) {
      console.error('TTS error:', err);
      setIsSpeaking(false);
    }
  };

  const parsedOutput = parseOutput(outputText, mode);

  return (
    <div className={styles.container}>
      <ModeSelector mode={mode} onChange={(m) => setMode(m)} />
      {mode === 'level-assessment' ? (
        <LevelAssessmentWindow key="level-assessment" />
      ) : (
        <>
          <TextArea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isRecording}
            placeholder="Tap the mic or type your text"
          />
          <VoiceControls
            isRecording={isRecording}
            isProcessing={isProcessing}
            onStartRecording={handleVoiceInput}
            onStopRecording={stopRecording}
            onSubmit={() => handleSubmit()}
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
        </>
      )}
    </div>
  );
};
