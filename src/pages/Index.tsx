import { useMemo, useState } from "react";

type SourceFile = { name: string; path: string; content: string };
type Edition = "Java" | "Bedrock";
type ProjectType = "Mod" | "Resource Pack" | "Server Plugin" | "Bedrock Add-on";

const FILES: SourceFile[] = [
  {
    name: "build.gradle.kts",
    path: "build.gradle.kts",
    content: `plugins {\n    java\n}\n\ngroup = "dev.nexus.demo"\nversion = "1.0.0"\n\nrepositories {\n    maven("https://repo.papermc.io/repository/maven-public/")\n}\n\ndependencies {\n    compileOnly("io.papermc.paper:paper-api:1.21.4-R0.1-SNAPSHOT")\n}`,
  },
  {
    name: "plugin.yml",
    path: "src/main/resources/plugin.yml",
    content: `name: NexusDemo\nversion: 1.0.0\nmain: dev.nexus.demo.NexusDemoPlugin\napi-version: '1.21'\ncommands:\n  hello:\n    description: Greets the player\n    permission: nexus.hello\npermissions:\n  nexus.hello:\n    default: true`,
  },
  {
    name: "NexusDemoPlugin.java",
    path: "src/main/java/dev/nexus/demo/NexusDemoPlugin.java",
    content: `package dev.nexus.demo;\n\nimport org.bukkit.plugin.java.JavaPlugin;\n\npublic final class NexusDemoPlugin extends JavaPlugin {\n    @Override\n    public void onEnable() {\n        getLogger().info("NexusDemo enabled");\n    }\n}`,
  },
];

const EDITION_TYPES: Record<Edition, ProjectType[]> = {
  Java: ["Mod", "Resource Pack", "Server Plugin"],
  Bedrock: ["Resource Pack", "Bedrock Add-on"],
};

const TASKS: { label: string; status: "done" | "active" | "pending" }[] = [
  { label: "Analyze request and draft plan", status: "done" },
  { label: "Generate Paper plugin structure", status: "done" },
  { label: "Write command handler and permissions", status: "active" },
  { label: "Compile with Gradle", status: "pending" },
  { label: "Start Paper test server", status: "pending" },
];

const STATUS_LABELS = [
  "Not run",
  "Static checks passed",
  "Build passed",
  "Runtime launched",
  "Functional tests passed",
  "Failed",
  "Blocked by missing infrastructure",
];

const panel =
  "rounded-xl border border-[#262640] bg-[#11111c]/90 shadow-[0_0_0_1px_rgba(34,211,238,0.03)]";
const label = "text-[11px] font-semibold uppercase tracking-wider text-[#8b8ba7]";

