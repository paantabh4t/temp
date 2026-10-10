#!/usr/bin/env node
const { load, save, add, complete, remove, clearDone, summary, reopen, rename, search } = require("./store");

const [command, ...args] = process.argv.slice(2);
const todos = load();

function requireId(value) {
  const id = Number(value);
  if (!todos.some((t) => t.id === id)) {
    console.error(`No todo with id ${value}.`);
    process.exit(1);
  }
  return id;
}

switch (command) {
  case "add":
    if (!args.length) {
      console.error("Usage: node todo.js add <text>");
      process.exit(1);
    }
    save(add(todos, args.join(" ")));
    console.log("Added.");
    break;
  case "done":
    save(complete(todos, requireId(args[0])));
    console.log("Marked done.");
    break;
  case "undo":
    save(reopen(todos, requireId(args[0])));
    console.log("Marked not done.");
    break;
  case "edit":
    if (args.length < 2) {
      console.error("Usage: node todo.js edit <id> <text>");
      process.exit(1);
    }
    save(rename(todos, requireId(args[0]), args.slice(1).join(" ")));
    console.log("Updated.");
    break;
  case "rm":
    save(remove(todos, requireId(args[0])));
    console.log("Removed.");
    break;
  case "clear":
    save(clearDone(todos));
    console.log("Cleared completed todos.");
    break;
  case "find": {
    const matches = search(todos, args.join(" "));
    if (!matches.length) console.log("No matches.");
    for (const t of matches) console.log(`${t.id}. [${t.done ? "x" : " "}] ${t.text}`);
    break;
  }
  case "stats": {
    const { total, done, pending } = summary(todos);
    console.log(`${total} total, ${done} done, ${pending} pending`);
    break;
  }
  case "list":
  case undefined:
    if (!todos.length) console.log("Nothing to do.");
    for (const t of todos) console.log(`${t.id}. [${t.done ? "x" : " "}] ${t.text}`);
    break;
  case "help":
    console.log("Commands: add <text>, list, find <term>, done <id>, undo <id>, edit <id> <text>, rm <id>, clear, stats, help");
    break;
  default:
    console.error(`Unknown command: ${command}`);
    process.exit(1);
}
