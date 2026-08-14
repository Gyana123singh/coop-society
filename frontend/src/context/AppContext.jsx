import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

const initialResidentDetails = {
  name: "Mr. Rahul Sharma",
  email: "member@mandovinagar.org",
  role: "Society Member",
  flatNo: "Flat A-302",
  societyName: "Mandovi Nagar Co-Op. Housing Society Ltd.",
  address: "Dada Vaidya Road, Panaji - Goa",
  registrationNo: "HSG-(a)-70/GOA"
};

export const AppProvider = ({ children }) => {
  const [residentDetails] = useState(initialResidentDetails);
  const [receipts, setReceipts] = useState([]);

  const addReceipt = (receipt) => {
    setReceipts((prev) => [receipt, ...prev]);
  };

  return (
    <AppContext.Provider value={{ residentDetails, receipts, addReceipt }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
