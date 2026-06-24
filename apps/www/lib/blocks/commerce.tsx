"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cooud-ui/ui";
import { ArrowUpRight, CreditCard, Download, Lock, ShieldCheck, Wallet } from "lucide-react";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. Checkout — order summary + card payment form
 * ────────────────────────────────────────────────────────────────────────── */

interface OrderLine {
  id: string;
  name: string;
  detail: string;
  price: string;
}

const orderLines: OrderLine[] = [
  {
    id: "course",
    name: "The Creator Playbook",
    detail: "Lifetime access · 42 lessons",
    price: "$129.00",
  },
  { id: "templates", name: "Notion template pack", detail: "Order bump", price: "$24.00" },
];

export function CheckoutBlock() {
  return (
    <section
      aria-label="Checkout"
      className="mx-auto grid w-full max-w-4xl gap-6 lg:grid-cols-[1fr_1.1fr]"
    >
      {/* Order summary */}
      <Card className="h-fit gap-0 pb-0 shadow-md lg:order-2">
        <CardHeader>
          <CardTitle className="font-display text-lg">Order summary</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">Cooud Studio · digital products</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {orderLines.map((line) => (
            <div key={line.id} className="flex items-start justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-fg">{line.name}</span>
                <span className="text-sm text-fg-tertiary">{line.detail}</span>
              </div>
              <span className="text-sm font-medium text-fg">{line.price}</span>
            </div>
          ))}
        </CardContent>
        <Separator className="my-4" />
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span>Subtotal</span>
            <span className="text-fg">$153.00</span>
          </div>
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span className="flex items-center gap-2">
              Discount
              <Badge variant="success">LAUNCH20</Badge>
            </span>
            <span className="text-success">−$30.60</span>
          </div>
        </CardContent>
        <Separator className="my-4" />
        <CardFooter className="flex-col items-stretch gap-1 pb-6">
          <div className="flex items-baseline justify-between">
            <span className="font-medium text-fg">Total due</span>
            <span className="font-display text-2xl font-semibold text-fg">$122.40</span>
          </div>
          <span className="text-xs text-fg-tertiary">One-time payment · billed in USD</span>
        </CardFooter>
      </Card>

      {/* Payment form */}
      <Card className="shadow-md lg:order-1">
        <CardHeader>
          <CardTitle className="font-display text-lg">Payment details</CardTitle>
          <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
            <Badge variant="secondary">
              <Lock className="size-3" aria-hidden="true" />
              Secure
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="checkout-email">Email</Label>
            <Input
              id="checkout-email"
              type="email"
              placeholder="you@email.com"
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="checkout-card">Card number</Label>
            <div className="relative">
              <Input
                id="checkout-card"
                inputMode="numeric"
                placeholder="1234 1234 1234 1234"
                autoComplete="cc-number"
                className="pr-10"
              />
              <CreditCard
                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-fg-tertiary"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="checkout-expiry">Expiry</Label>
              <Input id="checkout-expiry" placeholder="MM / YY" autoComplete="cc-exp" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="checkout-cvc">CVC</Label>
              <Input
                id="checkout-cvc"
                inputMode="numeric"
                placeholder="123"
                autoComplete="cc-csc"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="checkout-name">Name on card</Label>
            <Input id="checkout-name" placeholder="Alex Morgan" autoComplete="cc-name" />
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="flex-col items-stretch gap-3">
          <Button variant="gradient" size="lg" className="w-full">
            Pay $122.40
          </Button>
          <p className="flex items-center justify-center gap-2 text-xs text-fg-tertiary">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Encrypted payment · 7-day money-back guarantee
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}

