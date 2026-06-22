"use client";

import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertTitle,
  Button,
  Progress,
  Spinner,
  Toaster,
  toast,
} from "@cooud/ui";
import { CircleAlert, CircleCheck, Info, Terminal, Trash2, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { ExampleList } from "../../components/docs/example-list";
import type { ExampleMap } from "./types";

// ── Progress: animate one bar in on mount ─────────────────────────────
function ProgressDemo() {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(66), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Progress value={30} />
      <Progress value={animated} />
      <Progress value={100} />
    </div>
  );
}

// ── Sonner: a single Toaster plus buttons that fire toasts ────────────
function ToastDemo() {
  return (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-2">
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
      </div>
    </>
  );
}

export const feedbackExamples: ExampleMap = {
  alert: [
    {
      id: "default",
      title: "Default",
      description: "An inline callout with an icon, title, and description.",
      code: `<Alert>
  <Terminal aria-hidden="true" />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components to your app using the CLI.
  </AlertDescription>
</Alert>`,
      preview: (
        <Alert className="max-w-md">
          <Terminal aria-hidden="true" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
        </Alert>
      ),
    },
    {
      id: "variants",
      title: "Variants",
      description: "Semantic variants tint the surface, border, and icon for each intent.",
      code: `<div className="flex flex-col gap-4">
  <Alert variant="info">
    <Info aria-hidden="true" />
    <AlertTitle>New version available</AlertTitle>
    <AlertDescription>A new release is ready to install.</AlertDescription>
  </Alert>
  <Alert variant="success">
    <CircleCheck aria-hidden="true" />
    <AlertTitle>Payment received</AlertTitle>
    <AlertDescription>Your subscription is now active.</AlertDescription>
  </Alert>
  <Alert variant="warning">
    <TriangleAlert aria-hidden="true" />
    <AlertTitle>Storage almost full</AlertTitle>
    <AlertDescription>You've used 92% of your quota.</AlertDescription>
  </Alert>
  <Alert variant="destructive">
    <CircleAlert aria-hidden="true" />
    <AlertTitle>Unable to save changes</AlertTitle>
    <AlertDescription>Check your connection and try again.</AlertDescription>
  </Alert>
</div>`,
      preview: (
        <div className="flex max-w-md flex-col gap-4">
          <Alert variant="info">
            <Info aria-hidden="true" />
            <AlertTitle>New version available</AlertTitle>
            <AlertDescription>A new release is ready to install.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <CircleCheck aria-hidden="true" />
            <AlertTitle>Payment received</AlertTitle>
            <AlertDescription>Your subscription is now active.</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <TriangleAlert aria-hidden="true" />
            <AlertTitle>Storage almost full</AlertTitle>
            <AlertDescription>You've used 92% of your quota.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <CircleAlert aria-hidden="true" />
            <AlertTitle>Unable to save changes</AlertTitle>
            <AlertDescription>Check your connection and try again.</AlertDescription>
          </Alert>
        </div>
      ),
    },
    {
      id: "title-only",
      title: "Title only",
      description: "Drop the icon and description for a compact, single-line callout.",
      code: `<Alert variant="info">
  <AlertTitle>Your trial ends in 3 days.</AlertTitle>
</Alert>`,
      preview: (
        <Alert variant="info" className="max-w-md">
          <AlertTitle>Your trial ends in 3 days.</AlertTitle>
        </Alert>
      ),
    },
  ],

  spinner: [
    {
      id: "sizes",
      title: "Sizes",
      description: "An accessible loading indicator in three sizes.",
      code: `<div className="flex items-center gap-6">
  <Spinner size="sm" aria-label="Loading small" />
  <Spinner size="md" aria-label="Loading medium" />
  <Spinner size="lg" aria-label="Loading large" />
</div>`,
      preview: (
        <div className="flex items-center gap-6">
          <Spinner size="sm" aria-label="Loading small" />
          <Spinner size="md" aria-label="Loading medium" />
          <Spinner size="lg" aria-label="Loading large" />
        </div>
      ),
    },
  ],

  progress: [
    {
      id: "determinate",
      title: "Determinate",
      description: "Determinate progress bars — the middle bar animates in on mount.",
      code: `function ProgressDemo() {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(66), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Progress value={30} />
      <Progress value={animated} />
      <Progress value={100} />
    </div>
  );
}`,
      preview: <ProgressDemo />,
    },
  ],

  sonner: [
    {
      id: "toasts",
      title: "Toasts",
      description: "Mount one Toaster, then fire transient notifications imperatively via toast().",
      code: `function ToastDemo() {
  return (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => toast("Event has been created.")}>
          Default
        </Button>
        <Button variant="outline" onClick={() => toast.success("Changes saved successfully.")}>
          Success
        </Button>
        <Button variant="outline" onClick={() => toast.error("Something went wrong. Please try again.")}>
          Error
        </Button>
      </div>
    </>
  );
}`,
      preview: <ToastDemo />,
    },
  ],

  "alert-dialog": [
    {
      id: "confirm",
      title: "Confirm",
      description: "A focus-trapping confirmation for destructive or irreversible actions.",
      code: `<AlertDialog>
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
      <AlertDialogAction>Yes, delete it</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,
      preview: (
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
              <AlertDialogAction>Yes, delete it</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
    },
  ],
};

/**
 * Default-export view for this family. Imported lazily per-slug by the
 * `/components/[slug]` detail route, so visiting one component only loads this
 * family chunk (not the whole catalog).
 */
export default function FeedbackExamples({ slug }: { slug: string }) {
  return <ExampleList examples={feedbackExamples[slug] ?? []} />;
}
