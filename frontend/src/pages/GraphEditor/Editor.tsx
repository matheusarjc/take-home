// frontend/src/Editor.tsx
import { PropsWithChildren, createContext, useState } from "react";
import { DRAWER_ANIMATION_IN_MILLISECONDS } from "components/Drawer";
import { drawers } from "./Drawers";

export enum DrawerName {
  newNode,
}

export type Editor = {
  drawerName: DrawerName;
  drawerVisible: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  drawerProps: any;
  closeEditorDrawer: () => void;
  showDrawer: <T extends DrawerName>(
    type: T,
    /**
     * Automaticamente sugere os props corretos para o drawer escolhido.
     */
    props: Parameters<(typeof drawers)[T]>[0] | { id?: string }
  ) => void;
};

export const editor = createContext({} as Editor);

export function EditorProvider({ children }: PropsWithChildren) {
  const [drawerName, setDrawerName] = useState<DrawerName>(DrawerName.newNode);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerProps, setDrawerProps] = useState({});

  const showDrawer: Editor["showDrawer"] = (type, props) => {
    if (drawerVisible) {
      closeEditorDrawer();
    }
    setTimeout(
      () => {
        setDrawerName(type);
        setDrawerProps(props ?? {});
        setDrawerVisible(true);
      },
      drawerVisible ? DRAWER_ANIMATION_IN_MILLISECONDS : 0
    );
  };

  const closeEditorDrawer = () => {
    setDrawerVisible(false);
    setDrawerProps({});
  };

  return (
    <editor.Provider
      value={{
        drawerName,
        closeEditorDrawer,
        drawerVisible,
        showDrawer,
        drawerProps,
      }}>
      {children}
    </editor.Provider>
  );
}
