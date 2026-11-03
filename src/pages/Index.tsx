
import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const initialMessages: Message[] = [
  {
    role: "assistant",
    content:
      "Hi! I'm Nexus, your Minecraft development assistant. What would you like to build today?",
  },
];

const menuItems = [
  { icon: "▧", label: "Projects" },
  { icon: "◷", label: "History" },
  { icon: "⚒", label: "Minecraft tools" },
  { icon: "⚙", label: "Settings" },
];

export default function Index() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [activeMenu, setActiveMenu] = useState("New chat");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function newChat() {
    setMessages(initialMessages);
    setInput("");
    setActiveMenu("New chat");
    setSidebarOpen(false);
  }

  function sendMessage() {
    const text = input.trim();
    if (!text) return;

    setMessages((old) => [...old, { role: "user", content: text }]);
    setInput("");
    setActiveMenu("New chat");
    inputRef.current?.focus();
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#212121] text-white">
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col bg-[#171717] p-3 transition-transform duration-200 md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-400 to-cyan-400 font-bold text-black">
              N
            </div>
            Nexus
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg px-3 py-2 text-gray-400 hover:bg-[#303030] md:hidden"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <button
          onClick={newChat}
          className="mb-5 flex items-center gap-3 rounded-xl border border-[#383838] px-3 py-3 text-sm hover:bg-[#292929]"
        >
          ＋ New chat
        </button>

        <p className="mb-2 px-2 text-xs font-medium text-gray-500">
          WORKSPACE
        </p>

        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setActiveMenu(item.label);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm ${
                activeMenu === item.label
                  ? "bg-[#303030]"
                  : "text-gray-300 hover:bg-[#292929]"
              }`}
            >
              <span className="w-5 text-center">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto rounded-xl bg-[#222222] p-3">
          <p className="text-sm font-medium">Nexus-MC-Edition</p>
          <p className="mt-1 text-xs text-gray-500">
            Minecraft development workspace
          </p>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/5 px-3 md:px-5">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg px-3 py-2 text-xl hover:bg-[#303030] md:hidden"
            aria-label="Open menu"
          >
            ☰
          </button>

          <span className="font-semibold">Nexus</span>
          <span className="rounded-full border border-white/10 px-2 py-1 text-xs text-gray-400">
            Minecraft Edition
          </span>

          <button
            onClick={newChat}
            className="ml-auto rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-[#303030]"
          >
            + New chat
          </button>
        </header>

        <section className="flex min-h-0 flex-1 flex-col">
          {activeMenu !== "New chat" ? (
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
              <h1 className="text-xl font-semibold">{activeMenu}</h1>
              <p className="mt-2 max-w-sm text-sm text-gray-400">
                This section is not connected yet. Start a new chat to return
                to the Nexus conversation.
              </p>
              <button
                onClick={newChat}
                className="mt-5 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-200"
              >
                Start a new chat
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                  {messages.length === 1 && (
                    <div className="mb-5 mt-10 text-center sm:mt-20">
                      <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-400 to-cyan-400 text-2xl font-bold text-black">
                        N
                      </div>
                      <h1 className="text-2xl font-semibold sm:text-3xl">
                        What are we building?
                      </h1>
                      <p className="mt-3 text-sm text-gray-400">
                        Mods, plugins, resource packs and Bedrock add-ons.
                      </p>
                    </div>
                  )}

                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-400 to-cyan-400 font-bold text-black">
                          N
                        </div>
                      )}

                      <div
                        className={`max-w-[88%] whitespace-pre-wrap break-words text-sm leading-7 sm:max-w-[80%] ${
                          message.role === "user"
                            ? "rounded-3xl bg-[#303030] px-4 py-3"
                            : "py-1 text-gray-100"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}

                  {messages.length > 1 && (
                    <p className="text-center text-xs text-gray-500">
                      Local chat only — AI responses are not connected yet.
                    </p>
                  )}

                  <div ref={bottomRef} />
                </div>
              </div>

              <div className="shrink-0 px-3 pb-3 pt-2 sm:px-6 sm:pb-5">
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    sendMessage();
                  }}
                  className="mx-auto flex w-full max-w-3xl items-end gap-2 rounded-3xl border border-white/10 bg-[#303030] p-2 focus-within:border-white/20"
                >
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        !event.shiftKey &&
                        !event.nativeEvent.isComposing
                      ) {
                        event.preventDefault();
                        sendMessage();
                      }
                    }}
                    rows={1}
                    placeholder="Message Nexus..."
                    aria-label="Message Nexus"
                    className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-gray-400"
                  />

                  <button
                    type="submit"
                    disabled={!input.trim()}
                    aria-label="Send message"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-lg font-semibold text-black hover:bg-gray-200 disabled:opacity-30"
                  >
                    ↑
                  </button>
                </form>

                <p className="mx-auto mt-3 max-w-3xl text-center text-[11px] text-gray-500">
                  Connect an AI backend to enable generated answers.
                </p>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
              }
