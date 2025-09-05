import React, { useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  showToolbar?: boolean;
  className?: string;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  disabled = false,
  showToolbar = true,
  className,
  placeholder = "Start typing..."
}) => {
  const modules = useMemo(() => ({
    toolbar: showToolbar ? [
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block', 'link', 'image'],
      ['table'],
      ['clean']
    ] : false
  }), [showToolbar]);

  const formats = [
    'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet',
    'indent',
    'align',
    'blockquote', 'code-block',
    'link', 'image', 'table'
  ];

  useEffect(() => {
    // Inject custom CSS styles for theming
    const style = document.createElement('style');
    style.textContent = `
      .rich-text-editor .ql-toolbar {
        border-color: hsl(var(--border));
        background: hsl(var(--background));
        border-radius: 0.5rem 0.5rem 0 0;
      }
      
      .rich-text-editor .ql-container {
        border-color: hsl(var(--border));
        font-family: Arial, sans-serif;
        border-radius: 0 0 0.5rem 0.5rem;
      }
      
      .rich-text-editor .ql-editor {
        min-height: 150px;
        color: hsl(var(--foreground));
        background: hsl(var(--background));
        font-family: Arial, sans-serif;
      }
      
      .rich-text-editor[data-show-toolbar="false"] .ql-container {
        border-radius: 0.5rem;
        border-top: 1px solid hsl(var(--border));
      }
      
      .rich-text-editor .ql-editor.ql-blank::before {
        color: hsl(var(--muted-foreground));
      }
      
      .rich-text-editor .ql-snow .ql-stroke {
        stroke: hsl(var(--foreground));
      }
      
      .rich-text-editor .ql-snow .ql-fill {
        fill: hsl(var(--foreground));
      }
      
      .rich-text-editor .ql-snow .ql-picker-options {
        background: hsl(var(--background));
        border: 1px solid hsl(var(--border));
      }
      
      .rich-text-editor .ql-snow .ql-picker-item:hover {
        background: hsl(var(--accent));
      }
      
      .rich-text-editor .ql-snow .ql-tooltip {
        background: hsl(var(--background));
        border: 1px solid hsl(var(--border));
        color: hsl(var(--foreground));
      }
      
      .rich-text-editor .ql-snow .ql-tooltip input {
        background: hsl(var(--background));
        border: 1px solid hsl(var(--border));
        color: hsl(var(--foreground));
      }

      .rich-text-editor[data-disabled="true"] .ql-toolbar {
        background: hsl(var(--muted));
        pointer-events: none;
      }
      
      .rich-text-editor[data-disabled="true"] .ql-editor {
        background: hsl(var(--muted));
        cursor: not-allowed;
      }
    `;
    
    if (!document.querySelector('#rich-text-editor-styles')) {
      style.id = 'rich-text-editor-styles';
      document.head.appendChild(style);
    }

    return () => {
      const existingStyle = document.querySelector('#rich-text-editor-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  useEffect(() => {
    console.log('[RichTextEditor] disabled:', disabled, 'showToolbar:', showToolbar);
  }, [disabled, showToolbar]);

  return (
    <div className={cn("rich-text-editor", className)} data-disabled={disabled} data-show-toolbar={showToolbar}>
      <ReactQuill
        key={`${disabled}-${showToolbar}`}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={!!disabled}
      />
    </div>
  );
};