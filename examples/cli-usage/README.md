# CLI Usage Examples

## Basic Usage

```bash
# Generate docs for a directory
doc-gen ./src

# Generate docs for a single file
doc-gen ./src/index.ts
```

## Output Options

```bash
# Output to custom directory
doc-gen ./src --output ./documentation

# Output to single file
doc-gen ./src --single API.md

# Combine both
doc-gen ./src --output ./docs --single reference.md
```

## Customization

```bash
# Custom title
doc-gen ./src --title "My Awesome API"

# Include private members
doc-gen ./src --private

# Group by file instead of type
doc-gen ./src --by-file

# Disable table of contents
doc-gen ./src --no-toc
```

## Combined Examples

```bash
# Full documentation with all options
doc-gen ./src \
  --output ./docs \
  --title "MyApp API Reference" \
  --private \
  --by-file

# Minimal documentation
doc-gen ./src --single API.md --no-toc

# Production documentation
doc-gen ./src \
  --output ./documentation \
  --title "Production API" \
  --single api-reference.md
```

## npm Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "docs": "doc-gen ./src --output ./docs --title 'My API'",
    "docs:watch": "nodemon --watch src --ext ts --exec 'npm run docs'"
  }
}
```
