export interface RecipeItem {
  name: string;
  category: 'Tools' | 'Weapons' | 'Armor' | 'Redstone' | 'Mechanisms' | 'Building' | 'Food';
  grid: (string | null)[]; // 9 slots
  result: string;
  count: number;
  description: string;
  shaped: boolean;
}

export interface EnchantmentItem {
  id: string;
  name: string;
  targets: string[];
  maxLevel: number;
  weight: 'Common' | 'Uncommon' | 'Rare' | 'Very Rare';
  conflicts: string[];
  description: string;
  tips: string;
}

export interface PotionItem {
  id: string;
  name: string;
  base: string;
  ingredient: string;
  effect: string;
  duration: string;
  enhanced?: {
    ingredient: string;
    effect: string;
    duration: string;
  };
  extended?: {
    ingredient: string;
    duration: string;
  };
  splash: boolean;
}

export interface MobItem {
  id: string;
  name: string;
  category: 'Passive' | 'Neutral' | 'Hostile' | 'Boss';
  hp: number;
  damage: string;
  spawns: string;
  drops: { item: string; chance: string }[];
  behavior: string;
  tips: string;
}

export interface BlockItem {
  id: string;
  name: string;
  hardness: number;
  blastResistance: number;
  tool: string;
  renewable: boolean;
  transparent: boolean;
  lightEmission: number;
  flammable: boolean;
  notes: string;
}

export interface GearItem {
  name: string;
  tier: 'Netherite' | 'Diamond' | 'Iron' | 'Golden' | 'Chainmail' | 'Leather' | 'Special';
  type: 'Armor' | 'Weapon' | 'Tool';
  durability: number;
  armorOrDamage: number;
  toughnessOrSpeed: number;
  knockbackOrEfficiency: string;
  pros: string;
  cons: string;
}

export interface RedstoneGuide {
  id: string;
  title: string;
  category: 'Logic Gate' | 'Clocks' | 'Memory & Latches' | 'Contraptions' | 'Storage & Sorting';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  components: string[];
  description: string;
  steps: string[];
  proTip: string;
}

export interface SeedItem {
  id: string;
  seed: string;
  title: string;
  edition: 'Java & Bedrock' | 'Java' | 'Bedrock';
  version: string;
  description: string;
  highlights: { name: string; coords: string }[];
}

export interface BuildingIdea {
  id: string;
  title: string;
  theme: 'Medieval' | 'Modern' | 'Cyberpunk' | 'Fantasy' | 'Rustic' | 'Nether';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  palette: string[];
  dimensions: string;
  summary: string;
  features: string[];
  stepByStep: string[];
}

