import React from "react";
import { Shield, Eye, Lock, Database, Mail, Phone, FileText } from "lucide-react";
// Footer moved to App-level for specific pages (full-bleed display)

const Privacy = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
    <div className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-2xl max-w-4xl w-full">
      <h1 className="text-5xl font-extrabold mb-8 text-indigo-800 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Privacy Policy
      </h1>

      <div className="space-y-8">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
          <div className="flex items-start space-x-4">
            <Shield className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-indigo-800 mb-3">Our Commitment to Privacy</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                At Student Era, your privacy is our top priority. We are committed to protecting your personal information
                and being transparent about how we collect, use, and safeguard your data.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
          <div className="flex items-start space-x-4">
            <Eye className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-indigo-800 mb-3">Information We Collect</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                We collect information to provide better services to our users:
              </p>
              <ul className="list-disc pl-8 text-gray-700 text-lg leading-relaxed space-y-2">
                <li><strong className="text-indigo-600">Personal Information:</strong> Name, email, phone number, educational background</li>
                <li><strong className="text-indigo-600">Application Data:</strong> Internship preferences, skills, and application history</li>
                <li><strong className="text-indigo-600">Usage Information:</strong> How you interact with our platform</li>
                <li><strong className="text-indigo-600">Payment Information:</strong> Processed securely through third-party providers</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
          <div className="flex items-start space-x-4">
            <Lock className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-indigo-800 mb-3">How We Use Your Information</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Your information helps us provide and improve our services:
              </p>
              <ul className="list-disc pl-8 text-gray-700 text-lg leading-relaxed space-y-2">
                <li><strong className="text-indigo-600">Matching Opportunities:</strong> Connect you with relevant internship opportunities</li>
                <li><strong className="text-indigo-600">Communication:</strong> Send important updates about your applications</li>
                <li><strong className="text-indigo-600">Platform Improvement:</strong> Enhance our services based on user feedback</li>
                <li><strong className="text-indigo-600">Support:</strong> Provide customer support and resolve issues</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
          <div className="flex items-start space-x-4">
            <Database className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-indigo-800 mb-3">Data Sharing and Protection</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                We take data protection seriously:
              </p>
              <ul className="list-disc pl-8 text-gray-700 text-lg leading-relaxed space-y-2">
                <li><strong className="text-indigo-600">No Third-Party Sharing:</strong> We do not sell or share your personal information with third parties</li>
                <li><strong className="text-indigo-600">Secure Storage:</strong> All data is encrypted and stored securely</li>
                <li><strong className="text-indigo-600">Limited Access:</strong> Only authorized personnel can access your information</li>
                <li><strong className="text-indigo-600">Regular Audits:</strong> We conduct regular security audits and updates</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
          <div className="flex items-start space-x-4">
            <FileText className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-indigo-800 mb-3">Your Rights</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                You have control over your data:
              </p>
              <ul className="list-disc pl-8 text-gray-700 text-lg leading-relaxed space-y-2">
                <li><strong className="text-indigo-600">Access:</strong> Request a copy of your personal information</li>
                <li><strong className="text-indigo-600">Correction:</strong> Update or correct your information</li>
                <li><strong className="text-indigo-600">Deletion:</strong> Request deletion of your account and data</li>
                <li><strong className="text-indigo-600">Portability:</strong> Export your data in a portable format</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
          <div className="flex items-start space-x-4">
            <Mail className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-indigo-800 mb-3">Contact Us</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                If you have any questions about our privacy practices or want to exercise your rights, please contact us:
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-indigo-700 font-semibold">
                  <Mail className="h-5 w-5 inline mr-2" />
                 contact.studentera@gmail.com
                </p>
                <p className="text-indigo-700 font-semibold">
                  <Phone className="h-5 w-5 inline mr-2" />
                  +91 9027880288
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Privacy;
