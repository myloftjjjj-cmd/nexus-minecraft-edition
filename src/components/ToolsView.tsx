import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  FlaskConical,
  Terminal,
  Compass,
  Users,
  Box,
  Sword,
  Zap,
  Hammer,
  Search,
  Copy,
  Check,
  Bookmark,
  ExternalLink,
  ChevronRight,
  Shield,
  Calculator,
  RefreshCw,
  Shuffle,
  Info,
} from 'lucide-react';
import {
  CRAFTING_RECIPES,
  ENCHANTMENTS,
  POTIONS,
  MOBS,
  BLOCKS,
  REDSTONE_GUIDES,
  SEEDS,
  BUILDING_IDEAS,
} from '../data/minecraftData';

interface ToolsViewProps {
  initialTool?: string;
  onAskNexus: (prompt: string) => void;
  favorites: string[];
  onToggleFavorite: (item: string) => void;
}

export const ToolsView: React.FC<ToolsViewProps> = ({
  initialTool = 'crafting',
  onAskNexus,
  favorites,
  onToggleFavorite,
}) => {
  const [activeTab, setActiveTab] = useState(initialTool);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Command Generator State
  const [cmdType, setCmdType] = useState<'give' | 'summon' | 'fill' | 'locate' | 'effect'>('give');
  const [cmdItem, setCmdItem] = useState('diamond_sword');
  const [cmdAmount, setCmdAmount] = useState(1);
  const [cmdCustomName, setCmdCustomName] = useState('Excalibur');
  const [cmdUnbreakable, setCmdUnbreakable] = useState(true);
  const [cmdEnchantment, setCmdEnchantment] = useState('sharpness:5,unbreaking:3');
  const [cmdMob, setCmdMob] = useState('zombie');
  const [cmdNoAi, setCmdNoAi] = useState(false);
  const [cmdGlowing, setCmdGlowing] = useState(true);
  const [cmdStructure, setCmdStructure] = useState('trial_chambers');
  const [cmdVersion, setCmdVersion] = useState<'1.21' | 'legacy'>('1.21');

  // Nether Calculator State
  const [calcX, setCalcX] = useState<number>(800);
  const [calcZ, setCalcZ] = useState<number>(-1200);
  const [calcMode, setCalcMode] = useState<'overworld_to_nether' | 'nether_to_overworld'>('overworld_to_nether');

  // Building generator state
  const [activeTheme, setActiveTheme] = useState<string>('All');
  const [selectedBuild, setSelectedBuild] = useState(BUILDING_IDEAS[0]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const tabs = [
    { id: 'crafting', label: 'Crafting', icon: Layers },
    { id: 'enchantments', label: 'Enchantments', icon: Sparkles },
    { id: 'potions', label: 'Potions', icon: FlaskConical },
    { id: 'commands', label: 'Commands', icon: Terminal },
    { id: 'seeds', label: 'Seeds & Calc', icon: Compass },
    { id: 'mobs', label: 'Mobs', icon: Users },
    { id: 'blocks', label: 'Blocks', icon: Box },
    { id: 'gear', label: 'Weapons & Armor', icon: Sword },
    { id: 'redstone', label: 'Redstone Lab', icon: Zap },
    { id: 'building', label: 'Building Ideas', icon: Hammer },
  ];

  // Helper to generate command string
  const generateCommand = () => {
    if (cmdType === 'give') {
      if (cmdVersion === '1.21') {
        const components: string[] = [];
        if (cmdCustomName) {
          components.push(`minecraft:custom_name='"${cmdCustomName}"'`);
        }
        if (cmdUnbreakable) {
          components.push('minecraft:unbreakable={}');
        }
        if (cmdEnchantment) {
          const enchParts = cmdEnchantment.split(',').map((e) => {
            const [name, lvl] = e.trim().split(':');
            return `'minecraft:${name}':${lvl || 1}`;
          });
          components.push(`minecraft:enchantments={levels:{${enchParts.join(',')}}}`);
        }
        const compStr = components.length > 0 ? `[${components.join(',')}]` : '';
        return `/give @p minecraft:${cmdItem}${compStr} ${cmdAmount}`;
      } else {
        const nbt: string[] = [];
        if (cmdUnbreakable) nbt.push('Unbreakable:1b');
        if (cmdCustomName) nbt.push(`display:{Name:'{"text":"${cmdCustomName}"}'}`);
        const nbtStr = nbt.length > 0 ? `{${nbt.join(',')}}` : '';
        return `/give @p minecraft:${cmdItem}${nbtStr} ${cmdAmount}`;
      }
    }
    if (cmdType === 'summon') {
      const tags: string[] = [];
      if (cmdNoAi) tags.push('NoAI:1b');
      if (cmdGlowing) tags.push('Glowing:1b');
      if (cmdCustomName) tags.push(`CustomName:'{"text":"${cmdCustomName}"}',CustomNameVisible:1b`);
      const tagStr = tags.length > 0 ? `{${tags.join(',')}}` : '';
      return `/summon minecraft:${cmdMob} ~ ~ ~ ${tagStr}`;
    }
    if (cmdType === 'fill') {
      return `/fill ~-5 ~-1 ~-5 ~5 ~3 ~5 minecraft:glass outline`;
    }
    if (cmdType === 'locate') {
      return `/locate structure minecraft:${cmdStructure}`;
    }
    if (cmdType === 'effect') {
      return `/effect give @p minecraft:night_vision 99999 0 true`;
    }
    return '';
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Tool Navigation Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                active
                  ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-[#141b26] text-gray-300 hover:text-white hover:bg-[#1e2736] border border-[#232e3f]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TOOL 1: CRAFTING GUIDE */}
      {activeTab === 'crafting' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipe: Diamond Sword, Crafter, Mace, Piston..."
                className="w-full bg-[#121824] border border-[#232d3d] text-white text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CRAFTING_RECIPES.filter((r) =>
              r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              r.category.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((recipe) => (
              <div
                key={recipe.name}
                className="rounded-2xl bg-[#121824] border border-[#232d3d] p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-colors shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
                      {recipe.category}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      {recipe.shaped ? 'Shaped 3x3' : 'Shapeless'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{recipe.name}</h3>
                  <p className="text-xs text-gray-300 mt-1 mb-4">{recipe.description}</p>

                  {/* 3x3 Grid Visualizer */}
                  <div className="w-44 h-44 mx-auto p-2 rounded-xl bg-[#090d14] border-2 border-[#2b394f] grid grid-cols-3 gap-1 shadow-inner">
                    {recipe.grid.map((slot, i) => (
                      <div
                        key={i}
                        className={`rounded-lg border flex items-center justify-center text-center p-1 text-[10px] font-mono leading-tight ${
                          slot
                            ? 'bg-[#1a2536] border-emerald-500/40 text-emerald-300 font-semibold'
                            : 'bg-[#0e141e] border-white/5 text-transparent'
                        }`}
                        title={slot || 'Empty slot'}
                      >
                        {slot || ''}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#1e2736] flex items-center justify-between">
                  <div className="text-xs text-gray-400">
                    Result: <span className="font-bold text-white">{recipe.result}</span> (x{recipe.count})
                  </div>
                  <button
                    onClick={() => onAskNexus(`How do I craft ${recipe.name} in Minecraft 1.21?`)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                  >
                    <span>Ask Nexus</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOOL 2: ENCHANTMENTS GUIDE */}
      {activeTab === 'enchantments' && (
        <div className="space-y-6">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search enchantments: Mending, Sharpness, Wind Burst, Fortune..."
              className="w-full bg-[#121824] border border-[#232d3d] text-white text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ENCHANTMENTS.filter((e) =>
              e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              e.targets.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
            ).map((ench) => (
              <div
                key={ench.id}
                className="p-5 rounded-2xl bg-[#121824] border border-[#232d3d] hover:border-purple-500/40 transition-colors shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <h3 className="text-base font-bold text-white">{ench.name}</h3>
                    <span className="text-xs font-mono font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950/60">
                      Max {ench.maxLevel}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">{ench.weight}</span>
                </div>

                <p className="text-xs text-gray-200 leading-relaxed">{ench.description}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-gray-400">Applies to:</span>
                  {ench.targets.map((target) => (
                    <span key={target} className="text-[10px] px-2 py-0.5 rounded bg-[#1c2738] text-gray-300 font-medium">
                      {target}
                    </span>
                  ))}
                </div>

                {ench.conflicts.length > 0 && (
                  <div className="text-[11px] text-amber-300/80 bg-amber-950/20 border border-amber-500/20 p-2 rounded-lg">
                    ⚠️ Incompatible with: {ench.conflicts.join(', ')}
                  </div>
                )}

                <div className="text-xs text-emerald-300/80 bg-emerald-950/20 p-2 rounded-lg border border-emerald-500/20">
                  💡 <strong>Pro-Tip:</strong> {ench.tips}
                </div>

                <button
                  onClick={() => handleCopy(`/enchant @p minecraft:${ench.id} ${ench.maxLevel}`)}
                  className="w-full py-1.5 px-3 rounded-lg bg-[#182333] hover:bg-[#202e42] text-xs text-gray-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedText?.includes(ench.id) ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied Command!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Enchant Command</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOOL 3: POTION BREWING GUIDE */}
      {activeTab === 'potions' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-teal-950/20 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-emerald-400" />
                <span>Brewing Stand Recipe Visualizer</span>
              </h3>
              <p className="text-xs text-gray-300 mt-0.5">
                Always start with Water Bottle + Nether Wart = <strong>Awkward Potion</strong>!
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400">Blaze Powder Fuel Required</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {POTIONS.map((pot) => (
              <div
                key={pot.id}
                className="p-5 rounded-2xl bg-[#121824] border border-[#232d3d] hover:border-emerald-500/40 transition-colors shadow-lg space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{pot.name}</h4>
                    <span className="text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60">
                      {pot.duration}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-300/90 font-medium mt-1">{pot.effect}</p>

                  <div className="mt-3 p-3 rounded-xl bg-[#090e17] border border-[#1b2536] space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-300">
                      <span className="text-gray-400">Base:</span>
                      <span className="font-semibold text-white">{pot.base}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span className="text-gray-400">+ Ingredient:</span>
                      <span className="font-semibold text-emerald-400">{pot.ingredient}</span>
                    </div>
                  </div>

                  {/* Modifiers */}
                  <div className="mt-2.5 space-y-1 text-[11px]">
                    {pot.enhanced && (
                      <div className="text-gray-300 flex justify-between bg-[#151e2c] p-1.5 rounded">
                        <span>+ Glowstone (Tier II):</span>
                        <span className="text-amber-400 font-mono">{pot.enhanced.duration}</span>
                      </div>
                    )}
                    {pot.extended && (
                      <div className="text-gray-300 flex justify-between bg-[#151e2c] p-1.5 rounded">
                        <span>+ Redstone (Longer):</span>
                        <span className="text-red-400 font-mono">{pot.extended.duration}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onAskNexus(`How do I make ${pot.name} in Minecraft including splash and lingering versions?`)}
                  className="w-full py-1.5 text-xs text-center text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  View Full Brewing Tree →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOOL 4: MINECRAFT COMMAND GENERATOR */}
      {activeTab === 'commands' && (
        <div className="p-6 rounded-2xl bg-[#121824] border border-[#232d3d] space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                <span>Command Generator (Minecraft 1.21+)</span>
              </h3>
              <p className="text-xs text-gray-400">Supports modern 1.21 component syntax & legacy NBT</p>
            </div>

            <div className="flex items-center gap-2 bg-[#090d14] p-1 rounded-xl border border-[#202c3d]">
              <button
                onClick={() => setCmdVersion('1.21')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  cmdVersion === '1.21' ? 'bg-emerald-500 text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                1.21 Components
              </button>
              <button
                onClick={() => setCmdVersion('legacy')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  cmdVersion === 'legacy' ? 'bg-emerald-500 text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                Legacy NBT
              </button>
            </div>
          </div>

          {/* Command Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {([
              { id: 'give', label: '/give (Custom Items)' },
              { id: 'summon', label: '/summon (Mobs)' },
              { id: 'fill', label: '/fill (Blocks)' },
              { id: 'locate', label: '/locate (Structures)' },
              { id: 'effect', label: '/effect (Buffs)' },
            ] as const).map((c) => (
              <button
                key={c.id}
                onClick={() => setCmdType(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  cmdType === c.id ? 'bg-[#1e2a3c] text-emerald-400 border border-emerald-500/40' : 'text-gray-400 hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Builder Options Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            {cmdType === 'give' && (
              <>
                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">Item ID</label>
                  <input
                    type="text"
                    value={cmdItem}
                    onChange={(e) => setCmdItem(e.target.value)}
                    className="w-full bg-[#0b0f17] border border-[#232d3d] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">Custom Name</label>
                  <input
                    type="text"
                    value={cmdCustomName}
                    onChange={(e) => setCmdCustomName(e.target.value)}
                    className="w-full bg-[#0b0f17] border border-[#232d3d] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">Enchantments (name:lvl)</label>
                  <input
                    type="text"
                    value={cmdEnchantment}
                    onChange={(e) => setCmdEnchantment(e.target.value)}
                    placeholder="sharpness:5,looting:3"
                    className="w-full bg-[#0b0f17] border border-[#232d3d] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="unbreak"
                    checked={cmdUnbreakable}
                    onChange={(e) => setCmdUnbreakable(e.target.checked)}
                    className="accent-emerald-500 w-4 h-4"
                  />
                  <label htmlFor="unbreak" className="text-xs text-gray-200">Unbreakable</label>
                </div>
              </>
            )}

            {cmdType === 'summon' && (
              <>
                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">Mob Type</label>
                  <input
                    type="text"
                    value={cmdMob}
                    onChange={(e) => setCmdMob(e.target.value)}
                    className="w-full bg-[#0b0f17] border border-[#232d3d] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">Custom Name Tag</label>
                  <input
                    type="text"
                    value={cmdCustomName}
                    onChange={(e) => setCmdCustomName(e.target.value)}
                    className="w-full bg-[#0b0f17] border border-[#232d3d] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <label className="flex items-center gap-1.5 text-xs text-gray-200">
                    <input
                      type="checkbox"
                      checked={cmdNoAi}
                      onChange={(e) => setCmdNoAi(e.target.checked)}
                      className="accent-emerald-500"
                    />
                    <span>NoAI (Statue)</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-gray-200">
                    <input
                      type="checkbox"
                      checked={cmdGlowing}
                      onChange={(e) => setCmdGlowing(e.target.checked)}
                      className="accent-emerald-500"
                    />
                    <span>Glowing Outline</span>
                  </label>
                </div>
              </>
            )}

            {cmdType === 'locate' && (
              <div>
                <label className="text-xs text-gray-300 font-semibold block mb-1">Structure</label>
                <select
                  value={cmdStructure}
                  onChange={(e) => setCmdStructure(e.target.value)}
                  className="w-full bg-[#0b0f17] border border-[#232d3d] rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="trial_chambers">Trial Chambers (1.21)</option>
                  <option value="ancient_city">Ancient City (Deep Dark)</option>
                  <option value="woodland_mansion">Woodland Mansion</option>
                  <option value="fortress">Nether Fortress</option>
                  <option value="monument">Ocean Monument</option>
                  <option value="village_plains">Plains Village</option>
                </select>
              </div>
            )}
          </div>

          {/* Generated Code Output Box */}
          <div className="rounded-xl overflow-hidden border border-emerald-500/40 bg-[#080c13]">
            <div className="px-4 py-2 bg-[#101724] border-b border-[#1f2b3e] flex items-center justify-between text-xs text-emerald-400">
              <span className="font-mono font-bold">READY TO EXECUTE IN-GAME</span>
              <button
                onClick={() => handleCopy(generateCommand())}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors"
              >
                {copiedText === generateCommand() ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedText === generateCommand() ? 'Copied!' : 'Copy Command'}</span>
              </button>
            </div>
            <pre className="p-4 text-xs md:text-sm font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap break-all">
              {generateCommand()}
            </pre>
          </div>
        </div>
      )}

      {/* TOOL 5: SEEDS & NETHER COORDINATE CALCULATOR */}
      {activeTab === 'seeds' && (
        <div className="space-y-6">
          {/* Nether 8:1 Calculator */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#121824] to-[#121824] border border-red-500/30 shadow-lg space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-red-400" />
              <h3 className="text-base font-bold text-white">Nether Portal 8:1 Coordinate Linker</h3>
            </div>
            <p className="text-xs text-gray-300">
              Minecraft Nether coordinates are exactly 1/8th of Overworld coordinates. Perfectly link your portals!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-xs text-gray-300 block mb-1">Direction</label>
                <select
                  value={calcMode}
                  onChange={(e) => setCalcMode(e.target.value as 'overworld_to_nether' | 'nether_to_overworld')}
                  className="w-full bg-[#0b0f17] border border-[#232d3d] rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="overworld_to_nether">Overworld → Nether (Divide by 8)</option>
                  <option value="nether_to_overworld">Nether → Overworld (Multiply by 8)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">X Coordinate</label>
                <input
                  type="number"
                  value={calcX}
                  onChange={(e) => setCalcX(Number(e.target.value))}
                  className="w-full bg-[#0b0f17] border border-[#232d3d] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">Z Coordinate</label>
                <input
                  type="number"
                  value={calcZ}
                  onChange={(e) => setCalcZ(Number(e.target.value))}
                  className="w-full bg-[#0b0f17] border border-[#232d3d] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#090d14] border border-[#232f42] flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400">Target Linked Coordinates:</span>
                <div className="text-base md:text-lg font-mono font-bold text-emerald-400">
                  X: {calcMode === 'overworld_to_nether' ? Math.floor(calcX / 8) : calcX * 8} , Z:{' '}
                  {calcMode === 'overworld_to_nether' ? Math.floor(calcZ / 8) : calcZ * 8}
                </div>
              </div>
              <button
                onClick={() =>
                  handleCopy(
                    `X: ${calcMode === 'overworld_to_nether' ? Math.floor(calcX / 8) : calcX * 8}, Z: ${
                      calcMode === 'overworld_to_nether' ? Math.floor(calcZ / 8) : calcZ * 8
                    }`
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-[#182333] hover:bg-[#202e42] text-xs text-gray-200 transition-colors flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Coords</span>
              </button>
            </div>
          </div>

          {/* Curated Seeds List */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white">Curated 1.21 World Seeds</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SEEDS.map((s) => (
                <div key={s.id} className="p-5 rounded-2xl bg-[#121824] border border-[#232d3d] space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      {s.edition}
                    </span>
                    <span className="text-xs font-mono text-gray-400">{s.version}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{s.title}</h4>
                  <p className="text-xs text-gray-300 line-clamp-2">{s.description}</p>

                  <div className="space-y-1 text-xs font-mono bg-[#090d14] p-2.5 rounded-xl border border-[#1b2536]">
                    {s.highlights.map((h, i) => (
                      <div key={i} className="flex justify-between text-gray-400">
                        <span>{h.name}:</span>
                        <span className="text-emerald-400 font-semibold">{h.coords}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleCopy(s.seed)}
                    className="w-full py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Seed: {s.seed}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TOOL 6: MOB ENCYCLOPEDIA */}
      {activeTab === 'mobs' && (
        <div className="space-y-6">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mobs: Warden, Breeze, Creeper, Ender Dragon, Iron Golem..."
              className="w-full bg-[#121824] border border-[#232d3d] text-white text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOBS.filter((m) =>
              m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              m.category.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((mob) => (
              <div key={mob.id} className="p-5 rounded-2xl bg-[#121824] border border-[#232d3d] shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{mob.name}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        mob.category === 'Hostile' || mob.category === 'Boss'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {mob.category}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-red-400">❤️ {mob.hp} HP</span>
                </div>

                <p className="text-xs text-gray-200">{mob.behavior}</p>

                <div className="p-3 rounded-xl bg-[#090d14] border border-[#1b2536] space-y-1 text-xs">
                  <div className="text-gray-400">
                    <strong>Spawns:</strong> {mob.spawns}
                  </div>
                  <div className="text-gray-400">
                    <strong>Attack Damage:</strong> {mob.damage}
                  </div>
                  <div className="text-emerald-400">
                    <strong>Drops:</strong> {mob.drops.map((d) => `${d.item} (${d.chance})`).join(', ')}
                  </div>
                </div>

                <div className="text-xs text-amber-300/80 bg-amber-950/20 p-2.5 rounded-lg border border-amber-500/20">
                  ⚔️ <strong>Combat Tip:</strong> {mob.tips}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOOL 7: BLOCK ENCYCLOPEDIA */}
      {activeTab === 'blocks' && (
        <div className="space-y-6">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blocks: Heavy Core, Obsidian, Ancient Debris, Crafter..."
              className="w-full bg-[#121824] border border-[#232d3d] text-white text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BLOCKS.filter((b) =>
              b.name.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((block) => (
              <div key={block.id} className="p-5 rounded-2xl bg-[#121824] border border-[#232d3d] shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{block.name}</h4>
                  <span className="text-xs font-mono text-emerald-400">Hardness: {block.hardness}</span>
                </div>
                <p className="text-xs text-gray-300">{block.notes}</p>

                <div className="p-2.5 rounded-xl bg-[#090d14] border border-[#1b2536] space-y-1 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>Blast Resistance:</span>
                    <span className="font-semibold text-white">{block.blastResistance}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Harvest Tool:</span>
                    <span className="font-semibold text-emerald-400">{block.tool}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Renewable:</span>
                    <span className="font-semibold text-white">{block.renewable ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOOL 8: WEAPONS & ARMOR COMPARISON */}
      {activeTab === 'gear' && (
        <div className="p-6 rounded-2xl bg-[#121824] border border-[#232d3d] space-y-6 shadow-xl">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sword className="w-5 h-5 text-emerald-400" />
              <span>Weapons & Armor Comparison (1.21 Meta)</span>
            </h3>
            <p className="text-xs text-gray-400">Damage formulas, Mace scaling, and Netherite toughness math</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b0f17] text-gray-400 font-mono uppercase border-b border-[#232d3d]">
                <tr>
                  <th className="p-3">Gear Type</th>
                  <th className="p-3">Base Damage / Armor</th>
                  <th className="p-3">Attack Speed</th>
                  <th className="p-3">Durability</th>
                  <th className="p-3">Special Mechanics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2736] text-gray-200">
                <tr className="hover:bg-[#16202e]">
                  <td className="p-3 font-bold text-amber-400">Mace (1.21)</td>
                  <td className="p-3">6.0 + 3.0/block fallen (Infinite)</td>
                  <td className="p-3">0.6</td>
                  <td className="p-3">500</td>
                  <td className="p-3 text-emerald-300">Wind Burst + Density chains; negates fall damage on hit!</td>
                </tr>
                <tr className="hover:bg-[#16202e]">
                  <td className="p-3 font-bold text-purple-400">Netherite Sword</td>
                  <td className="p-3">8.0 (4 Hearts)</td>
                  <td className="p-3">1.6</td>
                  <td className="p-3">2031</td>
                  <td className="p-3">Floats on lava; highest general DPS.</td>
                </tr>
                <tr className="hover:bg-[#16202e]">
                  <td className="p-3 font-bold text-cyan-400">Diamond Sword</td>
                  <td className="p-3">7.0 (3.5 Hearts)</td>
                  <td className="p-3">1.6</td>
                  <td className="p-3">1561</td>
                  <td className="p-3">Core survival staple.</td>
                </tr>
                <tr className="hover:bg-[#16202e]">
                  <td className="p-3 font-bold text-blue-400">Trident</td>
                  <td className="p-3">9.0 (Melee) / 8.0 (Thrown)</td>
                  <td className="p-3">1.1</td>
                  <td className="p-3">250</td>
                  <td className="p-3">Riptide launch in rain / Channeling lightning.</td>
                </tr>
                <tr className="hover:bg-[#16202e]">
                  <td className="p-3 font-bold text-emerald-400">Netherite Armor Set</td>
                  <td className="p-3">20 Armor (+12 Toughness, +4 Knockback Res)</td>
                  <td className="p-3">-</td>
                  <td className="p-3">High</td>
                  <td className="p-3">Lava-proof; prevents player knockback from explosions.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TOOL 9: REDSTONE LEARNING LAB */}
      {activeTab === 'redstone' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {REDSTONE_GUIDES.map((circuit) => (
              <div key={circuit.id} className="p-5 rounded-2xl bg-[#121824] border border-[#232d3d] space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-red-400" />
                    <h3 className="text-base font-bold text-white">{circuit.title}</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300">
                    {circuit.difficulty}
                  </span>
                </div>

                <p className="text-xs text-gray-200">{circuit.description}</p>

                <div className="p-3 rounded-xl bg-[#090d14] border border-[#1b2536] text-xs">
                  <span className="text-gray-400 font-semibold block mb-1">Required Components:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {circuit.components.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[#172233] text-emerald-300 text-[11px]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-gray-300">
                  <span className="text-white font-semibold">Assembly Steps:</span>
                  <ol className="list-decimal pl-4 space-y-1">
                    {circuit.steps.map((step, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-500/20 text-xs text-red-300/90">
                  ⚡ <strong>Pro Tip:</strong> {circuit.proTip}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOOL 10: BUILDING IDEA GENERATOR */}
      {activeTab === 'building' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 rounded-2xl bg-[#121824] border border-[#232d3d]">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Hammer className="w-5 h-5 text-amber-400" />
                <span>Building Idea Generator & Palettes</span>
              </h3>
              <p className="text-xs text-gray-400">Architectural themes, dimensions, block palettes, and steps</p>
            </div>

            <button
              onClick={() => {
                const random = BUILDING_IDEAS[Math.floor(Math.random() * BUILDING_IDEAS.length)];
                setSelectedBuild(random);
              }}
              className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Randomize Idea</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Idea Selection Column */}
            <div className="space-y-3">
              {BUILDING_IDEAS.map((idea) => (
                <button
                  key={idea.id}
                  onClick={() => setSelectedBuild(idea)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedBuild.id === idea.id
                      ? 'bg-[#182333] border-amber-500/50 shadow-md'
                      : 'bg-[#101622] border-[#202b3c] hover:bg-[#16202e]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      {idea.theme}
                    </span>
                    <span className="text-xs text-gray-400">{idea.difficulty}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{idea.title}</h4>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{idea.summary}</p>
                </button>
              ))}
            </div>

            {/* Selected Idea Detail View */}
            <div className="md:col-span-2 p-6 rounded-2xl bg-[#121824] border border-[#232d3d] space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-400">{selectedBuild.theme} Theme</span>
                  <h3 className="text-xl font-bold text-white mt-0.5">{selectedBuild.title}</h3>
                </div>
                <div className="text-xs text-gray-400 font-mono bg-[#090d14] px-3 py-1 rounded-lg border border-[#202b3d]">
                  {selectedBuild.dimensions}
                </div>
              </div>

              <p className="text-sm text-gray-200">{selectedBuild.summary}</p>

              {/* Block Palette */}
              <div>
                <span className="text-xs font-semibold text-gray-400 block mb-2">Block Palette:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedBuild.palette.map((block, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-[#0b0f17] border border-amber-500/25 text-amber-200 text-xs font-medium"
                    >
                      {block}
                    </span>
                  ))}
                </div>
              </div>

              {/* Architectural Features */}
              <div>
                <span className="text-xs font-semibold text-gray-400 block mb-2">Key Features:</span>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  {selectedBuild.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Step by Step Construction */}
              <div className="pt-2 border-t border-[#1e2736]">
                <span className="text-xs font-semibold text-gray-400 block mb-2">Step-by-Step Construction:</span>
                <ol className="list-decimal pl-4 space-y-1.5 text-xs text-gray-200">
                  {selectedBuild.stepByStep.map((s, i) => (
                    <li key={i} className="leading-relaxed">
                      {s}
                    </li>
                  ))}
                </ol>
              </div>

              <button
                onClick={() =>
                  onAskNexus(
                    `Give me a detailed layout plan and block counts for building a ${selectedBuild.title} in Minecraft.`
                  )
                }
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask Nexus to Blueprint This Build</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
