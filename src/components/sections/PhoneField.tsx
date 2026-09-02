"use client";

/**
 * Phone input with a country selector.
 *
 * The selector is a custom combobox rather than a native `<select>`. A native
 * select shows the same text closed as it does open, so it would have to read
 * either "🇦🇺 +61" — ambiguous, since +1 is both the US and Canada — or
 * "🇦🇺 Australia +61", which makes the closed control far too wide to sit inside
 * a phone field. The custom control shows the flag and dial code closed, the
 * full country name open, and can be searched by name or code.
 *
 * That trade buys UX at the cost of having to implement what the native control
 * gives free, so it is all here: roving focus with the arrow keys, Home/End,
 * Enter and Escape, type-to-search, click-outside to dismiss, focus returned to
 * the button on close, and `role="combobox"`/`role="listbox"` wired to
 * `aria-activedescendant` so a screen reader tracks the highlighted option.
 *
 * The country is guessed through `useSyncExternalStore`, because the guess
 * reads an external system: the browser's timezone and locale, neither of which
 * exists on the server. Its server snapshot is Australia — right for nearly
 * every visitor to this clinic — and its client snapshot is the guess, so React
 * reconciles the two after hydration rather than the markup differing. Doing
 * this with an effect that calls setState works, but is a cascading render and
 * the compiler lint rejects it.
 *
 * The placeholder is the selected country's own number format, so it changes
 * with the selection. Those formats are illustrative, not validation: the field
 * accepts any plausible number rather than rejecting real ones on a pattern.
 */

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import {
  COUNTRIES,
  DEFAULT_COUNTRY,
  findCountry,
  guessCountry,
} from "@/content/countries";
import { cn } from "@/lib/utils";

const STYLES = `
.hhcp-ph-group {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
  border: 1px solid var(--hhcp-base-20, rgba(1, 49, 38, 0.2));
  border-radius: var(--hhcp-radius-s, 6.667px);
  background: #ffffff;
  transition: border-color 0.2s linear, box-shadow 0.2s linear;
}

.hhcp-ph-group:focus-within {
  border-color: var(--hhcp-primary, #013126);
  box-shadow: 0 0 0 3px rgba(88, 237, 162, 0.35);
}

.hhcp-ph-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  padding: 14px;
  border: 0;
  border-right: 1px solid var(--hhcp-base-20, rgba(1, 49, 38, 0.2));
  border-radius: var(--hhcp-radius-s, 6.667px) 0 0 var(--hhcp-radius-s, 6.667px);
  background: var(--hhcp-accent, #f5fff9);
  color: var(--hhcp-primary, #013126);
  font-family: var(--font-dm-sans-local), ui-sans-serif, system-ui, sans-serif;
  font-size: var(--hhcp-text-s, 16px);
  cursor: pointer;
  white-space: nowrap;
}

.hhcp-ph-trigger:hover {
  background: var(--hhcp-light-green, #ddffeb);
}

.hhcp-ph-flag {
  font-size: 18px;
  line-height: 1;
}

.hhcp-ph-caret {
  color: var(--hhcp-base-60, rgba(1, 49, 38, 0.6));
  line-height: 0;
  transition: transform 0.2s linear;
}

.hhcp-ph-trigger[aria-expanded="true"] .hhcp-ph-caret {
  transform: rotate(180deg);
}

.hhcp-ph-input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  padding: 14px;
  font-family: var(--font-dm-sans-local), ui-sans-serif, system-ui, sans-serif;
  font-size: var(--hhcp-text-s, 16px);
  color: var(--hhcp-primary, #013126);
}

.hhcp-ph-input::placeholder {
  color: var(--hhcp-base-60, rgba(1, 49, 38, 0.6));
}

.hhcp-ph-popup {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 40;
  width: min(340px, 100%);
  background: #ffffff;
  border: 1px solid var(--hhcp-base-20, rgba(1, 49, 38, 0.2));
  border-radius: var(--hhcp-radius-s, 6.667px);
  box-shadow: 0 12px 24px -8px rgba(1, 49, 39, 0.18);
  overflow: hidden;
}

.hhcp-ph-search {
  width: 100%;
  border: 0;
  border-bottom: 1px solid var(--hhcp-base-20, rgba(1, 49, 38, 0.2));
  outline: none;
  padding: 12px 14px;
  font-family: var(--font-dm-sans-local), ui-sans-serif, system-ui, sans-serif;
  font-size: var(--hhcp-text-s, 16px);
  color: var(--hhcp-primary, #013126);
}

.hhcp-ph-list {
  max-height: 260px;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 4px;
}

.hhcp-ph-option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border: 0;
  border-radius: var(--hhcp-radius-xs, 4.444px);
  background: transparent;
  text-align: left;
  cursor: pointer;
  font-family: var(--font-dm-sans-local), ui-sans-serif, system-ui, sans-serif;
  font-size: var(--hhcp-text-s, 16px);
  color: var(--hhcp-primary, #013126);
}

.hhcp-ph-option[data-active="true"] {
  background: var(--hhcp-accent, #f5fff9);
}

.hhcp-ph-option[aria-selected="true"] {
  font-weight: 600;
}

.hhcp-ph-option-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hhcp-ph-option-dial {
  flex: none;
  color: var(--hhcp-base-60, rgba(1, 49, 38, 0.6));
}

.hhcp-ph-empty {
  padding: 14px;
  font-family: var(--font-dm-sans-local), ui-sans-serif, system-ui, sans-serif;
  font-size: var(--hhcp-text-s, 16px);
  color: var(--hhcp-base-60, rgba(1, 49, 38, 0.6));
}
`;

