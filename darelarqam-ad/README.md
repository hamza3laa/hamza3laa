# Dar Al-Arqam — motion graphics ad

A 2:22 (1920×1080, 60 fps) motion-graphics film for [darelarqam.com](https://darelarqam.com), built to the supplied Arabic voiceover. There are no captions or subtitles. The only on-screen text is brand and UI text: the logo, the URL, and interface labels inside the website mock-ups.

## Final videos

| File | Audio |
|---|---|
| `darelarqam-ad.mp4` | voiceover + subtle sound design (impacts, whooshes, shimmer; no music) |
| `darelarqam-ad_vo-only.mp4` | voiceover only |

## How the sync works

- `audio/transcript_words.json`: word-level transcript from a local Whisper-small pass.
- `js/cues.js`: the cue sheet. Phrase starts come from `ffmpeg silencedetect` and are accurate to a few milliseconds. Word starts come from the Whisper pass. Every animation is keyed to a named cue, for example `C.fitan_w_fitan` is the word «الفتن».
- `js/core.js`: a single paused GSAP master timeline plus canvas "drawers", which are pure functions of time. `renderAt(t)` is deterministic, so any frame can be rendered in any order.

## Scenes

| Time | Voiceover | Visual |
|---|---|---|
| 0–10.9 | في زمن تزاحمت فيه الفتن… | A perfect geometric rosette crowds, then shatters on «الفتن»; the fragments double on «اشتبهت»; a lamp flickers in the storm |
| 11–17.7 | تتدفق فيه الأصوات من كل جهة… | Voices ripple in from every direction; a ring of arrows fights over the centre and turns away on «معه» |
| 18–27.3 | الدين… سلعة تباع… وقلّ الثقات | A balance scale: the book gets a price tag, coins outweigh it; a field of lamps goes out until only a few remain |
| 28–35.9 | التبس الأمر… الحق والباطل | A maze full of wanderers; the white and black threads entangle |
| 36.5–41.9 | فإلى من يرجع السائل؟ | A seeker at a crossroads of paths |
| 42–52.7 | تشتد الحاجة إلى العلم الموثوق… | Dawn; the shattered rosette re-forms on «الموثوق»; a road of light; roots reach down to the original sources |
| 53–60.3 | إن هذا العلم دين… | An illuminated manuscript page; an isnād chain lights link by link |
| 60.6–79.6 | وفي مكة… دار الأرقم… عند الصفا | Night over Makkah, the house beside al-Safa; light gathers, pulses on «يعلمهم ويزكيهم», then streams out to the world |
| 79–81.9 | …إلى العالم | A globe: arcs of light from Makkah to cities across the world |
| 82–92.6 | موقع موسوعي… الكتب والصوتيات والمرئيات… في مكان واحد | The website builds; a wall of knowledge flows in; scholar cards; book, audio and video cards land on their words, then merge into one |
| 92–95.4 | دار الأرقم | Logo reveal |
| 95.6–107.9 | منصة… لتقرأ وتستمع وتشاهد… على بصيرة | Search and results, doors of knowledge, a phone swiping read, listen, watch, then a journey path ending in a star |
| 108–112.9 | فكل باب يفتح لك باباً | A carousel of doors, then an infinite zoom through doors opening into doors |
| 113–119.7 | أول الطريق… متسع للجميع | A road to the dawn; markers at its start and far along; then hundreds of travellers |
| 120–127.9 | بصيرة تهدي، وفهم يصحح، وعمل يغيّر | Loose letters form a lamp whose beam guides; a crooked line straightens; a sprout blooms and colour floods out |
| 128–134.9 | فابدأ اليوم ولو بخطوة… فقليلٌ دائم… | Sunrise and a first lit step; steady drops carving stone; a steady line overtakes bursts that break off |
| 135–142.4 | دار الأرقم — رحلة في طلب العلم على طريق البصيرة | End card: logo, wordmark, a road of light into the door, the URL, and a star glint on «البصيرة» |

## Build

```bash
npm install --ignore-scripts        # gsap, fonts, d3 (already vendored in vendor/ and fonts/)
./sfx.sh                            # rebuilds audio/mix.wav (voiceover + sound design)
node render.mjs --fps 60 --workers 4                                    # -> out/darelarqam-ad.mp4
node render.mjs --audio audio/voiceover.wav --out out/vo-only.mp4      # voice only
node snap.mjs /tmp/frames 12.5 93.9                                     # stills for review
```

Open `index.html` in a browser for a live preview that plays in sync with the voiceover. Add `?t=93` to start at 93 seconds.

## Notes

- The Prophet ﷺ and the Companions are never depicted. The gathering at Dar al-Arqam is shown only as light inside the house.
- darelarqam.com could not be reached from the build environment, so the brand mark, palette and UI mock-ups are original designs. Swap in the official logo or colours by editing `js/brand.js` and the CSS tokens in `index.html`.
- The manuscript page in scene 7 shows the hadith «من سلك طريقاً يلتمس فيه علماً سهّل الله له به طريقاً إلى الجنة» (Sahih Muslim 2699) as a prop. It is not voiceover text.
