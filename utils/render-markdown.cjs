function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderInline(value) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g, '<a href="$2">$1</a>');
}

function renderMarkdown(content) {
  const lines = String(content || '').replace(/\r\n?/g, '\n').split('\n');
  const output = [];
  let paragraph = [];
  let listType = null;
  let inCode = false;
  let codeLanguage = '';
  let codeLines = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    output.push(`<p>${renderInline(paragraph.join(' '))}</p>`);
    paragraph = [];
  };

  const closeList = () => {
    if (!listType) return;
    output.push(`</${listType}>`);
    listType = null;
  };

  const openList = type => {
    if (listType === type) return;
    closeList();
    listType = type;
    output.push(`<${type}>`);
  };

  for (const line of lines) {
    const fence = line.match(/^```([A-Za-z0-9_-]*)\s*$/);
    if (fence) {
      if (!inCode) {
        flushParagraph();
        closeList();
        inCode = true;
        codeLanguage = fence[1] || '';
        codeLines = [];
      } else {
        const languageClass = codeLanguage ? ` class="language-${escapeHtml(codeLanguage)}"` : '';
        output.push(`<pre><code${languageClass}>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
        inCode = false;
        codeLanguage = '';
        codeLines = [];
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      closeList();
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      const level = heading[1].length;
      output.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      continue;
    }

    const unordered = line.match(/^[-*]\s+(.+)$/);
    if (unordered) {
      flushParagraph();
      openList('ul');
      output.push(`<li>${renderInline(unordered[1])}</li>`);
      continue;
    }

    const ordered = line.match(/^[0-9۰-۹]+\.\s+(.+)$/);
    if (ordered) {
      flushParagraph();
      openList('ol');
      output.push(`<li>${renderInline(ordered[1])}</li>`);
      continue;
    }

    const quote = line.match(/^>\s?(.+)$/);
    if (quote) {
      flushParagraph();
      closeList();
      output.push(`<blockquote>${renderInline(quote[1])}</blockquote>`);
      continue;
    }

    closeList();
    paragraph.push(line.trim());
  }

  if (inCode) {
    const languageClass = codeLanguage ? ` class="language-${escapeHtml(codeLanguage)}"` : '';
    output.push(`<pre><code${languageClass}>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
  }
  flushParagraph();
  closeList();
  return output.join('\n');
}

module.exports = { renderMarkdown };
