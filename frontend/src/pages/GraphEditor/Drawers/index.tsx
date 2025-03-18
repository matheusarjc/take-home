import React, { useContext } from "react";
// Importe o contexto e o enum do Editor normalmente, sem usar require.
import { editor, DrawerName } from "../Editor";
import { ChooseNodeDrawer } from "./ChooseNode/ChooseNode";

export type CommonDrawerProps = {
  id?: string;
};

export const drawers: Record<DrawerName, React.FC<any>> = {
  [DrawerName.newNode]: ChooseNodeDrawer,
};

export const CurrentDrawer = () => {
  // useContext(editor) agora retorna o tipo correto
  const { drawerName, drawerProps } = useContext(editor);
  const Drawer = drawers[drawerName];

  return <>{Drawer && <Drawer key={drawerProps.id} {...drawerProps} />}</>;
};
