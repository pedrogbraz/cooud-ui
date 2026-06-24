"use client";

import {
  Autocomplete,
  type AutocompleteOption,
  Badge,
  Button,
  Checkbox,
  ColorPicker,
  Combobox,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FileDropzone,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  InputGroup,
  InputGroupAddon,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  Label,
  MultiSelect,
  NumberInput,
  PasswordInput,
  RadioGroup,
  RadioGroupItem,
  Rating,
  RichTextEditor,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Slider,
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
  Switch,
  TagsInput,
  Textarea,
} from "@cooud-ui/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, Check, FileText, Link2 } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ExampleList } from "../../components/docs/example-list";
import type { ExampleMap } from "./types";

// ── Checkbox ───────────────────────────────────────────────────────
function CheckboxDemo() {
  const [checked, setChecked] = useState(true);

  return (
    <div className="flex items-center gap-3">
      <Checkbox
        id="terms"
        checked={checked}
        onCheckedChange={(value) => setChecked(value === true)}
      />
      <Label htmlFor="terms">Accept terms &amp; conditions</Label>
    </div>
  );
}

const checkboxDemoCode = `function CheckboxDemo() {
  const [checked, setChecked] = useState(true);

  return (
    <div className="flex items-center gap-3">
      <Checkbox
        id="terms"
        checked={checked}
        onCheckedChange={(value) => setChecked(value === true)}
      />
      <Label htmlFor="terms">Accept terms &amp; conditions</Label>
    </div>
  );
}`;

// ── Rating ─────────────────────────────────────────────────────────
function RatingDemo() {
  const [value, setValue] = useState(3);

  return (
    <div className="flex flex-col items-center gap-3">
      <Rating value={value} onValueChange={setValue} aria-label="Rate your experience" />
      <p className="text-sm text-fg-secondary tabular-nums">
        {value} {value === 1 ? "star" : "stars"}
      </p>
    </div>
  );
}

const ratingDemoCode = `function RatingDemo() {
  const [value, setValue] = useState(3);

  return (
    <div className="flex flex-col items-center gap-3">
      <Rating value={value} onValueChange={setValue} aria-label="Rate your experience" />
      <p className="text-sm text-fg-secondary tabular-nums">
        {value} {value === 1 ? "star" : "stars"}
      </p>
    </div>
  );
}`;

// ── TagsInput ───────────────────────────────────────────────────────
function TagsInputDemo() {
  const [tags, setTags] = useState<string[]>(["design", "react"]);
  const labelId = useId();

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <FieldLabel id={labelId}>Topics</FieldLabel>
      <TagsInput
        value={tags}
        onValueChange={setTags}
        aria-labelledby={labelId}
        max={6}
        placeholder="Add a topic…"
      />
      <FieldDescription>
        Press Enter or comma to add. Backspace removes the last tag.
      </FieldDescription>
    </div>
  );
}

const tagsInputDemoCode = `function TagsInputDemo() {
  const [tags, setTags] = useState<string[]>(["design", "react"]);
  const labelId = useId();

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <FieldLabel id={labelId}>Topics</FieldLabel>
      <TagsInput
        value={tags}
        onValueChange={setTags}
        aria-labelledby={labelId}
        max={6}
        placeholder="Add a topic…"
      />
      <FieldDescription>
        Press Enter or comma to add. Backspace removes the last tag.
      </FieldDescription>
    </div>
  );
}`;

// ── InputGroup ─────────────────────────────────────────────────────
const inputGroupUrlCode = `<InputGroup>
  <InputGroupAddon>
    <Link2 />
    https://
  </InputGroupAddon>
  <Input placeholder="acme.cooud.app" />
  <InputGroupAddon align="end">.cooud.app</InputGroupAddon>
</InputGroup>`;

const inputGroupEmailCode = `<InputGroup>
  <InputGroupAddon>
    <AtSign />
  </InputGroupAddon>
  <Input type="email" placeholder="you@company.com" />
</InputGroup>`;

// ── PasswordInput ──────────────────────────────────────────────────
function PasswordInputStrengthDemo() {
  const [value, setValue] = useState("");

  return (
    <div className="w-full max-w-sm">
      <PasswordInput
        value={value}
        onChange={(event) => setValue(event.target.value)}
        showStrength
        placeholder="Create a password"
        autoComplete="new-password"
      />
    </div>
  );
}

const passwordInputStrengthDemoCode = `function PasswordInputStrengthDemo() {
  const [value, setValue] = useState("");

  return (
    <div className="w-full max-w-sm">
      <PasswordInput
        value={value}
        onChange={(event) => setValue(event.target.value)}
        showStrength
        placeholder="Create a password"
        autoComplete="new-password"
      />
    </div>
  );
}`;

const passwordInputBasicCode = `<PasswordInput
  className="max-w-sm"
  placeholder="Enter your password"
  autoComplete="current-password"
/>`;

// ── ColorPicker ────────────────────────────────────────────────────
const brandSwatches = [
  "oklch(0.62 0.21 256)",
  "oklch(0.65 0.24 24)",
  "oklch(0.72 0.19 145)",
  "oklch(0.8 0.16 86)",
  "oklch(0.62 0.25 304)",
];

