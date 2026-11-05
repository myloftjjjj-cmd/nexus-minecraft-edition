import { Message, Attachment } from '../types/minecraft';

export async function readAttachmentText(file: File): Promise<string> {
  const name = file.name.toLowerCase();

  const textExtensions = [
    '.txt', '.md', '.json', '.js', '.jsx', '.ts', '.tsx',
    '.css', '.html', '.xml', '.yml', '.yaml', '.toml',
    '.java', '.kt', '.py', '.lua', '.c', '.cpp', '.h',
    '.sh', '.sql', '.properties', '.log', '.mcfunction'
  ];

  if (
    file.type.startsWith('text/') ||
    textExtensions.some((ext) => name.endsWith(ext))
  ) {
    try {
      return await file.text();
    } catch {
      return '';
    }
  }

  if (file.type === 'application/pdf' || name.endsWith('.pdf')) {
    try {
      const pdfjs = await import('pdfjs-dist');
      const pdf = await pdfjs.getDocument({
        data: await file.arrayBuffer(),
      }).promise;

      const pages: string[] = [];
      for (let pageNumber = 1; pageNumber <= Math.min(pdf.numPages, 10); pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item) => ('str' in item ? (item as { str: string }).str : ''))
          .join(' ');
        pages.push(`Page ${pageNumber}:\n${pageText}`);
      }
      return pages.join('\n\n');
    } catch {
      return '';
    }
  }

  return '';
}

export async function generateNexusResponse(
  prompt: string,
  history: Message[],
  attachments: Attachment[] = [],
  apiKey = ''
): Promise<string> {
  const query = prompt.toLowerCase();
  const attachedTexts = attachments
    .filter((a) => a.textContent && a.textContent.trim().length > 0)
    .map((a) => `File: ${a.name}\n${a.textContent}`)
    .join('\n\n');

  // If Gemini API key is provided, try calling it
  if (apiKey.trim()) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `You are Nexus, an elite Minecraft software engineer and modding assistant.
Help with Fabric, NeoForge, Paper, Spigot, Datapacks, Resource Packs, and Bedrock Script API.
Give clean, runnable code, correct file names, and modern versions (e.g. 1.21+).

Context from user:
${attachedTexts}

User question:
${prompt}`,
                  },
                ],
              },
            ],
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate) return candidate;
      }
    } catch (e) {
      console.warn('Gemini request failed, falling back to built-in knowledge engine:', e);
    }
  }

  // Crash report / log analyzer
  if (attachedTexts.includes('Exception') || attachedTexts.includes('crash-reports') || query.includes('crash') || query.includes('error')) {
    return analyzeCrashOrError(prompt, attachedTexts);
  }

  // Fabric modding query
  if (query.includes('fabric') || query.includes('fabric.mod.json') || query.includes('fabricloader')) {
    return handleFabricQuery(prompt, query);
  }

  // Paper / Spigot plugin query
  if (query.includes('paper') || query.includes('spigot') || query.includes('plugin') || query.includes('bukkit')) {
    return handlePaperQuery(prompt, query);
  }

  // Datapack / mcfunction query
  if (query.includes('datapack') || query.includes('mcfunction') || query.includes('loot table') || query.includes('predicate') || query.includes('advancement')) {
    return handleDatapackQuery(prompt, query);
  }

  // Resource pack query
  if (query.includes('resource pack') || query.includes('texture') || query.includes('pack.mcmeta') || query.includes('custom model data')) {
    return handleResourcePackQuery(prompt, query);
  }

  // Bedrock query
  if (query.includes('bedrock') || query.includes('@minecraft/server') || query.includes('behavior pack') || query.includes('addon') || query.includes('add-on')) {
    return handleBedrockQuery(prompt, query);
  }

  // Forge / NeoForge
  if (query.includes('neoforge') || query.includes('forge') || query.includes('eventhandler')) {
    return handleNeoForgeQuery(prompt, query);
  }

  // General Minecraft development assistance
  return handleGeneralMinecraftQuery(prompt, query);
}