export const CRAFTING_RECIPES: RecipeItem[] = [
  {
    name: 'Diamond Sword',
    category: 'Weapons',
    grid: [null, 'Diamond', null, null, 'Diamond', null, null, 'Stick', null],
    result: 'Diamond Sword',
    count: 1,
    description: 'High tier weapon dealing +7 Attack Damage and 1.6 Attack Speed.',
    shaped: true,
  },
  {
    name: 'Shield',
    category: 'Armor',
    grid: ['Wood Planks', 'Iron Ingot', 'Wood Planks', 'Wood Planks', 'Wood Planks', 'Wood Planks', null, 'Wood Planks', null],
    result: 'Shield',
    count: 1,
    description: 'Blocks 100% of melee and projectile damage when held in off-hand.',
    shaped: true,
  },
  {
    name: 'Piston',
    category: 'Redstone',
    grid: ['Wood Planks', 'Wood Planks', 'Wood Planks', 'Cobblestone', 'Iron Ingot', 'Cobblestone', 'Cobblestone', 'Redstone Dust', 'Cobblestone'],
    result: 'Piston',
    count: 1,
    description: 'Pushes up to 12 blocks when activated by a redstone signal.',
    shaped: true,
  },
  {
    name: 'Sticky Piston',
    category: 'Redstone',
    grid: [null, 'Slimeball', null, null, 'Piston', null, null, null, null],
    result: 'Sticky Piston',
    count: 1,
    description: 'Pushes and pulls blocks back when retracted.',
    shaped: true,
  },
  {
    name: 'Observer',
    category: 'Redstone',
    grid: ['Cobblestone', 'Cobblestone', 'Cobblestone', 'Redstone Dust', 'Redstone Dust', 'Nether Quartz', 'Cobblestone', 'Cobblestone', 'Cobblestone'],
    result: 'Observer',
    count: 1,
    description: 'Emits a 1-tick redstone pulse whenever the block in front changes state.',
    shaped: true,
  },
  {
    name: 'Hopper',
    category: 'Mechanisms',
    grid: ['Iron Ingot', null, 'Iron Ingot', 'Iron Ingot', 'Chest', 'Iron Ingot', null, 'Iron Ingot', null],
    result: 'Hopper',
    count: 1,
    description: 'Collects floating items and transfers items between containers at 2.5 items/sec.',
    shaped: true,
  },
  {
    name: 'Crafter',
    category: 'Redstone',
    grid: ['Iron Ingot', 'Iron Ingot', 'Iron Ingot', 'Iron Ingot', 'Crafting Table', 'Iron Ingot', 'Redstone Dust', 'Dropper', 'Redstone Dust'],
    result: 'Crafter',
    count: 1,
    description: 'Auto-crafts items when pulsed with redstone (added in Minecraft 1.21).',
    shaped: true,
  },
  {
    name: 'Wind Charge',
    category: 'Weapons',
    grid: [null, null, null, null, 'Breeze Rod', null, null, null, null],
    result: 'Wind Charge',
    count: 4,
    description: 'Throws a burst of wind that launches entities or player upward.',
    shaped: false,
  },
  {
    name: 'Mace',
    category: 'Weapons',
    grid: [null, 'Heavy Core', null, null, 'Breeze Rod', null, null, null, null],
    result: 'Mace',
    count: 1,
    description: 'Smashes enemies with damage scaling infinitely based on fall distance!',
    shaped: true,
  },
  {
    name: 'Enchanting Table',
    category: 'Building',
    grid: [null, 'Book', null, 'Diamond', 'Obsidian', 'Diamond', 'Obsidian', 'Obsidian', 'Obsidian'],
    result: 'Enchanting Table',
    count: 1,
    description: 'Empowers gear with magical enhancements up to level 30 when surrounded by 15 bookshelves.',
    shaped: true,
  },
  {
    name: 'Golden Apple',
    category: 'Food',
    grid: ['Gold Ingot', 'Gold Ingot', 'Gold Ingot', 'Gold Ingot', 'Apple', 'Gold Ingot', 'Gold Ingot', 'Gold Ingot', 'Gold Ingot'],
    result: 'Golden Apple',
    count: 1,
    description: 'Grants Absorption (2 hearts) for 2 minutes and Regeneration II for 5 seconds.',
    shaped: true,
  },
  {
    name: 'Bundle',
    category: 'Tools',
    grid: ['String', 'Leather', null, 'Leather', null, 'Leather', 'Leather', 'Leather', 'Leather'],
    result: 'Bundle',
    count: 1,
    description: 'Holds up to 64 mixed items in a single inventory slot.',
    shaped: true,
  },
];

