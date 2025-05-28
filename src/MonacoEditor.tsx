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
  language = 'typescript', 
  height = '100%' 
}: MonacoEditorProps) {
  const monacoRef = useRef<Monaco | null>(null);

  const handleEditorDidMount: OnMount = (editor, monacoInstance) => {
    monacoRef.current = monacoInstance;
    editor.focus();
    
    monacoInstance.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: '#e0e0e0', background: '#1E1E1E' },
      ],
      colors: {
        'editor.background': '#1E1E1E',
        'editor.lineHighlightBackground': '#282828',
        'editorCursor.foreground': '#ffffff',
        'editor.lineNumbers': '#858585',
        'editor.selectionBackground': '#3a3a3a',
        'editor.inactiveSelectionBackground': '#3a3a3a80',
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
      theme="custom-dark"
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        wordWrap: 'on',
        automaticLayout: true,
        tabSize: 2,
        renderWhitespace: 'selection',
        padding: { top: 16, bottom: 16 },
        bracketPairColorization: { enabled: true },
        guides: { indentation: true },
        selectionHighlight: false,
      }}
    />
  );
}