function analyzeCrashOrError(prompt: string, text: string): string {
  const content = (prompt + '\n' + text).toLowerCase();

  let diagnosis = '### 🔍 Crash & Error Analysis\n\n';

  if (content.includes('nosuchmethoderror') || content.includes('classnotfoundexception')) {
    diagnosis += `**Root Cause:** Binary Incompatibility (API Mismatch)\n
A method or class could not be found at runtime. This almost always happens when:
1. A mod or plugin was compiled against a different Minecraft version (e.g. 1.20 vs 1.21).
2. A missing dependency (like **Fabric API**, **Cloth Config**, or **Architectury**).
3. The server is running Java 17 instead of **Java 21** (Minecraft 1.20.5+ requires Java 21).

**Recommended Fix:**
\`\`\`bash
# 1. Verify Java runtime version
java -version  # Must be 21 or newer for Minecraft 1.20.5 - 1.21.x!

# 2. Check your build.gradle / fabric.mod.json dependencies:
# Ensure fabric-api matches your Minecraft target version!
\`\`\`\n`;
  } else if (content.includes('outofmemoryerror') || content.includes('metaspace')) {
    diagnosis += `**Root Cause:** Memory Exhaustion (OutOfMemoryError)\n
The JVM ran out of allocated RAM or Metaspace.

**Fix in your launch script:**
\`\`\`bash
java -Xms4G -Xmx6G -XX:+UseG1GC -jar server.jar --nogui
\`\`\`\n`;
  } else if (content.includes('nullpointerexception')) {
    diagnosis += `**Root Cause:** NullPointerException (NPE)\n
An object reference was null when calling a method or accessing a field. In Minecraft 1.21+, common culprits:
- Accessing an \`Item\` or \`Block\` before registry registration has completed.
- Accessing \`player.getWorld()\` or \`event.getEntity()\` when entity has already despawned.
- Null checks missing on \`ItemStack.getItem()\` or \`player.getInventory().getItemInMainHand()\`.

**Defensive Check:**
\`\`\`java
if (itemStack != null && !itemStack.isEmpty()) {
    // Safe to access item properties
}
\`\`\`\n`;
  } else {
    diagnosis += `**Inspection Summary:**
The provided log indicates a runtime exception in your mod or plugin stack. 

**Standard Checklist for Minecraft 1.21+:**
1. **Java Version:** Verify you are running on **Java 21**.
2. **Registry Lifecycle:** In 1.21+, registration requires using \`RegistryKey\` and registering during \`ModInitializer\` or NeoForge \`RegisterEvent\`.
3. **Networking Changes:** Minecraft 1.20.2+ completely overhauled networking with \`CustomPayload\` and strict codec validation.
4. **Item Components:** In 1.20.5+, NBT on items was replaced with typed **Data Components** (\`DataComponentTypes\`).\n`;
  }

  return diagnosis;
}