/** Nothing to subscribe to: the guess is fixed for the life of the page. */
function subscribeToNothing() {
  return () => {};
}

function getServerCountry() {
  return DEFAULT_COUNTRY;
}

interface PhoneFieldProps {
  className?: string;
  /** National part posts under this name; the ISO code as `${name}Country`. */
  name: string;
  label: string;
  required?: boolean;
}

export function PhoneField({
  className,
  name,
  label,
  required,
}: PhoneFieldProps) {
  /*
   * The guess is a read of an external system — the browser's timezone and
   * locale — so it comes through useSyncExternalStore rather than an effect
   * that calls setState. The server snapshot is the default, the client
   * snapshot is the guess, and React reconciles the two after hydration
   * without a mismatch. Nothing ever changes, so the subscribe function has
   * nothing to unsubscribe.
   */
  const guessed = useSyncExternalStore(
    subscribeToNothing,
    guessCountry,
    getServerCountry,
  );
  const [chosen, setChosen] = useState<string | null>(null);
  const country = chosen ?? guessed;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const groupRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const inputId = useId();
  const listId = useId();
  const optionId = useId();

  const selected = findCountry(country);

  const matches = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (term === "") return COUNTRIES;
    return COUNTRIES.filter(
      (option) =>
        option.name.toLowerCase().includes(term) ||
        option.dial.includes(term) ||
        option.code.toLowerCase() === term,
    );
  }, [query]);

  const close = useCallback((refocus: boolean) => {
    setOpen(false);
    setQuery("");
    if (refocus) triggerRef.current?.focus();
  }, []);

  /* Dismiss on a press outside. Pointerdown, not click, so it fires before
     focus moves and cannot be swallowed by the element being pressed. */
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!groupRef.current?.contains(event.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  /* Keep the highlighted option in view as the arrows move it. */
  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.children[activeIndex] as
      | HTMLElement
      | undefined;
    node?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const choose = (code: string) => {
    setChosen(code);
    close(true);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close(true);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (matches.length === 0) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex(
        (index) => (index + step + matches.length) % matches.length,
      );
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(Math.max(0, matches.length - 1));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const option = matches[activeIndex];
      if (option) choose(option.code);
    }
  };

  return (
    <div className={cn("hhcp-form-field", className)}>
      <style>{STYLES}</style>
      <label className="hhcp-form-label" htmlFor={inputId}>
        {label}
      </label>

      <div className="hhcp-ph-group" ref={groupRef}>
        <button
          ref={triggerRef}
          type="button"
          className="hhcp-ph-trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-label={`Country calling code, currently ${selected.name} ${selected.dial}`}
          onClick={() => {
            setActiveIndex(
              Math.max(
                0,
                COUNTRIES.findIndex((option) => option.code === country),
              ),
            );
            setOpen((value) => !value);
          }}
        >
          <span className="hhcp-ph-flag" aria-hidden="true">
            {selected.flag}
          </span>
          <span>{selected.dial}</span>
          <span className="hhcp-ph-caret" aria-hidden="true">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path
                d="M1 1.5 6 6.5l5-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        <input
          id={inputId}
          className="hhcp-ph-input"
          type="tel"
          name={name}
          inputMode="tel"
          autoComplete="tel-national"
          placeholder={selected.example}
          required={required}
        />

        {/* The ISO code travels with the number, so the recipient does not have
            to infer the country from a dial code two countries share. */}
        <input type="hidden" name={`${name}Country`} value={selected.code} />

        {open && (
          <div className="hhcp-ph-popup">
            <input
              ref={searchRef}
              className="hhcp-ph-search"
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={
                matches[activeIndex]
                  ? `${optionId}-${matches[activeIndex].code}`
                  : undefined
              }
              placeholder="Search country or code"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={onKeyDown}
            />

            {matches.length === 0 ? (
              <p className="hhcp-ph-empty">No matching country.</p>
            ) : (
              <ul className="hhcp-ph-list" id={listId} role="listbox" ref={listRef}>
                {matches.map((option, index) => (
                  <li key={option.code}>
                    <button
                      type="button"
                      id={`${optionId}-${option.code}`}
                      className="hhcp-ph-option"
                      role="option"
                      aria-selected={option.code === country}
                      data-active={index === activeIndex}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => choose(option.code)}
                      tabIndex={-1}
                    >
                      <span className="hhcp-ph-flag" aria-hidden="true">
                        {option.flag}
                      </span>
                      <span className="hhcp-ph-option-name">{option.name}</span>
                      <span className="hhcp-ph-option-dial">{option.dial}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
