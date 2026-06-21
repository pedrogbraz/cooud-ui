import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  Skeleton,
  Spinner,
} from "@cooud/ui";
import { ArrowRight, Check, Download, Heart, Settings, Sparkles, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { Cluster, Section, Subcard } from "./showcase-ui";

const buttonVariants = [
  "primary",
  "gradient",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const;

const badgeVariants = [
  "default",
  "primary",
  "secondary",
  "outline",
  "success",
  "warning",
  "error",
  "info",
] as const;

export function ComponentGallery() {
  return (
    <div className="flex flex-col gap-10">
      {/* BUTTONS */}
      <Section
        title="Buttons"
        description="Seven variants, five sizes, icons, and polymorphic asChild rendering."
      >
        <div className="flex flex-col gap-6">
          <Cluster label="Variants">
            {buttonVariants.map((variant) => (
              <Button key={variant} variant={variant}>
                {variant === "gradient" && <Sparkles aria-hidden="true" />}
                {capitalize(variant)}
              </Button>
            ))}
          </Cluster>

          <Cluster label="Sizes">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" aria-label="Settings">
              <Settings aria-hidden="true" />
            </Button>
            <Button size="icon-sm" variant="outline" aria-label="Settings">
              <Settings aria-hidden="true" />
            </Button>
          </Cluster>

          <Cluster label="With icons & states">
            <Button>
              <Download aria-hidden="true" />
              Download
            </Button>
            <Button variant="outline">
              Continue
              <ArrowRight aria-hidden="true" />
            </Button>
            <Button variant="secondary">
              <Heart aria-hidden="true" />
              Like
            </Button>
            <Button disabled>
              <Spinner size="sm" aria-hidden="true" />
              Loading
            </Button>
            <Button variant="destructive" disabled>
              <Trash2 aria-hidden="true" />
              Disabled
            </Button>
            <Button asChild variant="link">
              <a href="#buttons">As a link</a>
            </Button>
          </Cluster>
        </div>
      </Section>

      {/* BADGES */}
      <Section
        title="Badges"
        description="Compact status and category labels across the semantic palette."
      >
        <Cluster>
          {badgeVariants.map((variant) => (
            <Badge key={variant} variant={variant}>
              {capitalize(variant)}
            </Badge>
          ))}
          <Badge variant="success">
            <Check aria-hidden="true" />
            Verified
          </Badge>
        </Cluster>
      </Section>

      {/* INPUTS */}
      <Section
        title="Inputs"
        description="Accessible text fields with labels, validation, and disabled states."
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <Field>
            <Label htmlFor="g-email">Email</Label>
            <Input id="g-email" type="email" placeholder="you@cooud.dev" />
            <Hint>We'll never share your address.</Hint>
          </Field>

          <Field>
            <Label htmlFor="g-name">Display name</Label>
            <Input id="g-name" placeholder="Ada Lovelace" defaultValue="Cooud" />
            <Hint>This is how others will see you.</Hint>
          </Field>

          <Field>
            <Label htmlFor="g-handle">Handle</Label>
            <Input
              id="g-handle"
              invalid
              defaultValue="!! invalid"
              aria-describedby="g-handle-err"
            />
            <Hint id="g-handle-err" tone="error">
              Handles may only contain letters and numbers.
            </Hint>
          </Field>

          <Field>
            <Label htmlFor="g-locked">API key</Label>
            <Input id="g-locked" disabled defaultValue="sk_live_••••••••" />
            <Hint>Disabled — managed by your workspace owner.</Hint>
          </Field>
        </div>
      </Section>

      {/* CARD */}
      <Section
        title="Card"
        description="A composable container with header, action, content, and footer slots."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Pro plan</CardTitle>
              <CardDescription>Everything you need to ship a polished product.</CardDescription>
              <CardAction>
                <Badge variant="primary">Popular</Badge>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-baseline gap-1">
                <span className="font-display text-3xl font-semibold text-fg">$24</span>
                <span className="text-sm text-fg-tertiary">/ month</span>
              </div>
              <ul className="flex flex-col gap-2 text-sm">
                {["Unlimited projects", "Priority support", "Team analytics"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-fg-secondary">
                    <Check className="size-4 text-success" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="gradient" className="w-full">
                Upgrade now
              </Button>
            </CardFooter>
          </Card>

          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Deploy status</CardTitle>
              <CardDescription>Production · us-east-1</CardDescription>
              <CardAction>
                <Badge variant="success">Live</Badge>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Spinner aria-label="Deploying" />
                <span className="text-sm text-fg-secondary">Rolling out v2.4.0…</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-fg-tertiary">Last deploy</span>
                <span className="font-mono text-fg">2m ago</span>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="ghost" size="sm">
                View logs
              </Button>
              <Button variant="outline" size="sm">
                Roll back
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Section>

      {/* FEEDBACK */}
      <Section
        title="Feedback"
        description="Spinners, skeleton placeholders, and separators for loading and layout."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <Subcard label="Spinner">
            <div className="flex items-center gap-6">
              <Spinner size="sm" aria-label="Loading small" />
              <Spinner size="md" aria-label="Loading medium" />
              <Spinner size="lg" aria-label="Loading large" />
            </div>
          </Subcard>

          <Subcard label="Skeleton">
            <div className="flex items-center gap-3">
              <Skeleton className="size-12 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-3 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-1/2 rounded-md" />
              </div>
            </div>
          </Subcard>

          <Subcard label="Separator">
            <div className="flex flex-col gap-3">
              <span className="text-sm text-fg-secondary">Section A</span>
              <Separator />
              <span className="text-sm text-fg-secondary">Section B</span>
              <div className="flex h-10 items-center gap-3 text-sm text-fg-secondary">
                <span>Docs</span>
                <Separator orientation="vertical" />
                <span>API</span>
                <Separator orientation="vertical" />
                <span>Blog</span>
              </div>
            </div>
          </Subcard>
        </div>
      </Section>
    </div>
  );
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function Field({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

function Hint({
  children,
  tone = "muted",
  id,
}: {
  children: ReactNode;
  tone?: "muted" | "error";
  id?: string;
}) {
  return (
    <p id={id} className={tone === "error" ? "text-xs text-error" : "text-xs text-fg-tertiary"}>
      {children}
    </p>
  );
}
