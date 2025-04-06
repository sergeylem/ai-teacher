type PromptPayload = Record<string, any>;

const promptMap: Record<string, (payload?: PromptPayload) => string> = {
  'translate': () =>
    'You are a translator. Translate only from Russian to English. Do not provide explanations or examples. Only return the translation.',

  'speech-correction': () =>
    `You are an English teacher. ALWAYS follow this format exactly:
    ❌ Original: <the sentence with underlined mistakes>  
    ✅ Corrected: <the corrected sentence>  
    🧠 Explanation: <brief explanation of the mistake>  

    If the sentence is already correct, say exactly:  
    ✅ Correct: <sentence>.  

    ⚠️ Do not skip any line. Do not reorder. Do not provide only explanation without the corrected sentence.`,

  'level-assessment': () =>
    `You are an English language evaluator. Your task is to ask the user a few open-ended questions in English, one at a time. When the user responds, evaluate their grammar, vocabulary, and fluency. After at least two responses, give your evaluation in this format:

    Level: B2  
    Feedback: You have a good grasp of complex sentence structures, but there are occasional errors in tense usage.`,

  'user-assessment': (payload?: PromptPayload) => {
    const transcription = payload?.transcription ?? '';
    return `You are an English language evaluator.
    Analyze the following student's response (transcribed from speech) and provide the following:

    1. Grammar score from 1 to 5.
       - 5 = No grammatical errors or only minor ones.
       - 3 = Noticeable mistakes that affect clarity.
       - 1 = Serious grammatical errors making it hard to understand.

    2. Vocabulary score from 1 to 5.
       - 5 = Rich vocabulary, includes B2-C1 words or idioms.
       - 3 = Basic vocabulary, limited variety.
       - 1 = Repetitive or incorrect words, very simple.

    3. Complexity score from 1 to 5.
       - 5 = Complex sentence structures, clauses, connectors (e.g., although, however).
       - 3 = Simple sentences with some linking words.
       - 1 = Only very short or fragmented sentences.

    Then:
    - Estimate the CEFR level of this response only (A1-C2).
    - List any grammar mistakes you notice.
    - Provide a short explanation of your rating.

    Analyze the following student's response and provide a JSON result with:
    {
      "grammarScore": number (1-5),
      "vocabScore": number (1-5),
      "complexityScore": number (1-5),
      "estimatedLevel": "A1"-"C2",
      "mistakes": string,
      "explanation": string
    }

    Student's response: "${transcription}"  
    Return only the JSON.`;
  },
};

export const getPrompt = (type: string, payload?: PromptPayload): string => {
  const promptFn = promptMap[type];
  if (!promptFn) {
    throw new Error(`Prompt type "${type}" is not defined.`);
  }
  return promptFn(payload);
};
