NoteList = ( _ LineEnd )* notes:( @Note ( _ LineEnd )* )* { return notes; }

Note = properties:Property* fields:Field* NoteEnd { return { properties, fields, loc: location() }; }

Property = @( name:PropertyName value:PropertyValue { return { name, value, loc: location() }; } ) LineEnd+

PropertyName =
    "!type:"i { return "type"; }
  / "!deck:"i { return "deck"; }
  / "!tags:"i { return "tags"; }
  / "!template:"i { return "template"; }
  / "!id:"i { return "id"; }

PropertyValue = value:$[^\r\n]* { return value.trim(); }

Field = name:FieldName value:FieldValue { return { name, value, loc: location() }; }

FieldName = "!" name:$([- a-z0-9]i+) ":" { return name; }

FieldValue =
  head:$( [^\r\n]* LineEnd )
  tail:$( !( PropertyName / FieldName / NoteEnd ) [^\r\n]* LineEnd )*
  { return [head, ...tail].join("").trim(); }

NoteEnd = "~~~" ( _ LineEnd / !. ) { return null; }

LineEnd "line separator" = [\n] { return null; }

_ "whitespace" = [ \t]* { return null; }
