import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Copy,
  Check,
  Trash2,
  Plus,
  Sparkles,
  Download,
  AlertCircle,
  FileText,
  X,
} from 'lucide-react';
import { Message, Attachment } from '../types/minecraft';
import { generateNexusResponse, readAttachmentText } from '../lib/nexusAi';

interface ChatViewProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
  apiKey?: string;
  onSaveToHistory?: (messages: Message[]) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  initialPrompt,
  onClearInitialPrompt,
  apiKey = '',
  onSaveToHistory,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hi! I'm Nexus, your Minecraft development and gameplay AI assistant. I can help you with crafting recipes, redstone logic, 1.21 commands, server configs, Paper/Spigot plugins, Fabric/NeoForge mods, and troubleshooting crash logs.\n\nYou can also attach images, crash reports, or project files to your messages!",
    },
  ]);

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  // Handle external initial prompt from dashboard
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSend(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt !== undefined ? customPrompt : input;
    const trimmed = textToSend.trim();

    if ((!trimmed && attachments.length === 0) || sending) return;

    const currentAttachments = [...attachments];
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      attachments: currentAttachments,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setAttachments([]);
    setNotice('');
    setSending(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const response = await generateNexusResponse(trimmed, newHistory, currentAttachments, apiKey);

      const aiMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      const finalHistory = [...newHistory, aiMsg];
      setMessages(finalHistory);
      if (onSaveToHistory) onSaveToHistory(finalHistory);
    } catch (err) {
      console.error('Nexus error:', err);
      setNotice('Nexus encountered an error generating the response. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleAddFiles = async (fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList);
    const newAttachments: Attachment[] = [];

    for (const file of files) {
      if (file.size > 15 * 1024 * 1024) {
        setNotice(`${file.name} is larger than 15MB.`);
        continue;
      }

      let textContent = '';
      if (!file.type.startsWith('image/')) {
        textContent = await readAttachmentText(file);
      }

      newAttachments.push({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        type: file.type || 'text/plain',
        size: file.size,
        url: URL.createObjectURL(file),
        file,
        textContent,
      });
    }

    if (newAttachments.length > 0) {
      setAttachments((prev) => [...prev, ...newAttachments]);
      setNotice('');
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => {
      const removed = prev.find((a) => a.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return prev.filter((a) => a.id !== id);
    });
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "Starting a fresh conversation! What Minecraft project or mechanics are we working on?",
      },
    ]);
    setAttachments([]);
    setInput('');
    setNotice('');
  };

  const handleExportChat = () => {
    const text = messages
      .map((m) => `[${m.role.toUpperCase()}]:\n${m.content}\n`)
      .join('\n---\n\n');
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-minecraft-chat-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Render text with markdown-like code block formatting
  const renderMessageContent = (content: string, msgId: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const firstLine = lines[0].trim();
        const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
        const language = hasLang ? firstLine : 'code';
        const code = hasLang ? lines.slice(1).join('\n') : lines.join('\n');
        const codeBlockId = `${msgId}-code-${index}`;

        return (
          <div key={index} className="my-3 rounded-xl overflow-hidden border border-[#233144] bg-[#090d14]">
            <div className="px-3 py-1.5 bg-[#121926] border-b border-[#233144] flex items-center justify-between text-xs text-gray-300">
              <span className="font-mono text-emerald-400 text-[11px] font-semibold uppercase">{language}</span>
              <button
                onClick={() => handleCopy(codeBlockId, code)}
                className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-white px-2 py-0.5 rounded bg-[#1a2332] hover:bg-[#222f42] transition-colors"
              >
                {copiedId === codeBlockId ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 text-xs md:text-sm font-mono text-emerald-300/90 overflow-x-auto leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Format markdown headers, bold, bullets
      return (
        <div key={index} className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
          {part}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#0d1117]">
      {/* Chat Top Subheader */}
      <div className="h-12 px-4 md:px-6 bg-[#101622] border-b border-[#202938] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <img src="/icon.png" alt="Nexus" className="w-6 h-6 rounded-md object-cover border border-emerald-500/40" />
          <span className="text-sm font-semibold text-white">Nexus Assistant</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-300">
            Minecraft Engine
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleNewChat}
            className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-[#1a2433] text-xs flex items-center gap-1 transition-colors"
            title="Start New Conversation"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
          <button
            onClick={handleExportChat}
            className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-[#1a2433] text-xs flex items-center gap-1 transition-colors"
            title="Export as Markdown"
          >
            <Download className="w-4 h-4 text-gray-400" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 max-w-4xl mx-auto ${isUser ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className="shrink-0 mt-0.5">
                {isUser ? (
                  <div className="w-8 h-8 rounded-xl bg-[#283548] border border-[#3b4c66] flex items-center justify-center font-bold text-xs text-white shadow-sm">
                    YOU
                  </div>
                ) : (
                  <img
                    src="/icon.png"
                    alt="Nexus AI"
                    className="w-8 h-8 rounded-xl object-cover border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                  />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`flex-1 rounded-2xl p-4 transition-all ${
                  isUser
                    ? 'bg-[#1a2536] border border-[#2e3e56] text-white ml-10 shadow-md'
                    : 'bg-[#121824] border border-[#202b3c] text-gray-200 mr-10 shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold ${isUser ? 'text-gray-300' : 'text-emerald-400'}`}>
                    {isUser ? 'You' : 'Nexus AI'}
                  </span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="p-1 rounded hover:bg-[#1f2937] text-gray-400 hover:text-white text-xs flex items-center gap-1 transition-colors"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                {/* Text Content */}
                <div className="text-sm md:text-base leading-relaxed">
                  {renderMessageContent(msg.content, msg.id)}
                </div>

                {/* Attached Files & Images */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-[#232f42]">
                    {msg.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="rounded-xl overflow-hidden border border-[#2a384e] bg-[#0c1017] p-2 flex items-center gap-2 max-w-xs"
                      >
                        {att.type.startsWith('image/') ? (
                          <img
                            src={att.url}
                            alt={att.name}
                            className="w-12 h-12 rounded object-cover border border-white/10"
                          />
                        ) : (
                          <div className="p-2 rounded bg-emerald-950/60 text-emerald-400">
                            <FileText className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-white font-medium truncate">{att.name}</p>
                          <p className="text-[10px] text-gray-400">{formatFileSize(att.size)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {sending && (
          <div className="flex items-start gap-3.5 max-w-4xl mx-auto">
            <img
              src="/icon.png"
              alt="Nexus Thinking"
              className="w-8 h-8 rounded-xl object-cover border border-emerald-500/50 animate-pulse"
            />
            <div className="rounded-2xl p-4 bg-[#121824] border border-[#202b3c] flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span className="text-xs text-emerald-300/80 font-mono">
                Nexus is generating Minecraft code & response...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Composer Input Area */}
      <div className="p-3 md:p-5 bg-[#0e131d] border-t border-[#1e2736] shrink-0">
        <div className="max-w-4xl mx-auto">
          {/* Active Attachments Preview */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="relative group rounded-xl border border-emerald-500/40 bg-[#141b26] p-2 flex items-center gap-2"
                >
                  <button
                    onClick={() => handleRemoveAttachment(att.id)}
                    className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-red-600 text-white hover:bg-red-500 shadow-md"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>

                  {att.type.startsWith('image/') ? (
                    <img src={att.url} alt={att.name} className="w-8 h-8 rounded object-cover" />
                  ) : (
                    <FileText className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className="text-xs text-gray-200 max-w-[120px] truncate">{att.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Notice Banner */}
          {notice && (
            <div className="mb-2 p-2 rounded-lg bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{notice}</span>
            </div>
          )}

          {/* Input Box with Toolbar */}
          <div className="relative rounded-2xl bg-[#141b26] border border-[#253245] focus-within:border-emerald-500/60 p-2.5 transition-colors shadow-lg">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask Nexus about crafting, 1.21 commands, Paper plugins, crash logs, or redstone..."
              className="w-full bg-transparent text-white placeholder-gray-400 text-sm outline-none resize-none px-2 py-1.5 max-h-44"
              disabled={sending}
            />

            <div className="flex items-center justify-between pt-2 border-t border-[#1d2737] mt-1">
              {/* Attachment Actions */}
              <div className="flex items-center gap-1.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={(e) => handleAddFiles(e.target.files)}
                  multiple
                />
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleAddFiles(e.target.files)}
                  multiple
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-400 hover:bg-[#1c2637] transition-colors flex items-center gap-1 text-xs"
                  title="Attach file (code, crash log, config)"
                >
                  <Paperclip className="w-4 h-4" />
                  <span className="hidden sm:inline">Attach Code/Log</span>
                </button>

                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-400 hover:bg-[#1c2637] transition-colors flex items-center gap-1 text-xs"
                  title="Attach screenshot or texture"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Image</span>
                </button>
              </div>

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={(!input.trim() && attachments.length === 0) || sending}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs flex items-center gap-1.5 disabled:opacity-40 disabled:hover:from-emerald-600 transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                aria-label="Send message"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-center text-[11px] text-gray-400 mt-2">
            Nexus MC Edition provides verified Minecraft mechanics, recipes, and Java/Bedrock code.
          </p>
        </div>
      </div>
    </div>
  );
};
