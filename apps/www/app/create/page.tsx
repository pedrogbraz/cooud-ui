import type { Metadata } from "next";
import { CreateStudio } from "../../components/create/create-studio";

export const metadata: Metadata = {
  title: "Create — Cooud UI",
  description: "Build, save, shuffle, and export complete Cooud UI design-system presets.",
};

export default function CreatePage() {
  return <CreateStudio />;
}
