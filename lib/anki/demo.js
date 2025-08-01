import { builtin, Deck, Note, Package } from "./index.js";

// Create a new package.
const pkg = new Package();

// Create a deck.
const deck = new Deck({
  name: "Spanish Vocabulary",
  description: "Basic Spanish words and phrases",
});

// Create notes with the basic model
const notes = [
  new Note({
    modelId: builtin.BASIC_MODEL.modelId,
    fields: ["Hola", "Hello"],
    tags: ["spanish", "greetings"],
  }),
  new Note({
    modelId: builtin.BASIC_MODEL.modelId,
    fields: ["Gracias", "Thank you"],
    tags: ["spanish", "politeness"],
  }),
];

// Add notes to the deck.
deck.addNotes(notes, builtin.BASIC_MODEL);

// Add a deck and a model to the package
pkg.addDeck(deck);
pkg.addModel(builtin.BASIC_MODEL);

// Generate the .apkg file.
await pkg.writeToFile("demo.apkg");

console.log("✅ Package created successfully!");
