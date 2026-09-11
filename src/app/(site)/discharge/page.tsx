import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { DischargeLetterForm } from "@/components/sections/DischargeLetterForm";
import { DischargeSwitch } from "@/components/sections/DischargeSwitch";
import { FinalCtaSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FinalCtaSection";
import { DISCHARGE_META } from "@/content/services/discharge";
import { buildMedicalWebPage } from "@/lib/schema";

/* Same shape as `serviceMetadata`; noindex is applied site-wide in the layout. */
export const metadata: Metadata = {
  title: DISCHARGE_META.title,
  description: DISCHARGE_META.description,
  alternates: { canonical: DISCHARGE_META.path },
};

/**
 * `/discharge/` — Discharge Letter, the page the footer also calls Transfer
 * Your Care.
 *
 * Two sections, which is what her page is: the switch offer with the form
 * beside it, then the closing band. `FinalCtaSection` takes no props here
 * deliberately — its defaults are "Easy Access, Professional Care" with the
 * email capture, which is exactly her band.
 *
 * It does not use `ServicePage`. Her page shares none of that template's
 * structure — no dark hero, no trust strip, no lead-paragraph band, no
 * modules — and routing it through the template is what buried her two-column
 * layout under a stack of sections she does not have.
 */
export default function Page() {
  return (
    <>
      <JsonLd
        data={buildMedicalWebPage({
          name: DISCHARGE_META.title,
          description: DISCHARGE_META.description,
          path: DISCHARGE_META.path,
        })}
      />
      <DischargeSwitch form={<DischargeLetterForm />} />
      <FinalCtaSection />
    </>
  );
}
