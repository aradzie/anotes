import { parse } from "./parser.js";

const input = `
!id: 123

!front:
abc
!back:
xyz
uvw
~~~ `;

const nodes = parse(input);

console.log(JSON.stringify(nodes, null, 2));
