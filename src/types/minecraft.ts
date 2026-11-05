export type Edition = 'Java' | 'Bedrock';

export type ProjectType = 'Mod' | 'Resource Pack' | 'Server Plugin' | 'Bedrock Add-on' | 'Datapack';

export type LoaderType = 'Fabric' | 'NeoForge' | 'Forge' | 'Paper' | 'Spigot' | 'Purpur' | 'Velocity' | 'Bedrock Script API' | 'None';

export interface Project {
  id: string;
  name: string;
  edition: Edition;
  project_type: ProjectType;
  minecraft_version: string;
  loader: LoaderType;
  runtime_or_script_api: string;
  package_id: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  path: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  file?: File;
  textContent?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  attachments?: Attachment[];
  timestamp?: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface UserSettings {
  defaultVersion: string;
  defaultLoader: LoaderType;
  accentColor: string;
  temperature: number;
  apiKey: string;
  enableLocalFallback: boolean;
}
