import React, { useRef } from 'react';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: (el: HTMLElement) => void;
  className?: string;
  style?: React.CSSProperties;
  tagName?: keyof HTMLElementTagNameMap;
  multiline?: boolean;
}

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

  const onInput = () => {
    if (ref.current) {
      onChange(ref.current.innerHTML);
    }
  };

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={onInput}
      onFocus={(e) => onFocus?.(e.currentTarget)}
      className={`${className} outline-none focus:bg-teal-50/20 focus:ring-1 focus:ring-teal-200/50 rounded px-1 -mx-1 transition-all`}
      style={style}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
};