export default function Index() {
  const [activeFile, setActiveFile] = useState(FILES[2].path);
  const [openTabs, setOpenTabs] = useState<string[]>([FILES[2].path]);
  const [edition, setEdition] = useState<Edition>("Java");
  const [projectType, setProjectType] = useState<ProjectType>("Server Plugin");
  const [projectName, setProjectName] = useState("NexusDemo");
  const [mcVersion, setMcVersion] = useState("1.21.4");

  const file = FILES.find((f) => f.path === activeFile) ?? FILES[0];
  const validTypes = EDITION_TYPES[edition];
  const typeValid = validTypes.includes(projectType);
  const lineNumbers = useMemo(
    () => file.content.split("\n").map((_, i) => i + 1),
    [file],
  );

  const openFile = (path: string) => {
    setActiveFile(path);
    setOpenTabs((tabs) => (tabs.includes(path) ? tabs : [...tabs, path]));
  };

  const changeEdition = (next: Edition) => {
    setEdition(next);
    if (!EDITION_TYPES[next].includes(projectType)) setProjectType(EDITION_TYPES[next][0]);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#07070d] text-[#e4e4f0]">
      {/* Top toolbar */}
      <header className="flex flex-wrap items-center gap-3 border-b border-[#262640] bg-[#0b0b14] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-[#a78bfa] to-[#22d3ee] text-xs font-bold text-[#07070d]">
            N
          </div>
          <span className="font-semibold tracking-tight">Nexus-MC-Edition</span>
        </div>
        <span className="hidden text-[#3b3b5c] sm:inline">/</span>
        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-36 rounded-md border border-[#262640] bg-[#0a0a12] px-2 py-1 text-sm outline-none focus:border-[#22d3ee]"
          aria-label="Project name"
        />
        <select
          value={mcVersion}
          onChange={(e) => setMcVersion(e.target.value)}
          className="rounded-md border border-[#262640] bg-[#0a0a12] px-2 py-1 text-sm outline-none focus:border-[#22d3ee]"
          aria-label="Minecraft version"
        >
          <option>1.21.4</option>
          <option>1.21.1</option>
          <option>1.20.6</option>
        </select>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <button className="rounded-md px-2.5 py-1 text-[#8b8ba7] hover:bg-[#1a1a2a] hover:text-[#e4e4f0]">Undo</button>
          <button className="rounded-md px-2.5 py-1 text-[#8b8ba7] hover:bg-[#1a1a2a] hover:text-[#e4e4f0]">History</button>
          <button className="rounded-md border border-[#22d3ee]/40 px-3 py-1 text-[#22d3ee] hover:bg-[#22d3ee]/10">
            Export
          </button>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-1 gap-3 p-3 lg:grid-cols-[210px_minmax(0,1fr)_280px]">
        {/* Left sidebar */}
        <aside className={`${panel} flex flex-col gap-5 p-4`}>
          <section>
            <p className={label}>Projects</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li className="rounded-md bg-[#1c1832] px-2 py-1.5 text-[#c4b5fd]">{projectName}</li>
              <li className="rounded-md px-2 py-1.5 text-[#8b8ba7] hover:bg-[#1a1a2a]">Bedrock Sparkle Pack</li>
            </ul>
          </section>
          <section>
            <p className={label}>Recent</p>
            <ul className="mt-2 space-y-1 text-sm text-[#8b8ba7]">
              <li className="px-2 py-1">Edited plugin.yml · 2m ago</li>
              <li className="px-2 py-1">Created project · 1h ago</li>
            </ul>
          </section>
          <section>
            <p className={label}>Templates</p>
            <ul className="mt-2 space-y-1 text-sm text-[#8b8ba7]">
              <li className="px-2 py-1 hover:text-[#e4e4f0]">Paper plugin</li>
              <li className="px-2 py-1 hover:text-[#e4e4f0]">Fabric mod</li>
              <li className="px-2 py-1 hover:text-[#e4e4f0]">Java resource pack</li>
              <li className="px-2 py-1 hover:text-[#e4e4f0]">Bedrock add-on</li>
            </ul>
          </section>
          <section className="mt-auto">
            <p className={label}>Settings</p>
            <p className="mt-2 px-2 text-sm text-[#8b8ba7]">Model: not configured</p>
          </section>
        </aside>

        {/* Center: conversation + wizard */}
        <main className="flex min-w-0 flex-col gap-3">
          <section className={`${panel} flex flex-col gap-4 p-4`}>
            <div className="flex items-center justify-between">
              <p className={label}>Nexus conversation</p>
              <span className="text-xs text-[#8b8ba7]">Context: {projectName} · {mcVersion}</span>
            </div>
            <div className="ml-auto max-w-[85%] rounded-lg bg-[#1c1832] px-3 py-2 text-sm">
              Create a Paper plugin with a /hello command that greets players.
            </div>
            <div className="max-w-[90%] space-y-3 rounded-lg border border-[#262640] bg-[#0b0b14] px-3 py-2 text-sm">
              <p className="font-medium text-[#22d3ee]">Nexus</p>
              <p className="text-[#b8b8cc]">
                Plan: generate a Paper 1.21.4 plugin, register <code className="text-[#c4b5fd]">/hello</code> guarded by
                <code className="text-[#c4b5fd]"> nexus.hello</code>, then compile and test on a Paper server.
              </p>
              <p className="text-xs text-[#8b8ba7]">
                The agent backend is not connected yet, so this conversation is sample content.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                disabled
                placeholder="Ask Nexus… (agent backend not configured)"
                className="flex-1 rounded-md border border-[#262640] bg-[#0a0a12] px-3 py-2 text-sm text-[#8b8ba7] outline-none disabled:cursor-not-allowed"
              />
              <button disabled className="rounded-md bg-gradient-to-r from-[#a78bfa] to-[#22d3ee] px-4 py-2 text-sm font-semibold text-[#07070d] opacity-50">
                Send
              </button>
            </div>
          </section>

          <section className={`${panel} p-4`}>
            <p className={label}>Task progress</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {TASKS.map((t) => (
                <li key={t.label} className="flex items-center gap-2 text-sm">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      t.status === "done" ? "bg-[#22d3ee]" : t.status === "active" ? "bg-[#a78bfa] animate-pulse" : "bg-[#3b3b5c]"
                    }`}
                  />
                  <span className={t.status === "pending" ? "text-[#8b8ba7]" : ""}>{t.label}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={`${panel} p-4`}>
            <p className={label}>New project wizard</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <label className="flex flex-col gap-1 text-xs text-[#8b8ba7]">
                Edition
                <select
                  value={edition}
                  onChange={(e) => changeEdition(e.target.value as Edition)}
                  className="rounded-md border border-[#262640] bg-[#0a0a12] px-2 py-1.5 text-sm text-[#e4e4f0]"
                >
                  <option>Java</option>
                  <option>Bedrock</option>
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs text-[#8b8ba7]">
                Project type
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value as ProjectType)}
                  className="rounded-md border border-[#262640] bg-[#0a0a12] px-2 py-1.5 text-sm text-[#e4e4f0]"
                >
                  {(["Mod", "Resource Pack", "Server Plugin", "Bedrock Add-on"] as ProjectType[]).map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <div className="flex flex-col justify-end text-sm">
                {typeValid ? (
                  <span className="text-[#22d3ee]">✓ Valid combination</span>
                ) : (
                  <span className="text-[#f9a8d4]">
                    {projectType} is not available for {edition} Edition. Try {validTypes.join(" or ")}.
                  </span>
                )}
              </div>
            </div>
          </section>
        </main>

        {/* Right: config + status */}
        <aside className={`${panel} flex flex-col gap-4 p-4`}>
          <section>
            <p className={label}>Configuration</p>
            <dl className="mt-2 space-y-2 text-sm">
              <div className="flex justify-between gap-2"><dt className="text-[#8b8ba7]">Edition</dt><dd>{edition}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-[#8b8ba7]">Type</dt><dd>{projectType}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-[#8b8ba7]">Version</dt><dd>{mcVersion}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-[#8b8ba7]">Platform</dt><dd>Paper</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-[#8b8ba7]">Package</dt><dd>dev.nexus.demo</dd></div>
            </dl>
          </section>
          <section>
            <p className={label}>Build & test status</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              {STATUS_LABELS.map((s) => (
                <li key={s} className="flex items-center justify-between">
                  <span className="text-[#8b8ba7]">{s}</span>
                  <span className={`text-[11px] ${s === "Blocked by missing infrastructure" ? "text-[#f9a8d4]" : "text-[#3b3b5c]"}`}>
                    {s === "Not run" ? "current" : "—"}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      {/* Explorer + editor */}
      <div className={`${panel} mx-3 mb-3 grid min-h-[260px] grid-cols-1 overflow-hidden md:grid-cols-[200px_minmax(0,1fr)]`}>
        <nav className="border-b border-[#262640] p-3 md:border-b-0 md:border-r">
          <p className={label}>Explorer</p>
          <ul className="mt-2 space-y-0.5 font-mono text-xs">
            {FILES.map((f) => (
              <li key={f.path}>
                <button
                  onClick={() => openFile(f.path)}
                  className={`w-full truncate rounded px-2 py-1 text-left ${
                    activeFile === f.path ? "bg-[#1c1832] text-[#c4b5fd]" : "text-[#8b8ba7] hover:text-[#e4e4f0]"
                  }`}
                  title={f.path}
                >
                  {f.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex min-w-0 flex-col">
          <div className="flex gap-1 overflow-x-auto border-b border-[#262640] bg-[#0b0b14] px-2 pt-2">
            {openTabs.map((p) => {
              const f = FILES.find((x) => x.path === p);
              if (!f) return null;
              return (
                <button
                  key={p}
                  onClick={() => setActiveFile(p)}
                  className={`whitespace-nowrap rounded-t-md px-3 py-1.5 font-mono text-xs ${
                    activeFile === p ? "bg-[#11111c] text-[#22d3ee]" : "text-[#8b8ba7]"
                  }`}
                >
                  {f.name}
                </button>
              );
            })}
          </div>
          <div className="flex min-h-[220px] overflow-auto font-mono text-xs leading-relaxed">
            <div className="select-none border-r border-[#262640] bg-[#0b0b14] px-3 py-3 text-right text-[#3b3b5c]">
              {lineNumbers.map((n) => (
                <div key={n}>{n}</div>
              ))}
            </div>
            <pre className="flex-1 whitespace-pre px-4 py-3 text-[#e4e4f0]">{file.content}</pre>
          </div>
          <p className="border-t border-[#262640] px-3 py-1.5 text-[11px] text-[#8b8ba7]">
            {file.path} · read-only sample · search and diffs available once the editor backend is connected
          </p>
        </div>
      </div>

      {/* Bottom console */}
      <footer className="mx-3 mb-3 rounded-xl border border-[#262640] bg-[#05050a] p-3 font-mono text-xs">
        <p className={label}>Console</p>
        <div className="mt-2 space-y-1 text-[#8b8ba7]">
          <p><span className="text-[#22d3ee]">[nexus]</span> Sample project loaded. No build has been run.</p>
          <p><span className="text-[#a78bfa]">[build]</span> Gradle build not started (build backend not configured).</p>
          <p><span className="text-[#f9a8d4]">[test]</span> Runtime tests blocked: no Paper test server configured.</p>
        </div>
      </footer>
    </div>
  );
}
