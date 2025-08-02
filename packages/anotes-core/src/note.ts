export type Note = {
  id: string | null;
  type: string;
  deck: string;
  tags: string;
  template: string;
  fields: Record<string, string>;
};
