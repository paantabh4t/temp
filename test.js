const assert = require("assert");
const { add, complete, remove, clearDone, summary, reopen, rename, search } = require("./store");

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

assert.deepStrictEqual(summary(mixed), { total: 2, done: 1, pending: 1 });

assert.strictEqual(reopen(mixed, 1)[0].done, false);

assert.strictEqual(rename(mixed, 2, "c")[1].text, "c");

assert.deepStrictEqual(search(mixed, "B").map((t) => t.id), [2]);

console.log("All tests passed.");
