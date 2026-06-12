import CryptoJS from "crypto-js";
import { Platform } from "react-native";
import { decryptDetails, encryptData } from "./dataSecurity";
import { getToken, saveToken, saveRefreshToken, deleteToken, deleteRefreshToken, saveIdNumber } from "./secureStore";

let cachedDeviceId: string | null = null;

export function getDeviceId(): string {
  if (!cachedDeviceId) {
    cachedDeviceId = "de5c1f3d-a4ec-4e2b-9042-f41e8726e9e3".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }
  return cachedDeviceId;
}

interface ParamItem {
  name: string;
  value: string;
  op: string;
}

interface RequestDetailBody {
  requestdetail: string;
}

export const BASE_URL = "https://demo.finnovator.com.sa:8900";

/**
 * Format a Date to DDMMYYYYTHHmmss format
 * Example: 09042026T141051
 */
export function formatTimestamp(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${day}${month}${year}T${hours}${minutes}${seconds}`;
}

export interface ApiResponse<T = any> {
  SUCCEEDED: boolean;
  STATUSCODE: number;
  TPURECID: number;
  TRANSACTIONID: number;
  RESPONSESTATUS: boolean;
  RESPONSECODE: string;
  RESPONSEDESCRIPTION: string;
  RESPONSETYPE: string;
  RESPONSEPOPUP: boolean;
  MESSAGETITLE: string;
  MESSAGETEXT: string;
  BUTTONTEXT: string;
  DEEPLINK: string;
  BROKENRULES: string[] | null;
  NEXTSTAGEDETAILS: {
    WORKFLOWID: number;
    STAGENAME: string;
    PARAMETER: any;
    DEFINITION: string;
    SCREENCODE: string;
    SCREENNAME1: string;
    SCREENNAME2: string;
    SCREENNAME3: string;
    SCREENADDRESS1: string;
    SCREENADDRESS2: string;
    SCREENADDRESS3: string;
    SEQUENCE: number;
    TOTALSTAGES: number;
    CURRENTSTAGE: number;
    ALLOWRETURN: boolean;
    MODULEID: number;
  } | null;
  TRANSACTIONDETAILS: any;
  DATA: T[];
}

/**
 * Reusable helper to make POST request with wrapped requestdetail parameters
 */
const FALLBACK_TO_MOCK_ON_ERROR = false;

/**
 * Custom Mock Generator to unblock frontend development and testing
 * when the sandbox API returns server errors, 404s, or exceptions.
 */
function getMockResponse(path: string, customFields: any): any {
  const pathLower = path.toLowerCase();
  const isRegister = pathLower.includes("register");
  const isLogin = pathLower.includes("login");
  const isVerifyOtp =
    pathLower.includes("verifyotp") || pathLower.includes("validateotp");
  const isNafath = pathLower.includes("nafath");
  const isGenerateOtp = pathLower.includes("generateotp");
  const isUpdateDevice = pathLower.includes("updatedevice");
  const tpuRecId = 987654;
  const transactionId = 123456;

  if (isRegister) {
    return {
      SUCCEEDED: true,
      STATUSCODE: 200,
      TPURECID: tpuRecId,
      TRANSACTIONID: transactionId,
      RESPONSESTATUS: true,
      RESPONSECODE: "SUCCESS",
      RESPONSEDESCRIPTION: "Registration Simulated (Sandbox Fallback)",
      RESPONSETYPE: "success",
      RESPONSEPOPUP: true,
      MESSAGETITLE: "Registration Successful",
      MESSAGETEXT:
        "User Registration completed successfully! Proceeding to OTP verification.",
      BUTTONTEXT: "Proceed to OTP",
      DEEPLINK: "",
      BROKENRULES: null,
      NEXTSTAGEDETAILS: {
        WORKFLOWID: 1,
        STAGENAME: "UISOTP",
        PARAMETER: null,
        DEFINITION: "",
        SCREENCODE: "UISOTP",
        SCREENNAME1: "OTP Verification",
        SCREENNAME2: "",
        SCREENNAME3: "",
        SCREENADDRESS1: "",
        SCREENADDRESS2: "",
        SCREENADDRESS3: "",
        SEQUENCE: 2,
        TOTALSTAGES: 10,
        CURRENTSTAGE: 2,
        ALLOWRETURN: true,
        MODULEID: 3,
      },
      TRANSACTIONDETAILS: null,
      DATA: [],
    };
  }

  if (isLogin) {
    return {
      SUCCEEDED: true,
      STATUSCODE: 200,
      TPURECID: tpuRecId,
      TRANSACTIONID: transactionId,
      RESPONSESTATUS: true,
      RESPONSECODE: "SUCCESS",
      RESPONSEDESCRIPTION: "Sign In Simulated (Sandbox Fallback)",
      RESPONSETYPE: "success",
      RESPONSEPOPUP: true,
      MESSAGETITLE: "Welcome Back",
      MESSAGETEXT: "Sign In completed successfully in Sandbox Fallback Mode!",
      BUTTONTEXT: "Proceed",
      DEEPLINK: "",
      BROKENRULES: null,
      NEXTSTAGEDETAILS: {
        WORKFLOWID: 1,
        STAGENAME: "UISOTP",
        PARAMETER: null,
        DEFINITION: "",
        SCREENCODE: "UISOTP",
        SCREENNAME1: "OTP Verification",
        SCREENNAME2: "",
        SCREENNAME3: "",
        SCREENADDRESS1: "",
        SCREENADDRESS2: "",
        SCREENADDRESS3: "",
        SEQUENCE: 2,
        TOTALSTAGES: 10,
        CURRENTSTAGE: 2,
        ALLOWRETURN: true,
        MODULEID: 3,
      },
      TRANSACTIONDETAILS: null,
      DATA: [
        {
          IDNUMBER: customFields.idNumber || "1001123530",
          TPURECID: tpuRecId,
          FULLNAME: "Mock User",
          ISDEVICEAUTHENTICATED: true,
          ISIDEXPIRING: false,
          ISUSERAUTHENTICATED: true,
          OTPREQUIRED: false,
          AUTHTOKEN: "MOCK_AUTH_TOKEN_77777",
          REFRESHTOKEN: "MOCK_REFRESH_TOKEN_88888",
          TOKENEXPIRY: "2026-06-01T18:00:00",
          IDLETIME: 2,
          RECAPTCHA: false,
          FREEZEDEVICE: false,
          FREEZETIME: null,
          FREEZEDURATION: 0,
          BLOCKDEVICE: false,
          REMAININGTRIES: 5,
        },
      ],
    };
  }

  if (isGenerateOtp) {
    return {
      SUCCEEDED: true,
      STATUSCODE: 200,
      TPURECID: tpuRecId,
      TRANSACTIONID: transactionId,
      RESPONSESTATUS: true,
      RESPONSECODE: "SUCCESS",
      RESPONSEDESCRIPTION: "OTP Generated (Sandbox Fallback)",
      RESPONSETYPE: "success",
      RESPONSEPOPUP: false,
      MESSAGETITLE: "Success",
      MESSAGETEXT: "OTP has been generated successfully.",
      BUTTONTEXT: "Ok",
      DEEPLINK: "",
      BROKENRULES: null,
      NEXTSTAGEDETAILS: null,
      TRANSACTIONDETAILS: null,
      DATA: [],
    };
  }

  if (isUpdateDevice) {
    return {
      SUCCEEDED: true,
      STATUSCODE: 200,
      TPURECID: tpuRecId,
      TRANSACTIONID: transactionId,
      RESPONSESTATUS: true,
      RESPONSECODE: "MOBUPDATE_PASS",
      RESPONSEDESCRIPTION: "Device Updated Successfully",
      RESPONSETYPE: "success",
      RESPONSEPOPUP: false,
      MESSAGETITLE: "Success",
      MESSAGETEXT: "Device updated successfully.",
      BUTTONTEXT: "Ok",
      DEEPLINK: "",
      BROKENRULES: null,
      NEXTSTAGEDETAILS: null,
      TRANSACTIONDETAILS: null,
      DATA: [
        {
          TPURECID: tpuRecId,
          RECAPTCHA: false,
          FREEZEDEVICE: false,
          FREEZETIME: null,
          FREEZEDURATION: 0,
          BLOCKDEVICE: false,
          REMAININGTRIES: 5
        }
      ],
    };
  }

  if (isVerifyOtp) {
    return {
      SUCCEEDED: true,
      STATUSCODE: 200,
      TPURECID: tpuRecId,
      TRANSACTIONID: transactionId,
      RESPONSESTATUS: true,
      RESPONSECODE: "MOBUPDATE_PASS",
      RESPONSEDESCRIPTION: "OTP Validated Successfully",
      RESPONSETYPE: "success",
      RESPONSEPOPUP: true,
      MESSAGETITLE: "Verification Completed",
      MESSAGETEXT:
        "Your OTP has been successfully verified (Sandbox Fallback).",
      BUTTONTEXT: "Proceed",
      DEEPLINK: "",
      BROKENRULES: null,
      NEXTSTAGEDETAILS: {
        WORKFLOWID: 1,
        STAGENAME: "UISNAFATH",
        PARAMETER: null,
        DEFINITION: "",
        SCREENCODE: "UISNAFATH",
        SCREENNAME1: "Nafath Verification",
        SCREENNAME2: "",
        SCREENNAME3: "",
        SCREENADDRESS1: "",
        SCREENADDRESS2: "",
        SCREENADDRESS3: "",
        SEQUENCE: 3,
        TOTALSTAGES: 10,
        CURRENTSTAGE: 3,
        ALLOWRETURN: true,
        MODULEID: 3,
      },
      TRANSACTIONDETAILS: null,
      DATA: [
        {
          OTPTOKEN: "MOCK_OTP_TOKEN_9999",
          OTPUUID: "MOCK_OTP_UUID_8888",
          EVENTID: "3",
          RECAPTCHA: false,
          FREEZEDEVICE: false,
          FREEZETIME: null,
          FREEZEDURATION: null,
          BLOCKDEVICE: false,
          REMAININGTRIES: 3,
        },
      ],
    };
  }

  if (pathLower.includes("nafathrequest")) {
    return {
      SUCCEEDED: true,
      STATUSCODE: 200,
      TPURECID: tpuRecId,
      TRANSACTIONID: transactionId,
      RESPONSESTATUS: true,
      RESPONSECODE: "REGISTER_PASS",
      RESPONSEDESCRIPTION: "Nafath Request Initiated",
      RESPONSETYPE: "success",
      RESPONSEPOPUP: false,
      MESSAGETITLE: "Nafath Code",
      MESSAGETEXT: "Please match the code 77 on Nafath app",
      BUTTONTEXT: "",
      DEEPLINK: "",
      BROKENRULES: null,
      NEXTSTAGEDETAILS: null,
      TRANSACTIONDETAILS: null,
      DATA: [
        {
          TPURECID: tpuRecId,
          STATUS: "WAITING",
          TRANSID: "MOCK_TRANS_12345",
          RANDOM: 77,
          REMAININGTRIES: 10,
          NAFATHVERIFIED: false,
          MOBILEVERIFIED: false,
        },
      ],
    };
  }

  if (pathLower.includes("nafathcheckstatus")) {
    return {
      SUCCEEDED: true,
      STATUSCODE: 200,
      TPURECID: tpuRecId,
      TRANSACTIONID: transactionId,
      RESPONSESTATUS: true,
      RESPONSECODE: "REGISTER_PASS",
      RESPONSEDESCRIPTION: "Nafath Completed Successfully",
      RESPONSETYPE: "success",
      RESPONSEPOPUP: true,
      MESSAGETITLE: "Identity Verified",
      MESSAGETEXT:
        "Your identity has been successfully verified via Nafath national portal.",
      BUTTONTEXT: "Continue",
      DEEPLINK: "",
      BROKENRULES: null,
      NEXTSTAGEDETAILS: {
        WORKFLOWID: 1,
        STAGENAME: "UITERMS",
        PARAMETER: null,
        DEFINITION: "",
        SCREENCODE: "UITERMS",
        SCREENNAME1: "Terms and Conditions",
        SCREENNAME2: "",
        SCREENNAME3: "",
        SCREENADDRESS1: "",
        SCREENADDRESS2: "",
        SCREENADDRESS3: "",
        SEQUENCE: 4,
        TOTALSTAGES: 10,
        CURRENTSTAGE: 4,
        ALLOWRETURN: true,
        MODULEID: 3,
      },
      TRANSACTIONDETAILS: null,
      DATA: [
        {
          TPURECID: tpuRecId,
          STATUS: "COMPLETED",
          TRANSID: "MOCK_TRANS_12345",
          REMAININGTRIES: 10,
          NAFATHVERIFIED: true,
          MOBILEVERIFIED: true,
        },
      ],
    };
  }

  if (isNafath) {
    return {
      SUCCEEDED: true,
      STATUSCODE: 200,
      TPURECID: tpuRecId,
      TRANSACTIONID: transactionId,
      RESPONSESTATUS: true,
      RESPONSECODE: "SUCCESS",
      RESPONSEDESCRIPTION: "Nafath Verified (Sandbox Fallback)",
      RESPONSETYPE: "success",
      RESPONSEPOPUP: true,
      MESSAGETITLE: "Nafath Approved",
      MESSAGETEXT:
        "Nafath identity verification approved successfully (Sandbox Fallback).",
      BUTTONTEXT: "Proceed",
      DEEPLINK: "",
      BROKENRULES: null,
      NEXTSTAGEDETAILS: null,
      TRANSACTIONDETAILS: null,
      DATA: [],
    };
  }

  if (pathLower.includes("getdashboard")) {
    return {
      SUCCEEDED: true,
      STATUSCODE: 200,
      TPURECID: null,
      TRANSACTIONID: null,
      RESPONSESTATUS: true,
      RESPONSECODE: "DASHBOARD_FETCH_SUCCESS",
      RESPONSEDESCRIPTION: "Dashboard data fetched successfully.",
      RESPONSETYPE: "success",
      RESPONSEPOPUP: false,
      MESSAGETITLE: "Title Not Found",
      MESSAGETEXT: "Message Not Found",
      BUTTONTEXT: "",
      DEEPLINK: "",
      BROKENRULES: null,
      NEXTSTAGEDETAILS: null,
      TRANSACTIONDETAILS: null,
      DATA: {
        SLIDE_SHOW: [],
        CURRENT_APPLICATIONS: [
          {
            DATATABLENAME: "CURRENT APPLICATIONS",
            APPLICATIONNO: 50283,
            APPLICATIONDATE: "2026-04-09T12:24:02.3",
            MODULENAME: "Retail Loan Origination",
            WORKFLOWNAME: "Tawarruq New Application",
            STAGENAME: "Contract Sign",
            PRODUCTNAME: "Tawarruq",
            SUBPRODUCTNAME: "Tawarruq Retail",
            APPLICATIONSTATUS: "New Application",
            SCHEMEID: 4,
            REQUESTAMOUNT: 14001,
            REQUESTTENURE: 18,
            INSTALLMENTAMOUNT: 995.63,
            PROFITAMOUNT: 3920.28,
            INSURANCEAMOUNT: 0,
            ASSETAMOUNT: 14001,
            CAPITALIZEDCHARGEAMOUNT: 0,
            AMORTIZEDCHARGEAMOUNT: 0,
            PROFITRATE: 28,
            PROFITAPR: 40.6134,
            PROFITIRR: 32.8632,
            OTHERCHARGEAMOUNT: 0,
            CURRENTLEVEL: "4",
            CURRENTLEVELDESC: "Digital Signing",
            ASSETNAME: "ALUMINUM",
            ASSETPIC1: null,
            PARAMETER: "",
            DEFINITION: "tabnav/sign-contract",
            SCREENCODE: "UICONTRACTSCREEN",
            SCREENNAME1: "Contract Screen",
            SCREENNAME2: "شاشة العقد",
            SCREENNAME3: "شاشة العقد",
            SCREENADDRESS1: "tabnav/sign-contract",
            SCREENADDRESS2: "tabnav/sign-contract",
            SCREENADDRESS3: "tabnav/sign-contract",
            TOTALSTAGES: 12,
            CURRENTSTAGE: 8,
            SEQUENCE: 19,
            MODULEID: 1,
            WORKFLOWDETAILRECID: 11,
            WORKFLOWID: 1,
            ALLOWRETURN: false
          },
          {
            DATATABLENAME: "CURRENT APPLICATIONS",
            APPLICATIONNO: 50282,
            APPLICATIONDATE: "2026-04-09T11:41:13.877",
            MODULENAME: "Retail Loan Origination",
            WORKFLOWNAME: "Tawarruq New Application",
            STAGENAME: "Final Offer",
            PRODUCTNAME: "Tawarruq",
            SUBPRODUCTNAME: "Tawarruq Retail",
            APPLICATIONSTATUS: "New Application",
            SCHEMEID: 6,
            REQUESTAMOUNT: 23501,
            REQUESTTENURE: 36,
            INSTALLMENTAMOUNT: 1201.16,
            PROFITAMOUNT: 19740.84,
            INSURANCEAMOUNT: 0,
            ASSETAMOUNT: 23501,
            CAPITALIZEDCHARGEAMOUNT: 0,
            AMORTIZEDCHARGEAMOUNT: 0,
            PROFITRATE: 28,
            PROFITAPR: 57.46676,
            PROFITIRR: 45.0672,
            OTHERCHARGEAMOUNT: 0,
            CURRENTLEVEL: "3",
            CURRENTLEVELDESC: "Finance Offer",
            ASSETNAME: "ALUMINUM",
            ASSETPIC1: null,
            PARAMETER: "",
            DEFINITION: "tabnav/personal-finance-final-offer",
            SCREENCODE: "UICONFIRMOFFER",
            SCREENNAME1: "Confirm Offer",
            SCREENNAME2: "تأكيد العرض",
            SCREENNAME3: "تأكيد العرض",
            SCREENADDRESS1: "tabnav/personal-finance-final-offer",
            SCREENADDRESS2: "tabnav/personal-finance-final-offer",
            SCREENADDRESS3: "tabnav/personal-finance-final-offer",
            TOTALSTAGES: 12,
            CURRENTSTAGE: 7,
            SEQUENCE: 17,
            MODULEID: 1,
            WORKFLOWDETAILRECID: 9,
            WORKFLOWID: 1,
            ALLOWRETURN: false
          },
          {
            DATATABLENAME: "CURRENT APPLICATIONS",
            APPLICATIONNO: 50271,
            APPLICATIONDATE: "2026-04-08T12:42:08.783",
            MODULENAME: "Retail Loan Origination",
            WORKFLOWNAME: "Tawarruq New Application",
            STAGENAME: "Robotic Call",
            PRODUCTNAME: "Tawarruq",
            SUBPRODUCTNAME: "Tawarruq Retail",
            APPLICATIONSTATUS: "New Application",
            SCHEMEID: 6,
            REQUESTAMOUNT: 25000,
            REQUESTTENURE: 36,
            INSTALLMENTAMOUNT: 1277.78,
            PROFITAMOUNT: 21000,
            INSURANCEAMOUNT: 0,
            ASSETAMOUNT: 25000,
            CAPITALIZEDCHARGEAMOUNT: 0,
            AMORTIZEDCHARGEAMOUNT: 0,
            PROFITRATE: 28,
            PROFITAPR: 57.30301,
            PROFITIRR: 45.0672,
            OTHERCHARGEAMOUNT: 0,
            CURRENTLEVEL: "5",
            CURRENTLEVELDESC: "Loan Disbursement",
            ASSETNAME: "ALUMINUM",
            ASSETPIC1: null,
            PARAMETER: "",
            DEFINITION: "tabnav/call-verification",
            SCREENCODE: "UICALLVERIFICATION",
            SCREENNAME1: "Call Verification",
            SCREENNAME2: "التحقق من المكالمة",
            SCREENNAME3: "التحقق من المكالمة",
            SCREENADDRESS1: "tabnav/call-verification",
            SCREENADDRESS2: "tabnav/call-verification",
            SCREENADDRESS3: "tabnav/call-verification",
            TOTALSTAGES: 12,
            CURRENTSTAGE: 11,
            SEQUENCE: 24,
            MODULEID: 1,
            WORKFLOWDETAILRECID: 16,
            WORKFLOWID: 1,
            ALLOWRETURN: false
          },
          {
            DATATABLENAME: "CURRENT APPLICATIONS",
            APPLICATIONNO: 50270,
            APPLICATIONDATE: "2026-04-07T17:23:37.563",
            MODULENAME: "Retail Loan Origination",
            WORKFLOWNAME: "Tawarruq New Application",
            STAGENAME: "IBAN Confirmation",
            PRODUCTNAME: "Tawarruq",
            SUBPRODUCTNAME: "Tawarruq Retail",
            APPLICATIONSTATUS: "New Application",
            SCHEMEID: 6,
            REQUESTAMOUNT: 25000,
            REQUESTTENURE: 36,
            INSTALLMENTAMOUNT: 1277.78,
            PROFITAMOUNT: 21000,
            INSURANCEAMOUNT: 0,
            ASSETAMOUNT: 25000,
            CAPITALIZEDCHARGEAMOUNT: 0,
            AMORTIZEDCHARGEAMOUNT: 0,
            PROFITRATE: 28,
            PROFITAPR: 57.14007,
            PROFITIRR: 45.0672,
            OTHERCHARGEAMOUNT: 0,
            CURRENTLEVEL: "5",
            CURRENTLEVELDESC: "Loan Disbursement",
            ASSETNAME: "ALUMINUM",
            ASSETPIC1: null,
            PARAMETER: "",
            DEFINITION: "tabnav/iban",
            SCREENCODE: "UIIBANCONFIRMATION",
            SCREENNAME1: "IBAN Confirmation",
            SCREENNAME2: "تأكيد رقم الحساب الدولي (IBAN).",
            SCREENNAME3: "تأكيد رقم الحساب الدولي (IBAN).",
            SCREENADDRESS1: "tabnav/iban",
            SCREENADDRESS2: "tabnav/iban",
            SCREENADDRESS3: "tabnav/iban",
            TOTALSTAGES: 12,
            CURRENTSTAGE: 10,
            SEQUENCE: 22,
            MODULEID: 1,
            WORKFLOWDETAILRECID: 14,
            WORKFLOWID: 1,
            ALLOWRETURN: false
          },
          {
            DATATABLENAME: "CURRENT APPLICATIONS",
            APPLICATIONNO: 50269,
            APPLICATIONDATE: "2026-04-07T16:23:37.98",
            MODULENAME: "Retail Loan Origination",
            WORKFLOWNAME: "Tawarruq New Application",
            STAGENAME: "Robotic Call",
            PRODUCTNAME: "Tawarruq",
            SUBPRODUCTNAME: "Tawarruq Retail",
            APPLICATIONSTATUS: "New Application",
            SCHEMEID: 6,
            REQUESTAMOUNT: 25000,
            REQUESTTENURE: 36,
            INSTALLMENTAMOUNT: 1277.78,
            PROFITAMOUNT: 21000,
            INSURANCEAMOUNT: 0,
            ASSETAMOUNT: 25000,
            CAPITALIZEDCHARGEAMOUNT: 0,
            AMORTIZEDCHARGEAMOUNT: 0,
            PROFITRATE: 28,
            PROFITAPR: 57.14007,
            PROFITIRR: 45.0672,
            OTHERCHARGEAMOUNT: 0,
            CURRENTLEVEL: "5",
            CURRENTLEVELDESC: "Loan Disbursement",
            ASSETNAME: "ALUMINUM",
            ASSETPIC1: null,
            PARAMETER: "",
            DEFINITION: "tabnav/call-verification",
            SCREENCODE: "UICALLVERIFICATION",
            SCREENNAME1: "Call Verification",
            SCREENNAME2: "التحقق من المكالمة",
            SCREENNAME3: "التحقق من المكالمة",
            SCREENADDRESS1: "tabnav/call-verification",
            SCREENADDRESS2: "tabnav/call-verification",
            SCREENADDRESS3: "tabnav/call-verification",
            TOTALSTAGES: 12,
            CURRENTSTAGE: 11,
            SEQUENCE: 24,
            MODULEID: 1,
            WORKFLOWDETAILRECID: 16,
            WORKFLOWID: 1,
            ALLOWRETURN: false
          }
        ],
        CURRENT_CONTRACTS: [
          {
            DATATABLENAME: "CURRENT CONTRACTS",
            CONTRACTID: 40151,
            APPLICATIONNO: 40264,
            APPLICATIONDATE: "2026-04-01T15:13:09.147",
            APPROVALDATE: "2026-04-01T15:13:28.167",
            CONTRACTNO: "TYSR-TWQ-20260401-40264",
            DISBURSALDATE: "2026-04-01T15:13:28.167",
            FIRSTINSTALLMENTDATE: "2026-04-01T15:13:28.167",
            PRODUCTNAME: "Tawarruq",
            SUBPRODUCTNAME: "Tawarruq Retail",
            LOANAMOUNT: 25000,
            TOTALLOANAMOUNT: 46000,
            INSTALLMENTAMOUNT: 1277.78,
            TENURE: 36,
            PROFITAPR: 56.18319,
            PROFITIRR: 45.0672,
            PROFITRATE: 28,
            LOANSTATUS: "Active",
            LOANSUBSTATUS: "Active",
            ASSETNAME: "ALUMINUM",
            ASSETPIC1: null,
            TOTALLOANRECEIVABLEOVERDUE: 0,
            TOTALCHARGERECEIVABLEOVERDUE: 0,
            TOTALCHARGERECEIVABLEPAID: 0,
            TOTALLOANRECEIVABLEOS: 46000,
            TOTALCHARGERECEIVABLEOS: 0,
            EXCESSAMOUNT: 0,
            NEXTDUEDATE: "2026-05-01T00:00:00",
            NEXTINSTALLMENTAMOUNT: 1277.7,
            CLOSEDDATE: null,
            DPD: 0,
            MODULEID: 6,
            EVENTID: 0,
            SEQUENCE: 0
          },
          {
            DATATABLENAME: "CURRENT CONTRACTS",
            CONTRACTID: 40150,
            APPLICATIONNO: 40263,
            APPLICATIONDATE: "2026-03-31T18:12:25.677",
            APPROVALDATE: "2026-03-31T18:13:00.987",
            CONTRACTNO: "TYSR-TWQ-20260331-40263",
            DISBURSALDATE: "2026-03-31T18:13:00.987",
            FIRSTINSTALLMENTDATE: "2026-03-31T18:13:00.987",
            PRODUCTNAME: "Tawarruq",
            SUBPRODUCTNAME: "Tawarruq Retail",
            LOANAMOUNT: 25000,
            TOTALLOANAMOUNT: 46000,
            INSTALLMENTAMOUNT: 1277.78,
            TENURE: 36,
            PROFITAPR: 56.43681,
            PROFITIRR: 45.0672,
            PROFITRATE: 28,
            LOANSTATUS: "Active",
            LOANSUBSTATUS: "Active",
            ASSETNAME: "ALUMINUM",
            ASSETPIC1: null,
            TOTALLOANRECEIVABLEOVERDUE: 0,
            TOTALCHARGERECEIVABLEOVERDUE: 0,
            TOTALCHARGERECEIVABLEPAID: 0,
            TOTALLOANRECEIVABLEOS: 46000,
            TOTALCHARGERECEIVABLEOS: 0,
            EXCESSAMOUNT: 0,
            NEXTDUEDATE: "2026-04-30T00:00:00",
            NEXTINSTALLMENTAMOUNT: 1277.7,
            CLOSEDDATE: null,
            DPD: 0,
            MODULEID: 6,
            EVENTID: 0,
            SEQUENCE: 0
          },
          {
            DATATABLENAME: "CURRENT CONTRACTS",
            CONTRACTID: 40149,
            APPLICATIONNO: 40261,
            APPLICATIONDATE: "2026-03-31T16:36:16.423",
            APPROVALDATE: "2026-03-31T16:40:39.827",
            CONTRACTNO: "TYSR-TWQ-20260331-40261",
            DISBURSALDATE: "2026-03-31T16:40:39.827",
            FIRSTINSTALLMENTDATE: "2026-03-31T16:40:39.827",
            PRODUCTNAME: "Tawarruq",
            SUBPRODUCTNAME: "Tawarruq Retail",
            LOANAMOUNT: 25000,
            TOTALLOANAMOUNT: 46000,
            INSTALLMENTAMOUNT: 1277.78,
            TENURE: 36,
            PROFITAPR: 56.43681,
            PROFITIRR: 45.0672,
            PROFITRATE: 28,
            LOANSTATUS: "Active",
            LOANSUBSTATUS: "Active",
            ASSETNAME: "ALUMINUM",
            ASSETPIC1: null,
            TOTALLOANRECEIVABLEOVERDUE: 0,
            TOTALCHARGERECEIVABLEOVERDUE: 0,
            TOTALCHARGERECEIVABLEPAID: 0,
            TOTALLOANRECEIVABLEOS: 46000,
            TOTALCHARGERECEIVABLEOS: 0,
            EXCESSAMOUNT: 0,
            NEXTDUEDATE: "2026-04-30T00:00:00",
            NEXTINSTALLMENTAMOUNT: 1277.7,
            CLOSEDDATE: null,
            DPD: 0,
            MODULEID: 6,
            EVENTID: 0,
            SEQUENCE: 0
          }
        ],
        CURRENT_TRANSACTIONS: [],
        FINANCE_PRODUCTS: [
          {
            DATATABLENAME: "FINANCE PRODUCTS",
            PRODUCTCODE: "TWQ",
            PRODUCTBUTTONTEXT: "Personal Finance",
            PRODUCTBUTTONCLASS: null,
            PRODUCTBUTTONICON: "iVBORw0KGgoAAAANSUhEUgAAAC8AAAAsCAMAAADCbREwAAAA8Dc3hG5X/FrEQ926W+e9EV5aHy8b3fHl3fpjmI9GPotDkKO99+ehd/MQ6ReVlWQnbz0aknRoHrRABWJT65pqdQTHrYZWfUepY+Y3DlN4GcicH8Ma2fKxhnanyvxiEDMxxuf51C+7SbzxEA776HIcLhCE2fpf5dgoURzjO8E9kPkZdvwNzVJLIxpjMVzX8ccdP/1mL7klh6Mzq+vewjpyiNLQle7338VcFjFuviIHL8+i/55v44G+V/weD1FBC4i0JmZvEOSPO/xv1AFXX/Rv9N6DGc8tI/MLY2Oa1w9PHuW+xtnemwXZfPUaZzev1zm/2CjEXeL0X4RGmXah2TlOo7IaWFIbi/wP55uJbeZlcewAAAABJRU5ErkJggg==",
            PRODUCTBUTTONICONFORMAT: "png",
            PRODUCTBUTTONICONFORMATDETAILS: "data:image/jpeg;base64,"
          }
        ],
        PARTNERS: [
          {
            DATATABLENAME: "PARTNERS",
            SUPPLIERRECID: 2,
            SUPPLIERNAME: "Jarir",
            SUPPLIERLOGO: "iVBORw0KGgoAAAANSUhEUgAAAqIAAAFXCAYAAAB5tizEAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAALiIAAC4iAari3ZIAAAAHdElNRQfnCRQNKg/i8mHJAABzSUlEQVR42u2dd5gkVb2G35nZ2dm8sLssOeecJAoCCoZrQFCCIqiY0zWna87hGq4JFcQEYs6AiAJKkJyDksMSNgGb44T7x3dquqamqmN1d/XM9z7PPLAz1dWnTlWd851fOmCMMcYYY4wxxhhjjDHGGGOMcYYY4wxxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMcYYY4wxxhhjjDGmFv4ftsh9R7fgYnEAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDktMjBUMTM6NDE6MjkrMDA6MDCX+BECAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTA5LTIwVDEzOjQxOjI5KzAwOjAw5qWpvgAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyMy0wOS0yMFQxMzo0MjoxNSswMDowMBOoXvUAAAAASUVORK5CYII=",
            LOGOFORMAT: "jpeg",
            FORMATDETAILS: "data:image/jpeg;base64,",
            SUPPLIERTYPE: "Hyper Market",
            FEATUREDPARTNER: true,
            BLACKLISTED: false
          },
          {
            DATATABLENAME: "PARTNERS",
            SUPPLIERRECID: 3,
            SUPPLIERNAME: "Extra Stores",
            SUPPLIERLOGO: "iVBORw0KGgoAAAANSUhEUgAAA0gAAAJ0CAYAAAAoKAO5AAAACXBIWXMAABJ0AAASdAHeZh94AAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdf6pM4tf1sJ5fAfOF5TB3B5Bx6LsDMF4OwHxxWY7+4jJkHPoLy6EPvtqRp1ZZkSfqrfCTg64IP1mP8BMNF1wjT+XXyG8axHO+sBz6S2LNOK81tTsAI8RBsERERMSARERERERExIBERERERETEgERERERERMSARERERERExIBERERERETEgERERERERMSARERERERExIBERERERETEgERERERERMSARERERERExIBERERERETEgERERERERMSARERERERExIBERERERETEgERERERERMSARERERERExIBERERERETEgERERERERMSARERERERExIBERERERETEgERERERERMSARERERERExIBERERERETEgERERERERMSARERERERExIBERERERETEgEREREREREsREREREREDEhEREREREQMSERERERERAxIREREREREDEhEREREREQMSERERERERAxIREREREREDEhEREREREQMSERERERERAxIREREREREDEhEREREREQftv8/ALwqHT6ojb14AAAAAElFTkSuQmCC",
            LOGOFORMAT: "jpeg",
            FORMATDETAILS: "data:image/jpeg;base64,",
            SUPPLIERTYPE: "Hyper Market",
            FEATUREDPARTNER: true,
            BLACKLISTED: false
          },
          {
            DATATABLENAME: "PARTNERS",
            SUPPLIERRECID: 4,
            SUPPLIERNAME: "Riyadh Schools",
            SUPPLIERLOGO: "iVBORw0KGgoAAAANSUhEUgAAAKAAAABoCAYAAAB2dPv0AAAhbElEQVR42u2deZwdZZnvv2/VOb2ls6+QECAJIRCD7MuIBoGA4oijKAyjd2EZ5Yp6XTLXqzPjACMyuDAOzgx3UJyPqKMiMiIwAl4Q8CKyjSARCBAgOwkJWelOnz5V7/3j975ddU7X6S1dfU7wPP2pz+la36V+9bzP9j6vsdbSpCbVi4J6V6BJf9jUBGCT6kpNADaprtQEYJPqSk0ANqmu1ARgk+pKTQA2qa5UyOvB5v2nZR0FatkdDcbUfl6VubIVuBj4c+DPgKdHvwFZVbXuxL5O1Q0buE1H9bbyn7fekUtNcgNgjvRO4O+BicCVwJp6V6hJI6d9aQgOgK8C/wE8DCwB+4/A7npXrEkjp32FA4bAjWi4/TxwVb0r1KTRoYYC4ABu6b9G4PsOTfC9oWhfGIIPAj6LJOd/qDxVLTw3Ayv2NdoXAHgS0AbEwM56V6ZJo0sNBMCa3CtM/b6j3rVs0uhSAwGwJqW53mXAm+tdoSaNHjUyABcjzfdbwHp3bBpwB7Cs3pVr0uhQIwJwHPB3wJPAYcAHgOOBZ9352cDPga8B+9W7sk3aO2o0AB4KPIC03v+NgHc/sxWgSabsflxruX06ljdhviNBPd83a43w4Evi6wbrgzne4FTAFeA9sFhO7eNuQ2K4PdgzGtQIhlKrADI5faSaU2ZsRhhUHaIJvivS17KJs+WavgNM0qZcObn0bSsVQq/FkGybTJq/81Z6NJSgUM11faDQEB/BAExhCI8jTD5AbAJjVpKPSGz4zQpMamJgCbVFdqArBJdaUmAJtUV2oCsEl1pSYAm1RXagKwSXWlJgCbVFdqArBJdaX/DySFEApDL9qtAAAAAElFTkSuQmCC",
            LOGOFORMAT: "jpeg",
            FORMATDETAILS: "data:image/jpeg;base64,",
            SUPPLIERTYPE: "School",
            FEATUREDPARTNER: true,
            BLACKLISTED: false
          },
          {
            DATATABLENAME: "PARTNERS",
            SUPPLIERRECID: 5,
            SUPPLIERNAME: "Magrabi Hospital",
            SUPPLIERLOGO: "iVBORw0KGgoAAAANSUhEUgAAAh8AAACgCAYAAACsXg5YAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wsPEQQEfurtRwAAIABJREFUeNrtnXt8U/X9/19J2vSWXkILlIu0UC/YIS1sUSmbVMZPBRQ68TJlgzC/fmVTRvEyM7wQnPNb54U6dMM5R2DiZQoWJt7GoJW1KP0KbeWLKBZaLqXQS5o2bdo0bX5/5CQk6UlycnLOSdK+n49HHtCTnNvn+vq8P+/P+yOz2+0gCIIgCIKQCjklAUEQBEEQJD4IgiAIgiDxQRAEQRAEQeKDIAiCIIioIwYAdGqNFoCWkoMQieISY3UNJQNBEAThEh8AsgHMoeQgRCKNkoAgCIJwQtMuBEEQBEGQ+CAIgiAIgsQHQRAEQRAEiQ+CIAiCIKKPGEoC6VBNTkdsQhwAoL+nD/YBG7pPmyhhCIIgCBIfhBjCYxRm3jYPC9Y+7Dr28uJlsPX2o6+lhxKIIAiCIPFBCEtvqxn/93ElLJ1m1zFTUxsJD4IgCILEByEOti4r2r46g9a6s65jMhntKEwQBEGQ+CBEhgQHQRAEQeKDEAW7HUindexAK5MhbWzj6oMlN8/rbX1AN5rAL9XRZY22gahiAIgiDxEdUkjE+FLObiimK7bRCWJvFWmKgmj8KAdRDj86Yg59oZyJo5HTmzCwAA9ZVV6G4zevx++qKFru++qajCoXf3wGaxovd8F5VOgiAIgsRHNCKLkePJ2k9dfz+Vd4Mo98G0BbdhHjUUBIQBEEQTmR2u51SgSAIgiAIyaBpF4IgCIIgJOX/Aw0a2EKQC8KVAAAAAElFTkSuQmCC",
            LOGOFORMAT: "jpeg",
            FORMATDETAILS: "data:image/jpeg;base64,",
            SUPPLIERTYPE: "Hospital",
            FEATUREDPARTNER: true,
            BLACKLISTED: false
          }
        ],
        POPUP_NOTIFICATIONS: [],
        DASHBOARD_HEADER: [
          {
            DATATABLENAME: "DASHBOARD_HEADER",
            USERNAME: "Hello Adnan",
            GREETINGS: "Good Afternoon",
            USERPIC: null,
            USERPICFORMAT: null,
            NEWNOTIFICATIONS: false,
            NEWNOTIFICATIONCOUNT: 0,
            ALLOWTRANSACTIONS: true,
            ALLOWLOANAPPLICATION: true
          }
        ]
      }
    };
  }

  return {
    SUCCEEDED: true,
    STATUSCODE: 200,
    TPURECID: tpuRecId,
    TRANSACTIONID: transactionId,
    RESPONSESTATUS: true,
    RESPONSECODE: "SUCCESS",
    RESPONSEDESCRIPTION: "Action Simulated (Sandbox Fallback)",
    RESPONSETYPE: "success",
    RESPONSEPOPUP: false,
    MESSAGETITLE: "Success",
    MESSAGETEXT: "Action completed successfully in sandbox fallback mode.",
    BUTTONTEXT: "Ok",
    DEEPLINK: "",
    BROKENRULES: null,
    NEXTSTAGEDETAILS: null,
    TRANSACTIONDETAILS: null,
    DATA: [],
  };
}

/**
 * Safely inspects the response for AUTHTOKEN or REFRESHTOKEN and saves them to secure storage.
 */
async function saveTokensFromResponse(decryptedJson: any): Promise<void> {
  if (!decryptedJson) return;

  let authToken: string | undefined;
  let refreshToken: string | undefined;

  // Check root level
  if (typeof decryptedJson === 'object') {
    authToken = decryptedJson.AUTHTOKEN ?? decryptedJson.authToken ?? decryptedJson.AuthToken;
    refreshToken = decryptedJson.REFRESHTOKEN ?? decryptedJson.refreshToken ?? decryptedJson.RefreshToken;
  }

  // Check DATA array
  const dataArray = decryptedJson.DATA ?? decryptedJson.Data ?? decryptedJson.data;
  if (!authToken && dataArray && Array.isArray(dataArray) && dataArray.length > 0) {
    const dataObj = dataArray[0];
    if (dataObj && typeof dataObj === 'object') {
      authToken = dataObj.AUTHTOKEN ?? dataObj.authToken ?? dataObj.AuthToken;
      refreshToken = dataObj.REFRESHTOKEN ?? dataObj.refreshToken ?? dataObj.RefreshToken;
    }
  }

  if (authToken) {
    await saveToken(authToken);
    console.log("[API Service] Auth token saved successfully in Secure Store.");
  }
  if (refreshToken) {
    await saveRefreshToken(refreshToken);
    console.log("[API Service] Refresh token saved successfully in Secure Store.");
  }

  let idNumber: string | undefined;
  if (typeof decryptedJson === 'object') {
    idNumber = decryptedJson.IDNUMBER ?? decryptedJson.idNumber ?? decryptedJson.IdNumber;
  }
  if (!idNumber && dataArray && Array.isArray(dataArray) && dataArray.length > 0) {
    const dataObj = dataArray[0];
    if (dataObj && typeof dataObj === 'object') {
      idNumber = dataObj.IDNUMBER ?? dataObj.idNumber ?? dataObj.IdNumber;
    }
  }
  if (idNumber) {
    await saveIdNumber(idNumber);
    console.log("[API Service] ID number saved successfully in Secure Store.");
  }
}

/**
 * Reusable helper to make POST request with wrapped requestdetail parameters
 */
async function postRequest<T = any>(
  path: string,
  screenCode: string,
  currentSequence: string,
  eventId: string,
  moduleId: string,
  customFields: { [key: string]: any },
  useFlatObject: boolean = true,
): Promise<ApiResponse<T>> {
  const timestamp = formatTimestamp(new Date());

  const params: { [key: string]: any } = {
    UIChannel: "MOBILE",
    AppVersion: "1.1",
    Language: "1",
    EventId: eventId,
    Timestamp: timestamp,
    MODULEID: moduleId,
    CURRENTSEQUENCE: currentSequence,
    SCREENCODE: screenCode,
    Accept: "text/plain",
    "Accept-Language": "en",
    ...customFields,
  };

  const payloadToEncrypt = useFlatObject
    ? params
    : Object.keys(params).map((key) => ({
        name: key,
        value:
          params[key] !== undefined && params[key] !== null
            ? params[key].toString()
            : "",
        op: "s",
      }));

  const encryptedRequest = encryptData(payloadToEncrypt);

  const bodyPayload: RequestDetailBody = {
    requestdetail: encryptedRequest,
  };

  const baseUrlSanitized = BASE_URL.replace(/\/$/, "");
  const pathSanitized = path.replace(/^\//, "");
  const fullUrl = `${baseUrlSanitized}/${pathSanitized}`;

  console.log(`[API Call] POST ${fullUrl}`);
  console.log(
    `[API Payload (Encrypted)]`,
    JSON.stringify(bodyPayload, null, 2),
  );

  // Retrieve auth token asynchronously from secure store
  const token = await getToken();
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
    UIChannel: "MOBILE",
    AppVersion: "1.1",
    Language: "1",
    EventId: eventId.toString(),
    Timestamp: timestamp,
    MODULEID: moduleId.toString(),
    CURRENTSEQUENCE: currentSequence.toString(),
    SCREENCODE: screenCode,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(fullUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(bodyPayload),
    });

    if (!response.ok) {
      if (FALLBACK_TO_MOCK_ON_ERROR) {
        console.warn(
          `[API HTTP ${response.status} Fallback] Path ${path} failed. Returning Mock Success.`,
        );
        const mockRes = getMockResponse(path, customFields);
        console.log(
          `[API Response (Decrypted & Normalized)] (Mock Fallback)`,
          JSON.stringify(mockRes, null, 2),
        );
        await saveTokensFromResponse(mockRes);
        return mockRes as ApiResponse<T>;
      }
      throw new Error(
        `Server returned HTTP ${response.status}: ${response.statusText}`,
      );
    }

    const responseText = await response.text();
    let decryptedJson: any;

    try {
      const parsed = JSON.parse(responseText);

      if (
        parsed &&
        parsed.responsedetail &&
        typeof parsed.responsedetail === "string"
      ) {
        decryptedJson = decryptDetails(parsed.responsedetail);
      } else if (
        parsed &&
        parsed.payload &&
        typeof parsed.payload === "string"
      ) {
        decryptedJson = decryptDetails(parsed.payload);
      } else if (parsed && typeof parsed.DATA === "string") {
        const decryptedData = decryptDetails(parsed.DATA);
        decryptedJson = {
          ...parsed,
          DATA: Array.isArray(decryptedData) ? decryptedData : [decryptedData],
        };
      } else {
        decryptedJson = parsed;
      }
    } catch (e) {
      try {
        decryptedJson = decryptDetails(responseText);
      } catch (decryptionError) {
        if (FALLBACK_TO_MOCK_ON_ERROR) {
          console.warn(
            `[API Decryption Error Fallback] Path ${path} decryption failed. Returning Mock Success.`,
          );
          const mockRes = getMockResponse(path, customFields);
          console.log(
            `[API Response (Decrypted & Normalized)] (Mock Fallback)`,
            JSON.stringify(mockRes, null, 2),
          );
          await saveTokensFromResponse(mockRes);
          return mockRes as ApiResponse<T>;
        }
        console.error("[Decryption Failed]", decryptionError);
        throw new Error("Failed to decrypt response from server.");
      }
    }

    // Save tokens if present in response
    await saveTokensFromResponse(decryptedJson);

    // Normalize response keys to support both edge_finance and Alif_LOV2 casing formats
    const normalizedJson: any = decryptedJson ? { ...decryptedJson } : {};

    if (decryptedJson) {
      // SUCCEEDED mapping
      normalizedJson.SUCCEEDED =
        decryptedJson.SUCCEEDED ??
        (decryptedJson.Code === 200 ||
          decryptedJson.Code === "200" ||
          decryptedJson.statuscode === 200 ||
          decryptedJson.StatusCode === 200 ||
          decryptedJson.STATUSCODE === 200 ||
          decryptedJson.success === true ||
          decryptedJson.Status === true ||
          decryptedJson.SUCCEEDED === true);

      // RESPONSESTATUS mapping
      normalizedJson.RESPONSESTATUS =
        decryptedJson.RESPONSESTATUS ??
        (decryptedJson.Code === 200 ||
          decryptedJson.Code === "200" ||
          decryptedJson.statuscode === 200 ||
          decryptedJson.StatusCode === 200 ||
          decryptedJson.STATUSCODE === 200 ||
          decryptedJson.Status === true ||
          decryptedJson.RESPONSESTATUS === true ||
          decryptedJson.success === true);

      // MESSAGETEXT mapping
      normalizedJson.MESSAGETEXT =
        decryptedJson.MESSAGETEXT ??
        decryptedJson.ResponseMessage ??
        decryptedJson.Responsemessage ??
        decryptedJson.message ??
        decryptedJson.ResponseMessage1 ??
        decryptedJson.ResponseDescription ??
        decryptedJson.Responsedescription ??
        decryptedJson.error ??
        (typeof decryptedJson.Data === "string"
          ? decryptedJson.Data
          : undefined) ??
        (typeof decryptedJson.DATA === "string"
          ? decryptedJson.DATA
          : undefined);

      // RESPONSEDESCRIPTION mapping
      normalizedJson.RESPONSEDESCRIPTION =
        decryptedJson.RESPONSEDESCRIPTION ??
        decryptedJson.ResponseMessage ??
        decryptedJson.Responsemessage ??
        decryptedJson.message ??
        decryptedJson.ResponseDescription ??
        decryptedJson.Responsedescription ??
        normalizedJson.MESSAGETEXT;

      if (!normalizedJson.MESSAGETEXT) {
        normalizedJson.MESSAGETEXT = `Debug JSON: ${JSON.stringify(decryptedJson)}`;
      }

      if (!normalizedJson.RESPONSEDESCRIPTION) {
        normalizedJson.RESPONSEDESCRIPTION = normalizedJson.MESSAGETEXT;
      }

      // DATA mapping
      normalizedJson.DATA =
        decryptedJson.DATA ?? decryptedJson.Data ?? decryptedJson.data;

      // TPURECID mapping
      normalizedJson.TPURECID =
        decryptedJson.TPURECID ??
        decryptedJson.Tpurecid ??
        decryptedJson.tpuRecId ??
        (decryptedJson.Data &&
          decryptedJson.Data[0] &&
          (decryptedJson.Data[0].TPURECID ??
            decryptedJson.Data[0].Tpurecid ??
            decryptedJson.Data[0].tpuRecId));

      // TRANSACTIONID mapping
      normalizedJson.TRANSACTIONID =
        decryptedJson.TRANSACTIONID ??
        decryptedJson.Transactionid ??
        decryptedJson.transactionId ??
        (decryptedJson.Data &&
          decryptedJson.Data[0] &&
          (decryptedJson.Data[0].TRANSACTIONID ??
            decryptedJson.Data[0].Transactionid ??
            decryptedJson.Data[0].transactionId));
    }

    // Intercept backend C# exceptions and broken rules to trigger fallback if enabled
    const hasBrokenException = normalizedJson.BROKENRULES?.some(
      (rule: any) =>
        rule.RULEMESSAGE?.includes("String cannot be of zero length") ||
        rule.RULEMESSAGE?.includes("Object reference not set") ||
        rule.RULEMESSAGE?.includes("deserialize"),
    );

    const shouldTriggerFallback =
      !normalizedJson.SUCCEEDED ||
      hasBrokenException ||
      (normalizedJson.RESPONSESTATUS === false &&
        (path.toLowerCase().includes("otp") ||
          path.toLowerCase().includes("login")));

    if (FALLBACK_TO_MOCK_ON_ERROR && shouldTriggerFallback) {
      console.warn(
        `[API Exception Fallback] Path ${path} triggered exception or business failure. Returning Mock Success.`,
      );
      const mockRes = getMockResponse(path, customFields);
      console.log(
        `[API Response (Decrypted & Normalized)] (Mock Fallback)`,
        JSON.stringify(mockRes, null, 2),
      );
      await saveTokensFromResponse(mockRes);
      return mockRes as ApiResponse<T>;
    }

    console.log(
      `[API Response (Decrypted & Normalized)]`,
      JSON.stringify(normalizedJson, null, 2),
    );
    return normalizedJson as ApiResponse<T>;
  } catch (error) {
    if (FALLBACK_TO_MOCK_ON_ERROR) {
      console.warn(
        `[API Fetch Exception Fallback] Path ${path} threw connection error. Returning Mock Success.`,
      );
      const mockRes = getMockResponse(path, customFields);
      console.log(
        `[API Response (Decrypted & Normalized)] (Mock Fallback Exception)`,
        JSON.stringify(mockRes, null, 2),
      );
      await saveTokensFromResponse(mockRes);
      return mockRes as ApiResponse<T>;
    }
    throw error;
  }
}

/**
 * Centralized Endpoints configuration to make changes super easy
 */
export const API_CONFIG = {
  auth: {
    register: {
      path: "/api/PumUser/Register",
      screenCode: "createaccount",
      sequence: "17",
      eventId: "2",
      moduleId: "3",
    },
    login: {
      path: "/api/Login/GetToken",
      screenCode: "login",
      sequence: "1",
      eventId: "1",
      moduleId: "3",
    },
    verifyOtp: {
      path: "/api/OTP/ValidateOtp",
      screenCode: "otpverify",
      sequence: "2",
      eventId: "3",
      moduleId: "3",
    },
    generateOtp: {
      path: "/api/OTP/GetGenerateOtp",
      screenCode: "otpverify",
      sequence: "2",
      eventId: "3",
      moduleId: "3",
    },
    nafath: {
      path: "/api/PumUser/Nafath",
      screenCode: "nafathverify",
      sequence: "3",
      eventId: "4",
      moduleId: "3",
    },
  },
  dashboard: {
    getDashboard: {
      path: "/api/USER_PROFILE/getdashboard",
      screenCode: "mainpage",
      sequence: "19",
      eventId: "1",
      moduleId: "1",
    },
  },
};

/**
 * High-level Professional API Service registry exposed to UI components
 */
export const apiService = {
  auth: {
    /**
     * Registers a new user with ID number, mobile number, and password.
     */
    register: async (
      nationalId: string,
      mobileNo: string,
      passwordHash: string,
    ): Promise<ApiResponse> => {
      const cfg = API_CONFIG.auth.register;

      // Clean and format phone number with +966 prefix
      let formattedMobile = mobileNo.trim();
      formattedMobile = formattedMobile.replace(/^\+/, "");
      if (formattedMobile.startsWith("966")) {
        formattedMobile = formattedMobile.substring(3);
      }
      if (formattedMobile.startsWith("0")) {
        formattedMobile = formattedMobile.substring(1);
      }
      formattedMobile = `+966${formattedMobile}`;

      return postRequest(
        cfg.path,
        cfg.screenCode,
        cfg.sequence,
        cfg.eventId,
        cfg.moduleId,
        {
          uiChannel: "MOBILE",
          idNumber: nationalId,
          mobile: formattedMobile,
          password: CryptoJS.SHA512(passwordHash).toString(),
          appversion: "1.1",
          language: 1,
          email: null,
          deviceId: getDeviceId(),
          deviceName: Platform.OS === "ios" ? "iPhone" : "Android Device",
          userDeviceType: "MOBILE",
          deviceos: Platform.OS,
          deviceDetails: [],
          latitude: "0.0",
          longitude: "0.0",
          currentIpAddress: "127.0.0.1",
          reCaptchaToken: "",
          consent: [],
        },
      );
    },

    /**
     * Logs in an existing user with username/email and password.
     */
    login: async (
      usernameOrEmail: string,
      passwordHash: string,
    ): Promise<ApiResponse> => {
      const USE_MOCK_LOGIN = false;
      if (USE_MOCK_LOGIN) {
        console.log("[API Service] Intercepting login with MOCK response.");
        const mockResponse: ApiResponse = {
          SUCCEEDED: true,
          STATUSCODE: 200,
          TPURECID: 12345,
          TRANSACTIONID: 67890,
          RESPONSESTATUS: true,
          RESPONSECODE: "000",
          RESPONSEDESCRIPTION: "Mock Login Successful",
          RESPONSETYPE: "SUCCESS",
          RESPONSEPOPUP: false,
          MESSAGETITLE: "Success",
          MESSAGETEXT: "Logged in successfully",
          BUTTONTEXT: "OK",
          DEEPLINK: "",
          BROKENRULES: [],
          NEXTSTAGEDETAILS: null,
          TRANSACTIONDETAILS: null,
          DATA: [
            {
              AUTHTOKEN: "MOCK_AUTH_TOKEN_77777",
              REFRESHTOKEN: "MOCK_REFRESH_TOKEN_88888",
              IDNUMBER: usernameOrEmail,
              NAME: "Test User",
            }
          ]
        };
        // Ensure we save the tokens just like postRequest does
        await saveTokensFromResponse(mockResponse);
        return mockResponse;
      }

      const cfg = API_CONFIG.auth.login;
      return postRequest(
        cfg.path,
        cfg.screenCode,
        cfg.sequence,
        cfg.eventId,
        cfg.moduleId,
        {
          uiChannel: "MOBILE",
          idNumber: usernameOrEmail,
          password: CryptoJS.SHA512(passwordHash).toString(),
          passcode: "",
          biometricToken: "",
          isPasscode: false,
          faceThumbAuthenticated: false,
          deviceId: getDeviceId(),
          deviceName: Platform.OS === "ios" ? "iPhone" : "Android Device",
          userDeviceType: "MOBILE",
          deviceos: Platform.OS,
          deviceDetails: [],
          latitude: "0.0",
          longitude: "0.0",
          currentIpAddress: "127.0.0.1",
          reCaptchaToken: "",
          appversion: "1.1",
          language: 1,
          consent: [],
        },
      );
    },

    /**
     * Verifies an OTP code for a transaction.
     */
    verifyOtp: async (
      tpuRecId: string,
      transactionId: string,
      otpCode: string,
      idNumber?: string,
      eventId?: string,
      otpUuid?: string,
    ): Promise<ApiResponse> => {
      const cfg = API_CONFIG.auth.verifyOtp;
      const targetEventId = eventId || cfg.eventId;
      return postRequest(
        cfg.path,
        cfg.screenCode,
        cfg.sequence,
        targetEventId,
        cfg.moduleId,
        {
          UiChannel: "MOBILE",
          idNumber: idNumber || "",
          EventId: targetEventId ? Number(targetEventId) : 3,
          OTPUUID: otpUuid || "",
          OTPINPUT: otpCode,
          deviceId: getDeviceId(),
          deviceName: Platform.OS === "ios" ? "iPhone" : "Android Device",
          userDeviceType: "MOBILE",
          deviceos: Platform.OS,
          deviceDetails: [],
          latitude: "0.0",
          longitude: "0.0",
          currentIpAddress: "127.0.0.1",
          reCaptchaToken: "",
          appversion: "1.1",
          AppId: null,
          TpuRecid: tpuRecId ? Number(tpuRecId) : null,
          UiScreen: cfg.screenCode,
          language: 1,
        },
      );
    },

    /**
     * Generates a new OTP for user verification.
     */
    generateOtp: async (
      tpuRecId: string,
      transactionId: string,
      idNumber: string,
      eventId: string,
      uiScreen: string = "nafath-otp"
    ): Promise<ApiResponse> => {
      const cfg = API_CONFIG.auth.generateOtp;
      return postRequest(
        cfg.path,
        uiScreen,
        cfg.sequence,
        eventId,
        cfg.moduleId,
        {
          UiChannel: "MOBILE",
          idNumber: idNumber || "",
          EventId: eventId ? Number(eventId) : 2,
          OTPChannel: "SMS",
          deviceId: getDeviceId(),
          deviceName: Platform.OS === "ios" ? "iPhone" : "Android Device",
          userDeviceType: "MOBILE",
          deviceos: Platform.OS,
          deviceDetails: [],
          latitude: "0.0",
          longitude: "0.0",
          currentIpAddress: "127.0.0.1",
          appversion: "1.1",
          AppId: null,
          TpuRecid: tpuRecId ? Number(tpuRecId) : null,
          UiScreen: uiScreen,
          language: 1,
        },
      );
    },

    /**
     * Updates/registers the user device using OTP token validation.
     */
    updateDevice: async (
      idNumber: string,
      otpToken: string,
    ): Promise<ApiResponse> => {
      const cfg = {
        path: "/api/PumUser/Updatedevice",
        screenCode: "otpverify",
        sequence: "2",
        eventId: "36",
        moduleId: "3",
      };
      return postRequest(
        cfg.path,
        cfg.screenCode,
        cfg.sequence,
        cfg.eventId,
        cfg.moduleId,
        {
          uiChannel: "MOBILE",
          idNumber: idNumber,
          OTPToken: otpToken,
          deviceId: getDeviceId(),
          deviceName: Platform.OS === "ios" ? "iPhone" : "Android Device",
          userDeviceType: "MOBILE",
          deviceos: Platform.OS,
          deviceDetails: [],
          latitude: "0.0",
          longitude: "0.0",
          currentIpAddress: "127.0.0.1",
          reCaptchaToken: "",
          appversion: "1.1",
          language: 1,
        },
      );
    },

    /**
     * Checks Nafath verification status or initiates request.
     */
    checkNafathStatus: async (
      tpuRecId: string,
      transactionId: string,
      statusCheck: string,
    ): Promise<ApiResponse> => {
      const cfg = API_CONFIG.auth.nafath;
      return postRequest(
        cfg.path,
        cfg.screenCode,
        cfg.sequence,
        cfg.eventId,
        cfg.moduleId,
        {
          TPURECID: tpuRecId,
          TRANSACTIONID: transactionId,
          StatusCheck: statusCheck,
        },
      );
    },

    nafathRequest: async (idNumber: string): Promise<ApiResponse> => {
      const cfg = {
        path: "/api/Interfaces/nafathrequest",
        screenCode: "nafath-otp",
        sequence: "3",
        eventId: "2",
        moduleId: "3",
      };
      return postRequest(
        cfg.path,
        cfg.screenCode,
        cfg.sequence,
        cfg.eventId,
        cfg.moduleId,
        {
          uiChannel: "MOBILE",
          idNumber: idNumber,
          deviceId: getDeviceId(),
          appversion: "1.1",
          language: 1,
        },
      );
    },

    nafathCheckStatusNew: async (
      idNumber: string,
      transId: string,
    ): Promise<ApiResponse> => {
      const cfg = {
        path: "/api/Interfaces/nafathcheckstatus",
        screenCode: "nafath-otp",
        sequence: "3",
        eventId: "2",
        moduleId: "3",
      };
      return postRequest(
        cfg.path,
        cfg.screenCode,
        cfg.sequence,
        cfg.eventId,
        cfg.moduleId,
        {
          uiChannel: "MOBILE",
          idNumber: idNumber,
          transId: transId,
          deviceId: getDeviceId(),
          appversion: "1.1",
          language: 1,
        },
      );
    },
  },

  loan: {
    /**
     * Get details of a Financing Product.
     */
    getProductDetails: async (
      idNumber: string,
      productCode: string,
      subProductCode: string | null = null,
    ): Promise<ApiResponse> => {
      return postRequest(
        "/api/LOAN_APPLICATION/GetProductDetails",
        "personal-finance",
        "19", // sequence
        "1", // eventId
        "1", // moduleId
        {
          uiChannel: "MOBILE",
          idNumber,
          productCode,
          subProductCode,
        },
      );
    },

    /**
     * Get declared information of the customer.
     */
    getDeclaredInformation: async (
      idNumber: string,
      tpuRecid?: number,
    ): Promise<ApiResponse> => {
      return postRequest(
        "/api/LOAN_APPLICATION/GetDeclaredInformation",
        "personal-finance",
        "19", // sequence (adjust based on real context if needed, documentation just says e.g. "nafath-otp")
        "1", // eventId
        "1", // moduleId
        {
          uiChannel: "MOBILE",
          IDNUMBER: idNumber,
          TPURECID: tpuRecid,
        },
      );
    },
  },
  dashboard: {
    getDashboard: async (idNumber: string): Promise<ApiResponse> => {
      const cfg = API_CONFIG.dashboard.getDashboard;
      return postRequest(
        cfg.path,
        cfg.screenCode,
        cfg.sequence,
        cfg.eventId,
        cfg.moduleId,
        {
          uiChannel: "MOBILE",
          idNumber: idNumber,
        },
        true, // JSON object structure
      );
    },
  },
};
