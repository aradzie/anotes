NoteList =
  list:(
    ( _ Newline )*
    head:Note
    tail:(
      ( _ Newline )+ @Note
    )*
    { return [head, ...tail]; }
  )?
  ( _ Newline )* _
  { return list ?? []; }

Note =
  properties:( @Property Newline ( _ Newline )* )*
  fields:( @Field Newline ( _ Newline )* )+
  NoteEnd
  { return { properties, fields, loc: location() }; }

Property "property" =
  name:PropertyName
  value:PropertyValue
  { return { name, value, loc: location() }; }

PropertyName "property name" =
    "!type:"i { return "type"; }
  / "!deck:"i { return "deck"; }
  / "!tags:"i { return "tags"; }
  / "!template:"i { return "template"; }
  / "!id:"i { return "id"; }

PropertyValue =
  value:Text
  { return value.trim(); }

Field "field" =
  name:FieldName
  value:FieldValue
  { return { name, value, loc: location() }; }

FieldName "field name" =
  "!" name:$[- _a-z0-9]i+ ":"
  { return name; }

FieldValue =
  head:$( Text )
  tail:$( !( Newline ( PropertyName / FieldName / NoteEnd ) ) Newline Text )*
  { return [head, ...tail].join("").trim(); }

NoteEnd =
  "~~~"

Text "text" =
  $( !Newline . )*

Newline "newline" =
  $( "\r\n" / "\n" )

_ "whitespace" =
  $[ \t]*
