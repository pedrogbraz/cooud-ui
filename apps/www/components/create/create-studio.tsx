"use client";

import { useTheme } from "@cooud/theme";
import type { ThemeOverrides } from "@cooud/tokens";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Separator,
  Slider,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@cooud/ui";
import {
  Check,
  Code2,
  Copy,
  Dices,
  Download,
  Lock,
  LockOpen,
  Moon,
  Palette,
  Radius,
  Save,
  Sparkles,
  Sun,
  Type,
} from "lucide-react";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  BASE_COLORS,
  BRAND_COLORS,
  CHART_PALETTES,
  CUSTOM_STYLE_NAME,
  configFromPreset,
  configToThemeOverrides,
  createSavedPreset,
  DEFAULT_CONFIG,
  FONT_CHOICES,
  findBrandColor,
  findChartPalette,
  findFontChoice,
  makeShuffledConfig,
  markCustom,
  parsePresetCode,
  STYLE_PRESETS,
  serializeCreateCss,
  serializeCreateJson,
  serializeCreateProvider,
  serializePresetCode,
} from "../../lib/create/presets";
import type { DesignConfig, Mode, StylePreset } from "../../lib/create/types";
import { PreviewDashboard } from "./preview-dashboard";

const STORAGE_KEY = "cooud-ui-create-presets-v1";
type CodeTab = "install" | "provider" | "css" | "json";
type PackageManager = "bun" | "pnpm" | "npm" | "yarn";
type LockKey = "mode" | "base" | "brand" | "chart" | "heading" | "body" | "radius";

const codeTabs: { id: CodeTab; label: string }[] = [
  { id: "install", label: "Install" },
  { id: "provider", label: "Provider" },
  { id: "css", label: "CSS vars" },
  { id: "json", label: "Preset JSON" },
];

const installCommands: Record<PackageManager, string> = {
  bun: "bun add @cooud/ui @cooud/theme @cooud/tokens",
  pnpm: "pnpm add @cooud/ui @cooud/theme @cooud/tokens",
  npm: "npm install @cooud/ui @cooud/theme @cooud/tokens",
  yarn: "yarn add @cooud/ui @cooud/theme @cooud/tokens",
};

const defaultLocks: Record<LockKey, boolean> = {
  mode: false,
  base: false,
  brand: false,
  chart: false,
  heading: false,
  body: false,
  radius: false,
};

