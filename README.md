# @vuebro/shared

A TypeScript library providing reactive data structures, JSON schema validation, and tree utilities for Vue-based applications in the VueBro ecosystem.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [API Reference](#api-reference)
- [Usage](#usage)
- [Data Validation](#data-validation)
- [Tree Navigation](#tree-navigation)
- [Contributing](#contributing)
- [License](#license)

## Overview

`@vuebro/shared` is a shared TypeScript library that provides common utilities, reactive data structures, and validation schemas for Vue-based applications, particularly those built with the VueBro ecosystem. It leverages Vue 3's reactivity system combined with JSON Schema validation to create a robust foundation for managing application state.

## Features

- **Reactive Data Management**: Uses Vue 3's reactivity system to manage shared data structures
- **JSON Schema Validation**: Validates data against predefined schemas using AJV
- **Tree Data Structure**: Provides utilities for working with hierarchical data
- **Type Safety**: Strong typing with TypeScript and JSON Schema integration
- **Vue 3 Compatibility**: Built specifically for Vue 3's Composition API
- **Automatic Property Computation**: Automatically computes properties for tree nodes

## Installation

```bash
npm install @vuebro/shared
```

## API Reference

### Exports

- Reactive data structures: `feed`, `fonts`, `importmap`, `tree`, `credentials`, `log`
- Tree navigation functions: `add`, `addChild`, `remove`, `up`, `down`, `left`, `right`, `move`
- Validation functions: `validateCredentials`, `validateLog`, and others
- Utility functions: `uid`, `fetching`
- TypeScript types: `TCredentials`, `TFeed`, `TFonts`, `TImportmap`, `TLog`, `TPage`

## Usage

### Basic Usage

```typescript
import { sharedStore, fetching } from '@vuebro/shared';

// Access reactive data structures
const { feed, fonts, importmap, tree, credentials, log } = sharedStore;

// Fetch content from a URL
const content = await fetching('https://example.com/data.json');
```

### Working with Tree Data

```typescript
import { sharedStore } from '@vuebro/shared';

// Add a new node to the tree
const newPage = {
  name: 'New Page',
  enabled: true,
  children: []
};
sharedStore.add(newPage);

// Navigate the tree
const rootNodes = sharedStore.nodes.value;
const allNodesById = sharedStore.kvNodes.value;
```

### Page Computed Properties

Each page in the tree automatically gets enhanced with computed properties:

- `$children`: Enabled child nodes
- `$index`: Index among siblings
- `$next` / `$prev`: Next/previous sibling among enabled nodes
- `$siblings`: All enabled siblings
- `i`: Icon class name
- `path`: URL path based on branch
- `title`: Page title (header or name)
- `to`: Full URL path

```typescript
import { sharedStore } from '@vuebro/shared';

// Access computed properties on a page
const page = sharedStore.tree[0];
console.log(page.title);  // Combined title (header or name)
console.log(page.path);   // URL path based on branch
console.log(page.$children); // Enabled child nodes only
```

## Data Validation

The library automatically validates all data against predefined JSON schemas. Each schema ensures data integrity and type safety:

- **Credentials**: AWS credentials and access information
- **Feed**: RSS/Atom feed data
- **Fonts**: Font configurations
- **Importmap**: JavaScript import maps
- **Log**: Logging and event data
- **Page**: Page and navigation data with hierarchical properties
- **Nodes**: Array of page nodes

## Tree Navigation

The library provides a complete set of functions for navigating and manipulating tree structures:

- `add(parentId)`: Add a new node as a child
- `addChild(parentId)`: Add a child node
- `remove(nodeId)`: Remove a node
- `up(nodeId)`: Move node up in the sibling list
- `down(nodeId)`: Move node down in the sibling list
- `left(nodeId)`: Move node left in the hierarchy
- `right(nodeId)`: Move node right in the hierarchy
- `move(nodeId, position)`: Move a node to a specific position

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run the tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Building

```bash
npm run build  # Compiles TypeScript to JavaScript using tsc and tsc-alias
```

### Linting

```bash
npm run lint   # Lints the codebase with ESLint
```

## Dependencies

- `vue`: Vue 3 framework for reactivity
- `ajv`: JSON schema validator
- `json-schema-to-ts`: Type generation from JSON schemas
- `@vuebro/flat-json-tree`: Tree data structure utilities
- `ofetch`: HTTP client
- `uuid-random`: UUID generation

## License

This project is licensed under the AGPL-3.0-or-later License - see the [LICENSE](LICENSE) file for details.