export const ENCHANTMENTS: EnchantmentItem[] = [
  {
    id: 'mending',
    name: 'Mending',
    targets: ['Armor', 'Sword', 'Bow', 'Crossbow', 'Trident', 'Tools', 'Mace', 'Elytra'],
    maxLevel: 1,
    weight: 'Rare',
    conflicts: ['Infinity'],
    description: 'Repairs the item using gathered experience orbs (2 durability per 1 XP point).',
    tips: 'Best enchantment in the game. Incompatible with Infinity on bows; Mending is usually preferred for long-term survival.',
  },
  {
    id: 'unbreaking',
    name: 'Unbreaking',
    targets: ['All Gear', 'Elytra', 'Shears', 'Flint and Steel'],
    maxLevel: 3,
    weight: 'Common',
    conflicts: [],
    description: 'Gives a chance for durability to not decrease upon use (Level III gives 4x effective durability).',
    tips: 'Stack with Mending on every single piece of gear you own.',
  },
  {
    id: 'sharpness',
    name: 'Sharpness',
    targets: ['Sword', 'Axe'],
    maxLevel: 5,
    weight: 'Common',
    conflicts: ['Smite', 'Bane of Arthropods'],
    description: 'Increases all melee damage by 0.5 * level + 0.5 (+3.0 extra damage at Level V).',
    tips: 'Ideal general-purpose sword enchantment. Smite V deals more to undead (Wither/Zombies), but Sharpness hits all mobs.',
  },
  {
    id: 'fortune',
    name: 'Fortune',
    targets: ['Pickaxe', 'Shovel', 'Axe', 'Hoe'],
    maxLevel: 3,
    weight: 'Rare',
    conflicts: ['Silk Touch'],
    description: 'Increases the amount of raw drops from ores, crops, gravel, and glowstone (up to 4x on diamonds/coal).',
    tips: 'Keep one Fortune III pickaxe for ores and one Silk Touch pickaxe for transport and ender chests.',
  },
  {
    id: 'silk_touch',
    name: 'Silk Touch',
    targets: ['Pickaxe', 'Shovel', 'Axe', 'Hoe'],
    maxLevel: 1,
    weight: 'Rare',
    conflicts: ['Fortune'],
    description: 'Causes mined blocks to drop themselves rather than their usual items (e.g. Diamond Ore, Glass, Ice, Beehives).',
    tips: 'Essential for mining Ender Chests, Packed Ice, Sea Lanterns, and Spawners/Campfires.',
  },
  {
    id: 'protection',
    name: 'Protection',
    targets: ['Helmet', 'Chestplate', 'Leggings', 'Boots'],
    maxLevel: 4,
    weight: 'Common',
    conflicts: ['Fire Protection', 'Blast Protection', 'Projectile Protection'],
    description: 'Reduces all incoming damage by 4% per level (up to capped 80% with full Protection IV set).',
    tips: 'Full Protection IV on all 4 armor slots grants the maximum damage reduction against almost every damage source.',
  },
  {
    id: 'wind_burst',
    name: 'Wind Burst',
    targets: ['Mace'],
    maxLevel: 3,
    weight: 'Very Rare',
    conflicts: [],
    description: 'Launches the attacker high into the air upon hitting an enemy, allowing chained smash attacks!',
    tips: 'Found exclusively in Ominous Vaults inside Trial Chambers. Combined with Density, allows infinite slam chains.',
  },
  {
    id: 'density',
    name: 'Density',
    targets: ['Mace'],
    maxLevel: 5,
    weight: 'Common',
    conflicts: ['Breach', 'Smite', 'Bane of Arthropods'],
    description: 'Increases the damage dealt per block fallen (+0.5 damage per block per level).',
    tips: 'At Density V, falling 10 blocks adds +25 damage on top of base mace damage!',
  },
  {
    id: 'infinity',
    name: 'Infinity',
    targets: ['Bow'],
    maxLevel: 1,
    weight: 'Very Rare',
    conflicts: ['Mending'],
    description: 'Allows shooting regular arrows without consuming them, as long as at least 1 arrow is in inventory.',
    tips: 'Does not apply to tipped or spectral arrows. Great for intense combat where you cannot afford running out of arrows.',
  },
  {
    id: 'looting',
    name: 'Looting',
    targets: ['Sword'],
    maxLevel: 3,
    weight: 'Rare',
    conflicts: [],
    description: 'Increases maximum mob drops by +1 per level and boosts rare drop rates (e.g. Wither Skeleton Skulls).',
    tips: 'Wither Skeleton Skull drop rate jumps from 2.5% to 5.5% with Looting III.',
  },
];

