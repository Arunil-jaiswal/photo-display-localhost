# photo-display-localhost

A lightweight local photo slideshow server that displays 4 images in a 2x2 grid. Each quadrant loads images from one of four folders: `folder1`, `folder2`, `folder3`, and `folder4`.

## Features

- Sticky top heading: **sparky herofy photobooth**
- 4-quadrant homepage layout
- Each quadrant uses its own folder for image rotation
- Smooth slideshow updates every 5-10 seconds
- Live folder refresh: add/remove images while the server is running and they appear automatically
- Futuristic, kid-friendly background theme
- Simple CLI commands for start/stop

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

3. Open the printed URL in your browser, typically:

```bash
http://localhost:3000
```

4. Add image files to `folder1`, `folder2`, `folder3`, or `folder4` while the server runs.

## Stop the server

Use Ctrl+C in the terminal, or run:

```bash
npm run stop
```

## Folder image rules

- Supported image types: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.bmp`
- Square images like `1024x1024` are displayed crisply and centered for a symmetrical layout
- New files are detected automatically when slideshow updates
- Empty folders show a friendly placeholder message

## Notes

The backend serves the homepage and image lists via `/api/images/:folderId`. The frontend fetches those images and smoothly transitions between them.
