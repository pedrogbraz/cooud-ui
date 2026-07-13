"use client";

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Label,
  Separator,
} from "@cooud-ui/ui";
import {
  ArrowLeft,
  ChartColumnIncreasing,
  Chrome,
  Github,
  KeyRound,
  MailCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. Login — centered auth card
 * ────────────────────────────────────────────────────────────────────────── */

export function LoginBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <ChartColumnIncreasing className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Welcome back</CardTitle>
            <p className="text-sm text-fg-secondary">Sign in to your Cooud workspace</p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label
              htmlFor="login-remember"
              className="flex items-center gap-2 font-normal text-fg-secondary"
            >
              <Checkbox id="login-remember" defaultChecked />
              Remember me
            </Label>
            <a
              href="#forgot"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <Button variant="gradient" size="lg" className="w-full">
            Sign in
          </Button>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-fg-tertiary">or continue with</span>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline">
              <Github className="size-4" aria-hidden="true" />
              GitHub
            </Button>
            <Button variant="outline">
              <Chrome className="size-4" aria-hidden="true" />
              Google
            </Button>
          </div>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-fg-secondary">
            Don&apos;t have an account?{" "}
            <a
              href="#signup"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

const loginCode = `import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Separator,
} from "@cooud-ui/ui";
import { ChartColumnIncreasing, Chrome, Github } from "lucide-react";

export function LoginBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <ChartColumnIncreasing className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Welcome back</CardTitle>
            <p className="text-sm text-fg-secondary">Sign in to your Cooud workspace</p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="login-email">Email</Label>
            <Input id="login-email" type="email" placeholder="you@company.com" autoComplete="email" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="login-remember" className="flex items-center gap-2 font-normal text-fg-secondary">
              <Checkbox id="login-remember" defaultChecked />
              Remember me
            </Label>
            <a
              href="#forgot"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <Button variant="gradient" size="lg" className="w-full">
            Sign in
          </Button>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-fg-tertiary">or continue with</span>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline">
              <Github className="size-4" aria-hidden="true" />
              GitHub
            </Button>
            <Button variant="outline">
              <Chrome className="size-4" aria-hidden="true" />
              Google
            </Button>
          </div>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-fg-secondary">
            Don&apos;t have an account?{" "}
            <a
              href="#signup"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 2. Signup — create-account card
 * ────────────────────────────────────────────────────────────────────────── */

export function SignupBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <ChartColumnIncreasing className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Create your account</CardTitle>
            <p className="text-sm text-fg-secondary">Start building with Cooud in minutes.</p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="signup-name">Full name</Label>
            <Input id="signup-name" placeholder="Mara Castillo" autoComplete="name" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input
              id="signup-password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <p className="text-xs text-fg-tertiary">Must be at least 8 characters.</p>
          </div>

          <Label
            htmlFor="signup-terms"
            className="flex items-start gap-2 font-normal text-fg-secondary"
          >
            <Checkbox id="signup-terms" defaultChecked />I agree to the Terms and Privacy Policy.
          </Label>

          <Button variant="gradient" size="lg" className="w-full">
            Create account
          </Button>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-fg-tertiary">or sign up with</span>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline">
              <Github className="size-4" aria-hidden="true" />
              GitHub
            </Button>
            <Button variant="outline">
              <Chrome className="size-4" aria-hidden="true" />
              Google
            </Button>
          </div>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-fg-secondary">
            Already have an account?{" "}
            <a
              href="#signin"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

const signupCode = `import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Separator,
} from "@cooud-ui/ui";
import { ChartColumnIncreasing, Chrome, Github } from "lucide-react";

export function SignupBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <ChartColumnIncreasing className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Create your account</CardTitle>
            <p className="text-sm text-fg-secondary">Start building with Cooud in minutes.</p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="signup-name">Full name</Label>
            <Input id="signup-name" placeholder="Mara Castillo" autoComplete="name" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input id="signup-email" type="email" placeholder="you@company.com" autoComplete="email" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input
              id="signup-password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <p className="text-xs text-fg-tertiary">Must be at least 8 characters.</p>
          </div>

          <Label
            htmlFor="signup-terms"
            className="flex items-start gap-2 font-normal text-fg-secondary"
          >
            <Checkbox id="signup-terms" defaultChecked />I agree to the Terms and Privacy Policy.
          </Label>

          <Button variant="gradient" size="lg" className="w-full">
            Create account
          </Button>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-fg-tertiary">or sign up with</span>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline">
              <Github className="size-4" aria-hidden="true" />
              GitHub
            </Button>
            <Button variant="outline">
              <Chrome className="size-4" aria-hidden="true" />
              Google
            </Button>
          </div>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-fg-secondary">
            Already have an account?{" "}
            <a
              href="#signin"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 3. Forgot password — request + sent
 * ────────────────────────────────────────────────────────────────────────── */

