// =====================================================
// SD SmartLearn — KELAS 2 (SUPER LENGKAP)
// =====================================================

SD_CONTENT.materi["2"] = {};
SD_CONTENT.kuis["2"]   = {};

const Q2 = (q,a,c)=>({q,a,correct:c});


// =====================================================
// 🇮🇩 PENDIDIKAN PANCASILA — KELAS 2
// =====================================================
SD_CONTENT.materi["2"]["Pendidikan Pancasila"] = [
  {
    judul: "Bab 1 — Aturan dalam Kehidupan Sehari-hari",
    paragraf:
      "Setiap hari kita hidup bersama orang lain, baik di rumah maupun di sekolah. "
    + "Agar kehidupan berjalan dengan tertib dan aman, diperlukan aturan. "
    + "Aturan adalah kesepakatan yang dibuat bersama dan harus dipatuhi.\n\n"
    + "Di rumah, aturan bisa berupa bangun pagi tepat waktu, merapikan tempat tidur, "
    + "dan membantu orang tua. Aturan ini membuat keluarga hidup rukun.\n\n"
    + "Di sekolah, aturan seperti datang tepat waktu, memakai seragam rapi, "
    + "dan mendengarkan guru sangat penting agar belajar berjalan lancar.",
    contoh: [
      "Masuk kelas sebelum bel berbunyi",
      "Tidak berlari di kelas",
      "Mengikuti upacara dengan tertib"
    ],
    ayoIngat: "Aturan dibuat untuk kebaikan bersama.",
    latihanMini: [
      "Sebutkan 3 aturan di sekolahmu.",
      "Apa akibat jika aturan tidak dipatuhi?"
    ]
  },
  {
    judul: "Bab 2 — Hak dan Kewajiban Anak",
    paragraf:
      "Setiap anak memiliki hak dan kewajiban. Hak adalah sesuatu yang kita terima, "
    + "sedangkan kewajiban adalah sesuatu yang harus kita lakukan.\n\n"
    + "Contoh hak anak adalah mendapatkan kasih sayang, pendidikan, dan bermain. "
    + "Contoh kewajiban anak adalah belajar dengan rajin, mematuhi aturan, "
    + "dan menghormati orang tua serta guru.\n\n"
    + "Hak dan kewajiban harus dilakukan secara seimbang agar hidup tertib dan adil.",
    contoh: [
      "Hak: mendapat pelajaran dari guru",
      "Kewajiban: mengerjakan tugas sekolah",
      "Kewajiban: menjaga kebersihan kelas"
    ],
    ayoIngat: "Hak dan kewajiban harus seimbang.",
    latihanMini: [
      "Sebutkan 1 hakmu di sekolah.",
      "Sebutkan 1 kewajibanmu di rumah."
    ]
  },
  {
    judul: "Bab 3 — Tanggung Jawab Anak",
    paragraf:
      "Tanggung jawab adalah sikap mau melakukan tugas dan kewajiban dengan sungguh-sungguh. "
    + "Setiap anak memiliki tanggung jawab sesuai dengan perannya.\n\n"
    + "Di rumah, anak bertanggung jawab membantu orang tua, menjaga kebersihan, "
    + "dan merapikan barang sendiri. Di sekolah, tanggung jawab ditunjukkan dengan "
    + "belajar rajin dan mengerjakan tugas.\n\n"
    + "Anak yang bertanggung jawab akan dipercaya oleh orang lain dan menjadi pribadi yang mandiri.",
    contoh: [
      "Mengerjakan PR tepat waktu",
      "Menjaga buku agar tidak rusak",
      "Mengembalikan barang pinjaman"
    ],
    ayoIngat: "Tanggung jawab membuat kita dipercaya.",
    latihanMini: [
      "Apa tugasmu di rumah?",
      "Mengapa kita harus bertanggung jawab?"
    ]
  },
  {
    judul: "Bab 4 — Hidup Rukun dan Menghormati Teman",
    paragraf:
      "Di sekolah kita bertemu banyak teman dengan sifat dan kebiasaan yang berbeda. "
    + "Walaupun berbeda, kita harus tetap hidup rukun.\n\n"
    + "Hidup rukun berarti tidak bertengkar, saling menghormati, dan mau bekerja sama. "
    + "Jika ada perbedaan pendapat, sebaiknya dibicarakan dengan baik.\n\n"
    + "Dengan hidup rukun, suasana sekolah menjadi menyenangkan dan nyaman.",
    contoh: [
      "Bermain bersama tanpa bertengkar",
      "Tidak mengejek teman",
      "Saling menolong"
    ],
    ayoIngat: "Hidup rukun membuat semua orang senang.",
    latihanMini: [
      "Bagaimana caramu menghormati teman?",
      "Apa yang harus dilakukan jika berbeda pendapat?"
    ]
  },
  {
    judul: "Bab 5 — Sikap Disiplin dan Jujur",
    paragraf:
      "Disiplin adalah sikap patuh pada aturan dan melakukan sesuatu tepat waktu. "
    + "Jujur adalah berkata dan bertindak sesuai kenyataan.\n\n"
    + "Sikap disiplin dan jujur sangat penting dalam kehidupan sehari-hari. "
    + "Dengan disiplin, kegiatan berjalan tertib. Dengan jujur, kita dipercaya orang lain.\n\n"
    + "Anak yang disiplin dan jujur akan disukai oleh teman dan guru.",
    contoh: [
      "Datang sekolah tepat waktu",
      "Mengakui kesalahan",
      "Tidak menyontek saat ulangan"
    ],
    ayoIngat: "Disiplin dan jujur adalah sikap terpuji.",
    latihanMini: [
      "Sebutkan contoh sikap jujur di sekolah.",
      "Mengapa kita harus disiplin?"
    ]
  }
];