export const POTIONS: PotionItem[] = [
  {
    id: 'healing',
    name: 'Potion of Healing',
    base: 'Awkward Potion',
    ingredient: 'Glistering Melon Slice',
    effect: 'Instantly restores 4 Hearts (8 HP)',
    duration: 'Instant',
    enhanced: {
      ingredient: 'Glowstone Dust',
      effect: 'Instantly restores 8 Hearts (16 HP)',
      duration: 'Instant',
    },
    splash: true,
  },
  {
    id: 'regeneration',
    name: 'Potion of Regeneration',
    base: 'Awkward Potion',
    ingredient: 'Ghast Tear',
    effect: 'Restores health continuously over time',
    duration: '0:45',
    enhanced: {
      ingredient: 'Glowstone Dust',
      effect: 'Restores health at double speed',
      duration: '0:22',
    },
    extended: {
      ingredient: 'Redstone Dust',
      duration: '1:30',
    },
    splash: true,
  },
  {
    id: 'strength',
    name: 'Potion of Strength',
    base: 'Awkward Potion',
    ingredient: 'Blaze Powder',
    effect: 'Increases melee damage by +3 (+1.5 hearts per hit)',
    duration: '3:00',
    enhanced: {
      ingredient: 'Glowstone Dust',
      effect: 'Increases melee damage by +6 (+3 hearts per hit)',
      duration: '1:30',
    },
    extended: {
      ingredient: 'Redstone Dust',
      duration: '8:00',
    },
    splash: true,
  },
  {
    id: 'speed',
    name: 'Potion of Swiftness',
    base: 'Awkward Potion',
    ingredient: 'Sugar',
    effect: 'Increases movement speed and FOV by +20%',
    duration: '3:00',
    enhanced: {
      ingredient: 'Glowstone Dust',
      effect: 'Increases movement speed by +40%',
      duration: '1:30',
    },
    extended: {
      ingredient: 'Redstone Dust',
      duration: '8:00',
    },
    splash: true,
  },
  {
    id: 'fire_resistance',
    name: 'Potion of Fire Resistance',
    base: 'Awkward Potion',
    ingredient: 'Magma Cream',
    effect: 'Complete immunity to fire, lava, and blaze fireballs',
    duration: '3:00',
    extended: {
      ingredient: 'Redstone Dust',
      duration: '8:00',
    },
    splash: true,
  },
  {
    id: 'night_vision',
    name: 'Potion of Night Vision',
    base: 'Awkward Potion',
    ingredient: 'Golden Carrot',
    effect: 'Makes dark areas and underwater appear at full brightness',
    duration: '3:00',
    extended: {
      ingredient: 'Redstone Dust',
      duration: '8:00',
    },
    splash: true,
  },
  {
    id: 'invisibility',
    name: 'Potion of Invisibility',
    base: 'Potion of Night Vision',
    ingredient: 'Fermented Spider Eye',
    effect: 'Renders the player model invisible to mobs and players',
    duration: '3:00',
    extended: {
      ingredient: 'Redstone Dust',
      duration: '8:00',
    },
    splash: true,
  },
  {
    id: 'slow_falling',
    name: 'Potion of Slow Falling',
    base: 'Awkward Potion',
    ingredient: 'Phantom Membrane',
    effect: 'Glide down gently; prevents 100% of fall damage',
    duration: '1:30',
    extended: {
      ingredient: 'Redstone Dust',
      duration: '4:00',
    },
    splash: true,
  },
];

