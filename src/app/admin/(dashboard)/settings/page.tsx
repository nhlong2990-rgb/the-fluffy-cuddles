import { getSettings } from "@/lib/settings";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Cài đặt</h1>
      <SettingsForm
        facebookLink={settings.facebookLink}
        priceRanges={settings.priceRanges as any}
      />
    </div>
  );
}