function ColorPickerDemo() {
  const [color, setColor] = useState("oklch(0.62 0.21 256)");

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <ColorPicker
        value={color}
        onValueChange={setColor}
        swatches={brandSwatches}
        aria-label="Brand color"
      />
      <div className="flex items-center gap-2 text-sm text-fg-secondary">
        <span
          aria-hidden="true"
          className="size-4 rounded-full border border-border"
          style={{ background: color }}
        />
        <span className="font-mono text-xs tabular-nums">{color}</span>
      </div>
    </div>
  );
}

const colorPickerDemoCode = `const brandSwatches = [
  "oklch(0.62 0.21 256)",
  "oklch(0.65 0.24 24)",
  "oklch(0.72 0.19 145)",
  "oklch(0.8 0.16 86)",
  "oklch(0.62 0.25 304)",
];

function ColorPickerDemo() {
  const [color, setColor] = useState("oklch(0.62 0.21 256)");

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <ColorPicker
        value={color}
        onValueChange={setColor}
        swatches={brandSwatches}
        aria-label="Brand color"
      />
      <div className="flex items-center gap-2 text-sm text-fg-secondary">
        <span
          aria-hidden="true"
          className="size-4 rounded-full border border-border"
          style={{ background: color }}
        />
        <span className="font-mono text-xs tabular-nums">{color}</span>
      </div>
    </div>
  );
}`;

// ── RadioGroup ─────────────────────────────────────────────────────
const radioOptions = [
  { value: "starter", label: "Starter", hint: "For side projects" },
  { value: "pro", label: "Pro", hint: "For growing teams" },
  { value: "enterprise", label: "Enterprise", hint: "For large organizations" },
];

