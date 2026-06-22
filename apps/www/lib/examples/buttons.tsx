"use client";

import { AnimatedButton, Button, Spinner, Toggle, ToggleGroup, ToggleGroupItem } from "@cooud/ui";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowRight,
  Bold,
  Download,
  Heart,
  Italic,
  Settings,
  Underline,
} from "lucide-react";
import { useState } from "react";
import { ExampleList } from "../../components/docs/example-list";
import type { ExampleMap } from "./types";

/* -------------------------------------------------------------------------- */
/*  Stateful demos                                                            */
/* -------------------------------------------------------------------------- */

function ToggleDemo() {
  const [bold, setBold] = useState(false);
  return (
    <Toggle pressed={bold} onPressedChange={setBold} aria-label="Toggle bold">
      <Bold />
      Bold
    </Toggle>
  );
}

function ToggleSizesDemo() {
  const [pressed, setPressed] = useState(true);
  return (
    <div className="flex items-center gap-3">
      <Toggle size="sm" pressed={pressed} onPressedChange={setPressed} aria-label="Bold (small)">
        <Bold />
      </Toggle>
      <Toggle size="md" pressed={pressed} onPressedChange={setPressed} aria-label="Bold (medium)">
        <Bold />
      </Toggle>
      <Toggle size="lg" pressed={pressed} onPressedChange={setPressed} aria-label="Bold (large)">
        <Bold />
      </Toggle>
    </div>
  );
}

function ToggleOutlineDemo() {
  const [italic, setItalic] = useState(false);
  return (
    <Toggle
      variant="outline"
      pressed={italic}
      onPressedChange={setItalic}
      aria-label="Toggle italic"
    >
      <Italic />
      Italic
    </Toggle>
  );
}

