import CopyButton from "./CopyButton";

function highlight(source: string) {
  const tokens = source.split(/("[^"\n]*"|'[^'\n]*'|#[^\n]*|\b(?:from|import|as|def|return|for|in|print|lambda)\b|\b\d+(?:[_.]\d+)*\b|\b[A-Z][A-Za-z0-9_]*\b)/g);
  return tokens.map((token, index) => {
    let kind: string | undefined;
    if (/^["']/.test(token)) kind = "string";
    else if (token.startsWith("#")) kind = "comment";
    else if (/^(from|import|as|def|return|for|in|print|lambda)$/.test(token)) kind = "keyword";
    else if (/^\d/.test(token)) kind = "number";
    else if (/^[A-Z]/.test(token)) kind = "type";
    return kind ? <span className={`readme-token-${kind}`} key={index}>{token}</span> : token;
  });
}

export default function CodeBlock({ source, title }: { source: string; title: string }) {
  return (
    <div className="readme-code-block">
      <div className="readme-code-toolbar">
        <span>{title}</span>
        <CopyButton value={source} label={`Copy ${title}`} />
      </div>
      <pre tabIndex={0} aria-label={title}><code>{highlight(source)}</code></pre>
    </div>
  );
}
