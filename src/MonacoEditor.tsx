import Editor from '@monaco-editor/react';
import type { Monaco, OnMount } from '@monaco-editor/react';
import { useRef } from 'react';

interface MonacoEditorProps {
  code: string;
  onChange?: (value: string | undefined) => void;
  language?: string;
  height?: string;
}

export function MonacoEditor({ 
  code, 
  onChange, 
  language = 'javascript', 
  height = '50rem' 
}: MonacoEditorProps) {
  const monacoRef = useRef<Monaco | null>(null);

  const handleEditorDidMount: OnMount = (editor, monacoInstance) => {
    monacoRef.current = monacoInstance;
    editor.focus();
    
    monacoInstance.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1E1E1E',
      },
    });
    monacoInstance.editor.setTheme('custom-dark');
  };

  return (
    <Editor
      height={height}
      defaultLanguage={language}
      value={code}
      onChange={onChange}
      onMount={handleEditorDidMount}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        wordWrap: 'on',
        automaticLayout: true,
        tabSize: 2,
        renderWhitespace: 'selection',
        padding: { top: 10 },
        bracketPairColorization: { enabled: true },
      }}
    />
  );
}