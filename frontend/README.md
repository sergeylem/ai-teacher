Structure of backend

src/
├── openai/
│   ├── openai.controller.ts
│   ├── openai.service.ts
├── conversation/
│   └── conversation.entity.ts
│   └── conversation.entity.ts
├── app.module.ts
├── constants.ts
└── main.ts
   └── types.ts


Structure of frontend

src/
├── api/
│   ├── apiClient.ts
│   ├── speechApi.ts
│   └── teacherApi.ts
├── assets/
│   └── styles/
│       ├── global.css
│       └── variables.css
├── components/
│   ├── Common/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── Button.module.css
│   │   └── TextArea/
│   │       ├── TextArea.tsx
│   │       └── TextArea.module.css
│   ├── AudioRecorder/
│   │   ├── AudioRecorder.tsx
│   │   └── AudioRecorder.module.css
│   ├── ModeSelector/
│   │   ├── ModeSelector.tsx
│   │   └── ModeSelector.module.css
│   ├── ResponseDisplay/
│   │   ├── ResponseDisplay.tsx
│   │   └── ResponseDisplay.module.css
│   └── VoiceControls/
│       ├── VoiceControls.tsx
│       └── VoiceControls.module.css
├── hooks/
│   ├── useAudioRecorder.ts
│   └── useSpeechSynthesis.ts
├── models/
│   └── types.ts
├── pages/
│   └── MainPage/
│       ├── MainPage.tsx
│       └── MainPage.module.css
├── utils/
│   ├── parseOutput.ts
│   └── textUtils.ts
├── App.tsx
└── index.tsx


