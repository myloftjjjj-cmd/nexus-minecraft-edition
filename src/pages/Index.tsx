
import { useState, useRef, useEffect } from "react";
import { pipeline } from "@huggingface/transformers";

type Attachment = {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  file: File;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: Attachment[];
};

const initialMessages: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hi! I'm Nexus, your Minecraft development assistant. I can help you plan plugins, mods, resource packs, datapacks, and Minecraft projects. You can also attach images and files to your messages.",
  },
];

const menuItems = [
  { label: "New chat", icon: "+" },
  { label: "Projects", icon: "▣" },
  { label: "History", icon: "◷" },
  { label: "Minecraft tools", icon: "◇" },
  { label: "Settings", icon: "⚙" },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_ATTACHMENTS = 10;

export default function Index() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("New chat");
  const [notice, setNotice] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const hasConversation = messages.some((m) => m.role === "user");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      attachments.forEach((attachment) => URL.revokeObjectURL(attachment.url));
    };
    // Only clean up the URLs still held in the composer when the component unmounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;

    const selected = Array.from(fileList);
    const remaining = MAX_ATTACHMENTS - attachments.length;

    if (remaining <= 0) {
      setNotice(`You can attach up to ${MAX_ATTACHMENTS} files per message.`);
      return;
    }

    const accepted: Attachment[] = [];

    for (const file of selected) {
      if (accepted.length >= remaining) {
        setNotice(`You can attach up to ${MAX_ATTACHMENTS} files per message.`);
        break;
      }

      if (file.size > MAX_FILE_SIZE) {
        setNotice(`${file.name} is larger than the 10 MB limit.`);
        continue;
      }

      accepted.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        url: URL.createObjectURL(file),
        file,
      });
    }

    if (accepted.length > 0) {
      setAttachments((previous) => [...previous, ...accepted]);
      setNotice("");
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
  }

  function removeAttachment(id: string) {
    setAttachments((previous) => {
      const removed = previous.find((item) => item.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return previous.filter((item) => item.id !== id);
    });
  }

  function sendMessage() {
    const content = input.trim();

    if (!content && attachments.length === 0) return;

    const userMessage: Message = {
      id: `${Date.now()}`,
      role: "user",
      content,
      attachments: [...attachments],
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setAttachments([]);
    setNotice("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function newChat() {
    setAttachments((previous) => {
      previous.forEach((item) => URL.revokeObjectURL(item.url));
      return [];
    });
    setMessages(initialMessages);
    setInput("");
    setNotice("");
    setActiveMenu("New chat");
    setSidebarOpen(false);
  }

  function handleMenu(label: string) {
    if (label === "New chat") {
      newChat();
      return;
    }

    setActiveMenu(label);
    setSidebarOpen(false);
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  const styles: Record<string, React.CSSProperties> = {
    app: {
      display: "flex",
      height: "100dvh",
      minHeight: "500px",
      background: "#212121",
      color: "#ececec",
      fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      overflow: "hidden",
    },
    sidebar: {
      width: "250px",
      minWidth: "250px",
      background: "#171717",
      padding: "14px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      boxSizing: "border-box",
      overflowY: "auto",
    },
    brand: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "10px 8px 18px",
      fontSize: "21px",
      fontWeight: 750,
      letterSpacing: "-0.7px",
    },
    logo: {
      width: "34px",
      height: "34px",
      borderRadius: "11px",
      background: "linear-gradient(135deg, #8b5cf6, #2563eb)",
      display: "grid",
      placeItems: "center",
      fontSize: "19px",
      color: "white",
    },
    menuButton: {
      border: "1px solid #424242",
      borderRadius: "10px",
      padding: "11px",
      background: "#242424",
      color: "#ececec",
      cursor: "pointer",
      textAlign: "left",
      fontSize: "14px",
    },
    menuItem: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "11px",
      borderRadius: "9px",
      background: "transparent",
      color: "#c5c5c5",
      cursor: "pointer",
      border: "none",
      textAlign: "left",
      fontSize: "14px",
      width: "100%",
    },
    main: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      position: "relative",
    },
    header: {
      height: "58px",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      borderBottom: "1px solid #303030",
    },
    headerTitle: {
      fontSize: "15px",
      fontWeight: 600,
    },
    status: {
      fontSize: "12px",
      color: "#a3a3a3",
      border: "1px solid #3b3b3b",
      borderRadius: "20px",
      padding: "5px 9px",
    },
    conversation: {
      flex: 1,
      overflowY: "auto",
      padding: "24px 16px",
    },
    message: {
      maxWidth: "760px",
      width: "100%",
      margin: "0 auto 26px",
      display: "flex",
      gap: "12px",
      alignItems: "flex-start",
    },
    avatar: {
      width: "31px",
      height: "31px",
      flexShrink: 0,
      borderRadius: "50%",
      display: "grid",
      placeItems: "center",
      background: "#383838",
      fontSize: "13px",
      fontWeight: 700,
    },
    messageContent: {
      minWidth: 0,
      flex: 1,
      fontSize: "15px",
      lineHeight: 1.75,
      whiteSpace: "pre-wrap",
      overflowWrap: "anywhere",
    },
    composerArea: {
      width: "100%",
      maxWidth: "800px",
      boxSizing: "border-box",
      margin: "0 auto",
      padding: "10px 16px 14px",
    },
    composer: {
      background: "#303030",
      border: "1px solid #494949",
      borderRadius: "22px",
      padding: "12px",
      boxShadow: "0 4px 24px #00000012",
    },
    textarea: {
      width: "100%",
      boxSizing: "border-box",
      display: "block",
      resize: "none",
      minHeight: "48px",
      maxHeight: "180px",
      padding: "7px 5px",
      color: "#f5f5f5",
      background: "transparent",
      border: "none",
      outline: "none",
      font: "inherit",
      fontSize: "15px",
      lineHeight: 1.6,
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "8px",
      flexWrap: "wrap",
      marginTop: "7px",
    },
    attachButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      border: "1px solid #505050",
      borderRadius: "20px",
      background: "#383838",
      color: "#ededed",
      padding: "8px 12px",
      cursor: "pointer",
      fontSize: "13px",
    },
    sendButton: {
      width: "38px",
      height: "38px",
      borderRadius: "50%",
      border: "none",
      background: "#f5f5f5",
      color: "#171717",
      fontSize: "21px",
      fontWeight: 700,
      cursor: "pointer",
    },
    attachmentGrid: {
      display: "flex",
      flexWrap: "wrap",
      gap: "9px",
      padding: "5px 0 12px",
    },
    attachmentCard: {
      position: "relative",
      width: "150px",
      maxWidth: "45%",
      minHeight: "66px",
      border: "1px solid #505050",
      borderRadius: "12px",
      background: "#262626",
      overflow: "hidden",
      boxSizing: "border-box",
    },
    removeButton: {
      position: "absolute",
      top: "5px",
      right: "5px",
      width: "25px",
      height: "25px",
      borderRadius: "50%",
      border: "none",
      background: "#111111d9",
      color: "white",
      cursor: "pointer",
      fontSize: "16px",
      zIndex: 1,
    },
    fileInfo: {
      display: "flex",
      gap: "8px",
      alignItems: "center",
      padding: "12px 10px",
      minWidth: 0,
    },
    footer: {
      textAlign: "center",
      color: "#888",
      fontSize: "11px",
      paddingTop: "9px",
      lineHeight: 1.5,
    },
    notice: {
      color: "#fca5a5",
      fontSize: "12px",
      padding: "5px 2px",
    },
  };

  return (
    <div style={styles.app}>
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 5,
            background: "#0009",
            border: "none",
          }}
        />
      )}

      <aside
        style={{
          ...styles.sidebar,
          ...(typeof window !== "undefined" && window.innerWidth <= 650
            ? {
                position: "fixed",
                inset: "0 auto 0 0",
                zIndex: 6,
                transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
                transition: "transform 180ms ease",
                height: "100dvh",
                boxShadow: sidebarOpen ? "8px 0 30px #0006" : "none",
              }
            : {}),
        }}
      >
        <div style={styles.brand}>
          <div style={styles.logo}>N</div>
          <span>Nexus</span>
        </div>

        <button style={styles.menuButton} onClick={newChat}>
          ＋ &nbsp; New chat
        </button>

        <div style={{ color: "#858585", fontSize: "11px", padding: "18px 8px 5px" }}>
          WORKSPACE
        </div>

        {menuItems.slice(1).map((item) => (
          <button
            key={item.label}
            onClick={() => handleMenu(item.label)}
            style={{
              ...styles.menuItem,
              background: activeMenu === item.label ? "#2e2e2e" : "transparent",
              color: activeMenu === item.label ? "#fff" : "#c5c5c5",
            }}
          >
            <span style={{ width: "19px", fontSize: "17px" }}>{item.icon}</span>
            {item.label}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        <div
          style={{
            borderTop: "1px solid #333",
            padding: "15px 7px 5px",
            color: "#929292",
            fontSize: "12px",
            lineHeight: 1.7,
          }}
        >
          <div style={{ color: "#ddd", fontWeight: 600, marginBottom: "4px" }}>
            Nexus MC Edition
          </div>
          Your Minecraft development assistant
        </div>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              style={{
                background: "transparent",
                border: "none",
                color: "#ddd",
                cursor: "pointer",
                fontSize: "22px",
                padding: "3px",
              }}
            >
              ☰
            </button>
            <span style={styles.headerTitle}>
              {activeMenu === "New chat" ? "Nexus" : activeMenu}
            </span>
          </div>
          <span style={styles.status}>Minecraft AI</span>
        </header>

        <section style={styles.conversation}>
          {!hasConversation && activeMenu === "New chat" && (
            <div
              style={{
                minHeight: "55%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                padding: "30px 10px",
              }}
            >
              <div
                style={{
                  ...styles.logo,
                  width: "58px",
                  height: "58px",
                  borderRadius: "18px",
                  fontSize: "30px",
                  marginBottom: "20px",
                }}
              >
                N
              </div>
              <h1 style={{ fontSize: "clamp(25px, 5vw, 34px)", margin: "0 0 10px" }}>
                What are we building?
              </h1>
              <p
                style={{
                  color: "#a3a3a3",
                  fontSize: "14px",
                  maxWidth: "420px",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Build Minecraft plugins, mods, resource packs, datapacks, and more.
                Attach screenshots or project files to your messages.
              </p>
            </div>
          )}

          {activeMenu !== "New chat" && (
            <div style={{ maxWidth: "760px", margin: "35px auto", color: "#c5c5c5" }}>
              <h2 style={{ fontSize: "23px", color: "#eee" }}>{activeMenu}</h2>
              <p>
                This section is a UI placeholder. Its functionality can be connected
                as the project develops.
              </p>
              <button style={styles.menuButton} onClick={newChat}>
                Start a new chat
              </button>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} style={styles.message}>
              <div
                style={{
                  ...styles.avatar,
                  background: message.role === "assistant" ? "#7048e8" : "#414141",
                }}
              >
                {message.role === "assistant" ? "N" : "Y"}
              </div>

              <div style={styles.messageContent}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 650,
                    marginBottom: "5px",
                    color: message.role === "assistant" ? "#d2c5ff" : "#eee",
                  }}
                >
                  {message.role === "assistant" ? "Nexus" : "You"}
                </div>

                {message.content}

                {message.attachments && message.attachments.length > 0 && (
                  <div style={{ ...styles.attachmentGrid, marginTop: "10px" }}>
                    {message.attachments.map((attachment) => (
                      <div key={attachment.id} style={styles.attachmentCard}>
                        {attachment.type.startsWith("image/") ? (
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noreferrer"
                            title={`Open ${attachment.name}`}
                          >
                            <img
                              src={attachment.url}
                              alt={attachment.name}
                              style={{
                                width: "100%",
                                height: "105px",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          </a>
                        ) : (
                          <div style={styles.fileInfo}>
                            <span style={{ fontSize: "25px" }}>📄</span>
                            <div style={{ minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: "12px",
                                  overflowWrap: "anywhere",
                                  lineHeight: 1.4,
                                }}
                              >
                                {attachment.name}
                              </div>
                              <div style={{ fontSize: "10px", color: "#999" }}>
                                {formatSize(attachment.size)}
                              </div>
                            </div>
                          </div>
                        )}

                        <div
                          style={{
                            padding: "6px 8px",
                            fontSize: "11px",
                            color: "#bbb",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {attachment.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </section>

        <div style={styles.composerArea}>
          <div style={styles.composer}>
            {attachments.length > 0 && (
              <div style={styles.attachmentGrid}>
                {attachments.map((attachment) => (
                  <div key={attachment.id} style={styles.attachmentCard}>
                    <button
                      style={styles.removeButton}
                      onClick={() => removeAttachment(attachment.id)}
                      aria-label={`Remove ${attachment.name}`}
                      title="Remove attachment"
                    >
                      ×
                    </button>

                    {attachment.type.startsWith("image/") ? (
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        style={{
                          width: "100%",
                          height: "100px",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      <div style={styles.fileInfo}>
                        <span style={{ fontSize: "25px" }}>📄</span>
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: "12px",
                              overflowWrap: "anywhere",
                              lineHeight: 1.4,
                            }}
                          >
                            {attachment.name}
                          </div>
                          <div style={{ fontSize: "10px", color: "#999" }}>
                            {formatSize(attachment.size)}
                          </div>
                        </div>
        
