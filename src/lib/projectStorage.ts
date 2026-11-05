import { Project, ProjectFile, ChatSession, UserSettings } from '../types/minecraft';
import { generateStarterFiles } from './minecraftTemplates';
import { supabase } from './supabase';

const PROJECTS_KEY = 'nexus_mc_projects_v1';
const FILES_KEY = 'nexus_mc_files_v1';
const SESSIONS_KEY = 'nexus_mc_chat_sessions_v1';
const SETTINGS_KEY = 'nexus_mc_settings_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  defaultVersion: '1.21.4',
  defaultLoader: 'Fabric',
  accentColor: '#8b5cf6',
  temperature: 0.7,
  apiKey: '',
  enableLocalFallback: true,
};

const SAMPLE_PROJECTS: { project: Project; files: ProjectFile[] }[] = [
  {
    project: {
      id: 'sample-fabric-enderwarp',
      name: 'EnderWarp',
      edition: 'Java',
      project_type: 'Mod',
      minecraft_version: '1.21.4',
      loader: 'Fabric',
      runtime_or_script_api: 'Java 21',
      package_id: 'com.nexus.enderwarp',
      description: 'Instant waypoint teleportation wand with particle vortex animations and custom cooldown mechanics.',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date().toISOString(),
    },
    files: [
      {
        id: 'f-1',
        project_id: 'sample-fabric-enderwarp',
        path: 'fabric.mod.json',
        content: JSON.stringify(
          {
            schemaVersion: 1,
            id: 'enderwarp',
            version: '1.2.0',
            name: 'EnderWarp',
            description: 'Teleportation wand mod for Fabric 1.21.4',
            entrypoints: {
              main: ['com.nexus.enderwarp.EnderWarpMod'],
            },
            depends: {
              fabricloader: '>=0.16.0',
              minecraft: '~1.21.4',
              'fabric-api': '*',
            },
          },
          null,
          2
        ),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'f-2',
        project_id: 'sample-fabric-enderwarp',
        path: 'src/main/java/com/nexus/enderwarp/EnderWarpMod.java',
        content: `package com.nexus.enderwarp;

import net.fabricmc.api.ModInitializer;
import net.fabricmc.fabric.api.itemgroup.v1.ItemGroupEvents;
import net.minecraft.item.Item;
import net.minecraft.item.ItemGroups;
import net.minecraft.registry.Registries;
import net.minecraft.registry.Registry;
import net.minecraft.registry.RegistryKey;
import net.minecraft.registry.RegistryKeys;
import net.minecraft.util.Identifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class EnderWarpMod implements ModInitializer {
    public static final String MOD_ID = "enderwarp";
    public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);

    public static final RegistryKey<Item> WARP_WAND_KEY = RegistryKey.of(
        RegistryKeys.ITEM, Identifier.of(MOD_ID, "warp_wand")
    );
    public static final Item WARP_WAND = new WarpWandItem(new Item.Settings().registryKey(WARP_WAND_KEY).maxCount(1));

    @Override
    public void onInitialize() {
        Registry.register(Registries.ITEM, WARP_WAND_KEY, WARP_WAND);
        ItemGroupEvents.modifyEntriesEvent(ItemGroups.TOOLS).register(entries -> entries.add(WARP_WAND));
        LOGGER.info("EnderWarp mod loaded successfully for Minecraft 1.21.4!");
    }
}
`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
  {
    project: {
      id: 'sample-paper-combatzone',
      name: 'CombatZone',
      edition: 'Java',
      project_type: 'Server Plugin',
      minecraft_version: '1.21.4',
      loader: 'Paper',
      runtime_or_script_api: 'Paper API',
      package_id: 'com.nexus.combatzone',
      description: 'Competitive PvP combat tag system with anti-combat log and glowing status indicators.',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    files: [
      {
        id: 'f-3',
        project_id: 'sample-paper-combatzone',
        path: 'src/main/resources/paper-plugin.yml',
        content: `name: CombatZone
version: '1.0.0'
main: com.nexus.combatzone.CombatZonePlugin
api-version: '1.21'
author: NexusDev
description: Anti-combat log PvP plugin for Paper 1.21
permissions:
  combatzone.bypass:
    description: Bypass combat tagging
    default: op
`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'f-4',
        project_id: 'sample-paper-combatzone',
        path: 'src/main/java/com/nexus/combatzone/CombatZonePlugin.java',
        content: `package com.nexus.combatzone;

import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.entity.EntityDamageByEntityEvent;
import org.bukkit.plugin.java.JavaPlugin;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public final class CombatZonePlugin extends JavaPlugin implements Listener {
    private final Map<UUID, Long> combatTimers = new HashMap<>();
    private static final long COMBAT_DURATION_MS = 15_000;

    @Override
    public void onEnable() {
        getServer().getPluginManager().registerEvents(this, this);
        getLogger().info("CombatZone loaded on Paper 1.21.4!");
    }

    @EventHandler
    public void onPvPDamage(EntityDamageByEntityEvent event) {
        if (event.getEntity() instanceof Player victim && event.getDamager() instanceof Player attacker) {
            long expiry = System.currentTimeMillis() + COMBAT_DURATION_MS;
            combatTimers.put(victim.getUniqueId(), expiry);
            combatTimers.put(attacker.getUniqueId(), expiry);
            victim.sendActionBar("§c§lIN COMBAT: §e15s remaining!");
            attacker.sendActionBar("§c§lIN COMBAT: §e15s remaining!");
        }
    }
}
`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
];

export function getProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (!raw) {
      const initialProjects = SAMPLE_PROJECTS.map((s) => s.project);
      const initialFiles = SAMPLE_PROJECTS.flatMap((s) => s.files);
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(initialProjects));
      localStorage.setItem(FILES_KEY, JSON.stringify(initialFiles));
      return initialProjects;
    }
    return JSON.parse(raw);
  } catch {
    return SAMPLE_PROJECTS.map((s) => s.project);
  }
}

export function saveProjects(projects: Project[]): void {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to save projects to localStorage:', e);
  }
}

export function getProjectFiles(projectId: string): ProjectFile[] {
  try {
    const raw = localStorage.getItem(FILES_KEY);
    const files: ProjectFile[] = raw ? JSON.parse(raw) : SAMPLE_PROJECTS.flatMap((s) => s.files);
    return files.filter((f) => f.project_id === projectId);
  } catch {
    return [];
  }
}

export function saveProjectFile(file: ProjectFile): void {
  try {
    const raw = localStorage.getItem(FILES_KEY);
    const files: ProjectFile[] = raw ? JSON.parse(raw) : [];
    const index = files.findIndex((f) => f.id === file.id);
    if (index >= 0) {
      files[index] = { ...file, updated_at: new Date().toISOString() };
    } else {
      files.push({ ...file, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    }
    localStorage.setItem(FILES_KEY, JSON.stringify(files));
  } catch (e) {
    console.error('Failed to save project file:', e);
  }
}

export function deleteProjectFile(fileId: string): void {
  try {
    const raw = localStorage.getItem(FILES_KEY);
    if (!raw) return;
    const files: ProjectFile[] = JSON.parse(raw);
    const updated = files.filter((f) => f.id !== fileId);
    localStorage.setItem(FILES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete file:', e);
  }
}

export function createProject(
  data: Omit<Project, 'id' | 'created_at' | 'updated_at'>
): { project: Project; files: ProjectFile[] } {
  const id = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const project: Project = {
    ...data,
    id,
    created_at: now,
    updated_at: now,
  };

  const starterFiles = generateStarterFiles(project);
  const createdFiles: ProjectFile[] = starterFiles.map((sf, index) => ({
    id: `file_${Date.now()}_${index}`,
    project_id: id,
    path: sf.path,
    content: sf.content,
    created_at: now,
    updated_at: now,
  }));

  const existingProjects = getProjects();
  saveProjects([project, ...existingProjects]);

  try {
    const rawFiles = localStorage.getItem(FILES_KEY);
    const files: ProjectFile[] = rawFiles ? JSON.parse(rawFiles) : [];
    localStorage.setItem(FILES_KEY, JSON.stringify([...files, ...createdFiles]));
  } catch (e) {
    console.error('Failed to store files:', e);
  }

  // Attempt async sync to Supabase if available
  try {
    supabase.from('projects').insert([project]).then(() => {
      supabase.from('project_files').insert(createdFiles).then(() => {
        console.log('Project synced to Supabase successfully');
      });
    }).catch((err) => {
      console.debug('Supabase sync skipped:', err);
    });
  } catch (e) {
    console.debug('Supabase client error:', e);
  }

  return { project, files: createdFiles };
}

export function deleteProject(projectId: string): void {
  const projects = getProjects().filter((p) => p.id !== projectId);
  saveProjects(projects);

  try {
    const rawFiles = localStorage.getItem(FILES_KEY);
    if (rawFiles) {
      const files: ProjectFile[] = JSON.parse(rawFiles);
      localStorage.setItem(FILES_KEY, JSON.stringify(files.filter((f) => f.project_id !== projectId)));
    }
  } catch (e) {
    console.debug(e);
  }

  try {
    supabase.from('projects').delete().eq('id', projectId).then(() => {}).catch((err) => {
      console.debug(err);
    });
  } catch (e) {
    console.debug(e);
  }
}

export function getChatSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveChatSession(session: ChatSession): void {
  try {
    const sessions = getChatSessions();
    const index = sessions.findIndex((s) => s.id === session.id);
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.unshift(session);
    }
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save chat session:', e);
  }
}

export function deleteChatSession(sessionId: string): void {
  try {
    const sessions = getChatSessions().filter((s) => s.id !== sessionId);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.debug(e);
  }
}

export function getUserSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveUserSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}
