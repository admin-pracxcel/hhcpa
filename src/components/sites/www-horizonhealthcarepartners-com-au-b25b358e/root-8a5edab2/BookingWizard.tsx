"use client";

/**
 * Horizon Health Care Partners booking wizard.
 *
 * A React port of the self-contained widget the target embeds inside the
 * "How We Support You" section. The original is one `<div id="hhp-booking-wrapper">`
 * carrying its own `<style>` block plus ~700 lines of imperative DOM building
 * (`hhpInit`, `hhpHandleServiceClick`, `hhpRenderOptions`, `hhpRenderTimingOptions`,
 * `hhpStartCertScreening`, `hhpRenderCertStep`, `hhpCertShowResult`, `hhpRenderQuiz`,
 * `hhpStartHealthOptScreening`, `hhpRenderHealthOptStep`, `hhpTriage`,
 * `hhpShowScreenResult`, `hhpPerformRedirect`, `hhpReset`, `hhpUpdateSteps`).
 * All of that becomes state + declarative rendering here; the copy, the branching,
 * the `showIf` conditionals and the triage rules are unchanged.
 *
 * Two deliberate properties of the port:
 *
 * 1. The CSS below is the authored stylesheet copied verbatim. It is already
 *    namespaced under `#hhp-booking-wrapper`, so it cannot leak, and a verbatim
 *    copy is what keeps the widget pixel-exact. The widget also has its own token
 *    namespace and font stack that differ very slightly from the page's
 *    (`#013127` vs the page's `#013126`, `#f4fffa` vs the section's `#f5fff9`,
 *    Segoe UI rather than DM Sans) — those are the widget's own values and are
 *    kept as authored, not harmonised with the page.
 *
 * 2. The wrapper keeps `id="hhp-booking-wrapper"`: the site header's "Services"
 *    submenu deep-links to `#hhp-booking-wrapper` (and passes `?service=<key>`,
 *    which is honoured on mount exactly as the original did).
 *
 * Step 3 has two forms, matching `hhpPerformRedirect`:
 *   - The one-day medical-certificate path shows the spinner panel and then
 *     navigates to CERT_REDIRECT_URL after 1500ms.
 *   - Every other path embeds the live Halaxy booking widget in place.
 * The widget is the real clinic's, so this page can take real bookings.
 *
 * Accessibility: the source used click-handled `<div>`s for the service cards,
 * option rows, chips and survey options. Those are real `<button type="button">`
 * elements here so they are keyboard reachable; the class names are unchanged and
 * a short reset block at the end of the stylesheet re-neutralises the UA/preflight
 * button styling the original rules assumed away.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import {
  BMI_QUIZ,
  CERT_REDIRECT_URL,
  HALAXY_BOOKING_EMBED,
  CERT_STEPS,
  HEALTH_OPT_GOAL_MAP,
  HEALTH_OPT_STEPS,
  SERVICE_CARDS,
  SUB_MENUS,
  type AnswerMap,
  type AnswerValue,
  type CertQuestion,
  type CertResultLevel,
  type HealthOptQuestion,
  type MultiQuestion,
  type OptionsSubMenu,
  type ServiceKey,
  type ShowIf,
  type SingleQuestion,
  type TimingSubMenu,
  type TriageLevel,
} from "./bookingWizardData";

/* ------------------------------------------------------------------ *
 * Scoped stylesheet — copied verbatim from the target                 *
 * ------------------------------------------------------------------ */

