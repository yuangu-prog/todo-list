# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A personal todo list application built with Vue 3 + TypeScript + Element Plus.

## Tech Stack

- Vue 3, TypeScript, Vite, Element Plus, Pinia, vuedraggable, Vitest

## Commands

- `npm run dev` — Start development server
- `npm test` — Run tests (Vitest)
- `npm run test:watch` — Run tests in watch mode
- `npm run build` — Type-check and build for production

## Architecture

Single-page app with sidebar (categories) + main content (todo list). State managed by Pinia with localStorage persistence. No routing.
