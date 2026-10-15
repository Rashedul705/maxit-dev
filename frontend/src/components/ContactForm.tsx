"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      honeypot: formData.get('honeypot'), // Anti-spam field
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Something went wrong. Please try again later.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center space-y-4 animate-fade-in">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-green-900 font-heading">Message Sent!</h3>
        <p className="text-green-700 max-w-md mx-auto leading-relaxed">
          Thank you for reaching out to Max iT Solution. We have received your message and will get back to you shortly. A confirmation has been sent to your email.
        </p>
        <button 
          onClick={() => setStatus('idle')} 
          className="mt-4 px-6 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors shadow-sm"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-start text-sm">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
      
      {/* Honeypot field (hidden from real users, tricks spam bots) */}
      <input type="text" name="honeypot" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50/50" 
            placeholder="e.g. John Doe" 
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50/50" 
            placeholder="john@example.com" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
            Phone Number <span className="text-gray-400 text-xs font-normal">(Optional)</span>
          </label>
          <input 
            type="tel" 
            id="phone" 
            name="phone" 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50/50" 
            placeholder="+880 1..." 
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">
            Subject <span className="text-gray-400 text-xs font-normal">(Optional)</span>
          </label>
          <input 
            type="text" 
            id="subject" 
            name="subject" 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50/50" 
            placeholder="e.g. Solar rooftop inquiry" 
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
          Your Message <span className="text-red-500">*</span>
        </label>
        <textarea 
          id="message" 
          name="message" 
          rows={4} 
          required 
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50/50 resize-none" 
          placeholder="Tell us about your project or inquiry..."
        ></textarea>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting} 
        className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed group"
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending Message...
          </span>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" /> 
            Send Message
          </>
        )}
      </button>
    </form>
  );
}
