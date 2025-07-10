# E2E Testing Documentation

This directory contains end-to-end (E2E) tests for the KnowLink application using Playwright. These tests ensure that the application works correctly from a user's perspective across different browsers and scenarios.

## Setup

```bash
# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install --with-deps
```

## Start the Application

```bash
# From project root
bun build:default
bun start
```

## Run Tests

```bash
# Run all tests
npm run test
```
