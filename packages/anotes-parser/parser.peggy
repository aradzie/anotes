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
  / "!id:"i { return "id"; }
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

Text "text" =
  $( !( _ Newline ) . )*

Newline "newline" =
  $( "\r\n" / "\n" )

_ "whitespace" =
  $[ \t]*