SD_CONTENT.kuis["2"]["Pendidikan Pancasila"] = [
  Q2("Aturan dibuat agar ...",["bebas","tertib","ribut","malas"],1),
  Q2("Contoh aturan di sekolah adalah ...",["datang terlambat","berlari di kelas","datang tepat waktu","berteriak"],2),
  Q2("Tanggung jawab berarti ...",["menghindari tugas","melakukan tugas dengan baik","menyalahkan orang","malas"],1),
  Q2("Jika meminjam barang harus ...",["disimpan","dikembalikan","dibuang","diambil"],1),
  Q2("Hidup rukun berarti ...",["bertengkar","damai","menang sendiri","mengejek"],1),

  Q2("Menghormati teman berarti ...",["mengejek","mendengarkan","memukul","teriak"],1),
  Q2("Datang tepat waktu menunjukkan sikap ...",["disiplin","malas","bohong","curang"],0),
  Q2("Menjaga kebersihan kelas adalah ...",["tidak penting","tanggung jawab bersama","hukuman","tugas guru"],1),
  Q2("Jika berbeda pendapat sebaiknya ...",["bertengkar","musyawarah","mengejek","pergi"],1),
  Q2("Saling menolong termasuk sikap ...",["buruk","baik","jahat","egois"],1),

  Q2("Aturan harus ...",["dilanggar","dipatuhi","dihapus","diabaikan"],1),
  Q2("Mengerjakan PR adalah contoh ...",["kemalasan","tanggung jawab","hukuman","kecurangan"],1),
  Q2("Hidup rukun membuat suasana ...",["tegang","nyaman","menakutkan","ribut"],1),
  Q2("Jika teman jatuh kita ...",["menertawakan","menolong","pergi","diam"],1),
  Q2("Bertengkar dengan teman adalah sikap ...",["baik","buruk","terpuji","hebat"],1),

  Q2("Hak anak di sekolah adalah ...",["dimarahi","belajar","dihukum","dibentak"],1),
  Q2("Kewajiban anak di rumah adalah ...",["bermain terus","membantu orang tua","menyuruh orang","tidur saja"],1),
  Q2("Hak dan kewajiban harus dilakukan secara ...",["terpisah","seimbang","asal","terpaksa"],1),
  Q2("Bersikap jujur berarti ...",["berbohong","berkata apa adanya","menipu","diam saja"],1),
  Q2("Sikap disiplin contohnya ...",["datang terlambat","mematuhi aturan","melanggar aturan","bermain saat belajar"],1),

  Q2("Mengakui kesalahan adalah sikap ...",["curang","jujur","malas","buruk"],1),
  Q2("Jika melakukan kesalahan sebaiknya ...",["menyalahkan orang","minta maaf","berlari","diam saja"],1),
  Q2("Bekerja sama dengan teman termasuk sikap ...",["egois","rukun","sombong","jahat"],1),
  Q2("Sikap jujur membuat kita ...",["tidak dipercaya","dipercaya","dimusuhi","dihindari"],1),
  Q2("Sikap disiplin dan jujur adalah sikap yang ...",["buruk","terpuji","tidak penting","dilarang"],1)
];



