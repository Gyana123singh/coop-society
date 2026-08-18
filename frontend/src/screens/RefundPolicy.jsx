import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  RotateCcw, 
  ArrowLeft, 
  Calendar, 
  Mail, 
  Globe, 
  Printer, 
  Search, 
  AlertOctagon, 
  CheckCircle2, 
  HelpCircle, 
  Clock, 
  CreditCard, 
  Building2, 
  Ban, 
  ShieldAlert, 
  Scale, 
  FileText,
  ChevronRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

const RefundPolicy = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    {
      id: 'section-1',
      num: 1,
      title: '1. No Refund Policy',
      icon: Ban,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            All successfully completed rent or housing-related payments made through Coop365 are final and non-refundable through the Coop365 application. Once a payment has been successfully processed and confirmed, Coop365 does not provide an option to cancel, reverse, or refund the transaction. Users are therefore requested to carefully verify all payment information before confirming a transaction.
          </p>
          <div className="bg-red-50 border border-red-200/80 p-4 rounded-2xl flex items-start space-x-3 text-red-900">
            <AlertOctagon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed font-semibold">
              All successfully completed payments are final, binding, and non-refundable through Coop365.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'section-2',
      num: 2,
      title: '2. Verify Before Making Payment',
      icon: CheckCircle2,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700 leading-relaxed">
            Before completing a payment, users are responsible for verifying:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              'Property or housing details',
              'Property owner, landlord, society, or recipient details',
              'Rent amount',
              'Payment period',
              'Any applicable charges',
              'Other transaction information displayed in the App'
            ].map((item, idx) => (
              <li key={idx} className="flex items-center space-x-2.5 bg-indigo-50/60 p-3 rounded-xl border border-indigo-100/70 text-xs font-semibold text-gray-800">
                <span className="w-2 h-2 rounded-full bg-[#5a32fa] shrink-0"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      id: 'section-3',
      num: 3,
      title: '3. Incorrect Payments',
      icon: AlertTriangle,
      content: (
        <p className="text-gray-700 leading-relaxed">
          If a user makes a payment for an incorrect amount, to an incorrect recipient, for an incorrect rental period, more than once accidentally, or using incorrect information selected by the user, Coop365 will not automatically cancel or refund the payment. The user should directly contact the relevant property owner, landlord, society, or authorized recipient to discuss any adjustment or repayment. Any repayment will be subject to an agreement between the user and the relevant recipient.
        </p>
      )
    },
    {
      id: 'section-4',
      num: 4,
      title: '4. Rent and Housing Disputes',
      icon: HelpCircle,
      content: (
        <p className="text-gray-700 leading-relaxed">
          Coop365 acts as a platform for facilitating or recording housing/rent-related payments. Coop365 does not determine the rent amount payable, rental agreement terms, security deposit obligations, maintenance charges, penalties, late fees, or adjustments to previously paid rent. Any dispute regarding rent, property, tenancy, payment obligations, or repayment must be resolved directly between the tenant/resident and the relevant property owner, landlord, society, or authorized administrator.
        </p>
      )
    },
    {
      id: 'section-5',
      num: 5,
      title: '5. Failed Transactions',
      icon: RotateCcw,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700 leading-relaxed">
            If a payment fails and no amount is debited from the user's bank account or payment method, no refund will be applicable.
          </p>
          <p className="text-gray-700 leading-relaxed">
            If an amount is debited but the transaction is subsequently marked as failed, the amount may be automatically reversed by the relevant bank, UPI provider, or payment gateway according to its own policies and processing timelines. Such a reversal is not considered a refund issued by Coop365.
          </p>
        </div>
      )
    },
    {
      id: 'section-6',
      num: 6,
      title: '6. Pending Transactions',
      icon: Clock,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700 leading-relaxed">
            A payment may temporarily appear as Pending because of bank processing delays, UPI network issues, payment gateway delays, internet connectivity problems, or technical issues.
          </p>
          <p className="text-gray-700 leading-relaxed font-semibold text-indigo-950">
            Users should not immediately make another payment for the same rent obligation while the original transaction remains pending. Users should first check the final transaction status or contact support where necessary.
          </p>
        </div>
      )
    },
    {
      id: 'section-7',
      num: 7,
      title: '7. Duplicate Transactions',
      icon: CreditCard,
      content: (
        <p className="text-gray-700 leading-relaxed">
          If a technical or payment processing issue results in a duplicate debit, the user should contact their bank/payment provider and Coop365 support with the relevant transaction details. Any reversal will be subject to verification and the applicable payment provider's procedures. Coop365 does not guarantee an immediate refund or reversal of duplicate transactions.
        </p>
      )
    },
    {
      id: 'section-8',
      num: 8,
      title: '8. Cancellation of Payments',
      icon: Ban,
      content: (
        <p className="text-gray-700 leading-relaxed">
          Once a payment has been successfully authorized and processed, it cannot be cancelled through Coop365. Users should review all transaction details carefully before selecting the final payment or confirmation option.
        </p>
      )
    },
    {
      id: 'section-9',
      num: 9,
      title: '9. Payment Gateway and Banking Issues',
      icon: Building2,
      content: (
        <p className="text-gray-700 leading-relaxed">
          Payments made through Coop365 may be processed by third-party payment gateways, banks, UPI services, or other payment service providers. Transaction processing, failed-payment reversals, settlement periods, and banking-related issues may also be governed by the terms and policies of the applicable third-party provider. Coop365 is not responsible for delays caused solely by banks, UPI networks, payment gateways, or other third-party financial service providers.
        </p>
      )
    },
    {
      id: 'section-10',
      num: 10,
      title: '10. No Return Policy',
      icon: Ban,
      content: (
        <p className="text-gray-700 leading-relaxed">
          Coop365 provides a digital housing/rent payment service and does not sell or deliver physical products. Therefore, a traditional product return or exchange policy does not apply to Coop365.
        </p>
      )
    },
    {
      id: 'section-11',
      num: 11,
      title: '11. Exceptional Legal Requirements',
      icon: Scale,
      content: (
        <p className="text-gray-700 leading-relaxed">
          Nothing in this policy is intended to remove or restrict any refund, reversal, or other right that a user is mandatorily entitled to under applicable law. Where a refund or reversal is legally required, the matter will be handled in accordance with applicable law and the relevant payment provider's procedures.
        </p>
      )
    },
    {
      id: 'section-12',
      num: 12,
      title: '12. Contact Us',
      icon: Mail,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            For questions regarding a failed, pending, or duplicate transaction, users may contact:
          </p>
          <div className="bg-[#1a1736] text-white p-6 rounded-2xl shadow-md space-y-3">
            <h4 className="text-lg font-bold text-white tracking-wide">Coop365</h4>
            <div className="flex items-center space-x-3 text-sm text-gray-200">
              <Mail className="w-4 h-4 text-[#5a32fa] shrink-0" />
              <span>Email:{' '}
                <a href="mailto:info@ckkassociates.in" className="font-bold underline hover:text-indigo-300">
                  info@ckkassociates.in
                </a>
              </span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-200">
              <Globe className="w-4 h-4 text-[#5a32fa] shrink-0" />
              <span>Website:{' '}
                <a href="https://ckkassociates.in" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-indigo-300">
                  ckkassociates.in
                </a>
              </span>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900 space-y-2">
            <p className="font-bold">Important Security Notice:</p>
            <p>
              When contacting us regarding a transaction, please provide the relevant transaction reference number and other necessary payment details. <strong className="text-red-700">Never send your UPI PIN, card PIN, CVV, banking password, or OTP.</strong>
            </p>
          </div>
        </div>
      )
    }
  ];

  const filteredSections = searchQuery.trim() === ''
    ? sections
    : sections.filter(sec => 
        sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (typeof sec.content === 'string' && sec.content.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-sans pb-16">
      
      {/* Top Header Banner */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-xl hover:bg-gray-100 cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-semibold hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-[#5a32fa] text-white flex items-center justify-center shadow-md">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">Coop365</h1>
              <p className="text-[11px] text-gray-500 font-medium">No Refund & Cancellation Policy</p>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-[#5a32fa] rounded-xl border border-indigo-100 text-xs font-bold transition-all cursor-pointer"
            title="Print or Save PDF"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print / Save PDF</span>
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* Main Header Card */}
        <div className="bg-gradient-to-r from-[#1a1736] via-[#2d265a] to-[#5a32fa] rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Official Payment Policy</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              No Refund & Cancellation Policy - Coop365
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-indigo-100 font-medium pt-1">
              <div className="flex items-center space-x-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                <Calendar className="w-3.5 h-3.5 text-indigo-300" />
                <span>Effective Date: 18 August 2026</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                <Calendar className="w-3.5 h-3.5 text-indigo-300" />
                <span>Last Updated: 18 August 2026</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-gray-200 leading-relaxed pt-2">
              This No Refund & Cancellation Policy applies to payments made through the Coop365 mobile application. Coop365 is a housing and rent management application that enables users, residents, or tenants to make housing or rent-related payments to their respective property owner, landlord, society, or authorized recipient. By making a payment through Coop365, users acknowledge and agree to the following policy.
            </p>
          </div>
        </div>

        {/* Search & Quick Navigation Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center print:hidden">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search terms inside Refund Policy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[#5a32fa] text-xs font-semibold shadow-sm text-gray-800"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs text-gray-500 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="font-bold text-gray-700 shrink-0">Sections ({filteredSections.length}):</span>
            <div className="flex items-center space-x-1">
              {sections.slice(0, 5).map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="px-2.5 py-1 bg-white hover:bg-indigo-50 text-gray-600 hover:text-[#5a32fa] rounded-lg border border-gray-200 text-[11px] font-semibold transition-all shrink-0"
                >
                  #{sec.num}
                </a>
              ))}
              <span className="text-[11px] text-gray-400">+7 more</span>
            </div>
          </div>
        </div>

        {/* Sections Content List */}
        <div className="space-y-6">
          {filteredSections.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 text-gray-500">
              <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="font-semibold text-sm">No section matching "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 text-xs font-bold text-[#5a32fa] underline"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            filteredSections.map((sec) => {
              const IconComp = sec.icon;
              return (
                <section
                  key={sec.id}
                  id={sec.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm transition-all hover:shadow-md scroll-mt-24"
                >
                  <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#5a32fa] flex items-center justify-center shrink-0">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                      {sec.title}
                    </h2>
                  </div>

                  <div className="text-sm">
                    {sec.content}
                  </div>
                </section>
              );
            })
          )}
        </div>

        {/* Important Bottom Notice */}
        <div className="mt-10 bg-amber-500 text-white rounded-3xl p-6 sm:p-8 shadow-lg text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-black/20 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <AlertOctagon className="w-4 h-4" />
            <span>Important Summary</span>
          </div>
          <p className="text-sm sm:text-base font-bold leading-relaxed max-w-3xl mx-auto">
            Successfully completed rent or housing-related payments are final and cannot be cancelled or refunded through Coop365. Users should carefully verify all payment information before confirming a transaction.
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs font-medium text-amber-100 pt-2 border-t border-white/20">
            <span>© 2026 Coop365</span>
            <span>•</span>
            <a href="mailto:info@ckkassociates.in" className="underline hover:text-white">info@ckkassociates.in</a>
            <span>•</span>
            <a href="https://ckkassociates.in" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">ckkassociates.in</a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RefundPolicy;
