"use client";

import {
  Badge,
  Button,
  Checkbox,
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
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
} from "@cooud/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bold, Check, FileText, Italic, Underline } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Cluster, Section, Subcard } from "./showcase-ui";

const profileSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  bio: z.string().min(10, "Bio must be at least 10 characters."),
});

type ProfileValues = z.infer<typeof profileSchema>;

export function FormsGallery() {
  return (
    <div className="mt-10 flex flex-col gap-10">
      <TextInputsSection />
      <ChoiceSection />
      <RadioSection />
      <SelectSection />
      <SliderSection />
      <ToggleSection />
      <FieldSection />
      <OtpSection />
      <DropzoneSection />
      <FormSection />
    </div>
  );
}

// ── 1. Text inputs ─────────────────────────────────────────────────
function TextInputsSection() {
  const [normal, setNormal] = useState("");
  const [invalid, setInvalid] = useState("not-a-valid-value");

  return (
    <Section
      title="Textarea"
      description="Multi-line text input with a validation-aware invalid state."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="f-bio">Message</FieldLabel>
          <Textarea
            id="f-bio"
            placeholder="Tell us what you're building…"
            rows={4}
            value={normal}
            onChange={(event) => setNormal(event.target.value)}
          />
          <FieldDescription>{normal.length} characters</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="f-bio-invalid">Message (invalid)</FieldLabel>
          <Textarea
            id="f-bio-invalid"
            invalid
            rows={4}
            value={invalid}
            aria-describedby="f-bio-invalid-err"
            onChange={(event) => setInvalid(event.target.value)}
          />
          <FieldError id="f-bio-invalid-err">This value isn't allowed.</FieldError>
        </Field>
      </div>
    </Section>
  );
}

// ── 2. Checkbox + Switch ───────────────────────────────────────────
function ChoiceSection() {
  const [terms, setTerms] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [marketing, setMarketing] = useState(false);

  return (
    <Section
      title="Checkbox & Switch"
      description="Controlled boolean inputs with accessible labels."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Subcard label="Checkbox">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Checkbox
                id="f-terms"
                checked={terms}
                onCheckedChange={(value) => setTerms(value === true)}
              />
              <Label htmlFor="f-terms">Accept terms &amp; conditions</Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="f-newsletter"
                checked={newsletter}
                onCheckedChange={(value) => setNewsletter(value === true)}
              />
              <Label htmlFor="f-newsletter">Subscribe to the newsletter</Label>
            </div>
          </div>
        </Subcard>

        <Subcard label="Switch">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="f-notifications">Push notifications</Label>
              <Switch
                id="f-notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="f-marketing">Marketing emails</Label>
              <Switch id="f-marketing" checked={marketing} onCheckedChange={setMarketing} />
            </div>
          </div>
        </Subcard>
      </div>
    </Section>
  );
}

// ── 3. RadioGroup ──────────────────────────────────────────────────
function RadioSection() {
  const [plan, setPlan] = useState("pro");

  const options = [
    { value: "starter", label: "Starter", hint: "For side projects" },
    { value: "pro", label: "Pro", hint: "For growing teams" },
    { value: "enterprise", label: "Enterprise", hint: "For large organizations" },
  ];

  return (
    <Section title="Radio Group" description="A single-choice list of mutually exclusive options.">
      <RadioGroup value={plan} onValueChange={setPlan} className="flex flex-col gap-3">
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-3">
            <RadioGroupItem value={option.value} id={`f-plan-${option.value}`} />
            <Label htmlFor={`f-plan-${option.value}`} className="flex flex-col gap-0.5">
              <span>{option.label}</span>
              <span className="text-xs font-normal text-fg-tertiary">{option.hint}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </Section>
  );
}

// ── 4. Select ──────────────────────────────────────────────────────
function SelectSection() {
  const [region, setRegion] = useState<string | undefined>();

  return (
    <Section title="Select" description="A grouped dropdown with labels, items, and a separator.">
      <Field className="max-w-xs">
        <Label htmlFor="f-region">Deploy region</Label>
        <Select value={region ?? ""} onValueChange={setRegion}>
          <SelectTrigger id="f-region">
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
    </Section>
  );
}

