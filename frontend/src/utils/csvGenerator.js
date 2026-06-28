/**
 * csvGenerator.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable CSV export utility for MoneyMap.
 *
 * Usage:
 *   import { downloadTransactionsCSV } from "../utils/csvGenerator";
 *   await downloadTransactionsCSV();
 *
 * No third-party libraries required — uses native Blob + URL.createObjectURL.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { getExpenses } from "../services/expenseService";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Escape a single CSV cell value per RFC 4180:
 *  - Wrap in double-quotes if the value contains a comma, double-quote, or newline.
 *  - Escape any embedded double-quotes by doubling them.
 */
const escapeCell = (value) => {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

/**
 * Format a date value as DD-MM-YYYY.
 * Accepts ISO strings, Date objects, or timestamps.
 */
const formatDate = (dateValue) => {
  const d = new Date(dateValue ?? Date.now());
  const valid = isNaN(d.getTime()) ? new Date() : d;
  const dd   = String(valid.getDate()).padStart(2, "0");
  const mm   = String(valid.getMonth() + 1).padStart(2, "0");
  const yyyy = valid.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

/** Capitalise first letter of a string. */
const cap = (s) =>
  String(s ?? "").charAt(0).toUpperCase() + String(s ?? "").slice(1);

// ─── Trigger browser download ─────────────────────────────────────────────────

/**
 * Create a temporary anchor element, click it to download, then clean up.
 * @param {string} content   — CSV string
 * @param {string} filename  — e.g. "MoneyMap_Transactions_2026-06-28.csv"
 */
const triggerDownload = (content, filename) => {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Release the object URL after a short delay to allow the download to start
  setTimeout(() => URL.revokeObjectURL(url), 200);
};

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Fetch all transactions and download them as a CSV file.
 *
 * Columns: Date, Title, Category, Type, Amount
 *
 * @throws Will throw if the API call fails — callers should handle the error.
 */
export const downloadTransactionsCSV = async () => {
  // 1. Fetch all transactions from the API
  const transactions = await getExpenses();

  if (!Array.isArray(transactions) || transactions.length === 0) {
    throw new Error("No transactions found to export.");
  }

  // 2. Build the CSV content
  const HEADERS = ["Date", "Title", "Category", "Type", "Amount"];

  const rows = transactions.map((t) => [
    escapeCell(formatDate(t.date)),
    escapeCell(cap(t.title)),
    escapeCell(cap(t.category)),
    escapeCell(cap(t.type ?? "Expense")),
    escapeCell(Number(t.amount ?? 0)),   // plain number, no currency symbol
  ]);

  const csvLines = [
    HEADERS.join(","),
    ...rows.map((row) => row.join(",")),
  ];

  const csvContent = csvLines.join("\r\n"); // RFC 4180 uses CRLF

  // 3. Trigger download with a date-stamped filename
  const today    = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const filename = `MoneyMap_Transactions_${today}.csv`;

  triggerDownload(csvContent, filename);
};
