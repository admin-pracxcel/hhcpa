import { Intro } from "./Intro";
import { TextImage } from "./TextImage";
import { Checklist } from "./Checklist";
import { Steps } from "./Steps";
import { FeatureTiles } from "./FeatureTiles";
import { RelatedServices } from "./RelatedServices";
import { InlineCta } from "./InlineCta";
import { PricingCue } from "./PricingCue";
import { SafetyCallout } from "./SafetyCallout";
import { DisclosureCallout } from "./DisclosureCallout";
import { PractitionerCards } from "./PractitionerCards";
import { ContactBlock } from "./ContactBlock";
import type { ModuleSpec } from "./types";

/**
 * Dispatches a page's ordered middle sections to their components.
 *
 * The switch is exhaustive over `ModuleSpec`. Adding a member to the union
 * without adding a case here is a type error, which is the point: the vocabulary
 * and the renderer cannot drift.
 */
export function ModuleRenderer({ modules }: { modules: readonly ModuleSpec[] }) {
  return (
    <>
      {modules.map((module, index) => (
        <Module key={`${module.kind}-${index}`} module={module} />
      ))}
    </>
  );
}

function Module({ module }: { module: ModuleSpec }) {
  switch (module.kind) {
    case "intro":
      return <Intro text={module.text} />;
    case "textImage":
      return (
        <TextImage
          heading={module.heading}
          body={module.body}
          image={module.image}
          imageSide={module.imageSide}
        />
      );
    case "checklist":
      return (
        <Checklist
          heading={module.heading}
          intro={module.intro}
          items={module.items}
          outro={module.outro}
        />
      );
    case "steps":
      return <Steps heading={module.heading} steps={module.steps} />;
    case "featureTiles":
      return <FeatureTiles heading={module.heading} tiles={module.tiles} />;
    case "relatedServices":
      return <RelatedServices heading={module.heading} links={module.links} />;
    case "inlineCta":
      return (
        <InlineCta heading={module.heading} body={module.body} links={module.links} />
      );
    case "pricingCue":
      return (
        <PricingCue
          heading={module.heading}
          body={module.body}
          priceKey={module.priceKey}
          note={module.note}
        />
      );
    case "safetyCallout":
      return <SafetyCallout heading={module.heading} body={module.body} />;
    case "disclosureCallout":
      return (
        <DisclosureCallout
          heading={module.heading}
          body={module.body}
          link={module.link}
        />
      );
    case "practitionerCards":
      return (
        <PractitionerCards
          heading={module.heading}
          practitioners={module.practitioners}
        />
      );
    case "contactBlock":
      return <ContactBlock heading={module.heading} />;
    default: {
      /**
       * Exhaustiveness guard. Adding a member to `ModuleSpec` without a case
       * above makes this assignment a type error.
       *
       * This is not redundant with the switch: React 19's types allow a
       * component to return `undefined`, so without it a missing case compiles
       * silently and renders nothing.
       */
      const exhaustive: never = module;
      return exhaustive;
    }
  }
}
