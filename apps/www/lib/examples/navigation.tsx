"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@cooud/ui";
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
};

/**
 * Default-export view for this family. Imported lazily per-slug by the
 * `/components/[slug]` detail route, so visiting one component only loads this
 * family chunk (not the whole catalog).
 */
export default function NavigationExamples({ slug }: { slug: string }) {
  return <ExampleList examples={navigationExamples[slug] ?? []} />;
}
