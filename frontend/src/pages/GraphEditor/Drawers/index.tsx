import { useContext } from "react";
import { DrawerName, editor } from "../Editor";
import React from "react";
import { ChooseNodeDrawer } from "./ChooseNode/ChooseNode";
import { PolicyDrawer } from "@src/components/PolicyDrawer";

export type CommonDrawerProps = {
  id?: string;
};

export const drawers: Record<DrawerName, React.FC<any>> = {
  [DrawerName.newNode]: ChooseNodeDrawer,
  [DrawerName.policy]: PolicyDrawer,
};

export const CurrentDrawer = () => {
  const { drawerName, drawerProps } = useContext(editor);
  const Drawer = drawers[drawerName];

  return <>{Drawer && <Drawer key={drawerProps.id} {...drawerProps} />}</>;
};
