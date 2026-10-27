const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { load, save, add, complete, remove, clearDone, summary, reopen, rename, search, pending, completeAll, reopenAll, sortPendingFirst, toMarkdown } = require("./store");

let todos = add([], "write code");
todos = add(todos, "push code");
assert.deepStrictEqual(todos.map((t) => t.id), [1, 2]);

todos = complete(todos, 1);
assert.strictEqual(todos[0].done, true);
assert.strictEqual(todos[1].done, false);

todos = remove(todos, 1);
assert.deepStrictEqual(todos.map((t) => t.text), ["push code"]);
assert.strictEqual(add(todos, "next")[1].id, 3);

const mixed = complete(add(add([], "a"), "b"), 1);
assert.deepStrictEqual(clearDone(mixed).map((t) => t.text), ["b"]);

assert.deepStrictEqual(summary(mixed), { total: 2, done: 1, pending: 1, percent: 50 });

assert.strictEqual(reopen(mixed, 1)[0].done, false);

assert.strictEqual(rename(mixed, 2, "c")[1].text, "c");

assert.deepStrictEqual(search(mixed, "B").map((t) => t.id), [2]);

assert.deepStrictEqual(pending(mixed).map((t) => t.id), [2]);

assert.ok(completeAll(mixed).every((t) => t.done));

assert.throws(() => add([], "   "), /cannot be empty/);
assert.strictEqual(add([], "  tidy  ")[0].text, "tidy");

assert.deepStrictEqual(sortPendingFirst(mixed).map((t) => t.id), [2, 1]);
assert.deepStrictEqual(mixed.map((t) => t.id), [1, 2]);

assert.ok(!Number.isNaN(Date.parse(add([], "dated")[0].createdAt)));

assert.strictEqual(toMarkdown(mixed), "- [x] a\n- [ ] b");

assert.ok(complete(add([], "x"), 1)[0].completedAt);
assert.strictEqual(reopen(complete(add([], "x"), 1), 1)[0].completedAt, undefined);

assert.strictEqual(summary([]).percent, 0);

assert.ok(reopenAll(completeAll(mixed)).every((t) => !t.done));

assert.throws(() => rename(mixed, 1, "  "), /cannot be empty/);
assert.strictEqual(rename(mixed, 1, " z ")[0].text, "z");

const saved = path.join(os.tmpdir(), "temp-todo-save.json");
save(mixed, saved);
assert.deepStrictEqual(load(saved).map((t) => t.text), ["a", "b"]);
assert.ok(!fs.existsSync(`${saved}.tmp`));
fs.unlinkSync(saved);

const bad = path.join(os.tmpdir(), "temp-todo-bad.json");
fs.writeFileSync(bad, "{not json");
assert.throws(() => load(bad), /Could not read/);
fs.unlinkSync(bad);

const { spawnSync } = require("child_process");
const cliFile = path.join(os.tmpdir(), "temp-todo-cli.json");
const cli = (...args) =>
  spawnSync(process.execPath, [path.join(__dirname, "todo.js"), ...args], {
    env: { ...process.env, TODO_FILE: cliFile },
    encoding: "utf8",
  });
if (fs.existsSync(cliFile)) fs.unlinkSync(cliFile);
cli("add", "buy", "milk");
cli("add", "walk dog");
cli("done", "1");
assert.strictEqual(cli("count").stdout.trim(), "1");
assert.ok(cli("list").stdout.includes("2. [ ] walk dog"));
assert.strictEqual(cli("done", "9").status, 1);
assert.strictEqual(cli("bogus").status, 1);
fs.unlinkSync(cliFile);

console.log("All tests passed.");