// ── 5. Slider ──────────────────────────────────────────────────────
function SliderSection() {
  const [volume, setVolume] = useState([40]);
  const [price, setPrice] = useState([20, 80]);

  return (
    <Section title="Slider" description="Single-thumb and two-thumb range sliders.">
      <div className="grid gap-8 sm:grid-cols-2">
        <Subcard label="Single thumb">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-sm">
              <Label>Volume</Label>
              <span className="font-mono text-fg">{volume[0]}%</span>
            </div>
            <Slider value={volume} onValueChange={setVolume} min={0} max={100} step={1} />
          </div>
        </Subcard>

        <Subcard label="Range">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-sm">
              <Label>Price range</Label>
              <span className="font-mono text-fg">
                ${price[0]} – ${price[1]}
              </span>
            </div>
            <Slider value={price} onValueChange={setPrice} min={0} max={100} step={5} />
          </div>
        </Subcard>
      </div>
    </Section>
  );
}

// ── 6. Toggle + ToggleGroup ────────────────────────────────────────
function ToggleSection() {
  const [bold, setBold] = useState(false);
  const [alignment, setAlignment] = useState("left");
  const [formatting, setFormatting] = useState<string[]>(["bold"]);

  return (
    <Section
      title="Toggle & Toggle Group"
      description="Pressable controls — standalone, single-select, and multi-select."
    >
      <div className="flex flex-col gap-6">
        <Cluster label="Toggle">
          <Toggle pressed={bold} onPressedChange={setBold} aria-label="Toggle bold">
            <Bold aria-hidden="true" />
            Bold
          </Toggle>
          <Toggle variant="outline" aria-label="Toggle italic">
            <Italic aria-hidden="true" />
            Italic
          </Toggle>
        </Cluster>

        <Cluster label="Toggle group · single">
          <ToggleGroup
            type="single"
            variant="outline"
            value={alignment}
            onValueChange={(value) => value && setAlignment(value)}
          >
            <ToggleGroupItem value="left">Left</ToggleGroupItem>
            <ToggleGroupItem value="center">Center</ToggleGroupItem>
            <ToggleGroupItem value="right">Right</ToggleGroupItem>
          </ToggleGroup>
          <span className="text-sm text-fg-tertiary">Aligned: {alignment}</span>
        </Cluster>

        <Cluster label="Toggle group · multiple">
          <ToggleGroup type="multiple" value={formatting} onValueChange={setFormatting}>
            <ToggleGroupItem value="bold" aria-label="Bold">
              <Bold aria-hidden="true" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              <Italic aria-hidden="true" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline">
              <Underline aria-hidden="true" />
            </ToggleGroupItem>
          </ToggleGroup>
          <span className="text-sm text-fg-tertiary">
            {formatting.length > 0 ? formatting.join(", ") : "none"}
          </span>
        </Cluster>
      </div>
    </Section>
  );
}

// ── 7. Field composition ───────────────────────────────────────────
function FieldSection() {
  const [username, setUsername] = useState("");
  const error = username.includes(" ") ? "Username can't contain spaces." : "";

  return (
    <Section
      title="Field"
      description="Composable field primitives: label, description, and inline error."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="f-workspace">Workspace name</FieldLabel>
          <Input id="f-workspace" placeholder="acme-inc" aria-describedby="f-workspace-desc" />
          <FieldDescription id="f-workspace-desc">
            Used in your workspace URL. Letters, numbers, and dashes.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="f-username">Username</FieldLabel>
          <Input
            id="f-username"
            value={username}
            invalid={!!error}
            placeholder="ada"
            aria-describedby={error ? "f-username-err" : undefined}
            onChange={(event) => setUsername(event.target.value)}
          />
          <FieldError id="f-username-err">{error}</FieldError>
        </Field>
      </div>
    </Section>
  );
}

// ── 8. InputOTP ────────────────────────────────────────────────────
function OtpSection() {
  const [otp, setOtp] = useState("");

  return (
    <Section
      title="Input OTP"
      description="A six-digit one-time-code input with a separator after the third slot."
    >
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
        <p className="text-xs text-fg-tertiary">
          {otp.length === 6 ? (
            <Badge variant="success">
              <Check aria-hidden="true" />
              Code complete
            </Badge>
          ) : (
            `Entered ${otp.length} of 6 digits.`
          )}
        </p>
      </div>
    </Section>
  );
}

// ── 9. FileDropzone ────────────────────────────────────────────────
function DropzoneSection() {
  const [files, setFiles] = useState<string[]>([]);

  return (
    <Section
      title="File Dropzone"
      description="Drag-and-drop or click-to-browse uploads with selected-file feedback."
    >
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
    </Section>
  );
}

// ── 10. Form (react-hook-form + zod) ───────────────────────────────
function FormSection() {
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
    <Section
      title="Form"
      description="A validated form wired with react-hook-form and a zod schema."
    >
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
    </Section>
  );
}
