/**
 * Highlight the next talk in the schedule table
 * Fetches the schedule API, finds the next or ongoing talk,
 * and applies visual highlighting to the corresponding table row.
 */
(function () {
  // Configuration constants
  const SCHEDULE_API_URL = "/api/schedule.json";
  const SCHEDULE_TABLE_ID = "scheduleTable";
  const TIMEOUT_MS = 3000;

  /**
   * Parse an ISO date string into a Date object
   * @param {string} value - ISO date string
   * @returns {Date|null} Parsed date or null if invalid
   */
  function parseDate(value) {
    if (!value) return null;

    // Normalize timezone offsets like +0900 / -0530 to +09:00 / -05:30.
    // This ensures compatibility with browsers that require ISO 8601 format.
    const normalized = String(value).replace(/([+-]\d{2})(\d{2})$/, "$1:$2");
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  /**
   * Find the next talk to display (or ongoing talk if one exists)
   * Priority: ongoing talk → upcoming talk → null
   * @param {Array} talks - Array of talk objects from API
   * @returns {Object|null} Talk object or null
   */
  function pickNextOrOngoingTalk(talks) {
    const now = new Date();
    // Filter talks with valid start and end dates
    const validTalks = talks.filter(function (talk) {
      return parseDate(talk.date) && parseDate(talk.time_end);
    });

    // Check for currently ongoing talks
    const ongoing = validTalks.filter(function (talk) {
      const start = parseDate(talk.date);
      const end = parseDate(talk.time_end);
      return start && end && start <= now && now <= end;
    }).sort(function (a, b) {
      return parseDate(a.time_end) - parseDate(b.time_end);
    });

    if (ongoing.length > 0) return ongoing[0];

    // If no ongoing talk, find the next upcoming talk
    const upcoming = validTalks.filter(function (talk) {
      const start = parseDate(talk.date);
      return start && start > now;
    }).sort(function (a, b) {
      return parseDate(a.date) - parseDate(b.date);
    });

    return upcoming.length > 0 ? upcoming[0] : null;
  }

  /**
   * Inject highlight styles into the page once
   * Uses CSS !important to override folding table styles
   */
  function ensureStyles() {
    // Prevent duplicate style injection
    if (document.getElementById("next-talk-highlight-style")) return;

    const style = document.createElement("style");
    style.id = "next-talk-highlight-style";
    style.textContent = `
      #${SCHEDULE_TABLE_ID} tr.next-talk-row {
        background-color: rgba(255, 107, 107, 0.13) !important;
        display: table-row !important;
      }
      #${SCHEDULE_TABLE_ID} tr.next-talk-row > th,
      #${SCHEDULE_TABLE_ID} tr.next-talk-row > td {
        border-top: 2px solid rgba(255, 107, 107, 0.7) !important;
        border-bottom: 2px solid rgba(255, 107, 107, 0.7) !important;
      }
      #${SCHEDULE_TABLE_ID} .next-talk-badge {
        padding: 0.08rem 0.42rem;
        border-radius: 999px;
        background: #ff6b6b;
        color: #fff;
        font-size: 0.68rem;
        font-weight: 700;
        white-space: nowrap;
        display: inline-block;
        vertical-align: middle;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Find a table row by its talk number (first column)
   * @param {HTMLElement} table - Schedule table element
   * @param {number} talkNumber - Talk number to find
   * @returns {HTMLElement|null} Table row or null if not found
   */
  function findRowByTalkNumber(table, talkNumber) {
    const tbody = table.querySelector("tbody");
    if (!tbody) return null;

    const rows = Array.from(tbody.querySelectorAll("tr"));
    // Match row by comparing talk number in first column
    return rows.find(function (row) {
      const numberCell = row.querySelector("th");
      if (!numberCell) return false;
      const cellText = numberCell.textContent.trim();
      const numericValue = parseInt(cellText, 10);
      return !Number.isNaN(numericValue) && numericValue === Number(talkNumber);
    });
  }

  /**
   * Apply highlight and badge to the target talk row
   * @param {Object} targetTalk - Talk object with number property
   */
  function applyHighlight(targetTalk) {
    // Validate input
    if (!targetTalk || typeof targetTalk.number === "undefined") return;

    const table = document.getElementById(SCHEDULE_TABLE_ID);
    if (!table) return;

    // Ensure styles are loaded
    ensureStyles();

    // Find and highlight the matching row
    const row = findRowByTalkNumber(table, targetTalk.number);
    if (!row) return;

    row.classList.add("next-talk-row");

    // Add badge to the first cell (talk number column)
    const numberCell = row.querySelector("th");
    if (numberCell && !numberCell.querySelector(".next-talk-badge")) {
      const badge = document.createElement("span");
      badge.className = "next-talk-badge";
      badge.textContent = "次回";
      numberCell.appendChild(badge);
    }
  }

  /**
   * Main function: fetch API, find next talk, apply highlight
   * Uses AbortController with timeout to prevent hanging
   */
  function highlight() {
    const table = document.getElementById(SCHEDULE_TABLE_ID);
    if (!table) return;

    // Set up a timeout to abort the fetch if it takes too long
    const controller = new AbortController();
    const timeoutId = setTimeout(function () {
      controller.abort();
    }, TIMEOUT_MS);

    // Fetch schedule data from API
    fetch(SCHEDULE_API_URL, { signal: controller.signal })
      .then(function (response) {
        if (!response.ok) return null;
        return response.json();
      })
      .then(function (payload) {
        // Find next talk and apply highlight
        if (!payload || !Array.isArray(payload.talks)) return;
        const targetTalk = pickNextOrOngoingTalk(payload.talks);
        if (targetTalk) applyHighlight(targetTalk);
      })
      .catch(function () {
        // Silently fail if API times out or returns error
      })
      .finally(function () {
        // Always clean up the timeout
        clearTimeout(timeoutId);
      });
  }

  /**
   * Initialize highlighting on page load
   * Uses requestIdleCallback if available (non-blocking),
   * falls back to setTimeout(fn, 0) for older browsers
   */

  if (window.requestIdleCallback) {
    // Modern browsers: run when browser is idle (non-blocking)
    requestIdleCallback(highlight);
  } else {
    // Fallback: run as soon as possible
    setTimeout(highlight, 0);
  }
})();
