#!/usr/bin/env bash
# Builds a subtle, non-musical sound-design bed (impacts, whooshes, shimmer) under the
# voiceover, cued to the same timings as js/cues.js. Output: audio/mix.wav
set -euo pipefail
cd "$(dirname "$0")"
DUR=142.4
BOOMS="2.38 45.62 93.89 135.60"
WHOOSH="10.75 17.70 27.35 35.90 41.85 52.60 60.10 78.95 81.85 95.20 107.80 110.80 111.24 111.92 112.75 119.60 127.85"
SHIMMER="0.27 43.96 76.98 92.30 106.74 122.86 139.84"
mk() { ffmpeg -hide_banner -loglevel error -y "$@"; }
mkdir -p out/sfx
mk -f lavfi -i "aevalsrc='0.9*sin(2*PI*(42+38*exp(-9*t))*t)*exp(-2.6*t)+0.25*sin(2*PI*84*t)*exp(-6*t)':s=48000:d=2.8" -f lavfi -i "anoisesrc=d=2.8:c=brown:a=0.6:r=48000" -filter_complex "[1]lowpass=f=180,afade=t=out:st=0:d=1.6:curve=exp[n];[0][n]amix=inputs=2:weights=1 0.7,volume=1.6" out/sfx/boom.wav
mk -f lavfi -i "anoisesrc=d=1.3:c=pink:a=0.7:r=48000" -af "bandpass=f=900:w=1.2,highpass=f=200,afade=t=in:d=0.75:curve=exp,afade=t=out:st=0.75:d=0.55:curve=exp,volume=1.4" out/sfx/whoosh.wav
mk -f lavfi -i "anoisesrc=d=2.2:c=white:a=0.35:r=48000" -af "highpass=f=5500,afade=t=in:d=0.04,afade=t=out:st=0.08:d=2.0:curve=exp,aecho=0.8:0.6:60|110:0.4|0.25" out/sfx/shimmer.wav
mk -f lavfi -i "anoisesrc=d=$DUR:c=brown:a=0.08:r=48000" -af "lowpass=f=220,volume=0.5" out/sfx/room.wav

inputs=(-i audio/voiceover.wav -i out/sfx/room.wav); filt=""; n=2; labels=""
add() { inputs+=(-i "out/sfx/$1.wav"); local ms; ms=$(awk "BEGIN{printf \"%d\", $2*1000}"); filt+="[$n]adelay=${ms}|${ms},volume=$3[s$n];"; labels+="[s$n]"; n=$((n+1)); }
for t in $BOOMS; do add boom "$t" 0.55; done
for t in $WHOOSH; do add whoosh "$t" 0.22; done
for t in $SHIMMER; do add shimmer "$t" 0.30; done
k=$((n-2))
ffmpeg -hide_banner -loglevel error -y "${inputs[@]}" -filter_complex \
  "[0]aresample=48000,apad,atrim=0:$DUR,volume=1.0,asplit=2[vo][vosc];[1]volume=1.0[rm];${filt}${labels}[rm]amix=inputs=$((k+1)):normalize=0,atrim=0:$DUR[fx];[fx][vosc]sidechaincompress=threshold=0.05:ratio=4:attack=20:release=300[duck];[duck][vo]amix=inputs=2:normalize=0,alimiter=limit=0.95" \
  -ar 48000 audio/mix.wav
echo "wrote audio/mix.wav"
