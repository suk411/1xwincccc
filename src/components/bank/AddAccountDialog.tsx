import { useState } from "react";
import { GameButton } from "@/components/GameButton";
import iconBank from "@/assets/bank/svg-icon_icon-bank.svg";
import iconName from "@/assets/bank/svg-icon_icon-name.svg";
import iconBankCard from "@/assets/bank/svg-icon_icon-bankCard.svg";
import iconPhone from "@/assets/bank/svg-icon_icon-phone.svg";
import iconIfscCode from "@/assets/bank/svg-icon_icon-ifscCode.svg";

interface Option {
  label: string;
  code: string;
}

const BANK_OPTIONS: Option[] = [
  { label: "State Bank of India", code: "SBI" },
  { label: "HDFC Bank", code: "HDFC" },
  { label: "ICICI Bank", code: "ICICI" },
  { label: "Axis Bank", code: "AXIS" },
  { label: "Bank of Baroda", code: "BARODA" },
  { label: "Punjab National Bank", code: "PNB" },
  { label: "Canara Bank", code: "CANARA" },
  { label: "Union Bank of India", code: "UNION" },
  { label: "Yes Bank", code: "YES" },
  { label: "Kotak Mahindra Bank", code: "KOTAK" },
  { label: "IndusInd Bank", code: "INDUS" },
  { label: "IDBI Bank", code: "IDBI" },
  { label: "Bank of India", code: "BOI" },
  { label: "Indian Bank", code: "INDIAN" },
  { label: "Central Bank of India", code: "CENTRAL" },
  { label: "Karnataka Bank", code: "KARNATAKA" },
  { label: "Standard Chartered Bank", code: "STANCHART" },
  { label: "FEDERAL BANK", code: "FEDERAL" },
  { label: "Syndicate Bank", code: "SYNDICATE" },
  { label: "Uco Bank", code: "UCO" },
  { label: "Citibank India", code: "CITI" },
  { label: "Indian Overseas Bank", code: "IOB" },
  { label: "IDFC Bank", code: "IDFC" },
  { label: "Bandhan Bank", code: "BANDHAN" },
  { label: "Equitas Bank", code: "EQUITAS" },
  { label: "India Post Payments Bank", code: "IPPB" },
  { label: "Corporation Bank", code: "CORP" },
  { label: "City Union Bank", code: "CUB" },
  { label: "PYTM PAYMENTS BANK", code: "PAYTM" },
  { label: "Karur Vysya Bank", code: "KVB" },
  { label: "Tamilnad Mercantile Bank", code: "TMB" },
  { label: "Allahabad Bank", code: "ALLAHABAD" },
  { label: "varachha co-operative bank", code: "VARACHHA" },
  { label: "Meghalaya Rural Bank", code: "MEGHALAYA_RURAL" },
  { label: "AU Small Finance Bank", code: "AU_SMALL" },
  { label: "Lakshmi Vilas Bank", code: "LVB" },
  { label: "South Indian Bank", code: "SIB" },
  { label: "Bassein catholic co-operative Bank", code: "BASSEIN" },
  { label: "Airtel Payment Bank", code: "AIRTEL_PAY" },
  { label: "State Bank of Hyderabad", code: "SBH" },
  { label: "Gp parsik bank", code: "GP_PARSIK" },
  { label: "Kerala Gramin Bank", code: "KERALA_GRAMIN" },
  { label: "RBL Bank", code: "RBL" },
  { label: "Dhanlaxmi Bank", code: "DHANLAXMI" },
  { label: "TJSB Bank", code: "TJSB" },
  { label: "Purvanchal bank", code: "PURVANCHAL" },
  { label: "Sarva Haryana Gramin Bank", code: "SARVA_HARYANA" },
  { label: "Ahmedabad District Co-Operative Bank", code: "AHMEDABAD_DIST" },
  { label: "Fino Payments Bank", code: "FINO" },
  { label: "Saraswat Cooperative Bank", code: "SARASWAT" },
  { label: "Telangana Grameena Bank", code: "TELANGANA_GRAM" },
  { label: "andhra pragathi grameena bank", code: "AP_GRAM" },
  { label: "rajasthan marudhara gramin bank", code: "RAJ_MARUDHARA" },
  { label: "Abhyudaya bank", code: "ABHYUDAYA" },
  { label: "capital small finance bank", code: "CAPITAL_SF" },
  { label: "Mizoram Rural Bank", code: "MIZORAM_RURAL" },
  { label: "Andhra Pradesh Grameena Vikas Bank", code: "AP_GVB" },
  { label: "Karnataka Vikas Grameena Bank", code: "KARNATAKA_VGB" },
  { label: "The Ahmedabad merchantile co-op bank Ltd", code: "AHMEDABAD_MERC" },
  { label: "Madhya Bihar Gramin Bank", code: "MADHYA_BIHAR" },
  { label: "NSDL Payments Bank", code: "NSDL" },
  { label: "ESAF Small Finance Bank", code: "ESAF" },
  { label: "Himachal Pradesh state cooperative bank", code: "HP_COOP" },
  { label: "Maharashtra state cooperative bank", code: "MAHA_COOP" },
  { label: "ORIENTAL BANK OF COMMERCE", code: "OBC" },
  { label: "nainital bank", code: "NAINITAL" },
  { label: "Jharkhand Rajya Gramin Bank", code: "JHARKHAND_GRAM" },
  { label: "jio payments bank", code: "JIO_PAY" },
  { label: "MAHARASHTRA GRAMIN BANK", code: "MAHA_GRAMIN" },
  { label: "AIRTEL PAYMENTS BANK", code: "AIRTEL_PAY2" },
  { label: "Uttarakhand Gramin Bank", code: "UTTARAKHAND_GRAM" },
  { label: "Equitas Small Finance Bank", code: "EQUITAS_SF" },
  { label: "Himachal Pradesh Gramin Bank", code: "HP_GRAMIN" },
  { label: "Krishna District Co-Operative Central Bank Ltd.", code: "KRISHNA_DCC" },
  { label: "RAJKOT NAGARIK SAHAKARI BANK LTD", code: "RAJKOT_NSB" },
  { label: "North East small financial bank", code: "NE_SF" },
  { label: "Catholic syrian bank", code: "CATHOLIC_SYRIAN" },
  { label: "Fincare small finance bank", code: "FINACRE" },
  { label: "Baroda Uttar Pradesh Gramin Bank", code: "BARODA_UP" },
  { label: "Dhanalakshmi bank", code: "DHANALAKSHMI" },
  { label: "Cosmos Co-operative Bank Ltd", code: "COSMOS" },
  { label: "Saurashtra gramin bank", code: "SAURASHTRA_GRAM" },
  { label: "Baroda Rajasthan kshetriya gramin bank", code: "BARODA_RAJ" },
  { label: "Suco Bank", code: "SUCO" },
  { label: "Jana small finance bank", code: "JANA_SF" },
  { label: "Dena Gujarat Gramin Bank", code: "DENA_GUJ" },
  { label: "Chaitanya Godavari Grameena Bank", code: "CHAITANYA_GOD" },
  { label: "SVC BANK", code: "SVC" },
  { label: "Bharat cooperative bank", code: "BHARAT_COOP" },
  { label: "The Surat District Co-Op. Bank Ltd.", code: "SURAT_DIST" },
  { label: "USDT", code: "USDT" },
  { label: "The Kalupur Commercial Co-operative Bank", code: "KALUPUR" },
  { label: "Prime co-operative Bank", code: "PRIME_COOP" },
  { label: "Tripura Gramin Bank", code: "TRIPURA_GRAM" },
  { label: "Zila Sahakari Bank Ltd Bareilly", code: "ZILA_BAREILLY" },
  { label: "ARYAVART Bank", code: "ARYAVART" },
  { label: "Development credit Bank", code: "DCB" },
  { label: "Sarva UP Gramin Bank", code: "SARVA_UP" },
  { label: "New India Co-Operative Bank", code: "NEW_INDIA_COOP" },
  { label: "NKGSB Co-operative Bank Ltd.", code: "NKGSB" },
  { label: "Vijaya Bank", code: "VIJAYA" },
  { label: "United Bank of India", code: "UNITED" },
  { label: "State Bank of Bikaner And Jaipur", code: "SBBJ" },
  { label: "Shri Janata Sahakari Bank LTD", code: "SHRI_JANATA" },
  { label: "Rajgurunagar Sahakari Bank", code: "RAJGURUNAGAR" },
  { label: "FEDERAL NEO BANK JUPITER", code: "FEDERAL_NEO" },
  { label: "CHHATTISGARH RAJYA GRAMIN BANK", code: "CG_GRAMIN" },
  { label: "Apna Sahakari Bank", code: "APNA" },
  { label: "GS Mahanagar Co-Op Bank Ltd", code: "GS_MAHANAGAR" },
  { label: "Bangiya Gramin Vikash Bank", code: "BANGIYA_GVB" },
  { label: "Assam Gramin Vikash Bank", code: "ASSAM_GVB" },
  { label: "Kangra Central Co-operative Bank Ltd", code: "KANGRA" },
  { label: "Punjab Gramin Bank", code: "PUNJAB_GRAM" },
  { label: "Assam gramin bikash bank", code: "ASSAM_GBB" },
  { label: "Karnataka Gramin Bank", code: "KARNATAKA_GRAM" },
  { label: "SURYODAY SMALL FINANCE BANK LIMITED", code: "SURYODAY" },
  { label: "Utkarsh Small Finance Bank", code: "UTKARSH" },
  { label: "The Meghalaya Co-operative Apex Bank", code: "MEGHALAYA_APEX" },
  { label: "UTTAR BIHAR GRAMIN BANK", code: "UTTAR_BIHAR" },
  { label: "STATE BANK OF TRAVANCORE", code: "SBT" },
  { label: "SHIVALIK SMALL FINANCE BANK", code: "SHIVALIK" },
  { label: "DAKSHIN BIHAR GRAMIN BANK", code: "DAKSHIN_BIHAR" },
  { label: "manipur rural bank", code: "MANIPUR_RURAL" },
  { label: "State bank of patiala", code: "SBP" },
  { label: "BARODA GUJARAT GRAMIN BANK", code: "BARODA_GUJ" },
  { label: "The Gujarat State Co-operative Bank Limited", code: "GUJ_STATE" },
  { label: "vasai vikas sahakari", code: "VASAI_VIKAS" },
  { label: "paschim banga gramin bank", code: "PASCHIM_BANGA" },
  { label: "VISHAPATNAM co-operative bank", code: "VISHAPATNAM" },
  { label: "Samarth Sahakari Bank Ltd", code: "SAMARTH" },
  { label: "uttarbanga kshetriya gramin bank", code: "UTTARBANGA" },
  { label: "janata sahakari bank ltd", code: "JANATA_SB" },
  { label: "the gayatri co-operative urban bank", code: "GAYATRI_COOP" },
  { label: "Jupiter Federal Bank", code: "JUPITER_FED" },
  { label: "ABHYUDAYA CO-OP. BANK LTD.", code: "ABHYUDAYA_COOP" },
  { label: "J&K Grameen Bank", code: "JK_GRAM" },
  { label: "Post Office Savings Bank", code: "POST_OFFICE" },
  { label: "SBM Bank India", code: "SBM" },
  { label: "Bank of maharashtra", code: "BOM" },
  { label: "Jind central Co-OP Bank", code: "JIND_COOP" },
  { label: "PRATHAMA Up Gramin Bank", code: "PRATHAMA" },
  { label: "State Bank of Mysore", code: "SBMYS" },
  { label: "BARODA U.P BANK", code: "BARODA_UP2" },
  { label: "PURVANCHAL GRAMIN BANK", code: "PURVANCHAL_GRAM" },
  { label: "The Varachha Co-operative Bank Ltd.,Surat", code: "VARACHHA_SURAT" },
  { label: "State Bank Of Mauritius Ltd", code: "SBMAUR" },
  { label: "Kallappanna Awade Janata Bank", code: "KAJ_BANK" },
  { label: "Jupiter federal", code: "JUPITER_FED2" },
  { label: "HIMACHAL PRADESH STATE COOPERATIVE BANK", code: "HP_STATE_COOP" },
  { label: "Pratham Bank", code: "PRATHAM" },
  { label: "Oisha Gramya bank", code: "OISHA" },
  { label: "KDCC BANK", code: "KDCC" },
  { label: "The Hasti Coop Bank", code: "HASTI" },
  { label: "District Co-Operative Central Bank Ltd", code: "DIST_CCB" },
  { label: "ODISHA GRAMYA BANK", code: "ODISHA_GRAMYA" },
  { label: "IDFC FIRST BANK LTD", code: "IDFC_FIRST" },
  { label: "The Ahmedabad district co-op Bank ltd", code: "AHMEDABAD_DIST2" },
  { label: "Tamil nadu grama bank", code: "TN_GRAMA" },
  { label: "GAYATRI BANK", code: "GAYATRI" },
  { label: "GRAMIN BANK OF ARYAVART", code: "ARYAVART_GRAM" },
  { label: "The Kalyan Janata Sahakari Bank Ltd", code: "KALYAN_JANATA" },
  { label: "Dombivli Nagari Sahakari Bank Ltd.", code: "DOMBIVLI" },
  { label: "UTKAL GRAMYA BANK", code: "UTKAL" },
  { label: "Bihar Gramin Bank", code: "BIHAR_GRAM" },
  { label: "CATHOLIC SYRIAN BANK LTD", code: "CSB" },
  { label: "Jalna Merchants Co-operative Bank", code: "JALNA" },
  { label: "THE RATNAKAR BANK LTD", code: "RATNAKAR" },
  { label: "Zila sahkari bank", code: "ZILA_SAHKARI" },
  { label: "NAGAR SAHKARI BANK LTD. MAHARAJGANJ", code: "NAGAR_SAHKARI" },
  { label: "Vananchal Gramin Bank", code: "VANANCHAL" },
  { label: "Jammu Kashmir Bank", code: "JKB" },
  { label: "Punjab Sind Bank", code: "PSB" },
  { label: "Punjab dan Sind Bank", code: "PDSB" },
  { label: "Jammu and Kashmir Bank", code: "JKB2" },
  { label: "HARYANA BANK", code: "HARYANA" },
  { label: "JILA SAHAKARI BANK", code: "JILA_SAHKARI" },
  { label: "BANASKANTHA DISTRICT CENTRAL CO-OP. BANK LTD", code: "BANASKANTHA" },
  { label: "The Rohtak Central Co-op. Bank Ltd", code: "ROHTAK" },
  { label: "ASSOCIATE CO-OP. BANK LTD", code: "ASSOCIATE_COOP" },
  { label: "The Greater Bombay Co-operative Bank Limited", code: "GREATER_BOMBAY" },
  { label: "RAJKOT NAGARIK SAHAKARI", code: "RAJKOT_NS" },
  { label: "Balasore Bhadrak Central co-operative bank", code: "BALASORE" },
  { label: "DCB Bank", code: "DCB2" },
  { label: "The Karnal Central Co-op. Bank Ltd", code: "KARNAL" },
  { label: "Yamuna Nagar Central Co-op. Bank Ltd", code: "YAMUNA" },
  { label: "Citizen credit co operative bank ltd", code: "CITIZEN_CREDIT" },
  { label: "HSBC Bank", code: "HSBC" },
  { label: "Uttar Pradesh Co Operative Bank Ltd", code: "UP_COOP" },
  { label: "BHADRADRI BANK", code: "BHADRADRI" },
  { label: "jila sahakari kendriya bank maryadit", code: "JILA_KENDRIYA" },
  { label: "SLICE SMALL FINANCE BANK", code: "SLICE" },
];

