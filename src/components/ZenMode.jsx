import React from "react";
import { WhisperSpinner } from "react-spinners-kit";

export default function ZenMode() {
  return (
    <div className="zen-mode">
      <WhisperSpinner size={100} loading={true} />
    </div>
  );
}