function handleFabricQuery(prompt: string, query: string): string {
  if (query.includes('item') || query.includes('sword') || query.includes('tool')) {
    return `### ⚔️ Registering a Custom Item in Fabric (Minecraft 1.21.4)

In Minecraft 1.21.4, registry methods use typed **RegistryKey** and the modern \`Item.Settings\`:

#### 1. Define and Register Item in your ModInitializer
\`\`\`java
package com.example.mymod;

import net.fabricmc.api.ModInitializer;
import net.fabricmc.fabric.api.itemgroup.v1.ItemGroupEvents;
import net.minecraft.item.Item;
import net.minecraft.item.ItemGroups;
import net.minecraft.registry.Registries;
import net.minecraft.registry.Registry;
import net.minecraft.registry.RegistryKey;
import net.minecraft.registry.RegistryKeys;
import net.minecraft.util.Identifier;

public class MyMod implements ModInitializer {
    public static final String MOD_ID = "mymod";

    // 1. Create Registry Key
    public static final RegistryKey<Item> RUBY_KEY = RegistryKey.of(
        RegistryKeys.ITEM, 
        Identifier.of(MOD_ID, "ruby")
    );

    // 2. Instantiate with registryKey attached
    public static final Item RUBY = new Item(new Item.Settings().registryKey(RUBY_KEY));

    @Override
    public void onInitialize() {
        // Register to Vanilla Item Registry
        Registry.register(Registries.ITEM, RUBY_KEY, RUBY);

        // Add to Creative Inventory Tab
        ItemGroupEvents.modifyEntriesEvent(ItemGroups.INGREDIENTS).register(entries -> {
            entries.add(RUBY);
        });
    }
}
\`\`\`

#### 2. Item Model JSON (\`src/main/resources/assets/mymod/models/item/ruby.json\`)
\`\`\`json
{
  "parent": "minecraft:item/generated",
  "textures": {
    "layer0": "mymod:item/ruby"
  }
}
\`\`\`

#### 3. English Localization (\`src/main/resources/assets/mymod/lang/en_us.json\`)
\`\`\`json
{
  "item.mymod.ruby": "Gleaming Ruby"
}
\`\`\`

> 💡 **Tip:** In 1.21.4, always use \`Identifier.of(MOD_ID, "path")\` instead of \`new Identifier(...)\`, which is deprecated!`;
  }

  return `### ⚡ Fabric Modding Guide (Minecraft 1.21.4)

Here is a standard project setup for a Fabric mod:

#### \`fabric.mod.json\`
\`\`\`json
{
  "schemaVersion": 1,
  "id": "nexusmod",
  "version": "1.0.0",
  "name": "Nexus Mod",
  "description": "Built with Nexus MC Edition",
  "environment": "*",
  "entrypoints": {
    "main": [
      "com.nexus.mod.NexusMod"
    ],
    "client": [
      "com.nexus.mod.NexusModClient"
    ]
  },
  "depends": {
    "fabricloader": ">=0.16.0",
    "minecraft": "~1.21.4",
    "java": ">=21",
    "fabric-api": "*"
  }
}
\`\`\`

#### \`src/main/java/com/nexus/mod/NexusMod.java\`
\`\`\`java
package com.nexus.mod;

import net.fabricmc.api.ModInitializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class NexusMod implements ModInitializer {
    public static final String MOD_ID = "nexusmod";
    public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);

    @Override
    public void onInitialize() {
        LOGGER.info("Nexus Mod initialized successfully!");
    }
}
\`\`\`

Need custom blocks, entity rendering, custom sounds, or networking packets? Just ask!`;
}

function handlePaperQuery(prompt: string, query: string): string {
  return `### 📜 Paper / Spigot Plugin Development (Paper 1.21.4)

Here is a modern, high-performance Paper plugin implementation with commands and event listeners:

#### 1. \`src/main/resources/paper-plugin.yml\`
\`\`\`yaml
name: NexusPlugin
version: '1.0.0'
main: com.nexus.plugin.NexusPlugin
api-version: '1.21'
author: NexusDev
description: High-performance Paper plugin
commands:
  heal:
    description: Restore health and hunger
    permission: nexusplugin.heal
    usage: /heal [player]
permissions:
  nexusplugin.heal:
    description: Permission to use /heal
    default: op
\`\`\`

#### 2. \`src/main/java/com/nexus/plugin/NexusPlugin.java\`
\`\`\`java
package com.nexus.plugin;

import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.format.NamedTextColor;
import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.plugin.java.JavaPlugin;

public final class NexusPlugin extends JavaPlugin implements Listener {

    @Override
    public void onEnable() {
        getServer().getPluginManager().registerEvents(this, this);
        getLogger().info("NexusPlugin enabled on Paper 1.21.4!");
    }

    @Override
    public void onDisable() {
        getLogger().info("NexusPlugin safely disabled.");
    }

    @EventHandler
    public void onJoin(PlayerJoinEvent event) {
        Player player = event.getPlayer();
        player.sendMessage(
            Component.text("Welcome back to the server, ", NamedTextColor.GOLD)
                .append(Component.text(player.getName(), NamedTextColor.AQUA))
        );
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (command.getName().equalsIgnoreCase("heal")) {
            if (!(sender instanceof Player player)) {
                sender.sendMessage(Component.text("Only in-game players can run this command.", NamedTextColor.RED));
                return true;
            }
            player.setHealth(player.getMaxHealth());
            player.setFoodLevel(20);
            player.sendMessage(Component.text("§a✨ You have been fully restored!"));
            return true;
        }
        return false;
    }
}
\`\`\`

> 💡 **Best Practice:** Paper uses Adventure (\`Component\`) for chat formatting rather than legacy \`§\` color codes or \`ChatColor\`.`;
}