function RadioGroupDemo() {
  const [plan, setPlan] = useState("pro");

  return (
    <RadioGroup value={plan} onValueChange={setPlan} className="flex flex-col gap-3">
      {radioOptions.map((option) => (
        <div key={option.value} className="flex items-center gap-3">
          <RadioGroupItem value={option.value} id={`plan-${option.value}`} />
          <Label htmlFor={`plan-${option.value}`} className="flex flex-col gap-0.5">
            <span>{option.label}</span>
            <span className="text-xs font-normal text-fg-tertiary">{option.hint}</span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}

const radioGroupDemoCode = `const options = [
  { value: "starter", label: "Starter", hint: "For side projects" },
  { value: "pro", label: "Pro", hint: "For growing teams" },
  { value: "enterprise", label: "Enterprise", hint: "For large organizations" },
];

function RadioGroupDemo() {
  const [plan, setPlan] = useState("pro");

  return (
    <RadioGroup value={plan} onValueChange={setPlan} className="flex flex-col gap-3">
      {options.map((option) => (
        <div key={option.value} className="flex items-center gap-3">
          <RadioGroupItem value={option.value} id={\`plan-\${option.value}\`} />
          <Label htmlFor={\`plan-\${option.value}\`} className="flex flex-col gap-0.5">
            <span>{option.label}</span>
            <span className="text-xs font-normal text-fg-tertiary">{option.hint}</span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}`;

// ── Switch ─────────────────────────────────────────────────────────
function SwitchDemo() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex items-center justify-between gap-3 max-w-xs">
      <Label htmlFor="notifications">Push notifications</Label>
      <Switch id="notifications" checked={enabled} onCheckedChange={setEnabled} />
    </div>
  );
}

const switchDemoCode = `function SwitchDemo() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex items-center justify-between gap-3 max-w-xs">
      <Label htmlFor="notifications">Push notifications</Label>
      <Switch id="notifications" checked={enabled} onCheckedChange={setEnabled} />
    </div>
  );
}`;

// ── Select ─────────────────────────────────────────────────────────
function SelectDemo() {
  const [region, setRegion] = useState<string | undefined>();

  return (
    <Field className="max-w-xs">
      <Label htmlFor="region">Deploy region</Label>
      <Select value={region ?? ""} onValueChange={setRegion}>
        <SelectTrigger id="region">
          <SelectValue placeholder="Choose a region" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Americas</SelectLabel>
            <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
            <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
            <SelectItem value="sa-east-1">São Paulo</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Europe</SelectLabel>
            <SelectItem value="eu-west-1">Ireland</SelectItem>
            <SelectItem value="eu-central-1">Frankfurt</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <FieldDescription>
        {region ? `Selected: ${region}` : "No region selected yet."}
      </FieldDescription>
    </Field>
  );
}

const selectDemoCode = `function SelectDemo() {
  const [region, setRegion] = useState<string | undefined>();

  return (
    <Field className="max-w-xs">
      <Label htmlFor="region">Deploy region</Label>
      <Select value={region ?? ""} onValueChange={setRegion}>
        <SelectTrigger id="region">
          <SelectValue placeholder="Choose a region" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Americas</SelectLabel>
            <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
            <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
            <SelectItem value="sa-east-1">São Paulo</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Europe</SelectLabel>
            <SelectItem value="eu-west-1">Ireland</SelectItem>
            <SelectItem value="eu-central-1">Frankfurt</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <FieldDescription>
        {region ? \`Selected: \${region}\` : "No region selected yet."}
      </FieldDescription>
    </Field>
  );
}`;

// ── Slider ─────────────────────────────────────────────────────────
function SliderDemo() {
  const [volume, setVolume] = useState([40]);

  return (
    <div className="flex flex-col gap-4 max-w-xs">
      <div className="flex items-center justify-between text-sm">
        <Label>Volume</Label>
        <span className="font-mono text-fg">{volume[0]}%</span>
      </div>
      <Slider value={volume} onValueChange={setVolume} min={0} max={100} step={1} />
    </div>
  );
}

const sliderDemoCode = `function SliderDemo() {
  const [volume, setVolume] = useState([40]);

  return (
    <div className="flex flex-col gap-4 max-w-xs">
      <div className="flex items-center justify-between text-sm">
        <Label>Volume</Label>
        <span className="font-mono text-fg">{volume[0]}%</span>
      </div>
      <Slider value={volume} onValueChange={setVolume} min={0} max={100} step={1} />
    </div>
  );
}`;

function SliderRangeDemo() {
  const [price, setPrice] = useState([20, 80]);

  return (
    <div className="flex flex-col gap-4 max-w-xs">
      <div className="flex items-center justify-between text-sm">
        <Label>Price range</Label>
        <span className="font-mono text-fg">
          ${price[0]} – ${price[1]}
        </span>
      </div>
      <Slider value={price} onValueChange={setPrice} min={0} max={100} step={5} />
    </div>
  );
}

const sliderRangeDemoCode = `function SliderRangeDemo() {
  const [price, setPrice] = useState([20, 80]);

  return (
    <div className="flex flex-col gap-4 max-w-xs">
      <div className="flex items-center justify-between text-sm">
        <Label>Price range</Label>
        <span className="font-mono text-fg">
          \${price[0]} – \${price[1]}
        </span>
      </div>
      <Slider value={price} onValueChange={setPrice} min={0} max={100} step={5} />
    </div>
  );
}`;

// ── Field ──────────────────────────────────────────────────────────
function FieldErrorDemo() {
  const [username, setUsername] = useState("");
  const error = username.includes(" ") ? "Username can't contain spaces." : "";

  return (
    <Field>
      <FieldLabel htmlFor="username">Username</FieldLabel>
      <Input
        id="username"
        value={username}
        invalid={!!error}
        placeholder="ada"
        aria-describedby={error ? "username-err" : undefined}
        onChange={(event) => setUsername(event.target.value)}
      />
      <FieldError id="username-err">{error}</FieldError>
    </Field>
  );
}

const fieldErrorDemoCode = `function FieldErrorDemo() {
  const [username, setUsername] = useState("");
  const error = username.includes(" ") ? "Username can't contain spaces." : "";

  return (
    <Field>
      <FieldLabel htmlFor="username">Username</FieldLabel>
      <Input
        id="username"
        value={username}
        invalid={!!error}
        placeholder="ada"
        aria-describedby={error ? "username-err" : undefined}
        onChange={(event) => setUsername(event.target.value)}
      />
      <FieldError id="username-err">{error}</FieldError>
    </Field>
  );
}`;

// ── Input OTP ──────────────────────────────────────────────────────
function InputOTPDemo() {
  const [otp, setOtp] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      {otp.length === 6 ? (
        <Badge variant="success">
          <Check aria-hidden="true" />
          Code complete
        </Badge>
      ) : (
        <p className="text-xs text-fg-tertiary">Entered {otp.length} of 6 digits.</p>
      )}
    </div>
  );
}

const inputOTPDemoCode = `function InputOTPDemo() {
  const [otp, setOtp] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      {otp.length === 6 ? (
        <Badge variant="success">
          <Check aria-hidden="true" />
          Code complete
        </Badge>
      ) : (
        <p className="text-xs text-fg-tertiary">Entered {otp.length} of 6 digits.</p>
      )}
    </div>
  );
}`;

// ── File Dropzone ──────────────────────────────────────────────────
function FileDropzoneDemo() {
  const [files, setFiles] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-4">
      <FileDropzone multiple onFiles={(picked) => setFiles(picked.map((file) => file.name))} />
      {files.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {files.map((name) => (
            <li
              key={name}
              className="flex items-center gap-2 rounded-lg border border-border-soft bg-surface-inset px-3 py-2 text-sm text-fg-secondary"
            >
              <FileText className="size-4 text-fg-tertiary" aria-hidden="true" />
              {name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-fg-tertiary">No files selected yet.</p>
      )}
    </div>
  );
}

const fileDropzoneDemoCode = `function FileDropzoneDemo() {
  const [files, setFiles] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-4">
      <FileDropzone multiple onFiles={(picked) => setFiles(picked.map((file) => file.name))} />
      {files.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {files.map((name) => (
            <li
              key={name}
              className="flex items-center gap-2 rounded-lg border border-border-soft bg-surface-inset px-3 py-2 text-sm text-fg-secondary"
            >
              <FileText className="size-4 text-fg-tertiary" aria-hidden="true" />
              {name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-fg-tertiary">No files selected yet.</p>
      )}
    </div>
  );
}`;

// ── Form (react-hook-form + zod) ───────────────────────────────────
const profileSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  bio: z.string().min(10, "Bio must be at least 10 characters."),
});

type ProfileValues = z.infer<typeof profileSchema>;

function FormDemo() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { email: "", bio: "" },
    mode: "onChange",
  });

  const onSubmit = (values: ProfileValues) => {
    void values;
    setSubmitted(true);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex max-w-md flex-col gap-5"
        noValidate
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@cooud.dev" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Tell us a bit about yourself…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-3">
          <Button type="submit">Save profile</Button>
          {submitted ? (
            <Badge variant="success">
              <Check aria-hidden="true" />
              Saved
            </Badge>
          ) : null}
        </div>
      </form>
    </Form>
  );
}

