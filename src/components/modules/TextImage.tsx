import Image from "next/image";
import { Container } from "./Container";
import type { ImageRef } from "./types";

/**
 * Split text + supporting image. 37 instances, the most-used module on the site.
 *
 * `imageSide` drives an order swap at >991px; below that the stack is always
 * text-then-image so reading order stays sensible on a phone.
 */
export function TextImage({
  heading,
  body,
  image,
  imageSide = "right",
}: {
  heading: string;
  body: readonly string[];
  image: ImageRef;
  imageSide?: "left" | "right";
}) {
  return (
    <section className="py-[var(--hhcp-section-space-m)] px-[var(--hhcp-gutter)]">
      <Container>
        <div
          data-image-side={imageSide}
          className="grid grid-cols-2 items-center gap-[var(--hhcp-space-xl)] max-[991px]:grid-cols-1"
        >
          <div className={imageSide === "left" ? "order-2 max-[991px]:order-1" : "order-1"}>
            <h2 className="font-dm-sans text-[length:var(--hhcp-h2)] leading-[var(--hhcp-heading-lh)] font-normal tracking-[-0.42px] text-[color:var(--hhcp-primary)]">
              {heading}
            </h2>
            <div className="mt-[var(--hhcp-space-m)] flex flex-col gap-[var(--hhcp-space-s)]">
              {body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="font-dm-sans text-[length:var(--hhcp-text-m)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-base-80)]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div className={imageSide === "left" ? "order-1 max-[991px]:order-2" : "order-2"}>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="h-auto w-full rounded-[var(--hhcp-radius-l)] object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