function handleDatapackQuery(prompt: string, query: string): string {
  return `### ⌘ Datapack & MCFunction Guide (Minecraft 1.21.4)

#### 1. \`pack.mcmeta\` (pack_format: 61 for 1.21.4)
\`\`\`json
{
  "pack": {
    "pack_format": 61,
    "description": "Nexus Custom Datapack"
  }
}
\`\`\`

#### 2. Auto-load Hook: \`data/minecraft/tags/function/load.json\`
\`\`\`json
{
  "values": [
    "nexus:load"
  ]
}
\`\`\`

#### 3. Main Load Function: \`data/nexus/function/load.mcfunction\`
\`\`\`mcfunction
# Setup scoreboard objectives
scoreboard objectives add nexus_timer dummy "Timer"
scoreboard objectives add nexus_kills playerKillCount "Kills"

tellraw @a [{"text":"[Nexus] ","color":"dark_purple","bold":true},{"text":"Datapack active!","color":"green"}]
\`\`\`

#### 4. Custom Shaped Crafting Recipe: \`data/nexus/recipe/super_bow.json\`
\`\`\`json
{
  "type": "minecraft:crafting_shaped",
  "category": "equipment",
  "key": {
    "#": { "item": "minecraft:stick" },
    "S": { "item": "minecraft:string" },
    "D": { "item": "minecraft:diamond" }
  },
  "pattern": [
    " #S",
    "# D",
    " #S"
  ],
  "result": {
    "count": 1,
    "id": "minecraft:bow",
    "components": {
      "minecraft:custom_name": "{\\"text\\":\\"Nexus Longbow\\",\\"color\\":\\"gold\\",\\"bold\\":true}",
      "minecraft:enchantments": {
        "levels": {
          "minecraft:power": 5,
          "minecraft:flame": 1,
          "minecraft:unbreaking": 3
        }
      }
    }
  }
}
\`\`\`

> 💡 **Notice:** In 1.20.5+, item NBT in recipes was replaced by \`components\`!`;
}

function handleResourcePackQuery(prompt: string, query: string): string {
  return `### ▧ Resource Pack Structure (Minecraft 1.21.4)

#### 1. \`pack.mcmeta\`
\`\`\`json
{
  "pack": {
    "pack_format": 46,
    "description": "§dNexus HD Textures §8| §7v1.0"
  }
}
\`\`\`

#### 2. Directory Hierarchy
\`\`\`text
my_resource_pack/
├── pack.mcmeta
├── pack.png (128x128 or 256x256 PNG)
└── assets/
    └── minecraft/
        ├── textures/
        │   ├── item/
        │   │   └── diamond_sword.png
        │   └── block/
        │       └── obsidian.png
        ├── models/
        │   └── item/
        │       └── diamond_sword.json
        └── sounds.json
\`\`\`

#### 3. Custom Item Model with CustomModelData (\`models/item/diamond_sword.json\`)
\`\`\`json
{
  "parent": "minecraft:item/handheld",
  "textures": {
    "layer0": "minecraft:item/diamond_sword"
  },
  "overrides": [
    { "predicate": { "custom_model_data": 1001 }, "model": "nexus:item/laser_blade" }
  ]
}
\`\`\``;
}