const formDemoCode = `const profileSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  bio: z.string().min(10, "Bio must be at least 10 characters."),
});

type ProfileValues = z.infer<typeof profileSchema>;

function FormDemo() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { email: "", bio: "" },
    mode: "onChange",
  });

  const onSubmit = (values: ProfileValues) => {
    setSubmitted(true);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex max-w-md flex-col gap-5"
        noValidate
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@cooud.dev" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Tell us a bit about yourself…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-3">
          <Button type="submit">Save profile</Button>
          {submitted ? (
            <Badge variant="success">
              <Check aria-hidden="true" />
              Saved
            </Badge>
          ) : null}
        </div>
      </form>
    </Form>
  );
}`;

// ── Combobox ───────────────────────────────────────────────────────
const frameworkOptions = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "nuxt", label: "Nuxt" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "solidstart", label: "SolidStart", disabled: true },
];

function ComboboxDemo() {
  const [framework, setFramework] = useState<string>();

  return (
    <Field className="max-w-xs">
      <FieldLabel id="framework-label">Framework</FieldLabel>
      <Combobox
        options={frameworkOptions}
        value={framework}
        onValueChange={setFramework}
        placeholder="Select a framework…"
        searchPlaceholder="Search frameworks…"
        aria-labelledby="framework-label"
      />
      <FieldDescription>
        {framework
          ? `Selected: ${frameworkOptions.find((o) => o.value === framework)?.label}`
          : "Search and pick a single framework."}
      </FieldDescription>
    </Field>
  );
}

const comboboxDemoCode = `const frameworkOptions = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "nuxt", label: "Nuxt" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "solidstart", label: "SolidStart", disabled: true },
];

function ComboboxDemo() {
  const [framework, setFramework] = useState<string>();

  return (
    <Field className="max-w-xs">
      <FieldLabel id="framework-label">Framework</FieldLabel>
      <Combobox
        options={frameworkOptions}
        value={framework}
        onValueChange={setFramework}
        placeholder="Select a framework…"
        searchPlaceholder="Search frameworks…"
        aria-labelledby="framework-label"
      />
      <FieldDescription>
        {framework
          ? \`Selected: \${frameworkOptions.find((o) => o.value === framework)?.label}\`
          : "Search and pick a single framework."}
      </FieldDescription>
    </Field>
  );
}`;

// ── MultiSelect ────────────────────────────────────────────────────
const skillOptions = [
  { value: "typescript", label: "TypeScript" },
  { value: "react", label: "React" },
  { value: "node", label: "Node.js" },
  { value: "postgres", label: "PostgreSQL" },
  { value: "tailwind", label: "Tailwind CSS" },
  { value: "graphql", label: "GraphQL" },
  { value: "rust", label: "Rust", disabled: true },
];

function MultiSelectDemo() {
  const [skills, setSkills] = useState<string[]>(["typescript", "react"]);

  return (
    <Field className="max-w-sm">
      <FieldLabel id="skills-label">Skills</FieldLabel>
      <MultiSelect
        options={skillOptions}
        value={skills}
        onValueChange={setSkills}
        placeholder="Select skills…"
        aria-labelledby="skills-label"
      />
      <FieldDescription>
        {skills.length > 0 ? `${skills.length} selected.` : "Pick one or more skills."}
      </FieldDescription>
    </Field>
  );
}

const multiSelectDemoCode = `const skillOptions = [
  { value: "typescript", label: "TypeScript" },
  { value: "react", label: "React" },
  { value: "node", label: "Node.js" },
  { value: "postgres", label: "PostgreSQL" },
  { value: "tailwind", label: "Tailwind CSS" },
  { value: "graphql", label: "GraphQL" },
  { value: "rust", label: "Rust", disabled: true },
];

function MultiSelectDemo() {
  const [skills, setSkills] = useState<string[]>(["typescript", "react"]);

  return (
    <Field className="max-w-sm">
      <FieldLabel id="skills-label">Skills</FieldLabel>
      <MultiSelect
        options={skillOptions}
        value={skills}
        onValueChange={setSkills}
        placeholder="Select skills…"
        aria-labelledby="skills-label"
      />
      <FieldDescription>
        {skills.length > 0 ? \`\${skills.length} selected.\` : "Pick one or more skills."}
      </FieldDescription>
    </Field>
  );
}`;

function MultiSelectMaxDisplayDemo() {
  const [skills, setSkills] = useState<string[]>(["typescript", "react", "node", "postgres"]);

  return (
    <MultiSelect
      options={skillOptions}
      value={skills}
      onValueChange={setSkills}
      maxDisplay={2}
      placeholder="Select skills…"
      aria-label="Skills"
      className="max-w-sm"
    />
  );
}

