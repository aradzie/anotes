NoteList =
  list:(
    head:( ( _ Newline )* @Note )
    tail:( ( _ Newline )+ @Note )*
    { return [head, ...tail]; }
  )?
  ( _ Newline )* _
  { return list ?? []; }

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
  { return { text: text.trim(), loc: location() }; }

Field "field" =
  name:FieldName _ value:FieldValue
  { return { name, value, loc: location() }; }

FieldName =
  "!" text:$[- _a-z0-9]i+ ":"
  { return { text, loc: location() }; }

FieldValue =
  head:$( Text _ )
  tail:$( !( Newline ( PropertyName / FieldName / NoteEnd / !. ) ) Newline Text _ )*
  { return { text: [head, ...tail].join("").trim(), loc: location() }; }

NoteEnd =
  text:"~~~"
  { return { text, loc: location() }; }

Text "text" =
  $( !( _ Newline ) . )*

Newline "newline" =
  $( "\r\n" / "\n" )

_ "whitespace" =
  $[ \t]*
