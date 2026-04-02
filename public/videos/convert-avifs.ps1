$videos = @(
  "home-vis",
  "home-material",
  "home-ownership",
  "home-acquisition",
  "vis-object-study"
)

foreach ($name in $videos) {
  if (-not (Test-Path "$name.mp4")) {
    Write-Host "==== Missing $name.mp4, skipping ====" -ForegroundColor Red
    continue
  }

  Write-Host ""
  Write-Host "==== Creating $name.y4m ====" -ForegroundColor Cyan
  ffmpeg -i "$name.mp4" -an -vf "fps=12,scale=1920:-2:flags=lanczos" -pix_fmt yuv420p -f yuv4mpegpipe "$name.y4m"

  if (-not (Test-Path "$name.y4m")) {
    Write-Host "==== Failed to create $name.y4m, skipping AVIF encode ====" -ForegroundColor Red
    continue
  }

  Write-Host ""
  Write-Host "==== Creating $name.avif ====" -ForegroundColor Yellow
  avifenc -q 85 -s 2 --fps 12 "$name.y4m" "$name.avif"

  if (Test-Path "$name.avif") {
    Write-Host "==== Deleting $name.y4m ====" -ForegroundColor Green
    Remove-Item "$name.y4m"
  } else {
    Write-Host "==== $name.avif was not created. Keeping $name.y4m ====" -ForegroundColor Red
  }
}