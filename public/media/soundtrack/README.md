# Studio soundtrack

There are three ways to put a favourite track on the site:

1. Drop a licensed audio file in this directory and set
   `NEXT_PUBLIC_STUDIO_SOUNDTRACK_URL=/media/soundtrack/filename.mp3`.
2. Set that variable to a public Spotify track or playlist URL.
3. Set it to a public Apple Music song or playlist URL.

Set `NEXT_PUBLIC_STUDIO_SOUNDTRACK_TITLE` for direct audio. Visitors must
press play themselves because browsers correctly block surprise autoplay.
They can also choose a local file or paste a different link from the
turntable UI; that preference stays in their browser.