export function ForgotPasswordBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <KeyRound className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Reset your password</CardTitle>
            <p className="text-sm text-fg-secondary">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="forgot-email">Email</Label>
            <Input
              id="forgot-email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
            />
          </div>

          <Button variant="gradient" size="lg" className="w-full">
            Send reset link
          </Button>
        </CardContent>

        <CardFooter className="justify-center">
          <a
            href="#signin"
            className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-fg-secondary transition-colors hover:text-fg"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to sign in
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}

const forgotPasswordCode = `import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@cooud-ui/ui";
import { ArrowLeft, KeyRound } from "lucide-react";

export function ForgotPasswordBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <KeyRound className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Reset your password</CardTitle>
            <p className="text-sm text-fg-secondary">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="forgot-email">Email</Label>
            <Input id="forgot-email" type="email" placeholder="you@company.com" autoComplete="email" />
          </div>

          <Button variant="gradient" size="lg" className="w-full">
            Send reset link
          </Button>
        </CardContent>

        <CardFooter className="justify-center">
          <a
            href="#signin"
            className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-fg-secondary transition-colors hover:text-fg"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to sign in
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}`;

export function ForgotPasswordSentBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-success/10 text-success">
            <MailCheck className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Check your inbox</CardTitle>
            <p className="text-sm text-fg-secondary">
              We sent a password reset link to mara@cooud.io.
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-fg-secondary text-center">
            Didn&apos;t get it? Check your spam folder, or resend below.
          </p>

          <Button variant="gradient" size="lg" className="w-full">
            Resend email
          </Button>
        </CardContent>

        <CardFooter className="justify-center">
          <a
            href="#signin"
            className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-fg-secondary transition-colors hover:text-fg"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to sign in
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}

const forgotPasswordSentCode = `import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@cooud-ui/ui";
import { ArrowLeft, MailCheck } from "lucide-react";

export function ForgotPasswordSentBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-success/10 text-success">
            <MailCheck className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Check your inbox</CardTitle>
            <p className="text-sm text-fg-secondary">
              We sent a password reset link to mara@cooud.io.
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-fg-secondary text-center">
            Didn&apos;t get it? Check your spam folder, or resend below.
          </p>

          <Button variant="gradient" size="lg" className="w-full">
            Resend email
          </Button>
        </CardContent>

        <CardFooter className="justify-center">
          <a
            href="#signin"
            className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-fg-secondary transition-colors hover:text-fg"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to sign in
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 4. OTP — two-factor authentication
 * ────────────────────────────────────────────────────────────────────────── */

export function OtpBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Two-factor authentication</CardTitle>
            <p className="text-sm text-fg-secondary">
              Enter the 6-digit code from your authenticator app.
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex justify-center">
            <InputOTP maxLength={6} aria-label="6-digit authentication code">
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button variant="gradient" size="lg" className="w-full">
            Verify
          </Button>

          <p className="text-center text-sm text-fg-secondary">
            Didn&apos;t receive a code?{" "}
            <a
              href="#resend"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Resend
            </a>
          </p>
        </CardContent>

        <CardFooter className="justify-center">
          <a
            href="#signin"
            className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-fg-secondary transition-colors hover:text-fg"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to sign in
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}

const otpCode = `import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@cooud-ui/ui";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export function OtpBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Two-factor authentication</CardTitle>
            <p className="text-sm text-fg-secondary">
              Enter the 6-digit code from your authenticator app.
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex justify-center">
            <InputOTP maxLength={6} aria-label="6-digit authentication code">
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button variant="gradient" size="lg" className="w-full">
            Verify
          </Button>

          <p className="text-center text-sm text-fg-secondary">
            Didn&apos;t receive a code?{" "}
            <a
              href="#resend"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Resend
            </a>
          </p>
        </CardContent>

        <CardFooter className="justify-center">
          <a
            href="#signin"
            className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-fg-secondary transition-colors hover:text-fg"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to sign in
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 5. Magic link — request + sent
 * ────────────────────────────────────────────────────────────────────────── */

