import { ErrorList } from "./ErrorList.js";
import { NoteList1 } from "./NoteList.js";
import { Toolbar } from "./Toolbar.js";
import { useNotes } from "./use-notes.js";
import { ViewProvider } from "./view.js";

export function App() {
  const [notes, errors] = useNotes();
  return (
    <ViewProvider>
      <Toolbar />
      <NoteList1 notes={notes} />
      {errors.length > 0 && <ErrorList errors={errors} />}
    </ViewProvider>
  );
}
