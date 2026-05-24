import React, { useRef, useEffect } from 'react';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: (el: HTMLElement) => void;
  className?: string;
  style?: React.CSSProperties;
  tagName?: keyof HTMLElementTagNameMap;
  multiline?: boolean;
}

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '');

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  onFocus,
  className,
  style,
  tagName: Tag = 'div',
  multiline = false
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isFocused = useRef(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (ref.current) {
      const cleanValue = stripHtml(value);
      if (!initialized.current) {
        ref.current.innerText = cleanValue;
        initialized.current = true;
      } else if (!isFocused.current && ref.current.innerText !== cleanValue) {
        ref.current.innerText = cleanValue;
      }
    }
  }, [value]);

  const onInput = () => {
    if (ref.current) {
      let text = ref.current.innerText || '';
      // Clean non-breaking spaces and literal &nbsp; code that may appear
      text = text.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ');
      onChange(text);
    }
  };

  const handleBlur = () => {
    isFocused.current = false;
    onInput();
  };

  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    isFocused.current = true;
    onFocus?.(e.currentTarget);
  };

  const onPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onPaste={onPaste}
      onFocus={handleFocus}
      className={`${className} outline-none focus:bg-teal-50/20 focus:ring-1 focus:ring-teal-200/50 rounded px-1 -mx-1 transition-all`}
      style={style}
    />
  );
};
