import { useMemo, useState } from "react";
import { CONTEXTS, UNIT_KINDS, type ContextEntry, type OutputKind, type UnitKind } from "./contexts";

type Result = {
  entry: ContextEntry;
  value: number;
  suitable: boolean;
  score: number;
};

type FormattedResult = {
  quantity: string;
  unit?: string;
};

const DEFAULT_RANGES: Record<OutputKind, [number, number]> = {
  multiple: [0.01, 1000000],
  count: [0.1, 10000000000],
  length: [0.001, 1000000000],
  area: [0.0001, 1000000000000],
  volume: [0.001, 1000000000000],
  mass: [0.000001, 1000000000000],
  time: [0.000001, 1000000000000],
  energy: [1, 1000000000000000000],
  speed: [0.000001, 1000000000],
  data: [1, 1000000000000000000],
  frequency: [0.001, 1000000000],
};

const EXAMPLES: Record<UnitKind, string[]> = {
  count: ["1,000,000", "7.8 billion", "6.02e23"],
  length: ["8848.86", "384400000", "2"],
  area: ["7140", "1000000", "59100000"],
  volume: ["2500000", "330", "100000"],
  mass: ["6000", "1,000,000", "0.003"],
  time: ["86400", "31557600", "0.1"],
  energy: ["962000", "6.276e13", "75000"],
  speed: ["29", "299792458", "1.4"],
  data: ["1000000000", "20400000000", "4700000000"],
  frequency: ["50", "440", "0.2"],
};

const GROUP_ORDER = [
  "All",
  "Cosmic",
  "Nature",
  "Body",
  "Everyday",
  "Sport",
  "Food",
  "Buildings",
  "Culture",
  "Computation",
  "Places",
  "Explosive",
];

