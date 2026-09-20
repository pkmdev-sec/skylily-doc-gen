# React Project Documentation Example

This example shows how to use doc-gen with a React/TypeScript project.

## Setup

```bash
# In your React project
npm install skylily-doc-gen --save-dev
```

## package.json scripts

```json
{
  "scripts": {
    "docs": "doc-gen ./src --output ./docs --title 'React Components API'",
    "docs:components": "doc-gen ./src/components --single COMPONENTS.md",
    "docs:hooks": "doc-gen ./src/hooks --single HOOKS.md",
    "docs:utils": "doc-gen ./src/utils --single UTILS.md"
  }
}
```

## Sample Component

```tsx
// src/components/Button.tsx

import React from 'react';

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

/**
 * Button size options
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Props for the Button component
 */
export interface ButtonProps {
  /** Button label text */
  children: React.ReactNode;
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button shows a loading state */
  loading?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS class names */
  className?: string;
}

/**
 * A customizable button component
 * 
 * @example
 * <Button variant="primary" onClick={handleClick}>
 *   Click Me
 * </Button>
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className,
}: ButtonProps): React.ReactElement {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className || ''}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
```

## Sample Hook

```tsx
// src/hooks/useLocalStorage.ts

import { useState, useEffect } from 'react';

/**
 * Options for useLocalStorage hook
 */
export interface UseLocalStorageOptions<T> {
  /** Key to use in localStorage */
  key: string;
  /** Initial value if key doesn't exist */
  initialValue: T;
  /** Custom serializer (default: JSON.stringify) */
  serialize?: (value: T) => string;
  /** Custom deserializer (default: JSON.parse) */
  deserialize?: (value: string) => T;
}

/**
 * Hook for syncing state with localStorage
 * 
 * @example
 * const [theme, setTheme] = useLocalStorage({
 *   key: 'theme',
 *   initialValue: 'light'
 * });
 */
export function useLocalStorage<T>({
  key,
  initialValue,
  serialize = JSON.stringify,
  deserialize = JSON.parse,
}: UseLocalStorageOptions<T>): [T, (value: T) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? deserialize(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  
  useEffect(() => {
    try {
      localStorage.setItem(key, serialize(state));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, [key, state, serialize]);
  
  return [state, setState];
}
```

## Generated Output

Running `doc-gen ./src` will generate documentation like:

### Interfaces

#### `ButtonProps`

Props for the Button component

| Property | Type | Optional | Description |
|----------|------|----------|-------------|
| `children` | `React.ReactNode` |  | Button label text |
| `variant` | `ButtonVariant` | ✓ | Visual variant |
| `size` | `ButtonSize` | ✓ | Size of the button |
| `disabled` | `boolean` | ✓ | Whether the button is disabled |
| `loading` | `boolean` | ✓ | Whether the button shows a loading state |
| `onClick` | `() => void` | ✓ | Click handler |
| `className` | `string` | ✓ | Additional CSS class names |

### Functions

#### `Button`

A customizable button component

```typescript
Button(props: ButtonProps): React.ReactElement
```

#### `useLocalStorage`

Hook for syncing state with localStorage

```typescript
useLocalStorage<T>(options: UseLocalStorageOptions<T>): [T, (value: T) => void]
```
