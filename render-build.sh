#!/usr/bin/env bash
npm install
npx prisma generate
npm run build
npx prisma migrate deploy