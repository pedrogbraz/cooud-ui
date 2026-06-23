"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AppShell,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@cooud/ui";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { ExampleList } from "../../components/docs/example-list";
import type { ExampleMap } from "./types";

export const navigationExamples: ExampleMap = {
  tabs: [
    {
      id: "three-tabs",
      title: "Three tabs",
      description: "Switch between related panels of content within a single surface.",
      code: `<Tabs defaultValue="account" className="w-full max-w-md">
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
</Tabs>`,
      preview: (
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
      ),
    },
  ],

  accordion: [
    {
      id: "faq",
      title: "FAQ",
      description: "Single-open, collapsible disclosure panels for FAQs and dense content.",
      code: `<Accordion type="single" collapsible className="w-full max-w-md">
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It follows the WAI-ARIA disclosure pattern and is fully keyboard
      navigable.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Is it themeable?</AccordionTrigger>
    <AccordionContent>
      Absolutely. Every color, radius, and shadow flows from semantic design
      tokens.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-3">
    <AccordionTrigger>Is it animated?</AccordionTrigger>
    <AccordionContent>
      Yes — content expands and collapses with a smooth height transition.
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
      preview: (
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
      ),
    },
  ],

  breadcrumb: [
    {
      id: "trail",
      title: "Trail",
      description: "Shows the path to the current page, with the active page as plain text.",
      code: `<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Components</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Button</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`,
      preview: (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Button</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      ),
    },
  ],

  pagination: [
    {
      id: "pager",
      title: "Pager",
      description: "Navigate paginated content with previous, page links, an ellipsis, and next.",
      code: `<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>
        2
      </PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">3</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>`,
      preview: (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ),
    },
  ],

  "navigation-menu": [
    {
      id: "menu-bar",
      title: "Menu bar",
      description:
        "A horizontal menu bar with a disclosure panel of links and a flat link, fully keyboard navigable.",
      code: `<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Products</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[22rem] gap-1">
          <li>
            <NavigationMenuLink href="#">
              <span className="font-medium text-fg">Analytics</span>
              <span className="text-fg-tertiary">Real-time dashboards and reports.</span>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink href="#">
              <span className="font-medium text-fg">Automations</span>
              <span className="text-fg-tertiary">Wire up rules and workflows.</span>
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
        Docs
      </NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`,
      preview: (
        // Reserve vertical room + top-align so the disclosure panel (an absolute
        // viewport) opens *inside* the preview frame instead of being clipped.
        <div className="flex min-h-[16rem] w-full items-start justify-center pt-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[22rem] gap-1">
                    <li>
                      <NavigationMenuLink href="#">
                        <span className="font-medium text-fg">Analytics</span>
                        <span className="text-fg-tertiary">Real-time dashboards and reports.</span>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink href="#">
                        <span className="font-medium text-fg">Automations</span>
                        <span className="text-fg-tertiary">Wire up rules and workflows.</span>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
                  Docs
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      ),
    },
  ],

  sidebar: [
    {
      id: "collapsible-nav",
      title: "Collapsible navigation",
      description:
        "A composable app sidebar with grouped menu items, a header and footer. Use the trigger to collapse it to icons.",
      code: `<SidebarProvider className="!min-h-0 h-full">
  <Sidebar collapsible="icon" className="!h-full">
    <SidebarHeader>
      <span className="px-2 text-sm font-semibold text-fg">Acme Inc.</span>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Workspace</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive tooltip="Home">
                <Home />
                <span>Home</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Inbox">
                <Inbox />
                <span>Inbox</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Calendar">
                <Calendar />
                <span>Calendar</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Settings">
            <Settings />
            <span>Settings</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
  <div className="flex flex-1 flex-col gap-3 p-4">
    <SidebarTrigger />
    <p className="text-sm text-fg-secondary">Toggle the sidebar with the button above.</p>
  </div>
</SidebarProvider>`,
      preview: (
        <div className="h-[28rem] w-full overflow-hidden rounded-xl border border-border">
          <SidebarProvider className="!min-h-0 h-full">
            <Sidebar collapsible="icon" className="!h-full">
              <SidebarHeader>
                <span className="px-2 text-sm font-semibold text-fg">Acme Inc.</span>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton isActive tooltip="Home">
                          <Home />
                          <span>Home</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Inbox">
                          <Inbox />
                          <span>Inbox</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Calendar">
                          <Calendar />
                          <span>Calendar</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Settings">
                      <Settings />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </Sidebar>
            <div className="flex flex-1 flex-col gap-3 p-4">
              <SidebarTrigger />
              <p className="text-sm text-fg-secondary">Toggle the sidebar with the button above.</p>
            </div>
          </SidebarProvider>
        </div>
      ),
    },
  ],

  "app-shell": [
    {
      id: "shell-layout",
      title: "Shell layout",
      description:
        "AppShell composes a sidebar, a sticky header and a content region in one step. It never renders a <main> — the route owns that landmark.",
      code: `<AppShell
  header={
    <>
      <SidebarTrigger />
      <span className="text-sm font-medium text-fg">Dashboard</span>
    </>
  }
  sidebar={
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <span className="px-2 text-sm font-semibold text-fg">Acme Inc.</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive tooltip="Home">
                  <Home />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Search">
                  <Search />
                  <span>Search</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  }
>
  <div className="p-6 text-sm text-fg-secondary">Your page content goes here.</div>
</AppShell>`,
      preview: (
        <div className="h-[28rem] w-full overflow-hidden rounded-xl border border-border [&_[data-slot=app-shell-content]]:!min-h-0 [&_[data-slot=sidebar-wrapper]]:!min-h-0 [&_[data-slot=sidebar]]:!h-full">
          <AppShell
            className="h-full"
            header={
              <>
                <SidebarTrigger />
                <span className="text-sm font-medium text-fg">Dashboard</span>
              </>
            }
            sidebar={
              <Sidebar collapsible="icon">
                <SidebarHeader>
                  <span className="px-2 text-sm font-semibold text-fg">Acme Inc.</span>
                </SidebarHeader>
                <SidebarContent>
                  <SidebarGroup>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        <SidebarMenuItem>
                          <SidebarMenuButton isActive tooltip="Home">
                            <Home />
                            <span>Home</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton tooltip="Search">
                            <Search />
                            <span>Search</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </SidebarContent>
              </Sidebar>
            }
          >
            <div className="p-6 text-sm text-fg-secondary">Your page content goes here.</div>
          </AppShell>
        </div>
      ),
    },
  ],
};

/**
 * Default-export view for this family. Imported lazily per-slug by the
 * `/components/[slug]` detail route, so visiting one component only loads this
 * family chunk (not the whole catalog).
 */
export default function NavigationExamples({ slug }: { slug: string }) {
  return <ExampleList examples={navigationExamples[slug] ?? []} />;
}
