"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Progress,
  Spinner,
  Toaster,
  toast,
} from "@cooud/ui";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
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