const multiSelectMaxDisplayDemoCode = `function MultiSelectMaxDisplayDemo() {
  const [skills, setSkills] = useState<string[]>([
    "typescript",
    "react",
    "node",
    "postgres",
  ]);

  return (
    <MultiSelect
      options={skillOptions}
      value={skills}
      onValueChange={setSkills}
      maxDisplay={2}
      placeholder="Select skills…"
      aria-label="Skills"
      className="max-w-sm"
    />
  );
}`;

// ── NumberInput ────────────────────────────────────────────────────
function NumberInputDemo() {
  const [quantity, setQuantity] = useState<number | null>(1);

  return (
    <Field className="max-w-[12rem]">
      <FieldLabel htmlFor="qty">Quantity</FieldLabel>
      <NumberInput
        id="qty"
        value={quantity}
        onValueChange={setQuantity}
        min={0}
        max={10}
        aria-label="Quantity"
      />
      <FieldDescription>Between 0 and 10.</FieldDescription>
    </Field>
  );
}

const numberInputDemoCode = `function NumberInputDemo() {
  const [quantity, setQuantity] = useState<number | null>(1);

  return (
    <Field className="max-w-[12rem]">
      <FieldLabel htmlFor="qty">Quantity</FieldLabel>
      <NumberInput
        id="qty"
        value={quantity}
        onValueChange={setQuantity}
        min={0}
        max={10}
        aria-label="Quantity"
      />
      <FieldDescription>Between 0 and 10.</FieldDescription>
    </Field>
  );
}`;

function NumberInputCurrencyDemo() {
  const [price, setPrice] = useState<number | null>(19.9);

  return (
    <NumberInput
      value={price}
      onValueChange={setPrice}
      min={0}
      step={0.1}
      precision={2}
      format={(value) => `$${value.toFixed(2)}`}
      aria-label="Price"
      className="max-w-[12rem]"
    />
  );
}

const numberInputCurrencyDemoCode = `function NumberInputCurrencyDemo() {
  const [price, setPrice] = useState<number | null>(19.9);

  return (
    <NumberInput
      value={price}
      onValueChange={setPrice}
      min={0}
      step={0.1}
      precision={2}
      format={(value) => \`$\${value.toFixed(2)}\`}
      aria-label="Price"
      className="max-w-[12rem]"
    />
  );
}`;

// ── Autocomplete ───────────────────────────────────────────────────
const autocompleteFrameworks: AutocompleteOption[] = [
  { value: "Next.js" },
  { value: "Remix" },
  { value: "Astro" },
  { value: "SvelteKit" },
  { value: "Nuxt" },
  { value: "SolidStart" },
];

function AutocompleteDemo() {
  const [value, setValue] = useState("");

  return (
    <Autocomplete
      options={autocompleteFrameworks}
      value={value}
      onValueChange={setValue}
      placeholder="Search a framework…"
      aria-label="Framework"
      className="max-w-xs"
    />
  );
}

const autocompleteDemoCode = `const frameworks: AutocompleteOption[] = [
  { value: "Next.js" },
  { value: "Remix" },
  { value: "Astro" },
  { value: "SvelteKit" },
  { value: "Nuxt" },
  { value: "SolidStart" },
];

function AutocompleteDemo() {
  const [value, setValue] = useState("");

  return (
    <Autocomplete
      options={frameworks}
      value={value}
      onValueChange={setValue}
      placeholder="Search a framework…"
      aria-label="Framework"
      className="max-w-xs"
    />
  );
}`;

function AutocompleteAsyncDemo() {
  const [value, setValue] = useState("");

  // Simulated remote search over the static list (replace with a real fetch).
  const search = async (query: string): Promise<AutocompleteOption[]> => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    const needle = query.trim().toLowerCase();
    return needle === ""
      ? autocompleteFrameworks
      : autocompleteFrameworks.filter((o) => o.value.toLowerCase().includes(needle));
  };

  return (
    <Autocomplete
      onSearch={search}
      value={value}
      onValueChange={setValue}
      placeholder="Search (async)…"
      aria-label="Framework (async)"
      className="max-w-xs"
    />
  );
}

const autocompleteAsyncDemoCode = `function AutocompleteAsyncDemo() {
  const [value, setValue] = useState("");

  // Debounced; the component tracks its own loading state when onSearch is set.
  const search = async (query: string): Promise<AutocompleteOption[]> => {
    const res = await fetch(\`/api/frameworks?q=\${encodeURIComponent(query)}\`);
    return res.json();
  };

  return (
    <Autocomplete
      onSearch={search}
      value={value}
      onValueChange={setValue}
      placeholder="Search (async)…"
      aria-label="Framework (async)"
      className="max-w-xs"
    />
  );
}`;

const STEPPER_STEPS = [
  { title: "Account", description: "Your details" },
  { title: "Shipping", description: "Where to send it" },
  { title: "Payment", description: "Confirm & pay" },
];