function handleBedrockQuery(prompt: string, query: string): string {
  return `### 📱 Bedrock Script API (@minecraft/server v1.14+)

In modern Bedrock Edition (1.21+), custom mechanics are written in JavaScript/TypeScript using the Script API:

#### 1. \`manifest.json\` (Behavior Pack)
\`\`\`json
{
  "format_version": 2,
  "header": {
    "name": "Nexus Bedrock Addon",
    "description": "Script API behavior pack",
    "uuid": "4c8f5d02-12b7-4cb2-938b-b8935c15e211",
    "version": [1, 0, 0],
    "min_engine_version": [1, 21, 0]
  },
  "modules": [
    {
      "type": "script",
      "language": "javascript",
      "uuid": "7b0a758d-71b9-47f9-86ce-b7b556942099",
      "version": [1, 0, 0],
      "entry": "scripts/main.js"
    }
  ],
  "dependencies": [
    {
      "module_name": "@minecraft/server",
      "version": "1.14.0"
    }
  ]
}
\`\`\`

#### 2. \`scripts/main.js\`
\`\`\`javascript
import { world, system, ItemStack } from "@minecraft/server";

// Detect when player uses a compass to teleport home
world.afterEvents.itemUse.subscribe((event) => {
    const player = event.source;
    const item = event.itemStack;

    if (item.typeId === "minecraft:compass") {
        const spawn = player.getSpawnPoint();
        if (spawn) {
            player.teleport(spawn);
            player.sendMessage("§aTeleported to your bed/spawn point!");
        } else {
            player.sendMessage("§cNo spawn point found! Sleep in a bed first.");
        }
    }
});

// Broadcast periodic server tip
system.runInterval(() => {
    world.sendMessage("§e[Nexus Tip] Use /scriptevent to trigger custom add-on events!");
}, 20 * 60); // Every 60 seconds
\`\`\``;
}

function handleNeoForgeQuery(prompt: string, query: string): string {
  return `### 🔨 NeoForge Modding Guide (Minecraft 1.21+)

NeoForge is the modern successor to Forge for Minecraft 1.20.2+.

#### \`src/main/resources/META-INF/neoforge.mods.toml\`
\`\`\`toml
modLoader="javafml"
loaderVersion="[4,)"
license="MIT"

[[mods]]
modId="nexus_neoforge"
version="1.0.0"
displayName="Nexus NeoForge Mod"
description='''Modern NeoForge mod built with Nexus MC Edition.'''

[[dependencies.nexus_neoforge]]
    modId="neoforge"
    type="required"
    versionRange="[21.1.0,)"
    ordering="NONE"
    side="BOTH"
\`\`\`

#### \`src/main/java/com/nexus/neoforge/NexusMod.java\`
\`\`\`java
package com.nexus.neoforge;

import net.minecraft.world.item.Item;
import net.neoforged.bus.api.IEventBus;
import net.neoforged.fml.common.Mod;
import net.neoforged.neoforge.registries.DeferredItem;
import net.neoforged.neoforge.registries.DeferredRegister;

@Mod(NexusMod.MOD_ID)
public class NexusMod {
    public static final String MOD_ID = "nexus_neoforge";

    // Modern NeoForge DeferredRegister
    public static final DeferredRegister.Items ITEMS = DeferredRegister.createItems(MOD_ID);

    public static final DeferredItem<Item> VOID_SHARD = ITEMS.registerSimpleItem("void_shard", new Item.Properties());

    public NexusMod(IEventBus modEventBus) {
        ITEMS.register(modEventBus);
    }
}
\`\`\``;
}

function handleGeneralMinecraftQuery(prompt: string, query: string): string {
  return `### 🎮 Nexus Minecraft Assistant

I can help you build and configure anything for Minecraft! Here are popular tools and topics:

- **Modding:** Fabric, NeoForge, Forge (1.21.4, 1.20.4, 1.16.5)
- **Server Plugins:** Paper, Spigot, Purpur, Velocity (commands, listeners, configs, databases)
- **Datapacks:** Custom recipes, loot tables, tags, predicates, \`.mcfunction\` loops
- **Resource Packs:** 3D models, textures, \`sounds.json\`, font glyphs, \`pack.mcmeta\`
- **Bedrock Add-ons:** \`@minecraft/server\` Script API, behavior packs, custom entities
- **Debugging:** Paste any crash log or stack trace and I'll identify the offending mod or method!

**To get started:**
1. Switch to the **Projects** tab in the sidebar to scaffold a ready-to-code project!
2. Or ask a question like *"How do I give a player glowing effects when wearing custom armor in Fabric?"* or *"Write a Paper command for setting custom warps."*`;
}