// =====================================================
// 📖 BAHASA INDONESIA — KELAS 2
// =====================================================
SD_CONTENT.materi["2"]["Bahasa Indonesia"] = [
  {
    judul: "Bab 1 — Membaca Lancar dan Memahami Bacaan",
    paragraf:
      "Membaca adalah kegiatan penting untuk menambah pengetahuan. "
    + "Di kelas 2, kamu belajar membaca dengan lancar dan memahami isi bacaan.\n\n"
    + "Memahami bacaan berarti mengetahui tokoh, peristiwa, tempat, dan pesan dalam cerita. "
    + "Dengan memahami bacaan, kamu bisa menjawab pertanyaan dengan benar.\n\n"
    + "Agar membaca makin lancar, bacalah dengan intonasi yang tepat dan berhenti sejenak pada tanda baca.",
    contoh: [
      "Membaca cerita pendek",
      "Menjawab pertanyaan: siapa, apa, kapan, di mana",
      "Menceritakan kembali isi bacaan"
    ],
    ayoIngat: "Membaca bukan hanya mengeja, tetapi memahami.",
    latihanMini: [
      "Baca cerita pendek 1 paragraf.",
      "Sebutkan tokoh dan tempat dalam cerita."
    ]
  },
  {
    judul: "Bab 2 — Kalimat Utama dan Informasi Penting",
    paragraf:
      "Setiap paragraf memiliki kalimat utama. Kalimat utama berisi ide pokok dari paragraf. "
    + "Kalimat lainnya berfungsi sebagai penjelas.\n\n"
    + "Kalimat utama sering berada di awal paragraf, tetapi kadang bisa di tengah atau di akhir. "
    + "Dengan menemukan kalimat utama, kita lebih mudah memahami isi bacaan dan menemukan informasi penting.",
    contoh: [
      "Kalimat pertama sebagai ide pokok",
      "Kalimat berikutnya sebagai penjelas",
      "Informasi penting: siapa/apa/di mana/apa yang terjadi"
    ],
    ayoIngat: "Kalimat utama berisi ide pokok paragraf.",
    latihanMini: [
      "Cari kalimat utama pada 1 paragraf.",
      "Sebutkan ide pokoknya dengan 1 kalimat."
    ]
  },
  {
    judul: "Bab 3 — Menulis Cerita Pendek",
    paragraf:
      "Menulis cerita pendek berarti menuliskan pengalaman atau cerita khayalan. "
    + "Cerita memiliki bagian awal, tengah, dan akhir.\n\n"
    + "Awal cerita memperkenalkan tokoh dan tempat. Tengah cerita berisi peristiwa. "
    + "Akhir cerita berisi penyelesaian.\n\n"
    + "Gunakan huruf kapital dan tanda baca dengan benar agar cerita mudah dibaca.",
    contoh: [
      "Cerita tentang bermain bersama teman",
      "Cerita tentang liburan",
      "Cerita tentang membantu orang tua"
    ],
    ayoIngat: "Cerita harus runtut: awal–tengah–akhir.",
    latihanMini: [
      "Tulis 3–5 kalimat cerita tentang pengalamanmu.",
      "Periksa huruf kapital dan tanda titik."
    ]
  },
  {
    judul: "Bab 4 — Kata Baku, Kata Tidak Baku, dan Pilihan Kata Sopan",
    paragraf:
      "Kata baku adalah kata yang benar dan biasa dipakai dalam pelajaran atau tulisan resmi. "
    + "Kata tidak baku adalah kata yang sering dipakai saat bercakap-cakap, tetapi tidak sesuai aturan penulisan.\n\n"
    + "Selain itu, saat berbicara kita perlu memilih kata yang sopan seperti 'tolong', 'maaf', dan 'terima kasih'. "
    + "Kata yang sopan membuat orang lain senang.",
    contoh: [
      "Kata baku: 'praktik' (bukan 'praktek')",
      "Kata baku: 'izin' (bukan 'ijin')",
      "Kata sopan: tolong, maaf, terima kasih"
    ],
    ayoIngat: "Gunakan kata baku saat menulis dan kata sopan saat berbicara.",
    latihanMini: [
      "Buat 1 kalimat memakai kata 'tolong'.",
      "Buat 1 kalimat memakai kata 'maaf'."
    ]
  },
  {
    judul: "Bab 5 — Tanda Baca: Titik, Koma, Tanda Tanya, dan Tanda Seru",
    paragraf:
      "Tanda baca membantu kita membaca dan menulis dengan benar.\n\n"
    + "• Titik (.) dipakai di akhir kalimat berita.\n"
    + "• Koma (,) dipakai untuk jeda sebentar, misalnya saat menyebut daftar.\n"
    + "• Tanda tanya (?) dipakai di akhir kalimat tanya.\n"
    + "• Tanda seru (!) dipakai di akhir kalimat seru.\n\n"
    + "Jika tanda baca tepat, kalimat menjadi jelas dan mudah dipahami.",
    contoh: [
      "Aku pergi ke sekolah.",
      "Ibu membeli apel, roti, dan susu.",
      "Siapa namamu?",
      "Wah, indah sekali!"
    ],
    ayoIngat: "Tanda baca membuat tulisan jelas.",
    latihanMini: [
      "Tambahkan tanda baca yang tepat pada 3 kalimat.",
      "Buat 1 kalimat tanya."
    ]
  },
  {
    judul: "Bab 6 — Menulis Kalimat Efektif: Huruf Kapital, Spasi, dan Ejaan",
    paragraf:
      "Kalimat yang baik harus jelas, rapi, dan mudah dipahami. Gunakan huruf kapital di awal kalimat dan pada nama orang atau tempat.\n\n"
    + "Berikan spasi antar kata agar tidak menempel. Periksa ejaan agar kata tidak salah tulis.\n\n"
    + "Jika kamu menulis dengan rapi, orang lain akan mudah membaca tulisanmu.",
    contoh: [
      "Budi pergi ke pasar.",
      "Siti belajar di rumah.",
      "Hari ini aku bermain bola."
    ],
    ayoIngat: "Huruf kapital + spasi + tanda baca = tulisan rapi.",
    latihanMini: [
      "Perbaiki kalimat: 'aku pergi kesekolah.'",
      "Tulis 2 kalimat rapi tentang kegiatanmu."
    ]
  }
];

SD_CONTENT.kuis["2"]["Bahasa Indonesia"] = [
  Q2("Membaca lancar berarti ...",["terbata","cepat tanpa paham","jelas dan paham","diam"],2),
  Q2("Kalimat utama berisi ...",["hiasan","ide pokok","contoh","penutup"],1),
  Q2("Cerita memiliki bagian ...",["awal–tengah–akhir","akhir saja","awal saja","judul"],0),
  Q2("Tanda tanya digunakan untuk ...",["berita","perintah","pertanyaan","seruan"],2),
  Q2("Kalimat utama biasanya ada di ...",["paragraf","gambar","judul","angka"],0),

  Q2("Menulis cerita harus menggunakan ...",["kata acak","ejaan benar","tanpa spasi","huruf kecil semua"],1),
  Q2("Tanda titik digunakan di ...",["awal","tengah","akhir","judul"],2),
  Q2("Menceritakan kembali berarti ...",["menyalin","mengulang isi","menghapus","menebak"],1),
  Q2("Cerita pendek biasanya berisi ...",["angka","pengalaman","rumus","tabel"],1),
  Q2("Huruf kapital digunakan pada ...",["nama orang","angka","semua kata","tengah kata"],0),

  Q2("Kalimat yang baik harus ...",["jelas","acak","tidak bermakna","terbalik"],0),
  Q2("Tujuan membaca adalah ...",["bingung","memahami","menyalin","menggambar"],1),
  Q2("Paragraf adalah kumpulan ...",["angka","kalimat","huruf","gambar"],1),
  Q2("Kalimat penjelas berfungsi untuk ...",["menjelaskan","menghapus","menghias","mengacak"],0),
  Q2("Cerita harus mudah ...",["dipahami","dibalik","dihapus","dilupakan"],0),

  Q2("Tokoh dalam cerita adalah ...",["orang/hewan dalam cerita","judul cerita","tanda baca","angka"],0),
  Q2("Latar tempat adalah ...",["di mana cerita terjadi","siapa yang bercerita","judul bacaan","jumlah halaman"],0),
  Q2("Kata sopan saat meminta bantuan adalah ...",["cepat!", "tolong", "diam!", "dorong!"],1),
  Q2("Kata sopan saat berbuat salah adalah ...",["maaf", "hebat!", "lari", "diam"],0),
  Q2("Kata sopan setelah dibantu adalah ...",["terima kasih", "marah", "teriak", "menangis"],0),

  Q2("Tanda koma (,) digunakan untuk ...",["berhenti sebentar","mengakhiri pertanyaan","mengakhiri cerita","menghapus"],0),
  Q2("Kalimat tanya yang benar adalah ...",["Kamu pergi ke sekolah.", "Siapa namamu?", "Wah hebat!", "Aku membaca buku."],1),
  Q2("Kalimat seru ditandai dengan ...",["tanda titik", "tanda koma", "tanda seru", "tanda tanya"],2),
  Q2("Kalimat yang benar penulisannya adalah ...",["aku pergi ke Pasar.", "Aku pergi ke pasar.", "Aku pergi kepasar.", "Aku pergi ke pasar,"],1),
  Q2("Kata baku yang benar adalah ...",["ijin","izin","idzin","ijjin"],1)
];



