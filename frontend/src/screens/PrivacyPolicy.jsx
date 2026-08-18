import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Calendar, 
  Mail, 
  Globe, 
  Printer, 
  Search, 
  Lock, 
  UserCheck, 
  FileText, 
  CreditCard, 
  Building2, 
  Database, 
  AlertTriangle, 
  Key, 
  ChevronRight,
  Copy,
  Check
} from 'lucide-react';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const sections = [
    {
      id: 'section-1',
      num: 1,
      title: '1. About Coop365',
      icon: Building2,
      content: (
        <p className="text-gray-700 leading-relaxed">
          Coop365 is a simple housing and rent management application designed to help residents or tenants manage and make housing/rent payments to their respective property owner, landlord, society, or authorized administrator. The App may also allow users to view information related to rent amounts, payment status, transaction history, and other relevant housing-related records.
        </p>
      )
    },
    {
      id: 'section-2',
      num: 2,
      title: '2. Information We May Collect',
      icon: Database,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700 leading-relaxed">
            Depending on the features used within Coop365, we may collect information such as:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 font-medium">
            {[
              'Full name',
              'Mobile number',
              'Email address',
              'Residential or property information',
              'Flat, house, or unit number',
              'Property owner or landlord details',
              'Rent amount',
              'Payment and transaction information',
              'Transaction reference number',
              'Payment status and payment history',
              'Account and login information',
              'Device and basic technical information',
              'Information voluntarily submitted by users through the App'
            ].map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100/60">
                <span className="w-2 h-2 rounded-full bg-[#5a32fa] mt-2 shrink-0"></span>
                <span className="text-xs text-gray-800 font-semibold">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      id: 'section-3',
      num: 3,
      title: '3. Payment Information',
      icon: CreditCard,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Coop365 may allow users to make housing or rent payments to their respective property owner, landlord, society, or other authorized recipient. Where payments are processed through a third-party payment gateway, bank, UPI service, or other payment service provider, payment information may be processed directly by that provider in accordance with its own terms and privacy policy.
          </p>
          <div className="bg-amber-50 border border-amber-200/80 p-4 rounded-2xl flex items-start space-x-3 text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed font-medium">
              Coop365 does not intentionally store sensitive payment credentials such as complete debit or credit card numbers, CVV numbers, UPI PINs, internet banking passwords, or payment OTPs. Users should never share their passwords, PINs, OTPs, or other confidential banking credentials with anyone.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'section-4',
      num: 4,
      title: '4. How We Use Your Information',
      icon: FileText,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700 leading-relaxed">
            Information collected through Coop365 may be used to:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {[
              'Create and manage user accounts',
              'Identify residents or tenants',
              'Associate users with their respective property or property owner',
              'Facilitate housing or rent payments',
              'Maintain rent and transaction records',
              'Display payment status and payment history',
              'Provide payment confirmations and notifications',
              'Provide customer support',
              'Resolve payment-related issues or disputes',
              'Prevent fraudulent or unauthorized activity',
              'Maintain and improve the security and functionality of the App',
              'Comply with applicable legal and regulatory requirements'
            ].map((use, idx) => (
              <div key={idx} className="flex items-center space-x-2.5 p-3 bg-white rounded-xl border border-gray-100 shadow-sm text-xs font-semibold text-gray-800">
                <div className="w-5 h-5 rounded-full bg-indigo-50 text-[#5a32fa] flex items-center justify-center shrink-0 text-[10px] font-bold">
                  {idx + 1}
                </div>
                <span>{use}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'section-5',
      num: 5,
      title: '5. Sharing of Information',
      icon: UserCheck,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700 leading-relaxed">
            We may share information only when reasonably necessary to operate Coop365 or where required by law. Information may be shared with:
          </p>
          <ul className="space-y-2 text-gray-700">
            {[
              'The relevant property owner, landlord, society, or authorized administrator',
              'Payment gateways and payment processing providers',
              'Banks or financial service providers involved in processing transactions',
              'Cloud hosting and database providers',
              'Authentication and notification service providers',
              'Technical service providers supporting the App',
              'Government, regulatory, judicial, or law-enforcement authorities when legally required'
            ].map((shareItem, idx) => (
              <li key={idx} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs font-medium">
                <ChevronRight className="w-4 h-4 text-[#5a32fa] shrink-0" />
                <span className="text-gray-800">{shareItem}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      id: 'section-6',
      num: 6,
      title: '6. Data Security',
      icon: Lock,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700 leading-relaxed">
            We take reasonable administrative, technical, and organizational measures to protect users' personal information against unauthorized access, misuse, loss, alteration, or disclosure.
          </p>
          <p className="text-gray-700 leading-relaxed">
            However, no mobile application, internet transmission, electronic database, or storage system can guarantee absolute security. Users are responsible for protecting their account credentials and should immediately report any suspected unauthorized use of their Coop365 account.
          </p>
        </div>
      )
    },
    {
      id: 'section-7',
      num: 7,
      title: '7. Data Retention',
      icon: Database,
      content: (
        <p className="text-gray-700 leading-relaxed">
          We may retain personal and transaction information for as long as reasonably necessary to provide Coop365 services, maintain payment and transaction records, resolve disputes, prevent fraud or misuse, meet accounting requirements, and comply with applicable legal or regulatory obligations. When information is no longer reasonably required, it may be deleted or anonymized, subject to applicable legal requirements.
        </p>
      )
    },
    {
      id: 'section-8',
      num: 8,
      title: '8. User Rights',
      icon: UserCheck,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700 leading-relaxed">
            Subject to applicable laws, users may have the right to:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              'Request access to their personal information',
              'Request correction of inaccurate information',
              'Request deletion of eligible personal information',
              'Raise questions or concerns regarding the use of their information',
              'Request closure or deletion of their Coop365 account'
            ].map((right, idx) => (
              <div key={idx} className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100 text-xs font-semibold text-indigo-950 flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#5a32fa] shrink-0" />
                <span>{right}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'section-9',
      num: 9,
      title: '9. Account and Data Deletion',
      icon: Key,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Users may request deletion of their Coop365 account and associated personal information by emailing{' '}
            <a 
              href="mailto:info@ckkassociates.in?subject=Coop365%20Account%20Deletion%20Request"
              className="text-[#5a32fa] font-bold underline hover:text-[#4826d1]"
            >
              info@ckkassociates.in
            </a>
            . Please mention <strong className="text-gray-900">"Coop365 Account Deletion Request"</strong> in the subject line and provide sufficient information for us to identify the relevant account.
          </p>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Account Deletion Email Helper</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('info@ckkassociates.in');
                  setCopiedEmail(true);
                  setTimeout(() => setCopiedEmail(false), 2000);
                }}
                className="text-xs font-semibold text-[#5a32fa] hover:text-[#4826d1] flex items-center space-x-1 cursor-pointer"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? 'Copied Email' : 'Copy Email Address'}</span>
              </button>
            </div>
            <p className="text-xs text-gray-600">
              After verification, eligible personal information associated with the account will be deleted within a reasonable period. Certain information, particularly transaction, payment, financial, fraud-prevention, or legal records, may be retained where required or permitted by applicable law.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'section-10',
      num: 10,
      title: "10. Children's Privacy",
      icon: ShieldCheck,
      content: (
        <p className="text-gray-700 leading-relaxed">
          Coop365 is intended primarily for adults who are legally capable of entering into rental, housing, or payment arrangements. We do not knowingly collect personal information from children without appropriate authorization or consent where required by applicable law. If we become aware that personal information from a child has been collected improperly, reasonable steps will be taken to delete it.
        </p>
      )
    },
    {
      id: 'section-11',
      num: 11,
      title: '11. Third-Party Services',
      icon: Globe,
      content: (
        <p className="text-gray-700 leading-relaxed">
          Coop365 may use third-party services for payment processing, cloud hosting, database services, user authentication, notifications, analytics, and technical infrastructure. The collection and processing of information by these providers may also be governed by their respective privacy policies.
        </p>
      )
    },
    {
      id: 'section-12',
      num: 12,
      title: '12. App Permissions',
      icon: Key,
      content: (
        <p className="text-gray-700 leading-relaxed">
          Depending on the features available in Coop365, the App may request device permissions such as notifications and camera/photos/files access where needed for rent or payment-related functionality. Users can manage applicable permissions through their device settings.
        </p>
      )
    },
    {
      id: 'section-13',
      num: 13,
      title: '13. Changes to This Privacy Policy',
      icon: Calendar,
      content: (
        <p className="text-gray-700 leading-relaxed">
          We may update this Privacy Policy periodically to reflect changes to Coop365, our services, legal requirements, or privacy practices. When changes are made, the revised Privacy Policy will display an updated Last Updated date. Users are encouraged to review this Privacy Policy periodically.
        </p>
      )
    },
    {
      id: 'section-14',
      num: 14,
      title: '14. Contact Us',
      icon: Mail,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            For questions regarding this Privacy Policy, personal information, account deletion, or other privacy-related concerns regarding Coop365, please contact:
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
          <p className="text-xs text-gray-500 pt-2 border-t border-gray-100">
            We will make reasonable efforts to review and respond to privacy and data-related requests in accordance with applicable laws.
          </p>
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
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">Coop365</h1>
              <p className="text-[11px] text-gray-500 font-medium">Privacy Policy</p>
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
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Legal Document</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Privacy Policy - Coop365
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
              Coop365 ("we," "our," or "the App") respects the privacy of its users. This Privacy Policy explains how we collect, use, store, share, and protect information when users access or use the Coop365 mobile application. By accessing or using Coop365, you acknowledge the practices described in this Privacy Policy.
            </p>
          </div>
        </div>

        {/* Search & Quick Navigation Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center print:hidden">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search terms inside Privacy Policy..."
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
              <span className="text-[11px] text-gray-400">+9 more</span>
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

        {/* Acknowledgment Footer Card */}
        <div className="mt-10 bg-indigo-50/80 rounded-3xl p-6 border border-indigo-100 text-center space-y-2">
          <p className="text-xs sm:text-sm font-semibold text-indigo-950">
            By using Coop365, you acknowledge that you have read and understood this Privacy Policy.
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs font-medium text-gray-500 pt-2">
            <span>© 2026 Coop365</span>
            <span>•</span>
            <a href="mailto:info@ckkassociates.in" className="hover:text-[#5a32fa]">info@ckkassociates.in</a>
            <span>•</span>
            <a href="https://ckkassociates.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#5a32fa]">ckkassociates.in</a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