function StepperDemo() {
  const [step, setStep] = useState(1);
  const lastStep = STEPPER_STEPS.length - 1;

  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <Stepper value={step} onValueChange={setStep}>
        <StepperList>
          {STEPPER_STEPS.map((item, index) => (
            <StepperItem key={item.title} step={index}>
              <StepperTrigger>
                <StepperIndicator />
                <span className="flex flex-col">
                  <StepperTitle>{item.title}</StepperTitle>
                  <StepperDescription>{item.description}</StepperDescription>
                </span>
              </StepperTrigger>
              {index < lastStep ? <StepperSeparator /> : null}
            </StepperItem>
          ))}
        </StepperList>
      </Stepper>
      <div className="flex justify-between">
        <Button
          variant="outline"
          disabled={step === 0}
          onClick={() => setStep((value) => Math.max(0, value - 1))}
        >
          Back
        </Button>
        <Button
          disabled={step === lastStep}
          onClick={() => setStep((value) => Math.min(lastStep, value + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

// ── RichTextEditor ─────────────────────────────────────────────────
function RichTextEditorDemo() {
  const [html, setHtml] = useState(
    "<h2>Release notes</h2><p>We shipped a <strong>themeable</strong> editor with a full toolbar — try <em>bold</em>, lists, and headings.</p><ul><li>Keyboard shortcuts</li><li>Undo &amp; redo</li></ul>",
  );

  return (
    <RichTextEditor
      value={html}
      onChange={setHtml}
      placeholder="Write something…"
      aria-label="Post body"
      className="max-w-xl"
    />
  );
}

const richTextEditorDemoCode = `function RichTextEditorDemo() {
  const [html, setHtml] = useState(
    "<h2>Release notes</h2><p>We shipped a <strong>themeable</strong> editor with a full toolbar — try <em>bold</em>, lists, and headings.</p><ul><li>Keyboard shortcuts</li><li>Undo &amp; redo</li></ul>",
  );

  return (
    <RichTextEditor
      value={html}
      onChange={setHtml}
      placeholder="Write something…"
      aria-label="Post body"
      className="max-w-xl"
    />
  );
}`;

export const formsExamples: ExampleMap = {
  input: [
    {
      id: "default",
      title: "Default",
      description: "A single-line text input.",
      code: `<Input placeholder="you@cooud.dev" />`,
      preview: <Input placeholder="you@cooud.dev" className="max-w-xs" />,
    },
    {
      id: "invalid-state",
      title: "Invalid state",
      description:
        "Set `invalid` and pair it with a FieldError for accessible validation feedback.",
      code: `<Field>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input
    id="email"
    invalid
    defaultValue="not-an-email"
    aria-describedby="email-err"
  />
  <FieldError id="email-err">Enter a valid email address.</FieldError>
</Field>`,
      preview: (
        <Field className="max-w-xs">
          <FieldLabel htmlFor="ex-email">Email</FieldLabel>
          <Input
            id="ex-email"
            invalid
            defaultValue="not-an-email"
            aria-describedby="ex-email-err"
          />
          <FieldError id="ex-email-err">Enter a valid email address.</FieldError>
        </Field>
      ),
    },
    {
      id: "disabled",
      title: "Disabled",
      description: "A non-interactive input.",
      code: `<Input placeholder="Disabled" disabled />`,
      preview: <Input placeholder="Disabled" disabled className="max-w-xs" />,
    },
  ],
  textarea: [
    {
      id: "default",
      title: "Default",
      description: "A multi-line text input.",
      code: `<Textarea placeholder="Tell us what you're building…" rows={4} />`,
      preview: (
        <Textarea placeholder="Tell us what you're building…" rows={4} className="max-w-md" />
      ),
    },
    {
      id: "invalid",
      title: "Invalid",
      description: "An invalid textarea paired with a FieldError.",
      code: `<Field>
  <FieldLabel htmlFor="bio">Bio</FieldLabel>
  <Textarea
    id="bio"
    invalid
    rows={4}
    defaultValue="…"
    aria-describedby="bio-err"
  />
  <FieldError id="bio-err">This value isn't allowed.</FieldError>
</Field>`,
      preview: (
        <Field className="max-w-md">
          <FieldLabel htmlFor="ex-bio">Bio</FieldLabel>
          <Textarea id="ex-bio" invalid rows={4} defaultValue="…" aria-describedby="ex-bio-err" />
          <FieldError id="ex-bio-err">This value isn't allowed.</FieldError>
        </Field>
      ),
    },
  ],
  label: [
    {
      id: "with-input",
      title: "With input",
      description: "Tie a Label to an Input via matching `htmlFor` and `id`.",
      code: `<div className="flex flex-col gap-1.5">
  <Label htmlFor="workspace">Workspace name</Label>
  <Input id="workspace" placeholder="acme-inc" />
</div>`,
      preview: (
        <div className="flex max-w-xs flex-col gap-1.5">
          <Label htmlFor="ex-workspace">Workspace name</Label>
          <Input id="ex-workspace" placeholder="acme-inc" />
        </div>
      ),
    },
  ],
  checkbox: [
    {
      id: "default",
      title: "Default",
      description: "A controlled checkbox with an associated Label.",
      code: checkboxDemoCode,
      preview: <CheckboxDemo />,
    },
    {
      id: "disabled",
      title: "Disabled",
      description: "A non-interactive checkbox.",
      code: `<div className="flex items-center gap-3">
  <Checkbox id="disabled" disabled />
  <Label htmlFor="disabled">Unavailable option</Label>
</div>`,
      preview: (
        <div className="flex items-center gap-3">
          <Checkbox id="ex-disabled" disabled />
          <Label htmlFor="ex-disabled">Unavailable option</Label>
        </div>
      ),
    },
  ],
  "radio-group": [
    {
      id: "options",
      title: "Options",
      description: "A single-choice list of mutually exclusive options with labels and hints.",
      code: radioGroupDemoCode,
      preview: <RadioGroupDemo />,
    },
  ],
  switch: [
    {
      id: "default",
      title: "Default",
      description: "A controlled switch with an associated Label.",
      code: switchDemoCode,
      preview: <SwitchDemo />,
    },
  ],
  select: [
    {
      id: "grouped",
      title: "Grouped",
      description: "A grouped dropdown with labels, items, and a separator.",
      code: selectDemoCode,
      preview: <SelectDemo />,
    },
  ],
  combobox: [
    {
      id: "single-select",
      title: "Single select",
      description: "A searchable, single-value picker built on Command inside a Popover.",
      code: comboboxDemoCode,
      preview: <ComboboxDemo />,
    },
  ],
  "multi-select": [
    {
      id: "default",
      title: "Default",
      description: "Select multiple values; each shows as a removable chip in the trigger.",
      code: multiSelectDemoCode,
      preview: <MultiSelectDemo />,
    },
    {
      id: "max-display",
      title: "Max display",
      description: "Cap visible chips with `maxDisplay`; the rest collapse into a +N badge.",
      code: multiSelectMaxDisplayDemoCode,
      preview: <MultiSelectMaxDisplayDemo />,
    },
  ],
  "tags-input": [
    {
      id: "default",
      title: "Default",
      description:
        "Type free-form tags and commit each with Enter or comma; they render as removable chips. Backspace on an empty field deletes the last tag, and `max` caps the total.",
      code: tagsInputDemoCode,
      preview: <TagsInputDemo />,
    },
  ],
  "input-group": [
    {
      id: "prefix-suffix",
      title: "Prefix & suffix",
      description:
        "Flank an `Input` with `InputGroupAddon`s on either side. The group owns the border and focus ring, so a protocol prefix and a domain suffix read as one seamless field.",
      code: inputGroupUrlCode,
      preview: (
        <InputGroup className="max-w-sm">
          <InputGroupAddon>
            <Link2 />
            https://
          </InputGroupAddon>
          <Input placeholder="acme.cooud.app" />
          <InputGroupAddon align="end">.cooud.app</InputGroupAddon>
        </InputGroup>
      ),
    },
    {
      id: "icon-addon",
      title: "Leading icon",
      description: "A single leading addon is perfect for an icon that frames the field's purpose.",
      code: inputGroupEmailCode,
      preview: (
        <InputGroup className="max-w-sm">
          <InputGroupAddon>
            <AtSign />
          </InputGroupAddon>
          <Input type="email" placeholder="you@company.com" />
        </InputGroup>
      ),
    },
  ],
  "password-input": [
    {
      id: "default",
      title: "Default",
      description:
        "A password field with a built-in show/hide toggle. The toggle flips the input type and stays keyboard-accessible with a clear pressed state.",
      code: passwordInputBasicCode,
      preview: (
        <PasswordInput
          className="max-w-sm"
          placeholder="Enter your password"
          autoComplete="current-password"
        />
      ),
    },
    {
      id: "strength-meter",
      title: "Strength meter",
      description:
        "Pass `showStrength` to render a 4-segment meter and label that update live from the value's length and character variety.",
      code: passwordInputStrengthDemoCode,
      preview: <PasswordInputStrengthDemo />,
    },
  ],
  slider: [
    {
      id: "single-thumb",
      title: "Single thumb",
      description: "A controlled single-value slider.",
      code: sliderDemoCode,
      preview: <SliderDemo />,
    },
    {
      id: "range",
      title: "Range",
      description: "A two-thumb slider bound to a [min, max] tuple.",
      code: sliderRangeDemoCode,
      preview: <SliderRangeDemo />,
    },
  ],
  field: [
    {
      id: "composition",
      title: "Composition",
      description: "Compose FieldLabel, FieldDescription, and an Input inside a Field.",
      code: `<Field>
  <FieldLabel htmlFor="workspace">Workspace name</FieldLabel>
  <Input
    id="workspace"
    placeholder="acme-inc"
    aria-describedby="workspace-desc"
  />
  <FieldDescription id="workspace-desc">
    Used in your workspace URL. Letters, numbers, and dashes.
  </FieldDescription>
</Field>`,
      preview: (
        <Field className="max-w-sm">
          <FieldLabel htmlFor="ex-ws">Workspace name</FieldLabel>
          <Input id="ex-ws" placeholder="acme-inc" aria-describedby="ex-ws-desc" />
          <FieldDescription id="ex-ws-desc">
            Used in your workspace URL. Letters, numbers, and dashes.
          </FieldDescription>
        </Field>
      ),
    },
    {
      id: "with-error",
      title: "With error",
      description: "A Field that surfaces an inline FieldError as the value changes.",
      code: fieldErrorDemoCode,
      preview: <FieldErrorDemo />,
    },
  ],
  form: [
    {
      id: "validated-form",
      title: "Validated form",
      description: "A form wired with react-hook-form and a zod schema.",
      code: formDemoCode,
      preview: <FormDemo />,
    },
  ],
  "input-otp": [
    {
      id: "six-digit",
      title: "6-digit",
      description: "A six-digit one-time-code input with a separator after the third slot.",
      code: inputOTPDemoCode,
      preview: <InputOTPDemo />,
    },
  ],
  "file-dropzone": [
    {
      id: "upload",
      title: "Upload",
      description: "Drag-and-drop or click-to-browse uploads with selected-file feedback.",
      code: fileDropzoneDemoCode,
      preview: <FileDropzoneDemo />,
    },
  ],

  "number-input": [
    {
      id: "default",
      title: "Default",
      description:
        "A spinbutton with increment/decrement steppers. Arrow keys step, PageUp/PageDown jump, and Home/End snap to `min`/`max`. Values are clamped to the bounds on blur.",
      code: numberInputDemoCode,
      preview: <NumberInputDemo />,
    },
    {
      id: "precision-format",
      title: "Precision & formatting",
      description:
        "Use `precision` for decimal rounding and `format` to display a unit such as currency when the field is not focused.",
      code: numberInputCurrencyDemoCode,
      preview: <NumberInputCurrencyDemo />,
    },
  ],

  autocomplete: [
    {
      id: "default",
      title: "Default",
      description:
        "Free-text input that filters a static `options` list as you type. Arrow keys move the highlight, Enter commits it, and Escape dismisses the suggestions.",
      code: autocompleteDemoCode,
      preview: <AutocompleteDemo />,
    },
    {
      id: "async",
      title: "Async suggestions",
      description:
        "Pass `onSearch` to resolve suggestions remotely. Calls are debounced, stale responses are dropped, and the busy state (spinner + skeletons) is managed for you.",
      code: autocompleteAsyncDemoCode,
      preview: <AutocompleteAsyncDemo />,
    },
  ],

  stepper: [
    {
      id: "wizard",
      title: "Wizard",
      description:
        "A three-step flow with clickable steps. The indicator checks off completed steps; Back / Next drive the active value.",
      code: `const STEPPER_STEPS = [
  { title: "Account", description: "Your details" },
  { title: "Shipping", description: "Where to send it" },
  { title: "Payment", description: "Confirm & pay" },
];

function StepperDemo() {
  const [step, setStep] = useState(1);
  const lastStep = STEPPER_STEPS.length - 1;

  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <Stepper value={step} onValueChange={setStep}>
        <StepperList>
          {STEPPER_STEPS.map((item, index) => (
            <StepperItem key={item.title} step={index}>
              <StepperTrigger>
                <StepperIndicator />
                <span className="flex flex-col">
                  <StepperTitle>{item.title}</StepperTitle>
                  <StepperDescription>{item.description}</StepperDescription>
                </span>
              </StepperTrigger>
              {index < lastStep ? <StepperSeparator /> : null}
            </StepperItem>
          ))}
        </StepperList>
      </Stepper>
      <div className="flex justify-between">
        <Button
          variant="outline"
          disabled={step === 0}
          onClick={() => setStep((value) => Math.max(0, value - 1))}
        >
          Back
        </Button>
        <Button
          disabled={step === lastStep}
          onClick={() => setStep((value) => Math.min(lastStep, value + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
}`,
      preview: <StepperDemo />,
    },
  ],

  "rich-text-editor": [
    {
      id: "default",
      title: "Default",
      description:
        "A Tiptap WYSIWYG editor with a Cooud-styled toolbar. Controlled via `value` / `onChange` (serialized HTML); `immediatelyRender: false` keeps it SSR-safe. Formats text, headings, lists, quotes, and code.",
      code: richTextEditorDemoCode,
      preview: <RichTextEditorDemo />,
    },
  ],

  rating: [
    {
      id: "interactive",
      title: "Interactive",
      description:
        "A controlled star rating. Click or use the arrow keys to set the value; the wrapper is a single focusable slider so it stays keyboard- and screen-reader-friendly.",
      code: ratingDemoCode,
      preview: <RatingDemo />,
    },
    {
      id: "read-only",
      title: "Read-only with a count",
      description:
        "Display an aggregate score with `readOnly` and `allowHalf`, paired with the review count.",
      code: `<div className="flex items-center gap-2">
  <Rating value={4.5} readOnly allowHalf size="sm" aria-label="Rated 4.5 out of 5" />
  <span className="text-sm text-fg-secondary">4.5 · 1,284 reviews</span>
</div>`,
      preview: (
        <div className="flex items-center gap-2">
          <Rating value={4.5} readOnly allowHalf size="sm" aria-label="Rated 4.5 out of 5" />
          <span className="text-sm text-fg-secondary">4.5 · 1,284 reviews</span>
        </div>
      ),
    },
  ],

  "color-picker": [
    {
      id: "swatches",
      title: "With swatches",
      description:
        "A controlled OKLCH color input on a popover — drag the area and hue slider, type any channel or the full oklch() string, or pick one of the preset swatches.",
      code: colorPickerDemoCode,
      preview: <ColorPickerDemo />,
    },
  ],
};

/**
 * Default-export view for this family. Imported lazily per-slug by the
 * `/components/[slug]` detail route, so visiting one component only loads this
 * family chunk (not the whole catalog).
 */
export default function FormsExamples({ slug }: { slug: string }) {
  return <ExampleList examples={formsExamples[slug] ?? []} />;
}
