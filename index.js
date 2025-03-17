/**
 * A script that processes the input text files and compiles the output deck file.
 * The input files are formatted in a user-readable form.
 * The output file can be imported in Anki.
 */

import { globSync, readFileSync, writeFileSync } from "node:fs"

main("_notes.txt");

function main(deckFile) {
    const notes = [];
    for (const inputFile of globSync("**/*.txt", {exclude: [deckFile]})) {
        parseFile(inputFile, notes);
    }
    console.log(`Parsed ${notes.length} note(s)`);
    console.log(`Writing file "${deckFile}"`);
    writeFileSync(deckFile, formatNotes(notes));
}

function parseFile(inputFile, notes) {
    console.log(`Parsing file "${inputFile}"`);
    const text = readFileSync(inputFile, "utf-8");

    let type = "Basic";
    let deck = "";
    let tags = "";

    let state = "front";

    let front = "";
    let back = "";

    for (let line of text.split(/\n/g)) {
        if (line.startsWith("#")) {
            continue;
        }
        if (line.startsWith("!type:")) {
            type = line.substring(6).trim();
            continue;
        }
        if (line.startsWith("!deck:")) {
            deck = line.substring(6).trim();
            continue;
        }
        if (line.startsWith("!tags:")) {
            tags = line.substring(6).trim();
            continue;
        }
        if (line.startsWith("---")) {
            state = "back";
            continue;
        }
        if (line.startsWith("===")) {
            notes.push({type, deck, tags, front, back});
            state = "front";
            front = "";
            back = "";
            continue;
        }
        if (line) {
            switch (state) {
            case "front":
                if (front) {
                    front += "\n";
                }
                front += line;
                break;
            case "back":
                if (back) {
                    back += "\n";
                }
                back += line;
                break;
            }
        }
    }
}

function formatNotes(notes) {
    const lines = [];
    lines.push(`#separator:semicolon`);
    lines.push(`#html:false`);
    lines.push(`#notetype column:1`);
    lines.push(`#deck column:2`);
    lines.push(`#tags column:3`);
    for (const {type, deck, tags, front, back} of notes) {
        lines.push([type, deck, tags, front, back].map(formatField).join(";"));
    }
    lines.push("");
    return lines.join("\n");
}

function formatField(value) {
    if (value.includes(";") || value.includes("\n") || value.includes('"')) {
        return `"${value.replaceAll('"', '""')}"`;
    } else {
        return value;
    }
}
