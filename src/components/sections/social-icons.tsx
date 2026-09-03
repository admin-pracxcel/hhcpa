/**
 * The three share marks the live article template carries: Facebook, X and
 * LinkedIn.
 *
 * Drawn as inline SVG rather than pulled from an icon font, which is what the
 * source uses. A webfont for three glyphs would be a network request and a
 * flash of nothing on every article page, and `currentColor` is what lets these
 * take the hover from the link they sit in.
 *
 * 18px inside a 24px box, matching the measured `font-size: 18px` on a
 * `24px × 24px` anchor.
 */

const SIZE = 18;

export function FacebookIcon() {
  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox="0 0 320 512"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M80 299.3V512h116V299.3h86.5l18-97.8H196v-34.6c0-51.7 20.3-71.5 72.7-71.5 16.3 0 29.4.4 37 1.2V7.9C291.4 4 256.4 0 236.2 0 129.3 0 80 50.5 80 159.4v42.1H14v97.8h66z" />
    </svg>
  );
}

export function XIcon() {
  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox="0 0 512 512"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
    </svg>
  );
}

export function LinkedInIcon() {
  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox="0 0 448 512"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
    </svg>
  );
}