const checkoutCode = `import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
} from "@cooud-ui/ui";
import { CreditCard, Lock, ShieldCheck } from "lucide-react";

interface OrderLine {
  id: string;
  name: string;
  detail: string;
  price: string;
}

const orderLines: OrderLine[] = [
  { id: "course", name: "The Creator Playbook", detail: "Lifetime access · 42 lessons", price: "$129.00" },
  { id: "templates", name: "Notion template pack", detail: "Order bump", price: "$24.00" },
];

export function CheckoutBlock() {
  return (
    <section aria-label="Checkout" className="mx-auto grid w-full max-w-4xl gap-6 lg:grid-cols-[1fr_1.1fr]">
      {/* Order summary */}
      <Card className="h-fit gap-0 pb-0 shadow-md lg:order-2">
        <CardHeader>
          <CardTitle className="font-display text-lg">Order summary</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">Cooud Studio · digital products</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {orderLines.map((line) => (
            <div key={line.id} className="flex items-start justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-fg">{line.name}</span>
                <span className="text-sm text-fg-tertiary">{line.detail}</span>
              </div>
              <span className="text-sm font-medium text-fg">{line.price}</span>
            </div>
          ))}
        </CardContent>
        <Separator className="my-4" />
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span>Subtotal</span>
            <span className="text-fg">$153.00</span>
          </div>
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span className="flex items-center gap-2">
              Discount
              <Badge variant="success">LAUNCH20</Badge>
            </span>
            <span className="text-success">−$30.60</span>
          </div>
        </CardContent>
        <Separator className="my-4" />
        <CardFooter className="flex-col items-stretch gap-1 pb-6">
          <div className="flex items-baseline justify-between">
            <span className="font-medium text-fg">Total due</span>
            <span className="font-display text-2xl font-semibold text-fg">$122.40</span>
          </div>
          <span className="text-xs text-fg-tertiary">One-time payment · billed in USD</span>
        </CardFooter>
      </Card>

      {/* Payment form */}
      <Card className="shadow-md lg:order-1">
        <CardHeader>
          <CardTitle className="font-display text-lg">Payment details</CardTitle>
          <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
            <Badge variant="secondary">
              <Lock className="size-3" aria-hidden="true" />
              Secure
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="checkout-email">Email</Label>
            <Input id="checkout-email" type="email" placeholder="you@email.com" autoComplete="email" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="checkout-card">Card number</Label>
            <div className="relative">
              <Input
                id="checkout-card"
                inputMode="numeric"
                placeholder="1234 1234 1234 1234"
                autoComplete="cc-number"
                className="pr-10"
              />
              <CreditCard
                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-fg-tertiary"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="checkout-expiry">Expiry</Label>
              <Input id="checkout-expiry" placeholder="MM / YY" autoComplete="cc-exp" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="checkout-cvc">CVC</Label>
              <Input id="checkout-cvc" inputMode="numeric" placeholder="123" autoComplete="cc-csc" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="checkout-name">Name on card</Label>
            <Input id="checkout-name" placeholder="Alex Morgan" autoComplete="cc-name" />
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="flex-col items-stretch gap-3">
          <Button variant="gradient" size="lg" className="w-full">
            Pay $122.40
          </Button>
          <p className="flex items-center justify-center gap-2 text-xs text-fg-tertiary">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Encrypted payment · 7-day money-back guarantee
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 2. Payouts — creator balance + payout history
 * ────────────────────────────────────────────────────────────────────────── */

interface Payout {
  id: string;
  date: string;
  method: string;
  amount: string;
  status: "Paid" | "In transit" | "Pending";
}

const payouts: Payout[] = [
  {
    id: "PO-3041",
    date: "Jun 18, 2026",
    method: "Bank ···4421",
    amount: "$4,820.00",
    status: "Paid",
  },
  {
    id: "PO-3018",
    date: "Jun 11, 2026",
    method: "Bank ···4421",
    amount: "$3,140.00",
    status: "Paid",
  },
  {
    id: "PO-2994",
    date: "Jun 04, 2026",
    method: "Bank ···4421",
    amount: "$5,260.00",
    status: "In transit",
  },
  {
    id: "PO-2971",
    date: "May 28, 2026",
    method: "Bank ···4421",
    amount: "$2,980.00",
    status: "Pending",
  },
];

function payoutStatusVariant(status: Payout["status"]) {
  if (status === "Paid") return "success" as const;
  if (status === "In transit") return "info" as const;
  return "warning" as const;
}

export function PayoutsBlock() {
  return (
    <section aria-label="Payouts" className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      {/* Balance summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="gap-0 shadow-md sm:col-span-2">
          <CardHeader>
            <CardTitle className="font-display text-sm font-medium text-fg-secondary">
              Available balance
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-4xl font-semibold text-fg">$8,240</span>
              <span className="text-sm text-fg-tertiary">.50 USD</span>
            </div>
            <Button variant="gradient">
              <Wallet className="size-4" aria-hidden="true" />
              Withdraw
            </Button>
          </CardContent>
        </Card>
        <Card className="gap-0 shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-sm font-medium text-fg-secondary">
              Pending clearance
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <span className="font-display text-3xl font-semibold text-fg">$2,980</span>
            <span className="text-xs text-fg-tertiary">Clears in 3 days</span>
          </CardContent>
        </Card>
      </div>

      {/* Payout history */}
      <Card className="gap-0 pb-0 shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Payout history</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            Settlements to your connected bank account.
          </p>
        </CardHeader>
        <CardContent className="px-0 pt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4 sm:pl-6">Payout</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-4 text-right sm:pr-6">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell className="pl-4 font-medium text-fg sm:pl-6">{payout.id}</TableCell>
                  <TableCell className="text-fg-secondary">{payout.date}</TableCell>
                  <TableCell className="text-fg-secondary">{payout.method}</TableCell>
                  <TableCell>
                    <Badge variant={payoutStatusVariant(payout.status)}>{payout.status}</Badge>
                  </TableCell>
                  <TableCell className="pr-4 text-right font-medium text-fg sm:pr-6">
                    {payout.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}

const payoutsCode = `import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cooud-ui/ui";
import { Wallet } from "lucide-react";

