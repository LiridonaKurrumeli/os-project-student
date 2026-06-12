# OS Project — Assignment

**Deadline:** Friday

Complete the required features below. Explore the codebase, follow existing patterns, and make sure the app still runs end-to-end.

Before you start, copy `.env.example` to `.env` and set your API base URL.

---

## Required

### 1. News App

Build the News application. Fetch data from the API (`/comments`, limit 10). Handle loading and errors. Display each item with author name, email, and body text.

Define your own TypeScript types based on the API response.

**Done when:** real data from the API, not hardcoded; loading and error states handled.

---

### 2. Gallery App

Build the Gallery application. Fetch photos from the API (`/photos`, limit 12). Show thumbnails in a grid with titles. Handle loading and errors.

Define your own TypeScript types based on the API response.

**Done when:** 12 photos from the API in a responsive grid; loading and error states handled.

---

### 3. Live Clock

The menu bar should show the current date and time, updating in real time. Use 24-hour time.

**Format:** `M/D/YYYY - HH:mm:ss` (e.g. `6/9/2026 - 14:35:22`)

**Done when:** clock ticks every second with the correct format.

---

### 4. Dark Mode

Add a dark/light theme users can switch from Preferences. The choice should persist across refresh. Apply `dark:` styling where you think it improves the UI — not every element needs it, use your judgment.

**Done when:** toggle works, theme persists, app looks correct in both modes.

**Extra:** on a first visit (no saved preference yet), detect and use the system color scheme.

---

## Extra points

### 5. Battery Indicator

Replace the placeholder in the menu bar with the real battery level where the browser supports it. It should update when the level changes. If the API is not available, show something reasonable instead of breaking.

**Done when:** real battery on supported devices; graceful fallback otherwise.

---

## General

- Do not break what already works (login, desktop, windows, Documents, other apps).
- `npm run dev` and `npm run build` must both pass.
- Match how the rest of the project is structured.
- `react-toastify` is available if you want user feedback notifications.
- Feel free to add extra features beyond this assignment if you want — polish, new apps, UX improvements, etc. Not required, but encouraged if you have time.
