import { readFileSync } from "node:fs";
import path from "node:path";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { ComparisonWorkspace } from "@/components/comparison/comparison-workspace";
import { ComparisonSchema } from "@/contracts/comparison";

const replace = vi.fn();
let searchParamsValue = "view=split&types=added,removed,modified";
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(searchParamsValue),
  useRouter: () => ({ replace }),
  usePathname: () => "/compare/crwd/2024-2025",
}));

const fixture = ComparisonSchema.parse(
  JSON.parse(
    readFileSync(
      path.resolve("data/generated/v1/comparisons/crwd-2024-2025.json"),
      "utf8",
    ),
  ),
);

function renderWorkspace() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <ComparisonWorkspace
        comparisonId={fixture.id}
        issuerLabel="CrowdStrike"
        pairLabel="2024 and 2025"
      />
    </QueryClientProvider>,
  );
}

describe("P-01/P-05/P-11/QA-04 comparison workspace", () => {
  beforeEach(() => {
    localStorage.clear();
    replace.mockClear();
    searchParamsValue = "view=split&types=added,removed,modified";
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify(fixture), { status: 200 }),
        ),
    );
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  test("renders non-color change semantics, exact ledger, and partial-data disclosure", async () => {
    renderWorkspace();
    expect(screen.getByText(/Preparing the 2024 and 2025/)).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", {
        name: /what changed in Risk Factors/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("+ Added text")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Only manually verified source passages are shown",
    );
    expect(screen.getByText("∑ Total")).toBeInTheDocument();
  });

  test("saves a plain-text note locally and enables export", async () => {
    const user = userEvent.setup();
    renderWorkspace();
    await screen.findByRole("heading", { name: /what changed/i });
    const note = screen.getByLabelText(/Note for change/);
    await user.type(
      note,
      "Check this wording against the service-disruption discussion",
    );
    await user.click(screen.getByRole("button", { name: "Save note" }));
    expect(screen.getByText("Saved in this browser.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Download notes/ }),
    ).toBeEnabled();
    expect(Object.values(localStorage).join("")).not.toContain("<script>");
  });

  test("has no serious or critical automated accessibility violations", async () => {
    const { container } = renderWorkspace();
    await screen.findByRole("heading", { name: /what changed/i });
    const result = await axe(container);
    expect(
      result.violations.filter((violation) =>
        ["serious", "critical"].includes(violation.impact ?? ""),
      ),
    ).toEqual([]);
  });

  test("shows a retryable error without fabricating a diff", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("unavailable", { status: 503 })),
    );
    renderWorkspace();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "could not be loaded",
    );
    await waitFor(() =>
      expect(screen.queryAllByText("+ Added text")).toHaveLength(0),
    );
  });

  test("distinguishes a no-meaningful-change result from a filter-empty result", async () => {
    const noChanges = ComparisonSchema.parse({
      ...fixture,
      id: `${fixture.id}:no-changes`,
      status: "complete",
      changes: [],
      counts: { total: 0, added: 0, removed: 0, modified: 0 },
      exclusions: [],
    });
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: Infinity } },
    });
    render(
      <QueryClientProvider client={client}>
        <ComparisonWorkspace
          comparisonId={noChanges.id}
          initialComparison={noChanges}
          issuerLabel="CrowdStrike"
          pairLabel="2024 and 2025"
        />
      </QueryClientProvider>,
    );
    expect(
      screen.getByRole("heading", {
        name: "No meaningful textual changes were detected",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/does not mean.*risk is unchanged/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "No changes match these filters" }),
    ).not.toBeInTheDocument();
  });

  test("UX-02 shows a distinct filter-empty state without changing filing counts", () => {
    searchParamsValue = "view=split&types=added";
    const modifiedOnly = ComparisonSchema.parse({
      ...fixture,
      id: `${fixture.id}:modified-only`,
      changes: fixture.changes.filter((change) => change.kind === "modified"),
      counts: { total: 1, added: 0, removed: 0, modified: 1 },
    });
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: Infinity } },
    });
    render(
      <QueryClientProvider client={client}>
        <ComparisonWorkspace
          comparisonId={modifiedOnly.id}
          initialComparison={modifiedOnly}
          issuerLabel="CrowdStrike"
          pairLabel="2024 and 2025"
        />
      </QueryClientProvider>,
    );
    expect(
      screen.getByRole("heading", { name: "No changes match these filters" }),
    ).toBeInTheDocument();
    expect(screen.getByText("∑ Total").parentElement).toHaveTextContent("1");
    expect(
      screen.queryByRole("heading", {
        name: "No meaningful textual changes were detected",
      }),
    ).not.toBeInTheDocument();
  });

  test("NOTE-02 preserves the in-session draft when local storage fails", async () => {
    const user = userEvent.setup();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage disabled", "QuotaExceededError");
    });
    renderWorkspace();
    await screen.findByRole("heading", { name: /what changed/i });
    const note = screen.getByLabelText(/Note for change/);
    await user.type(note, "Keep this draft in memory");
    await user.click(screen.getByRole("button", { name: "Save note" }));
    expect(note).toHaveValue("Keep this draft in memory");
    expect(
      screen.getByText(/kept for this session.*could not persist/i),
    ).toBeInTheDocument();
  });
});
