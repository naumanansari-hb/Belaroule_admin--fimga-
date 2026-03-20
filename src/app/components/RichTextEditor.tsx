import { useEffect, useRef, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import '@/styles/quill-custom.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = 'Enter content',
  className = ''
}: RichTextEditorProps) {
  const [ReactQuill, setReactQuill] = useState<any>(null);
  const quillRef = useRef<any>(null);

  useEffect(() => {
    // Suppress findDOMNode deprecation warning from react-quill
    const originalError = console.error;
    console.error = (...args: any[]) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('findDOMNode')
      ) {
        return;
      }
      originalError.call(console, ...args);
    };

    // Dynamically import ReactQuill to avoid SSR issues and reduce initial bundle
    import('react-quill').then((mod) => {
      setReactQuill(() => mod.default);
    });

    return () => {
      console.error = originalError;
    };
  }, []);

  if (!ReactQuill) {
    return (
      <div className={`bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 min-h-[300px] flex items-center justify-center ${className}`}>
        <p className="text-sm text-neutral-400">Loading editor...</p>
      </div>
    );
  }

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link', 'image'
  ];

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      modules={modules}
      formats={formats}
    />
  );
}