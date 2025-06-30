import React, { useState, useRef, useEffect, useContext } from "react";
import api from '../../config/api';
import AuthContext from "../../context/AuthContext";
import { RefreshCw } from 'lucide-react';

const Help = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [queryId, setQueryId] = useState(null);
  const [allQueries, setAllQueries] = useState([]);
  const [expanded, setExpanded] = useState({});
  const chatEndRef = useRef(null);

  // Move fetchQuery outside useEffect
  const fetchQuery = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/help-queries/my");
      setAllQueries(res.data.data);
      // Find open query or most recent
      const openQuery = res.data.data.find(q => q.status === "open");
      if (openQuery) {
        setQueryId(openQuery._id);
        setMessages(openQuery.messages || []);
      } else if (res.data.data.length > 0) {
        setQueryId(res.data.data[0]._id);
        setMessages(res.data.data[0].messages || []);
      } else {
        setQueryId(null);
        setMessages([]);
      }
    } catch (err) {
      setError("Failed to load help chat. Please try again later.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchQuery();
    const interval = setInterval(fetchQuery, 30000); // auto-refresh every 30s
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setError("");
    try {
      if (!queryId) {
        // Start a new query
        const res = await api.post("/help-queries/start", { text: input });
        setQueryId(res.data.data._id);
        setMessages(res.data.data.messages || []);
        setAllQueries(qs => [res.data.data, ...qs]);
      } else {
        // Add message to existing query
        try {
          const res = await api.post(`/help-queries/${queryId}/message`, { text: input, from: "user" });
          setMessages(res.data.data.messages || []);
          setAllQueries(qs => qs.map(q => q._id === res.data.data._id ? res.data.data : q));
        } catch (err) {
          // Log error for debugging
          console.error('Help chat error:', err);
          // If any 400 error, start a new query
          if (err.response && err.response.status === 400) {
            try {
              const res = await api.post("/help-queries/start", { text: input });
              setQueryId(res.data.data._id);
              setMessages(res.data.data.messages || []);
              setAllQueries(qs => [res.data.data, ...qs]);
            } catch (startErr) {
              setError("Failed to start a new help chat. Please try again.");
            }
          } else {
            setError("Failed to send message. Please try again.");
          }
        }
      }
      setInput("");
    } catch (err) {
      setError("Failed to send message. Please try again.");
    }
  };

  const resolvedQueries = allQueries.filter(q => q.status === 'resolved');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-2">Please log in to use Help Chat</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center px-2">
      <div className="bg-white bg-opacity-90 p-2 sm:p-6 rounded-xl shadow-2xl max-w-lg w-full mt-8 mb-8 flex flex-col mx-auto font-sans font-medium">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-indigo-700 text-center flex-1">Help & Support Chat</h1>
          <button
            onClick={fetchQuery}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition disabled:opacity-50 ml-4"
            title="Refresh chat"
            disabled={loading}
          >
            <RefreshCw className={loading ? 'animate-spin' : ''} size={18} />
            Refresh
          </button>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-semibold">{allQueries.length} queries</span>
          <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">{messages.length} messages</span>
        </div>
        {loading ? (
          <div className="text-center py-8">Loading chat...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto mb-4 max-h-96 border rounded-lg bg-gray-50 p-4">
              {messages.length === 0 && (
                <div className="text-gray-400 text-center">No messages yet. Start the conversation!</div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`mb-2 flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.from === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={sendMessage} className="flex gap-2">
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
            {resolvedQueries.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-2 text-indigo-700">Resolved Queries</h2>
                <div className="space-y-3">
                  {resolvedQueries.map(q => (
                    <div key={q._id} className="border rounded-lg bg-gray-50">
                      <button
                        className="w-full text-left px-4 py-2 font-semibold flex justify-between items-center focus:outline-none"
                        onClick={() => setExpanded(exp => ({ ...exp, [q._id]: !exp[q._id] }))}
                      >
                        <span>Resolved on {new Date(q.updatedAt).toLocaleString()}</span>
                        <span className="text-xs text-green-600">{expanded[q._id] ? 'Hide' : 'View'}</span>
                      </button>
                      {expanded[q._id] && (
                        <div className="px-4 pb-3">
                          {q.messages.length === 0 && <div className="text-gray-400">No messages in this query.</div>}
                          {q.messages.map((msg, i) => (
                            <div key={i} className={`mb-2 flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                              <div className={`px-3 py-2 rounded-lg max-w-xs text-sm ${msg.from === "user" ? "bg-blue-200 text-blue-900" : "bg-gray-200 text-gray-800"}`}>
                                {msg.text}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Help; 