// =====================================================
// ➗ MATEMATIKA — KELAS 2
// =====================================================
SD_CONTENT.materi["2"]["Matematika"] = [
  {
    judul: "Bab 1 — Bilangan Sampai 100 dan Nilai Tempat",
    paragraf:
      "Bilangan digunakan untuk menghitung banyak benda. Di kelas 2, kamu belajar bilangan sampai 100. "
    + "Setiap bilangan terdiri dari nilai tempat puluhan dan satuan.\n\n"
    + "Puluhan menunjukkan banyak kelompok sepuluh, sedangkan satuan menunjukkan sisa bilangan. "
    + "Memahami nilai tempat membantu kita membaca, menulis, dan membandingkan bilangan dengan benar.",
    contoh: [
      "34 = 3 puluhan dan 4 satuan",
      "58 = 5 puluhan dan 8 satuan",
      "90 = 9 puluhan dan 0 satuan"
    ],
    ayoIngat: "Bilangan = puluhan + satuan.",
    latihanMini: [
      "Sebutkan puluhan dari 72.",
      "Sebutkan satuan dari 49."
    ]
  },
  {
    judul: "Bab 2 — Membandingkan dan Mengurutkan Bilangan",
    paragraf:
      "Kita dapat membandingkan bilangan untuk mengetahui mana yang lebih besar, lebih kecil, atau sama. "
    + "Tanda yang digunakan adalah > (lebih besar), < (lebih kecil), dan = (sama dengan).\n\n"
    + "Selain itu, bilangan juga bisa diurutkan dari yang terkecil ke terbesar atau sebaliknya.",
    contoh: [
      "45 > 32",
      "18 < 25",
      "Urutan kecil ke besar: 12, 15, 20"
    ],
    ayoIngat: "Bandingkan bilangan dengan teliti.",
    latihanMini: [
      "Manakah yang lebih besar: 67 atau 76?",
      "Urutkan: 40, 25, 30."
    ]
  },
  {
    judul: "Bab 3 — Penjumlahan Bilangan Sampai 100",
    paragraf:
      "Penjumlahan berarti menambah dua bilangan atau lebih. "
    + "Di kelas 2, kamu belajar penjumlahan sampai 100 dengan cara bersusun atau tanpa bersusun.\n\n"
    + "Hitung puluhan terlebih dahulu, lalu satuan. Jika jumlah satuan lebih dari 10, simpan ke puluhan.",
    contoh: [
      "25 + 15 = 40",
      "34 + 6 = 40",
      "47 + 23 = 70"
    ],
    ayoIngat: "Tambah = jumlah bertambah.",
    latihanMini: [
      "Hitung 28 + 12.",
      "Hitung 45 + 20."
    ]
  },
  {
    judul: "Bab 4 — Pengurangan Bilangan Sampai 100",
    paragraf:
      "Pengurangan berarti mengambil atau mengurangi suatu bilangan. "
    + "Pengurangan bisa dilakukan dengan cara bersusun atau menghitung mundur.\n\n"
    + "Jika bilangan yang dikurangi lebih kecil, hasilnya juga lebih kecil.",
    contoh: [
      "60 - 20 = 40",
      "50 - 23 = 27",
      "90 - 10 = 80"
    ],
    ayoIngat: "Kurang = jumlah berkurang.",
    latihanMini: [
      "Hitung 70 - 30.",
      "Hitung 64 - 4."
    ]
  },
  {
    judul: "Bab 5 — Soal Cerita Penjumlahan dan Pengurangan",
    paragraf:
      "Soal cerita adalah soal yang berkaitan dengan kehidupan sehari-hari. "
    + "Untuk mengerjakannya, baca soal dengan teliti dan tentukan apakah harus menjumlah atau mengurang.\n\n"
    + "Tuliskan kalimat hitung agar jawaban lebih mudah ditemukan.",
    contoh: [
      "Ani punya 20 permen, diberi 5 permen. Jumlah permen Ani = 25",
      "Budi punya 30 pensil, hilang 10. Sisa pensil = 20"
    ],
    ayoIngat: "Baca soal cerita dengan teliti.",
    latihanMini: [
      "Ibu membeli 40 apel dan memberi 10. Berapa sisa apel?",
      "Ada 25 burung, datang 5 burung. Berapa jumlahnya?"
    ]
  }
];

