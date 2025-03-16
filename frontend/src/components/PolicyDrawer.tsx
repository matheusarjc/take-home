// frontend/src/PolicyDrawer.tsx

import React from "react";
import { Drawer } from "components/Drawer";
import PolicyForm from "./PolicyForm";

type PolicyDrawerProps = {
  onClose: () => void;
  visible: boolean;
};

export const PolicyDrawer: React.FC<PolicyDrawerProps> = ({ onClose, visible }) => {
  return (
    <Drawer
      title="Configurar Política"
      content={<PolicyForm />}
      visible={visible}
      onClose={onClose}
    />
  );
};
