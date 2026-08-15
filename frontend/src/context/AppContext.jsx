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
  panNo: "AAAAA0000A",
  panDocUrl: "",
  gstNo: "30AAAAA0000A1Z5",
  bankName: "State Bank of India",
  accountName: "Mandovi Nagar Co-Op. Housing Society Ltd.",
  accountNo: "38492019482",
  ifscCode: "SBIN0001234",
  branchName: "Panaji Branch",
  upiId: "mandovi.society@sbi",
  qrCodeUrl: "",
  authorisedSignature: "For Mandovi Nagar Co-Op. Housing Society Ltd.,"
};

export const AppProvider = ({ children }) => {
  const [residentDetails, setResidentDetails] = useState(() => {
    const savedUser = localStorage.getItem('coop365_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const v = parsed.vendor || {};
        return {
          name: parsed.name || defaultSocietyDetails.name,
          email: parsed.email || parsed.vendorEmail || defaultSocietyDetails.email,
          phone: parsed.phone || parsed.vendorPhone || defaultSocietyDetails.phone,
          role: parsed.role || defaultSocietyDetails.role,
          flatNo: parsed.flatNo || defaultSocietyDetails.flatNo,
          vendorId: parsed.vendorId || v._id || null,
          societyName: parsed.vendorName || v.name || defaultSocietyDetails.societyName,
          address: parsed.vendorAddress || v.address || defaultSocietyDetails.address,
          registrationNo: parsed.vendorRegNo || v.regNo || defaultSocietyDetails.registrationNo,
          panNo: v.panNo || defaultSocietyDetails.panNo,
          panDocUrl: v.panDocUrl || defaultSocietyDetails.panDocUrl,
          gstNo: v.gstNo || defaultSocietyDetails.gstNo,
          bankName: v.bankName || defaultSocietyDetails.bankName,
          accountName: v.accountName || defaultSocietyDetails.accountName,
          accountNo: v.accountNo || defaultSocietyDetails.accountNo,
          ifscCode: v.ifscCode || defaultSocietyDetails.ifscCode,
          branchName: v.branchName || defaultSocietyDetails.branchName,
          upiId: v.upiId || defaultSocietyDetails.upiId,
          qrCodeUrl: v.qrCodeUrl || defaultSocietyDetails.qrCodeUrl,
          authorisedSignature: v.authorisedSignature || defaultSocietyDetails.authorisedSignature
        };
      } catch (e) {}
    }
    return defaultSocietyDetails;
  });

  const [receipts, setReceipts] = useState([]);

  // Fetch live vendor/society details directly from MongoDB database or local cache
  const fetchLiveSocietyDetails = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const savedUserStr = localStorage.getItem('coop365_user');
      let userVendorId = null;
      if (savedUserStr) {
        try {
          const parsed = JSON.parse(savedUserStr);
          userVendorId = parsed.vendorId || (parsed.vendor ? parsed.vendor._id : null);
        } catch(e) {}
      }

      let vendorsList = [];
      try {
        const res = await axios.get(`${API_URL}/api/v1/auth/public-vendors?t=${Date.now()}`);
        if (res.data?.success && res.data.data?.vendors?.length > 0) {
          vendorsList = res.data.data.vendors;
        }
      } catch (e) {}

      const localSaved = localStorage.getItem('coop365_admin_vendors');
      if (localSaved) {
        try {
          const parsed = JSON.parse(localSaved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            parsed.forEach(lv => {
              if (lv && lv._id && !vendorsList.some(f => String(f._id) === String(lv._id))) {
                vendorsList.push(lv);
              }
            });
          }
        } catch (e) {}
      }

      if (vendorsList.length > 0) {
        const liveVendor = (userVendorId && vendorsList.find(v => String(v._id) === String(userVendorId))) || vendorsList[0];
        setResidentDetails(prev => ({
          ...prev,
          societyName: liveVendor.name !== undefined ? liveVendor.name : prev.societyName,
          address: liveVendor.address !== undefined ? liveVendor.address : prev.address,
          registrationNo: liveVendor.regNo !== undefined ? liveVendor.regNo : prev.registrationNo,
          panNo: liveVendor.panNo !== undefined ? liveVendor.panNo : prev.panNo,
          panDocUrl: liveVendor.panDocUrl !== undefined ? liveVendor.panDocUrl : prev.panDocUrl,
          gstNo: liveVendor.gstNo !== undefined ? liveVendor.gstNo : prev.gstNo,
          bankName: liveVendor.bankName !== undefined ? liveVendor.bankName : prev.bankName,
          accountName: liveVendor.accountName !== undefined ? liveVendor.accountName : prev.accountName,
          accountNo: liveVendor.accountNo !== undefined ? liveVendor.accountNo : prev.accountNo,
          ifscCode: liveVendor.ifscCode !== undefined ? liveVendor.ifscCode : prev.ifscCode,
          branchName: liveVendor.branchName !== undefined ? liveVendor.branchName : prev.branchName,
          upiId: liveVendor.upiId !== undefined ? liveVendor.upiId : prev.upiId,
          qrCodeUrl: liveVendor.qrCodeUrl !== undefined ? liveVendor.qrCodeUrl : prev.qrCodeUrl,
          authorisedSignature: liveVendor.authorisedSignature !== undefined ? liveVendor.authorisedSignature : prev.authorisedSignature,
          contactEmail: liveVendor.contactEmail !== undefined ? liveVendor.contactEmail : prev.contactEmail,
          contactPhone: liveVendor.contactPhone !== undefined ? liveVendor.contactPhone : prev.contactPhone,
          email: liveVendor.contactEmail || prev.email,
          phone: liveVendor.contactPhone || prev.phone
        }));
      }
    } catch (err) {
      console.warn('[AppContext] Live society MongoDB fetch notice:', err.message);
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

    // Live auto-polling every 10 seconds for Admin Settings sync
    const timer = setInterval(() => {
      fetchLiveSocietyDetails();
    }, 10000);

    return () => clearInterval(timer);
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