export const MOBS: MobItem[] = [
  {
    id: 'warden',
    name: 'The Warden',
    category: 'Hostile',
    hp: 500,
    damage: '30 (Melee) / 10 (Sonic Boom through shields)',
    spawns: 'Deep Dark / Ancient City when Sculk Shriekers trigger 4 times',
    drops: [{ item: 'Sculk Catalyst', chance: '100%' }],
    behavior: 'Completely blind. Senses vibrations and smells players. Enters rage mode if triggered repeatedly.',
    tips: 'Do not fight head-on. Sneak on wool, throw snowballs or arrows away from yourself to distract it.',
  },
  {
    id: 'breeze',
    name: 'Breeze',
    category: 'Hostile',
    hp: 30,
    damage: 'Wind projectile burst',
    spawns: 'Trial Chambers from Trial Spawners',
    drops: [{ item: 'Breeze Rod', chance: '100% (1-2)' }],
    behavior: 'Bounces aggressively around rooms, deflecting projectiles with wind currents and firing wind charges.',
    tips: 'Arrows and tridents are deflected. Use melee weapons or hit its own wind charges back at it!',
  },
  {
    id: 'creeper',
    name: 'Creeper',
    category: 'Hostile',
    hp: 20,
    damage: 'Up to 49 (Explosion at point blank)',
    spawns: 'Overworld light level 0',
    drops: [
      { item: 'Gunpowder', chance: '100% (0-2)' },
      { item: 'Music Disc', chance: 'When killed by a Skeleton' },
      { item: 'Mob Head', chance: 'When killed by Charged Creeper' },
    ],
    behavior: 'Silently ambushes players and detonates after a 1.5 second hiss.',
    tips: 'Cats and ocelots frighten creepers away. Sprint-hit to knock them out of their explosion fuse radius.',
  },
  {
    id: 'iron_golem',
    name: 'Iron Golem',
    category: 'Neutral',
    hp: 100,
    damage: '7 - 21 (Flings enemies into the air)',
    spawns: 'Villages with panicked villagers or built with 4 Iron Blocks + Carved Pumpkin',
    drops: [
      { item: 'Iron Ingot', chance: '100% (3-5)' },
      { item: 'Poppy', chance: '100% (0-2)' },
    ],
    behavior: 'Protects villagers from zombies and raiders. Attacks players who harm villagers.',
    tips: 'Pillar up 3 blocks to safely farm an Iron Golem without taking melee damage.',
  },
  {
    id: 'ender_dragon',
    name: 'Ender Dragon',
    category: 'Boss',
    hp: 200,
    damage: '10 - 15 + Dragon Breath AoE',
    spawns: 'The End (central island)',
    drops: [
      { item: '12,000 XP (first kill)', chance: '100%' },
      { item: 'Dragon Egg', chance: '100%' },
    ],
    behavior: 'Circles the pillars, healing from End Crystals, before perching on the bedrock fountain.',
    tips: 'Shoot crystals with a bow (use ladders for caged ones). Place explosive beds on the obsidian fountain when it perches for massive burst damage.',
  },
];

export const BLOCKS: BlockItem[] = [
  {
    id: 'heavy_core',
    name: 'Heavy Core',
    hardness: 5.0,
    blastResistance: 1200,
    tool: 'Pickaxe',
    renewable: false,
    transparent: false,
    lightEmission: 0,
    flammable: false,
    notes: 'Exotic trial block obtained with a 2.2% drop rate from Ominous Vaults. Used to craft the Mace.',
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    hardness: 50.0,
    blastResistance: 1200,
    tool: 'Diamond or Netherite Pickaxe',
    renewable: true,
    transparent: false,
    lightEmission: 0,
    flammable: false,
    notes: 'Formed when running water touches a lava source. Immune to TNT explosions and Ender Dragon flight.',
  },
  {
    id: 'ancient_debris',
    name: 'Ancient Debris',
    hardness: 30.0,
    blastResistance: 1200,
    tool: 'Diamond or Netherite Pickaxe',
    renewable: false,
    transparent: false,
    lightEmission: 0,
    flammable: false,
    notes: 'Generates in the Nether between Y=8 and Y=119 (peak at Y=15). Blast-proof, making bed mining effective.',
  },
  {
    id: 'crying_obsidian',
    name: 'Crying Obsidian',
    hardness: 50.0,
    blastResistance: 1200,
    tool: 'Diamond Pickaxe',
    renewable: true,
    transparent: false,
    lightEmission: 10,
    flammable: false,
    notes: 'Obtained via Piglin bartering or ruined portals. Required to craft a Respawn Anchor for the Nether.',
  },
  {
    id: 'crafter',
    name: 'Crafter',
    hardness: 1.5,
    blastResistance: 3.5,
    tool: 'Pickaxe',
    renewable: true,
    transparent: false,
    lightEmission: 0,
    flammable: false,
    notes: 'Redstone block that automatically crafts items based on grid configuration and input signal.',
  },
];

