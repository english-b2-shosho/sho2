#!/bin/bash
set -e
cd /tmp/sho2
mkdir -p videos segs
FPS=24
seg() { # img dur direction(zin|zout) out
  local img=$1 dur=$2 dir=$3 out=$4
  local frames=$(python3 -c "print(int($dur*$FPS))")
  if [ "$dir" = "zin" ]; then
    Z="z='min(1.0+on*0.0006,1.18)'"
  else
    Z="z='max(1.18-on*0.0006,1.0)'"
  fi
  ffmpeg -y -v error -loop 1 -i "$img" \
    -vf "scale=1600:2844:force_original_aspect_ratio=increase,crop=1600:2844,zoompan=$Z:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=$frames:s=720x1280:fps=$FPS" \
    -frames:v $frames -c:v libx264 -preset veryfast -crf 26 -pix_fmt yuv420p "$out"
}
build() { # name audiodur imgs...
  local name=$1 dur=$2; shift 2
  local imgs=("$@")
  local n=${#imgs[@]}
  local per=$(python3 -c "print($dur/$n)")
  local i=0 dir=zin
  > segs/$name.txt
  for img in "${imgs[@]}"; do
    i=$((i+1))
    seg "$img" "$per" "$dir" "segs/${name}-$i.mp4"
    echo "file '${name}-$i.mp4'" >> segs/$name.txt
    if [ "$dir" = zin ]; then dir=zout; else dir=zin; fi
  done
  ffmpeg -y -v error -f concat -safe 0 -i segs/$name.txt -c copy segs/${name}-all.mp4
  ffmpeg -y -v error -i segs/${name}-all.mp4 -i "/tmp/sho2-audio/${name}.wav" \
    -c:v copy -c:a aac -b:a 96k -ac 1 -shortest -movflags +faststart "videos/${name}.mp4"
  rm -rf segs/${name}-*.mp4 segs/${name}-all.mp4 segs/$name.txt
}
D=/downloads
build v01-welcome 26.12 $D/sho2-w1.png $D/sho2-w2.png $D/sho2-w3.png $D/sho2-w4.png
build v02-hdod    14.20 $D/sho2-h1.png $D/sho2-h2.png
build v03-ahl     14.48 $D/sho2-a1.png $D/sho2-a2.png
build v04-sohab   14.96 $D/sho2-s1.png $D/sho2-s2.png
build v05-flous   11.92 $D/sho2-f1.png $D/sho2-f2.png
build v06-khilafat 16.40 $D/sho2-k1.png $D/sho2-k2.png
ls -la videos/
