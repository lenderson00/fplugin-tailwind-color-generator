import { CanvasNode, framer } from "framer-plugin";
import { useEffect, useState } from "react";

export const useSelection = () => {
  const [selection, setSelection] = useState<CanvasNode[]>([]);

  useEffect(() => {
    return framer.subscribeToSelection(setSelection);
  }, []);

  return selection;
};