export function CreateStudio() {
  const { mode: ambientMode, overrides: ambientOverrides, setMode, setOverrides } = useTheme();
  const initialThemeRef = useRef<{ mode: Mode; overrides: ThemeOverrides } | null>(null);
  const [config, setConfig] = useState<DesignConfig>(DEFAULT_CONFIG);
  const [savedPresets, setSavedPresets] = useState<StylePreset[]>([]);
  const [presetName, setPresetName] = useState("");
  const [codeOpen, setCodeOpen] = useState(false);
  const [codeTab, setCodeTab] = useState<CodeTab>("install");
  const [packageManager, setPackageManager] = useState<PackageManager>("bun");
  const [locks, setLocks] = useState<Record<LockKey, boolean>>(defaultLocks);
  const [presetCode, setPresetCode] = useState("");
  const [importError, setImportError] = useState("");
  const [copied, setCopied] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");

  if (initialThemeRef.current === null) {
    initialThemeRef.current = { mode: ambientMode as Mode, overrides: ambientOverrides };
  }

  const allPresets = useMemo(() => [...STYLE_PRESETS, ...savedPresets], [savedPresets]);
  const overrides = useMemo(() => configToThemeOverrides(config), [config]);
  const selectedBrand = findBrandColor(config.brand);
  const selectedChart = findChartPalette(config.chart);
  const currentPreset = useMemo(() => createSavedPreset(config.style, config), [config]);
  const currentPresetCode = useMemo(() => serializePresetCode(currentPreset), [currentPreset]);
  const activeCode = useMemo(() => {
    if (codeTab === "install") return installCommands[packageManager];
    if (codeTab === "provider") return serializeCreateProvider(config);
    if (codeTab === "json") return serializeCreateJson(config);
    return serializeCreateCss(config);
  }, [codeTab, config, packageManager]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StylePreset[];
      if (Array.isArray(parsed)) setSavedPresets(parsed.filter((preset) => preset.custom));
    } catch {
      // Ignore malformed or blocked storage.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPresets));
    } catch {
      // Ignore quota / privacy mode failures.
    }
  }, [savedPresets]);

  useEffect(() => {
    setMode(config.mode);
    setOverrides(overrides);
  }, [config.mode, overrides, setMode, setOverrides]);

  useEffect(() => {
    return () => {
      const initial = initialThemeRef.current;
      if (!initial) return;
      setMode(initial.mode);
      setOverrides(initial.overrides);
    };
  }, [setMode, setOverrides]);

  function patchConfig(patch: Partial<DesignConfig>) {
    setConfig((current) => markCustom({ ...current, ...patch }));
  }

  function applyPreset(preset: StylePreset) {
    setConfig(configFromPreset(preset));
  }

  function savePreset() {
    const name = presetName.trim();
    if (!name) return;
    const preset = createSavedPreset(name, config);
    setSavedPresets((current) => [preset, ...current].slice(0, 18));
    setConfig(configFromPreset(preset));
    setPresetName("");
  }

  function shuffle() {
    const shuffled = makeShuffledConfig(Date.now());
    setConfig((current) => ({
      ...shuffled,
      mode: locks.mode ? current.mode : shuffled.mode,
      baseColor: locks.base ? current.baseColor : shuffled.baseColor,
      brand: locks.brand ? current.brand : shuffled.brand,
      chart: locks.chart ? current.chart : shuffled.chart,
      headingFont: locks.heading ? current.headingFont : shuffled.headingFont,
      bodyFont: locks.body ? current.bodyFont : shuffled.bodyFont,
      radius: locks.radius ? current.radius : shuffled.radius,
    }));
  }

  function toggleLock(key: LockKey) {
    setLocks((current) => ({ ...current, [key]: !current[key] }));
  }

  function importPreset() {
    try {
      const preset = parsePresetCode(presetCode);
      setSavedPresets((current) => [preset, ...current].slice(0, 18));
      setConfig(configFromPreset(preset));
      setPresetCode("");
      setImportError("");
      setLiveMessage("Preset imported");
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Could not import preset.");
    }
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);
      setLiveMessage("Copied to clipboard");
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard may be unavailable in restricted previews.
    }
  }

  async function copyPresetCode() {
    try {
      await navigator.clipboard.writeText(currentPresetCode);
      setCopied(true);
      setLiveMessage("Preset code copied");
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard may be unavailable in restricted previews.
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-surface-base text-fg">
      <span className="sr-only" aria-live="polite">
        {liveMessage}
      </span>
      <div className="grid min-h-[calc(100vh-4rem)] xl:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="border-border/70 border-b bg-surface-inset/80 p-4 backdrop-blur-xl xl:sticky xl:top-16 xl:h-[calc(100vh-4rem)] xl:overflow-y-auto xl:border-r xl:border-b-0">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-raised px-3 py-2.5">
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold text-fg">Create</p>
              <p className="truncate text-xs text-fg-tertiary">{config.style}</p>
            </div>
            <Badge variant={config.style === CUSTOM_STYLE_NAME ? "warning" : "primary"}>
              {config.mode}
            </Badge>
          </div>

          <div className="mt-5 flex flex-col gap-5">
            <ControlGroup icon={Sparkles} title="Style">
              <div className="grid gap-2">
                {allPresets.map((preset) => {
                  const active = config.style === preset.name;
                  const brand = findBrandColor(preset.config.brand);
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => applyPreset(preset)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border p-3 text-left outline-none transition",
                        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-inset",
                        active
                          ? "border-primary bg-primary/10 text-fg shadow-glow"
                          : "border-border bg-surface-raised text-fg-secondary hover:border-border-strong hover:text-fg",
                      )}
                    >
                      <span
                        className="size-8 shrink-0 rounded-lg border border-border-soft shadow-xs"
                        style={{ backgroundColor: brand.swatch }}
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">{preset.name}</span>
                        <span className="line-clamp-1 block text-xs text-fg-tertiary">
                          {preset.description}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </ControlGroup>

            <ControlGroup
              icon={Moon}
              title="Mode"
              action={
                <LockToggle
                  active={locks.mode}
                  label="Lock mode during shuffle"
                  onClick={() => toggleLock("mode")}
                />
              }
            >
              <div className="grid grid-cols-2 gap-2">
                <ModeButton
                  mode="dark"
                  active={config.mode === "dark"}
                  onClick={() => patchConfig({ mode: "dark" })}
                />
                <ModeButton
                  mode="light"
                  active={config.mode === "light"}
                  onClick={() => patchConfig({ mode: "light" })}
                />
              </div>
            </ControlGroup>

            <ControlGroup
              icon={Palette}
              title="Base color"
              action={
                <LockToggle
                  active={locks.base}
                  label="Lock base color during shuffle"
                  onClick={() => toggleLock("base")}
                />
              }
            >
              <SwatchGrid
                items={BASE_COLORS}
                activeId={config.baseColor}
                onSelect={(baseColor) => patchConfig({ baseColor })}
              />
            </ControlGroup>

            <ControlGroup
              icon={Palette}
              title="Brand"
              action={
                <LockToggle
                  active={locks.brand}
                  label="Lock brand during shuffle"
                  onClick={() => toggleLock("brand")}
                />
              }
            >
              <SwatchGrid
                items={BRAND_COLORS}
                activeId={config.brand}
                onSelect={(brand) =>
                  patchConfig({ brand, primaryColor: undefined, accentColor: undefined })
                }
              />
              <div className="mt-3 grid gap-2">
                <CssValueInput
                  id="create-primary"
                  label="Primary"
                  value={config.primaryColor ?? selectedBrand.swatch}
                  onChange={(primaryColor) => patchConfig({ primaryColor })}
                />
                <CssValueInput
                  id="create-accent"
                  label="Accent"
                  value={config.accentColor ?? selectedBrand.accent}
                  onChange={(accentColor) => patchConfig({ accentColor })}
                />
              </div>
            </ControlGroup>

            <ControlGroup
              icon={Palette}
              title="Chart color"
              action={
                <LockToggle
                  active={locks.chart}
                  label="Lock chart palette during shuffle"
                  onClick={() => toggleLock("chart")}
                />
              }
            >
              <div className="grid gap-2">
                {CHART_PALETTES.map((palette) => (
                  <button
                    key={palette.id}
                    type="button"
                    aria-pressed={config.chart === palette.id}
                    onClick={() => patchConfig({ chart: palette.id })}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-sm outline-none transition",
                      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-inset",
                      config.chart === palette.id
                        ? "border-primary bg-primary/10 text-fg"
                        : "border-border bg-surface-raised text-fg-secondary hover:border-border-strong hover:text-fg",
                    )}
                  >
                    <span>{palette.name}</span>
                    <span className="flex -space-x-1.5">
                      {palette.colors.map((color) => (
                        <span
                          key={color}
                          className="size-5 rounded-full border border-surface-raised"
                          style={{ backgroundColor: color }}
                          aria-hidden="true"
                        />
                      ))}
                    </span>
                  </button>
                ))}
              </div>
            </ControlGroup>

            <ControlGroup icon={Type} title="Typography">
              <FontPicker
                label="Heading"
                value={config.headingFont}
                onChange={(headingFont) => patchConfig({ headingFont })}
                locked={locks.heading}
                onToggleLock={() => toggleLock("heading")}
              />
              <FontPicker
                label="Body"
                value={config.bodyFont}
                onChange={(bodyFont) => patchConfig({ bodyFont })}
                locked={locks.body}
                onToggleLock={() => toggleLock("body")}
              />
            </ControlGroup>

            <ControlGroup
              icon={Radius}
              title="Radius"
              action={
                <LockToggle
                  active={locks.radius}
                  label="Lock radius during shuffle"
                  onClick={() => toggleLock("radius")}
                />
              }
            >
              <div className="flex items-center justify-between text-sm">
                <Label htmlFor="create-radius">Corners</Label>
                <span className="font-mono text-fg-secondary tabular-nums">{config.radius}px</span>
              </div>
              <Slider
                id="create-radius"
                min={0}
                max={28}
                step={1}
                value={[config.radius]}
                onValueChange={(value) =>
                  patchConfig({ radius: value[0] ?? DEFAULT_CONFIG.radius })
                }
                aria-label="Corner radius"
              />
              <div className="flex justify-between text-xs text-fg-tertiary">
                <span>Sharp</span>
                <span>Soft</span>
                <span>Round</span>
              </div>
            </ControlGroup>

            <Separator />

            <div className="grid gap-2">
              <Label htmlFor="preset-name">Preset name</Label>
              <div className="flex gap-2">
                <Input
                  id="preset-name"
                  value={presetName}
                  onChange={(event) => setPresetName(event.target.value)}
                  placeholder="My design system"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={savePreset}
                  disabled={!presetName.trim()}
                  aria-label="Save preset"
                >
                  <Save aria-hidden="true" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={shuffle}>
                <Dices aria-hidden="true" />
                Shuffle
              </Button>
              <Button variant="gradient" onClick={() => setCodeOpen(true)}>
                <Code2 aria-hidden="true" />
                Get code
              </Button>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="sticky top-16 z-30 border-border/70 border-b bg-surface-base/82 px-4 py-3 backdrop-blur-xl sm:px-6">
            <div className="mx-auto flex max-w-[100rem] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-xl font-semibold tracking-tight text-fg sm:text-2xl">
                    {config.style}
                  </h1>
                  <Badge variant="secondary">{selectedBrand.name}</Badge>
                  <Badge variant="outline">{selectedChart.name} charts</Badge>
                </div>
                <p className="mt-1 text-sm text-fg-secondary">
                  {findFontChoice(config.headingFont).name} headings ·{" "}
                  {findFontChoice(config.bodyFont).name} body · {config.radius}px radius
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setConfig(DEFAULT_CONFIG)}>
                  Reset
                </Button>
                <Button variant="outline" onClick={shuffle}>
                  <Dices aria-hidden="true" />
                  Shuffle
                </Button>
                <Button variant="gradient" onClick={() => setCodeOpen(true)}>
                  <Code2 aria-hidden="true" />
                  Get code
                </Button>
              </div>
            </div>
          </div>

          <div className="mx-auto grid max-w-[100rem] gap-6 px-4 py-6 sm:px-6 2xl:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="min-w-0">
              <div className="overflow-hidden rounded-2xl border border-border bg-surface-inset p-4 shadow-lg sm:p-6">
                <PreviewDashboard />
                <ComponentSampler config={config} />
              </div>
            </div>

            <div className="grid gap-4 2xl:sticky 2xl:top-36 2xl:self-start">
              <TokenSummary config={config} />
              <PresetExchange
                presetCode={presetCode}
                error={importError}
                onPresetCodeChange={setPresetCode}
                onImport={importPreset}
                onCopyPreset={copyPresetCode}
              />
            </div>
          </div>
        </section>
      </div>

      <CodeDialog
        open={codeOpen}
        onOpenChange={setCodeOpen}
        activeTab={codeTab}
        code={activeCode}
        copied={copied}
        packageManager={packageManager}
        presetJson={serializeCreateJson(config)}
        onPackageManagerChange={setPackageManager}
        onCopy={copyCode}
        onTabChange={setCodeTab}
      />
    </main>
  );
}

