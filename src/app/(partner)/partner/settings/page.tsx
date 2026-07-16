import { Metadata } from "next";
import { SettingsClient } from "./SettingsClient";

export const metadata: Metadata = {
  title: "Pengaturan - Partner Dashboard",
};

export default function SettingsPage() {
  return <SettingsClient />;
}




