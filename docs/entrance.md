# Exhibition entrance

The entry screen uses the existing vector wordmark, a warm neutral field, no explanatory copy, and a measured progress indicator beneath the wordmark. No additional fonts, imagery or runtime dependencies are downloaded.

Model loading starts immediately. Progress measures the asset bytes described by the manifest. After transfer reaches 100%, the status changes to Preparing exhibition while geometry and GPU programs finish preparation. The entrance automatically fades away after the first scene render succeeds. No Enter button is shown. There is no artificial timer or forced minimum duration.

The exhibition behind the entrance is inert and hidden from interaction. Automatic entry transfers focus to the 3D canvas and uses a 260 ms opacity transition. Reduced-motion users receive an immediate transition. The entrance follows the saved or URL language preference; language selection is available only inside the exhibition. Failure states offer a retry and an original-exhibition link.

The default design is the centred title layout. A review-only switch is available at `/?entry-review=1` to compare an editorial left-aligned composition; regular visitors do not see it.

Validation: `node scripts/check-entrance.mjs` with the Vite server running and Chrome installed. Screenshots and results are saved under `artifacts/entrance/`. Small layouts were tested at 320 and 390 CSS pixels in desktop Chrome, not on physical phones. The original legacy route is unchanged.

Following the minimal-text direction, the visible page contains only the wordmark and percentage. Preparation and failure messages appear only when necessary. Loading and ready announcements remain accessible to screen readers.
