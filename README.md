# Sketch

**Fast project template generator**

Sketch is a desktop application designed to quickly bootstrap development environments.

It focuses on **explicit, minimal, and hackable templates** for technologies like **C/C++**, **Rust**, **GTK**, **OpenGL**, and others — without hiding the build system or project structure from the developer.

---

## Philosophy

* Zero ceremony, zero lock-in
* Readable structure over abstractions
* Made for developers who like to know what is going on

Sketch does not try to abstract your toolchain away. The generated projects are meant to be **read, modified, and owned by you**.

---

## Features

* One-click project scaffolding
* Explicit project layout (no magic)
* Hackable templates stored as plain JSON files
* Suitable for systems, graphics, and low-level development
* Cross-platform desktop application

---

## 🛠 Built with

* **Tauri** — native desktop shell
* **Rust** — backend & filesystem logic
* **React + TypeScript** — frontend UI

---

## Development Notes

### Prerequisites

* Node.js / Yarn or npm
* Rust toolchain
* Tauri CLI

### Run in development mode

```bash
yarn tauri dev
```

### Build for release

```bash
yarn tauri build
```

The release build generates native bundles for your platform (e.g. `.deb`, `.rpm`, `.AppImage` on Linux).

---

## Templates

Templates are stored as plain files and are bundled with the application at build time. They are intentionally simple and transparent, so you can inspect and modify them easily.


## Template format (JSON)

Sketch templates are defined using simple, explicit JSON files. Each template describes **what the project is**, and **how it should be generated**, step by step.

Below is a simplified explanation using the **C Console Project** template as an example.

### Metadata

```json
{
  "identifier": "C",
  "title": "C Console Project",
  "description": "A C project focused on console and terminal applications.",
  "imagePath": "/assets/c_prog.png",
  "category": "Terminal",
  "language": "C",
```

This section is used purely by the UI:

* `identifier`: unique template id
* `title` / `description`: shown in the template list
* `imagePath`: preview image
* `category` / `language`: used for filtering

### Manifest

The `manifest` section defines how the project is generated on disk.

```json
"manifest": {
  "name": "app",
  "language": "C",
  "category": "terminal",
  "steps": [ ... ]
}
```

* `name`: default project name
* `language` / `category`: semantic information for tooling and paths
* `steps`: ordered actions executed during project creation

### Steps

Each step represents a filesystem action, executed in order.

```json
"steps": [
  { "action": 0, "path": "build", "value": "" },
  { "action": 0, "path": "src", "value": "" },
  { "action": 1, "path": "src/main.c", "value": "" },
  { "action": 1, "path": "cc.sh", "value": "" }
]
```

Actions are:

* **Create directory** (e.g. `build`, `src`) (enum value 0)
* **Create empty file** (e.g. `main.c`, `cc.sh`) (enum value 1)
* **Write to a file** (e.g. `main.c`, `string|filepath`) (enum value 2)

### Copying template files

Steps can also copy files from Sketch internal resources:

```json
{ 
  "action": 2,
  "path": "src/main.c",
  "value": "resources/templates/C/main.c",
  "is_file_path": true
}
```

This copies a real template file into the generated project. Sketch does **not** hide or transform these files — what you see is exactly what you get.

### Design goals

* No hidden magic
* No code generation DSLs
* Templates are readable, editable, and versionable

If you can read JSON and understand filesystems, you can write Sketch templates.

---

