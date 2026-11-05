import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  Plus,
  Trash2,
  FileCode,
  Download,
  Copy,
  Check,
  Sparkles,
  Save,
  ChevronRight,
  X,
  FilePlus,
  Box,
} from 'lucide-react';
import { Project, ProjectFile, Edition, ProjectType, LoaderType } from '../types/minecraft';
import {
  getProjects,
  getProjectFiles,
  createProject,
  saveProjectFile,
  deleteProjectFile,
  deleteProject,
} from '../lib/projectStorage';

interface ProjectsViewProps {
  onAskNexus: (prompt: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ onAskNexus }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [activeFile, setActiveFile] = useState<ProjectFile | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New Project Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEdition, setNewEdition] = useState<Edition>('Java');
  const [newType, setNewType] = useState<ProjectType>('Mod');
  const [newLoader, setNewLoader] = useState<LoaderType>('Fabric');
  const [newVersion, setNewVersion] = useState('1.21.4');
  const [newPackageId, setNewPackageId] = useState('com.example.mymod');
  const [newDesc, setNewDesc] = useState('');

  // New File in Project Modal
  const [isNewFileModalOpen, setIsNewFileModalOpen] = useState(false);
  const [newFilePath, setNewFilePath] = useState('');

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProjects = () => {
    const list = getProjects();
    setProjects(list);
    if (list.length > 0 && !selectedProjectId) {
      handleSelectProject(list[0].id);
    }
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    const pFiles = getProjectFiles(projectId);
    setFiles(pFiles);
    if (pFiles.length > 0) {
      setActiveFile(pFiles[0]);
      setEditorContent(pFiles[0].content);
    } else {
      setActiveFile(null);
      setEditorContent('');
    }
  };

  const handleSelectFile = (file: ProjectFile) => {
    setActiveFile(file);
    setEditorContent(file.content);
  };

  const handleSaveFile = () => {
    if (!activeFile) return;
    const updated: ProjectFile = {
      ...activeFile,
      content: editorContent,
    };
    saveProjectFile(updated);
    setActiveFile(updated);
    setFiles((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const { project } = createProject({
      name: newName.trim(),
      edition: newEdition,
      project_type: newType,
      minecraft_version: newVersion,
      loader: newLoader,
      runtime_or_script_api: newEdition === 'Java' ? 'Java 21' : 'Script API v1.14',
      package_id: newPackageId.trim(),
      description: newDesc.trim(),
    });

    setIsModalOpen(false);
    setNewName('');
    setNewDesc('');
    loadProjects();
    handleSelectProject(project.id);
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId);
      const remaining = projects.filter((p) => p.id !== projectId);
      setProjects(remaining);
      if (remaining.length > 0) {
        handleSelectProject(remaining[0].id);
      } else {
        setSelectedProjectId(null);
        setFiles([]);
        setActiveFile(null);
      }
    }
  };

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !newFilePath.trim()) return;

    const file: ProjectFile = {
      id: `file_${Date.now()}`,
      project_id: selectedProjectId,
      path: newFilePath.trim(),
      content: '// New file content\n',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    saveProjectFile(file);
    setIsNewFileModalOpen(false);
    setNewFilePath('');
    const updatedFiles = [...files, file];
    setFiles(updatedFiles);
    setActiveFile(file);
    setEditorContent(file.content);
  };

  const handleDeleteFile = (fileId: string) => {
    deleteProjectFile(fileId);
    const remaining = files.filter((f) => f.id !== fileId);
    setFiles(remaining);
    if (remaining.length > 0) {
      setActiveFile(remaining[0]);
      setEditorContent(remaining[0].content);
    } else {
      setActiveFile(null);
      setEditorContent('');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(editorContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportZip = () => {
    const activeProject = projects.find((p) => p.id === selectedProjectId);
    if (!activeProject) return;

    let textDump = `# ${activeProject.name} (Minecraft ${activeProject.minecraft_version} - ${activeProject.loader})\n\n`;
    files.forEach((f) => {
      textDump += `==================== FILE: ${f.path} ====================\n`;
      textDump += `${f.content}\n\n`;
    });

    const blob = new Blob([textDump], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeProject.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_project_bundle.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Header and Project Creator Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-emerald-400" />
            <span>Minecraft Projects & Modding Workspace</span>
          </h2>
          <p className="text-xs text-gray-400">
            Scaffold, view, and edit ready-to-run Fabric mods, Paper plugins, Datapacks & Bedrock add-ons
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid / Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {projects.map((p) => {
          const isSelected = p.id === selectedProjectId;
          return (
            <div
              key={p.id}
              onClick={() => handleSelectProject(p.id)}
              className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#182538] border-emerald-500/60 shadow-lg'
                  : 'bg-[#121824] border-[#222d3e] hover:bg-[#16202e]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    {p.loader}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">{p.minecraft_version}</span>
                </div>
                <h3 className="text-sm font-bold text-white leading-tight">{p.name}</h3>
                <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">{p.description}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-400">
                <span>{p.project_type}</span>
                <span className="text-emerald-400 font-mono">{p.edition}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Workspace Details (File Explorer & Code Editor) */}
      {activeProject ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* File Tree Column */}
          <div className="lg:col-span-1 rounded-2xl bg-[#121824] border border-[#232d3d] p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Project Files</span>
              <button
                onClick={() => setIsNewFileModalOpen(true)}
                className="p-1 rounded text-emerald-400 hover:bg-[#1c2738] transition-colors"
                title="Add file to project"
              >
                <FilePlus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              {files.map((file) => {
                const isFileActive = activeFile?.id === file.id;
                return (
                  <div
                    key={file.id}
                    onClick={() => handleSelectFile(file)}
                    className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono cursor-pointer transition-colors ${
                      isFileActive
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'text-gray-300 hover:bg-[#172233] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                      <span className="truncate">{file.path}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFile(file.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                      title="Delete file"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Project Actions */}
            <div className="pt-3 border-t border-[#1e2736] space-y-2">
              <button
                onClick={handleExportZip}
                className="w-full py-2 px-3 rounded-xl bg-[#192333] hover:bg-[#202d42] text-xs font-semibold text-gray-200 hover:text-white flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export Bundle (.txt)</span>
              </button>

              <button
                onClick={() =>
                  onAskNexus(
                    `I have a ${activeProject.loader} project for Minecraft ${activeProject.minecraft_version} called ${activeProject.name}. How do I add a custom recipe or item to this project?`
                  )
                }
                className="w-full py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask Nexus About Project</span>
              </button>

              <button
                onClick={() => handleDeleteProject(activeProject.id)}
                className="w-full py-1.5 px-3 rounded-lg text-xs text-red-400 hover:bg-red-950/20 transition-colors"
              >
                Delete Project
              </button>
            </div>
          </div>

          {/* Code Viewer & Live Editor */}
          <div className="lg:col-span-3 rounded-2xl bg-[#090d14] border border-[#232d3d] overflow-hidden shadow-2xl flex flex-col min-h-[500px]">
            {/* Editor Top Bar */}
            <div className="h-12 px-4 bg-[#121926] border-b border-[#232d3d] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-mono text-emerald-400 font-semibold truncate">
                <FileCode className="w-4 h-4" />
                <span className="truncate">{activeFile?.path || 'No file selected'}</span>
              </div>

              <div className="flex items-center gap-2">
                {savedSuccess && (
                  <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Saved!
                  </span>
                )}

                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded bg-[#1a2332] hover:bg-[#232f42] text-gray-300 hover:text-white flex items-center gap-1 text-xs transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleSaveFile}
                  className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold flex items-center gap-1 text-xs transition-colors"
                >
                  <Save className="w-3 h-3" />
                  <span>Save</span>
                </button>
              </div>
            </div>

            {/* Code Editor Textarea */}
            <div className="flex-1 p-4 bg-[#090d14] flex">
              <textarea
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                spellCheck={false}
                className="w-full h-full bg-transparent text-emerald-300/90 font-mono text-xs md:text-sm leading-relaxed outline-none resize-none"
                placeholder="// Project code will appear here..."
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-[#121824] border border-[#232d3d] space-y-3">
          <Box className="w-10 h-10 text-gray-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No projects found</h3>
          <p className="text-xs text-gray-400">Create a new Fabric, Paper, or Bedrock project to get started.</p>
        </div>
      )}

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121824] border border-[#273448] rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-emerald-400" />
                <span>Create Minecraft Project</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-xs text-gray-300 font-semibold block mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. VoidWalker, EnderWand, SurvivalZone"
                  className="w-full bg-[#0a0e17] border border-[#232d3d] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">Edition</label>
                  <select
                    value={newEdition}
                    onChange={(e) => setNewEdition(e.target.value as Edition)}
                    className="w-full bg-[#0a0e17] border border-[#232d3d] rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Java">Java Edition</option>
                    <option value="Bedrock">Bedrock Edition</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">Project Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as ProjectType)}
                    className="w-full bg-[#0a0e17] border border-[#232d3d] rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Mod">Mod</option>
                    <option value="Server Plugin">Server Plugin</option>
                    <option value="Datapack">Datapack</option>
                    <option value="Resource Pack">Resource Pack</option>
                    <option value="Bedrock Add-on">Bedrock Add-on</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">Loader / Runtime</label>
                  <select
                    value={newLoader}
                    onChange={(e) => setNewLoader(e.target.value as LoaderType)}
                    className="w-full bg-[#0a0e17] border border-[#232d3d] rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Fabric">Fabric</option>
                    <option value="Paper">Paper</option>
                    <option value="NeoForge">NeoForge</option>
                    <option value="Forge">Forge</option>
                    <option value="Spigot">Spigot</option>
                    <option value="Bedrock Script API">Bedrock Script API</option>
                    <option value="None">None (Datapack/Resource)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">Minecraft Version</label>
                  <select
                    value={newVersion}
                    onChange={(e) => setNewVersion(e.target.value)}
                    className="w-full bg-[#0a0e17] border border-[#232d3d] rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="1.21.4">1.21.4 (Latest)</option>
                    <option value="1.21.1">1.21.1</option>
                    <option value="1.20.4">1.20.4</option>
                    <option value="1.20.1">1.20.1</option>
                    <option value="1.19.4">1.19.4</option>
                    <option value="1.16.5">1.16.5</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-semibold block mb-1">Package ID</label>
                <input
                  type="text"
                  required
                  value={newPackageId}
                  onChange={(e) => setNewPackageId(e.target.value)}
                  placeholder="com.example.modname"
                  className="w-full bg-[#0a0e17] border border-[#232d3d] rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-semibold block mb-1">Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Brief description of mod features..."
                  className="w-full bg-[#0a0e17] border border-[#232d3d] rounded-xl px-3 py-2 text-xs text-white resize-none h-16"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-gray-300 hover:bg-[#1a2332]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-colors shadow-md"
                >
                  Create & Scaffold Files
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New File Modal */}
      {isNewFileModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121824] border border-[#273448] rounded-2xl p-5 max-w-sm w-full space-y-4">
            <h3 className="text-sm font-bold text-white">Add New File</h3>
            <form onSubmit={handleCreateFile} className="space-y-3">
              <div>
                <label className="text-xs text-gray-300 block mb-1">File Path</label>
                <input
                  type="text"
                  required
                  value={newFilePath}
                  onChange={(e) => setNewFilePath(e.target.value)}
                  placeholder="e.g. src/main/resources/pack.png"
                  className="w-full bg-[#0a0e17] border border-[#232d3d] rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewFileModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 text-black font-semibold text-xs"
                >
                  Add File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
