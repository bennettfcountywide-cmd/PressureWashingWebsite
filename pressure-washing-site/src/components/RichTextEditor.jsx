import { useState, useRef, useEffect } from 'react';
import './RichTextEditor.css';

const RichTextEditor = ({ value, onChange, onSave, onCancel, saving, maxCharacters = 300 }) => {
  const editorRef = useRef(null);
  const [isPreview, setIsPreview] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const isInitialized = useRef(false);

  // Set initial content only once
  useEffect(() => {
    if (editorRef.current && !isInitialized.current) {
      const convertedHtml = convertTextToHtml(value);
      editorRef.current.innerHTML = convertedHtml;
      isInitialized.current = true;
      updateCharCount();
    }
  }, []);

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const applyFontSize = (size) => {
    document.execCommand('fontSize', false, '7');
    const fontElements = editorRef.current?.querySelectorAll('font[size="7"]');
    fontElements?.forEach(element => {
      element.removeAttribute('size');
      element.style.fontSize = size;
    });
    editorRef.current?.focus();
  };

  const updateCharCount = () => {
    const text = getPlainText(editorRef.current?.innerHTML || '');
    setCharCount(text.length);
  };

  const handleInput = () => {
    const html = editorRef.current?.innerHTML || '';
    const text = getPlainText(html);

    if (text.length > maxCharacters) {
      // Truncate to max characters
      const truncated = text.substring(0, maxCharacters);
      editorRef.current.textContent = truncated;
      // Move cursor to end
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      setCharCount(maxCharacters);
      onChange(editorRef.current.innerHTML);
    } else {
      setCharCount(text.length);
      onChange(html);
    }
  };

  const convertTextToHtml = (text) => {
    if (!text) return '';
    // If already contains HTML tags, return as is
    if (text.includes('<')) return text;
    // Convert plain text line breaks to HTML
    return text.replace(/\n/g, '<br>');
  };

  const getPlainText = (html) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  return (
    <div className="rich-text-editor" onClick={(e) => e.stopPropagation()}>
      <div className="rte-toolbar">
        <button
          type="button"
          onClick={() => applyFormat('bold')}
          className="rte-btn"
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => applyFormat('italic')}
          className="rte-btn"
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => applyFormat('underline')}
          className="rte-btn"
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </button>
        <div className="rte-separator"></div>
        <select
          onChange={(e) => applyFontSize(e.target.value)}
          className="rte-select"
          title="Font Size"
          defaultValue=""
        >
          <option value="" disabled>Size</option>
          <option value="0.75rem">Small</option>
          <option value="1rem">Normal</option>
          <option value="1.25rem">Large</option>
          <option value="1.5rem">X-Large</option>
        </select>
        <div className="rte-separator"></div>
        <button
          type="button"
          onClick={() => applyFormat('justifyLeft')}
          className="rte-btn"
          title="Align Left"
        >
          ☰
        </button>
        <button
          type="button"
          onClick={() => applyFormat('justifyCenter')}
          className="rte-btn"
          title="Align Center"
        >
          ☰
        </button>
        <button
          type="button"
          onClick={() => applyFormat('justifyRight')}
          className="rte-btn"
          title="Align Right"
        >
          ☰
        </button>
        <div className="rte-separator"></div>
        <button
          type="button"
          onClick={() => applyFormat('insertUnorderedList')}
          className="rte-btn"
          title="Bullet List"
        >
          •
        </button>
        <button
          type="button"
          onClick={() => applyFormat('insertOrderedList')}
          className="rte-btn"
          title="Numbered List"
        >
          1.
        </button>
        <div className="rte-separator"></div>
        <button
          type="button"
          onClick={() => applyFormat('removeFormat')}
          className="rte-btn"
          title="Clear Formatting"
        >
          ✕
        </button>
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className={`rte-btn ${isPreview ? 'active' : ''}`}
          title="Toggle Preview"
        >
          👁
        </button>
      </div>

      {/* Character counter */}
      <div className="rte-char-counter">
        <span className={charCount > maxCharacters * 0.9 ? 'warning' : ''}>
          {charCount} / {maxCharacters} characters
        </span>
      </div>

      {isPreview ? (
        <div className="rte-preview" dangerouslySetInnerHTML={{ __html: value }} />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          className="rte-content"
          onInput={handleInput}
          suppressContentEditableWarning
        />
      )}

      <div className="rte-actions">
        <button onClick={onSave} disabled={saving} className="save-btn">
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button onClick={onCancel} disabled={saving} className="cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RichTextEditor;