const STYLES = `
        /* SCOPED CSS - Only affects this booking wizard */
        #hhp-booking-wrapper {
            /* COLOR PALETTE: Deep Green & Mint */
            --hhp-primary: #013127;
            --hhp-primary-hover: #024536;
            --hhp-bg: #f4fffa;
            --hhp-white: #ffffff;
            --hhp-text: #013127;
            --hhp-text-light: #526f68;
            --hhp-border: #d6e8e1;

            /* Action/Price Color */
            --hhp-action: #013127;

            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--hhp-bg);
            color: var(--hhp-text);
            line-height: 1.6;
            width: 100%;
            display: block;
            padding: 40px 20px;
        }


        #hhp-booking-wrapper * { box-sizing: border-box; margin: 0; padding: 0; }


        /* CONTAINER */
        #hhp-booking-wrapper .hhp-container { max-width: 1100px; margin: 0 auto; position: relative; }


        /* PROGRESS BAR */
        #hhp-booking-wrapper .hhp-progress-bar {
            position: relative;
            overflow: hidden;
            z-index: 0;
            background: var(--hhp-white);
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 32px;
            box-shadow: 0 4px 15px rgba(1, 49, 39, 0.05);
            border: 1px solid var(--hhp-border);
        }

        #hhp-booking-wrapper .hhp-steps { display: flex; justify-content: space-between; position: relative; }

        #hhp-booking-wrapper .hhp-step { flex: 1; text-align: center; position: relative; z-index: 2; }


        #hhp-booking-wrapper .hhp-step-circle {
            width: 36px; height: 36px;
            border-radius: 50%;
            position: relative; z-index: 1;
            background: var(--hhp-white);
            border: 2px solid var(--hhp-border);
            margin: 0 auto 8px;
            display: flex; align-items: center; justify-content: center;
            font-weight: 600; font-size: 14px; color: var(--hhp-text-light);
            transition: all 0.3s ease;
        }

        #hhp-booking-wrapper .hhp-step.active .hhp-step-circle {
            background: var(--hhp-primary);
            border-color: var(--hhp-primary);
            color: var(--hhp-white);
            box-shadow: 0 0 0 4px rgba(1, 49, 39, 0.15);
        }

        #hhp-booking-wrapper .hhp-step.completed .hhp-step-circle {
            background: var(--hhp-primary);
            border-color: var(--hhp-primary);
            color: var(--hhp-white);
        }


        #hhp-booking-wrapper .hhp-step-label { font-size: 16px; font-weight: 500; color: var(--hhp-text-light); }

        #hhp-booking-wrapper .hhp-step.active .hhp-step-label { color: var(--hhp-primary); font-weight: 700; }

        #hhp-booking-wrapper .hhp-step.completed .hhp-step-label { color: var(--hhp-primary); }


        #hhp-booking-wrapper .hhp-step-line {
            position: absolute; top: 18px; left: 50%; right: -50%;
            height: 2px; background: var(--hhp-border); z-index: 0;
        }

        #hhp-booking-wrapper .hhp-step:last-child .hhp-step-line { display: none; }

        #hhp-booking-wrapper .hhp-step.completed .hhp-step-line { background: var(--hhp-primary); }


        /* TITLES */
        #hhp-booking-wrapper .hhp-section-header { text-align: center; margin-bottom: 40px; }

        #hhp-booking-wrapper .hhp-section-title { font-size: 32px; font-weight: 300; color: var(--hhp-primary); margin-bottom: 12px; line-height: 1.2; }

        #hhp-booking-wrapper .hhp-section-subtitle { font-size: 16px; color: var(--hhp-text-light); max-width: 600px; margin: 0 auto; }


        /* SERVICES GRID */
        #hhp-booking-wrapper .hhp-services-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            width: 100%;
        }

        @media (max-width: 900px) { #hhp-booking-wrapper .hhp-services-grid { grid-template-columns: repeat(2, 1fr); }
 }

        @media (max-width: 600px) { #hhp-booking-wrapper .hhp-services-grid { grid-template-columns: 1fr; }
 }


        /* Sub-items list styling */
        #hhp-booking-wrapper .hhp-service-includes {
            font-size: 12px;
            color: var(--hhp-text-light);
            margin-top: 8px;
            margin-bottom: 12px;
            line-height: 1.5;
        }

        #hhp-booking-wrapper .hhp-service-includes span {
            display: inline;
        }


        #hhp-booking-wrapper .hhp-service-card {
            background: var(--hhp-white);
            border: 1px solid var(--hhp-border);
            border-radius: 12px;
            padding: 24px;
            text-align: left;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 220px;
        }

        #hhp-booking-wrapper .hhp-service-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px -8px rgba(1, 49, 39, 0.1);
            border-color: var(--hhp-primary);
        }

        #hhp-booking-wrapper .hhp-service-card.selected {
            border-color: var(--hhp-primary);
            background: var(--hhp-bg);
            box-shadow: 0 0 0 2px var(--hhp-primary);
        }


        /* ICONS */
        #hhp-booking-wrapper .hhp-service-icon {
            margin-bottom: 16px;
            height: 64px;
            display: flex;
            align-items: center;
        }

        #hhp-booking-wrapper .hhp-service-icon img {
            height: 64px;
            width: auto;
            max-width: 100%;
            display: block;
        }


        #hhp-booking-wrapper .hhp-service-name { font-size: 20px; font-weight: 400; color: var(--hhp-primary); margin-bottom: 8px; line-height: 1.3; }

        #hhp-booking-wrapper .hhp-service-desc { font-size: 14px; color: var(--hhp-text-light); margin-bottom: 20px; flex-grow: 1; }


        #hhp-booking-wrapper .hhp-service-price {
            display: inline-block;
            font-size: 16px;
            font-weight: 500;
            color: var(--hhp-primary);
            background: rgba(1, 49, 39, 0.08);
            padding: 6px 12px;
            border-radius: 6px;
            align-self: flex-start;
        }


        /* OPTIONS SECTION */
        #hhp-booking-wrapper .hhp-option-section {
            display: none;
            background: var(--hhp-white);
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
            border: 1px solid var(--hhp-border);
            animation: hhpFadeIn 0.4s ease;
        }


        #hhp-booking-wrapper .hhp-option-card {
            background: var(--hhp-white);
            border: 1px solid var(--hhp-border);
            border-radius: 12px;
            padding: 24px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: flex-start;
            gap: 16px;
            margin-bottom: 16px;
        }

        #hhp-booking-wrapper .hhp-option-card:hover {
            border-color: var(--hhp-primary);
            background: var(--hhp-bg);
            transform: translateX(4px);
        }

        #hhp-booking-wrapper .hhp-option-icon {
            width: 44px; height: 44px;
            background: var(--hhp-bg);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 20px; flex-shrink: 0; color: var(--hhp-primary);
            margin-top: 4px;
        }

        #hhp-booking-wrapper .hhp-option-content { flex: 1; }

        #hhp-booking-wrapper .hhp-option-header { display: flex; justify-content: space-between; margin-bottom: 8px; align-items: center; }

        #hhp-booking-wrapper .hhp-option-title { font-size: 20px; font-weight: 400; color: var(--hhp-text); }

        #hhp-booking-wrapper .hhp-option-price-tag { font-weight: 700; color: var(--hhp-primary); font-size: 18px; }


        #hhp-booking-wrapper .hhp-option-detail-box {
            font-size: 16px; color: var(--hhp-text-light);
            background: var(--hhp-bg); padding: 12px; border-radius: 8px; margin-top: 8px;
        }

        #hhp-booking-wrapper .hhp-detail-row { margin-bottom: 4px; display: flex; gap: 8px; }

        #hhp-booking-wrapper .hhp-detail-label { font-weight: 500; color: var(--hhp-primary); min-width: 100px; }

        #hhp-booking-wrapper .hhp-detail-text { color: var(--hhp-text); }


        /* QUIZ */
        #hhp-booking-wrapper .hhp-survey-input {
            width: 100%; padding: 14px;
            border: 2px solid var(--hhp-border);
            border-radius: 10px;
            font-size: 16px;
            margin-top: 10px;
            color: var(--hhp-primary);
            background: var(--hhp-white);
        }

        #hhp-booking-wrapper .hhp-survey-input:focus { outline: none; border-color: var(--hhp-primary); }

        #hhp-booking-wrapper textarea.hhp-survey-input { resize: vertical; font-family: inherit; }


        #hhp-booking-wrapper .hhp-survey-options { display: flex; flex-direction: column; gap: 12px; margin-top: 15px; }

        #hhp-booking-wrapper .hhp-survey-option {
            padding: 16px; border: 2px solid var(--hhp-border); border-radius: 10px;
            cursor: pointer; display: flex; align-items: center; gap: 12px;
            background: var(--hhp-white);
        }

        #hhp-booking-wrapper .hhp-survey-option:hover,
        #hhp-booking-wrapper .hhp-survey-option.selected {
            border-color: var(--hhp-primary); background: var(--hhp-bg);
        }

        #hhp-booking-wrapper .hhp-survey-option-letter {
            width: 28px; height: 28px; background: var(--hhp-bg); border-radius: 6px;
            display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--hhp-primary);
        }

        #hhp-booking-wrapper .hhp-survey-option.selected .hhp-survey-option-letter { background: var(--hhp-primary); color: var(--hhp-white); }


        /* CERTIFICATE QUIZ STYLES */
        #hhp-booking-wrapper .hhp-cert-question { margin-bottom: 28px; }

        #hhp-booking-wrapper .hhp-cert-question label { font-weight: 600; font-size: 16px; color: var(--hhp-primary); display: block; margin-bottom: 12px; }

        #hhp-booking-wrapper .hhp-cert-options-row { display: flex; flex-wrap: wrap; gap: 10px; }

        #hhp-booking-wrapper .hhp-cert-chip {
            padding: 10px 20px;
            border: 2px solid var(--hhp-border);
            border-radius: 50px;
            cursor: pointer;
            font-size: 15px;
            background: var(--hhp-white);
            color: var(--hhp-text);
            transition: all 0.2s ease;
        }

        #hhp-booking-wrapper .hhp-cert-chip:hover { border-color: var(--hhp-primary); background: var(--hhp-bg); }

        #hhp-booking-wrapper .hhp-cert-chip.selected { border-color: var(--hhp-primary); background: var(--hhp-primary); color: var(--hhp-white); }

        #hhp-booking-wrapper .hhp-cert-disclaimer {
            background: var(--hhp-bg);
            border: 1px solid var(--hhp-border);
            border-radius: 10px;
            padding: 16px 20px;
            font-size: 13px;
            color: var(--hhp-text-light);
            line-height: 1.6;
            margin-bottom: 28px;
        }


        /* CONSENT CHECKBOX ROWS */
        #hhp-booking-wrapper .hhp-consent-row {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 14px 16px;
            border: 1px solid var(--hhp-border);
            border-radius: 10px;
            margin-bottom: 12px;
            cursor: pointer;
            background: var(--hhp-white);
            font-size: 15px;
            color: var(--hhp-text);
        }

        #hhp-booking-wrapper .hhp-consent-row:hover { background: var(--hhp-bg); border-color: var(--hhp-primary); }

        #hhp-booking-wrapper .hhp-consent-row input[type="checkbox"] {
            width: 20px; height: 20px;
            accent-color: var(--hhp-primary);
            flex-shrink: 0;
            margin-top: 2px;
        }


        /* SCREENING STEP COUNTER */
        #hhp-booking-wrapper .hhp-screen-counter {
            text-align: center;
            margin-bottom: 20px;
            font-size: 13px;
            font-weight: 600;
            color: var(--hhp-text-light);
            text-transform: uppercase;
            letter-spacing: 0.8px;
        }


        /* REDIRECT MESSAGE */
        #hhp-booking-wrapper .hhp-redirect-message {
            display: none;
            text-align: center;
            padding: 60px 20px;
            background: var(--hhp-white);
            border-radius: 16px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
            border: 1px solid var(--hhp-border);
        }

        #hhp-booking-wrapper .hhp-spinner {
            width: 40px; height: 40px;
            border: 4px solid var(--hhp-border); border-top: 4px solid var(--hhp-primary);
            border-radius: 50%; margin: 0 auto 20px;
            animation: hhpSpin 1s linear infinite;
        }


        /* BUTTONS */
        #hhp-booking-wrapper .hhp-quiz-navigation { margin-top: 40px; display: flex; justify-content: space-between; }


        #hhp-booking-wrapper .hhp-nav-button {
            padding: 12px 28px;
            border-radius: 50px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            border: none;
            transition: all 0.2s;
        }

        #hhp-booking-wrapper .hhp-btn-back { background: var(--hhp-white); border: 1px solid var(--hhp-border); color: var(--hhp-text); }

        #hhp-booking-wrapper .hhp-btn-back:hover { background: var(--hhp-bg); }

        #hhp-booking-wrapper .hhp-btn-next { background: var(--hhp-primary); color: var(--hhp-white); }

        #hhp-booking-wrapper .hhp-btn-next:hover { background: var(--hhp-primary-hover); }


        /* HELPER CLASSES */
        #hhp-booking-wrapper .hhp-bmi-eligible { background: #e6f7f0; padding: 20px; border-radius: 10px; border: 1px solid #013127; margin-top: 20px; }

        #hhp-booking-wrapper .hhp-bmi-ineligible { background: #fdf2f2; padding: 20px; border-radius: 10px; border: 1px solid #991b1b; margin-top: 20px; }

        #hhp-booking-wrapper .hhp-bmi-neutral { background: #fff8ec; padding: 20px; border-radius: 10px; border: 1px solid #b7791f; margin-top: 20px; color: var(--hhp-text); }


        @keyframes hhpFadeIn { from { opacity: 0; transform: translateY(10px); }
 to { opacity: 1; transform: translateY(0); }
 }

        @keyframes hhpSpin { 0% { transform: rotate(0deg); }
 100% { transform: rotate(360deg); }
 }


        /* EMERGENCY NOTICE (shown on all services / steps) */
        #hhp-booking-wrapper .hhp-emergency-note {
            margin-bottom: 24px;
            padding: 14px 18px;
            border: 1px solid rgba(179, 38, 30, 0.28);
            background: rgba(179, 38, 30, 0.06);
            border-radius: 10px;
            font-size: 14px;
            line-height: 1.5;
            color: var(--hhp-text);
            text-align: center;
        }

        #hhp-booking-wrapper .hhp-emergency-note strong { color: #b3261e; }


        /* ===================== MOBILE RESPONSIVE ===================== */
        @media (max-width: 768px) {
            #hhp-booking-wrapper { padding: 24px 14px; }

            #hhp-booking-wrapper .hhp-progress-bar { padding: 18px 14px; margin-bottom: 24px; }

            #hhp-booking-wrapper .hhp-step-circle { width: 30px; height: 30px; font-size: 13px; }

            #hhp-booking-wrapper .hhp-step-label { font-size: 12px; line-height: 1.25; }

            #hhp-booking-wrapper .hhp-step-line { top: 15px; }

            #hhp-booking-wrapper .hhp-section-title { font-size: 26px; }

            #hhp-booking-wrapper .hhp-section-header { margin-bottom: 28px; }


            #hhp-booking-wrapper .hhp-option-section { padding: 24px 16px; }


            /* Option cards: give the text column room */
            #hhp-booking-wrapper .hhp-option-card { padding: 16px; gap: 12px; }

            #hhp-booking-wrapper .hhp-option-card:hover { transform: none; }

            #hhp-booking-wrapper .hhp-option-icon { width: 36px; height: 36px; font-size: 18px; margin-top: 2px; }

            #hhp-booking-wrapper .hhp-option-header { flex-wrap: wrap; gap: 2px 10px; align-items: baseline; }

            #hhp-booking-wrapper .hhp-option-title { font-size: 17px; }

            #hhp-booking-wrapper .hhp-option-price-tag { font-size: 16px; }


            /* CORE FIX: stack label above text so it stops squeezing into a sliver */
            #hhp-booking-wrapper .hhp-option-detail-box { font-size: 14px; padding: 12px 14px; }

            #hhp-booking-wrapper .hhp-detail-row { flex-direction: column; gap: 2px; margin-bottom: 8px; }

            #hhp-booking-wrapper .hhp-detail-row:last-child { margin-bottom: 0; }

            #hhp-booking-wrapper .hhp-detail-label { min-width: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.4px; }

            #hhp-booking-wrapper .hhp-detail-text { font-size: 14px; line-height: 1.5; }

        }

        @media (max-width: 400px) {
            #hhp-booking-wrapper { padding: 20px 10px; }

            #hhp-booking-wrapper .hhp-section-title { font-size: 22px; }

            #hhp-booking-wrapper .hhp-option-section { padding: 20px 12px; }

            #hhp-booking-wrapper .hhp-option-card { padding: 14px; gap: 10px; }

            #hhp-booking-wrapper .hhp-option-icon { width: 30px; height: 30px; font-size: 16px; }

        }


        /* ===== React port only =====
           Cards, option rows, chips and survey options were click-handled divs in
           the source; here they are real buttons for keyboard access. Neutralise
           the UA / Tailwind-preflight button styling the rules above assume away.
           The explicit font-family also stops the page's DM Sans leaking in via
           preflight's "font: inherit" on form controls. */
        #hhp-booking-wrapper button.hhp-service-card,
        #hhp-booking-wrapper button.hhp-option-card,
        #hhp-booking-wrapper button.hhp-survey-option,
        #hhp-booking-wrapper button.hhp-cert-chip,
        #hhp-booking-wrapper .hhp-nav-button,
        #hhp-booking-wrapper .hhp-survey-input {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            -webkit-appearance: none;
            appearance: none;
        }

        #hhp-booking-wrapper button.hhp-service-card,
        #hhp-booking-wrapper button.hhp-option-card,
        #hhp-booking-wrapper button.hhp-survey-option {
            width: 100%;
            text-align: left;
            font-size: inherit;
            line-height: inherit;
            color: inherit;
        }
`;

