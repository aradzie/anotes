import { ErrorList } from "./ErrorList.js";
import { NoteList1 } from "./NoteList.js";
import { Toolbar } from "./Toolbar.js";
import { useNotes } from "./use-notes.js";
import { ViewProvider } from "./view.js";

export function App() {
  const { notes, selection, errors } = useNotes();
  return (
    <ViewProvider>
      <Toolbar />
      <NoteList1 notes={notes} selection={selection} />
      {errors.length > 0 && <ErrorList errors={errors} />}
    </ViewProvider>
  );
}
