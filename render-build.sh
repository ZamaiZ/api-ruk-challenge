#!/usr/bin/env bash
npm install -g pnpm
pnpm install
pnpm prisma generate
pnpm build
pnpm prisma migrate deploy