SD_CONTENT.kuis["2"]["Matematika"] = [
  Q2("Nilai puluhan dari 46 adalah ...",["4","6","40","60"],2),
  Q2("Nilai satuan dari 82 adalah ...",["8","2","20","80"],1),
  Q2("Bilangan terbesar adalah ...",["54","45","49","50"],0),
  Q2("70 terdiri dari ... puluhan",["5","6","7","8"],2),
  Q2("Bilangan setelah 79 adalah ...",["78","80","81","82"],1),

  Q2("25 + 15 = ...",["30","35","40","45"],2),
  Q2("34 + 6 = ...",["38","39","40","41"],2),
  Q2("45 + 10 = ...",["45","50","55","60"],2),
  Q2("20 + 30 = ...",["40","50","60","70"],1),
  Q2("55 + 5 = ...",["55","60","65","70"],1),

  Q2("60 - 20 = ...",["20","30","40","50"],2),
  Q2("100 - 50 = ...",["25","40","50","60"],2),
  Q2("90 - 40 = ...",["40","45","50","55"],2),
  Q2("30 - 10 = ...",["10","15","20","25"],2),
  Q2("70 - 30 = ...",["30","40","50","60"],1),

  Q2("Nilai satuan dari 67 adalah ...",["6","7","60","70"],1),
  Q2("Nilai puluhan dari 93 adalah ...",["9","3","30","90"],3),
  Q2("Urutan dari kecil ke besar adalah ...",["40,30,20","20,30,40","30,20,40","40,20,30"],1),
  Q2("Manakah yang lebih besar?",["45","54","44","43"],1),
  Q2("Bilangan sebelum 60 adalah ...",["58","59","60","61"],1),

  Q2("Ani punya 20 apel, diberi 5 apel. Jumlah apel Ani ...",["20","23","25","30"],2),
  Q2("Budi memiliki 40 kelereng, hilang 10. Sisa kelereng ...",["20","25","30","35"],2),
  Q2("35 + 15 = ...",["40","45","50","55"],2),
  Q2("80 - 20 = ...",["40","50","60","70"],2),
  Q2("Bilangan 48 terdiri dari ...",["4 puluhan dan 8 satuan","8 puluhan dan 4 satuan","48 puluhan","48 satuan"],0)
];



// =====================================================
// 🏃 PJOK — KELAS 2
// =====================================================
SD_CONTENT.materi["2"]["PJOK"] = [
  {
    judul: "Bab 1 — Gerak Lokomotor dan Non-Lokomotor",
    paragraf:
      "Gerak lokomotor adalah gerak berpindah tempat, seperti berjalan, berlari, melompat, dan meloncat. "
    + "Gerak non-lokomotor adalah gerak yang dilakukan di tempat tanpa berpindah, seperti menekuk, memutar, dan mengayun.\n\n"
    + "Gerak lokomotor melatih kekuatan kaki dan daya tahan tubuh. "
    + "Gerak non-lokomotor melatih kelenturan dan keseimbangan.\n\n"
    + "Kedua jenis gerak ini penting agar tubuh sehat dan siap melakukan aktivitas sehari-hari.",
    contoh: [
      "Berlari (lokomotor)",
      "Melompat ke depan (lokomotor)",
      "Memutar tangan (non-lokomotor)",
      "Mengayun kaki (non-lokomotor)"
    ],
    ayoIngat: "Gerak berpindah = lokomotor, gerak di tempat = non-lokomotor.",
    latihanMini: [
      "Sebutkan 2 contoh gerak lokomotor.",
      "Sebutkan 2 contoh gerak non-lokomotor."
    ]
  },
  {
    judul: "Bab 2 — Pemanasan dan Pendinginan",
    paragraf:
      "Sebelum berolahraga, kita harus melakukan pemanasan. Pemanasan bertujuan untuk "
    + "menyiapkan otot dan sendi agar tidak cedera.\n\n"
    + "Pemanasan dapat dilakukan dengan gerakan ringan seperti menggerakkan kepala, "
    + "bahu, tangan, pinggang, dan kaki.\n\n"
    + "Setelah berolahraga, kita perlu melakukan pendinginan. Pendinginan membantu "
    + "menormalkan kembali pernapasan dan denyut jantung.",
    contoh: [
      "Pemanasan: memutar bahu",
      "Pemanasan: mengayun tangan",
      "Pendinginan: berjalan pelan",
      "Pendinginan: menarik napas dalam"
    ],
    ayoIngat: "Pemanasan sebelum, pendinginan setelah olahraga.",
    latihanMini: [
      "Lakukan pemanasan sederhana.",
      "Lakukan pendinginan setelah bergerak."
    ]
  },
  {
    judul: "Bab 3 — Kebugaran Jasmani dan Hidup Sehat",
    paragraf:
      "Kebugaran jasmani adalah kemampuan tubuh untuk melakukan aktivitas tanpa cepat lelah. "
    + "Kebugaran dapat dijaga dengan olahraga teratur.\n\n"
    + "Selain olahraga, hidup sehat juga perlu menjaga kebersihan, makan makanan bergizi, "
    + "minum air putih, dan istirahat yang cukup.\n\n"
    + "Jika tubuh sehat dan bugar, belajar dan bermain menjadi lebih menyenangkan.",
    contoh: [
      "Olahraga secara teratur",
      "Makan sayur dan buah",
      "Minum air putih",
      "Tidur cukup"
    ],
    ayoIngat: "Tubuh sehat berasal dari olahraga dan kebiasaan baik.",
    latihanMini: [
      "Sebutkan 2 kebiasaan hidup sehat.",
      "Mengapa kita perlu olahraga?"
    ]
  },
  {
    judul: "Bab 4 — Keselamatan dan Sportivitas Saat Olahraga",
    paragraf:
      "Saat berolahraga, keselamatan harus diutamakan. Gunakan pakaian dan sepatu yang sesuai "
    + "agar tidak mudah cedera.\n\n"
    + "Selain itu, kita harus bersikap sportif. Sportif berarti jujur, adil, dan menerima "
    + "hasil permainan dengan lapang dada.\n\n"
    + "Bersikap sportif membuat permainan menjadi menyenangkan dan aman.",
    contoh: [
      "Memakai sepatu olahraga",
      "Tidak mendorong teman",
      "Menerima kekalahan dengan baik"
    ],
    ayoIngat: "Olahraga aman dan jujur itu penting.",
    latihanMini: [
      "Sebutkan contoh sikap sportif.",
      "Apa yang harus dilakukan jika teman jatuh?"
    ]
  }
];

