import React, { useState } from "react";
import Certificates from "./Certificates";
import OfferLetters from "./OfferLetters";
import { Award, FileText } from "lucide-react";

const Documents = () => {
  const [activeTab, setActiveTab] = useState("certificates");

  return (
    <div className="max-w-7xl mx-auto w-full font-sans tracking-tight pb-12 w-full max-w-[100vw] overflow-x-hidden">
      <div className="mb-6 sm:mb-8 mt-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">My Documents</h1>
        <p className="text-gray-500 text-sm sm:text-base">Manage your certificates and offer letters securely.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 sm:mb-8 overflow-x-auto hide-scrollbar w-full">
        <button
          onClick={() => setActiveTab("certificates")}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3 font-semibold text-sm sm:text-base whitespace-nowrap border-b-2 transition-colors duration-200 ${activeTab === "certificates"
              ? "border-blue-600 text-blue-700"
              : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
            }`}
        >
          <Award className="h-4 sm:h-5 w-4 sm:w-5" />
          Certificates
        </button>
        <button
          onClick={() => setActiveTab("offerLetters")}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3 font-semibold text-sm sm:text-base whitespace-nowrap border-b-2 transition-colors duration-200 ${activeTab === "offerLetters"
              ? "border-blue-600 text-blue-700"
              : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
            }`}
        >
          <FileText className="h-4 sm:h-5 w-4 sm:w-5" />
          Offer Letters
        </button>
      </div>

      {/* Content */}
      <div className="w-full">
        {activeTab === "certificates" ? <Certificates isTab={true} /> : <OfferLetters isTab={true} />}
      </div>
    </div>
  );
};

export default Documents;
