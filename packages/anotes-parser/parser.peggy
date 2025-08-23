Start = "" { return null; }

// Note file parser
// ----------------

NoteList =
  nodes:( ( _ Newline )* @Note )* ( _ Newline )* _
  { return nodes; }

Note =
  properties:( ( _ Newline )* @Property _ Newline )*
  fields:( ( _ Newline )* @Field _ Newline )*
  end:( ( _ Newline )* @NoteEnd _ Newline )
  { return { properties, fields, end, loc: location() }; }

Property "property" =
  name:PropertyName _ value:PropertyValue
  { return { name, value, loc: location() }; }

PropertyName =
  text:(
    "!type:"i { return "type"; }
  / "!deck:"i { return "deck"; }
  / "!tags:"i { return "tags"; }
  )
  { return { text, loc: location() }; }

PropertyValue =
  text:( raw:Text { return raw.replaceAll(/\s+/g, " "); } )
  { return { text, loc: location() }; }

Field "field" =
  name:FieldName _ value:FieldValue
  { return { name, value, loc: location() }; }

FieldName =
  "!" text:NameParts ":"
  { return { text, loc: location() }; }

FieldValue =
  text:(
    head:( @Text _ )
    lines:( !( Newline ( FieldName / NoteEnd / !. ) ) Newline @Text _ )*
    { return [head, ...lines].join("\n").trim(); }
  )
  { return { text, loc: location() }; }

NoteEnd =
  text:"~~~"
  { return { text, loc: location() }; }

// Type file parser
// ----------------

TypeDefList =
  types:( ( _ Newline )* @TypeDef )* ( _ Newline )* _
  { return types; }

TypeDef =
  "type" Whitespace name:Name _ Newline
  id:( ( _ Newline )* @TypeId _ Newline )
  cloze:( ( _ Newline )* @Cloze _ Newline )?
  fields:( ( _ Newline )* @FieldDef _ Newline )*
  cards:( ( _ Newline )* @CardDef )*
  styling:( ( _ Newline )* @Styling _ Newline )?
  { return { name, id, cloze, fields, cards, styling, loc: location() } }

TypeId =
  "id" Whitespace id:( text:$[0-9]+ { return { text, loc: location() }; } )
  { return { id, value: Number.parseInt(id.text), loc: location() }; }

Cloze =
  text:"cloze"
  { return { text, loc: location() }; }

FieldDef =
  "field" Whitespace name:Name _ opt:"?"?
  { return {  name, required: !opt, loc: location() } }

CardDef =
  "card" Whitespace name:Name _ Newline
  front:( ( _ Newline )* @CardFront _ Newline )
  back:( ( _ Newline )* @CardBack _ Newline )
  { return { name, front, back, loc: location() } }

CardFront =
  "front" _ Newline
  text:MultilineText
  { return { text, loc: location() } }

CardBack =
  "back" _ Newline
  text:MultilineText
  { return { text, loc: location() } }

Styling =
  "styling" _ Newline
  text:MultilineText
  { return { text, loc: location() } }

MultilineText =
  lines:( !( "~~~" ) @Text _ Newline )*
  "~~~"
  { return lines.join("\n").trim(); }

Name =
  text:NameParts
  { return { text, loc: location() }; }

// Shared rules
// ------------

NameParts =
  part:( $[-_a-z0-9]i+ )|1.., Whitespace| { return part.join(" "); }

Text "text" =
  $( !( _ Newline ) . )*

Newline "newline" =
  $( "\r\n" / "\n" )

Whitespace "whitespace" =
  $[ \t]+

_ "whitespace" =
  $[ \t]*
