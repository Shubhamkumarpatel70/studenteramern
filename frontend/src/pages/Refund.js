import React from "react";
import { CreditCard, Clock, Shield, ArrowRightLeft, Phone, Mail } from "lucide-react";

const Refund = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl w-full">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Refund Policy
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Clear and transparent information about our refund processes and eligibility.
        </p>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-2xl p-8 md:p-10 space-y-10">

        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex-shrink-0 bg-primary/10 p-3 rounded-xl border border-primary/20">
            <CreditCard className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Charge Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              Student Era currently does <strong className="text-gray-900 font-semibold">not charge students</strong> for internships or training programs.
              Our platform is designed to provide free access to educational opportunities and career development resources.
            </p>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gray-100 hidden sm:block"></div>

        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex-shrink-0 bg-primary/10 p-3 rounded-xl border border-primary/20">
            <Clock className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Application Fees</h2>
            <p className="text-gray-600 leading-relaxed">
              While our core services are free, there is a nominal <strong className="text-gray-900 font-semibold">₹149 application fee</strong> for processing internship applications.
              This fee covers administrative costs and ensures commitment from applicants.
            </p>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gray-100 hidden sm:block"></div>

        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex-shrink-0 bg-primary/10 p-3 rounded-xl border border-primary/20">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Refund Eligibility</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Refunds for the application fee are considered on a case-by-case basis under the following circumstances:
            </p>
            <ul className="list-disc pl-5 text-gray-600 leading-relaxed space-y-2 marker:text-primary">
              <li><strong className="text-gray-900 font-medium">Technical Issues:</strong> If the application process fails due to platform errors.</li>
              <li><strong className="text-gray-900 font-medium">Duplicate Payments:</strong> Accidental multiple payments for the same application.</li>
              <li><strong className="text-gray-900 font-medium">Service Unavailability:</strong> If the internship is cancelled before commencement.</li>
            </ul>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gray-100 hidden sm:block"></div>

        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex-shrink-0 bg-primary/10 p-3 rounded-xl border border-primary/20">
            <ArrowRightLeft className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Refund Process</h2>
            <p className="text-gray-600 leading-relaxed">
              To request a refund, please contact our support team within <strong className="text-gray-900 font-semibold">7 days</strong> of payment.
              Provide your payment reference number and reason for the refund request. Our team will review your case and process eligible refunds within 5-7 business days.
            </p>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gray-100 hidden sm:block"></div>

        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex-shrink-0 bg-primary/10 p-3 rounded-xl border border-primary/20">
            <Phone className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              For refund inquiries or payment-related questions, please reach out to us at:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              <a href="mailto:contact.studentera@gmail.com" className="group flex items-center text-gray-600 hover:text-primary transition-colors">
                <Mail className="h-5 w-5 mr-3 text-gray-400 group-hover:text-primary" />
                <span className="font-medium">contact.studentera@gmail.com</span>
              </a>
              <a href="tel:+15551234567" className="group flex items-center text-gray-600 hover:text-primary transition-colors">
                <Phone className="h-5 w-5 mr-3 text-gray-400 group-hover:text-primary" />
                <span className="font-medium">+1 (555) 123-4567</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
);

export default Refund;
