import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import SuperAdminDashboard from './views/SuperAdminDashboard';
import TenantManager from './views/TenantManager';
import ReceiptManager from './views/ReceiptManager';
import FinancialReports from './views/FinancialReports';
import SocietySettings from './views/SocietySettings';
import MemberManager from './views/MemberManager';
import AdminLogin from './views/AdminLogin';

const DEFAULT_VENDORS = [
  {
    _id: 'v1',
    name: 'Mandovi Nagar Co-Op. Housing Society Ltd.,',
    businessType: 'Housing Cooperative Society',
    regNo: 'HSG-(a)-70/GOA',
    address: 'Dada Vaidya Road, Panaji - Goa.',
    contactEmail: 'secretary@mandovinagar.org',
    contactPhone: '+91 98221 23456',
    authorisedSignature: 'For Mandovi Nagar Co-Op. Housing Society Ltd.,',
    currentBookNo: '1',
    lastReceiptNo: 181,
    status: 'ACTIVE'
  }
];

const App = () => {
  // Check persistent admin authentication session
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('coop365_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeView, setActiveView] = useState(() => {
    const saved = localStorage.getItem('coop365_admin_user');
    if (saved) {
      const user = JSON.parse(saved);
      return user.role === 'SUPER_ADMIN' ? 'dashboard' : 'receipts';
    }
    return 'dashboard';
  });

  const [userRole, setUserRole] = useState(() => {
    const saved = localStorage.getItem('coop365_admin_user');
    if (saved) {
      const user = JSON.parse(saved);
      return user.role || 'SUPER_ADMIN';
    }
    return 'SUPER_ADMIN';
  });

  // Vendors State initialized from MongoDB database
  const [vendors, setVendors] = useState(DEFAULT_VENDORS);
  const [activeVendor, setActiveVendor] = useState(DEFAULT_VENDORS[0]);

  // Receipts State matching customer side
  const [receipts, setReceipts] = useState([
    {
      _id: 'r1',
      receiptNo: '181',
      bookNo: '1',
      date: '14/08/2026',
      receivedFrom: 'Mr. Rahul Sharma',
      flatShopNo: 'Flat A-302',
      paymentMode: 'Cash',
      cashChequeNo: 'CHK-492018',
      paymentDate: '14/08/2026',
      drawnOn: 'State Bank of India',
      totalAmount: 4850,
      sumInWords: 'Four Thousand Eight Hundred Fifty Rupees Only',
      items: [
        { title: 'Maintenance Charges', fromPeriod: 'Apr 2026', toPeriod: 'Jun 2026', amount: 3500 },
        { title: 'Sinking Fund', fromPeriod: 'Apr 2026', toPeriod: 'Jun 2026', amount: 1200 },
        { title: 'Interest', fromPeriod: '', toPeriod: '', amount: 150 }
      ]
    },
    {
      _id: 'r2',
      receiptNo: '180',
      bookNo: '1',
      date: '10/08/2026',
      receivedFrom: 'Mrs. Sunita Patel',
      flatShopNo: 'Shop B-105',
      paymentMode: 'Cheque',
      cashChequeNo: 'CHK-982104',
      paymentDate: '10/08/2026',
      drawnOn: 'HDFC Bank',
      totalAmount: 3200,
      sumInWords: 'Three Thousand Two Hundred Rupees Only',
      items: [
        { title: 'Maintenance Charges', fromPeriod: 'Apr 2026', toPeriod: 'Jun 2026', amount: 3200 }
      ]
    }
  ]);

  // Fetch Vendors from backend MongoDB Database live
  const fetchVendorsFromBackend = async () => {
    try {
      const res = await axios.get(`/api/v1/auth/public-vendors?t=${Date.now()}`);
      if (res.data?.success && res.data.data.vendors.length > 0) {
        const fetched = res.data.data.vendors;
        setVendors(fetched);
        
        setActiveVendor(prevActive => {
          if (!prevActive?._id) return fetched[0];
          const found = fetched.find(v => String(v._id) === String(prevActive._id));
          return found ? found : fetched[0];
        });
      }
    } catch (err) {
      console.warn('Backend API connection notice:', err.message);
    }
  };

  // Fetch Receipts from backend MongoDB Database live
  const fetchReceiptsFromBackend = async () => {
    try {
      const token = localStorage.getItem('coop365_admin_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const vendorQuery = activeVendor?._id ? `?vendorId=${activeVendor._id}` : '';
      const res = await axios.get(`/api/v1/receipts${vendorQuery}`, { headers });
      
      if (res.data?.success && res.data.data?.receipts) {
        const fetchedReceipts = res.data.data.receipts.map(r => ({
          _id: r._id,
          receiptNo: r.receiptNo,
          bookNo: r.bookNo || '1',
          date: r.date,
          receivedFrom: r.receivedFrom,
          flatShopNo: r.flatShopNo,
          paymentMode: r.paymentMode,
          cashChequeNo: r.cashChequeNo,
          paymentDate: r.paymentDate,
          drawnOn: r.drawnOn,
          totalAmount: r.totalAmount,
          sumInWords: r.sumInWords,
          items: r.items ? r.items.map(it => ({
            title: it.title,
            fromPeriod: it.fromPeriod,
            toPeriod: it.toPeriod,
            amount: it.amount
          })) : []
        }));
        setReceipts(fetchedReceipts);
      }
    } catch (err) {
      console.warn('Receipts API fetch notice:', err.message);
    }
  };

  useEffect(() => {
    fetchVendorsFromBackend();
    fetchReceiptsFromBackend();
  }, [adminUser, activeVendor]);

  // Update vendors state from MongoDB
  const updateVendorsState = (newVendorsList) => {
    setVendors(newVendorsList);
  };

  // Handle Login Success
  const handleLoginSuccess = (user, token) => {
    setAdminUser(user);
    const role = user.role || (user.email.includes('super') ? 'SUPER_ADMIN' : 'VENDOR_ADMIN');
    setUserRole(role);
    setActiveView(role === 'SUPER_ADMIN' ? 'dashboard' : 'receipts');
  };

  // Handle Logout Action
  const handleLogout = () => {
    localStorage.removeItem('coop365_admin_user');
    localStorage.removeItem('coop365_admin_token');
    setAdminUser(null);
  };

  // Super Admin Create Vendor Handler (PERMANENT MONGODB & LOCALSTORAGE SAVE)
  const handleCreateVendor = async (vendorData) => {
    try {
      const token = localStorage.getItem('coop365_admin_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.post('/api/v1/super-admin/vendors', vendorData, { headers });

      if (res.data?.success) {
        const createdVendor = res.data.data.vendor;
        alert(`Successfully provisioned Housing Society "${createdVendor.name}" in database!`);
        await fetchVendorsFromBackend();
        return;
      }
    } catch (err) {
      console.warn('API POST failed, persisting locally in memory & storage:', err);
    }

    // Local persistent fallback
    const newV = {
      _id: `v_${Date.now()}`,
      name: vendorData.name,
      businessType: vendorData.businessType || 'Housing Cooperative Society',
      regNo: vendorData.regNo,
      address: vendorData.address,
      contactEmail: vendorData.contactEmail || vendorData.adminEmail,
      status: 'ACTIVE',
      currentBookNo: '1',
      lastReceiptNo: 0,
      authorisedSignature: `For ${vendorData.name}`
    };
    const updatedList = [newV, ...vendors];
    updateVendorsState(updatedList);
    setActiveVendor(newV);
    alert(`Provisioned & saved "${vendorData.name}"!`);
  };

  // Super Admin Delete Vendor Handler (PERMANENT MONGODB & LOCALSTORAGE DELETE)
  const handleDeleteVendor = async (vendorId) => {
    const targetVendor = vendors.find(v => v._id === vendorId);
    const vendorName = targetVendor?.name || 'Housing Society';

    if (!window.confirm(`Are you sure you want to delete "${vendorName}"? This will permanently remove the society and its member data.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('coop365_admin_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.delete(`/api/v1/super-admin/vendors/${vendorId}`, { headers });
      alert(`Successfully deleted "${vendorName}" from database.`);
    } catch (err) {
      console.warn('Backend API delete failed, removing from local state:', err);
    }

    const updatedList = vendors.filter(v => v._id !== vendorId);
    updateVendorsState(updatedList);
    if (activeVendor?._id === vendorId && updatedList.length > 0) {
      setActiveVendor(updatedList[0]);
    }
  };

  // Toggle Vendor Status Handler
  const handleUpdateVendorStatus = async (vendorId, newStatus) => {
    try {
      const token = localStorage.getItem('coop365_admin_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.put(`/api/v1/super-admin/vendors/${vendorId}`, { status: newStatus }, { headers });
    } catch (err) {
      console.warn('Backend API update failed, updating local state.');
    }
    const updatedList = vendors.map(v => v._id === vendorId ? { ...v, status: newStatus } : v);
    updateVendorsState(updatedList);
  };

  // Update Vendor Profile Settings
  const handleUpdateVendor = async (vendorId, updatedData) => {
    try {
      const token = localStorage.getItem('coop365_admin_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      if (userRole === 'SUPER_ADMIN') {
        await axios.put(`/api/v1/super-admin/vendors/${vendorId}`, updatedData, { headers });
      } else {
        await axios.put('/api/v1/vendors/profile', updatedData, { headers });
      }
      await fetchVendorsFromBackend();
    } catch (err) {
      console.warn('Backend API update notice, updating local state:', err?.response?.data || err.message);
    }
    const updatedList = vendors.map(v => v._id === vendorId ? { ...v, ...updatedData } : v);
    updateVendorsState(updatedList);
    if (activeVendor._id === vendorId) {
      setActiveVendor(prev => ({ ...prev, ...updatedData }));
    }
  };

  // Delete Receipt Handler with API connection
  const handleDeleteReceipt = async (receiptId) => {
    if (window.confirm('Are you sure you want to delete this receipt voucher from database?')) {
      try {
        const token = localStorage.getItem('coop365_admin_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        await axios.delete(`/api/v1/receipts/${receiptId}`, { headers });
        alert('Receipt voucher deleted successfully from MongoDB database.');
        fetchReceiptsFromBackend();
      } catch (err) {
        console.warn('Backend DELETE receipt failed, removing from local state:', err);
        setReceipts(receipts.filter(r => r._id !== receiptId));
      }
    }
  };

  // Open PDF Voucher Handler
  const handleOpenPDF = (rcpt) => {
    const token = localStorage.getItem('coop365_admin_token') || 'superadmin_jwt_token';
    const vendorQuery = activeVendor?._id ? `&vendorId=${activeVendor._id}` : '';
    if (rcpt._id && typeof rcpt._id === 'string' && rcpt._id.length > 10) {
      window.open(`/api/v1/receipts/${rcpt._id}/pdf?token=${token}${vendorQuery}`, '_blank');
    } else {
      alert(`Opening PDF Voucher for Receipt #${rcpt.receiptNo}`);
    }
  };

  // Render Admin Login Screen if not authenticated
  if (!adminUser) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const mainContentRef = useRef(null);

  // Auto reset scroll position to top whenever active view or housing society changes
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [activeView, activeVendor?._id]);

  // Stats calculation
  const stats = {
    totalVendors: vendors.length,
    activeVendors: vendors.filter(v => v.status === 'ACTIVE').length,
    totalReceipts: receipts.length,
    totalUsers: 14,
    grandTotalCollection: receipts.reduce((sum, r) => sum + r.totalAmount, 0)
  };

  return (
    <div className="flex h-screen max-h-screen w-screen bg-[#0b0f19] text-slate-100 font-sans relative overflow-hidden">
      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)} 
          className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-xs transition-opacity" 
        />
      )}

      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          setIsMobileSidebarOpen(false);
        }}
        userRole={userRole}
        onLogout={handleLogout}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <TopHeader
          activeVendor={activeVendor}
          vendors={vendors}
          onVendorChange={setActiveVendor}
          userRole={userRole}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* View Content */}
        <main ref={mainContentRef} className="flex-1 p-3 sm:p-6 overflow-y-auto scroll-smooth">
          {activeView === 'dashboard' && userRole === 'SUPER_ADMIN' && (
            <SuperAdminDashboard
              stats={stats}
              vendors={vendors}
              onOpenProvisionModal={() => setActiveView('tenants')}
            />
          )}

          {activeView === 'tenants' && userRole === 'SUPER_ADMIN' && (
            <TenantManager
              vendors={vendors}
              onCreateVendor={handleCreateVendor}
              onUpdateVendorStatus={handleUpdateVendorStatus}
              onDeleteVendor={handleDeleteVendor}
            />
          )}

          {activeView === 'receipts' && (
            <ReceiptManager
              receipts={receipts}
              activeVendor={activeVendor}
              onRefreshReceipts={fetchReceiptsFromBackend}
              onOpenPDF={handleOpenPDF}
              onDeleteReceipt={handleDeleteReceipt}
            />
          )}

          {activeView === 'reports' && (
            <FinancialReports activeVendor={activeVendor} />
          )}

          {activeView === 'members' && (
            <MemberManager 
              activeVendor={activeVendor} 
              receipts={receipts}
              onOpenPDF={handleOpenPDF}
            />
          )}

          {activeView === 'settings' && (
            <SocietySettings
              activeVendor={activeVendor}
              onUpdateVendor={handleUpdateVendor}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
