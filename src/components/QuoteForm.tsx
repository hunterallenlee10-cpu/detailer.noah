"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { quoteEndpoint, site } from "@/site.config";
import { services } from "@/data/services";
import { quoteStore, useQuoteServices } from "@/lib/quote-store";
import { useToast } from "./Toast";
import { ArrowRight, CameraIcon, Check, InstagramIcon } from "./icons";

// Rebuild of Noah's "Detailing Quote Form" (Google Form). Same fields, nicer flow.
const STEPS = ["Vehicle", "Services", "Location", "Photos", "Contact"] as const;
const NOT_SURE = "Not sure — recommend something";
const MAX_PHOTOS = 10;
const MAX_MB = 15;

type Errors = Partial<Record<"vehicle" | "services" | "address" | "utilities" | "firstName" | "lastName" | "phone" | "photos", string>>;

const digits = (s: string) => s.replace(/\D/g, "");

export function formatPhone(raw: string) {
  let d = digits(raw);
  if (d.length > 10 && d.startsWith("1")) d = d.slice(1);
  d = d.slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

const inputCls =
  "block w-full rounded-xl border border-line bg-ink px-4 text-base text-foam placeholder:text-muted/70 transition-colors focus:border-blue-glow focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-blue/40 aria-[invalid=true]:border-red-400";

function Field({
  label,
  hint,
  error,
  children,
  id,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  id: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-bold text-foam">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="-mt-1 mb-2 text-sm text-muted">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm font-semibold text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

export function QuoteForm({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const uid = useId();
  const toast = useToast();
  const selected = useQuoteServices();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [vehicle, setVehicle] = useState("");
  const [address, setAddress] = useState("");
  const [utilities, setUtilities] = useState<"" | "Yes" | "No">("");
  const [dropOff, setDropOff] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "demo" | "error">("idle");
  const [dragOver, setDragOver] = useState(false);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const pendingFocus = useRef(false);

  // Pre-select a service from /book?service=slug
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("service");
    const svc = services.find((s) => s.slug === slug);
    if (svc) quoteStore.add(svc.name);
  }, []);

  // Success / demo screen: move focus to its heading.
  useEffect(() => {
    if (status === "sent" || status === "demo") stepHeading.current?.focus({ preventScroll: true });
  }, [status]);

  const previews = useMemo(() => photos.map((f) => ({ file: f, url: URL.createObjectURL(f) })), [photos]);
  useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p.url)), [previews]);

  const validate = (s: number): Errors => {
    const e: Errors = {};
    if (s === 0 && vehicle.trim().length < 3) e.vehicle = "Tell me the year, make and model (e.g. 2019 Ford F-150).";
    if (s === 1 && selected.length === 0) e.services = "Pick at least one service — or choose “Not sure”.";
    if (s === 2) {
      if (!dropOff && address.trim().length < 5) e.address = "Where should I come? A street address or nearest cross streets works.";
      if (!dropOff && !utilities) e.utilities = "Let me know if there's a hose spigot and outlet.";
    }
    if (s === 4) {
      if (!firstName.trim()) e.firstName = "What's your first name?";
      if (!lastName.trim()) e.lastName = "And your last name?";
      if (digits(phone).length !== 10) e.phone = "Enter a 10-digit phone number so I can text or call you back.";
    }
    return e;
  };

  const go = (to: number) => {
    setDir(to > step ? 1 : -1);
    setErrors({});
    setStep(to);
    pendingFocus.current = true;
    // Keep the top of the form in view on small screens.
    const top = formRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) window.scrollBy({ top: top - 96, behavior: "smooth" });
  };

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list).filter((f) => f.type.startsWith("image/"));
    const tooBig = incoming.filter((f) => f.size > MAX_MB * 1024 * 1024);
    const ok = incoming.filter((f) => f.size <= MAX_MB * 1024 * 1024);
    const room = MAX_PHOTOS - photos.length;
    const next = [...photos, ...ok.slice(0, Math.max(0, room))];
    setPhotos(next);
    const msgs: string[] = [];
    if (ok.length > room) msgs.push(`Up to ${MAX_PHOTOS} photos — I kept the first ${MAX_PHOTOS}.`);
    if (tooBig.length) msgs.push(`${tooBig.length} photo(s) over ${MAX_MB} MB were skipped.`);
    if (list.length > incoming.length) msgs.push("Only image files can be added.");
    setErrors((e) => ({ ...e, photos: msgs.join(" ") || undefined }));
  };

  const summary = () =>
    [
      `Name: ${firstName} ${lastName}`.trim(),
      `Phone: ${phone}`,
      `Vehicle: ${vehicle}`,
      `Services: ${selected.join(", ")}`,
      `Address: ${dropOff ? "I'd rather drop it off" : address}`,
      !dropOff && `Hose spigot & outlet: ${utilities}`,
      notes && `Notes: ${notes}`,
      photos.length ? `Photos: ${photos.length} (I'll send them over)` : "",
    ]
      .filter(Boolean)
      .join("\n");

  const submit = async () => {
    if (!quoteEndpoint) {
      setStatus("demo");
      return;
    }
    setStatus("sending");
    try {
      const fd = new FormData();
      fd.append("firstName", firstName);
      fd.append("lastName", lastName);
      fd.append("phone", phone);
      fd.append("vehicle", vehicle);
      fd.append("services", selected.join(", "));
      fd.append("address", address);
      fd.append("dropOff", dropOff ? "Yes" : "No");
      fd.append("hoseSpigotAndOutlet", dropOff ? "N/A (drop-off)" : utilities);
      fd.append("notes", notes);
      fd.append("_subject", `Quote request — ${vehicle}`);
      photos.forEach((p) => fd.append("photos", p, p.name));
      const res = await fetch(quoteEndpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(step);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    if (step < STEPS.length - 1) go(step + 1);
    else submit();
  };

  const H = headingLevel;
  const errProps = (k: keyof Errors, hint = false) => ({
    id: `${uid}-${k}`,
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": [hint && `${uid}-${k}-hint`, errors[k] && `${uid}-${k}-error`].filter(Boolean).join(" ") || undefined,
  });

  if (status === "sent" || status === "demo") {
    return (
      <div className="rounded-3xl border border-line bg-panel p-7 sm:p-10" aria-live="polite">
        <m.svg viewBox="0 0 64 64" className="h-20 w-20" initial="hidden" animate="show" aria-hidden="true">
          <m.circle cx="32" cy="32" r="29" fill="none" stroke="#2E6BFF" strokeWidth="3" variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 0.6 } } }} />
          <m.path
            d="M20 33l8 8 16-17"
            fill="none"
            stroke="#5AA2FF"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { delay: 0.45, duration: 0.45 } } }}
          />
        </m.svg>
        <H ref={stepHeading} tabIndex={-1} id="quote-heading" className="display mt-6 text-5xl text-foam outline-none sm:text-6xl">
          {status === "sent" ? `Got it${firstName ? `, ${firstName}` : ""}!` : "One last step."}
        </H>
        {status === "sent" ? (
          <p className="mt-4 text-lg text-muted">You will be contacted shortly!</p>
        ) : (
          <>
            {/* Spec/demo mode: no endpoint yet, so never pretend the request was sent. */}
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted">
              Your request is ready. Send it through my quote form or DM me on Instagram — and you will be contacted shortly!
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={site.googleForm} target="_blank" rel="noopener noreferrer" className="btn btn-primary gloss">
                Send via my Google Form <ArrowRight />
                <span className="sr-only">(opens in new tab)</span>
              </a>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                <InstagramIcon /> Or DM me on Instagram
                <span className="sr-only">(opens in new tab)</span>
              </a>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(summary());
                    toast("Details copied — paste them in");
                  } catch {
                    toast("Couldn't copy — please retype in the form");
                  }
                }}
              >
                Copy my answers
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  const progress = (step + 1) / STEPS.length;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="rounded-3xl border border-line bg-panel p-6 sm:p-10" aria-labelledby={`${uid}-title`}>
      <div className="flex items-center justify-between gap-4 text-sm">
        <p id={`${uid}-title`} className="font-bold text-foam">
          Step {step + 1} of {STEPS.length} <span className="text-muted">· {STEPS[step]}</span>
        </p>
        {step > 0 && (
          <button type="button" onClick={() => go(step - 1)} className="min-h-11 rounded-full px-3 font-semibold text-muted hover:text-foam">
            ← Back
          </button>
        )}
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-label="Quote form progress" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1}>
        <div className="h-full origin-left rounded-full bg-gradient-to-r from-blue to-blue-glow transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ transform: `scaleX(${progress})` }} />
      </div>
      <ol className="mt-4 hidden gap-2 sm:flex" aria-hidden="true">
        {STEPS.map((s, i) => (
          <li key={s} className={`flex-1 text-xs font-bold uppercase tracking-widest ${i <= step ? "text-blue-glow" : "text-muted/60"}`}>
            {s}
          </li>
        ))}
      </ol>

      <div className="relative mt-8 sm:min-h-[300px]">
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <m.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -24 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={(def) => {
              // Focus the new step's heading once it has finished entering (AnimatePresence "wait").
              if (pendingFocus.current && (def as { opacity?: number }).opacity === 1) {
                pendingFocus.current = false;
                stepHeading.current?.focus({ preventScroll: true });
              }
            }}
          >
            {step === 0 && (
              <div className="space-y-6">
                <H ref={stepHeading} tabIndex={-1} id="quote-heading" className="display text-4xl text-foam outline-none sm:text-5xl">
                  What are we detailing?
                </H>
                <Field label="Year / Make / Model" id={`${uid}-vehicle`} error={errors.vehicle} hint="Car, truck, boat, tractor — all welcome.">
                  <input
                    {...errProps("vehicle", true)}
                    className={`${inputCls} h-14`}
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    placeholder="e.g. 2019 Ford F-150"
                    autoComplete="off"
                  />
                </Field>
              </div>
            )}

            {step === 1 && (
              <fieldset aria-describedby={errors.services ? `${uid}-services-error` : undefined}>
                <legend className="contents">
                  <H ref={stepHeading} tabIndex={-1} id="quote-heading" className="display text-4xl text-foam outline-none sm:text-5xl">
                    What are you interested in?
                  </H>
                </legend>
                <p className="mt-2 text-sm text-muted">Pick as many as you like.</p>
                <div className="mt-6 flex flex-wrap gap-2.5" id={`${uid}-services`} tabIndex={-1}>
                  {[...services.map((s) => s.name), NOT_SURE].map((name) => {
                    const on = selected.includes(name);
                    return (
                      <label
                        key={name}
                        className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-glow ${
                          on ? "border-blue bg-blue text-white" : "border-line bg-ink text-foam hover:border-muted"
                        }`}
                      >
                        <input type="checkbox" className="sr-only" checked={on} onChange={() => quoteStore.toggle(name)} />
                        <span className={`flex h-4 w-4 items-center justify-center rounded-full ${on ? "bg-white text-blue" : "border border-muted"}`} aria-hidden="true">
                          {on && <Check className="h-3 w-3" />}
                        </span>
                        {name}
                      </label>
                    );
                  })}
                </div>
                {errors.services && (
                  <p id={`${uid}-services-error`} className="mt-3 text-sm font-semibold text-red-300">
                    {errors.services}
                  </p>
                )}
              </fieldset>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <H ref={stepHeading} tabIndex={-1} id="quote-heading" className="display text-4xl text-foam outline-none sm:text-5xl">
                  Where should I come?
                </H>
                <Field label="Address" id={`${uid}-address`} error={errors.address} hint="I come to you, but your vehicle can be dropped off at my house if you prefer.">
                  <input
                    {...errProps("address", true)}
                    className={`${inputCls} h-14 disabled:opacity-50`}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, city"
                    autoComplete="street-address"
                  />
                </Field>

                <fieldset aria-describedby={errors.utilities ? `${uid}-utilities-error` : undefined}>
                  <legend className="mb-2 text-sm font-bold text-foam">Access to a hose spigot &amp; outlet?</legend>
                  <div className="inline-grid grid-cols-2 gap-1 rounded-full border border-line bg-ink p-1" id={`${uid}-utilities`} tabIndex={-1}>
                    {(["Yes", "No"] as const).map((v) => (
                      <label
                        key={v}
                        className={`flex min-h-11 min-w-24 cursor-pointer items-center justify-center rounded-full px-5 text-sm font-bold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue-glow ${
                          utilities === v ? "bg-blue text-white" : "text-muted hover:text-foam"
                        }`}
                      >
                        <input type="radio" name={`${uid}-util`} value={v} className="sr-only" checked={utilities === v} onChange={() => setUtilities(v)} />
                        {v}
                      </label>
                    ))}
                  </div>
                  {errors.utilities && (
                    <p id={`${uid}-utilities-error`} className="mt-2 text-sm font-semibold text-red-300">
                      {errors.utilities}
                    </p>
                  )}
                </fieldset>

                <label className="flex min-h-11 cursor-pointer items-center gap-3 text-foam">
                  <input type="checkbox" checked={dropOff} onChange={(e) => setDropOff(e.target.checked)} className="h-5 w-5 accent-[#2E6BFF]" />
                  I&apos;d rather drop it off
                </label>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <H ref={stepHeading} tabIndex={-1} id="quote-heading" className="display text-4xl text-foam outline-none sm:text-5xl">
                  Show me the condition.
                </H>
                <p className="text-sm text-muted">Optional, but photos help me quote accurately. Up to {MAX_PHOTOS} images.</p>
                <label
                  htmlFor={`${uid}-photos`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    addFiles(e.dataTransfer.files);
                  }}
                  className={`flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center transition-colors has-[:focus-visible]:border-blue-glow ${
                    dragOver ? "border-blue-glow bg-blue/10" : "border-line bg-ink hover:border-muted"
                  }`}
                >
                  <CameraIcon className="h-8 w-8 text-blue-glow" />
                  <span className="font-bold text-foam">
                    <span className="hidden sm:inline">Drag photos here or </span>
                    <span className="text-blue-glow underline underline-offset-4">choose photos</span>
                  </span>
                  <span className="text-xs text-muted">
                    {photos.length}/{MAX_PHOTOS} added · JPG, PNG, HEIC
                  </span>
                  <input
                    id={`${uid}-photos`}
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    aria-describedby={errors.photos ? `${uid}-photos-error` : undefined}
                    onChange={(e) => {
                      addFiles(e.target.files);
                      e.target.value = "";
                    }}
                    disabled={photos.length >= MAX_PHOTOS}
                  />
                </label>
                {errors.photos && (
                  <p id={`${uid}-photos-error`} className="text-sm font-semibold text-amber-300" role="status">
                    {errors.photos}
                  </p>
                )}
                {previews.length > 0 && (
                  <ul className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                    {previews.map((p, i) => (
                      <li key={p.url} className="relative aspect-square overflow-hidden rounded-lg bg-ink">
                        {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview, not optimizable */}
                        <img src={p.url} alt={`Upload ${i + 1}: ${p.file.name}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setPhotos((ps) => ps.filter((_, j) => j !== i))}
                          className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-ink/85 text-sm font-bold text-foam hover:bg-red-500 after:absolute after:-inset-2"
                          aria-label={`Remove photo ${i + 1}`}
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <H ref={stepHeading} tabIndex={-1} id="quote-heading" className="display text-4xl text-foam outline-none sm:text-5xl">
                  How do I reach you?
                </H>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="First name" id={`${uid}-firstName`} error={errors.firstName}>
                    <input {...errProps("firstName")} className={`${inputCls} h-14`} value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" />
                  </Field>
                  <Field label="Last name" id={`${uid}-lastName`} error={errors.lastName}>
                    <input {...errProps("lastName")} className={`${inputCls} h-14`} value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" />
                  </Field>
                </div>
                <Field label="Phone number" id={`${uid}-phone`} error={errors.phone}>
                  <input
                    {...errProps("phone")}
                    className={`${inputCls} h-14`}
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    inputMode="tel"
                    type="tel"
                    autoComplete="tel-national"
                    placeholder="(540) 000-0000"
                  />
                </Field>
                <Field label="Additional questions / concerns" id={`${uid}-notes`}>
                  <textarea id={`${uid}-notes`} className={`${inputCls} min-h-28 py-3`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Stains, pet hair, timing — anything I should know." />
                </Field>
              </div>
            )}
          </m.div>
        </AnimatePresence>
      </div>

      {status === "error" && (
        <p className="mt-6 rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200" role="alert">
          Something went wrong sending your request.{" "}
          <a href={site.googleForm} target="_blank" rel="noopener noreferrer" className="font-bold underline">
            Use my Google Form instead
          </a>{" "}
          or{" "}
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="font-bold underline">
            DM me on Instagram
          </a>
          .
        </p>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">
          {step === 3 ? "No photos handy? Skip ahead — you can send them later." : "Takes about two minutes."}
        </p>
        <button type="submit" className="btn btn-primary gloss min-h-14 px-8 text-base" disabled={status === "sending"}>
          {step < STEPS.length - 1 ? (
            <>
              {step === 3 && photos.length === 0 ? "Skip for now" : "Continue"} <ArrowRight />
            </>
          ) : status === "sending" ? (
            "Sending…"
          ) : (
            <>
              Send my quote request <ArrowRight />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
