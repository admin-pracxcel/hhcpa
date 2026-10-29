/**
 * Styles for the shared FAQ accordion.
 *
 * ⚠️ A plain module, deliberately NOT inside FaqAccordion.tsx.
 *
 * That file is `"use client"`, and Next replaces every export of a client
 * module with a client reference when a server component imports it. This
 * string is read by ArticleBody, which is a server component, so living
 * there turned it into a stub and interpolated
 * "Attempted to call FAQ_ACCORDION_STYLES() from the server" into the
 * stylesheet. Nothing failed: the build passed, the tests passed, and the
 * accordion shipped with every panel open and no layout.
 *
 * CSS is not client code. Keeping it in its own module is what makes that
 * true of the import as well as of the content.
 */

export const FAQ_ACCORDION_STYLES = `
.hhcp-fq-accordion {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 662px;
  border-bottom: 1px solid #ececec;
}

.hhcp-fq-question {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  gap: var(--hhcp-space-m, 30px);
  cursor: pointer;
  width: 100%;
  padding: var(--hhcp-space-s, 20px) 0;
  border-top: 1px solid #ececec;
  border-left: none;
  border-right: none;
  border-bottom: none;
  background-color: transparent;
  text-align: left;
}

.hhcp-fq-question-label {
  font-size: var(--hhcp-h4, 20px);
  line-height: 24.16px;
  font-weight: 500;
  color: var(--hhcp-primary, #013126);
  text-align: start;
}

.hhcp-fq-icon {
  flex: none;
  transition: all 0.2s ease;
}

/* The source rotates the whole plus glyph into a cross; it does not swap art. */
.hhcp-fq-item.is-open .hhcp-fq-icon {
  transform: rotate(45deg);
}

.hhcp-fq-panel {
  display: none;
  padding: 0 0 var(--hhcp-space-m, 30px);
  font-size: var(--hhcp-text-s, 16px);
  line-height: 24px;
  color: rgba(1, 49, 38, 0.8);
}

.hhcp-fq-item.is-open .hhcp-fq-panel {
  display: block;
}
`;
