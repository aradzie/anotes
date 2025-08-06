import { formatMath, Note, renderHtml } from "@anotes/core";

export function Field({ name, value }: { note: Note; name: string; value: string }) {
  try {
    const html = formatMath(value, renderHtml({ output: "html", throwOnError: false }));
    return (
      <div>
        <p style={{ borderBottom: "1px dotted lightgray" }}>
          <strong style={{ color: "blue" }}>{name}</strong>:
        </p>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  } catch (err) {
    return <pre style={{ color: "red" }}>{String(err)}</pre>;
  }
}
