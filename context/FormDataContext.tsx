import React, { createContext, useContext, useState, ReactNode } from "react";
import { apiService } from "../services/api";

interface DeclaredData {
  AFFILIATION?: any;
  COREEXPENSES?: any;
  EMPLOYMENT?: any;
  FAMILYINFO?: any;
  LIVINGEXPENSES?: any;
  OBLIGATIONS?: any;
  [key: string]: any;
}

interface FormDataContextType {
  declaredData: DeclaredData | null;
  isLoadingData: boolean;
  errorData: string | null;
  fetchDeclaredInfo: (idNumber: string, tpuRecid?: number) => Promise<void>;
  updateDeclaredData: (newData: Partial<DeclaredData>) => void;
}

const FormDataContext = createContext<FormDataContextType | undefined>(undefined);

export const FormDataProvider = ({ children }: { children: ReactNode }) => {
  const [declaredData, setDeclaredData] = useState<DeclaredData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [errorData, setErrorData] = useState<string | null>(null);

  const fetchDeclaredInfo = async (idNumber: string, tpuRecid?: number) => {
    try {
      setIsLoadingData(true);
      setErrorData(null);
      const response = await apiService.loan.getDeclaredInformation(idNumber, tpuRecid);
      
      if (response.SUCCEEDED && response.DATA) {
        let dataObj = response.DATA;
        if (Array.isArray(dataObj)) {
          dataObj = dataObj[0];
        }
        setDeclaredData(dataObj || {});
      } else {
        setErrorData(response.RESPONSEDESCRIPTION || "Failed to load declared info.");
        setDeclaredData({}); // Ensure we don't break UI on failure
      }
    } catch (err) {
      console.error("Failed to fetch declared information", err);
      setErrorData("An unexpected error occurred.");
      setDeclaredData({});
    } finally {
      setIsLoadingData(false);
    }
  };

  const updateDeclaredData = (newData: Partial<DeclaredData>) => {
    setDeclaredData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <FormDataContext.Provider
      value={{
        declaredData,
        isLoadingData,
        errorData,
        fetchDeclaredInfo,
        updateDeclaredData,
      }}
    >
      {children}
    </FormDataContext.Provider>
  );
};

export const useFormData = () => {
  const context = useContext(FormDataContext);
  if (context === undefined) {
    throw new Error("useFormData must be used within a FormDataProvider");
  }
  return context;
};