export const REDSTONE_GUIDES: RedstoneGuide[] = [
  {
    id: 'hopper_clock',
    title: 'Hopper Clock (Etho Clock)',
    category: 'Clocks',
    difficulty: 'Beginner',
    components: ['2 Hoppers', '2 Redstone Comparators', '2 Redstone Repeaters', '2 Sticky Pistons', '1 Redstone Block', 'Filler items'],
    description: 'The golden standard long-period redstone clock. Time is precisely determined by the number of items placed inside.',
    steps: [
      'Place two hoppers facing into each other so items bounce back and forth.',
      'Place a comparator reading each hopper facing outward.',
      'Place a solid block in front of each comparator, with redstone dust on top or a repeater.',
      'Place sticky pistons facing inwards towards a shared space holding a Redstone Block.',
      'Put N items in one hopper (e.g., 64 items = ~51.2 seconds full cycle).',
    ],
    proTip: 'Each item transfers in 0.4 seconds (4 redstone ticks). 1 stack of items = 25.6 seconds per direction.',
  },
  {
    id: 't_flip_flop',
    title: 'T-Flip-Flop (Toggle Switch)',
    category: 'Memory & Latches',
    difficulty: 'Beginner',
    components: ['1 Dropper', '1 Hopper', '1 Comparator', '1 Button', '1 item'],
    description: 'Converts a momentary pulse (button press) into a persistent ON/OFF state (like a light switch).',
    steps: [
      'Place a dropper facing upward with a hopper on top facing back down into the dropper.',
      'Place a comparator outputting from the hopper.',
      'Place a single junk item inside the dropper.',
      'Attach a button to the dropper. When pressed, the item shoots up and toggles the comparator.',
    ],
    proTip: 'In Java edition, a sticky piston with a 1-tick pulse will drop or retract its block without pulling it back!',
  },
  {
    id: 'item_sorter',
    title: 'ImpulseSV Standard Item Sorter',
    category: 'Storage & Sorting',
    difficulty: 'Intermediate',
    components: ['Hoppers', 'Redstone Comparator', 'Redstone Repeaters', 'Redstone Dust', 'Redstone Torch', 'Chests', 'Named Filter Items'],
    description: 'The industry-standard overflow-proof item filtration system used in massive storage rooms.',
    steps: [
      'Create double chests with hoppers pointing into the back of each chest.',
      'Place a second row of filter hoppers above, pointing horizontally AWAY from the chests towards a solid block.',
      'On top of the filter hoppers, run an item transport water stream or hopper line.',
      'In each filter hopper: put 41 of the desired sorting item in slot 1, and 4 renamed filler items in slots 2-5.',
      'Place a comparator behind the filter hopper running over a 3-long redstone wire into a repeater powering a redstone torch below.',
    ],
    proTip: 'Always use renamed items (e.g. "Filler #1") for the 4 placeholder slots so rogue items never corrupt the sorter.',
  },
  {
    id: 'flying_machine',
    title: 'Two-Way Flying Machine',
    category: 'Contraptions',
    difficulty: 'Advanced',
    components: ['2 Observers', '2 Sticky Pistons', '4 Slime Blocks or Honey Blocks'],
    description: 'A self-propelling redstone engine used for world-eaters, automatic sugarcane farms, and sky bridges.',
    steps: [
      'Place a sticky piston facing forward with two slime blocks in front.',
      'Attach an observer on the side facing outward to power the piston when updated.',
      'Build the mirrored engine facing backwards on the opposite side.',
      'Start the machine by updating either observer with a flint and steel or trapdoor.',
    ],
    proTip: 'Do not mix slime blocks and honey blocks if you want adjacent rows to slide past each other without sticking.',
  },
];

