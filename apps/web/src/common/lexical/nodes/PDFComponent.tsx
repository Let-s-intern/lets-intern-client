'use client';

type PDFComponentProps = Readonly<{
  url: string;
  fileName: string;
}>;

export default function PDFComponent({ url, fileName }: PDFComponentProps) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.fileName}>📄 {fileName}</span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.downloadLink}
        >
          다운로드
        </a>
      </div>
      <iframe src={url} style={styles.iframe} title={fileName} />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#fafafa',
    maxWidth: '600px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #e0e0e0',
  },
  fileName: {
    fontWeight: 600,
    fontSize: '14px',
    color: '#333',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  downloadLink: {
    fontSize: '13px',
    color: '#1a73e8',
    textDecoration: 'none',
    flexShrink: 0,
  },
  iframe: {
    width: '100%',
    height: '500px',
    border: 'none',
  },
};