function ToggleGroupSingleDemo() {
  const [align, setAlign] = useState("left");
  return (
    <ToggleGroup
      type="single"
      value={align}
      onValueChange={(value) => {
        if (value) setAlign(value);
      }}
    >
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

function ToggleGroupMultipleDemo() {
  const [formats, setFormats] = useState<string[]>(["bold"]);
  return (
    <ToggleGroup type="multiple" value={formats} onValueChange={setFormats}>
      <ToggleGroupItem value="bold" aria-label="Bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

/* -------------------------------------------------------------------------- */
/*  Examples                                                                  */
/* -------------------------------------------------------------------------- */

export const buttonsExamples: ExampleMap = {
  button: [
    {
      id: "variants",
      title: "Variants",
      description: "Seven visual styles, from the primary call-to-action down to a subtle link.",
      code: `<div className="flex flex-wrap items-center gap-3">
  <Button variant="primary">Primary</Button>
  <Button variant="gradient">Gradient</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="destructive">Destructive</Button>
  <Button variant="link">Link</Button>
</div>`,
      preview: (
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="gradient">Gradient</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      ),
    },
    {
      id: "sizes",
      title: "Sizes",
      description: "Three text sizes plus square icon sizes for toolbar-style actions.",
      code: `<div className="flex flex-wrap items-center gap-3">
  <Button size="sm">Small</Button>
  <Button size="md">Medium</Button>
  <Button size="lg">Large</Button>
  <Button size="icon" aria-label="Settings">
    <Settings />
  </Button>
  <Button size="icon-sm" aria-label="Settings">
    <Settings />
  </Button>
</div>`,
      preview: (
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Settings">
            <Settings />
          </Button>
          <Button size="icon-sm" aria-label="Settings">
            <Settings />
          </Button>
        </div>
      ),
    },
    {
      id: "with-icons",
      title: "With icons",
      description:
        "Icons sit inline with the label. Use a Spinner for loading state and disable to block input.",
      code: `<div className="flex flex-wrap items-center gap-3">
  <Button>
    <Download />
    Download
  </Button>
  <Button variant="secondary">
    Continue
    <ArrowRight />
  </Button>
  <Button variant="outline">
    <Heart />
    Like
  </Button>
  <Button disabled>
    <Heart />
    Disabled
  </Button>
  <Button disabled>
    <Spinner size="sm" aria-hidden="true" />
    Saving
  </Button>
</div>`,
      preview: (
        <div className="flex flex-wrap items-center gap-3">
          <Button>
            <Download />
            Download
          </Button>
          <Button variant="secondary">
            Continue
            <ArrowRight />
          </Button>
          <Button variant="outline">
            <Heart />
            Like
          </Button>
          <Button disabled>
            <Heart />
            Disabled
          </Button>
          <Button disabled>
            <Spinner size="sm" aria-hidden="true" />
            Saving
          </Button>
        </div>
      ),
    },
    {
      id: "as-link",
      title: "As link",
      description:
        "Use `asChild` to render the button styles on another element, such as an anchor.",
      code: `<Button asChild>
  <a href="/docs">
    Read the docs
    <ArrowRight />
  </a>
</Button>`,
      preview: (
        <Button asChild>
          <a href="/docs">
            Read the docs
            <ArrowRight />
          </a>
        </Button>
      ),
    },
  ],

  "animated-button": [
    {
      id: "spring-feedback",
      title: "Spring feedback",
      description:
        "Drop-in replacement for Button that lifts on hover and presses in on tap with a snappy spring.",
      code: `<div className="flex flex-wrap items-center gap-3">
  <AnimatedButton variant="primary">Primary</AnimatedButton>
  <AnimatedButton variant="gradient">Gradient</AnimatedButton>
  <AnimatedButton variant="outline">Outline</AnimatedButton>
  <AnimatedButton variant="secondary">
    <Download />
    Download
  </AnimatedButton>
</div>`,
      preview: (
        <div className="flex flex-wrap items-center gap-3">
          <AnimatedButton variant="primary">Primary</AnimatedButton>
          <AnimatedButton variant="gradient">Gradient</AnimatedButton>
          <AnimatedButton variant="outline">Outline</AnimatedButton>
          <AnimatedButton variant="secondary">
            <Download />
            Download
          </AnimatedButton>
        </div>
      ),
    },
  ],

  toggle: [
    {
      id: "default",
      title: "Default",
      description: "A two-state button. Control it with `pressed` and `onPressedChange`.",
      code: `const [bold, setBold] = useState(false);

return (
  <Toggle pressed={bold} onPressedChange={setBold} aria-label="Toggle bold">
    <Bold />
    Bold
  </Toggle>
);`,
      preview: <ToggleDemo />,
    },
    {
      id: "outline",
      title: "Outline variant",
      description: "The outline variant keeps a visible border in both states.",
      code: `const [italic, setItalic] = useState(false);

return (
  <Toggle
    variant="outline"
    pressed={italic}
    onPressedChange={setItalic}
    aria-label="Toggle italic"
  >
    <Italic />
    Italic
  </Toggle>
);`,
      preview: <ToggleOutlineDemo />,
    },
    {
      id: "sizes",
      title: "Sizes",
      description: "Toggles come in three sizes to match surrounding controls.",
      code: `const [pressed, setPressed] = useState(true);

return (
  <div className="flex items-center gap-3">
    <Toggle size="sm" pressed={pressed} onPressedChange={setPressed} aria-label="Bold (small)">
      <Bold />
    </Toggle>
    <Toggle size="md" pressed={pressed} onPressedChange={setPressed} aria-label="Bold (medium)">
      <Bold />
    </Toggle>
    <Toggle size="lg" pressed={pressed} onPressedChange={setPressed} aria-label="Bold (large)">
      <Bold />
    </Toggle>
  </div>
);`,
      preview: <ToggleSizesDemo />,
    },
  ],

  "toggle-group": [
    {
      id: "single",
      title: "Single",
      description:
        'With `type="single"` exactly one item is selected at a time — ideal for text alignment.',
      code: `const [align, setAlign] = useState("left");

return (
  <ToggleGroup
    type="single"
    value={align}
    onValueChange={(value) => {
      if (value) setAlign(value);
    }}
  >
    <ToggleGroupItem value="left" aria-label="Align left">
      <AlignLeft />
    </ToggleGroupItem>
    <ToggleGroupItem value="center" aria-label="Align center">
      <AlignCenter />
    </ToggleGroupItem>
    <ToggleGroupItem value="right" aria-label="Align right">
      <AlignRight />
    </ToggleGroupItem>
  </ToggleGroup>
);`,
      preview: <ToggleGroupSingleDemo />,
    },
    {
      id: "multiple",
      title: "Multiple",
      description:
        'With `type="multiple"` any number of items can be active — perfect for text formatting.',
      code: `const [formats, setFormats] = useState<string[]>(["bold"]);

return (
  <ToggleGroup type="multiple" value={formats} onValueChange={setFormats}>
    <ToggleGroupItem value="bold" aria-label="Bold">
      <Bold />
    </ToggleGroupItem>
    <ToggleGroupItem value="italic" aria-label="Italic">
      <Italic />
    </ToggleGroupItem>
    <ToggleGroupItem value="underline" aria-label="Underline">
      <Underline />
    </ToggleGroupItem>
  </ToggleGroup>
);`,
      preview: <ToggleGroupMultipleDemo />,
    },
  ],
};

/**
 * Default-export view for the buttons family. Imported lazily per-slug by the
 * `/components/[slug]` detail route, so visiting one component only loads this
 * family chunk (not the whole catalog).
 */
export default function ButtonsExamples({ slug }: { slug: string }) {
  return <ExampleList examples={buttonsExamples[slug] ?? []} />;
}
