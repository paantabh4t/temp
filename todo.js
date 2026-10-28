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
    if (!args.length) {
      console.error("Usage: node todo.js show <id>");
      process.exit(1);
    }
    const id = requireId(args[0]);
    const t = todos.find((x) => x.id === id);
    console.log(format(t));
    if (t.createdAt) console.log(`  created:   ${new Date(t.createdAt).toLocaleString()}`);
    if (t.completedAt) console.log(`  completed: ${new Date(t.completedAt).toLocaleString()}`);
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
    if (todos.length) {
      const s = summary(todos);
      console.log(`${s.pending} open, ${s.done} done`);
    }
    break;
  case "version":
  case "--version":
  case "-v":
    console.log(require("./package.json").version);
    break;
  case "help":
  case "--help":
  case "-h":
    const commands = [
      ["add <text>", "Add a todo"],
      ["list", "List all todos, open ones first"],
      ["show <id>", "Show one todo with its timestamps"],
      ["pending", "List only open todos"],
      ["find <term>", "Search todo text"],
      ["done <id...|all>", "Mark todos done"],
      ["undo <id...|all>", "Mark todos not done"],
      ["edit <id> <text>", "Change a todo's text"],
      ["rm <id...>", "Remove todos"],
      ["clear", "Remove all completed todos"],
      ["count", "Print the number of open todos"],
      ["stats", "Show totals and percent complete"],
      ["export", "Print todos as a Markdown checklist"],
      ["version", "Print the version"],
      ["help", "Show this help"],
    ];
    console.log("Usage: node todo.js <command>");
    console.log("");
    for (const [cmd, desc] of commands) console.log(`  ${cmd.padEnd(18)}${desc}`);
    break;
  default:
    console.error(`Unknown command: ${command}. Run "node todo.js help" to see all commands.`);
    process.exit(1);
}