interface Payout {
  id: string;
  date: string;
  method: string;
  amount: string;
  status: "Paid" | "In transit" | "Pending";
}

const payouts: Payout[] = [
  { id: "PO-3041", date: "Jun 18, 2026", method: "Bank ···4421", amount: "$4,820.00", status: "Paid" },
  { id: "PO-3018", date: "Jun 11, 2026", method: "Bank ···4421", amount: "$3,140.00", status: "Paid" },
  { id: "PO-2994", date: "Jun 04, 2026", method: "Bank ···4421", amount: "$5,260.00", status: "In transit" },
  { id: "PO-2971", date: "May 28, 2026", method: "Bank ···4421", amount: "$2,980.00", status: "Pending" },
];

function payoutStatusVariant(status: Payout["status"]) {
  if (status === "Paid") return "success" as const;
  if (status === "In transit") return "info" as const;
  return "warning" as const;
}

export function PayoutsBlock() {
  return (
    <section aria-label="Payouts" className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      {/* Balance summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="gap-0 shadow-md sm:col-span-2">
          <CardHeader>
            <CardTitle className="font-display text-sm font-medium text-fg-secondary">
              Available balance
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-4xl font-semibold text-fg">$8,240</span>
              <span className="text-sm text-fg-tertiary">.50 USD</span>
            </div>
            <Button variant="gradient">
              <Wallet className="size-4" aria-hidden="true" />
              Withdraw
            </Button>
          </CardContent>
        </Card>
        <Card className="gap-0 shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-sm font-medium text-fg-secondary">
              Pending clearance
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <span className="font-display text-3xl font-semibold text-fg">$2,980</span>
            <span className="text-xs text-fg-tertiary">Clears in 3 days</span>
          </CardContent>
        </Card>
      </div>

      {/* Payout history */}
      <Card className="gap-0 pb-0 shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Payout history</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            Settlements to your connected bank account.
          </p>
        </CardHeader>
        <CardContent className="px-0 pt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4 sm:pl-6">Payout</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-4 text-right sm:pr-6">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell className="pl-4 font-medium text-fg sm:pl-6">{payout.id}</TableCell>
                  <TableCell className="text-fg-secondary">{payout.date}</TableCell>
                  <TableCell className="text-fg-secondary">{payout.method}</TableCell>
                  <TableCell>
                    <Badge variant={payoutStatusVariant(payout.status)}>{payout.status}</Badge>
                  </TableCell>
                  <TableCell className="pr-4 text-right font-medium text-fg sm:pr-6">
                    {payout.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 3. Product grid — digital storefront
 * ────────────────────────────────────────────────────────────────────────── */

interface Product {
  id: string;
  title: string;
  kind: string;
  price: string;
  gradient: string;
  initials: string;
  badge?: string;
}

const products: Product[] = [
  {
    id: "playbook",
    title: "The Creator Playbook",
    kind: "Course · 42 lessons",
    price: "$129",
    gradient: "from-primary/30 to-info/20",
    initials: "CP",
    badge: "Bestseller",
  },
  {
    id: "presets",
    title: "Cinematic LUT Presets",
    kind: "Asset pack · 60 presets",
    price: "$39",
    gradient: "from-info/30 to-success/20",
    initials: "LP",
  },
  {
    id: "templates",
    title: "Launch Notion System",
    kind: "Template · instant access",
    price: "$24",
    gradient: "from-warning/30 to-primary/20",
    initials: "NS",
  },
  {
    id: "ebook",
    title: "Newsletter to Income",
    kind: "Ebook · 180 pages",
    price: "$19",
    gradient: "from-success/30 to-info/20",
    initials: "NI",
  },
  {
    id: "workshop",
    title: "Monetization Workshop",
    kind: "Replay · 3 hours",
    price: "$89",
    gradient: "from-primary/30 to-warning/20",
    initials: "MW",
    badge: "New",
  },
  {
    id: "soundkit",
    title: "Ambient Sound Kit",
    kind: "Audio · 120 loops",
    price: "$29",
    gradient: "from-info/30 to-primary/20",
    initials: "SK",
  },
];

export function ProductGridBlock() {
  return (
    <section aria-label="Digital products" className="flex w-full flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl font-semibold text-fg">Shop the store</h2>
          <p className="text-sm text-fg-secondary">Digital products from independent creators.</p>
        </div>
        <Badge variant="secondary">6 products</Badge>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="gap-0 overflow-hidden pt-0 shadow-sm">
            <div
              className={`relative flex aspect-[16/10] items-center justify-center bg-gradient-to-br ${product.gradient}`}
            >
              <span className="font-display text-3xl font-semibold text-fg/70">
                {product.initials}
              </span>
              {product.badge ? (
                <div className="absolute left-3 top-3">
                  <Badge variant="primary">{product.badge}</Badge>
                </div>
              ) : null}
            </div>
            <CardHeader className="pt-4">
              <CardTitle className="font-display text-base">{product.title}</CardTitle>
              <p className="col-span-full text-sm text-fg-tertiary">{product.kind}</p>
            </CardHeader>
            <CardFooter className="mt-auto items-center justify-between gap-3 pt-4">
              <span className="font-display text-lg font-semibold text-fg">{product.price}</span>
              <Button size="sm">
                Buy now
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

const productGridCode = `import {
  Badge,
  Button,
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@cooud-ui/ui";
import { ArrowUpRight } from "lucide-react";

interface Product {
  id: string;
  title: string;
  kind: string;
  price: string;
  gradient: string;
  initials: string;
  badge?: string;
}

const products: Product[] = [
  {
    id: "playbook",
    title: "The Creator Playbook",
    kind: "Course · 42 lessons",
    price: "$129",
    gradient: "from-primary/30 to-info/20",
    initials: "CP",
    badge: "Bestseller",
  },
  {
    id: "presets",
    title: "Cinematic LUT Presets",
    kind: "Asset pack · 60 presets",
    price: "$39",
    gradient: "from-info/30 to-success/20",
    initials: "LP",
  },
  {
    id: "templates",
    title: "Launch Notion System",
    kind: "Template · instant access",
    price: "$24",
    gradient: "from-warning/30 to-primary/20",
    initials: "NS",
  },
  {
    id: "ebook",
    title: "Newsletter to Income",
    kind: "Ebook · 180 pages",
    price: "$19",
    gradient: "from-success/30 to-info/20",
    initials: "NI",
  },
  {
    id: "workshop",
    title: "Monetization Workshop",
    kind: "Replay · 3 hours",
    price: "$89",
    gradient: "from-primary/30 to-warning/20",
    initials: "MW",
    badge: "New",
  },
  {
    id: "soundkit",
    title: "Ambient Sound Kit",
    kind: "Audio · 120 loops",
    price: "$29",
    gradient: "from-info/30 to-primary/20",
    initials: "SK",
  },
];

export function ProductGridBlock() {
  return (
    <section aria-label="Digital products" className="flex w-full flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl font-semibold text-fg">Shop the store</h2>
          <p className="text-sm text-fg-secondary">Digital products from independent creators.</p>
        </div>
        <Badge variant="secondary">6 products</Badge>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="gap-0 overflow-hidden pt-0 shadow-sm">
            <div className={\`relative flex aspect-[16/10] items-center justify-center bg-gradient-to-br \${product.gradient}\`}>
              <span className="font-display text-3xl font-semibold text-fg/70">
                {product.initials}
              </span>
              {product.badge ? (
                <div className="absolute left-3 top-3">
                  <Badge variant="primary">{product.badge}</Badge>
                </div>
              ) : null}
            </div>
            <CardHeader className="pt-4">
              <CardTitle className="font-display text-base">{product.title}</CardTitle>
              <p className="col-span-full text-sm text-fg-tertiary">{product.kind}</p>
            </CardHeader>
            <CardFooter className="mt-auto items-center justify-between gap-3 pt-4">
              <span className="font-display text-lg font-semibold text-fg">{product.price}</span>
              <Button size="sm">
                Buy now
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 4. Invoice — receipt detail with line items + totals
 * ────────────────────────────────────────────────────────────────────────── */

interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  unit: string;
  amount: string;
}

const invoiceItems: InvoiceItem[] = [
  {
    id: "playbook",
    description: "The Creator Playbook — Lifetime",
    qty: 1,
    unit: "$129.00",
    amount: "$129.00",
  },
  { id: "seats", description: "Team seats", qty: 3, unit: "$12.00", amount: "$36.00" },
  {
    id: "support",
    description: "Priority support — 1 year",
    qty: 1,
    unit: "$48.00",
    amount: "$48.00",
  },
];

export function InvoiceBlock() {
  return (
    <Card aria-label="Invoice" className="mx-auto w-full max-w-2xl gap-0 pb-0 shadow-md">
      <CardHeader>
        <CardTitle className="font-display text-xl">Invoice INV-2026-0188</CardTitle>
        <p className="col-span-full text-sm text-fg-secondary">
          Issued Jun 18, 2026 · Due on receipt
        </p>
        <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
          <Badge variant="success">Paid</Badge>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-4 pb-2">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">From</span>
          <span className="text-sm font-medium text-fg">Cooud Studio</span>
          <span className="text-sm text-fg-secondary">billing@cooud.studio</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
            Billed to
          </span>
          <span className="text-sm font-medium text-fg">Alex Morgan</span>
          <span className="text-sm text-fg-secondary">alex@email.com</span>
        </div>
      </CardContent>

      <Separator className="my-4" />

      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4 sm:pl-6">Description</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Unit</TableHead>
              <TableHead className="pr-4 text-right sm:pr-6">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoiceItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="pl-4 font-medium text-fg sm:pl-6">
                  {item.description}
                </TableCell>
                <TableCell className="text-right text-fg-secondary">{item.qty}</TableCell>
                <TableCell className="text-right text-fg-secondary">{item.unit}</TableCell>
                <TableCell className="pr-4 text-right text-fg sm:pr-6">{item.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Separator className="my-4" />

      <CardContent className="flex flex-col items-end gap-2">
        <div className="flex w-full max-w-xs flex-col gap-2">
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span>Subtotal</span>
            <span className="text-fg">$213.00</span>
          </div>
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span>Tax (8%)</span>
            <span className="text-fg">$17.04</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="font-medium text-fg">Total paid</span>
            <span className="font-display text-xl font-semibold text-fg">$230.04</span>
          </div>
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="justify-between gap-3 py-5">
        <span className="text-xs text-fg-tertiary">Paid via Visa ···4242 on Jun 18, 2026</span>
        <Button variant="outline" size="sm">
          <Download className="size-4" aria-hidden="true" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}

const invoiceCode = `import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cooud-ui/ui";
import { Download } from "lucide-react";

interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  unit: string;
  amount: string;
}

const invoiceItems: InvoiceItem[] = [
  { id: "playbook", description: "The Creator Playbook — Lifetime", qty: 1, unit: "$129.00", amount: "$129.00" },
  { id: "seats", description: "Team seats", qty: 3, unit: "$12.00", amount: "$36.00" },
  { id: "support", description: "Priority support — 1 year", qty: 1, unit: "$48.00", amount: "$48.00" },
];

export function InvoiceBlock() {
  return (
    <Card aria-label="Invoice" className="mx-auto w-full max-w-2xl gap-0 pb-0 shadow-md">
      <CardHeader>
        <CardTitle className="font-display text-xl">Invoice INV-2026-0188</CardTitle>
        <p className="col-span-full text-sm text-fg-secondary">Issued Jun 18, 2026 · Due on receipt</p>
        <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
          <Badge variant="success">Paid</Badge>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-4 pb-2">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">From</span>
          <span className="text-sm font-medium text-fg">Cooud Studio</span>
          <span className="text-sm text-fg-secondary">billing@cooud.studio</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
            Billed to
          </span>
          <span className="text-sm font-medium text-fg">Alex Morgan</span>
          <span className="text-sm text-fg-secondary">alex@email.com</span>
        </div>
      </CardContent>

      <Separator className="my-4" />

      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4 sm:pl-6">Description</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Unit</TableHead>
              <TableHead className="pr-4 text-right sm:pr-6">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoiceItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="pl-4 font-medium text-fg sm:pl-6">{item.description}</TableCell>
                <TableCell className="text-right text-fg-secondary">{item.qty}</TableCell>
                <TableCell className="text-right text-fg-secondary">{item.unit}</TableCell>
                <TableCell className="pr-4 text-right text-fg sm:pr-6">{item.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Separator className="my-4" />

      <CardContent className="flex flex-col items-end gap-2">
        <div className="flex w-full max-w-xs flex-col gap-2">
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span>Subtotal</span>
            <span className="text-fg">$213.00</span>
          </div>
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span>Tax (8%)</span>
            <span className="text-fg">$17.04</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="font-medium text-fg">Total paid</span>
            <span className="font-display text-xl font-semibold text-fg">$230.04</span>
          </div>
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="justify-between gap-3 py-5">
        <span className="text-xs text-fg-tertiary">Paid via Visa ···4242 on Jun 18, 2026</span>
        <Button variant="outline" size="sm">
          <Download className="size-4" aria-hidden="true" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * Block map
 * ────────────────────────────────────────────────────────────────────────── */

export const commerceBlocks: BlockContentMap = {
  checkout: { preview: <CheckoutBlock />, code: checkoutCode },
  payouts: { preview: <PayoutsBlock />, code: payoutsCode },
  "product-grid": { preview: <ProductGridBlock />, code: productGridCode },
  invoice: { preview: <InvoiceBlock />, code: invoiceCode },
};

/* -------------------------------------------------------------------------- */
/*  Lazily-loaded detail views                                                */
/*                                                                            */
/*  These are imported per-slug via next/dynamic by the block detail routes,  */
/*  so visiting a block only loads this family chunk (not the other family).  */
/* -------------------------------------------------------------------------- */

export function CommerceGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(commerceBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function CommerceView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(commerceBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