export interface BankAccount {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
}

interface AddAccountDialogProps {
  open: boolean;
  method?: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (account: BankAccount) => void;
}

const AddAccountDialog = ({ open, method = "bank_card", onOpenChange, onConfirm }: AddAccountDialogProps) => {
  const isUpi = method === "upi";
  const [bankName, setBankName] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [upiId, setUpiId] = useState("");
  const [showBankPicker, setShowBankPicker] = useState(false);
  const [bankSearch, setBankSearch] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (isUpi) {
      if (!upiId.trim()) e.upiId = "Please enter UPI ID";
      if (!accountHolder.trim()) e.accountHolder = "Please enter the recipient's name";
      if (!phone.trim()) e.phone = "Please enter your phone number";
    } else {
      if (!bankName) e.bankName = "Please select a bank";
      if (!accountHolder.trim()) e.accountHolder = "Please enter the recipient's name";
      if (!accountNumber.trim()) e.accountNumber = "Please enter your bank account number";
      if (!phone.trim()) e.phone = "Please enter your phone number";
      if (!ifsc.trim()) e.ifsc = "Please enter IFSC code";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onConfirm({
        bankName: isUpi ? "UPI" : bankName,
        bankCode: isUpi ? "UPI" : ifsc.toUpperCase(),
        accountNumber: isUpi ? upiId : accountNumber,
        accountHolder: accountHolder.trim(),
      });
      setBankName("");
      setBankCode("");
      setAccountHolder("");
      setAccountNumber("");
      setPhone("");
      setIfsc("");
      setUpiId("");
      setErrors({});
      onOpenChange(false);
    }
  };

  const handleSelectBank = (opt: Option) => {
    setBankName(opt.label);
    setBankCode(opt.code);
    setShowBankPicker(false);
    setBankSearch("");
    setErrors((prev) => ({ ...prev, bankName: "" }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start bg-black/60">
      <div className="w-full max-w-[var(--app-max-width)] mx-auto h-full flex flex-col" style={{ backgroundColor: "#3a0611" }}>
        {/* Navbar - same as earn rebate ratio tab */}
        <div className="navbar" style={{ display: "block", position: "static", width: "100%", height: "46px", zIndex: 100, background: "none" }}>
          <div className="navbar-fixed" style={{ position: "fixed", top: 0, left: 0, right: 0, width: "100%", height: "46px", background: "linear-gradient(180deg, #35030c 0%, #5b0116 100%)", color: "#fff", zIndex: 101, boxSizing: "border-box", userSelect: "none" }}>
            <div className="navbar__content" style={{ display: "flex", position: "relative", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
              <div className="navbar__content-left" style={{ position: "absolute", left: "12px", display: "flex", alignItems: "center", justifyContent: "center", height: "100%", cursor: "pointer" }} onClick={() => onOpenChange(false)}>
                <svg className="back-arrow" viewBox="0 0 24 24" style={{ width: "20px", height: "20px", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }}>
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </div>
              <div className="navbar__content-center" style={{ display: "flex", alignItems: "center", height: "100%" }}>
                <div className="navbar__content-title" style={{ fontSize: "18px", fontWeight: 400, lineHeight: 1.2, color: "#fff", textAlign: "center" }}>{isUpi ? "Add UPI" : "Add bank card"}</div>
              </div>
              <div className="navbar__content-right" style={{ position: "absolute", right: "12px" }}></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {/* Hint */}
          <div className="flex items-center gap-2 rounded-[30px] px-5 py-1.5 mb-5 text-xs"
            style={{ backgroundColor: "rgba(211, 54, 93, 0.2)", color: "rgba(255,255,255,0.6)" }}
          >
            <svg viewBox="0 0 24 24" className="w-[17.5px] h-[17.5px] shrink-0" fill="rgba(255,255,255,0.5)">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
            <span>To ensure the safety of your funds, please bind your {isUpi ? "UPI" : "bank"} account</span>
          </div>

          {isUpi ? (
            <>
              {/* UPI ID */}
              <div className="mb-9">
                <div className="flex items-center gap-2 mb-3">
                  <img src={iconBank} alt="" className="w-6 h-6 ml-1" />
                  <span className="text-white/70 text-xs font-medium">UPI ID</span>
                </div>
                <input
                  type="text"
                  placeholder="Please enter UPI ID"
                  className="w-full h-10 px-3 rounded-md text-sm text-white outline-none border border-white/10"
                  style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
                {errors.upiId && <p className="text-primary text-[11px] mt-1 ml-1">{errors.upiId}</p>}
              </div>
            </>
          ) : (
            <>
              {/* Choose a bank */}
              <div className="mb-9">
                <div className="flex items-center gap-3 mb-3">
                  <img src={iconBank} alt="" className="w-6 h-6 ml-1" />
                  <span className="text-white/70 text-xs font-medium">Choose bank</span>
                </div>
                <div
                  className="flex items-center justify-between h-[35px] px-3 rounded-md cursor-pointer text-sm border border-white/10"
                  style={{
                    background: "linear-gradient(90deg, rgb(177, 44, 73) 0%, rgb(112, 28, 50) 100%)",
                    color: "#fff",
                  }}
                  onClick={() => setShowBankPicker(!showBankPicker)}
                >
                  <span>{bankName || "Please select a bank"}</span>
                  <span className="border-solid border-white border-r-2 border-b-2 inline-block p-[3px] rotate-45 translate-y-[-2px]" />
                </div>
                {errors.bankName && <p className="text-primary text-[11px] mt-1 ml-1">{errors.bankName}</p>}
                {showBankPicker && (
                  <div className="mt-1 rounded-md overflow-hidden border border-white/10"
                    style={{ backgroundColor: "#6e1b2f" }}>
                    <div className="p-2 border-b border-white/10">
                      <input
                        type="text"
                        placeholder="Search bank..."
                        className="w-full h-8 px-2.5 rounded-full text-sm text-white outline-none border border-white/10"
                        style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                        value={bankSearch}
                        onChange={(e) => setBankSearch(e.target.value)}
                      />
                    </div>
                    <div className="max-h-40 overflow-y-auto">
                      {BANK_OPTIONS.filter((opt) =>
                        opt.label.toLowerCase().includes(bankSearch.toLowerCase())
                      ).map((opt) => (
                        <div
                          key={opt.code}
                          className="px-3 py-2.5 text-white text-sm cursor-pointer hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0"
                          onClick={() => handleSelectBank(opt)}
                        >
                          {opt.label}
                        </div>
                      ))}
                      {BANK_OPTIONS.filter((opt) =>
                        opt.label.toLowerCase().includes(bankSearch.toLowerCase())
                      ).length === 0 && (
                        <div className="px-3 py-2.5 text-white/40 text-sm text-center">No banks found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Bank account number */}
              <div className="mb-9">
                <div className="flex items-center gap-2 mb-3">
                  <img src={iconBankCard} alt="" className="w-6 h-6 ml-1" />
                  <span className="text-white/70 text-xs font-medium">Bank account number</span>
                </div>
                <input
                  type="text"
                  placeholder="Please enter your bank account number"
                  className="w-full h-10 px-3 rounded-md text-sm text-white outline-none border border-white/10"
                  style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.slice(0, 50))}
                />
                {errors.accountNumber && <p className="text-primary text-[11px] mt-1 ml-1">{errors.accountNumber}</p>}
              </div>

              {/* IFSC code */}
              <div className="mb-9">
                <div className="flex items-center gap-2 mb-3">
                  <img src={iconIfscCode} alt="" className="w-6 h-6 ml-1" />
                  <span className="text-white/70 text-xs font-medium">IFSC code</span>
                </div>
                <input
                  type="text"
                  placeholder="Please enter IFSC code"
                  className="w-full h-10 px-3 rounded-md text-sm text-white outline-none border border-white/10"
                  style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 11).toUpperCase())}
                />
                {errors.ifsc && <p className="text-primary text-[11px] mt-1 ml-1">{errors.ifsc}</p>}
              </div>
            </>
          )}

          {/* Full recipient's name */}
          <div className="mb-9">
            <div className="flex items-center gap-2 mb-3">
              <img src={iconName} alt="" className="w-6 h-6 ml-1" />
              <span className="text-white/70 text-xs font-medium">Full recipient's name</span>
            </div>
            <input
              type="text"
              placeholder="Please enter the recipient's name"
              className="w-full h-10 px-3 rounded-md text-sm text-white outline-none border border-white/10"
              style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value.slice(0, 100))}
            />
            {errors.accountHolder && <p className="text-primary text-[11px] mt-1 ml-1">{errors.accountHolder}</p>}
          </div>

          {/* Phone number */}
          <div className="mb-9">
            <div className="flex items-center gap-2 mb-3">
              <img src={iconPhone} alt="" className="w-6 h-6 ml-1" />
              <span className="text-white/70 text-xs font-medium">Phone number</span>
            </div>
            <input
              type="text"
              placeholder="Please enter your phone number"
              className="w-full h-10 px-3 rounded-md text-sm text-white outline-none border border-white/10"
              style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            />
            {errors.phone && <p className="text-primary text-[11px] mt-1 ml-1">{errors.phone}</p>}
          </div>

          {/* Save button */}
          <div className="pt-4 pb-28 flex justify-center">
            <div className="w-full max-w-[304px]">
              <GameButton
                variant="dark"
                buttonType="prompt"
                onClick={handleSave}
              >
                Save
              </GameButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAccountDialog;
