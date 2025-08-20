Start = "" { return null; }

// Note file parser
// ----------------

NoteList =
  ( _ Newline )*
  nodes:Note|0.., ( _ Newline )+|
  ( _ Newline )* _
  { return nodes; }

Note =
  properties:( ( _ Newline )* @Property _ Newline )*
  fields:( ( _ Newline )* @Field _ Newline )+
  end:NoteEnd
  { return { properties, fields, end, loc: location() }; }

Property "property" =
  name:PropertyName _ value:PropertyValue
  { return { name, value, loc: location() }; }

PropertyName =
  text:(
    "!type:"i { return "type"; }
  / "!deck:"i { return "deck"; }
  / "!tags:"i { return "tags"; }
  / "!template:"i { return "template"; }
  )
  { return { text, loc: location() }; }

PropertyValue =
  text:Text
  { return { text, loc: location() }; }

Field "field" =
  name:FieldName _ value:FieldValue
  { return { name, value, loc: location() }; }

FieldName =
  "!" text:( part:( $[-_a-z0-9]i+ )|1.., _| { return part.join(" "); } ) ":"
  { return { text, loc: location() }; }

FieldValue =
  text:(
    ( Text _ )
    ( !( Newline ( PropertyName / FieldName / NoteEnd / !. ) ) Newline Text _ )*
    { return text().trim(); }
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
  fields:( ( _ Newline )* @FieldDef _ Newline )+
  cards:( ( _ Newline )* @CardDef )+
  { return { name, id, fields, cards, loc: location() } }

TypeId =
  "id" Whitespace id:( text:$[0-9]+ { return { text, loc: location() }; } )
  { return { id, value: Number.parseInt(id.text), loc: location() }; }

FieldDef =
  "field" Whitespace name:Name opt:"?"?
  { return {  name, required: !opt, loc: location() } }

CardDef =
  "card" Whitespace name:Name _ Newline
  front:( ( _ Newline )* @CardFront _ Newline )
  back:( ( _ Newline )* @CardBack _ Newline )
  styling:( ( _ Newline )* @CardStyling _ Newline )?
  { return { name, front, back, styling, loc: location() } }

CardFront =
  "front" _ Newline
  text:$( !( "~~~" / !. ) Text _ Newline )*
  "~~~"
  { return { text, loc: location() } }

CardBack =
  "back" _ Newline
  text:$( !( "~~~" / !. ) Text _ Newline )*
  "~~~"
  { return { text, loc: location() } }

CardStyling =
  "styling" _ Newline
  text:$( !( "~~~" / !. ) Text _ Newline )*
  "~~~"
  { return { text, loc: location() } }

Name =
  text:( part:( $[-_a-z0-9]i+ )|1.., Whitespace| { return part.join(" "); } )
  { return { text, loc: location() }; }

// Shared rules
// ------------

Text "text" =
  $( !( _ Newline ) . )*

Newline "newline" =
  $( "\r\n" / "\n" )

Whitespace "whitespace" =
  $[ \t]+

_ "whitespace" =
  $[ \t]*
