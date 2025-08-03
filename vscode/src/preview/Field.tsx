import { FieldConfig, Note, renderHtml } from "@anotes/core";

export function Field({ note, name, config, value }: { note: Note; name: string; config: FieldConfig; value: string }) {
  try {
    const html = config.format(value, note.template, renderHtml({ output: "html", throwOnError: false }));
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
