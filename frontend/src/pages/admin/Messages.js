import React, { useState, useEffect, useContext, useRef } from 'react';
import { Send, MessageSquare, User, Clock, Check, CheckCheck, Users, RefreshCw } from 'lucide-react';
import api from '../../config/api';
import AuthContext from '../../context/AuthContext';
import setAuthToken from '../../utils/setAuthToken';

const Messages = () => {
    const { user } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchData = async () => {
        if (localStorage.token) {
            setAuthToken(localStorage.token);
        }
        try {
            // Fetch conversations
            const conversationsRes = await api.get('/messages/conversations');
            setConversations(conversationsRes.data.data);

            // Fetch all users for new conversations
            const usersRes = await api.get('/users');
            setAllUsers(usersRes.data.data.filter(u => u._id !== user._id));

            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch conversations', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user._id]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        
        // If there's a selected conversation, refresh its messages too
        if (selectedConversation) {
            await fetchMessages(selectedConversation.user._id);
        }
        
        setRefreshing(false);
    };

    const fetchMessages = async (userId) => {
        try {
            const res = await api.get(`/messages/${userId}`);
            setMessages(res.data.data);
        } catch (err) {
            console.error('Failed to fetch messages', err);
        }
    };

    const handleConversationSelect = (conversation) => {
        setSelectedConversation(conversation);
        fetchMessages(conversation.user._id);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        setSending(true);
        try {
            const res = await api.post('/messages', {
                receiverId: selectedConversation.user._id,
                content: newMessage.trim()
            });

            setMessages(prev => [...prev, res.data.data]);
            setNewMessage('');

            // Update conversation with new message
            setConversations(prev => 
                prev.map(conv => 
                    conv.user._id === selectedConversation.user._id 
                        ? { ...conv, lastMessage: res.data.data, unreadCount: 0 }
                        : conv
                )
            );
        } catch (err) {
            console.error('Failed to send message', err);
        } finally {
            setSending(false);
        }
    };

    const startNewConversation = async (selectedUser) => {
        // Check if conversation already exists
        const existingConversation = conversations.find(
            conv => conv.user._id === selectedUser._id
        );

        if (existingConversation) {
            handleConversationSelect(existingConversation);
        } else {
            // Create a new conversation object
            const newConversation = {
                user: selectedUser,
                lastMessage: null,
                unreadCount: 0
            };
            setSelectedConversation(newConversation);
            setMessages([]);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString();
        }
    };

    const formatMessagePreview = (content) => {
        return content.length > 50 ? content.substring(0, 50) + '...' : content;
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-16 bg-gray-200 rounded"></div>
                        <div className="h-16 bg-gray-200 rounded"></div>
                        <div className="h-16 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Admin Messages</h1>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
                    <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                {/* Conversations List */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Conversations</h2>
                    </div>
                    
                    {/* New Conversation Button */}
                    <div className="p-4 border-b border-gray-100">
                        <button
                            onClick={() => setSelectedConversation(null)}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            New Message
                        </button>
                    </div>

                    {/* Conversations */}
                    <div className="overflow-y-auto h-[calc(100%-120px)]">
                        {conversations.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                No conversations yet
                            </div>
                        ) : (
                            conversations.map((conversation) => (
                                <div
                                    key={conversation.user._id}
                                    onClick={() => handleConversationSelect(conversation)}
                                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                        selectedConversation?.user._id === conversation.user._id
                                            ? 'bg-blue-50 border-l-4 border-l-blue-600'
                                            : ''
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                            {conversation.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-semibold text-gray-900 truncate">
                                                    {conversation.user.name}
                                                </h3>
                                                {conversation.unreadCount > 0 && (
                                                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                                        {conversation.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-xs text-gray-500">
                                                    {conversation.user.role}
                                                </p>
                                                {conversation.lastMessage && (
                                                    <span className="text-xs text-gray-400">
                                                        {formatTime(conversation.lastMessage.createdAt)}
                                                    </span>
                                                )}
                                            </div>
                                            {conversation.lastMessage && (
                                                <p className="text-xs text-gray-600 truncate mt-1">
                                                    {formatMessagePreview(conversation.lastMessage.content)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Messages Area */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden">
                    {!selectedConversation ? (
                        <div className="h-full flex flex-col items-center justify-center p-8">
                            <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a conversation</h3>
                            <p className="text-gray-500 text-center mb-6">
                                Choose an existing conversation or start a new one with a user
                            </p>
                            
                            {/* User List for New Conversations */}
                            <div className="w-full max-w-md">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Start a conversation with:</h4>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {allUsers.map((user) => (
                                        <button
                                            key={user._id}
                                            onClick={() => startNewConversation(user)}
                                            className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="text-left flex-1">
                                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.role}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-gray-200 bg-gray-50">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        {selectedConversation.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {selectedConversation.user.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {selectedConversation.user.role}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100%-140px)]">
                                {messages.length === 0 ? (
                                    <div className="text-center text-gray-500 mt-8">
                                        No messages yet. Start the conversation!
                                    </div>
                                ) : (
                                    messages.map((message) => (
                                        <div
                                            key={message._id}
                                            className={`flex ${message.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                    message.sender._id === user._id
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-100 text-gray-900'
                                                }`}
                                            >
                                                <p className="text-sm">{message.content}</p>
                                                <div className={`flex items-center justify-end mt-1 space-x-1 ${
                                                    message.sender._id === user._id ? 'text-blue-100' : 'text-gray-500'
                                                }`}>
                                                    <span className="text-xs">
                                                        {formatTime(message.createdAt)}
                                                    </span>
                                                    {message.sender._id === user._id && (
                                                        <span className="text-xs">
                                                            {message.isRead ? <CheckCheck size={12} /> : <Check size={12} />}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <div className="p-4 border-t border-gray-200">
                                <form onSubmit={handleSendMessage} className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={sending}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim() || sending}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {sending ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Send size={20} />
                                        )}
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages; 