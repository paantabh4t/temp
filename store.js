const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "todos.json");

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
  return [...todos, { id, text: text.trim(), done: false }];
}

function complete(todos, id) {
  return todos.map((t) => (t.id === id ? { ...t, done: true } : t));
}

function reopen(todos, id) {
  return todos.map((t) => (t.id === id ? { ...t, done: false } : t));
}

function rename(todos, id, text) {
  return todos.map((t) => (t.id === id ? { ...t, text } : t));
}

function search(todos, term) {
  const needle = term.toLowerCase();
  return todos.filter((t) => t.text.toLowerCase().includes(needle));
}

function pending(todos) {
  return todos.filter((t) => !t.done);
}

function completeAll(todos) {
  return todos.map((t) => ({ ...t, done: true }));
}

function remove(todos, id) {
  return todos.filter((t) => t.id !== id);
}

function clearDone(todos) {
  return todos.filter((t) => !t.done);
}

function summary(todos) {
  const done = todos.filter((t) => t.done).length;
  return { total: todos.length, done, pending: todos.length - done };
}

module.exports = { load, save, add, complete, remove, clearDone, summary, reopen, rename, search, pending, completeAll };