export const SEEDS: SeedItem[] = [
  {
    id: 'seed-ancient-city',
    seed: '-1058557249',
    title: 'Triple Ancient City & Trial Chamber Mega-Cave',
    edition: 'Java & Bedrock',
    version: '1.21.x',
    description: 'Spawn in a lush cherry grove mountain with a massive open hollow cave below containing 3 Ancient Cities and a Trial Chamber at Y=-30.',
    highlights: [
      { name: 'Spawn Cherry Grove', coords: 'X: 0, Z: 0' },
      { name: 'Trial Chamber Entrance', coords: 'X: 120, Y: -20, Z: -150' },
      { name: 'Ancient City #1', coords: 'X: -240, Y: -51, Z: 80' },
      { name: 'Ancient City #2', coords: 'X: 180, Y: -51, Z: 320' },
    ],
  },
  {
    id: 'seed-island-mansion',
    seed: '73920194821',
    title: 'Survival Island with Woodland Mansion & Village',
    edition: 'Java & Bedrock',
    version: '1.21.x',
    description: 'Spawn on an isolated ocean island with a Woodland Mansion dominating the center and an oceanic village on the coast.',
    highlights: [
      { name: 'Island Center', coords: 'X: 40, Z: 110' },
      { name: 'Woodland Mansion', coords: 'X: 88, Y: 68, Z: 144' },
      { name: 'Ocean Monument', coords: 'X: -300, Y: 62, Z: 240' },
    ],
  },
  {
    id: 'seed-badlands-fortress',
    seed: '883910248201',
    title: 'Exposed Mineshaft Badlands & Exposed Stronghold',
    edition: 'Java',
    version: '1.21.x',
    description: 'Surface mineshaft with thousands of exposed gold ores in an eroded badlands, plus an underwater stronghold with exposed portal room.',
    highlights: [
      { name: 'Badlands Spawn', coords: 'X: 12, Z: 45' },
      { name: 'Exposed Stronghold Portal', coords: 'X: 1240, Y: 38, Z: -890' },
      { name: 'Warm Ocean Coral Reef', coords: 'X: -180, Z: 520' },
    ],
  },
];

