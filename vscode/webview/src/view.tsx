import { createContext, useContext, useState } from "react";

type ViewValue = {
  view: "compact" | "details";
  align: "left" | "center" | "width";
};

const ViewContext = createContext<{
  view: ViewValue;
  setView: (view: ViewValue) => void;
}>({
  view: { view: "compact", align: "center" },
  setView: () => {},
});

function useView() {
  return useContext(ViewContext);
}

function ViewProvider({ children }: { children: any }) {
  const [view, setView] = useState<ViewValue>({ view: "compact", align: "center" });
  return <ViewContext value={{ view, setView }}>{children}</ViewContext>;
}

export { useView, ViewProvider, type ViewValue };
