// Simple markdown-style text formatter for bold and code
export const formatText = (text) => {
  if (!text) return '';
  
  // Replace **bold** with <strong>bold</strong>
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Replace `code` with <code>code</code>
  formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>');
  
  // Replace newlines with <br> for proper line breaks
  formatted = formatted.replace(/\n/g, '<br>');
  
  return formatted;
};

// React component to render formatted text
export const FormattedText = ({ text, className = '' }) => {
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: formatText(text) }}
    />
  );
};