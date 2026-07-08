# Mindful Breathing

Mindful Breathing is a calming web app that guides you through a customizable breathing exercise with a live animated visualizer. It is designed to help you relax, focus, and build a steady meditation rhythm.

## Features

- Adjustable breathing cycle timings for inhale, hold, exhale, and second hold phases
- Start, stop, reset, and set controls for session management
- Animated circle visualization that expands and contracts with each breath
- Lap counter and session summary modal for motivation and progress tracking
- Responsive layout designed for desktop and mobile browsers

## How it works

1. Enter your preferred durations in seconds.
2. Click Set to confirm your breathing pattern.
3. Press Start to begin the guided session.
4. Use Stop whenever you want to pause and view your session summary.

## Local development

This project is ready to run as a simple static site and also supports Jekyll for GitHub Pages.

### Run the app directly

Open [index.html](index.html) in your browser.

### Run with Jekyll

1. Install Ruby and Bundler.
2. Install dependencies:
   ```bash
   bundle install
   ```
3. Start the local site:
   ```bash
   bundle exec jekyll serve
   ```
4. Open http://localhost:4000

## Project files

- [index.html](index.html) — Main app structure
- [style.css](style.css) — Styling for the breathing interface
- [script.js](script.js) — Breathing animation logic and session controls
- [_config.yml](_config.yml) — Jekyll and GitHub Pages configuration

## Deployment

The site is configured for GitHub Pages using the Jekyll Minima theme.