SD_CONTENT.kuis["2"]["PJOK"] = [
  Q2("Gerak berpindah tempat disebut ...",["non-lokomotor","lokomotor","diam","istirahat"],1),
  Q2("Contoh non-lokomotor adalah ...",["berlari","melompat","memutar badan","berjalan"],2),
  Q2("Olahraga membuat tubuh ...",["lemah","sehat","sakit","malas"],1),
  Q2("Pemanasan dilakukan untuk ...",["cedera","mencegah cedera","mengganggu","menakutkan"],1),
  Q2("Gerak melompat termasuk ...",["diam","lokomotor","non-lokomotor","tidur"],1),

  Q2("Saat olahraga sebaiknya ...",["curang","sportif","marah","mengejek"],1),
  Q2("Pendinginan dilakukan ...",["sebelum","setelah","saat tidur","saat makan"],1),
  Q2("Gerak mengayun termasuk ...",["lokomotor","non-lokomotor","lari","lompat"],1),
  Q2("Sepatu olahraga berfungsi untuk ...",["gaya","melindungi kaki","basah","kotor"],1),
  Q2("Jika teman jatuh kita ...",["menertawakan","menolong","mendorong","diam"],1),

  Q2("Berjalan termasuk gerak ...",["lokomotor","non-lokomotor","diam","tidur"],0),
  Q2("Sikap sportif berarti ...",["curang","jujur","menang sendiri","mengejek"],1),
  Q2("Minum setelah olahraga untuk ...",["dehidrasi","menyegarkan","sakit","pusing"],1),
  Q2("Olahraga sebaiknya dilakukan ...",["teratur","jarang","tidak perlu","sekali"],0),
  Q2("Gerak memutar kepala termasuk ...",["lokomotor","non-lokomotor","lari","lompat"],1),

  Q2("Pemanasan termasuk gerak ...",["berat","ringan","bahaya","diam"],1),
  Q2("Pendinginan bertujuan agar tubuh ...",["kaget","kembali normal","lemas","sakit"],1),
  Q2("Kebugaran jasmani membuat tubuh ...",["cepat lelah","kuat dan segar","sakit","malas"],1),
  Q2("Makan makanan bergizi termasuk ...",["hidup sehat","cedera","bermain","istirahat"],0),
  Q2("Tidur cukup membuat badan ...",["lelah","segar","sakit","pusing"],1),

  Q2("Saat bermain kita tidak boleh ...",["jujur","curang","sportif","tertib"],1),
  Q2("Gerak lari kecil melatih ...",["kekuatan kaki","pendengaran","penglihatan","tangan"],0),
  Q2("Mengayun tangan berguna untuk melatih ...",["kelenturan","kemalasan","ketakutan","emosi"],0),
  Q2("Jika kalah bermain, sebaiknya ...",["marah","menerima dengan baik","menangis keras","mengejek"],1),
  Q2("Olahraga bersama teman harus dilakukan dengan ...",["aman dan tertib","ribut","curang","sembarangan"],0)
];



// =====================================================
// 🎨 SENI DAN BUDAYA — KELAS 2
// =====================================================
SD_CONTENT.materi["2"]["Seni dan Budaya"] = [
  {
    judul: "Bab 1 — Menggambar Bentuk di Sekitar",
    paragraf:
      "Menggambar adalah kegiatan seni yang menyenangkan dan melatih kreativitas. "
    + "Di kelas 2, kamu belajar menggambar benda-benda di sekitar seperti meja, kursi, pohon, rumah, dan hewan.\n\n"
    + "Menggambar dimulai dari bentuk dasar seperti garis, lingkaran, segitiga, dan persegi panjang. "
    + "Setelah itu, gambar diberi detail dan warna agar terlihat lebih jelas dan indah.\n\n"
    + "Menggambar dengan rapi membutuhkan kesabaran dan ketelitian.",
    contoh: [
      "Gambar meja dari persegi panjang",
      "Gambar rumah dari persegi dan segitiga",
      "Gambar pohon dari garis dan lingkaran"
    ],
    ayoIngat: "Gambar dimulai dari bentuk dasar.",
    latihanMini: [
      "Gambar satu benda di kelas.",
      "Warnai gambar dengan rapi."
    ]
  },
  {
    judul: "Bab 2 — Mewarnai dan Mengenal Warna",
    paragraf:
      "Mewarnai adalah bagian penting dari seni menggambar. Warna membuat gambar menjadi hidup dan menarik.\n\n"
    + "Ada warna dasar seperti merah, kuning, dan biru. Warna-warna ini dapat dicampur "
    + "menjadi warna lain, misalnya biru dan kuning menjadi hijau.\n\n"
    + "Saat mewarnai, usahakan tidak keluar garis dan memilih warna yang sesuai dengan gambar.",
    contoh: [
      "Langit berwarna biru",
      "Daun berwarna hijau",
      "Matahari berwarna kuning"
    ],
    ayoIngat: "Warna membuat gambar lebih indah.",
    latihanMini: [
      "Warnai gambar pohon.",
      "Sebutkan 3 warna dasar."
    ]
  },
  {
    judul: "Bab 3 — Bernyanyi Lagu Anak dengan Irama",
    paragraf:
      "Bernyanyi adalah bagian dari seni musik. Saat bernyanyi, kita mengikuti irama dan nada lagu.\n\n"
    + "Irama adalah ketukan lagu. Kita bisa menepuk tangan atau menggerakkan badan untuk mengikuti irama.\n\n"
    + "Bernyanyi melatih kepercayaan diri dan keberanian tampil di depan teman.",
    contoh: [
      "Bernyanyi lagu anak-anak",
      "Menepuk tangan mengikuti irama"
    ],
    ayoIngat: "Bernyanyi mengikuti irama.",
    latihanMini: [
      "Nyanyikan satu lagu anak.",
      "Tepuk tangan mengikuti lagu."
    ]
  },
  {
    judul: "Bab 4 — Gerak Tari Sederhana",
    paragraf:
      "Tari adalah seni gerak tubuh yang mengikuti irama musik. Di kelas 2, kamu belajar "
    + "gerak tari sederhana seperti mengayun tangan, melangkah ke kanan dan kiri, serta meloncat kecil.\n\n"
    + "Menari melatih kelenturan tubuh, keseimbangan, dan rasa percaya diri.",
    contoh: [
      "Mengayun tangan mengikuti musik",
      "Melangkah ke kanan dan kiri"
    ],
    ayoIngat: "Gerak tari mengikuti irama musik.",
    latihanMini: [
      "Ikuti gerak guru.",
      "Lakukan gerak tari sederhana."
    ]
  },
  {
    judul: "Bab 5 — Menghargai Karya Seni",
    paragraf:
      "Menghargai karya seni berarti menghormati hasil karya sendiri dan orang lain.\n\n"
    + "Jika melihat karya teman, berilah pujian yang baik dan sopan. "
    + "Jangan merusak atau mengejek karya teman.\n\n"
    + "Sikap menghargai membuat suasana belajar seni menjadi menyenangkan.",
    contoh: [
      "Memberi pujian pada gambar teman",
      "Tidak mencoret karya teman"
    ],
    ayoIngat: "Menghargai karya seni adalah sikap terpuji.",
    latihanMini: [
      "Sebutkan contoh pujian untuk karya teman.",
      "Apa yang tidak boleh dilakukan pada karya teman?"
    ]
  }
];

