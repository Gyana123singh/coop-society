import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

const defaultSocietyDetails = {
  name: "Mr. Rahul Sharma",
  email: "member@mandovinagar.org",
  phone: "+91 98221 23456",
  role: "Society Member",
  flatNo: "Flat A-302",
  societyName: "Mandovi Nagar Co-Op. Housing Society Ltd.",
  address: "Dada Vaidya Road, Panaji - Goa",
  registrationNo: "HSG-(a)-70/GOA",
  authorisedSignature: "For Mandovi Nagar Co-Op. Housing Society Ltd.,"
};

export const AppProvider = ({ children }) => {
  const [residentDetails, setResidentDetails] = useState(() => {
    const savedUser = localStorage.getItem('coop365_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.vendor || parsed.vendorName) {
          return {
            name: parsed.name || defaultSocietyDetails.name,
            email: parsed.vendorEmail || parsed.email || defaultSocietyDetails.email,
            phone: parsed.vendorPhone || defaultSocietyDetails.phone,
            role: parsed.role || defaultSocietyDetails.role,
            flatNo: parsed.flatNo || defaultSocietyDetails.flatNo,
            societyName: parsed.vendorName || parsed.vendor?.name || defaultSocietyDetails.societyName,
            address: parsed.vendorAddress || parsed.vendor?.address || defaultSocietyDetails.address,
            registrationNo: parsed.vendorRegNo || parsed.vendor?.regNo || defaultSocietyDetails.registrationNo,
            authorisedSignature: parsed.vendor?.authorisedSignature || defaultSocietyDetails.authorisedSignature
          };
        }
      } catch (e) {}
    }
    return defaultSocietyDetails;
  });

  const [receipts, setReceipts] = useState([]);

  // Fetch live vendor/society details from backend MongoDB
  const fetchLiveSocietyDetails = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${API_URL}/api/v1/auth/public-vendors?t=${Date.now()}`);
      if (res.data?.success && res.data.data?.vendors?.length > 0) {
        const liveVendor = res.data.data.vendors[0]; // Active society profile
        setResidentDetails(prev => ({
          ...prev,
          societyName: liveVendor.name || prev.societyName,
          address: liveVendor.address || prev.address,
          registrationNo: liveVendor.regNo || prev.registrationNo,
          email: liveVendor.contactEmail || prev.email,
          phone: liveVendor.contactPhone || prev.phone,
          authorisedSignature: liveVendor.authorisedSignature || prev.authorisedSignature
        }));
      }
    } catch (err) {
      console.warn('[AppContext] Live society fetch notice:', err.message);
    }
  };

  // Fetch live stored receipts from backend database
  const fetchReceiptsFromBackend = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('coop365_token');
      if (!token) return;

      const res = await axios.get(`${API_URL}/api/v1/receipts`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.success && res.data.data?.receipts) {
        const fetchedList = res.data.data.receipts.map(r => ({
          id: r._id,
          _id: r._id,
          receiptNo: r.receiptNo,
          bookNo: r.bookNo,
          date: r.date,
          receivedFrom: r.receivedFrom,
          flatNo: r.flatShopNo,
          flatShopNo: r.flatShopNo,
          paymentMode: r.paymentMode,
          refNo: r.cashChequeNo,
          cashChequeNo: r.cashChequeNo,
          paymentDate: r.paymentDate,
          drawnOn: r.drawnOn,
          totalAmount: r.totalAmount,
          sumInWords: r.sumInWords,
          particulars: r.items ? r.items.map((it, idx) => ({
            id: idx + 1,
            name: it.title,
            from: it.fromPeriod,
            to: it.toPeriod,
            amount: String(it.amount)
          })) : []
        }));
        setReceipts(fetchedList);
      }
    } catch (err) {
      console.warn('[AppContext] Live receipts fetch notice:', err.message);
    }
  };

  useEffect(() => {
    fetchLiveSocietyDetails();
    fetchReceiptsFromBackend();
  }, []);

  const addReceipt = (receipt) => {
    setReceipts((prev) => [receipt, ...prev]);
  };

  const updateResidentDetails = (newDetails) => {
    setResidentDetails(prev => ({ ...prev, ...newDetails }));
  };

  return (
    <AppContext.Provider value={{ 
      residentDetails, 
      receipts, 
      addReceipt, 
      updateResidentDetails, 
      refreshSociety: fetchLiveSocietyDetails,
      refreshReceipts: fetchReceiptsFromBackend
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

