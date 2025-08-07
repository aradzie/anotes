import { NoteList1 } from "./NoteList.js";
import { Toolbar } from "./Toolbar.js";
import { useNotes } from "./use-notes.js";
import { ViewProvider } from "./view.js";

export function App() {
  const notes = useNotes();
  return (
    <ViewProvider>
      <Toolbar />
      <NoteList1 notes={notes} />
    </ViewProvider>
  );
}