SD_CONTENT.kuis["2"]["Seni dan Budaya"] = [
  Q2("Menggambar dimulai dari ...",["warna","bentuk dasar","angka","huruf"],1),
  Q2("Mewarnai rapi berarti ...",["keluar garis","tidak keluar garis","acak","kotor"],1),
  Q2("Seni melatih ...",["kreativitas","kemalasan","kecurangan","ketakutan"],0),
  Q2("Saat melihat karya teman kita ...",["menghina","menghargai","merusak","mencoret"],1),
  Q2("Alat menggambar yang benar ...",["pensil","oli","pasir","batu"],0),

  Q2("Warna membuat gambar ...",["indah","rusak","hilang","tak terlihat"],0),
  Q2("Gambar meja berbentuk ...",["lingkaran","persegi panjang","segitiga","oval"],1),
  Q2("Memberi pujian pada karya teman adalah sikap ...",["baik","buruk","jahat","egois"],0),
  Q2("Menggambar melatih ...",["imajinasi","marah","takut","curang"],0),
  Q2("Karya seni adalah hasil ...",["kreativitas","angka","rumus","tabel"],0),

  Q2("Seni budaya mengajarkan ...",["menghargai","merusak","mengejek","berkelahi"],0),
  Q2("Gambar rapi terlihat ...",["indah","kotor","rusak","acak"],0),
  Q2("Saat menggambar sebaiknya ...",["pelan","asal cepat","terburu","tidak selesai"],0),
  Q2("Warna hijau cocok untuk ...",["daun","api","langit","air"],0),
  Q2("Seni membuat kita lebih ...",["kreatif","malas","marah","takut"],0),

  Q2("Warna dasar adalah ...",["merah, kuning, biru","hijau, ungu, cokelat","hitam, putih, abu","emas, perak"],0),
  Q2("Biru dan kuning jika dicampur menjadi ...",["ungu","hijau","merah","hitam"],1),
  Q2("Irama dalam lagu berarti ...",["ketukan","gambar","warna","bentuk"],0),
  Q2("Bernyanyi melatih ...",["percaya diri","ketakutan","kemarahan","kemalasan"],0),
  Q2("Menepuk tangan saat bernyanyi untuk mengikuti ...",["irama","warna","gambar","huruf"],0),

  Q2("Gerak tari dilakukan mengikuti ...",["musik","gambar","angka","huruf"],0),
  Q2("Contoh gerak tari sederhana adalah ...",["mengayun tangan","tidur","duduk diam","berbaring"],0),
  Q2("Jika karya teman bagus kita sebaiknya ...",["memuji","mengejek","merusak","mencoret"],0),
  Q2("Menghargai karya teman membuat suasana ...",["menyenangkan","ribut","tegang","marah"],0),
  Q2("Seni dan budaya membantu kita menjadi ...",["kreatif dan percaya diri","malas","takut","egois"],0)
];



