#!/usr/bin/env node
const { load, save, add, complete, remove } = require("./store");

const [command, ...args] = process.argv.slice(2);
const todos = load();

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
    save(complete(todos, Number(args[0])));
    console.log("Marked done.");
    break;
  case "rm":
    save(remove(todos, Number(args[0])));
    console.log("Removed.");
    break;
  case "list":
  case undefined:
    if (!todos.length) console.log("Nothing to do.");
    for (const t of todos) console.log(`${t.id}. [${t.done ? "x" : " "}] ${t.text}`);
    break;
  default:
    console.error(`Unknown command: ${command}`);
    process.exit(1);
}