/* ------------------------------------------------------------------ *
 * Flow model                                                          *
 * ------------------------------------------------------------------ */

/**
 * Every screen the original could show. The progress bar reads step 1 for
 * `services`, step 3 for both terminal phases (`redirect` and `embed`), and
 * step 2 for everything in between — exactly what `hhpUpdateSteps` did.
 */
type Phase =
  | { kind: "services" }
  /** Timing chooser or sub-service list, driven by `SUB_MENUS[service]`. */
  | { kind: "options" }
  | { kind: "cert"; step: number }
  /** `step` is the cert step to return to via "Back to Question". */
  | { kind: "certResult"; level: CertResultLevel; step: number }
  /** Weight-management BMI pre-screening. */
  | { kind: "quiz" }
  | { kind: "healthOpt"; step: number }
  | { kind: "healthOptResult"; level: TriageLevel }
  /**
   * `hhpPerformRedirect(url)` — the one-day certificate branch. Shows the
   * spinner panel, then navigates to `url` after 1500ms.
   */
  | { kind: "redirect"; url: string }
  /**
   * `hhpPerformRedirect()` with no argument — every other path. Hides the
   * spinner panel and embeds the Halaxy booking widget in place instead.
   */
  | { kind: "embed" };

const asText = (value: AnswerValue | undefined): string =>
  typeof value === "string" ? value : "";