export const BUILDING_IDEAS: BuildingIdea[] = [
  {
    id: 'build-medieval-blacksmith',
    title: 'Medieval Blacksmith & Armory',
    theme: 'Medieval',
    difficulty: 'Medium',
    palette: ['Deepslate Tiles', 'Stone Bricks', 'Dark Oak Wood', 'Spruce Planks', 'Lava Source', 'Anvil', 'Chain'],
    dimensions: '18 x 14 x 10 blocks',
    summary: 'A rugged forge with a smoking chimney, water wheel, outdoor smelting kiln, and weapon displays.',
    features: [
      'Campfire chimney with hay bale underneath for high smoke columns',
      'Water trough cooling station using cauldron and water',
      'Exposed timber frame walls using stripped spruce logs and spruce trapdoors',
      'Grindstone and weapon rack armor stands with iron armor',
    ],
    stepByStep: [
      'Lay a 14x18 foundation using Cobblestone and Stone Bricks with cracked variants.',
      'Erect 4-block high corner pillars of Stripped Spruce Logs.',
      'Build the forge area in the back corner using Deepslate and Lava behind Iron Bars.',
      'Construct an A-frame roof using Dark Oak stairs with a 1-block overhang.',
      'Add depth with lanterns suspended on chains, flower pots, and tool racks.',
    ],
  },
  {
    id: 'build-cyberpunk-nether-hub',
    title: 'Cyberpunk Nether Transit Hub',
    theme: 'Cyberpunk',
    difficulty: 'Hard',
    palette: ['Black Concrete', 'Sea Lantern', 'Magenta Stained Glass', 'Cyan Stained Glass', 'Smooth Basalt', 'Copper Grate'],
    dimensions: '30 x 30 x 15 blocks',
    summary: 'A futuristic transport station featuring neon light piping, glass floor void, and ice boat tunnels.',
    features: [
      'Glowing neon lines embedded in black concrete walls using colored glass over sea lanterns',
      'Blue Ice highway channels with slime block bounce pads',
      'High-tech holographic directory using glowing text on dark oak hanging signs',
      'Piston blast doors for portal protection',
    ],
    stepByStep: [
      'Excavate a 30x30 Nether cave and line walls with Black Concrete and Polished Blackstone.',
      'Carve 3-wide raceways along the 4 cardinal directions for Blue Ice tracks.',
      'Inlay Sea Lanterns covered by Magenta and Light Blue stained glass for neon piping.',
      'Suspend the central Nether Portal in mid-air using end rods and iron chains.',
      'Add copper bulb indicators and observer heartbeat pulse lights along the corridors.',
    ],
  },
  {
    id: 'build-fantasy-wizard-tower',
    title: 'Floating Fantasy Wizard Spire',
    theme: 'Fantasy',
    difficulty: 'Hard',
    palette: ['Deepslate Tiles', 'Amethyst Block', 'Warped Stem', 'Purpur Block', 'End Rod', 'Tinted Glass'],
    dimensions: '12 x 12 x 45 blocks',
    summary: 'A spiraling spire floating on an inverted rock island with arcane crystal rings and an observatory.',
    features: [
      'Amethyst crystal clusters emitting chime sounds when walked on',
      'Spiral external staircase wrapped around the tower exterior',
      'Telescope observatory dome made of tinted glass on top floor',
      'Enchanting chamber with 15 floating chiseled bookshelves',
    ],
    stepByStep: [
      'Design an organic floating island base using End Stone and Sculk.',
      'Build a tapering circular tower from radius 6 at the bottom to radius 4 at top.',
      'Wrap the exterior with Warped Wood staircases and Amethyst block rings.',
      'Crown the spire with a sharp Gothic cone roof using Purpur stairs.',
      'Decorate interior with brewing stations, potion cauldrons, and lightning rods.',
    ],
  },
];

export const MINECRAFT_NEWS = [
  {
    id: 'news-1',
    date: 'Minecraft 1.21.4',
    tag: 'Release',
    title: 'Bundles of Bravery & Resin Blocks Update',
    summary: 'Bundles are officially here across all platforms! Introduces the Pale Garden biome, Creaking mob, and Resin block crafting recipes.',
  },
  {
    id: 'news-2',
    date: 'Trial Chambers',
    tag: 'Feature',
    title: 'Mace Mastery & Ominous Trials Guide',
    summary: 'The Mace scales damage infinitely when falling. Drink an Ominous Bottle to trigger high-tier trial spawners for Heavy Core drops.',
  },
  {
    id: 'news-3',
    date: 'Modding & Scripting',
    tag: 'Tech',
    title: 'Java 21 & Script API v1.14 Updates',
    summary: 'Modern Minecraft runs exclusively on Java 21. Bedrock Script API brings complete entity, block, and world event subscriptions.',
  },
];

export const MINECRAFT_TIPS = [
  'Fall damage can be 100% prevented by placing a bucket of water, twisting vine, cobweb, boat, or using a Wind Charge right before impact.',
  'Crouching while mining prevents you from walking off block edges or falling into hidden lava pits.',
  'Piglins in the Nether will never turn hostile if you wear at least one piece of golden armor (gold boots are the cheapest).',
  'Villagers can be cured from Zombie Villagers with a Splash Potion of Weakness followed by a Golden Apple, giving massive permanent trading discounts.',
  'Netherite gear never burns in lava or fire—if you die in the Nether, your Netherite items float safely on the lava surface.',
  'Soul Speed III boots on Soul Sand with a Speed II beacon lets you sprint faster than an Elytra flight in enclosed tunnels.',
];
