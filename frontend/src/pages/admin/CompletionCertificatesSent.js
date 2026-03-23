import React, { useEffect, useState } from "react";
import axios from "axios";

const CompletionCertificatesSent = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/certificates", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCertificates(res.data.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch certificates.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Completion Certificates Sent</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : certificates.length === 0 ? (
        <div>No certificates have been sent yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Student/Intern ID</th>
                <th className="px-4 py-2 border">Internship Title</th>
                <th className="px-4 py-2 border">Duration</th>
                <th className="px-4 py-2 border">Completion Date</th>
                <th className="px-4 py-2 border">Certificate ID</th>
                <th className="px-4 py-2 border">PDF</th>
                <th className="px-4 py-2 border">Issued On</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((cert) => (
                <tr key={cert._id}>
                  <td className="px-4 py-2 border">{cert.candidateName}</td>
                  <td className="px-4 py-2 border">{cert.user}</td>
                  <td className="px-4 py-2 border">{cert.internshipTitle}</td>
                  <td className="px-4 py-2 border">{cert.duration}</td>
                  <td className="px-4 py-2 border">
                    {cert.completionDate?.slice(0, 10)}
                  </td>
                  <td className="px-4 py-2 border">{cert.certificateId}</td>
                  <td className="px-4 py-2 border">
                    {cert.fileUrl ? (
                      <a
                        href={cert.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View PDF
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {cert.createdAt?.slice(0, 10)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompletionCertificatesSent;