// =====================================================
// 🗣️ BAHASA JAWA — KELAS 2
// =====================================================
SD_CONTENT.materi["2"]["Bahasa Jawa"] = [
  {
    judul: "Bab 1 — Kosakata Lingkungan Sekitar",
    paragraf:
      "Bahasa Jawa adalah bahasa daerah yang digunakan dalam kehidupan sehari-hari, terutama di lingkungan rumah dan sekolah. "
    + "Di kelas 2, kamu belajar kosakata (tembung) yang berkaitan dengan lingkungan sekitar agar dapat berkomunikasi dengan baik.\n\n"
    + "Dengan memahami arti tembung, kamu bisa berbicara lebih lancar, sopan, dan memahami percakapan sederhana dalam Bahasa Jawa.",
    contoh: [
      "kanca = teman",
      "omah = rumah",
      "mlaku = berjalan",
      "sekolah = sekolah",
      "guru = guru"
    ],
    ayoIngat: "Tembung yaiku kata ing Bahasa Jawa.",
    latihanMini: [
      "Sebutkan arti 'kanca'.",
      "Buat 1 kalimat sederhana memakai Bahasa Jawa."
    ]
  },
  {
    judul: "Bab 2 — Unggah-Ungguh dan Bicara Sopan",
    paragraf:
      "Unggah-ungguh berarti tata krama atau sopan santun dalam berbicara. "
    + "Dalam Bahasa Jawa, cara berbicara harus disesuaikan dengan lawan bicara.\n\n"
    + "Saat berbicara dengan teman sebaya, kita bisa menggunakan bahasa ngoko. "
    + "Saat berbicara dengan guru, orang tua, atau orang yang lebih tua, kita harus berbicara dengan sopan dan lembut.\n\n"
    + "Berbicara sopan membuat hubungan menjadi rukun dan menyenangkan.",
    contoh: [
      "Mengucap 'monggo' (silakan)",
      "Menyapa guru dengan suara lembut",
      "Tidak membentak saat berbicara"
    ],
    ayoIngat: "Unggah-ungguh penting supaya hubungan rukun.",
    latihanMini: [
      "Sebutkan 1 contoh bicara sopan.",
      "Mengapa kita harus berbicara sopan?"
    ]
  },
  {
    judul: "Bab 3 — Kata Sapaan dalam Bahasa Jawa",
    paragraf:
      "Kata sapaan digunakan untuk memanggil atau menyebut orang lain dengan sopan. "
    + "Kata sapaan berbeda-beda sesuai dengan siapa yang kita ajak bicara.\n\n"
    + "Menggunakan kata sapaan yang tepat menunjukkan rasa hormat dan unggah-ungguh yang baik.",
    contoh: [
      "Bapak = Ayah",
      "Ibu = Ibu",
      "Pak Guru = Guru laki-laki",
      "Bu Guru = Guru perempuan"
    ],
    ayoIngat: "Gunakan kata sapaan agar bicara sopan.",
    latihanMini: [
      "Sebutkan sapaan untuk guru.",
      "Sebutkan sapaan untuk orang tua."
    ]
  },
  {
    judul: "Bab 4 — Mendengarkan dan Menirukan Ucapan",
    paragraf:
      "Belajar Bahasa Jawa juga melatih kemampuan mendengarkan. "
    + "Saat guru atau teman berbicara, kita harus mendengarkan dengan baik.\n\n"
    + "Setelah mendengarkan, kita bisa menirukan ucapan dengan lafal yang benar. "
    + "Hal ini membantu kita belajar berbicara dengan percaya diri.",
    contoh: [
      "Mendengarkan guru berbicara",
      "Menirukan ucapan dengan pelan"
    ],
    ayoIngat: "Dengarkan dulu, lalu berbicara.",
    latihanMini: [
      "Dengarkan ucapan guru.",
      "Tirukan dengan benar."
    ]
  },
  {
    judul: "Bab 5 — Cerita Pendek dan Pesan Baik",
    paragraf:
      "Cerita dalam Bahasa Jawa sering mengandung pesan baik, seperti rajin, jujur, dan suka menolong. "
    + "Cerita dapat didengar atau dibaca bersama.\n\n"
    + "Setelah mendengar cerita, kita bisa menyebutkan tokoh dan pesan baik yang ada di dalam cerita.",
    contoh: [
      "Pesan cerita: jangan malas",
      "Pesan cerita: hormat kepada orang tua"
    ],
    ayoIngat: "Cerita mengajarkan pesan kebaikan.",
    latihanMini: [
      "Sebutkan pesan baik dari cerita.",
      "Ceritakan kembali secara singkat."
    ]
  }
];

SD_CONTENT.kuis["2"]["Bahasa Jawa"] = [
  Q2("Tembung 'kanca' artinya ...",["rumah","teman","air","jalan"],1),
  Q2("Tembung 'omah' artinya ...",["pasar","rumah","sekolah","jalan"],1),
  Q2("Tembung 'mlaku' artinya ...",["tidur","makan","berjalan","minum"],2),
  Q2("Bahasa Jawa digunakan untuk ...",["menjaga budaya","bertengkar","menghina","menipu"],0),
  Q2("Kata dalam Bahasa Jawa disebut ...",["angka","tembung","warna","gambar"],1),

  Q2("Unggah-ungguh berarti ...",["sopan santun","permainan","warna","angka"],0),
  Q2("Ngoko biasanya digunakan untuk ...",["teman","guru","orang tua","kepala sekolah"],0),
  Q2("Berbicara dengan guru harus ...",["kasar","sopan","teriak","mengejek"],1),
  Q2("Berbicara sopan membuat orang lain ...",["marah","senang","takut","sedih"],1),
  Q2("Contoh sikap sopan adalah ...",["berkata lembut","membentak","mengejek","memukul"],0),

  Q2("Bahasa daerah harus kita ...",["lestarikan","lupakan","hindari","hapus"],0),
  Q2("Kosakata membantu kita ...",["lancar berbicara","bingung","marah","diam"],0),
  Q2("Bahasa Jawa termasuk ...",["budaya","olahraga","sains","matematika"],0),
  Q2("Belajar Bahasa Jawa berarti menjaga ...",["budaya","kemalasan","ketakutan","kecurangan"],0),
  Q2("Jika teman bicara kita ...",["memotong","mendengarkan","mengejek","pergi"],1),

  Q2("Kata sapaan untuk guru perempuan adalah ...",["Bu Guru","Pak Guru","Mbak","Mas"],0),
  Q2("Kata sapaan untuk ayah adalah ...",["Bapak","Ibu","Kanca","Guru"],0),
  Q2("Saat mendengarkan cerita sebaiknya ...",["fokus","ribut","berjalan","bermain"],0),
  Q2("Setelah mendengar cerita kita bisa ...",["menceritakan kembali","mengejek","melupakan","merusak buku"],0),
  Q2("Pesan cerita biasanya berisi ...",["kebaikan","kecurangan","kemarahan","ketakutan"],0),

  Q2("Mengucap 'monggo' berarti ...",["silakan","marah","pergi","tidur"],0),
  Q2("Berbicara lembut menunjukkan sikap ...",["sopan","kasar","jahat","egois"],0),
  Q2("Bahasa Jawa dipakai di lingkungan ...",["rumah dan sekolah","laut","gunung","luar negeri"],0),
  Q2("Jika ingin berbicara sebaiknya ...",["menunggu giliran","memotong","berteriak","lari"],0),
  Q2("Berbicara sopan membuat suasana menjadi ...",["rukun","ribut","tegang","marah"],0)
];

