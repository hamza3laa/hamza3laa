// Voiceover cue sheet (seconds). Phrase starts come from ffmpeg silencedetect
// (-35 dB, 0.25 s) and are accurate to a few ms; word starts come from a
// Whisper-small word-level pass (audio/transcript_words.json) and run ~0.1 s
// late, so word cues subtract a small lead.
window.CUE = {
  END: 142.4, // voiceover ends 140.6; the end card holds, then fades

  // 1 — في زمن تزاحمت فيه الفتن / واشتبهت فيه الحقائق / لم يسلم من الابتلاء عامي ولا عالم
  fitan: 0.27, fitan_w_tazahamat: 1.22, fitan_w_fitan: 2.40, fitan_end: 2.86,
  haqaiq: 3.71, haqaiq_w: 4.70, haqaiq_end: 5.33,
  ibtila: 6.37, ibtila_w_ammi: 7.86, ibtila_w_alim: 8.80, ibtila_end: 9.12,

  // 2 — زمن تتدفق فيه الأصوات من كل جهة / وكلٌّ يدّعي أن الحق معه
  aswat: 11.07, aswat_w_tatadaffaq: 11.72, aswat_w_aswat: 12.82, aswat_w_kull: 13.76, aswat_end: 14.38,
  yaddai: 15.22, yaddai_w_haqq: 16.60, yaddai_w_maahu: 17.04, yaddai_end: 17.24,

  // 3 — زمن صار فيه الدين عند بعض الناس / سلعة تباع في أسواق الدنيا / وقلّ فيه الثقات الذين يُرجع إليهم
  din: 18.14, din_w_din: 19.32, din_end: 20.67,
  sila: 21.19, sila_w_tuba: 21.78, sila_w_aswaq: 22.44, sila_w_dunya: 22.90, sila_end: 23.28,
  thiqat: 24.13, thiqat_w: 24.86, thiqat_end: 26.98,

  // 4 — حتى التبس الأمر على كثير من الناس / وصار التمييز بين الحق والباطل / أكثر صعوبة
  iltabas: 28.07, iltabas_w_kathir: 29.60, iltabas_end: 30.75,
  tamyiz: 31.56, tamyiz_w_haqq: 32.84, tamyiz_w_batil: 33.32, tamyiz_end: 34.13,
  suuba: 34.72, suuba_end: 35.58,

  // 5 — فإلى من يرجع السائل / وعمّن يأخذ دينه طالب الحق
  sail: 36.55, sail_w_sail: 37.74, sail_end: 38.15,
  talib: 39.17, talib_w_din: 40.00, talib_w_talib: 40.54, talib_end: 41.33,

  // 6 — في مثل هذا الزمن / تشتد الحاجة إلى العلم الموثوق / وإلى من يدل الناس على الحق / ويردهم إلى أصول دينهم ومصادره الأصيلة
  zaman: 42.32, zaman_end: 43.70,
  haja: 43.96, haja_w_ilm: 45.28, haja_w_mawthuq: 45.64, haja_end: 46.25,
  yadull: 46.83, yadull_w_haqq: 48.38, yadull_end: 48.72,
  usul: 49.03, usul_w_usul: 50.12, usul_w_masadir: 51.06, usul_w_asila: 51.74, usul_end: 52.17,

  // 7 — وقديماً قال أهل العلم / إن هذا العلم دين / فانظروا عمّن تأخذون دينكم
  qadiman: 53.19, qadiman_end: 54.74,
  dinun: 55.47, dinun_w_din: 56.58, dinun_end: 56.92,
  unzuru: 57.65, unzuru_w_amman: 58.22, unzuru_w_takhudhun: 58.60, unzuru_w_dinakum: 59.22, unzuru_end: 59.68,

  // 8 — وفي مكة / في أول الإسلام / كانت دار الأرقم بن أبي الأرقم / داراً عند الصفا /
  //     يجتمع فيها النبي ﷺ بأصحابه / يعلمهم ويزكيهم / ومن تلك الدار / خرج رجال حملوا النور إلى العالم
  makka: 60.67, makka_w: 60.96, makka_end: 61.43,
  awwal: 62.03, awwal_w_islam: 62.58, awwal_end: 63.07,
  arqam: 63.90, arqam_w_dar: 64.28, arqam_w_ibn: 65.18, arqam_end: 66.07,
  safa: 66.84, safa_w_safa: 67.50, safa_end: 67.81,
  yajtami: 68.63, yajtami_w_nabi: 69.46, yajtami_w_ashab: 71.24, yajtami_end: 71.89,
  yuallim: 72.49, yuallim_w_yuzakki: 73.52, yuallim_end: 74.31,
  tilka: 75.26, tilka_w_dar: 75.88, tilka_end: 76.30,
  kharaja: 76.98, kharaja_w_rijal: 77.44, kharaja_w_nur: 78.68, kharaja_w_alam: 79.34, kharaja_end: 79.67,

  // 9 — ومن هنا جاءت الحاجة إلى موقع موسوعي يجمع العلم النافع ويقرب الناس من العلماء الثقات /
  //     ويتيح لهم الوصول إلى الكتب والصوتيات والمرئيات / في مكان واحد
  mawqi: 80.35, mawqi_w_mawqi: 82.04, mawqi_w_mawsui: 82.48, mawqi_w_yajma: 83.44, mawqi_w_nafi: 84.18,
  mawqi_w_yuqarrib: 85.00, mawqi_w_ulama: 86.16, mawqi_w_thiqat: 86.64, mawqi_end: 87.17,
  yutih: 87.49, yutih_w_wusul: 88.30, yutih_w_kutub: 89.10, yutih_w_sawtiyat: 89.60, yutih_w_mariyyat: 90.44, yutih_end: 91.21,
  wahid: 91.65, wahid_w_wahid: 92.36, wahid_end: 92.75,

  // 10 — دار الأرقم
  brand1: 93.91, brand1_w_arqam: 94.34, brand1_end: 94.69,

  // 11 — منصة تسعى إلى أن تجعل الوصول إلى العلم الشرعي أيسر / وأن تجمع لك أبواباً من المعرفة /
  //      لتقرأ وتستمع وتشاهد / وتبدأ رحلتك في طلب العلم / على بصيرة
  minassa: 95.65, minassa_w_wusul: 97.28, minassa_w_ilm: 98.04, minassa_w_aysar: 98.88, minassa_end: 99.28,
  abwab: 99.56, abwab_w_abwab: 100.56, abwab_w_marifa: 101.28, abwab_end: 101.74,
  taqra: 102.05, tastami: 102.76, tushahid: 103.44, taqra_end: 104.05,
  rihla: 104.43, rihla_w_rihla: 104.90, rihla_w_ilm: 106.00, rihla_end: 106.29,
  basira1: 106.55, basira1_w: 106.76, basira1_end: 107.15,

  // 12 — تنقّل بين أبواب الموقع المختلفة / فكل باب يفتح لك باباً
  tanaqqal: 108.15, tanaqqal_w_abwab: 108.82, tanaqqal_w_mukhtalifa: 109.56, tanaqqal_end: 110.11,
  kullbab: 110.56, kullbab_w_bab: 110.88, kullbab_w_yaftah: 111.28, kullbab_w_baban: 111.96, kullbab_end: 112.22,

  // 13 — وسواء كنت في أول الطريق أو قطعت منه شوطاً / ففي العلم متسع للجميع
  sawa: 113.20, sawa_w_awwal: 114.28, sawa_w_tariq: 114.66, sawa_w_qataat: 115.36, sawa_w_shawt: 116.18, sawa_end: 116.54,
  muttasa: 116.95, muttasa_w_muttasa: 117.74, muttasa_w_jami: 118.28, muttasa_end: 118.78,

  // 14 — فالعلم ليس مجرد معلومات تُجمع / بل بصيرة تهدي / وفهم يصحح / وعمل يغيّر
  maalumat: 120.03, maalumat_w_maalumat: 121.40, maalumat_w_tujma: 122.08, maalumat_end: 122.54,
  tahdi: 122.88, tahdi_w: 123.80, tahdi_end: 124.20,
  yusahhih: 124.56, yusahhih_w: 125.10, yusahhih_end: 125.70,
  yughayyir: 126.22, yughayyir_w: 126.88, yughayyir_end: 127.37,

  // 15 — فابدأ اليوم / ولو بخطوة / فقليلٌ دائم / خيرٌ من كثيرٍ منقطع
  ibda: 128.56, ibda_w_yawm: 129.04, ibda_end: 129.27,
  khutwa: 129.89, khutwa_w: 130.16, khutwa_end: 130.68,
  qalil: 131.28, qalil_w_daim: 131.90, qalil_end: 132.28,
  khayr: 132.58, khayr_w_kathir: 133.34, khayr_w_munqati: 133.80, khayr_end: 134.30,

  // 16 — دار الأرقم / رحلة في طلب العلم / على طريق البصيرة
  brand2: 135.62, brand2_w_arqam: 135.98, brand2_end: 136.32,
  rihla2: 137.04, rihla2_end: 138.51,
  tariq: 139.11, tariq_w_basira: 139.86, tariq_end: 140.28,
};