export function NumberContextApp() {
  const [unitKind, setUnitKind] = useState<UnitKind>("count");
  const [input, setInput] = useState("1000000");
  const [group, setGroup] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [spotlightId, setSpotlightId] = useState<string | null>(null);

  const parsed = parseHumanNumber(input);
  const activeKind = UNIT_KINDS.find((kind) => kind.id === unitKind) ?? UNIT_KINDS[0];

  const results = useMemo(() => {
    if (parsed === null) {
      return [];
    }

    return CONTEXTS.filter((entry) => entry.input === unitKind)
      .map((entry) => {
        const value = parsed * entry.factor;
        const [min, max] = entry.goodRange ?? DEFAULT_RANGES[entry.output];
        const magnitude = Math.abs(value);
        const suitable = magnitude >= min && magnitude <= max;
        const score = fitScore(value, entry.output);
        return { entry, value, suitable, score };
      })
      .sort((a, b) => {
        if (a.entry.id === spotlightId) return -1;
        if (b.entry.id === spotlightId) return 1;
        if (a.suitable !== b.suitable) return a.suitable ? -1 : 1;
        return a.score - b.score;
      });
  }, [parsed, spotlightId, unitKind]);

  const groups = useMemo(() => {
    const available = new Set(
      CONTEXTS.filter((entry) => entry.input === unitKind).map((entry) => entry.group),
    );
    return GROUP_ORDER.filter((item) => item === "All" || available.has(item));
  }, [unitKind]);

  const filtered = results.filter((result) => {
    const groupMatch = group === "All" || result.entry.group === group;
    const fitMatch = showAll || result.suitable;
    return groupMatch && fitMatch;
  });

  const suitableCount = results.filter((result) => result.suitable).length;

  function setKind(kind: UnitKind) {
    setUnitKind(kind);
    setInput(EXAMPLES[kind][0]);
    setGroup("All");
    setShowAll(false);
    setSpotlightId(null);
  }

  function surprise() {
    const pool = results.filter((result) => group === "All" || result.entry.group === group);
    if (pool.length === 0) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setShowAll(true);
    setSpotlightId(pick.entry.id);
  }

  return (
    <main className="site-shell">
      <header className="topline" aria-label="Site header">
        <a className="brandmark" href="#converter" aria-label="numbercontext.com home">
          <span className="brandmark__dot" />
          numbercontext.com
        </a>
      </header>

      <section className="converter-stage" id="converter">
        <div className="hero-copy">
          <p className="eyebrow">Scale translator</p>
          <h1>Numbers, with the world put back in.</h1>
        </div>

        <div className="input-console">
          <label className="input-label" htmlFor="number-input">
            Number
          </label>
          <input
            id="number-input"
            className="number-input"
            inputMode="decimal"
            value={input}
            placeholder={activeKind.placeholder}
            onChange={(event) => {
              setInput(event.target.value);
              setSpotlightId(null);
            }}
          />

          <div className="unit-row" role="group" aria-label="Input unit type">
            {UNIT_KINDS.map((kind) => (
              <button
                className="unit-pill"
                data-active={unitKind === kind.id}
                key={kind.id}
                onClick={() => setKind(kind.id)}
                type="button"
              >
                <span>{kind.label}</span>
                <small>{kind.baseLabel}</small>
              </button>
            ))}
          </div>

          <div className="quick-row" aria-label="Example numbers">
            {EXAMPLES[unitKind].map((example) => (
              <button
                className="quick-chip"
                key={example}
                onClick={() => {
                  setInput(example);
                  setSpotlightId(null);
                }}
                type="button"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="results-band" aria-live="polite">
        <div className="results-head">
          <div>
            <p className="results-kicker">{parsed === null ? "Waiting" : `${suitableCount} best-fit contexts`}</p>
            <h2>{parsed === null ? "Use a number, scientific notation, or words like billion." : activeKind.label}</h2>
          </div>

          <div className="control-cluster">
            <label className="toggle">
              <input
                checked={showAll}
                onChange={(event) => setShowAll(event.target.checked)}
                type="checkbox"
              />
              <span>Show all</span>
            </label>
            <button className="surprise" onClick={surprise} type="button">
              Surprise me
            </button>
          </div>
        </div>

        <div className="group-strip" role="group" aria-label="Filter by group">
          {groups.map((item) => (
            <button
              className="group-chip"
              data-active={group === item}
              key={item}
              onClick={() => {
                setGroup(item);
                setSpotlightId(null);
              }}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>

        {parsed === null ? (
          <div className="empty-state">
            <div className="empty-state__signal" />
            <p>That number did not quite resolve.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__signal" />
            <p>No tidy matches in this group. Show all will get gloriously unreasonable.</p>
          </div>
        ) : (
          <div className="result-grid">
            {filtered.map((result) => (
              <ResultCard key={result.entry.id} result={result} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function ResultCard({ result }: { result: Result }) {
  const { entry, value, suitable } = result;
  const [notesOpen, setNotesOpen] = useState(false);
  const primary = formatResult(value, entry.input, entry.output, entry.unitSingular, entry.unitPlural);

  return (
    <article
      className="result-card"
      data-fit={suitable ? "good" : "all"}
      style={{ "--accent": entry.accent } as React.CSSProperties}
    >
      <div className={`glyph glyph--${entry.glyph}`} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="result-card__body">
        <div className="result-card__meta">
          <span>{entry.group}</span>
          <span>{suitable ? "good fit" : "outer scale"}</span>
        </div>

        <h3>{entry.name}</h3>
        <p className="result-value">
          <span className="result-number">{primary.quantity}</span>
          {primary.unit ? <span className="result-unit">{primary.unit}</span> : null}
        </p>

        <div className="source-note">
          <button
            aria-expanded={notesOpen}
            className="source-note__button"
            onClick={() => setNotesOpen((current) => !current)}
            type="button"
          >
            Number notes
          </button>
          {notesOpen ? (
            <div className="source-note__panel">
              <p className="source-note__context">
                <strong>Scale basis:</strong> {entry.resultPhrase}
              </p>
              <p>{entry.basis}</p>
              <ul>
                {entry.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} rel="noreferrer" target="_blank">
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function parseHumanNumber(value: string): number | null {
  const clean = value.trim().toLowerCase().replace(/,/g, "");
  if (!clean) return null;

  const match = clean.match(
    /^([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)\s*(k|thousand|m|million|b|billion|t|trillion)?$/,
  );
  if (!match) return null;

  const numeric = Number(match[1]);
  if (!Number.isFinite(numeric)) return null;

  const suffix = match[2];
  const multiplier =
    suffix === "k" || suffix === "thousand"
      ? 1000
      : suffix === "m" || suffix === "million"
        ? 1000000
        : suffix === "b" || suffix === "billion"
          ? 1000000000
          : suffix === "t" || suffix === "trillion"
            ? 1000000000000
            : 1;

  return numeric * multiplier;
}

function fitScore(value: number, output: OutputKind) {
  const magnitude = Math.max(Math.abs(value), Number.MIN_VALUE);
  const ideal =
    output === "time" ? 60 : output === "length" ? 10 : output === "area" ? 100 : output === "volume" ? 10 : 1;
  return Math.abs(Math.log10(magnitude) - Math.log10(ideal));
}

function formatResult(value: number, input: UnitKind, output: OutputKind, singular?: string, plural?: string) {
  if (input === "speed" && output === "multiple") {
    return {
      quantity: `${formatNumber(value)}x`,
      unit: singular || plural,
    };
  }

  if (output === "multiple" || output === "count") {
    return {
      quantity: formatNumber(value),
      unit: chooseUnit(value, singular, plural),
    };
  }

  return formatMeasurement(value, output);
}

function chooseUnit(value: number, singular = "", plural = "") {
  const abs = Math.abs(value);
  if (!singular && !plural) return "";
  return abs > 0.9995 && abs < 1.0005 ? singular : plural || singular;
}

function formatNumber(value: number) {
  const abs = Math.abs(value);
  if (value === 0) return "0";

  if (abs >= 100000000000 || abs < 0.001) {
    return value.toExponential(2).replace("+", "");
  }

  if (abs >= 1000000) {
    return new Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(value);
  }

  if (abs >= 1000) {
    return new Intl.NumberFormat("en", {
      maximumFractionDigits: 1,
    }).format(value);
  }

  if (abs >= 10) {
    return new Intl.NumberFormat("en", {
      maximumFractionDigits: 2,
    }).format(value);
  }

  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 3,
  }).format(value);
}

function formatMeasurement(value: number, output: OutputKind): FormattedResult {
  switch (output) {
    case "length":
      return formatLength(value);
    case "area":
      return formatArea(value);
    case "volume":
      return formatVolume(value);
    case "mass":
      return formatMass(value);
    case "time":
      return formatTime(value);
    case "energy":
      return formatEnergy(value);
    case "speed":
      return formatSpeed(value);
    case "data":
      return formatData(value);
    case "frequency":
      return { quantity: formatNumber(value), unit: "Hz" };
    default:
      return { quantity: formatNumber(value) };
  }
}

function formatLength(metres: number) {
  const abs = Math.abs(metres);
  if (abs < 0.01) return { quantity: formatNumber(metres * 1000), unit: "mm" };
  if (abs < 1) return { quantity: formatNumber(metres * 100), unit: "cm" };
  if (abs < 1000) return { quantity: formatNumber(metres), unit: "m" };
  if (abs < 1000000000) return { quantity: formatNumber(metres / 1000), unit: "km" };
  return { quantity: formatNumber(metres / 149597870700), unit: "AU" };
}

function formatArea(squareMetres: number) {
  const abs = Math.abs(squareMetres);
  if (abs < 1) return { quantity: formatNumber(squareMetres * 10000), unit: "cm2" };
  if (abs < 1000000) return { quantity: formatNumber(squareMetres), unit: "m2" };
  return { quantity: formatNumber(squareMetres / 1000000), unit: "km2" };
}

function formatVolume(litres: number) {
  const abs = Math.abs(litres);
  if (abs < 1) return { quantity: formatNumber(litres * 1000), unit: "ml" };
  if (abs < 1000) return { quantity: formatNumber(litres), unit: "L" };
  return { quantity: formatNumber(litres / 1000), unit: "m3" };
}

function formatMass(kg: number) {
  const abs = Math.abs(kg);
  if (abs < 0.001) return { quantity: formatNumber(kg * 1000000), unit: "mg" };
  if (abs < 1) return { quantity: formatNumber(kg * 1000), unit: "g" };
  if (abs < 1000) return { quantity: formatNumber(kg), unit: "kg" };
  return { quantity: formatNumber(kg / 1000), unit: "tonnes" };
}

function formatTime(seconds: number) {
  const abs = Math.abs(seconds);
  if (abs < 0.001) return { quantity: formatNumber(seconds * 1000000), unit: "microseconds" };
  if (abs < 1) return { quantity: formatNumber(seconds * 1000), unit: "ms" };
  if (abs < 60) return { quantity: formatNumber(seconds), unit: "seconds" };
  if (abs < 3600) return { quantity: formatNumber(seconds / 60), unit: "minutes" };
  if (abs < 86400) return { quantity: formatNumber(seconds / 3600), unit: "hours" };
  if (abs < 31557600) return { quantity: formatNumber(seconds / 86400), unit: "days" };
  return { quantity: formatNumber(seconds / 31557600), unit: "years" };
}

function formatEnergy(joules: number) {
  const abs = Math.abs(joules);
  if (abs < 1000) return { quantity: formatNumber(joules), unit: "J" };
  if (abs < 1000000) return { quantity: formatNumber(joules / 1000), unit: "kJ" };
  if (abs < 1000000000) return { quantity: formatNumber(joules / 1000000), unit: "MJ" };
  if (abs < 1000000000000) return { quantity: formatNumber(joules / 1000000000), unit: "GJ" };
  return { quantity: formatNumber(joules / 3600000000000), unit: "TWh" };
}

function formatSpeed(metresPerSecond: number) {
  const abs = Math.abs(metresPerSecond);
  if (abs < 1) return { quantity: formatNumber(metresPerSecond * 1000), unit: "mm/s" };
  return { quantity: formatNumber(metresPerSecond * 3.6), unit: "km/h" };
}

function formatData(bytes: number) {
  const abs = Math.abs(bytes);
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB"];
  let value = bytes;
  let index = 0;
  while (Math.abs(value) >= 1000 && index < units.length - 1) {
    value /= 1000;
    index += 1;
  }
  if (abs < 1) return { quantity: formatNumber(bytes), unit: "B" };
  return { quantity: formatNumber(value), unit: units[index] };
}
