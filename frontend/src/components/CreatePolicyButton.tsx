import { useState } from "react";
import PolicyModal from "./PolicyModal";

const CreatePolicyButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition duration-300">
          ➕
        </button>
      </div>
      <PolicyModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default CreatePolicyButton;
