#!/usr/bin/env node
const { load, save, add, complete, remove, clearDone, summary, reopen, rename, search, pending, completeAll, reopenAll, sortPendingFirst, toMarkdown } = require("./store");

const [command, ...args] = process.argv.slice(2);
let todos;
try {
  todos = load();
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

function requireIds(values, usage) {
  if (!values.length) {
    console.error(`Usage: node todo.js ${usage}`);
    process.exit(1);
  }
  return [...new Set(values.map(requireId))];
}

function format(t) {
  return `${t.id}. [${t.done ? "x" : " "}] ${t.text}`;
}

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
    try {
      save(add(todos, args.join(" ")));
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
    console.log("Added.");
    break;
  case "done": {
    if (args[0] === "all") {
      save(completeAll(todos));
      console.log("Marked all done.");
      break;
    }
    const ids = requireIds(args, "done <id> [id...] | done all");
    save(ids.reduce(complete, todos));
    console.log(`Marked ${ids.length} done.`);
    break;
  }
  case "undo": {
    if (args[0] === "all") {
      save(reopenAll(todos));
      console.log("Marked all not done.");
      break;
    }
    const ids = requireIds(args, "undo <id> [id...] | undo all");
    save(ids.reduce(reopen, todos));
    console.log(`Marked ${ids.length} not done.`);
    break;
  }
  case "edit":
    if (args.length < 2) {
      console.error("Usage: node todo.js edit <id> <text>");
      process.exit(1);
    }
    try {
      save(rename(todos, requireId(args[0]), args.slice(1).join(" ")));
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
    console.log("Updated.");
    break;
  case "rm": {
    const ids = requireIds(args, "rm <id> [id...]");
    save(ids.reduce(remove, todos));
    console.log(`Removed ${ids.length}.`);
    break;
  }
  case "clear": {
    const kept = clearDone(todos);
    save(kept);
    console.log(`Cleared ${todos.length - kept.length} completed todos.`);
    break;
  }
  case "pending": {
    const open = pending(todos);
    if (!open.length) console.log("Nothing pending.");
    for (const t of open) console.log(format(t));
    break;
  }
  case "find": {
    if (!args.length) {
      console.error("Usage: node todo.js find <term>");
      process.exit(1);
    }
    const matches = search(todos, args.join(" "));
    if (!matches.length) console.log("No matches.");
    for (const t of matches) console.log(format(t));
    break;
  }
  case "export":
    if (todos.length) console.log(toMarkdown(sortPendingFirst(todos)));
    break;
  case "show": {
    const t = todos.find((x) => x.id === requireId(args[0]));
    console.log(format(t));
    if (t.createdAt) console.log(`  created:   ${t.createdAt}`);
    if (t.completedAt) console.log(`  completed: ${t.completedAt}`);
    break;
  }
  case "count":
    console.log(String(pending(todos).length));
    break;
  case "stats": {
    const { total, done, pending, percent } = summary(todos);
    console.log(`${total} total, ${done} done, ${pending} pending (${percent}% complete)`);
    break;
  }
  case "list":
  case undefined:
    if (!todos.length) console.log("Nothing to do.");
    for (const t of sortPendingFirst(todos)) console.log(format(t));
    break;
  case "version":
    console.log(require("./package.json").version);
    break;
  case "help":
    console.log("Commands: add <text>, list, show <id>, pending, find <term>, done <id...|all>, undo <id...|all>, edit <id> <text>, rm <id...>, clear, count, stats, export, version, help");
    break;
  default:
    console.error(`Unknown command: ${command}`);
    process.exit(1);
}
