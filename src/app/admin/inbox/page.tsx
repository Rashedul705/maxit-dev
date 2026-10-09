"use client";

import { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Archive, 
  Trash2, 
  CheckCircle, 
  Circle,
  Send,
  MoreVertical,
  Clock,
  Mail,
  Phone,
  ArrowLeft
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

type Conversation = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'new' | 'open' | 'replied' | 'archived';
  unreadCount: number;
  lastMessageAt: string;
  createdAt: string;
};

type Message = {
  _id: string;
  conversationId: string;
  direction: 'incoming' | 'outgoing';
  body: string;
  emailStatus?: 'sent' | 'failed';
  createdAt: string;
};

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvoId, setSelectedConvoId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [filter, setFilter] = useState<'all' | 'unread' | 'replied' | 'archived'>('all');
  const [search, setSearch] = useState('');
  
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mobile view state
  const [showListOnMobile, setShowListOnMobile] = useState(true);

  // Poll conversations
  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/admin/inbox');
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (convoId: string) => {
    try {
      const res = await fetch(`/api/admin/inbox/${convoId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
        // also update the unread count locally for this convo
        setConversations(prev => prev.map(c => 
          c._id === convoId ? { ...c, unreadCount: 0, status: c.status === 'new' ? 'open' : c.status } : c
        ));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // When a conversation is selected, fetch messages
  useEffect(() => {
    if (selectedConvoId) {
      fetchMessages(selectedConvoId);
      setShowListOnMobile(false);
      // Optional: set interval to poll messages for the active conversation
      const interval = setInterval(() => fetchMessages(selectedConvoId), 15000);
      return () => clearInterval(interval);
    }
  }, [selectedConvoId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedConvoId) return;
    setIsSending(true);
    try {
      const res = await fetch('/api/admin/inbox/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: selectedConvoId, body: replyText })
      });
      if (res.ok) {
        setReplyText('');
        fetchMessages(selectedConvoId);
        fetchConversations();
      } else {
        alert('Failed to send reply');
      }
    } catch (err) {
      alert('Error sending reply');
    } finally {
      setIsSending(false);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await fetch(`/api/admin/inbox/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'archived' })
      });
      if (selectedConvoId === id) {
        setSelectedConvoId(null);
        setShowListOnMobile(true);
      }
      fetchConversations();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredConversations = conversations.filter(c => {
    if (filter === 'unread' && c.unreadCount === 0) return false;
    if (filter === 'replied' && c.status !== 'replied') return false;
    if (filter === 'archived' && c.status !== 'archived') return false;
    if (filter !== 'archived' && c.status === 'archived') return false;
    
    if (search) {
      const q = search.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const selectedConvo = conversations.find(c => c._id === selectedConvoId);

  return (
    <div className="h-[calc(100vh-120px)] flex bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* LEFT PANEL - CONVERSATION LIST */}
      <div className={`w-full md:w-1/3 flex-col border-r border-gray-200 ${showListOnMobile ? 'flex' : 'hidden md:flex'}`}>
        <div className="p-4 border-b border-gray-100 space-y-4">
          <h2 className="text-xl font-bold font-heading text-gray-900">Inbox</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-hide">
            {['all', 'unread', 'replied', 'archived'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap capitalize ${filter === f ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No conversations found.</div>
          ) : (
            filteredConversations.map(convo => (
              <div 
                key={convo._id} 
                onClick={() => setSelectedConvoId(convo._id)}
                className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors flex items-start gap-3 ${selectedConvoId === convo._id ? 'bg-blue-50/50' : ''}`}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0">
                  {convo.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`text-sm truncate ${convo.unreadCount > 0 ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                      {convo.name}
                    </h3>
                    <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                      {formatDistanceToNow(new Date(convo.lastMessageAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${convo.unreadCount > 0 ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
                    {convo.email}
                  </p>
                </div>
                {convo.unreadCount > 0 && (
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-2"></div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT PANEL - CHAT VIEW */}
      <div className={`w-full md:w-2/3 flex-col ${!showListOnMobile ? 'flex' : 'hidden md:flex'}`}>
        {selectedConvo ? (
          <>
            <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 shrink-0 bg-white">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowListOnMobile(true)} className="md:hidden p-1 mr-1 text-gray-500 hover:bg-gray-100 rounded-lg">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold hidden md:flex">
                  {selectedConvo.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 leading-tight">{selectedConvo.name}</h2>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span>{selectedConvo.email}</span>
                    {selectedConvo.phone && <span>• {selectedConvo.phone}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {selectedConvo.status !== 'archived' && (
                  <button onClick={() => handleArchive(selectedConvo._id)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="Archive">
                    <Archive className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 space-y-6">
              {messages.map((msg, i) => {
                const isIncoming = msg.direction === 'incoming';
                const showDate = i === 0 || format(new Date(msg.createdAt), 'yyyy-MM-dd') !== format(new Date(messages[i-1].createdAt), 'yyyy-MM-dd');
                
                return (
                  <div key={msg._id} className="flex flex-col">
                    {showDate && (
                      <div className="flex justify-center mb-6 mt-2">
                        <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                          {format(new Date(msg.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                    )}
                    
                    <div className={`flex max-w-[80%] ${isIncoming ? 'self-start' : 'self-end'}`}>
                      <div className={`rounded-2xl px-5 py-3 shadow-sm ${isIncoming ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm' : 'bg-primary text-white rounded-tr-sm'}`}>
                        <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.body}</div>
                        <div className={`text-[10px] mt-2 flex items-center justify-end gap-1 ${isIncoming ? 'text-gray-400' : 'text-primary-100'}`}>
                          {format(new Date(msg.createdAt), 'h:mm a')}
                          {!isIncoming && msg.emailStatus === 'failed' && <span className="text-red-300 ml-1">(Failed to send)</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-100 bg-white">
              <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      handleSendReply();
                    }
                  }}
                  placeholder="Type a reply... (Ctrl+Enter to send)"
                  className="flex-1 max-h-32 min-h-[40px] bg-transparent resize-none px-3 py-2 text-sm focus:outline-none"
                  rows={2}
                />
                <button 
                  onClick={handleSendReply}
                  disabled={isSending || !replyText.trim()}
                  className="p-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <Mail className="w-16 h-16 mb-4 opacity-20" />
            <p>Select a conversation to read</p>
          </div>
        )}
      </div>
    </div>
  );
}
