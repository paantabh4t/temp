# temp

A tiny command-line todo list, written in plain Node.js (no dependencies).

## Usage

Run `npm link` once to get a global `todo` command, or call `node todo.js` directly.

```bash
node todo.js add "buy milk"
node todo.js list
node todo.js pending
node todo.js show 1
node todo.js find milk
node todo.js done 1
node todo.js done 2 3
node todo.js done all
node todo.js undo 1
node todo.js undo 2 3
node todo.js edit 1 "buy oat milk"
node todo.js rm 1
node todo.js rm 2 3
node todo.js clear
node todo.js count
node todo.js stats
node todo.js export > todos.md
node todo.js help
node todo.js version
```

## License

MIT, see [LICENSE](LICENSE).

## Tests

```bash
npm test
```