function ControlGroup({
  icon: Icon,
  title,
  action,
  children,
}: {
  icon: typeof Sparkles;
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-3">
      <div className="flex items-center justify-between gap-2 text-sm font-medium text-fg">
        <span className="inline-flex items-center gap-2">
          <Icon className="size-4 text-fg-tertiary" aria-hidden="true" />
          <span>{title}</span>
        </span>
        {action}
      </div>
      {children}
    </section>
  );
}

function LockToggle({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  const Icon = active ? Lock : LockOpen;
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "grid size-8 place-items-center rounded-lg border outline-none transition",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-inset",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-surface-raised text-fg-tertiary hover:border-border-strong hover:text-fg",
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
    </button>
  );
}

function ModeButton({
  mode,
  active,
  onClick,
}: {
  mode: Mode;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = mode === "dark" ? Moon : Sun;
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium capitalize outline-none transition",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-inset",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-xs"
          : "border-border bg-surface-raised text-fg-secondary hover:border-border-strong hover:text-fg",
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      {mode}
    </button>
  );
}

function SwatchGrid({
  items,
  activeId,
  onSelect,
}: {
  items: { id: string; name: string; swatch: string }[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-pressed={activeId === item.id}
          onClick={() => onSelect(item.id)}
          className={cn(
            "flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm outline-none transition",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-inset",
            activeId === item.id
              ? "border-primary bg-primary/10 text-fg"
              : "border-border bg-surface-raised text-fg-secondary hover:border-border-strong hover:text-fg",
          )}
        >
          <span
            className="size-4 shrink-0 rounded-full border border-border-soft"
            style={{ backgroundColor: item.swatch }}
            aria-hidden="true"
          />
          <span className="truncate">{item.name}</span>
        </button>
      ))}
    </div>
  );
}

