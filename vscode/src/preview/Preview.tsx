import { allFields, Note, renderer } from "@anotes/core";

export function Preview({ notes }: { notes: Note[] }) {
  return (
    <html>
      <head>
        <title>Notes Preview</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css" crossOrigin="anonymous" />
      </head>
      <body>
        <main>
          {notes.map((value, index) => (
            <Note key={index} note={value} />
          ))}
        </main>
      </body>
    </html>
  );
}

function Note({ note }: { note: Note }) {
  return (
    <section
      style={{
        margin: "1rem",
        padding: "1rem",
        backgroundColor: "white",
        color: "black",
        outline: "1px dotted black",
      }}
    >
      <Meta note={note} />
      <FieldList note={note} />
    </section>
  );
}

function Meta({ note }: { note: Note }) {
  return (
    <>
      <p>
        <strong>id</strong>: {note.id}
      </p>
      <p>
        <strong>type</strong>: {note.type}
      </p>
      <p>
        <strong>deck</strong>: {note.deck}
      </p>
      <p>
        <strong>tags</strong>: {note.tags}
      </p>
      <p>
        <strong>template</strong>: {note.template}
      </p>
    </>
  );
}

function FieldList({ note }: { note: Note }) {
  return [...allFields].map(([name, config], index) => {
    const value = note.fields[name]?.trim();
    if (value) {
      return <Field key={index} template={note.template} name={name} config={config} value={value} />;
    } else {
      return null;
    }
  });
}

function Field({ template, name, config, value }: { template: string; name: string; config: any; value: string }) {
  return (
    <div>
      <p>
        <strong>{name}</strong>:
      </p>
      <div
        dangerouslySetInnerHTML={{
          __html: config.format(value, template, renderer.toHtml({ output: "html" })),
        }}
      />
    </div>
  );
}
