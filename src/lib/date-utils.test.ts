import { vi, expect, test, describe, beforeEach, afterEach } from "vitest";
import { calculateChunksOfTime, periods } from "./date-utils";

describe("date-utils", () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers();
  });

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers();
  });
  test("6 rounds", () => {
    const date = new Date("2024-08-09T12:00:00.000+00:00");
    vi.setSystemTime(date);

    const rounds = calculateChunksOfTime(
      60,
      new Date("2024-08-09T18:03:25.063+00:00"),
    );
    // new Date("2024-08-09T18:03:25.063+00:00"),
    // "America/New_York",
    // 'America/Los_Angeles',
    expect(rounds).toBe(6);
  });
  test("5 rounds", () => {
    const date = new Date("2024-08-09T12:00:00.000+00:00");
    vi.setSystemTime(date);

    const rounds = calculateChunksOfTime(
      25,
      new Date("2024-08-09T14:25:25.063+00:00"),
    );
    // new Date("2024-08-09T18:03:25.063+00:00"),
    // "America/New_York",
    // 'America/Los_Angeles',
    expect(rounds).toBe(5);
  });

  test("3 periods", () => {
    const date = new Date("2024-08-09T12:00:00.000+00:00");
    vi.setSystemTime(date);

    const arr = periods(30, 3);
    expect(arr).toStrictEqual([
      {
        start: new Date("2024-08-09T12:00:00.000+00:00"),
        end: new Date("2024-08-09T12:30:00.000+00:00"),
      },
      {
        start: new Date("2024-08-09T12:30:00.000+00:00"),
        end: new Date("2024-08-09T13:00:00.000+00:00"),
      },
      {
        start: new Date("2024-08-09T13:00:00.000+00:00"),
        end: new Date("2024-08-09T13:30:00.000+00:00"),
      },
    ]);
  });

  test("sanity check true", () => {
    const stops = [{ source_id: 1 }, { source_id: 2 }];
    const case1 = stops.every((stop) => {
      return stop.source_id;
    });
    expect(case1).toBe(true);
  });
  test("sanity check false", () => {
    const stops = [
      { source_id: 1, destination_id: 2 },
      { destination_id: 2 },
      { source_id: "" },
      { source_id: null },
    ];
    const case2 = stops.every((stop) => {
      return stop.source_id;
    });
    expect(case2).toBe(false);
  });
});