const asList = (value: AnswerValue | undefined): string[] =>
  Array.isArray(value) ? value : [];

/** `hhpCertCheckShowIf` — gates a question on an earlier answer in the same step. */
function passesShowIf(showIf: ShowIf | undefined, answers: AnswerMap): boolean {
  if (!showIf) return true;
  const value = answers[showIf.q];
  if ("includes" in showIf) {
    return Array.isArray(value) && value.includes(showIf.includes);
  }
  return value !== undefined && value !== "" && value !== showIf.notEquals;
}

/** `hhpTriage` — health-optimisation outcome from the screening answers. */
function triage(answers: AnswerMap): TriageLevel {
  if (answers.over18 === "No") return "ineligible-age";
  if (answers.inAustralia === "No") return "ineligible-location";

  // RED - do not auto book
  if (answers.pregnant === "Yes") return "red";
  if (answers.cancer === "Yes") return "red";

  // AMBER - practitioner review required before any treatment
  if (
    answers.organCondition === "Yes" ||
    answers.underCare === "Yes" ||
    answers.onMeds === "Yes" ||
    answers.usedPeptide === "Yes" ||
    answers.injectableAllergy === "Yes"
  ) {
    return "amber";
  }

  // GREEN - proceed to booking
  return "green";
}

function isServiceKey(value: string): value is ServiceKey {
  return Object.prototype.hasOwnProperty.call(SUB_MENUS, value);
}

/** The "Consultation Fee" block that heads both step-2 list layouts. */
function PriceHeader({ price }: { price: string }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 24 }}>
      <p
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "var(--hhp-text-light)",
          textTransform: "uppercase",
          letterSpacing: "0.8px",
          marginBottom: 8,
        }}
      >
        Consultation Fee
      </p>
      <span
        className="hhp-service-price"
        style={{ fontSize: 18, padding: "8px 18px" }}
      >
        {price}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Component                                                           *
 * ------------------------------------------------------------------ */

