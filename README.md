# Smart Quiz Challenge

**Think. Choose. Level Up!**

Permainan kuis edukasi coding untuk anak SD (sekitar usia 8–12 tahun). Proyek ini memperkenalkan konsep dasar Scratch dan computational thinking melalui 20 tantangan interaktif.

## Fitur

- Form identitas pemain dengan validasi nama lengkap (minimal dua kata).
- 20 pertanyaan bertingkat tentang sequencing, Scratch blocks, events, motion, looks, loops, conditions, sprites, stage, costumes, sound, variables, coordinates, debugging, messages, operators, dan control.
- Empat pilihan jawaban untuk setiap pertanyaan.
- Umpan balik, petunjuk setelah jawaban salah, dan penjelasan setelah jawaban benar.
- Skor 100 poin untuk setiap jawaban benar.
- Bonus streak 25 poin setiap tiga jawaban benar berturut-turut.
- Peta level, progress bar, skor, jumlah jawaban benar, dan hasil akhir.
- Navigasi responsif, menu mobile, footer, copyright tahun otomatis, serta favicon SVG.
- Ilustrasi SVG di `assets/images/` (logo, favicon, maskot, ilustrasi form pemain, piala, dan ikon konsep).
- Efek hover, transisi, animasi, scroll reveal, dan dukungan `prefers-reduced-motion`.

## Aturan skor

- Jawaban benar: **+100 poin**.
- Setiap tiga jawaban benar berturut-turut: **bonus +25 poin**.
- Jawaban salah tidak mengurangi skor, tetapi memutus streak.
- Maksimum jika seluruh jawaban benar tanpa memutus streak: **2.150 poin**.

## Identitas dan privasi sesi

Nama pemain hanya dipakai selama halaman terbuka. Aplikasi tidak menggunakan database, API, `localStorage`, maupun `sessionStorage`. Refresh halaman akan menghapus nama, level, dan skor sesi, lalu mengembalikan aplikasi ke form nama.

## Struktur folder

```text
smart-quiz-challenge-v1/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    └── images/
        ├── favicon.svg
        ├── logo.svg
        ├── quiz-mascot.svg
        ├── quiz-welcome.svg
        ├── quiz-trophy.svg
        ├── icon-sequence.svg
        ├── icon-events.svg
        ├── icon-loops.svg
        └── icon-conditions.svg
```

## Menjalankan secara lokal

1. Ekstrak folder proyek.
2. Buka folder di Visual Studio Code.
3. Jalankan `index.html` melalui Live Server atau buka langsung melalui browser.
4. Masukkan nama lengkap (minimal dua kata), lalu tekan **Mulai Tantangan**.
5. Jawab soal satu per satu hingga level 20.

Tidak diperlukan build tools, framework, database, atau API. Font Google digunakan sebagai peningkatan visual; jika tidak tersedia, aplikasi tetap menggunakan fallback font sistem.

## Copyright

`Smart Quiz Challenge © [tahun berjalan] | Arjun Yuda Firwanda. All rights reserved.`
