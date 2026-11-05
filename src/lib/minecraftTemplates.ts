import { Project, ProjectFile } from '../types/minecraft';

export function getPackFormat(version: string, type: 'resource' | 'data' = 'resource'): number {
  if (version.startsWith('1.21.4')) return type === 'resource' ? 46 : 61;
  if (version.startsWith('1.21')) return type === 'resource' ? 34 : 48;
  if (version.startsWith('1.20.4') || version.startsWith('1.20.5')) return type === 'resource' ? 22 : 41;
  if (version.startsWith('1.20')) return type === 'resource' ? 15 : 15;
  if (version.startsWith('1.19.4')) return type === 'resource' ? 13 : 12;
  if (version.startsWith('1.19')) return type === 'resource' ? 9 : 10;
  if (version.startsWith('1.18')) return type === 'resource' ? 8 : 9;
  return 15;
}

export function generateStarterFiles(project: Project): Omit<ProjectFile, 'id' | 'created_at' | 'updated_at'>[] {
  const modId = project.name.toLowerCase().replace(/[^a-z0-9_]/g, '');
  const pkgPath = project.package_id.replace(/\./g, '/');
  const className = project.name.replace(/[^a-zA-Z0-9]/g, '');
  const now = new Date().toISOString();

  const files: { path: string; content: string }[] = [];

  if (project.project_type === 'Mod' && project.loader === 'Fabric') {
    files.push({
      path: 'fabric.mod.json',
      content: JSON.stringify(
        {
          schemaVersion: 1,
          id: modId,
          version: '1.0.0',
          name: project.name,
          description: project.description || 'A modern Fabric mod for Minecraft.',
          authors: ['Author'],
          contact: { homepage: 'https://example.com' },
          license: 'MIT',
          icon: `assets/${modId}/icon.png`,
          environment: '*',
          entrypoints: {
            main: [`${project.package_id}.${className}Mod`],
          },
          depends: {
            fabricloader: '>=0.16.0',
            minecraft: `~${project.minecraft_version}`,
            java: '>=21',
            'fabric-api': '*',
          },
        },
        null,
        2
      ),
    });

    files.push({
      path: `src/main/java/${pkgPath}/${className}Mod.java`,
      content: `package ${project.package_id};

import net.fabricmc.api.ModInitializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ${className}Mod implements ModInitializer {
    public static final String MOD_ID = "${modId}";
    public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);

    @Override
    public void onInitialize() {
        LOGGER.info("${project.name} initialized for Minecraft ${project.minecraft_version}!");
        // Register custom items, blocks, and event listeners here
    }
}
`,
    });

    files.push({
      path: 'gradle.properties',
      content: `minecraft_version=${project.minecraft_version}
yarn_mappings=${project.minecraft_version}+build.1
loader_version=0.16.9
mod_version=1.0.0
maven_group=${project.package_id}
archives_base_name=${modId}
`,
    });
  } else if (project.project_type === 'Mod' && (project.loader === 'NeoForge' || project.loader === 'Forge')) {
    files.push({
      path: 'src/main/resources/META-INF/neoforge.mods.toml',
      content: `modLoader="javafml"
loaderVersion="[1,)"
license="MIT"

[[mods]]
modId="${modId}"
version="1.0.0"
displayName="${project.name}"
description='''${project.description || 'A NeoForge Minecraft mod.'}'''

[[dependencies.${modId}]]
    modId="neoforge"
    type="required"
    versionRange="[21.1.0,)"
    ordering="NONE"
    side="BOTH"
`,
    });

    files.push({
      path: `src/main/java/${pkgPath}/${className}Mod.java`,
      content: `package ${project.package_id};

import net.neoforged.bus.api.IEventBus;
import net.neoforged.fml.common.Mod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Mod(${className}Mod.MOD_ID)
public class ${className}Mod {
    public static final String MOD_ID = "${modId}";
    private static final Logger LOGGER = LoggerFactory.getLogger(${className}Mod.class);

    public ${className}Mod(IEventBus modEventBus) {
        LOGGER.info("${project.name} loaded successfully!");
    }
}
`,
    });
  } else if (project.project_type === 'Server Plugin' || project.loader === 'Paper' || project.loader === 'Spigot') {
    files.push({
      path: 'src/main/resources/paper-plugin.yml',
      content: `name: ${project.name}
version: '1.0.0'
main: ${project.package_id}.${className}
api-version: '${project.minecraft_version.split('.').slice(0, 2).join('.')}'
author: ServerDev
description: ${project.description || 'Custom Paper server plugin.'}
permissions:
  ${modId}.admin:
    description: Admin access to ${project.name} commands
    default: op
`,
    });

    files.push({
      path: `src/main/java/${pkgPath}/${className}.java`,
      content: `package ${project.package_id};

import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.plugin.java.JavaPlugin;

public final class ${className} extends JavaPlugin implements Listener {

    @Override
    public void onEnable() {
        getLogger().info("${project.name} enabled!");
        getServer().getPluginManager().registerEvents(this, this);
    }

    @Override
    public void onDisable() {
        getLogger().info("${project.name} disabled.");
    }

    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        Player player = event.getPlayer();
        player.sendMessage("§aWelcome to the server! Running §b${project.name}§a.");
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (command.getName().equalsIgnoreCase("${modId}")) {
            sender.sendMessage("§6[${project.name}] §fVersion 1.0.0 is operational!");
            return true;
        }
        return false;
    }
}
`,
    });

    files.push({
      path: 'pom.xml',
      content: `<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>${project.package_id}</groupId>
    <artifactId>${modId}</artifactId>
    <version>1.0.0</version>
    <repositories>
        <repository>
            <id>papermc</id>
            <url>https://repo.papermc.io/repository/maven-public/</url>
        </repository>
    </repositories>
    <dependencies>
        <dependency>
            <groupId>io.papermc.paper</groupId>
            <artifactId>paper-api</artifactId>
            <version>${project.minecraft_version}-R0.1-SNAPSHOT</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>
</project>
`,
    });
  } else if (project.project_type === 'Resource Pack') {
    const packFormat = getPackFormat(project.minecraft_version, 'resource');
    files.push({
      path: 'pack.mcmeta',
      content: JSON.stringify(
        {
          pack: {
            pack_format: packFormat,
            description: project.description || `Custom ${project.name} resource pack for MC ${project.minecraft_version}`,
          },
        },
        null,
        2
      ),
    });

    files.push({
      path: 'assets/minecraft/sounds.json',
      content: '{\n  "custom.effect": {\n    "sounds": [\n      "minecraft:custom/effect"\n    ]\n  }\n}\n',
    });

    files.push({
      path: 'README.md',
      content: `# ${project.name}
A Minecraft resource pack targeting version ${project.minecraft_version} (pack_format: ${packFormat}).
Place custom textures in \`assets/minecraft/textures/\` and models in \`assets/minecraft/models/\`.
`,
    });
  } else if (project.project_type === 'Datapack') {
    const packFormat = getPackFormat(project.minecraft_version, 'data');
    files.push({
      path: 'pack.mcmeta',
      content: JSON.stringify(
        {
          pack: {
            pack_format: packFormat,
            description: project.description || `Custom ${project.name} datapack for MC ${project.minecraft_version}`,
          },
        },
        null,
        2
      ),
    });

    files.push({
      path: `data/${modId}/function/load.mcfunction`,
      content: `# Load function runs once when the world or /reload loads
tellraw @a [{"text":"[${project.name}] ","color":"gold"},{"text":"Datapack loaded successfully!","color":"green"}]
scoreboard objectives add ${modId}_timer dummy
`,
    });

    files.push({
      path: `data/${modId}/function/tick.mcfunction`,
      content: `# Tick function runs 20 times per second
# Add scheduled checks or particle effects here
`,
    });

    files.push({
      path: 'data/minecraft/tags/function/load.json',
      content: JSON.stringify(
        {
          values: [`${modId}:load`],
        },
        null,
        2
      ),
    });

    files.push({
      path: 'data/minecraft/tags/function/tick.json',
      content: JSON.stringify(
        {
          values: [`${modId}:tick`],
        },
        null,
        2
      ),
    });
  } else if (project.edition === 'Bedrock' || project.project_type === 'Bedrock Add-on') {
    const headerUuid = crypto.randomUUID ? crypto.randomUUID() : 'b8c8d810-745a-4938-9cb5-601f016d9b01';
    const moduleUuid = crypto.randomUUID ? crypto.randomUUID() : '9a139e55-08e8-46c5-849a-526b38c2dc02';

    files.push({
      path: 'manifest.json',
      content: JSON.stringify(
        {
          format_version: 2,
          header: {
            name: project.name,
            description: project.description || 'Bedrock Behavior Pack Add-on',
            uuid: headerUuid,
            version: [1, 0, 0],
            min_engine_version: [1, 21, 0],
          },
          modules: [
            {
              type: 'script',
              language: 'javascript',
              uuid: moduleUuid,
              version: [1, 0, 0],
              entry: 'scripts/main.js',
            },
          ],
          dependencies: [
            {
              module_name: '@minecraft/server',
              version: '1.14.0',
            },
          ],
        },
        null,
        2
      ),
    });

    files.push({
      path: 'scripts/main.js',
      content: `import { world, system } from "@minecraft/server";

world.afterEvents.worldInitialize.subscribe(() => {
    world.sendMessage("§e[${project.name}] Bedrock Add-on initialized!");
});

world.afterEvents.itemUse.subscribe((event) => {
    const player = event.source;
    const item = event.itemStack;
    player.sendMessage(\`You used \${item.typeId}!\`);
});
`,
    });
  } else {
    // Default fallback project
    files.push({
      path: 'README.md',
      content: `# ${project.name}
Edition: ${project.edition}
Type: ${project.project_type}
Minecraft: ${project.minecraft_version}
Loader: ${project.loader}
`,
    });
  }

  return files.map((f) => ({
    project_id: project.id,
    path: f.path,
    content: f.content,
  }));
}