export function BookingWizard() {
  const [phase, setPhase] = useState<Phase>({ kind: "services" });
  const [service, setService] = useState<ServiceKey | null>(null);
  const [step2Label, setStep2Label] = useState("Service Options");
  /** BMI pre-screening answers (`hhpState.answers`). */
  const [answers, setAnswers] = useState<Record<string, string>>({});
  /** Medical certificate screening answers (`hhpState.certScreen`). */
  const [certAnswers, setCertAnswers] = useState<AnswerMap>({});
  /** Health optimisation screening answers (`hhpState.screen`). */
  const [screenAnswers, setScreenAnswers] = useState<AnswerMap>({});

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  /**
   * `hhpState.subOption` — the original recorded the chosen sub-service but never
   * rendered it, so it lives in a ref rather than driving a re-render.
   */
  const subOptionRef = useRef<string | null>(null);

  const config = service ? SUB_MENUS[service] : null;

  /* ---------------- navigation ---------------- */

  /**
   * `hhpPerformRedirect(url)`. Both branches advance the progress bar to step 3.
   *
   *  - Called WITH a url (only the one-day certificate path): show the spinner
   *    panel, then navigate after 1500ms.
   *  - Called WITHOUT one (every other path): hide the spinner panel and embed
   *    the Halaxy booking widget in place, so the patient books without leaving
   *    the page.
   *
   * `BOOKING_REDIRECT_URL` is never passed here, matching the source — it is
   * declared upstream but unused.
   */
  const performRedirect = useCallback((target?: string) => {
    setPhase(target ? { kind: "redirect", url: target } : { kind: "embed" });
  }, []);

  const handleReset = useCallback(() => {
    subOptionRef.current = null;
    setService(null);
    setAnswers({});
    setCertAnswers({});
    setScreenAnswers({});
    // The original left the step-2 label on whatever the last flow set; resetting
    // it is the one behavioural fix in this port.
    setStep2Label("Service Options");
    setPhase({ kind: "services" });
  }, []);

  const handleServiceClick = useCallback((key: ServiceKey) => {
    const next = SUB_MENUS[key];
    setService(key);

    if (next.type === "certificates") {
      setCertAnswers({});
      setStep2Label("Certificate Screening");
      setPhase({ kind: "cert", step: 0 });
    } else if (next.type === "options") {
      setStep2Label("Service Options");
      setPhase({ kind: "options" });
    } else {
      setStep2Label("Appointment Timing");
      setPhase({ kind: "options" });
    }
  }, []);

  const handleSubOptionSelection = useCallback(
    (optionId: string) => {
      subOptionRef.current = optionId;

      if (service === "weight-management") {
        setStep2Label("Pre-Screening");
        setPhase({ kind: "quiz" });
      } else if (service === "metabolic-wellness") {
        const goal = HEALTH_OPT_GOAL_MAP[optionId];
        setScreenAnswers(goal ? { goal } : {});
        setStep2Label("Screening");
        setPhase({ kind: "healthOpt", step: 0 });
      } else {
        performRedirect();
      }
    },
    [performRedirect, service],
  );

  /** `hhpHandleContinue` — the shared "Book Now" / "Continue to Booking" button. */
  const handleContinue = useCallback(() => {
    if (service === "weight-management") {
      if (!answers.weight || !answers.height) {
        window.alert("Please enter your weight and height to continue.");
        return;
      }
    }
    performRedirect();
  }, [answers.height, answers.weight, performRedirect, service]);

  /* ---------------- deep link (?service=…) ---------------- */

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("service");
    if (param && isServiceKey(param)) {
      handleServiceClick(param);
    }
  }, [handleServiceClick]);

  /* ---------------- scroll the wizard back into view on every move ---------------- */

  const phaseKey = `${phase.kind}:${"step" in phase ? phase.step : ""}`;
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    // `hhpReset` was the one transition that did not scroll.
    if (phase.kind === "services") return;
    wrapperRef.current?.scrollIntoView({ behavior: "smooth" });
    // `phaseKey` collapses kind + step into the single dependency the original keyed on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseKey]);

  /* ---------------- certificate screening ---------------- */

  const setCertSingle = (id: string, value: string) =>
    setCertAnswers((prev) => ({ ...prev, [id]: value }));

  const setCertText = (id: string, value: string) =>
    setCertAnswers((prev) => ({ ...prev, [id]: value }));

  const setCertCheck = (id: string, checked: boolean) =>
    setCertAnswers((prev) => ({ ...prev, [id]: checked }));

  const toggleCertMulti = (question: MultiQuestion, value: string) =>
    setCertAnswers((prev) => {
      const current = asList(prev[question.id]);
      const isSelected = current.includes(value);
      const exclusive = question.exclusiveOption;
      let next: string[];

      if (exclusive && value === exclusive) {
        next = isSelected ? [] : [exclusive];
      } else {
        next = isSelected
          ? current.filter((v) => v !== value)
          : [...current, value];
        if (exclusive) next = next.filter((v) => v !== exclusive);
      }

      return { ...prev, [question.id]: next };
    });

  /** `hhpCertScreenNext` — validate, apply the two hard stops, then advance. */
  const certNext = (index: number) => {
    const step = CERT_STEPS[index];

    for (const question of step.questions) {
      if (!("required" in question) || !question.required) continue;
      if (
        "showIf" in question &&
        !passesShowIf(question.showIf, certAnswers)
      ) {
        continue;
      }

      const value = certAnswers[question.id];
      if (question.type === "single" && !asText(value)) {
        window.alert("Please answer all questions before continuing.");
        return;
      }
      if (question.type === "multi" && asList(value).length === 0) {
        window.alert("Please answer all questions before continuing.");
        return;
      }
      if (question.type === "check" && value !== true) {
        window.alert("Please tick all consent boxes to continue.");
        return;
      }
      if (
        (question.type === "date" || question.type === "textarea") &&
        !asText(value)
      ) {
        window.alert("Please complete all required fields before continuing.");
        return;
      }
    }

    if (step.title === "Eligibility" && certAnswers.inAustralia === "No") {
      setPhase({ kind: "certResult", level: "ineligible-location", step: index });
      return;
    }

    if (step.title === "Safety Screening") {
      const flagged = asList(certAnswers.safety).filter(
        (v) => v !== "None of the Above",
      );
      if (flagged.length > 0) {
        setPhase({ kind: "certResult", level: "safety-flag", step: index });
        return;
      }
    }

    if (index < CERT_STEPS.length - 1) {
      setPhase({ kind: "cert", step: index + 1 });
    } else if (certAnswers.daysRequested === "1 Day") {
      // Single-day certificates went to the certificate-only page, not the
      // consultation booking page.
      subOptionRef.current = "cert-today";
      performRedirect(CERT_REDIRECT_URL);
    } else {
      subOptionRef.current = "cert-multiple";
      performRedirect();
    }
  };

  const renderCertDetail = (question: SingleQuestion | MultiQuestion) => {
    const { detailIf, detailId, detailLabel } = question;
    if (!detailIf || !detailId) return null;

    const trigger = certAnswers[question.id];
    const visible = Array.isArray(trigger)
      ? trigger.includes(detailIf)
      : trigger === detailIf;
    if (!visible) return null;

    return (
      <div style={{ marginTop: 12 }}>
        <label
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--hhp-primary)",
          }}
        >
          {detailLabel}
        </label>
        <textarea
          className="hhp-survey-input"
          rows={2}
          value={asText(certAnswers[detailId])}
          onChange={(event) => setCertText(detailId, event.target.value)}
        />
      </div>
    );
  };

  const renderCertQuestion = (question: CertQuestion): ReactNode => {
    if (question.type === "warning") {
      return (
        <div
          key={question.id}
          className="hhp-bmi-neutral"
          style={{ marginBottom: 20 }}
        >
          <h3 style={{ marginBottom: 8 }}>{question.title}</h3>
          <p>{question.text}</p>
        </div>
      );
    }

    if (question.type === "info") {
      return (
        <div key={question.id} className="hhp-cert-disclaimer">
          <strong>Important Information</strong>
          <br />
          {question.text}
          {question.bullets ? (
            <ul style={{ margin: "10px 0 0 18px", padding: 0 }}>
              {question.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}
        </div>
      );
    }

    if (question.type === "check") {
      return (
        <label key={question.id} className="hhp-consent-row">
          <input
            type="checkbox"
            checked={certAnswers[question.id] === true}
            onChange={(event) =>
              setCertCheck(question.id, event.target.checked)
            }
          />
          <span>{question.text}</span>
        </label>
      );
    }

    if (!passesShowIf(question.showIf, certAnswers)) return null;

    return (
      <div key={question.id} className="hhp-cert-question">
        <label>{question.label}</label>

        {question.type === "single" ? (
          <>
            <div className="hhp-cert-options-row">
              {question.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={cn(
                    "hhp-cert-chip",
                    asText(certAnswers[question.id]) === option && "selected",
                  )}
                  data-value={option}
                  onClick={() => setCertSingle(question.id, option)}
                >
                  {option}
                </button>
              ))}
            </div>
            {question.note ? (
              <div
                className="hhp-cert-disclaimer"
                style={{ marginTop: 12, marginBottom: 0 }}
              >
                {question.note}
              </div>
            ) : null}
          </>
        ) : null}

        {question.type === "multi" ? (
          <div className="hhp-cert-options-row">
            {question.options.map((option) => (
              <button
                key={option}
                type="button"
                className={cn(
                  "hhp-cert-chip",
                  asList(certAnswers[question.id]).includes(option) &&
                    "selected",
                )}
                data-value={option}
                onClick={() => toggleCertMulti(question, option)}
              >
                {option}
              </button>
            ))}
          </div>
        ) : null}

        {question.type === "date" ? (
          <input
            type="date"
            className="hhp-survey-input"
            value={asText(certAnswers[question.id])}
            onChange={(event) => setCertText(question.id, event.target.value)}
          />
        ) : null}

        {question.type === "textarea" ? (
          <textarea
            className="hhp-survey-input"
            rows={3}
            maxLength={question.maxLength}
            value={asText(certAnswers[question.id])}
            onChange={(event) => setCertText(question.id, event.target.value)}
          />
        ) : null}

        {question.type === "single" || question.type === "multi"
          ? renderCertDetail(question)
          : null}
      </div>
    );
  };

  /* ---------------- health optimisation screening ---------------- */

  const setScreenSingle = (id: string, value: string) =>
    setScreenAnswers((prev) => ({ ...prev, [id]: value }));

  const setScreenText = (id: string, value: string) =>
    setScreenAnswers((prev) => ({ ...prev, [id]: value }));

  const setScreenCheck = (id: string, checked: boolean) =>
    setScreenAnswers((prev) => ({ ...prev, [id]: checked }));

  /** `hhpScreenNext` — validate, apply the eligibility stop, then advance or triage. */
  const healthOptNext = (index: number) => {
    const step = HEALTH_OPT_STEPS[index];

    for (const question of step.questions) {
      if (question.type === "single" && question.required) {
        if (!asText(screenAnswers[question.id])) {
          window.alert("Please answer all questions before continuing.");
          return;
        }
      }
      if (question.type === "check" && question.required) {
        if (screenAnswers[question.id] !== true) {
          window.alert("Please tick all consent boxes to continue.");
          return;
        }
      }
    }

    if (step.title === "Basic Eligibility") {
      if (screenAnswers.over18 === "No") {
        setPhase({ kind: "healthOptResult", level: "ineligible-age" });
        return;
      }
      if (screenAnswers.inAustralia === "No") {
        setPhase({ kind: "healthOptResult", level: "ineligible-location" });
        return;
      }
    }

    if (index < HEALTH_OPT_STEPS.length - 1) {
      setPhase({ kind: "healthOpt", step: index + 1 });
    } else {
      setPhase({ kind: "healthOptResult", level: triage(screenAnswers) });
    }
  };

  const renderHealthOptQuestion = (question: HealthOptQuestion): ReactNode => {
    if (question.type === "info") {
      return (
        <div key={question.id} className="hhp-cert-disclaimer">
          <strong>Important Information</strong>
          <br />
          {question.text}
        </div>
      );
    }

    if (question.type === "check") {
      return (
        <label key={question.id} className="hhp-consent-row">
          <input
            type="checkbox"
            checked={screenAnswers[question.id] === true}
            onChange={(event) =>
              setScreenCheck(question.id, event.target.checked)
            }
          />
          <span>{question.text}</span>
        </label>
      );
    }

    const { detailIf, detailId, detailLabel } = question;
    const detailVisible =
      Boolean(detailIf) && screenAnswers[question.id] === detailIf;

    return (
      <div key={question.id} className="hhp-cert-question">
        <label>{question.label}</label>
        <div className="hhp-cert-options-row">
          {question.options.map((option) => (
            <button
              key={option}
              type="button"
              className={cn(
                "hhp-cert-chip",
                asText(screenAnswers[question.id]) === option && "selected",
              )}
              onClick={() => setScreenSingle(question.id, option)}
            >
              {option}
            </button>
          ))}
        </div>
        {detailId && detailVisible ? (
          <div style={{ marginTop: 12 }}>
            <label
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--hhp-primary)",
              }}
            >
              {detailLabel}
            </label>
            <textarea
              className="hhp-survey-input"
              rows={2}
              value={asText(screenAnswers[detailId])}
              onChange={(event) => setScreenText(detailId, event.target.value)}
            />
          </div>
        ) : null}
      </div>
    );
  };

  /* ---------------- BMI pre-screening ---------------- */

  const bmiResult = useMemo(() => {
    // BMI is calculated for Weight Management ONLY.
    if (service !== "weight-management") return null;
    if (!answers.weight || !answers.height) return null;

    const weight = parseFloat(answers.weight);
    const height = parseFloat(answers.height) / 100;
    if (!weight || !height) return null;

    const bmi = (weight / (height * height)).toFixed(1);
    const healthyRange = parseFloat(bmi) < 25;

    return {
      bmi,
      className: healthyRange ? "hhp-bmi-neutral" : "hhp-bmi-eligible",
      message: healthyRange
        ? "Your BMI is within the healthy range. Weight management treatments may not be appropriate, however a practitioner can discuss your health goals and determine suitable options."
        : "Based on your BMI, you are eligible for a practitioner review to discuss suitable weight management options.",
    };
  }, [answers.height, answers.weight, service]);

  const selectQuizOption = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (questionId === "age" && value === "No") {
      window.alert("Must be 18+");
      handleReset();
    }
  };

  /* ---------------- step 2 view model ---------------- */

  interface Step2View {
    title: string;
    subtitle: string;
    content: ReactNode;
    /** The shared nav row; the screening flows render their own instead. */
    showMainNav: boolean;
    showContinue: boolean;
    continueLabel: string;
  }

  const buildTimingView = (timing: TimingSubMenu): Step2View => ({
    title: "When would you like to book?",
    subtitle: "Please choose the specific service you require.",
    showMainNav: true,
    showContinue: false,
    continueLabel: "Book Now",
    content: (
      <>
        {timing.price ? <PriceHeader price={timing.price} /> : null}
        {timing.introHeading ? (
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            {timing.introEyebrow ? (
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--hhp-text-light)",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  marginBottom: 6,
                }}
              >
                {timing.introEyebrow}
              </p>
            ) : null}
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "var(--hhp-primary)",
                marginBottom: 8,
              }}
            >
              {timing.introHeading}
            </h3>
            {timing.introText ? (
              <p
                style={{
                  fontSize: 14,
                  color: "var(--hhp-text)",
                  maxWidth: 640,
                  margin: "0 auto",
                  lineHeight: 1.6,
                }}
              >
                {timing.introText}
              </p>
            ) : null}
          </div>
        ) : null}
        {timing.caveat ? (
          <div className="hhp-cert-disclaimer">{timing.caveat}</div>
        ) : null}

        <button
          type="button"
          className="hhp-option-card"
          onClick={() => handleSubOptionSelection("asap")}
        >
          <div className="hhp-option-icon">⚡</div>
          <div className="hhp-option-content">
            <div className="hhp-option-header">
              <span className="hhp-option-title">Book ASAP</span>
            </div>
            <div className="hhp-option-detail-box">
              <div className="hhp-detail-row">
                <span className="hhp-detail-text">
                  Book the next available appointment.
                </span>
              </div>
            </div>
          </div>
        </button>

        <button
          type="button"
          className="hhp-option-card"
          onClick={() => handleSubOptionSelection("later")}
        >
          <div className="hhp-option-icon">📅</div>
          <div className="hhp-option-content">
            <div className="hhp-option-header">
              <span className="hhp-option-title">Book for Later</span>
            </div>
            <div className="hhp-option-detail-box">
              <div className="hhp-detail-row">
                <span className="hhp-detail-text">
                  Select a specific date and time in the future.
                </span>
              </div>
            </div>
          </div>
        </button>
      </>
    ),
  });

  const buildOptionsView = (options: OptionsSubMenu): Step2View => ({
    title: options.title,
    subtitle: "Please choose the specific service you require.",
    showMainNav: true,
    showContinue: false,
    continueLabel: "Book Now",
    content: (
      <>
        {options.price ? <PriceHeader price={options.price} /> : null}
        {options.categoryNote ? (
          <div className="hhp-cert-disclaimer">{options.categoryNote}</div>
        ) : null}
        {options.items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="hhp-option-card"
            onClick={() => handleSubOptionSelection(item.id)}
          >
            <div className="hhp-option-icon">›</div>
            <div className="hhp-option-content">
              <div className="hhp-option-header">
                <span className="hhp-option-title">{item.title}</span>
                {item.price ? (
                  <span className="hhp-option-price-tag">{item.price}</span>
                ) : null}
              </div>
              <div className="hhp-option-detail-box">
                <div className="hhp-detail-row">
                  <span className="hhp-detail-label">Patients Get:</span>
                  <span className="hhp-detail-text">{item.what}</span>
                </div>
                <div className="hhp-detail-row">
                  <span className="hhp-detail-label">Delivery Note:</span>
                  <span className="hhp-detail-text">{item.note}</span>
                </div>
                {item.caveat ? (
                  <div className="hhp-detail-row" style={{ marginTop: 8 }}>
                    <span
                      className="hhp-detail-text"
                      style={{ fontSize: 13, fontStyle: "italic" }}
                    >
                      {item.caveat}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </button>
        ))}
      </>
    ),
  });

  const buildCertView = (index: number): Step2View => {
    const step = CERT_STEPS[index];
    const isLast = index === CERT_STEPS.length - 1;

    return {
      title: step.title,
      subtitle: step.subtitle,
      showMainNav: false,
      showContinue: false,
      continueLabel: "Book Now",
      content: (
        <>
          <div className="hhp-screen-counter">
            Step {index + 1} of {CERT_STEPS.length}
          </div>
          {step.note ? (
            <div className="hhp-cert-disclaimer">{step.note}</div>
          ) : null}
          {step.questions.map((question) => renderCertQuestion(question))}
          <div className="hhp-quiz-navigation">
            {index === 0 ? (
              <button
                type="button"
                className="hhp-nav-button hhp-btn-back"
                onClick={handleReset}
              >
                ← Back to Services
              </button>
            ) : (
              <button
                type="button"
                className="hhp-nav-button hhp-btn-back"
                onClick={() => setPhase({ kind: "cert", step: index - 1 })}
              >
                ← Back
              </button>
            )}
            <button
              type="button"
              className="hhp-nav-button hhp-btn-next"
              onClick={() => certNext(index)}
            >
              {isLast ? "Submit" : "Next →"}
            </button>
          </div>
        </>
      ),
    };
  };

  const buildCertResultView = (
    level: CertResultLevel,
    step: number,
  ): Step2View => {
    const backToQuestion = (
      <div className="hhp-quiz-navigation">
        <button
          type="button"
          className="hhp-nav-button hhp-btn-back"
          onClick={() => setPhase({ kind: "cert", step })}
        >
          ← Back to Question
        </button>
      </div>
    );

    if (level === "safety-flag") {
      return {
        title: "Please seek urgent care",
        subtitle: "",
        showMainNav: false,
        showContinue: false,
        continueLabel: "Book Now",
        content: (
          <>
            <div className="hhp-bmi-ineligible">
              <h3 style={{ marginBottom: 8 }}>
                This service may not be suitable for your condition
              </h3>
              <p>
                Based on your responses, please seek urgent medical attention,
                attend your nearest Emergency Department, or call 000.
              </p>
            </div>
            {backToQuestion}
          </>
        ),
      };
    }

    return {
      title: "Eligibility",
      subtitle: "",
      showMainNav: false,
      showContinue: false,
      continueLabel: "Book Now",
      content: (
        <>
          <div className="hhp-bmi-ineligible">
            <h3 style={{ marginBottom: 8 }}>Unable to proceed</h3>
            <p>
              Medical certificates are only available to patients currently
              located in Australia at the time of consultation.
            </p>
          </div>
          {backToQuestion}
        </>
      ),
    };
  };

  const buildQuizView = (): Step2View => ({
    title: BMI_QUIZ.title,
    subtitle: "Please complete the questions below.",
    showMainNav: true,
    showContinue: true,
    continueLabel: "Continue to Booking",
    content: (
      <>
        {BMI_QUIZ.questions.map((question) => (
          <div key={question.id} style={{ marginBottom: 20 }}>
            <label style={{ fontWeight: 600 }}>{question.text}</label>

            {question.type === "single" ? (
              <div className="hhp-survey-options">
                {question.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={cn(
                      "hhp-survey-option",
                      answers[question.id] === option && "selected",
                    )}
                    onClick={() => selectQuizOption(question.id, option)}
                  >
                    <div className="hhp-survey-option-letter">-</div>
                    <span>{option}</span>
                  </button>
                ))}
              </div>
            ) : null}

            {question.type === "number" ? (
              <input
                type="number"
                className="hhp-survey-input"
                value={answers[question.id] ?? ""}
                onChange={(event) =>
                  setAnswers((prev) => ({
                    ...prev,
                    [question.id]: event.target.value,
                  }))
                }
              />
            ) : null}

            {question.type === "info" ? (
              <div>
                {bmiResult ? (
                  <div className={bmiResult.className}>
                    <h3 style={{ marginBottom: 6 }}>
                      Your BMI: {bmiResult.bmi}
                    </h3>
                    <p>{bmiResult.message}</p>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        ))}
      </>
    ),
  });

  const buildHealthOptView = (index: number): Step2View => {
    const step = HEALTH_OPT_STEPS[index];
    const isLast = index === HEALTH_OPT_STEPS.length - 1;

    return {
      title: step.title,
      subtitle: step.subtitle,
      showMainNav: false,
      showContinue: false,
      continueLabel: "Book Now",
      content: (
        <>
          <div className="hhp-screen-counter">
            Step {index + 1} of {HEALTH_OPT_STEPS.length}
          </div>
          {step.questions.map((question) => renderHealthOptQuestion(question))}
          <div className="hhp-quiz-navigation">
            {index === 0 ? (
              <button
                type="button"
                className="hhp-nav-button hhp-btn-back"
                onClick={handleReset}
              >
                ← Back to Services
              </button>
            ) : (
              <button
                type="button"
                className="hhp-nav-button hhp-btn-back"
                onClick={() => setPhase({ kind: "healthOpt", step: index - 1 })}
              >
                ← Back
              </button>
            )}
            <button
              type="button"
              className="hhp-nav-button hhp-btn-next"
              onClick={() => healthOptNext(index)}
            >
              {isLast ? "Submit" : "Next →"}
            </button>
          </div>
        </>
      ),
    };
  };

  const buildHealthOptResultView = (level: TriageLevel): Step2View => {
    const base = {
      subtitle: "",
      showMainNav: false,
      showContinue: false,
      continueLabel: "Book Now",
    } as const;

    if (level === "green") {
      return {
        ...base,
        title: "You're all set",
        content: (
          <>
            <div className="hhp-bmi-eligible">
              <h3 style={{ marginBottom: 8 }}>Great news</h3>
              <p>
                Based on your responses, you can go ahead and book your initial
                consultation. Your practitioner will confirm the right program
                for you during your appointment.
              </p>
            </div>
            <div className="hhp-quiz-navigation">
              <button
                type="button"
                className="hhp-nav-button hhp-btn-back"
                onClick={handleReset}
              >
                ← Start Over
              </button>
              <button
                type="button"
                className="hhp-nav-button hhp-btn-next"
                onClick={() => performRedirect()}
              >
                Book Initial Consultation
              </button>
            </div>
          </>
        ),
      };
    }

    if (level === "amber") {
      return {
        ...base,
        title: "Practitioner review",
        content: (
          <>
            <div className="hhp-bmi-neutral">
              <h3 style={{ marginBottom: 8 }}>A quick review first</h3>
              <p>
                You can go ahead and book a consultation. Based on your
                responses, one of our practitioners will review your information
                before any treatment is recommended, to make sure it is safe and
                suitable for you.
              </p>
            </div>
            <div className="hhp-quiz-navigation">
              <button
                type="button"
                className="hhp-nav-button hhp-btn-back"
                onClick={handleReset}
              >
                ← Start Over
              </button>
              <button
                type="button"
                className="hhp-nav-button hhp-btn-next"
                onClick={() => performRedirect()}
              >
                Book Consultation
              </button>
            </div>
          </>
        ),
      };
    }

    if (level === "red") {
      return {
        ...base,
        title: "Further review needed",
        content: (
          <>
            <div className="hhp-bmi-ineligible">
              <h3 style={{ marginBottom: 8 }}>
                We need to review your responses
              </h3>
              <p>
                Based on your responses, your situation requires further review
                before booking. A member of our team will contact you.
              </p>
            </div>
            <div className="hhp-quiz-navigation">
              <button
                type="button"
                className="hhp-nav-button hhp-btn-back"
                onClick={handleReset}
              >
                ← Start Over
              </button>
            </div>
          </>
        ),
      };
    }

    const message =
      level === "ineligible-age"
        ? "Our Health Optimisation programs are only available to patients aged 18 years and over."
        : "Our Health Optimisation programs are only available to patients currently located in Australia.";

    return {
      ...base,
      title: "Eligibility",
      content: (
        <>
          <div className="hhp-bmi-ineligible">
            <h3 style={{ marginBottom: 8 }}>Unable to proceed</h3>
            <p>{message}</p>
          </div>
          <div className="hhp-quiz-navigation">
            <button
              type="button"
              className="hhp-nav-button hhp-btn-back"
              onClick={handleReset}
            >
              ← Back to Services
            </button>
          </div>
        </>
      ),
    };
  };

  let step2: Step2View | null = null;
  if (phase.kind === "options" && config) {
    if (config.type === "timing") step2 = buildTimingView(config);
    else if (config.type === "options") step2 = buildOptionsView(config);
  } else if (phase.kind === "cert") {
    step2 = buildCertView(phase.step);
  } else if (phase.kind === "certResult") {
    step2 = buildCertResultView(phase.level, phase.step);
  } else if (phase.kind === "quiz") {
    step2 = buildQuizView();
  } else if (phase.kind === "healthOpt") {
    step2 = buildHealthOptView(phase.step);
  } else if (phase.kind === "healthOptResult") {
    step2 = buildHealthOptResultView(phase.level);
  }

  /* ---------------- progress bar ---------------- */

  const currentStep =
    phase.kind === "services"
      ? 1
      : phase.kind === "redirect" || phase.kind === "embed"
        ? 3
        : 2;
  const stepLabels = ["Select Service", step2Label, "Book Appointment"];

  /* ---------------- render ---------------- */

  return (
    <div id="hhp-booking-wrapper" ref={wrapperRef}>
      <style>{STYLES}</style>

      <div className="hhp-container">
        <div className="hhp-emergency-note" role="note">
          <strong>Medical emergency? Call 000 immediately.</strong> If you are in
          crisis, call Lifeline 13 11 14 (24/7) or Beyond Blue 1300 22 4636.
        </div>

        <div className="hhp-progress-bar">
          <div className="hhp-steps">
            {stepLabels.map((label, index) => {
              const number = index + 1;
              return (
                <div
                  key={number}
                  className={cn(
                    "hhp-step",
                    number < currentStep && "completed",
                    number === currentStep && "active",
                  )}
                  aria-current={number === currentStep ? "step" : undefined}
                >
                  <div className="hhp-step-circle">{number}</div>
                  <div className="hhp-step-label">{label}</div>
                  {number < stepLabels.length ? (
                    <div className="hhp-step-line" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {phase.kind === "services" ? (
          <div className="hhp-service-selection">
            <div className="hhp-section-header">
              <h1 className="hhp-section-title">Choose Your Service</h1>
              <p className="hhp-section-subtitle">
                Select a category below to view detailed options and pricing.
              </p>
            </div>

            <div className="hhp-services-grid">
              {SERVICE_CARDS.map((card) => (
                <button
                  key={card.key}
                  type="button"
                  className={cn(
                    "hhp-service-card",
                    service === card.key && "selected",
                  )}
                  data-service={card.key}
                  onClick={() => handleServiceClick(card.key)}
                >
                  <div>
                    <div className="hhp-service-icon">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={card.icon} alt={card.alt} />
                    </div>
                    <div className="hhp-service-name">{card.title}</div>
                    <div className="hhp-service-desc">
                      {card.desc}
                      {card.descStrong ? (
                        <>
                          <br />
                          <strong>{card.descStrong}</strong>
                        </>
                      ) : null}
                      {card.includes ? (
                        <div className="hhp-service-includes">
                          {card.includes}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="hhp-service-price">{card.price}</div>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step2 ? (
          <div className="hhp-option-section" style={{ display: "block" }}>
            <div className="hhp-section-header">
              <h2 className="hhp-section-title">{step2.title}</h2>
              <p className="hhp-section-subtitle">{step2.subtitle}</p>
            </div>

            <div>{step2.content}</div>

            <div
              className="hhp-quiz-navigation"
              style={{ display: step2.showMainNav ? "flex" : "none" }}
            >
              <button
                type="button"
                className="hhp-nav-button hhp-btn-back"
                data-action="back-to-services"
                onClick={handleReset}
              >
                ← Back to Services
              </button>
              <button
                type="button"
                className="hhp-nav-button hhp-btn-next"
                style={{ display: step2.showContinue ? "block" : "none" }}
                onClick={handleContinue}
              >
                {step2.continueLabel}
              </button>
            </div>
          </div>
        ) : null}

        {phase.kind === "redirect" ? (
          <div className="hhp-redirect-message" style={{ display: "block" }}>
            <div className="hhp-spinner" />
            <h2
              style={{
                fontSize: 24,
                color: "var(--hhp-primary)",
                marginBottom: 10,
              }}
            >
              Redirecting you to booking...
            </h2>
            <p style={{ color: "var(--hhp-text-light)" }}>
              Please wait while we transfer you to our secure booking page.
            </p>
          </div>
        ) : null}

        {/*
          `hhpPerformRedirect()` with no url. The original built this block once
          and cached it behind `dataset.loaded`; React's reconciler already keeps
          the iframe mounted across re-renders, so the guard is unnecessary here.
          Inline styles are the source's own — it wrote them as a template string.
        */}
        {phase.kind === "embed" ? (
          <div className="hhp-booking-embed" id="hhp-bookingEmbed">
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: "var(--hhp-primary)",
                  marginBottom: 6,
                }}
              >
                {HALAXY_BOOKING_EMBED.heading}
              </h2>
              <p
                style={{ fontSize: 14, color: "var(--hhp-text-light)" }}
              >
                {HALAXY_BOOKING_EMBED.subheading}
              </p>
            </div>
            <iframe
              src={HALAXY_BOOKING_EMBED.src}
              allow="payment"
              title={HALAXY_BOOKING_EMBED.title}
              loading="lazy"
              style={{
                border: 0,
                width: "100%",
                height: 1100,
                maxHeight: "90vh",
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
