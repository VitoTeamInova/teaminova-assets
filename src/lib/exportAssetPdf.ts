export function exportAssetToPdf(asset: any, options?: { logoUrl?: string }) {
  // Build the HTML content (same as before)
  const safe = (v: any) => (v ?? '').toString();
  const formatDate = (iso?: string) => {
    try { return iso ? new Date(iso).toLocaleString() : ''; } catch { return safe(iso); }
  };

  const styles = `
    :root {
      --text: #0f172a;
      --muted: #64748b;
      --border: #e2e8f0;
      --bg: #ffffff;
    }
    * { box-sizing: border-box; }
    body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; color: var(--text); background: var(--bg); margin: 0; padding: 24px; }
    .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); padding-bottom: 12px; margin-bottom: 16px; }
    .title { font-size: 20px; font-weight: 700; }
    .meta { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px 16px; margin-bottom: 16px; }
    .label { color: var(--muted); font-size: 12px; }
    .value { font-size: 14px; }
    .section { margin-top: 16px; }
    .section h2 { font-size: 16px; margin: 0 0 8px; }
    .notes { border: 1px solid var(--border); padding: 12px; border-radius: 8px; }
    table { border-collapse: collapse; width: 100%; }
    table, th, td { border: 1px solid var(--border); }
    th, td { padding: 6px 8px; text-align: left; }
    @media print { body { padding: 0; } }
  `;

  const logoHtml = options?.logoUrl ? `<img src="${options.logoUrl}" alt="Logo" style="height:32px; object-fit:contain;"/>` : '';
  const notesHtml = safe(asset.notes);

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${safe(asset.assetName)} — Asset</title>
  <style>${styles}</style>
</head>
<body>
  <div class="header">
    <div class="title">${safe(asset.assetName)}</div>
    ${logoHtml}
  </div>

  <div class="meta">
    <div><div class="label">Collection</div><div class="value">${safe(asset.collection)}</div></div>
    <div><div class="label">Author</div><div class="value">${safe(asset.authorName)}</div></div>
    <div><div class="label">Category</div><div class="value">${safe(asset.category)}</div></div>
    <div><div class="label">Date Created</div><div class="value">${formatDate(asset.dateCreated)}</div></div>
  </div>

  ${asset.description ? `<div class="section"><h2>Description</h2><div class="value">${safe(asset.description)}</div></div>` : ''}

  ${notesHtml ? `<div class="section"><h2>Notes</h2><div class="notes">${notesHtml}</div></div>` : ''}

</body>
</html>`;

  // Print via a hidden iframe (no extra preview window)
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) return;
  doc.open();
  doc.write(html);
  doc.close();

  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } finally {
      // Cleanup after a short delay to allow print dialog to open
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }
  };
}
