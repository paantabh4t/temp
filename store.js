const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "todos.json");

function load(file = FILE) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function save(todos, file = FILE) {
  fs.writeFileSync(file, JSON.stringify(todos, null, 2));
}

function add(todos, text) {
  const id = todos.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  return [...todos, { id, text, done: false }];
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

module.exports = { load, save, add, complete, remove, clearDone, summary, reopen, rename };
