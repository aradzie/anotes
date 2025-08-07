NoteList = ( _ Newline )* notes:( @Note ( _ Newline )* )* { return notes; }

Note = properties:Property* fields:Field* NoteEnd { return { properties, fields, loc: location() }; }

Property "property" = @( name:PropertyName value:PropertyValue { return { name, value, loc: location() }; } ) Newline+

PropertyName "property name" =
    "!type:"i { return "type"; }
  / "!deck:"i { return "deck"; }
  / "!tags:"i { return "tags"; }
  / "!template:"i { return "template"; }
  / "!id:"i { return "id"; }

PropertyValue "property value" = value:Text { return value.trim(); }

Field "field" = name:FieldName value:FieldValue { return { name, value, loc: location() }; }

FieldName "field name" = "!" name:$[- _a-z0-9]i+ ":" { return name; }

FieldValue "field value" =
  head:$( Text Newline )
  tail:$( !( PropertyName / FieldName / NoteEnd ) Text Newline )*
  { return [head, ...tail].join("").trim(); }

NoteEnd "~~~" = "~~~" _ ( Newline / !. ) { return null; }

Text "text" = $( !Newline . )*

Newline "newline" = $( "\r\n" / "\n" ) { return null; }

_ "whitespace" = $[ \t]* { return null; }
