import React from "react";
import { CreditCard, Clock, Shield, Mail, Phone } from "lucide-react";
import Footer from "../components/Footer";

const Refund = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
    <div className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-2xl max-w-4xl w-full">
      <h1 className="text-5xl font-extrabold mb-8 text-indigo-800 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Refund Policy
      </h1>

      <div className="space-y-8">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
          <div className="flex items-start space-x-4">
            <CreditCard className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-indigo-800 mb-3">No Charge Policy</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                Student Era currently does <strong className="text-indigo-600">not charge students</strong> for internships or training programs.
                Our platform is designed to provide free access to educational opportunities and career development resources.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
          <div className="flex items-start space-x-4">
            <Clock className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-indigo-800 mb-3">Application Fees</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                While our core services are free, there is a nominal <strong className="text-indigo-600">₹149 application fee</strong> for processing internship applications.
                This fee covers administrative costs and ensures commitment from applicants.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
          <div className="flex items-start space-x-4">
            <Shield className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-indigo-800 mb-3">Refund Eligibility</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Refunds for the application fee are considered on a case-by-case basis under the following circumstances:
              </p>
              <ul className="list-disc pl-8 text-gray-700 text-lg leading-relaxed space-y-2">
                <li><strong className="text-indigo-600">Technical Issues:</strong> If the application process fails due to platform errors</li>
                <li><strong className="text-indigo-600">Duplicate Payments:</strong> Accidental multiple payments for the same application</li>
                <li><strong className="text-indigo-600">Service Unavailability:</strong> If the internship is cancelled before commencement</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
          <div className="flex items-start space-x-4">
            <Mail className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-indigo-800 mb-3">Refund Process</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                To request a refund, please contact our support team within <strong className="text-indigo-600">7 days</strong> of payment.
                Provide your payment reference number and reason for the refund request. Our team will review your case and process eligible refunds within 5-7 business days.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
          <div className="flex items-start space-x-4">
            <Phone className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-indigo-800 mb-3">Contact Us</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                For refund inquiries or payment-related questions, please reach out to us at:
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-indigo-700 font-semibold">
                  <Mail className="h-5 w-5 inline mr-2" />
                  contact.studentera@gmail.com
                </p>
                <p className="text-indigo-700 font-semibold">
                  <Phone className="h-5 w-5 inline mr-2" />
                  +1 (555) 123-4567
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default Refund;
