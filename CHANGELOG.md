# Changelog

## 1.1.0

- New commands: `show`, `pending`, `find`, `count`, `stats`, `export`, `version`, `help`.
- `done`, `undo` and `rm` accept several ids; `done all` and `undo all` work on every todo.
- Todos record when they were created and completed.
- `--help`, `-h`, `--version` and `-v` flags.
- `TODO_FILE` chooses where todos are stored.
- Saves are atomic, and a corrupt data file gives a clear error.
- Blank todo text is rejected.

## 1.0.0

- First release: `add`, `list`, `done`, `rm`, `clear`.
