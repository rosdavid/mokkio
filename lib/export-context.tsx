"use client";

import React, { createContext, useContext, useState } from "react";

interface ExportContextType {
  isExporting: boolean;
  setIsExporting: (value: boolean) => void;
}

const ExportContext = createContext<ExportContextType | undefined>(undefined);

export function ExportProvider({ children }: { children: React.ReactNode }) {
  const [isExporting, setIsExporting] = useState(false);

  return (
    <ExportContext.Provider value={{ isExporting, setIsExporting }}>
      {children}
    </ExportContext.Provider>
  );
}

export function useExport() {
  const context = useContext(ExportContext);
  if (!context) {
    throw new Error("useExport must be used within an ExportProvider");
  }
  return context;
}
