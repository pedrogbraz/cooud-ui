"use client";

import {
  Badge,
  Button,
  Checkbox,
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
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  Label,
  MultiSelect,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Slider,
  Switch,
  Textarea,
} from "@cooud/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, FileText } from "lucide-react";
import { useState } from "react";
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
};

/**
 * Default-export view for this family. Imported lazily per-slug by the
 * `/components/[slug]` detail route, so visiting one component only loads this
 * family chunk (not the whole catalog).
 */
export default function FormsExamples({ slug }: { slug: string }) {
  return <ExampleList examples={formsExamples[slug] ?? []} />;
}
