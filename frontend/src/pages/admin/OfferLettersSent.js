import React, { useEffect, useState } from "react";
import api from "../../config/api";

const OfferLettersSent = () => {
  const [offerLetters, setOfferLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOfferLetters = async () => {
      setLoading(true);
      try {
        const res = await api.get("/offer-letters");
        if (res.data.success) {
          setOfferLetters(res.data.data);
        } else {
          setError("Failed to fetch offer letters");
        }
      } catch (err) {
        setError("Failed to fetch offer letters");
      } finally {
        setLoading(false);
      }
    };
    fetchOfferLetters();
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-6 text-[#0A2463]">
        Offer Letters Sent
      </h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : offerLetters.length === 0 ? (
        <div>No offer letters sent yet.</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Student/Intern ID
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Domain
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Date of Sent
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                PDF
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {offerLetters.map((letter) => (
              <tr key={letter._id}>
                <td className="px-4 py-2">
                  {letter.user?.name || letter.candidateName || "-"}
                </td>
                <td className="px-4 py-2">
                  {letter.user?.internId || letter.internId || letter.user?._id}
                </td>
                <td className="px-4 py-2">{letter.title}</td>
                <td className="px-4 py-2">
                  {letter.issueDate
                    ? new Date(letter.issueDate).toLocaleString()
                    : "-"}
                </td>
                <td className="px-4 py-2">
                  {letter.fileUrl ? (
                    <a
                      href={letter.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View PDF
                    </a>
                  ) : (
                    "Not Available"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OfferLettersSent;
