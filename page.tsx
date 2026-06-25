'use client';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  // Tabs management
  const [activeTab, setActiveTab] = useState<'pills' | 'calendar'>('pills');
  const [logs, setLogs] = useState<any[]>([]);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  // Drug State
  const [currentMeds, setCurrentMeds] = useState('Aspirin, Metformin');
  const [newDrug, setNewDrug] = useState('Ibuprofen');

  // Appointment State
  const [provider, setProvider] = useState('Dr. Hamza');
  const [visitType, setVisitType] = useState('Follow-up');
  const [slot, setSlot] = useState('10:00 AM');
  const [urgency, setUrgency] = useState('Routine');
  const [alternatives, setAlternatives] = useState<string[]>([]);

  // 2026 Floating Chatboard States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { sender: 'system', text: 'Secure Clinical WebSockets Channel Established.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  
  const wsRef = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Smooth scroll chat matrix
  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen]);

  // Real-time communication pipeline setup
  useEffect(() => {
    wsRef.current = new WebSocket('ws://localhost:8000/ws/chat');
    wsRef.current.onmessage = (event) => {
      setMessages((prev) => [...prev, { sender: 'agent', text: event.data }]);
    };
    return () => wsRef.current?.close();
  }, []);

  const sendChatMessage = () => {
    if (!chatInput.trim() || !wsRef.current) return;
    setMessages((prev) => [...prev, { sender: 'staff', text: chatInput }]);
    wsRef.current.send(chatInput);
    setChatInput('');
  };

  const handleDrugCheck = async () => {
    setLoading(true);
    setAlternatives([]);
    try {
      const response = await fetch('http://localhost:8000/api/check-drug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_meds: currentMeds.split(','), new_drug: newDrug })
      });
      const data = await response.json();
      setResult(data.analysis);
      setLogs(data.logs);
    } catch {
      resetState();
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleCheck = async () => {
    setLoading(true);
    setAlternatives([]);
    try {
      const response = await fetch('http://localhost:8000/api/schedule-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider_id: provider, visit_type: visitType, requested_slot: slot, urgency_level: urgency })
      });
      const data = await response.json();
      setResult(data.analysis);
      setLogs(data.logs);
      if (data.alternatives) setAlternatives(data.alternatives);
    } catch {
      resetState();
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setResult('Backend connection lost.');
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-[#030712] bg-gradient-to-tr from-[#030712] via-[#060d22] to-[#020617] text-white p-8 font-sans antialiased relative overflow-x-hidden selection:bg-emerald-500/30">
      
      {/* 2026 Ambient Lighting Core (Sci-Fi Cyber Aura) */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none animate-pulse duration-[6000ms]" />
      <div className="absolute bottom-[15%] right-[-5%] w-[500px] h-[500px] bg-blue-600/5 blur-[130px] rounded-full pointer-events-none" />

      {/* Header Panel */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-900/80 pb-5 backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
            MedAgent HMS
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">Multi-Agent Healthcare Orchestration Platform</p>
        </div>
        
        <div className="bg-[#0f172a]/70 backdrop-blur-md p-1 rounded-xl border border-slate-800/60 shadow-2xl flex gap-1.5 transition-all duration-300 hover:border-slate-700/50">
          <button 
            onClick={() => { setActiveTab('pills'); setResult(''); setLogs([]); setAlternatives([]); }} 
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 transform active:scale-95 ${activeTab === 'pills' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/50 scale-105' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}
          >
            💊 MedAgent (Pharmacy)
          </button>
          <button 
            onClick={() => { setActiveTab('calendar'); setResult(''); setLogs([]); setAlternatives([]); }} 
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 transform active:scale-95 ${activeTab === 'calendar' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/50 scale-105' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'}`}
          >
            📅 Scheduler Agent (Clinic)
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* Control Center Column */}
        <div className="bg-[#0b1329]/50 backdrop-blur-md border border-slate-800/60 p-6 rounded-2xl shadow-2xl flex flex-col justify-between min-h-[350px] transition-all duration-300 hover:border-slate-700/40 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent group-hover:via-emerald-500/60 transition-all duration-700" />
          
          <div>
            <h2 className="text-base font-bold text-slate-200 tracking-wide mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Control Center
            </h2>
            
            <div className="space-y-4">
              {activeTab === 'pills' ? (
                <>
                  <div className="animate-fadeIn">
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Current Medications</label>
                    <input type="text" value={currentMeds} onChange={(e) => setCurrentMeds(e.target.value)} className="w-full bg-[#030712] border border-slate-800 rounded-xl p-2.5 text-xs font-medium text-slate-200 focus:border-emerald-500/50 outline-none transition hover:bg-[#060c1d]" />
                  </div>
                  <div className="animate-fadeIn">
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">New Prescription Input</label>
                    <input type="text" value={newDrug} onChange={(e) => setNewDrug(e.target.value)} className="w-full bg-[#030712] border border-slate-800 rounded-xl p-2.5 text-xs font-medium text-slate-200 focus:border-emerald-500/50 outline-none transition hover:bg-[#060c1d]" />
                  </div>
                  <button onClick={handleDrugCheck} disabled={loading} className="w-full relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-800 disabled:to-slate-900 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-md active:scale-[0.98] mt-4 tracking-wider uppercase">
                    {loading ? 'Running Interaction Loop...' : 'Analyze Clinical Risk'}
                  </button>
                </>
              ) : (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Provider ID</label>
                      <select value={provider} onChange={(e) => setProvider(e.target.value)} className="w-full bg-[#030712] border border-slate-800 rounded-xl p-2.5 text-xs font-medium text-slate-200 focus:border-emerald-500/50 outline-none transition hover:bg-[#060c1d]">
                        <option value="Dr. Hamza">Dr. Hamza</option>
                        <option value="Dr. Ghias">Dr. Ghias</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Urgency Status</label>
                      <select value={urgency} onChange={(e) => setUrgency(e.target.value)} className="w-full bg-[#030712] border border-slate-800 rounded-xl p-2.5 text-xs font-medium text-slate-200 focus:border-emerald-500/50 outline-none transition hover:bg-[#060c1d]">
                        <option value="Routine">Routine Visit</option>
                        <option value="Urgent">Urgent (Override)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Classification</label>
                      <select value={visitType} onChange={(e) => setVisitType(e.target.value)} className="w-full bg-[#030712] border border-slate-800 rounded-xl p-2.5 text-xs font-medium text-slate-200 focus:border-emerald-500/50 outline-none transition hover:bg-[#060c1d]">
                        <option value="Follow-up">Standard Follow-up</option>
                        <option value="New Patient">New Patient Intake</option>
                        <option value="Procedure">Surgical Procedure</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Target Slot</label>
                      <select value={slot} onChange={(e) => setSlot(e.target.value)} className="w-full bg-[#030712] border border-slate-800 rounded-xl p-2.5 text-xs font-medium text-slate-200 focus:border-emerald-500/50 outline-none transition hover:bg-[#060c1d]">
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={handleScheduleCheck} disabled={loading} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-800 disabled:to-slate-900 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-md active:scale-[0.98] mt-4 tracking-wider uppercase">
                    {loading ? 'Orchestrating Workflow...' : 'Execute Intelligent Schedule'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Telemetry Log Column */}
        <div className="bg-[#0b1329]/50 backdrop-blur-md border border-slate-800/60 p-6 rounded-2xl shadow-2xl flex flex-col h-[350px] transition-all duration-300 hover:border-slate-700/40">
          <h2 className="text-base font-bold text-slate-200 tracking-wide mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" /> Agent Telemetry
          </h2>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar font-mono text-[11px]">
            {logs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 italic">
                Telemetry stream engine idle...
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="bg-[#030712]/80 p-3 border border-slate-800/40 rounded-xl flex flex-col gap-1 transition-all duration-200 hover:bg-[#050b18] transform hover:-translate-y-[1px] animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-400 tracking-wider">[{log.agent}]</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{log.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* System Intelligence Output Column */}
        <div className="bg-[#0b1329]/50 backdrop-blur-md border border-slate-800/60 p-6 rounded-2xl shadow-2xl flex flex-col h-[350px] transition-all duration-300 hover:border-slate-700/40">
          <h2 className="text-base font-bold text-slate-200 tracking-wide mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> System Intelligence Output
          </h2>
          <div className="flex-1 bg-[#030712]/90 border border-slate-800/40 rounded-xl p-4 overflow-y-auto text-xs text-slate-300 whitespace-pre-wrap leading-relaxed shadow-inner font-sans custom-scrollbar">
            {result || "Awaiting operation metrics initialization..."}
            
            {alternatives.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-900/80 animate-slideUp">
                <span className="text-[10px] font-bold text-amber-400 block mb-2.5 uppercase tracking-widest animate-pulse">
                  💡 Auto-Suggested Available Alternatives:
                </span>
                <div className="flex gap-2">
                  {alternatives.map((alt, idx) => (
                    <span key={idx} className="bg-[#0b1329] border border-slate-800 text-slate-200 text-[11px] px-3 py-1.5 rounded-lg font-bold font-mono shadow-md hover:border-emerald-500/50 cursor-pointer transition duration-200">
                      {alt}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* --- 2026 FLOATING POP-UP CHATBOARD SYSTEM --- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        
        {/* Chat window popup container */}
        {isChatOpen && (
          <div className="bg-[#0b1329]/95 backdrop-blur-xl border border-slate-800/90 rounded-2xl shadow-2xl w-[360px] md:w-[390px] h-[450px] flex flex-col mb-4 overflow-hidden border-b-4 border-b-emerald-500 transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) animate-popupModal">
            
            {/* Window Header */}
            <div className="bg-[#0e1a36]/80 px-4 py-3 flex justify-between items-center border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-200 tracking-wide">Clinical Staff Chatboard</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white font-bold text-sm bg-slate-900/60 w-6 h-6 flex items-center justify-center rounded-full border border-slate-800/60 transition-all hover:bg-slate-800">
                ×
              </button>
            </div>

            {/* Chat Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#030712]/95 space-y-3 font-mono text-[11px] custom-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'staff' ? 'justify-end' : 'justify-start'} animate-messageScale`}>
                  <div className={`max-w-[85%] p-2.5 rounded-xl border shadow-sm ${msg.sender === 'staff' ? 'bg-gradient-to-br from-emerald-950/40 to-emerald-900/20 border-emerald-800/40 text-emerald-200' : msg.sender === 'system' ? 'bg-slate-900/30 border-slate-800 text-slate-400' : 'bg-gradient-to-br from-slate-900/80 to-slate-950/80 border-slate-800 text-slate-300'}`}>
                    <span className="font-bold text-[9px] block opacity-40 mb-0.5 uppercase tracking-wider">
                      {msg.sender === 'staff' ? '👩‍⚕️ Staff' : '🤖 MedAgent'}
                    </span>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Typing Box Action Layer */}
            <div className="p-3 bg-[#0b1329]/90 border-t border-slate-800/80 flex gap-2">
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()} placeholder="Type message or clinical routing action..." className="flex-1 bg-[#030712] border border-slate-800 rounded-xl px-4 py-2 text-xs font-medium outline-none text-slate-200 focus:border-emerald-500/50 transition duration-200 focus:bg-[#050c1e]" />
              <button onClick={sendChatMessage} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-4 rounded-xl text-xs font-bold transition duration-200 shadow-md active:scale-95 text-white">
                Send
              </button>
            </div>
          </div>
        )}

        {/* Floating Toggle Bubble Button */}
        <button onClick={() => setIsChatOpen(!isChatOpen)} className={`flex items-center gap-2 px-5 py-3.5 rounded-full font-bold text-xs text-white shadow-2xl transition-all duration-300 border transform active:scale-95 hover:-translate-y-0.5 ${isChatOpen ? 'bg-slate-900 border-slate-800 shadow-slate-950' : 'bg-gradient-to-r from-emerald-600 to-emerald-500 border-emerald-500 shadow-emerald-950/50'}`}>
          <span className="relative flex h-2 w-2 mr-0.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isChatOpen ? 'bg-slate-400' : 'bg-white'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isChatOpen ? 'bg-slate-400' : 'bg-white'}`}></span>
          </span>
          {isChatOpen ? 'Close Live Agent Chat' : 'Open Staff Chatboard'}
        </button>
      </div>

      {/* Embedded High-Performance Animation Engine CSS */}
      <style jsx global>{`
        @keyframes popupModal {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes messageScale {
          from { opacity: 0; transform: scale(0.97) translateY(5px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-popupModal { animation: popupModal 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fadeIn { animation: fadeIn 0.35s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.3s ease-out forwards; }
        .animate-messageScale { animation: messageScale 0.22s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #059669; }
      `}</style>
    </div>
  );
}