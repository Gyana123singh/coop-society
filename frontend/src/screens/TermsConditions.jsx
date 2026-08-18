import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  ArrowLeft, 
  Calendar, 
  Mail, 
  Globe, 
  Printer, 
  Search, 
  CheckCircle2, 
  ShieldAlert, 
  CreditCard, 
  Building2, 
  UserCheck, 
  AlertTriangle, 
  Scale, 
  Clock, 
  Lock, 
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';

const TermsConditions = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    {
      id: 'section-1',
      num: 1,
      title: '1. About Coop365',
      icon: Building2,
      content: (
        <p className="text-gray-700 leading-relaxed">
          Coop365 is a housing and rent management application that enables residents or tenants to manage housing-related information and make rent or housing payments to their respective property owner, landlord, society, or authorized administrator. The availability of particular features may vary depending on the property, owner, administrator, payment provider, or version of the App.
        </p>
      )
    },
    {
      id: 'section-2',
      num: 2,
      title: '2. Eligibility and User Account',
      icon: UserCheck,
      content: (
        <p className="text-gray-700 leading-relaxed">
          Users must provide accurate and current information when creating or using an account. You are responsible for maintaining the confidentiality of your login credentials and for activity carried out through your account. You must promptly notify us if you believe your account has been accessed or used without authorization.
        </p>
      )
    },
    {
      id: 'section-3',
      num: 3,
      title: '3. Rent and Housing Payments',
      icon: CreditCard,
      content: (
        <p className="text-gray-700 leading-relaxed">
          Coop365 may facilitate rent or housing-related payments between a user and the relevant property owner, landlord, society, or authorized recipient. Before making a payment, users are responsible for checking the recipient, property details, rent amount, payment period, and other transaction information displayed in the App. A payment will be treated as successful only after confirmation is received from the applicable payment service provider or the relevant system.
        </p>
      )
    },
    {
      id: 'section-4',
      num: 4,
      title: '4. Payment Processing',
      icon: CreditCard,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Payments may be processed through third-party payment gateways, banks, UPI services, or other payment service providers. Such transactions may also be subject to the terms, conditions, privacy policies, transaction limits, and security requirements of those providers.
          </p>
          <div className="bg-amber-50 border border-amber-200/80 p-4 rounded-2xl flex items-start space-x-3 text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed font-medium">
              Coop365 does not request users to disclose sensitive credentials such as UPI PINs, banking passwords, card PINs, CVVs, or payment OTPs to Coop365 personnel.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'section-5',
      num: 5,
      title: '5. Failed, Pending, or Duplicate Transactions',
      icon: Clock,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700 leading-relaxed">
            A transaction may be delayed, pending, declined, or unsuccessful because of banking systems, payment gateways, internet connectivity, incorrect payment details, technical issues, or other circumstances outside the App's direct control.
          </p>
          <p className="text-gray-700 leading-relaxed">
            If an amount is debited but the transaction is not reflected correctly, users should contact the relevant bank/payment provider and may also contact Coop365 support with the transaction reference details. Any refund or reversal for a failed or duplicate transaction will be subject to verification and the applicable bank or payment provider's processing rules and timelines.
          </p>
        </div>
      )
    },
    {
      id: 'section-6',
      num: 6,
      title: '6. Payment Disputes',
      icon: HelpCircle,
      content: (
        <p className="text-gray-700 leading-relaxed">
          Disputes concerning the actual rent amount, tenancy terms, property ownership, rent period, maintenance charges, deposits, penalties, or other obligations between a tenant and property owner should ordinarily be resolved between the relevant parties. Coop365 may provide available transaction records to assist with a payment-related inquiry but does not become a party to a tenancy or rental agreement merely by facilitating or recording a payment.
        </p>
      )
    },
    {
      id: 'section-7',
      num: 7,
      title: '7. User Responsibilities',
      icon: CheckCircle2,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700 leading-relaxed">
            When using Coop365, users agree to:
          </p>
          <ul className="space-y-2 text-gray-700">
            {[
              'Provide accurate account, property, and payment information.',
              'Verify payment details before confirming a transaction.',
              'Use the App only for lawful purposes.',
              'Keep passwords, OTPs, UPI PINs, and banking credentials confidential.',
              'Not attempt to gain unauthorized access to another user\'s account or App systems.',
              'Not use the App for fraud, money laundering, unlawful payments, abuse, or misleading transactions.',
              'Not interfere with, damage, reverse engineer, or disrupt the App or its technical infrastructure except where permitted by applicable law.'
            ].map((item, idx) => (
              <li key={idx} className="flex items-start space-x-3 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/60">
                <span className="w-2 h-2 rounded-full bg-[#5a32fa] mt-2 shrink-0"></span>
                <span className="text-xs text-gray-800 font-semibold">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      id: 'section-8',
      num: 8,
      title: '8. Property Owner or Authorized Recipient Information',
      icon: Building2,
      content: (
        <p className="text-gray-700 leading-relaxed">
          Property owner, landlord, society, or administrator information displayed in Coop365 may be provided by the relevant parties or administrators. Users should verify important payment and property information before completing transactions. We may correct, update, restrict, or remove information where reasonably necessary for security, accuracy, legal compliance, or proper operation of the App.
        </p>
      )
    },
    {
      id: 'section-9',
      num: 9,
      title: '9. Fees and Charges',
      icon: CreditCard,
      content: (
        <p className="text-gray-700 leading-relaxed">
          Coop365 may display applicable rent amounts, service charges, convenience fees, taxes, or payment processing charges before a transaction where relevant. Third-party banks or payment providers may impose their own charges. Such third-party charges are governed by the relevant provider's terms.
        </p>
      )
    },
    {
      id: 'section-10',
      num: 10,
      title: '10. Availability of the App',
      icon: Clock,
      content: (
        <p className="text-gray-700 leading-relaxed">
          We aim to keep Coop365 reasonably available and functional, but uninterrupted or error-free operation cannot be guaranteed. The App or certain features may occasionally be unavailable because of maintenance, upgrades, technical failures, payment provider outages, internet issues, security measures, or circumstances beyond reasonable control.
        </p>
      )
    },
    {
      id: 'section-11',
      num: 11,
      title: '11. Suspension or Termination',
      icon: ShieldAlert,
      content: (
        <p className="text-gray-700 leading-relaxed">
          We may restrict, suspend, or terminate access to Coop365 where reasonably necessary, including in cases of suspected fraud, misuse, security threats, violation of these Terms, legal requirements, or unauthorized activity. Users may request account closure by contacting us. Certain payment or transaction records may still be retained where required or permitted by applicable law.
        </p>
      )
    },
    {
      id: 'section-12',
      num: 12,
      title: '12. Privacy',
      icon: Lock,
      content: (
        <p className="text-gray-700 leading-relaxed">
          Personal information collected through Coop365 is handled in accordance with the Coop365 Privacy Policy. Users should review the{' '}
          <a
            href="/privacy"
            onClick={(e) => {
              e.preventDefault();
              navigate('/privacy');
            }}
            className="text-[#5a32fa] font-bold underline hover:text-[#4826d1]"
          >
            Privacy Policy
          </a>{' '}
          to understand how personal information may be collected, used, shared, retained, and protected.
        </p>
      )
    },
    {
      id: 'section-13',
      num: 13,
      title: '13. Intellectual Property',
      icon: FileText,
      content: (
        <p className="text-gray-700 leading-relaxed">
          Unless otherwise stated, the Coop365 name, application interface, software, graphics, branding, content, and related materials are owned by or licensed to the relevant rights holder and are protected by applicable intellectual property laws. Users are granted a limited, non-exclusive, non-transferable right to use the App for its intended personal or authorized purpose.
        </p>
      )
    },
    {
      id: 'section-14',
      num: 14,
      title: '14. Third-Party Services',
      icon: Globe,
      content: (
        <p className="text-gray-700 leading-relaxed">
          Coop365 may integrate with third-party services such as payment gateways, authentication providers, hosting services, notification services, or analytics providers. We are not responsible for the independent terms, policies, availability, security practices, or services of third-party providers. Users may be required to accept additional terms when using such services.
        </p>
      )
    },
    {
      id: 'section-15',
      num: 15,
      title: '15. Limitation of Liability',
      icon: ShieldAlert,
      content: (
        <p className="text-gray-700 leading-relaxed">
          To the extent permitted by applicable law, Coop365 and its operators will not be liable for indirect, incidental, special, or consequential losses arising from use of the App, third-party payment failures, unauthorized activity caused by a user's failure to secure credentials, or disputes between tenants and property owners. Nothing in these Terms excludes or limits liability that cannot legally be excluded or limited under applicable law.
        </p>
      )
    },
    {
      id: 'section-16',
      num: 16,
      title: '16. No Tenancy or Legal Relationship Created',
      icon: Scale,
      content: (
        <p className="text-gray-700 leading-relaxed">
          Use of Coop365 does not itself create a tenancy, lease, ownership interest, agency, partnership, or other legal relationship between Coop365 and a tenant, property owner, landlord, or society. Any rental or housing agreement remains between the applicable tenant/resident and property owner or other authorized party.
        </p>
      )
    },
    {
      id: 'section-17',
      num: 17,
      title: '17. Changes to These Terms',
      icon: Calendar,
      content: (
        <p className="text-gray-700 leading-relaxed">
          We may update these Terms from time to time to reflect changes to the App, payment functionality, legal requirements, security practices, or business operations. The updated version will show a revised Last Updated date. Continued use of the App after updated Terms become effective may constitute acceptance of the revised Terms, subject to applicable law.
        </p>
      )
    },
    {
      id: 'section-18',
      num: 18,
      title: '18. Governing Law',
      icon: Scale,
      content: (
        <p className="text-gray-700 leading-relaxed">
          These Terms will be governed by and interpreted in accordance with the applicable laws of India. Any dispute will be subject to the jurisdiction of the competent courts as determined under applicable law, unless another dispute-resolution process is required by law.
        </p>
      )
    },
    {
      id: 'section-19',
      num: 19,
      title: '19. Contact Us',
      icon: Mail,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            For questions regarding these Terms & Conditions, payment-related support, account concerns, or other queries regarding Coop365, please contact:
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
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">Coop365</h1>
              <p className="text-[11px] text-gray-500 font-medium">Terms & Conditions</p>
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
              <span>Official Terms & Conditions</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Terms & Conditions - Coop365
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
              These Terms & Conditions ("Terms") govern your access to and use of the Coop365 mobile application ("Coop365", "the App", "we", "our", or "us"). Please read these Terms carefully before using the App. By registering, accessing, or using Coop365, you agree to be bound by these Terms.
            </p>
          </div>
        </div>

        {/* Search & Quick Navigation Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center print:hidden">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search terms inside Terms & Conditions..."
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
              <span className="text-[11px] text-gray-400">+14 more</span>
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
            By registering for, accessing, or using Coop365, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.
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

export default TermsConditions;
