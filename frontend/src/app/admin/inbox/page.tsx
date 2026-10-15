"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  Archive, 
  ArchiveRestore,
  Trash2, 
  Send, 
  Clock, 
  Mail, 
  Phone, 
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  X,
  SendHorizontal,
  Info
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

type Conversation = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  status: 'unread' | 'new' | 'open' | 'replied' | 'archived';
  unreadCount: number;
  lastMessagePreview?: string;
  threadMessageId?: string;
  emailStatus?: 'sent' | 'failed' | 'pending';
  lastMessageAt: string;
  createdAt: string;
};

type Message = {
  _id: string;
  conversationId: string;
  direction: 'incoming' | 'outgoing';
  senderName?: string;
  senderEmail?: string;
  subject?: string;
  body: string;
  messageId?: string;
  emailStatus?: 'sent' | 'failed' | 'pending' | 'skipped';
  errorDetails?: string;
  createdAt: string;
};

function InboxContent() {
  const searchParams = useSearchParams();
  const urlConvoId = searchParams.get('id');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvoId, setSelectedConvoId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  
  const [filter, setFilter] = useState<'all' | 'unread' | 'replied' | 'archived'>('all');
  const [search, setSearch] = useState('');
  
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendFeedback, setSendFeedback] = useState<{ type: 'success' | 'warning' | 'error'; text: string } | null>(null);

  // Sync state for IMAP incoming replies
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ message: string; isError?: boolean } | null>(null);

  // Test SMTP Modal
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testEmailInput, setTestEmailInput] = useState('');
  const [testStatus, setTestStatus] = useState<{ loading: boolean; result?: any }>({ loading: false });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showListOnMobile, setShowListOnMobile] = useState(true);

  // Fetch conversations matching current filter and search
  const fetchConversations = async (targetFilter = filter, targetSearch = search) => {
    try {
      const params = new URLSearchParams();
      if (targetFilter !== 'all') params.set('filter', targetFilter);
      if (targetSearch.trim()) params.set('search', targetSearch.trim());
      const queryStr = params.toString() ? `?${params.toString()}` : '';

      const res = await fetch(`/api/admin/inbox${queryStr}`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  };

  // Initial load & Polling (every 8 seconds for real-time responsiveness)
  useEffect(() => {
    fetchConversations(filter, search);
    const interval = setInterval(() => fetchConversations(filter, search), 8000);
    return () => clearInterval(interval);
  }, [filter, search]);

  // Sync selected conversation from URL param if provided
  useEffect(() => {
    if (urlConvoId && (!selectedConvoId || selectedConvoId !== urlConvoId)) {
      setSelectedConvoId(urlConvoId);
      setShowListOnMobile(false);
    }
  }, [urlConvoId]);

  const handleSyncNow = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await fetch('/api/admin/inbox/sync', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.synced > 0) {
          setSyncStatus({ message: `Synced ${data.synced} new customer repl${data.synced === 1 ? 'y' : 'ies'}!` });
        } else {
          setSyncStatus({ message: 'Mailbox is up to date (no new replies).' });
        }
        await fetchConversations(filter, search);
        if (selectedConvoId) {
          await fetchMessages(selectedConvoId, true);
        }
        window.dispatchEvent(new Event('inbox-updated'));
      } else {
        setSyncStatus({ message: `Sync error: ${data.error || 'Check server logs'}`, isError: true });
      }
    } catch (err: any) {
      setSyncStatus({ message: 'Network error while checking for replies', isError: true });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 5000);
    }
  };

  const fetchMessages = async (convoId: string, isSilent = false) => {
    if (!isSilent) {
      setIsLoadingMessages(true);
    }
    try {
      const res = await fetch(`/api/admin/inbox/${convoId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        
        // Mark conversation read in local state
        setConversations(prev => prev.map(c => 
          c._id === convoId ? { ...c, unreadCount: 0, status: c.status === 'unread' || c.status === 'new' ? 'open' : c.status } : c
        ));
        window.dispatchEvent(new Event('inbox-updated'));
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      if (!isSilent) {
        setIsLoadingMessages(false);
      }
    }
  };

  // When a conversation is selected
  useEffect(() => {
    if (selectedConvoId) {
      fetchMessages(selectedConvoId, false);
      setShowListOnMobile(false);
      setSendFeedback(null);

      // Poll current conversation messages every 8 seconds for live chat feel
      const interval = setInterval(() => {
        fetchMessages(selectedConvoId, true);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [selectedConvoId]);

  // Scroll to bottom on messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedConvoId || isSending) return;
    setIsSending(true);
    setSendFeedback(null);

    try {
      const res = await fetch('/api/admin/inbox/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: selectedConvoId, body: replyText.trim() })
      });

      const data = await res.json();

      if (res.ok) {
        setReplyText('');
        if (data.warning) {
          setSendFeedback({ type: 'warning', text: data.warning });
        } else {
          setSendFeedback({ type: 'success', text: 'Reply sent and emailed to visitor!' });
          setTimeout(() => setSendFeedback(null), 4000);
        }
        await fetchMessages(selectedConvoId);
        await fetchConversations();
      } else {
        setSendFeedback({ type: 'error', text: data.error || 'Failed to send reply' });
      }
    } catch (err) {
      setSendFeedback({ type: 'error', text: 'Network error while sending reply' });
    } finally {
      setIsSending(false);
    }
  };

  const handleToggleArchive = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'archived' ? 'open' : 'archived';
    try {
      await fetch(`/api/admin/inbox/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });

      setConversations(prev => prev.map(c => c._id === id ? { ...c, status: nextStatus } : c));
      
      if (filter === 'archived' && nextStatus !== 'archived') {
        setSelectedConvoId(null);
        setShowListOnMobile(true);
      } else if (filter !== 'archived' && nextStatus === 'archived') {
        setSelectedConvoId(null);
        setShowListOnMobile(true);
      }
      fetchConversations();
    } catch (err) {
      console.error('Error toggling archive:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this conversation and all its messages? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/inbox/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (selectedConvoId === id) {
          setSelectedConvoId(null);
          setShowListOnMobile(true);
        }
        setConversations(prev => prev.filter(c => c._id !== id));
      } else {
        alert('Failed to delete conversation.');
      }
    } catch (err) {
      console.error('Error deleting conversation:', err);
    }
  };

  const handleRunSmtpTest = async () => {
    setTestStatus({ loading: true });
    try {
      const res = await fetch('/api/admin/inbox/test-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetEmail: testEmailInput || undefined })
      });
      const data = await res.json();
      setTestStatus({ loading: false, result: data });
    } catch (err: any) {
      setTestStatus({ loading: false, result: { success: false, error: err?.message || 'Request failed' } });
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter(c => {
    const isUnread = c.unreadCount > 0 || c.status === 'unread';

    if (filter === 'unread' && !isUnread) return false;
    if (filter === 'replied' && c.status !== 'replied') return false;
    if (filter === 'archived' && c.status !== 'archived') return false;
    if (filter === 'all' && c.status === 'archived') return false;
    
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = c.name?.toLowerCase().includes(q);
      const matchEmail = c.email?.toLowerCase().includes(q);
      const matchSubject = c.subject?.toLowerCase().includes(q);
      const matchPreview = c.lastMessagePreview?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchSubject && !matchPreview) {
        return false;
      }
    }
    return true;
  });

  const selectedConvo = conversations.find(c => c._id === selectedConvoId);
  const unreadTotal = conversations.filter(c => c.status === 'unread' || c.unreadCount > 0).length;

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Top Banner / Test SMTP trigger */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-2.5 flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800">Admin Inbox</span>
          <span>&bull;</span>
          <span>{conversations.length} total conversations</span>
          {unreadTotal > 0 && (
            <span className="bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full text-[11px]">
              {unreadTotal} unread
            </span>
          )}
          {syncStatus && (
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all ${
              syncStatus.isError ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {syncStatus.message}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleSyncNow()}
            disabled={isSyncing}
            className="flex items-center text-primary font-semibold hover:bg-primary/10 transition-colors gap-1.5 px-3 py-1 rounded-lg border border-primary/20 bg-primary/5 disabled:opacity-50 text-xs"
            title="Fetch customer email replies from Gmail right now"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-primary' : ''}`} />
            <span>{isSyncing ? 'Syncing replies...' : 'Sync now'}</span>
          </button>
          <button 
            onClick={() => fetchConversations()}
            className="flex items-center text-gray-500 hover:text-primary transition-colors gap-1"
            title="Refresh conversations list"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button 
            onClick={() => {
              setTestStatus({ loading: false, result: undefined });
              setIsTestModalOpen(true);
            }}
            className="flex items-center text-primary font-medium hover:underline gap-1"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Test SMTP</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL - CONVERSATION LIST */}
        <div className={`w-full md:w-[380px] lg:w-[420px] flex-col border-r border-gray-200 flex-shrink-0 ${showListOnMobile ? 'flex' : 'hidden md:flex'}`}>
          <div className="p-4 border-b border-gray-100 space-y-3 bg-white">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search name, email, subject, text..." 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filter Pills */}
            <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {[
                { key: 'all', label: 'All' },
                { key: 'unread', label: 'Unread' },
                { key: 'replied', label: 'Replied' },
                { key: 'archived', label: 'Archived' }
              ].map(item => {
                const isActive = filter === item.key;
                return (
                  <button 
                    key={item.key}
                    onClick={() => setFilter(item.key as any)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                      isActive 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 bg-white">
            {filteredConversations.length === 0 ? (
              <div className="p-10 text-center text-gray-500 text-sm flex flex-col items-center">
                <Mail className="w-10 h-10 text-gray-300 mb-2" />
                <p className="font-medium text-gray-600">No conversations found.</p>
                <p className="text-xs text-gray-400 mt-1">
                  {search ? 'Try adjusting your search query.' : 'New messages submitted from the contact page will appear here.'}
                </p>
              </div>
            ) : (
              filteredConversations.map(convo => {
                const isSelected = selectedConvoId === convo._id;
                const isUnread = convo.unreadCount > 0 || convo.status === 'unread';

                return (
                  <div 
                    key={convo._id} 
                    onClick={() => setSelectedConvoId(convo._id)}
                    className={`p-4 cursor-pointer transition-all flex items-start gap-3 relative ${
                      isSelected 
                        ? 'bg-blue-50/80 border-l-4 border-primary' 
                        : isUnread 
                          ? 'bg-blue-50/30 hover:bg-gray-50' 
                          : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      isUnread ? 'bg-primary text-white shadow-sm' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {convo.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className={`text-sm truncate ${isUnread ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                          {convo.name}
                        </h3>
                        <span className="text-[11px] text-gray-400 ml-2 flex-shrink-0">
                          {formatDistanceToNow(new Date(convo.lastMessageAt || convo.createdAt), { addSuffix: true })}
                        </span>
                      </div>

                      <p className={`text-xs truncate mb-1 ${isUnread ? 'font-semibold text-primary' : 'font-medium text-gray-800'}`}>
                        {convo.subject || 'Website Inquiry'}
                      </p>

                      <p className="text-xs text-gray-500 truncate line-clamp-1">
                        {convo.lastMessagePreview || 'Click to view conversation...'}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5">
                        {convo.status === 'replied' && (
                          <span className="inline-block px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-semibold rounded">
                            Replied
                          </span>
                        )}
                        {convo.status === 'archived' && (
                          <span className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-semibold rounded">
                            Archived
                          </span>
                        )}
                        {convo.emailStatus === 'failed' && (
                          <span className="inline-block px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-medium rounded" title="Email delivery failed">
                            SMTP Issue
                          </span>
                        )}
                      </div>
                    </div>

                    {isUnread && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 mt-2 shadow-sm animate-pulse"></div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANEL - CHAT VIEW */}
        <div className={`flex-1 flex-col bg-gray-50/50 ${!showListOnMobile ? 'flex' : 'hidden md:flex'}`}>
          {selectedConvo ? (
            <>
              {/* Header */}
              <div className="h-18 border-b border-gray-200 flex items-center justify-between px-6 py-3 shrink-0 bg-white shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <button 
                    onClick={() => setShowListOnMobile(true)} 
                    className="md:hidden p-1.5 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm hidden sm:flex shadow-sm">
                    {selectedConvo.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-gray-900 truncate leading-tight">{selectedConvo.name}</h2>
                      {selectedConvo.status === 'replied' && (
                        <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Replied
                        </span>
                      )}
                      {selectedConvo.status === 'archived' && (
                        <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          Archived
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                      <span className="flex items-center gap-1 text-gray-700 font-medium">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <a href={`mailto:${selectedConvo.email}`} className="hover:underline">{selectedConvo.email}</a>
                      </span>
                      {selectedConvo.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <a href={`tel:${selectedConvo.phone}`} className="hover:underline">{selectedConvo.phone}</a>
                        </span>
                      )}
                      <span className="text-gray-400">&bull; Subject: <strong className="text-gray-700">{selectedConvo.subject || 'Website Inquiry'}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button 
                    onClick={() => handleToggleArchive(selectedConvo._id, selectedConvo.status)} 
                    className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors" 
                    title={selectedConvo.status === 'archived' ? 'Unarchive' : 'Archive'}
                  >
                    {selectedConvo.status === 'archived' ? (
                      <ArchiveRestore className="w-5 h-5" />
                    ) : (
                      <Archive className="w-5 h-5" />
                    )}
                  </button>

                  <button 
                    onClick={() => handleDelete(selectedConvo._id)} 
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                    title="Delete Conversation"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Chat Thread Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                    <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                    Loading conversation history...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm py-12">
                    No messages in this conversation.
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isIncoming = msg.direction === 'incoming';
                    const showDateHeader = idx === 0 || 
                      format(new Date(msg.createdAt), 'yyyy-MM-dd') !== format(new Date(messages[idx-1].createdAt), 'yyyy-MM-dd');

                    return (
                      <div key={msg._id} className="flex flex-col">
                        {showDateHeader && (
                          <div className="flex justify-center mb-6 mt-2">
                            <span className="text-[11px] font-semibold text-gray-500 bg-gray-200/60 px-3.5 py-1 rounded-full uppercase tracking-wider">
                              {format(new Date(msg.createdAt), 'EEEE, MMMM d, yyyy')}
                            </span>
                          </div>
                        )}
                        
                        <div className={`flex flex-col ${isIncoming ? 'items-start' : 'items-end'}`}>
                          <span className="text-[11px] font-semibold text-gray-400 mb-1 px-1">
                            {isIncoming ? (msg.senderName || selectedConvo.name) : 'You (Admin)'}
                          </span>

                          <div className={`rounded-2xl px-5 py-3.5 max-w-[85%] sm:max-w-[75%] shadow-sm ${
                            isIncoming 
                              ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm' 
                              : 'bg-primary text-white rounded-tr-sm shadow-primary/10'
                          }`}>
                            <div className="text-sm whitespace-pre-wrap leading-relaxed">
                              {msg.body}
                            </div>

                            <div className={`text-[10px] mt-2 flex items-center justify-end gap-1.5 ${
                              isIncoming ? 'text-gray-400' : 'text-blue-100'
                            }`}>
                              <Clock className="w-3 h-3" />
                              <span>{format(new Date(msg.createdAt), 'h:mm a')}</span>
                              
                              {!isIncoming && (
                                <>
                                  {msg.emailStatus === 'sent' && (
                                    <span className="flex items-center text-blue-200 ml-1">
                                      &bull; <CheckCircle2 className="w-3 h-3 ml-1" /> Emailed
                                    </span>
                                  )}
                                  {msg.emailStatus === 'failed' && (
                                    <span className="flex items-center text-red-200 bg-red-900/40 px-1.5 py-0.5 rounded ml-1" title={msg.errorDetails || 'Email delivery failed'}>
                                      <AlertTriangle className="w-3 h-3 mr-1" /> Delivery Failed
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Feedback Alert if send failed/warned */}
              {sendFeedback && (
                <div className={`mx-6 mb-2 p-3 rounded-xl text-xs flex items-center justify-between ${
                  sendFeedback.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : sendFeedback.type === 'warning'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  <span className="font-medium">{sendFeedback.text}</span>
                  <button onClick={() => setSendFeedback(null)} className="ml-2 text-gray-500 hover:text-gray-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Reply Box at the Bottom */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-2.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                    placeholder={`Reply to ${selectedConvo.name} (${selectedConvo.email})... Press Ctrl+Enter to send.`}
                    className="w-full bg-transparent resize-none px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none min-h-[70px] max-h-40"
                    rows={3}
                  />

                  <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 mt-1 px-2">
                    <span className="text-[11px] text-gray-400 hidden sm:inline">
                      Visitor will receive an email from <span className="font-semibold text-gray-600">m4xit.raj@gmail.com</span>
                    </span>
                    
                    <button 
                      onClick={handleSendReply}
                      disabled={isSending || !replyText.trim()}
                      className="ml-auto inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-all shadow-md shadow-primary/20"
                    >
                      {isSending ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <SendHorizontal className="w-4 h-4" />
                          <span>Send Reply</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 text-gray-300">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-1">No Conversation Selected</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Select a message thread from the left panel to read visitor inquiries and send email replies.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Test SMTP Modal */}
      {isTestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 font-heading">SMTP Email Diagnostic</h3>
                <p className="text-xs text-gray-500">Test Nodemailer credentials and delivery</p>
              </div>
              <button 
                onClick={() => setIsTestModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                  Recipient Email
                </label>
                <input 
                  type="email"
                  value={testEmailInput}
                  onChange={(e) => setTestEmailInput(e.target.value)}
                  placeholder="Defaults to m4xit.raj@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {testStatus.result && (
                <div className={`p-4 rounded-xl text-xs space-y-1.5 ${
                  testStatus.result.success 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  <p className="font-bold">
                    {testStatus.result.success ? 'Success!' : 'Connection or Delivery Failed:'}
                  </p>
                  <p className="whitespace-pre-wrap">{testStatus.result.message || testStatus.result.error}</p>
                </div>
              )}

              <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100 text-xs text-blue-900 leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Uses your configured credentials (<code>SMTP_USER</code>, <code>SMTP_PASS</code>) on <code>smtp.gmail.com:587</code>. If using Gmail, remember to use an <strong>App Password</strong>.
                </span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setIsTestModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleRunSmtpTest}
                disabled={testStatus.loading}
                className="px-5 py-2 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm inline-flex items-center gap-1.5"
              >
                {testStatus.loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{testStatus.loading ? 'Testing...' : 'Send Test Email'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function InboxPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-500">Loading Inbox...</div>}>
      <InboxContent />
    </Suspense>
  );
}
