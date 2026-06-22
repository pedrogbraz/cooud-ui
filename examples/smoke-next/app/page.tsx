import { Button } from "@cooud/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@cooud/ui/card";

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-6 p-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Cooud UI — external install</CardTitle>
          <CardDescription>
            Rendered from the published @cooud/ui tarball on Tailwind v4.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button>Primary</Button>
          <Button variant="gradient">Gradient</Button>
          <Button variant="outline">Outline</Button>
        </CardContent>
      </Card>
    </main>
  );
}
