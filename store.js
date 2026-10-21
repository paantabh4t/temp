const fs = require("fs");
const path = require("path");

const FILE = process.env.TODO_FILE || path.join(__dirname, "todos.json");

function load(file = FILE) {
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (err) {
    throw new Error(`Could not read ${file}: ${err.message}`);
  }
}

function save(todos, file = FILE) {
  fs.writeFileSync(file, JSON.stringify(todos, null, 2));
}

function add(todos, text) {
  if (!text.trim()) throw new Error("Todo text cannot be empty.");
  const id = todos.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  return [...todos, { id, text: text.trim(), done: false, createdAt: new Date().toISOString() }];
}

function complete(todos, id) {
  return todos.map((t) => (t.id === id ? { ...t, done: true, completedAt: new Date().toISOString() } : t));
}

function reopen(todos, id) {
  return todos.map((t) => (t.id === id ? { ...t, done: false, completedAt: undefined } : t));
}

function rename(todos, id, text) {
  if (!text.trim()) throw new Error("Todo text cannot be empty.");
  return todos.map((t) => (t.id === id ? { ...t, text: text.trim() } : t));
}

function search(todos, term) {
  const needle = term.toLowerCase();
  return todos.filter((t) => t.text.toLowerCase().includes(needle));
}

function pending(todos) {
  return todos.filter((t) => !t.done);
}

function completeAll(todos) {
  const now = new Date().toISOString();
  return todos.map((t) => (t.done ? t : { ...t, done: true, completedAt: now }));
}

function reopenAll(todos) {
  return todos.map((t) => ({ ...t, done: false, completedAt: undefined }));
}

function sortPendingFirst(todos) {
  return [...todos].sort((a, b) => a.done - b.done || a.id - b.id);
}

function toMarkdown(todos) {
  return todos.map((t) => `- [${t.done ? "x" : " "}] ${t.text}`).join("\n");
}

function remove(todos, id) {
  return todos.filter((t) => t.id !== id);
}

function clearDone(todos) {
  return todos.filter((t) => !t.done);
}

function summary(todos) {
  const done = todos.filter((t) => t.done).length;
  const percent = todos.length ? Math.round((done / todos.length) * 100) : 0;
  return { total: todos.length, done, pending: todos.length - done, percent };
}

module.exports = { load, save, add, complete, remove, clearDone, summary, reopen, rename, search, pending, completeAll, reopenAll, sortPendingFirst, toMarkdown };
