export function renderNotesToHtml(content: string): string {
  // Simple example: wrap lines in <p>, escape HTML.
  const escaped = content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const paragraphs = escaped
    .split("\n\n")
    .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
    .join("\n");
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Foo Preview</title>
      <style>
        body { font-family: system-ui, sans-serif; padding: 1rem; }
        p { margin: 0 0 1em; }
      </style>
    </head>
    <body>
      <h1>Foo Preview</h1>
      ${paragraphs}
    </body>
    </html>
  `;
}
