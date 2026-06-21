"use client";

import {
  Badge,
  Button,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@cooud/ui";
import {
  CalendarDays,
  Copy,
  CreditCard,
  HelpCircle,
  Keyboard,
  LifeBuoy,
  Plus,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { ExampleMap } from "./types";

function ActionsMenuDemo() {
  const [showStatusBar, setShowStatusBar] = useState(true);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User aria-hidden="true" />
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard aria-hidden="true" />
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings aria-hidden="true" />
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={showStatusBar} onCheckedChange={setShowStatusBar}>
          Show status bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Users aria-hidden="true" />
            Invite team
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <UserPlus aria-hidden="true" />
              Email invite
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy aria-hidden="true" />
              Copy invite link
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open command palette
        <Badge variant="secondary" className="ml-1 font-mono text-[10px]">
          ⌘K
        </Badge>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Command palette"
        description="Search for a command to run."
      >
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => setOpen(false)}>
              <CalendarDays aria-hidden="true" />
              Calendar
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <User aria-hidden="true" />
              Search profile
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <Copy aria-hidden="true" />
              Copy link
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem onSelect={() => setOpen(false)}>
              <Settings aria-hidden="true" />
              Settings
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <Keyboard aria-hidden="true" />
              Keyboard shortcuts
              <CommandShortcut>⌘K</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <LifeBuoy aria-hidden="true" />
              Help &amp; support
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

export const overlaysExamples: ExampleMap = {
  dialog: [
    {
      id: "basic",
      title: "Basic",
      description: "A modal dialog with a header, body, and footer rendered in a portal.",
      code: `<Dialog>
  <DialogTrigger asChild>
    <Button>Edit profile</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>
        Update your display name. Changes are saved when you confirm.
      </DialogDescription>
    </DialogHeader>
    <div className="flex flex-col gap-4 py-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" defaultValue="Ada Lovelace" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" defaultValue="ada" />
      </div>
    </div>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <DialogClose asChild>
        <Button>Save changes</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
      preview: (
        <Dialog>
          <DialogTrigger asChild>
            <Button>Edit profile</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Update your display name. Changes are saved when you confirm.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Ada Lovelace" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="ada" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button>Save changes</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ),
    },
  ],

  sheet: [
    {
      id: "sides",
      title: "Sides",
      description: "A panel that slides in from any edge of the screen.",
      code: `{(["top", "right", "bottom", "left"] as const).map((side) => (
  <Sheet key={side}>
    <SheetTrigger asChild>
      <Button variant="outline" className="capitalize">
        {side}
      </Button>
    </SheetTrigger>
    <SheetContent side={side}>
      <SheetHeader>
        <SheetTitle className="capitalize">{side} sheet</SheetTitle>
        <SheetDescription>
          This panel slides in from the {side} edge. Press Escape or click
          outside to dismiss it.
        </SheetDescription>
      </SheetHeader>
      <div className="flex flex-col gap-2 px-4 py-2">
        <Label htmlFor={\`note-\${side}\`}>Quick note</Label>
        <Input id={\`note-\${side}\`} placeholder="Type something…" />
      </div>
      <SheetFooter>
        <SheetClose asChild>
          <Button>Done</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
))}`,
      preview: (
        <div className="flex flex-wrap gap-2">
          {(["top", "right", "bottom", "left"] as const).map((side) => (
            <Sheet key={side}>
              <SheetTrigger asChild>
                <Button variant="outline" className="capitalize">
                  {side}
                </Button>
              </SheetTrigger>
              <SheetContent side={side}>
                <SheetHeader>
                  <SheetTitle className="capitalize">{side} sheet</SheetTitle>
                  <SheetDescription>
                    This panel slides in from the {side} edge. Press Escape or click outside to
                    dismiss it.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-2 px-4 py-2">
                  <Label htmlFor={`note-${side}`}>Quick note</Label>
                  <Input id={`note-${side}`} placeholder="Type something…" />
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button>Done</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          ))}
        </div>
      ),
    },
  ],

  drawer: [
    {
      id: "bottom-drawer",
      title: "Bottom drawer",
      description:
        "A bottom-anchored sheet that drags up from the edge — touch-friendly on mobile.",
      code: `<Drawer>
  <DrawerTrigger asChild>
    <Button variant="outline">Open drawer</Button>
  </DrawerTrigger>
  <DrawerContent>
    <div className="mx-auto w-full max-w-sm">
      <DrawerHeader>
        <DrawerTitle>Move goal</DrawerTitle>
        <DrawerDescription>Set your daily activity target.</DrawerDescription>
      </DrawerHeader>
      <div className="px-4 py-6 text-center">
        <span className="font-display text-5xl font-semibold tracking-tight text-fg">
          350
        </span>
        <p className="mt-1 text-xs uppercase tracking-wider text-fg-tertiary">
          Calories / day
        </p>
      </div>
      <DrawerFooter>
        <Button>Submit</Button>
        <DrawerClose asChild>
          <Button variant="outline">Cancel</Button>
        </DrawerClose>
      </DrawerFooter>
    </div>
  </DrawerContent>
</Drawer>`,
      preview: (
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Move goal</DrawerTitle>
                <DrawerDescription>Set your daily activity target.</DrawerDescription>
              </DrawerHeader>
              <div className="px-4 py-6 text-center">
                <span className="font-display text-5xl font-semibold tracking-tight text-fg">
                  350
                </span>
                <p className="mt-1 text-xs uppercase tracking-wider text-fg-tertiary">
                  Calories / day
                </p>
              </div>
              <DrawerFooter>
                <Button>Submit</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      ),
    },
  ],

  popover: [
    {
      id: "with-content",
      title: "With content",
      description:
        "A floating surface anchored to a trigger — ideal for inline editors and pickers.",
      code: `<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Dimensions</Button>
  </PopoverTrigger>
  <PopoverContent className="w-80" align="start">
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h4 className="text-sm font-medium text-fg">Dimensions</h4>
        <p className="text-sm text-fg-secondary">Set the dimensions for the layer.</p>
      </div>
      <div className="grid gap-3">
        <div className="grid grid-cols-3 items-center gap-3">
          <Label htmlFor="width">Width</Label>
          <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
        </div>
        <div className="grid grid-cols-3 items-center gap-3">
          <Label htmlFor="height">Height</Label>
          <Input id="height" defaultValue="auto" className="col-span-2 h-8" />
        </div>
      </div>
    </div>
  </PopoverContent>
</Popover>`,
      preview: (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Dimensions</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-medium text-fg">Dimensions</h4>
                <p className="text-sm text-fg-secondary">Set the dimensions for the layer.</p>
              </div>
              <div className="grid gap-3">
                <div className="grid grid-cols-3 items-center gap-3">
                  <Label htmlFor="width">Width</Label>
                  <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
                </div>
                <div className="grid grid-cols-3 items-center gap-3">
                  <Label htmlFor="height">Height</Label>
                  <Input id="height" defaultValue="auto" className="col-span-2 h-8" />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ),
    },
  ],

  "hover-card": [
    {
      id: "profile-preview",
      title: "Profile preview",
      description: "A preview card that appears on hover or focus — great for profile mentions.",
      code: `<HoverCard>
  <HoverCardTrigger asChild>
    <Button variant="link" className="px-0">
      @cooud
    </Button>
  </HoverCardTrigger>
  <HoverCardContent className="w-72">
    <div className="flex gap-3">
      <span
        className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-primary text-primary-foreground"
        aria-hidden="true"
      >
        <Users className="size-5" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-fg">Cooud</p>
        <p className="text-sm text-fg-secondary">
          The token-driven design system that themes itself.
        </p>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-fg-tertiary">
          <CalendarDays className="size-3.5" aria-hidden="true" />
          Joined June 2026
        </div>
      </div>
    </div>
  </HoverCardContent>
</HoverCard>`,
      preview: (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link" className="px-0">
              @cooud
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-72">
            <div className="flex gap-3">
              <span
                className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-primary text-primary-foreground"
                aria-hidden="true"
              >
                <Users className="size-5" />
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-fg">Cooud</p>
                <p className="text-sm text-fg-secondary">
                  The token-driven design system that themes itself.
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-fg-tertiary">
                  <CalendarDays className="size-3.5" aria-hidden="true" />
                  Joined June 2026
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ),
    },
  ],

  tooltip: [
    {
      id: "on-a-button",
      title: "On a button",
      description: "A small label revealed on hover or focus, mounted inside a shared provider.",
      code: `<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline" size="icon" aria-label="Add to library">
        <Plus aria-hidden="true" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>Add to library</TooltipContent>
  </Tooltip>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">
        <HelpCircle aria-hidden="true" />
        Need help?
      </Button>
    </TooltipTrigger>
    <TooltipContent>We usually reply within minutes.</TooltipContent>
  </Tooltip>
</TooltipProvider>`,
      preview: (
        <TooltipProvider>
          <div className="flex flex-wrap items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Add to library">
                  <Plus aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add to library</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">
                  <HelpCircle aria-hidden="true" />
                  Need help?
                </Button>
              </TooltipTrigger>
              <TooltipContent>We usually reply within minutes.</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      ),
    },
  ],

  "dropdown-menu": [
    {
      id: "actions",
      title: "Actions",
      description: "A rich menu with icons, shortcuts, a checkbox item, and a submenu.",
      code: `function ActionsMenu() {
  const [showStatusBar, setShowStatusBar] = useState(true);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User aria-hidden="true" />
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard aria-hidden="true" />
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings aria-hidden="true" />
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showStatusBar}
          onCheckedChange={setShowStatusBar}
        >
          Show status bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Users aria-hidden="true" />
            Invite team
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <UserPlus aria-hidden="true" />
              Email invite
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy aria-hidden="true" />
              Copy invite link
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}`,
      preview: <ActionsMenuDemo />,
    },
  ],

  command: [
    {
      id: "command-palette",
      title: "Command palette",
      description: "A command palette with fuzzy search — open it with the button or ⌘K / Ctrl+K.",
      code: `function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open command palette
        <Badge variant="secondary" className="ml-1 font-mono text-[10px]">
          ⌘K
        </Badge>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Command palette"
        description="Search for a command to run."
      >
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => setOpen(false)}>
              <CalendarDays aria-hidden="true" />
              Calendar
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <User aria-hidden="true" />
              Search profile
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <Copy aria-hidden="true" />
              Copy link
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem onSelect={() => setOpen(false)}>
              <Settings aria-hidden="true" />
              Settings
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <Keyboard aria-hidden="true" />
              Keyboard shortcuts
              <CommandShortcut>⌘K</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <LifeBuoy aria-hidden="true" />
              Help &amp; support
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}`,
      preview: <CommandPaletteDemo />,
    },
  ],
};
