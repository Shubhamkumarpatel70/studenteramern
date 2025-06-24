import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";

const HelpQueries = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resolving, setResolving] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchQueries = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("/api/help-queries");
        setQueries(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedQuery(res.data.data[0]);
        }
      } catch (err) {
        setError("Failed to load help queries. Please try again later.");
      }
      setLoading(false);
    };
    fetchQueries();
  }, [isAuthenticated]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedQuery]);

  const handleSelect = (query) => {
    setSelectedQuery(query);
    setInput("");
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedQuery) return;
    setError("");
    try {
      const res = await axios.post(`/api/help-queries/${selectedQuery._id}/message`, { text: input, from: "admin" });
      // Update the selected query and queries list
      setSelectedQuery(res.data.data);
      setQueries(queries => queries.map(q => q._id === res.data.data._id ? res.data.data : q));
      setInput("");
    } catch (err) {
      setError("Failed to send message. Please try again.");
    }
  };

  const resolveQuery = async () => {
    if (!selectedQuery) return;
    setResolving(true);
    setError("");
    try {
      const res = await axios.put(`/api/help-queries/${selectedQuery._id}/resolve`);
      setSelectedQuery(res.data.data);
      setQueries(queries => queries.map(q => q._id === res.data.data._id ? res.data.data : q));
    } catch (err) {
      setError("Failed to resolve query. Please try again.");
    }
    setResolving(false);
  };

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-2">Admin access required</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 border-r bg-white p-4">
        <h2 className="text-xl font-bold mb-4 text-indigo-700">User Queries</h2>
        {loading ? (
          <div className="text-center py-8">Loading queries...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : (
          <ul>
            {queries.length === 0 && <div className="text-gray-400 text-center">No queries found.</div>}
            {queries.map(q => (
              <li key={q._id} className={`p-3 rounded-lg mb-2 cursor-pointer ${selectedQuery?._id === q._id ? 'bg-indigo-100 font-bold' : 'hover:bg-gray-100'}`} onClick={() => handleSelect(q)}>
                <div>{q.user?.name || "Unknown User"}</div>
                <div className="text-xs text-gray-500">{q.user?.email}</div>
                <div className={`text-xs mt-1 ${q.status === 'resolved' ? 'text-green-600' : 'text-yellow-600'}`}>{q.status === 'resolved' ? 'Resolved' : 'Open'}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex-1 flex flex-col p-4">
        <h2 className="text-xl font-bold mb-4 text-indigo-700">{selectedQuery ? `Chat with ${selectedQuery.user?.name || "User"}` : "Select a query"}</h2>
        <div className="flex-1 overflow-y-auto mb-4 max-h-96 border rounded-lg bg-gray-50 p-4">
          {selectedQuery && selectedQuery.messages.length === 0 && (
            <div className="text-gray-400 text-center">No messages yet.</div>
          )}
          {selectedQuery && selectedQuery.messages.map((msg, i) => (
            <div key={i} className={`mb-2 flex ${msg.from === "admin" ? "justify-end" : "justify-start"}`}>
              <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.from === "admin" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        {selectedQuery && selectedQuery.status !== 'resolved' && (
          <form onSubmit={sendMessage} className="flex gap-2 mb-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
              placeholder="Type your message..."
              required
              disabled={loading}
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition" disabled={loading}>Send</button>
          </form>
        )}
        {selectedQuery && selectedQuery.status !== 'resolved' && (
          <button onClick={resolveQuery} className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition" disabled={resolving}>
            {resolving ? 'Resolving...' : 'Mark as Resolved'}
          </button>
        )}
        {selectedQuery && selectedQuery.status === 'resolved' && (
          <div className="text-green-700 font-semibold mt-2">This query is resolved.</div>
        )}
      </div>
    </div>
  );
};

export default HelpQueries; 