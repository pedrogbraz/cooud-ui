"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  toast,
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
  Trash2,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";

export function OverlaysGallery() {
  return (
    <TooltipProvider>
      <Toaster />
      <div className="mt-16 flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-fg">
            Overlays &amp; Navigation
          </h2>
          <p className="max-w-2xl text-sm text-fg-secondary">
            Wave 2 — dialogs, menus, popovers, and disclosure components. Every overlay is fully
            interactive and keyboard accessible.
          </p>
        </div>

        <DialogSection />
        <SheetSection />
        <AlertDialogSection />
        <DropdownMenuSection />
        <PopoverSection />
        <HoverCardSection />
        <TooltipSection />
        <TabsSection />
        <AccordionSection />
        <DrawerSection />
        <ToastSection />
        <CommandSection />
      </div>
    </TooltipProvider>
  );
}

// ── 1. Dialog ──────────────────────────────────────────────────────
function DialogSection() {
  return (
    <Section
      title="Dialog"
      description="A modal dialog with a header, body, and footer rendered in a portal."
    >
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
              <Label htmlFor="o-dialog-name">Name</Label>
              <Input id="o-dialog-name" defaultValue="Ada Lovelace" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="o-dialog-handle">Username</Label>
              <Input id="o-dialog-handle" defaultValue="ada" />
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
    </Section>
  );
}

// ── 2. Sheet ───────────────────────────────────────────────────────
function SheetSection() {
  const sides = ["top", "right", "bottom", "left"] as const;

  return (
    <Section title="Sheet" description="A panel that slides in from any edge of the screen.">
      <Cluster label="Slide from">
        {sides.map((side) => (
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
                <Label htmlFor={`o-sheet-${side}`}>Quick note</Label>
                <Input id={`o-sheet-${side}`} placeholder="Type something…" />
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button>Done</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ))}
      </Cluster>
    </Section>
  );
}

// ── 3. AlertDialog ─────────────────────────────────────────────────
function AlertDialogSection() {
  return (
    <Section
      title="Alert Dialog"
      description="A focus-trapping confirmation for destructive or irreversible actions."
    >
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">
            <Trash2 aria-hidden="true" />
            Delete account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes your account and removes all associated data. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => toast.success("Account deleted.")}>
              Yes, delete it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Section>
  );
}

// ── 4. DropdownMenu ────────────────────────────────────────────────
function DropdownMenuSection() {
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [team, setTeam] = useState("engineering");

  return (
    <Section
      title="Dropdown Menu"
      description="A rich menu with icons, shortcuts, a checkbox item, a radio group, and a submenu."
    >
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
              Switch team
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={team} onValueChange={setTeam}>
                <DropdownMenuRadioItem value="engineering">Engineering</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="design">Design</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="marketing">Marketing</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <UserPlus aria-hidden="true" />
            Invite users
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Section>
  );
}

// ── 5. Popover ─────────────────────────────────────────────────────
function PopoverSection() {
  return (
    <Section
      title="Popover"
      description="A floating surface anchored to a trigger — ideal for inline editors and pickers."
    >
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
                <Label htmlFor="o-pop-width">Width</Label>
                <Input id="o-pop-width" defaultValue="100%" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-3">
                <Label htmlFor="o-pop-height">Height</Label>
                <Input id="o-pop-height" defaultValue="auto" className="col-span-2 h-8" />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </Section>
  );
}

// ── 6. HoverCard ───────────────────────────────────────────────────
function HoverCardSection() {
  return (
    <Section
      title="Hover Card"
      description="A preview card that appears on hover or focus — great for profile mentions."
    >
      <Cluster label="Hover or focus the link">
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
      </Cluster>
    </Section>
  );
}

// ── 7. Tooltip ─────────────────────────────────────────────────────
function TooltipSection() {
  return (
    <Section
      title="Tooltip"
      description="A small label revealed on hover or focus, mounted inside a shared provider."
    >
      <Cluster label="Hover the button">
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
      </Cluster>
    </Section>
  );
}

// ── 8. Tabs ────────────────────────────────────────────────────────
function TabsSection() {
  return (
    <Section
      title="Tabs"
      description="Switch between related panels of content within a single surface."
    >
      <Tabs defaultValue="account" className="w-full max-w-md">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="pt-4">
          <p className="text-sm text-fg-secondary">
            Manage your account details and public profile.
          </p>
        </TabsContent>
        <TabsContent value="password" className="pt-4">
          <p className="text-sm text-fg-secondary">
            Change your password and configure two-factor authentication.
          </p>
        </TabsContent>
        <TabsContent value="team" className="pt-4">
          <p className="text-sm text-fg-secondary">
            Invite teammates and manage their roles and permissions.
          </p>
        </TabsContent>
      </Tabs>
    </Section>
  );
}

// ── 9. Accordion ───────────────────────────────────────────────────
function AccordionSection() {
  return (
    <Section
      title="Accordion"
      description="Single-open, collapsible disclosure panels for FAQs and dense content."
    >
      <Accordion type="single" collapsible className="w-full max-w-md">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It follows the WAI-ARIA disclosure pattern and is fully keyboard navigable.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it themeable?</AccordionTrigger>
          <AccordionContent>
            Absolutely. Every color, radius, and shadow flows from semantic design tokens.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is it animated?</AccordionTrigger>
          <AccordionContent>
            Yes — content expands and collapses with a smooth height transition.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Section>
  );
}

// ── 10. Drawer ─────────────────────────────────────────────────────
function DrawerSection() {
  return (
    <Section
      title="Drawer"
      description="A bottom-anchored sheet that drags up from the edge — touch-friendly on mobile."
    >
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
    </Section>
  );
}

// ── 11. Toast ──────────────────────────────────────────────────────
function ToastSection() {
  return (
    <Section
      title="Toast"
      description="Transient notifications fired imperatively via the toast() function."
    >
      <Cluster label="Fire a toast">
        <Button variant="outline" onClick={() => toast("Event has been created.")}>
          Default
        </Button>
        <Button variant="outline" onClick={() => toast.success("Changes saved successfully.")}>
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.error("Something went wrong. Please try again.")}
        >
          Error
        </Button>
      </Cluster>
    </Section>
  );
}

// ── 12. Command ────────────────────────────────────────────────────
function CommandSection() {
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
    <Section
      title="Command"
      description="A command palette with fuzzy search — open it with the button or ⌘K / Ctrl+K."
    >
      <Cluster>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Open command palette
          <Badge variant="secondary" className="ml-1 font-mono text-[10px]">
            ⌘K
          </Badge>
        </Button>
      </Cluster>

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
    </Section>
  );
}

// ── Shared layout primitives (mirrors forms-gallery.tsx) ────────────
interface SectionProps {
  title: string;
  description: string;
  children: ReactNode;
}

function Section({ title, description, children }: SectionProps) {
  const id = `overlays-${title.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <div className="mb-5 flex flex-col gap-1">
        <h3 id={`${id}-title`} className="font-display text-xl font-semibold text-fg">
          {title}
        </h3>
        <p className="text-sm text-fg-secondary">{description}</p>
      </div>
      <div className="rounded-2xl border border-border bg-surface-raised p-6 shadow-sm">
        {children}
      </div>
    </section>
  );
}

interface ClusterProps {
  label?: string;
  children: ReactNode;
}

function Cluster({ label, children }: ClusterProps) {
  return (
    <div className="flex flex-col gap-3">
      {label ? (
        <span className="text-xs font-medium uppercase tracking-wider text-fg-tertiary">
          {label}
        </span>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}
