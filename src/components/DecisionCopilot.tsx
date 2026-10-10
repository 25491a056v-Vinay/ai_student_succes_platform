import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  HelpCircle, 
  Copy, 
  Check, 
  BookOpen, 
  ArrowRight, 
  Loader2,
  FileText
} from 'lucide-react';
import { Student, CampusMetrics } from '../types/student';

interface DecisionCopilotProps {
  students: Student[];
  metrics: CampusMetrics;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const PRESET_QUERIES = [
  'What are the primary drivers of attrition among 2nd-year Computer Science students?',
  'Which specific academic interventions yield the fastest retention stabilization?',
  'Identify students with high foundational ability who recently suffered an attendance drop.',
  'Propose 3 institutional policy actions to lower failure rates in prerequisite engineering courses.',
];

export const DecisionCopilot: React.FC<DecisionCopilotProps> = ({ students, metrics }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      content: `Welcome to the **Campus Decision Intelligence AI Copilot**. I analyze multi-source student telemetry (learning management activity, attendance records, prerequisite bottlenecks, and socio-economic employment data) to help college administrators and academic deans take high-leverage proactive decisions.

You can ask me questions about specific cohorts, systemic course choke-points, or request tailored institutional retention strategies.`,
      timestamp: 'Just now',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSend = async (queryToSend?: string) => {
    const q = queryToSend || inputQuery;
    if (!q.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      content: q.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/cohort-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          cohortMetrics: metrics,
          sampleStudents: students.slice(0, 10).map((s) => ({
            id: s.id,
            name: s.name,
            major: s.major,
            year: s.year,
            cgpa: s.cgpa,
            attendanceRate: s.attendanceRate,
            riskScore: s.riskScore,
            bottleneckCourse: s.bottleneckCourse,
          })),
        }),
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        content: data.answer || 'Unable to generate response.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Failed to query copilot:', err);
      const errorMsg: ChatMessage = {
        id: `e-${Date.now()}`,
        sender: 'assistant',
        content: 'System communication error with AI engine. Please verify server connectivity.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <Bot className="w-6 h-6 text-amber-400" />
            <span>AI Campus Decision Copilot</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Natural language institutional intelligence grounded in active student records, attendance velocity, and retention models.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Engine: Gemini 3.8 Flash Active</span>
        </div>
      </div>

      {/* Preset Strategy Questions */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Strategic Inquiry Presets (Click to Execute)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {PRESET_QUERIES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(preset)}
              className="text-left p-3 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-xs text-slate-300 hover:text-white transition flex items-start space-x-2"
            >
              <ArrowRight className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{preset}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conversational Stream Box */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 sm:p-6 flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl p-4 text-xs leading-relaxed space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-sky-600 text-white font-medium shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 shadow-md'
                }`}
              >
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-1.5 text-[10px] opacity-75">
                  <span className="font-bold flex items-center space-x-1">
                    {msg.sender === 'assistant' ? (
                      <>
                        <Bot className="w-3.5 h-3.5 text-amber-400 mr-1" />
                        <span>Provost AI Decision Engine</span>
                      </>
                    ) : (
                      <span>Administrator Query</span>
                    )}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="whitespace-pre-wrap font-sans space-y-2">
                  {msg.content}
                </div>

                {msg.sender === 'assistant' && (
                  <div className="pt-2 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-1"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied to clipboard</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Memo</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-slate-400 p-3 bg-slate-950 rounded-lg border border-slate-800 w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>Analyzing student cohorts and reasoning with Gemini 3.8 Flash...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Ask a question about student risk, bottleneck courses, or policy recommendations..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputQuery.trim()}
            className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
