import React, { useMemo, useEffect, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<ReactQuill | null>(null);

  const modules = useMemo(() => {
    const toolbar = showToolbar ? [
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block', 'link', 'image'],
      ['clean']
    ] : false;
    return { toolbar };
  }, [showToolbar]);

  const formats = [
    'header',
    'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet',
    'indent',
    'align',
    'blockquote', 'code-block',
    'link', 'image'
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

  useEffect(() => {
    if (!showToolbar) return;
    const root = containerRef.current;
    const toolbar = root?.querySelector('.ql-toolbar') as HTMLElement | null;
    if (!toolbar) return;

    const setLabel = (selector: string, label: string) => {
      const el = toolbar.querySelector(selector) as HTMLElement | null;
      if (!el) return;
      el.setAttribute('title', label);
      el.setAttribute('aria-label', label);
    };

    setLabel('button.ql-bold', 'Bold');
    setLabel('button.ql-italic', 'Italic');
    setLabel('button.ql-underline', 'Underline');
    setLabel('button.ql-strike', 'Strikethrough');
    setLabel('.ql-picker.ql-font', 'Font');
    setLabel('.ql-picker.ql-size', 'Text size');
    setLabel('.ql-picker.ql-header', 'Headings (H1–H3)');
    setLabel('button.ql-color', 'Text color');
    setLabel('button.ql-background', 'Highlight color');
    setLabel('button.ql-script[value="sub"]', 'Subscript');
    setLabel('button.ql-script[value="super"]', 'Superscript');
    setLabel('button.ql-list[value="ordered"]', 'Ordered list');
    setLabel('button.ql-list[value="bullet"]', 'Bulleted list');
    setLabel('button.ql-indent[value="-1"]', 'Indent less');
    setLabel('button.ql-indent[value="+1"]', 'Indent more');
    setLabel('.ql-picker.ql-align', 'Align');
    setLabel('button.ql-blockquote', 'Blockquote');
    setLabel('button.ql-code-block', 'Code block');
    setLabel('button.ql-link', 'Insert link');
    setLabel('button.ql-image', 'Insert image');
    setLabel('button.ql-clean', 'Clear formatting');

    // Add Table button
    let tableBtn = toolbar.querySelector('button.ql-insertTable') as HTMLButtonElement | null;
    if (!tableBtn) {
      const groups = toolbar.querySelectorAll('.ql-formats');
      const targetGroup = groups[groups.length - 1] || toolbar;
      tableBtn = document.createElement('button');
      tableBtn.type = 'button';
      tableBtn.className = 'ql-insertTable';
      tableBtn.setAttribute('title', 'Insert table');
      tableBtn.setAttribute('aria-label', 'Insert table');
      tableBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"/>
          <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" stroke-width="2"/>
          <line x1="3" y1="15" x2="21" y2="15" stroke="currentColor" stroke-width="2"/>
          <line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" stroke-width="2"/>
          <line x1="15" y1="3" x2="15" y2="21" stroke="currentColor" stroke-width="2"/>
        </svg>`;
      targetGroup.appendChild(tableBtn);
    }

    const clickHandler = (e: Event) => {
      e.preventDefault();
      const editor = (quillRef.current as any)?.getEditor?.();
      if (!editor) return;
      try {
        const tableModule = editor.getModule('better-table');
        if (tableModule?.insertTable) {
          tableModule.insertTable(3, 3);
          return;
        }
      } catch (err) {
        console.warn('better-table insert failed, will fallback:', err);
      }
      // Fallback: simple 3x3 HTML via clipboard
      try {
        const range = editor.getSelection(true);
        const index = range?.index ?? editor.getLength();
        const tableHtml = `
          <table class="qlbt-table" style="border-collapse: collapse; width: 100%; margin: 10px 0;">
            <tr>
              <td style="border: 1px solid #ccc; padding: 8px;"> </td>
              <td style="border: 1px solid #ccc; padding: 8px;"> </td>
              <td style="border: 1px solid #ccc; padding: 8px;"> </td>
            </tr>
            <tr>
              <td style="border: 1px solid #ccc; padding: 8px;"> </td>
              <td style="border: 1px solid #ccc; padding: 8px;"> </td>
              <td style="border: 1px solid #ccc; padding: 8px;"> </td>
            </tr>
            <tr>
              <td style="border: 1px solid #ccc; padding: 8px;"> </td>
              <td style="border: 1px solid #ccc; padding: 8px;"> </td>
              <td style="border: 1px solid #ccc; padding: 8px;"> </td>
            </tr>
          </table>
        `;
        const delta = editor.clipboard.convert(tableHtml);
        editor.updateContents(delta, 'user');
        editor.setSelection(index + delta.length(), 0);
      } catch (fallbackErr) {
        console.warn('Clipboard fallback failed, inserting markdown', fallbackErr);
        const range = editor.getSelection(true);
        const index = range?.index ?? editor.getLength();
        const tableText = `\n|   |   |   |\n|---|---|---|\n|   |   |   |\n|   |   |   |\n`;
        editor.insertText(index, tableText);
      }
    };

    tableBtn?.addEventListener('click', clickHandler);
    return () => tableBtn?.removeEventListener('click', clickHandler);
  }, [showToolbar]);

  return (
    <div ref={containerRef} className={cn("rich-text-editor", className)} data-disabled={disabled} data-show-toolbar={showToolbar}>
      <ReactQuill
        ref={quillRef as any}
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