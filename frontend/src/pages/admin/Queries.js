import React, { useEffect, useState } from "react";

const Queries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQueries = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/contact-queries', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setQueries(data.data);
        } else {
          setError("Failed to fetch queries.");
        }
      } catch (err) {
        setError("Failed to fetch queries.");
      }
      setLoading(false);
    };
    fetchQueries();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Contact Queries</h1>
      <div className="bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {queries.map((q, i) => (
                <tr key={i}>
                  <td className="px-4 py-2 whitespace-nowrap font-semibold">{q.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-blue-700 underline">{q.email}</td>
                  <td className="px-4 py-2 whitespace-nowrap max-w-xs truncate" title={q.message}>{q.message}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-500">{new Date(q.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && !error && queries.length === 0 && <div className="text-center text-gray-500 py-8">No queries found.</div>}
      </div>
    </div>
  );
};

export default Queries; 