function CssValueInput({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string | undefined) => void;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-xs text-fg-tertiary">
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value.trim() || undefined)}
        className="font-mono text-xs"
      />
    </div>
  );
}

function FontPicker({
  label,
  value,
  onChange,
  locked,
  onToggleLock,
}: {
  label: string;
  value: string;
  onChange: (id: string) => void;
  locked: boolean;
  onToggleLock: () => void;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-xs text-fg-tertiary">{label}</Label>
        <LockToggle
          active={locked}
          label={`Lock ${label.toLowerCase()} font during shuffle`}
          onClick={onToggleLock}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {FONT_CHOICES.map((font) => (
          <button
            key={font.id}
            type="button"
            aria-pressed={value === font.id}
            onClick={() => onChange(font.id)}
            className={cn(
              "flex min-w-0 items-center justify-between gap-2 rounded-xl border px-3 py-2 outline-none transition",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-inset",
              value === font.id
                ? "border-primary bg-primary/10 text-fg"
                : "border-border bg-surface-raised text-fg-secondary hover:border-border-strong hover:text-fg",
            )}
          >
            <span className="truncate text-sm">{font.name}</span>
            <span
              className="font-display text-sm text-fg-tertiary"
              style={{ fontFamily: font.stack }}
            >
              Aa
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ComponentSampler({ config }: { config: DesignConfig }) {
  return (
    <div className="mt-6 grid gap-5 xl:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Controls</CardTitle>
          <CardDescription>Inputs, toggles, radios, and button states.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="sampler-name">Workspace</Label>
            <Input id="sampler-name" defaultValue="Cooud Growth" />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border bg-surface-inset px-3 py-2.5">
            <Label htmlFor="sampler-switch">Auto-save</Label>
            <Switch id="sampler-switch" defaultChecked />
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-inset px-3 py-2.5 text-sm">
            <Checkbox id="sampler-emails" defaultChecked />
            <Label htmlFor="sampler-emails" className="text-sm">
              Email weekly reports
            </Label>
          </div>
          <RadioGroup defaultValue="balanced" className="grid grid-cols-3 gap-2">
            {["fast", "balanced", "safe"].map((value) => (
              <div
                key={value}
                className="flex items-center justify-center gap-2 rounded-lg border border-border bg-surface-inset px-2 py-2 text-xs capitalize"
              >
                <RadioGroupItem id={`sampler-${value}`} value={value} />
                <Label htmlFor={`sampler-${value}`} className="text-xs capitalize">
                  {value}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <div className="flex gap-2">
            <Button variant="gradient" className="flex-1">
              Primary
            </Button>
            <Button variant="outline" className="flex-1">
              Outline
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data surface</CardTitle>
          <CardDescription>Tables, progress, and status colors.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-fg-secondary">Migration progress</span>
              <span className="font-mono text-fg">72%</span>
            </div>
            <Progress value={72} />
          </div>
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Use</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ["Primary", "Ready", "Actions"],
                  ["Surface", "Ready", "Layouts"],
                  ["Chart", "Draft", "Analytics"],
                ].map(([token, status, use]) => (
                  <TableRow key={token}>
                    <TableCell className="font-medium">{token}</TableCell>
                    <TableCell>
                      <Badge variant={status === "Ready" ? "success" : "warning"}>{status}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-fg-secondary">{use}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Navigation & type</CardTitle>
          <CardDescription>Tabs, disclosure, and typography scale.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Tabs defaultValue="preview">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
            </TabsList>
            <TabsContent
              value="preview"
              className="rounded-lg border border-border bg-surface-inset p-3"
            >
              <p className="font-display text-2xl font-semibold text-fg">Aa</p>
              <p className="text-sm text-fg-secondary">
                {findFontChoice(config.headingFont).name} with {config.radius}px corners.
              </p>
            </TabsContent>
            <TabsContent
              value="tokens"
              className="rounded-lg border border-border bg-surface-inset p-3"
            >
              <div className="flex gap-2">
                {findChartPalette(config.chart).colors.map((color) => (
                  <span
                    key={color}
                    className="h-10 flex-1 rounded-md"
                    style={{ backgroundColor: color }}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger>Preset contract</AccordionTrigger>
              <AccordionContent>
                Style presets bundle mode, color ramps, typography, charts, and radius into one
                reusable system.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

function TokenSummary({ config }: { config: DesignConfig }) {
  const colors = findChartPalette(config.chart).colors;
  return (
    <section className="rounded-2xl border border-border bg-surface-raised p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-sm font-semibold text-fg">System bundle</h2>
          <p className="text-xs text-fg-tertiary">Saved as one reusable preset.</p>
        </div>
        <Badge variant="primary">{config.mode}</Badge>
      </div>
      <dl className="mt-4 grid gap-3 text-sm">
        <SummaryRow label="Base" value={config.baseColor} />
        <SummaryRow label="Brand" value={config.brand} />
        <SummaryRow label="Heading" value={findFontChoice(config.headingFont).name} />
        <SummaryRow label="Body" value={findFontChoice(config.bodyFont).name} />
        <SummaryRow label="Radius" value={`${config.radius}px`} />
      </dl>
      <div className="mt-4 flex gap-2">
        {colors.map((color) => (
          <span
            key={color}
            className="h-9 flex-1 rounded-lg border border-border-soft"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
        ))}
      </div>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-fg-tertiary">{label}</dt>
      <dd className="truncate font-medium text-fg capitalize">{value}</dd>
    </div>
  );
}

function PresetExchange({
  presetCode,
  error,
  onPresetCodeChange,
  onImport,
  onCopyPreset,
}: {
  presetCode: string;
  error: string;
  onPresetCodeChange: (value: string) => void;
  onImport: () => void;
  onCopyPreset: () => void;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface-raised p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-sm font-semibold text-fg">Preset exchange</h2>
          <p className="text-xs text-fg-tertiary">Copy this system or open one from a code.</p>
        </div>
        <Button variant="outline" size="icon-sm" onClick={onCopyPreset} aria-label="Copy preset">
          <Copy aria-hidden="true" />
        </Button>
      </div>
      <div className="mt-4 grid gap-3">
        <Textarea
          value={presetCode}
          onChange={(event) => onPresetCodeChange(event.target.value)}
          placeholder="Paste cooud: preset code or JSON"
          rows={4}
          className="font-mono text-xs"
          aria-label="Preset import code"
        />
        {error ? <p className="text-xs text-error">{error}</p> : null}
        <Button variant="outline" onClick={onImport} disabled={!presetCode.trim()}>
          <Download aria-hidden="true" />
          Open preset
        </Button>
      </div>
    </section>
  );
}

function CodeDialog({
  open,
  onOpenChange,
  activeTab,
  code,
  copied,
  packageManager,
  presetJson,
  onPackageManagerChange,
  onCopy,
  onTabChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeTab: CodeTab;
  code: string;
  copied: boolean;
  packageManager: PackageManager;
  presetJson: string;
  onPackageManagerChange: (pm: PackageManager) => void;
  onCopy: () => void;
  onTabChange: (tab: CodeTab) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] max-w-4xl overflow-hidden p-0">
        <DialogHeader className="border-border border-b p-6 pr-12">
          <DialogTitle className="flex items-center gap-2">
            <Code2 className="size-5 text-primary" aria-hidden="true" />
            Get code
          </DialogTitle>
          <DialogDescription>
            Install Cooud UI, wire the provider, or copy the exact CSS variables for this preset.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => onTabChange(value as CodeTab)}
          className="min-h-0 gap-0"
        >
          <div className="flex flex-col gap-3 border-border border-b p-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="max-w-full overflow-x-auto">
              {codeTabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <Button variant="outline" onClick={onCopy}>
              {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
              Copy
            </Button>
          </div>

          <TabsContent value="install" className="min-h-0">
            <div className="border-border border-b px-4 py-3">
              <div className="flex flex-wrap gap-2">
                {(["bun", "pnpm", "npm", "yarn"] as const).map((pm) => (
                  <button
                    key={pm}
                    type="button"
                    aria-pressed={packageManager === pm}
                    onClick={() => onPackageManagerChange(pm)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-sm font-medium outline-none transition",
                      "focus-visible:ring-2 focus-visible:ring-ring",
                      packageManager === pm
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-surface-inset text-fg-secondary hover:text-fg",
                    )}
                  >
                    {pm}
                  </button>
                ))}
              </div>
            </div>
            <CodeBlock code={code} />
          </TabsContent>

          <TabsContent value="provider" className="min-h-0">
            <CodeBlock code={code} />
          </TabsContent>

          <TabsContent value="css" className="min-h-0">
            <CodeBlock code={code} />
          </TabsContent>

          <TabsContent value="json" className="min-h-0">
            <CodeBlock code={presetJson} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="max-h-[56vh] overflow-auto bg-surface-inset p-5 font-mono text-xs leading-relaxed text-fg-secondary">
      <code>{code}</code>
    </pre>
  );
}
