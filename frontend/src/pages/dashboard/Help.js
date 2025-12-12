import React, { useState, useRef, useEffect, useContext } from "react";
import api from '../../config/api';
import AuthContext from "../../context/AuthContext";
import { RefreshCw, Loader2, MessageSquare } from 'lucide-react';

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
        <div className="bg-card p-8 rounded-2xl shadow-2xl text-center">
          <h2 className="text-2xl font-extrabold mb-2 text-primary-dark font-sans">Please log in to use Help Chat</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen">
      <div className="w-full">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 flex flex-col h-[calc(100vh-8rem)] sm:h-[calc(100vh-10rem)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1">Help & Support Chat</h1>
              <p className="text-xs sm:text-sm text-gray-600">Get assistance from our support team</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-xs font-semibold">{allQueries.length} queries</span>
                <span className="bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full text-xs font-semibold">{messages.length} messages</span>
              </div>
              <button
                onClick={fetchQuery}
                className="px-3 sm:px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl shadow-md transition-all duration-200 disabled:opacity-50 flex items-center gap-2 text-sm font-semibold"
                title="Refresh chat"
                disabled={loading}
              >
                <RefreshCw className={loading ? 'animate-spin' : ''} size={16} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-3" />
                <p className="text-gray-600">Loading chat...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 text-center">{error}</div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto mb-4 border-2 border-gray-200 rounded-xl bg-gray-50 p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                        <MessageSquare className="h-8 w-8 text-blue-600" />
                      </div>
                      <p className="text-gray-500 font-medium">No messages yet. Start the conversation!</p>
                    </div>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] sm:max-w-xs shadow-md ${
                      msg.from === "user" 
                        ? "bg-gray-600 text-white" 
                        : "bg-white text-gray-800 border border-gray-200"
                    }`}>
                      <p className="text-sm sm:text-base break-words">{msg.text}</p>
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
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base bg-white"
                  placeholder="Type your message..."
                  required
                  disabled={loading}
                />
                <button 
                  type="submit" 
                  className="px-4 sm:px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center gap-2" 
                  disabled={loading}
                >
                  <span className="hidden sm:inline">Send</span>
                  <span className="sm:hidden">→</span>
                </button>
              </form>
            {resolvedQueries.length > 0 && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">Resolved Queries</h2>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {resolvedQueries.map(q => (
                    <div key={q._id} className="border border-gray-200 rounded-xl bg-white">
                      <button
                        className="w-full text-left px-4 py-3 font-semibold flex justify-between items-center focus:outline-none hover:bg-gray-100 rounded-xl transition-colors"
                        onClick={() => setExpanded(exp => ({ ...exp, [q._id]: !exp[q._id] }))}
                      >
                        <span className="text-sm text-gray-700">Resolved on {new Date(q.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span className="text-xs text-green-600 font-semibold">{expanded[q._id] ? 'Hide' : 'View'}</span>
                      </button>
                      {expanded[q._id] && (
                        <div className="px-4 pb-4 space-y-2">
                          {q.messages.length === 0 && <div className="text-gray-400 text-sm text-center py-2">No messages in this query.</div>}
                          {q.messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                              <div className={`px-3 py-2 rounded-xl max-w-[80%] text-sm ${
                                msg.from === "user" 
                                  ? "bg-blue-100 text-blue-900" 
                                  : "bg-white text-gray-800 border border-gray-200"
                              }`}>
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
    </div>
  );
};

export default Help; 