export function MagicLinkBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <Sparkles className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Sign in with a magic link</CardTitle>
            <p className="text-sm text-fg-secondary">
              We&apos;ll email you a link for password-free sign-in.
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="magic-email">Email</Label>
            <Input
              id="magic-email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
            />
          </div>

          <Button variant="gradient" size="lg" className="w-full">
            Send magic link
          </Button>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-fg-tertiary">or continue with</span>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline">
              <Github className="size-4" aria-hidden="true" />
              GitHub
            </Button>
            <Button variant="outline">
              <Chrome className="size-4" aria-hidden="true" />
              Google
            </Button>
          </div>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-fg-secondary">
            Prefer a password?{" "}
            <a
              href="#signin"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

const magicLinkCode = `import {
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
import { Chrome, Github, Sparkles } from "lucide-react";

export function MagicLinkBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <Sparkles className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Sign in with a magic link</CardTitle>
            <p className="text-sm text-fg-secondary">
              We&apos;ll email you a link for password-free sign-in.
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="magic-email">Email</Label>
            <Input id="magic-email" type="email" placeholder="you@company.com" autoComplete="email" />
          </div>

          <Button variant="gradient" size="lg" className="w-full">
            Send magic link
          </Button>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-fg-tertiary">or continue with</span>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline">
              <Github className="size-4" aria-hidden="true" />
              GitHub
            </Button>
            <Button variant="outline">
              <Chrome className="size-4" aria-hidden="true" />
              Google
            </Button>
          </div>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-fg-secondary">
            Prefer a password?{" "}
            <a
              href="#signin"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}`;

export function MagicLinkSentBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-success/10 text-success">
            <MailCheck className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Check your email</CardTitle>
            <p className="text-sm text-fg-secondary">
              We emailed a magic link to mara@cooud.io. Click it to sign in.
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <p className="text-center text-sm text-fg-tertiary">The link expires in 10 minutes.</p>

          <Button variant="outline" className="w-full">
            Resend link
          </Button>
        </CardContent>

        <CardFooter className="justify-center">
          <a
            href="#signin"
            className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-fg-secondary transition-colors hover:text-fg"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to sign in
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}

const magicLinkSentCode = `import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@cooud-ui/ui";
import { ArrowLeft, MailCheck } from "lucide-react";

export function MagicLinkSentBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-success/10 text-success">
            <MailCheck className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Check your email</CardTitle>
            <p className="text-sm text-fg-secondary">
              We emailed a magic link to mara@cooud.io. Click it to sign in.
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <p className="text-center text-sm text-fg-tertiary">The link expires in 10 minutes.</p>

          <Button variant="outline" className="w-full">
            Resend link
          </Button>
        </CardContent>

        <CardFooter className="justify-center">
          <a
            href="#signin"
            className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-fg-secondary transition-colors hover:text-fg"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to sign in
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * Block map
 * ────────────────────────────────────────────────────────────────────────── */

export const authBlocks: BlockContentMap = {
  login: { preview: <LoginBlock />, code: loginCode },
  signup: { preview: <SignupBlock />, code: signupCode },
  "forgot-password": {
    preview: <ForgotPasswordBlock />,
    code: forgotPasswordCode,
    variants: [
      {
        id: "request",
        name: "Request link",
        description: "Email entry that sends a one-time password reset link.",
        appearance: "dark",
        preview: <ForgotPasswordBlock />,
        code: forgotPasswordCode,
      },
      {
        id: "sent",
        name: "Link sent",
        description: "Confirmation that a reset link was emailed, with a resend action.",
        appearance: "light",
        preview: <ForgotPasswordSentBlock />,
        code: forgotPasswordSentCode,
      },
    ],
  },
  otp: { preview: <OtpBlock />, code: otpCode },
  "magic-link": {
    preview: <MagicLinkBlock />,
    code: magicLinkCode,
    variants: [
      {
        id: "request",
        name: "Request link",
        description: "Passwordless email entry that sends a single-use sign-in link.",
        appearance: "dark",
        preview: <MagicLinkBlock />,
        code: magicLinkCode,
      },
      {
        id: "sent",
        name: "Link sent",
        description: "Confirmation that a magic sign-in link was emailed, with a resend action.",
        appearance: "light",
        preview: <MagicLinkSentBlock />,
        code: magicLinkSentCode,
      },
    ],
  },
};

/* -------------------------------------------------------------------------- */
/*  Lazily-loaded detail views                                                */
/*                                                                            */
/*  These are imported per-slug via next/dynamic by the block detail routes,  */
/*  so visiting a block only loads this family chunk (not the other family).  */
/* -------------------------------------------------------------------------- */

export function AuthGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(authBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function AuthView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(authBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
