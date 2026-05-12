import React from "react";
import { Shield, Eye, Lock, Database, FileText, Mail } from "lucide-react";

const Privacy = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl w-full">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We are committed to protecting your personal information and being transparent about our data practices.
        </p>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-2xl p-8 md:p-10 space-y-10">

        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex-shrink-0 bg-primary/10 p-3 rounded-xl border border-primary/20">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Our Commitment to Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              At Student Era, your privacy is our top priority. We are committed to protecting your personal information
              and being transparent about how we collect, use, and safeguard your data.
            </p>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gray-100 hidden sm:block"></div>

        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex-shrink-0 bg-primary/10 p-3 rounded-xl border border-primary/20">
            <Eye className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We collect information to provide better services to our users:
            </p>
            <ul className="list-disc pl-5 text-gray-600 leading-relaxed space-y-2 marker:text-primary">
              <li><strong className="text-gray-900 font-medium">Personal Information:</strong> Name, email, phone number, educational background.</li>
              <li><strong className="text-gray-900 font-medium">Application Data:</strong> Internship preferences, skills, and application history.</li>
              <li><strong className="text-gray-900 font-medium">Usage Information:</strong> How you interact with our platform.</li>
              <li><strong className="text-gray-900 font-medium">Payment Information:</strong> Processed securely through third-party providers.</li>
            </ul>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gray-100 hidden sm:block"></div>

        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex-shrink-0 bg-primary/10 p-3 rounded-xl border border-primary/20">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Your information helps us provide and improve our services:
            </p>
            <ul className="list-disc pl-5 text-gray-600 leading-relaxed space-y-2 marker:text-primary">
              <li><strong className="text-gray-900 font-medium">Matching Opportunities:</strong> Connect you with relevant internship opportunities.</li>
              <li><strong className="text-gray-900 font-medium">Communication:</strong> Send important updates about your applications.</li>
              <li><strong className="text-gray-900 font-medium">Platform Improvement:</strong> Enhance our services based on user feedback.</li>
              <li><strong className="text-gray-900 font-medium">Support:</strong> Provide customer support and resolve issues.</li>
            </ul>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gray-100 hidden sm:block"></div>

        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex-shrink-0 bg-primary/10 p-3 rounded-xl border border-primary/20">
            <Database className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Data Sharing and Protection</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We take data protection seriously:
            </p>
            <ul className="list-disc pl-5 text-gray-600 leading-relaxed space-y-2 marker:text-primary">
              <li><strong className="text-gray-900 font-medium">No Third-Party Sharing:</strong> We do not sell or share your personal information with third parties.</li>
              <li><strong className="text-gray-900 font-medium">Secure Storage:</strong> All data is encrypted and stored securely.</li>
              <li><strong className="text-gray-900 font-medium">Limited Access:</strong> Only authorized personnel can access your information.</li>
              <li><strong className="text-gray-900 font-medium">Regular Audits:</strong> We conduct regular security audits and updates.</li>
            </ul>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gray-100 hidden sm:block"></div>

        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex-shrink-0 bg-primary/10 p-3 rounded-xl border border-primary/20">
            <FileText className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You have control over your data:
            </p>
            <ul className="list-disc pl-5 text-gray-600 leading-relaxed space-y-2 marker:text-primary">
              <li><strong className="text-gray-900 font-medium">Access:</strong> Request a copy of your personal information.</li>
              <li><strong className="text-gray-900 font-medium">Correction:</strong> Update or correct your information.</li>
              <li><strong className="text-gray-900 font-medium">Deletion:</strong> Request deletion of your account and data.</li>
              <li><strong className="text-gray-900 font-medium">Portability:</strong> Export your data in a portable format.</li>
            </ul>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gray-100 hidden sm:block"></div>

        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex-shrink-0 bg-primary/10 p-3 rounded-xl border border-primary/20">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have any questions about our privacy practices or want to exercise your rights, please contact us:
            </p>
            <a href="mailto:contact@studentera.online" className="group inline-flex items-center text-gray-600 hover:text-primary transition-colors">
              <Mail className="h-5 w-5 mr-3 text-gray-400 group-hover:text-primary" />
              <span className="font-medium">contact@studentera.online</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  </div>
);

export default Privacy;
