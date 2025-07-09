#!/bin/bash
# https://nextjs.org/docs/app/api-reference/config/next-config-js/output
bun prisma:generate
rm -rf .next/standalone
bun build:standalone

rm -rf .next/standalone/runtime
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
cp -r prisma .next/standalone/
cp -r scripts .next/standalone/
cp -r scripts/standalone-package.json .next/standalone/package.json

cd .next/standalone
bun install