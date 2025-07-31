export const withTemplate = (note, template) => {
  switch (template) {
    case "Basic":
      return `${note}`;
    case "Definition":
      return `<section style="text-align: left">${note}</section>`;
    default:
      throw new Error(`Unknown template: ${template}`);
  }
};
