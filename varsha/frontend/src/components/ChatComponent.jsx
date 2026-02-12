import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const ChatComponent = ({ bookingId, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { user } = useAuth();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchMessages();
        // Poll for new messages every 3 seconds
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [bookingId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/chat/${bookingId}`, { withCredentials: true });
            setMessages(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await axios.post(`http://localhost:5000/api/chat/${bookingId}`, {
                message: newMessage,
            }, { withCredentials: true });
            setNewMessage('');
            fetchMessages();
        } catch (err) {
            toast.error('Failed to send message');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md h-[500px] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-medium text-gray-900">Session Chat</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => {
                        const isMe = msg.senderRole === (user.role === 'admin' ? 'admin' : user.role) || (user.specialization && msg.senderRole === 'counselor');
                        // Simpler check: we don't have senderId populated in chat response usually? 
                        // My controller returns message array which has senderId.
                        // Wait, my controller returns `chat.messages` which matches schema.
                        // Schema: senderId, senderRole, message, timestamp.
                        const isMyMessage = msg.senderId === user._id;

                        return (
                            <div key={index} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs px-4 py-2 rounded-lg ${isMyMessage ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                                    <p className="text-sm">{msg.message}</p>
                                    <p className={`text-xs mt-1 ${isMyMessage ? 'text-indigo-200' : 'text-gray-500'}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-2"
                            placeholder="Type a message..."
                        />
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatComponent;
