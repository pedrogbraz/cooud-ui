"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@cooud/ui";
import { PACKAGE_MANAGERS, type PackageManagerCommand } from "../../lib/docs";
import { CodeBlock } from "./code-block";

type CommandKind = "init" | "add";

const commandLabels: Record<CommandKind, string> = {
  init: "Initialize project",
  add: "Add components",
};

export function PackageManagerTabs({
  command = "init",
  description,
}: {
  command?: CommandKind;
  description?: string;
}) {
  return (
    <Tabs defaultValue="pnpm" className="gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TabsList className="overflow-x-auto">
          {PACKAGE_MANAGERS.map((manager) => (
            <TabsTrigger key={manager.id} value={manager.id}>
              {manager.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <p className="text-sm text-fg-tertiary">{description ?? commandLabels[command]}</p>
      </div>
      {PACKAGE_MANAGERS.map((manager) => (
        <TabsContent key={manager.id} value={manager.id}>
          <CodeBlock code={commandFor(manager, command)} language="bash" />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function commandFor(manager: PackageManagerCommand, command: CommandKind) {
  return manager[command];
}
