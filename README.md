# Smart Quiz Challenge

**Think. Choose. Level Up!**

## Update v2.2

Setelah nama dan usia dimasukkan, pemain selalu diarahkan ke halaman pilihan materi. Aplikasi tidak lagi otomatis membuka materi terakhir. Riwayat setiap materi tetap tersimpan dan dipulihkan setelah pemain memilih kartu materi terkait.

## Update v2.1

Versi ini menambahkan penyimpanan otomatis profil pemain dan progres per materi. Saat pemain kembali menggunakan nama yang sama, aplikasi akan melanjutkan materi terakhir yang sedang dikerjakan. Materi lain juga memiliki sesi terpisah. Persentase progres hanya menghitung soal yang sudah diselesaikan, dan ukuran huruf utama pada area kuis diperbesar agar lebih mudah dibaca.

**Catatan migrasi:** versi 2.0 belum menyimpan progres ke browser. Karena itu, riwayat sesi yang dikerjakan di versi 2.0 tidak dapat dipulihkan secara otomatis. Penyimpanan otomatis berlaku mulai versi 2.1.

Smart Quiz Challenge adalah media kuis interaktif untuk pembelajaran Informatika siswa SD kelas 1–6. Pemain mengisi nama dan usia, sistem menentukan kelas secara otomatis, lalu pemain memilih materi dan mengerjakan kuis sesuai jenjang.

## Alur permainan

1. Masukkan nama lengkap (minimal dua kata).
2. Masukkan usia antara 6 sampai 12 tahun. Usia dapat dimasukkan dengan satu angka desimal untuk membedakan rentang usia.
3. Sistem menentukan kelas secara otomatis:
   - 6 sampai kurang dari 7 tahun: Kelas 1 SD.
   - 7 sampai kurang dari 8 tahun: Kelas 2 SD.
   - 8 sampai kurang dari 9 tahun: Kelas 3 SD.
   - 9 sampai kurang dari 10 tahun: Kelas 4 SD.
   - 10 sampai kurang dari 11 tahun: Kelas 5 SD.
   - 11 sampai 12 tahun: Kelas 6 SD.
4. Pilih salah satu materi yang tersedia untuk kelas tersebut.
5. Jawab soal pilihan ganda. Setiap soal memiliki maksimal tiga kesempatan.
6. Setelah semua soal selesai, hasil menampilkan skor, jumlah jawaban benar, dan akurasi.
7. Pemain dapat mengulang materi, memilih materi lain, atau mengganti pemain.

## Kurikulum dan jumlah soal

| Kelas | Materi                                                                                                                                      | Soal per materi |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------: |
| 1 SD  | Mengenal TIK; Bagian-Bagian Komputer; Cara Menggunakan Komputer dan Ergonomi; Praktik Dasar Aplikasi                                        |               5 |
| 2 SD  | Berpikir Komputasional; TIK; Algoritma dan Pemrograman Dasar; Praktik Aplikasi Sederhana                                                    |              10 |
| 3 SD  | Pengenalan Komputer dan Hardware; Menggambar dan Desain Dasar; Pengenalan Mengetik; Analisis Data Sederhana; Aplikasi Pendukung dan Animasi |              15 |
| 4 SD  | Berpikir Komputasional; TIK; Penggunaan Aplikasi Perangkat Lunak                                                                            |              20 |
| 5 SD  | Perangkat Keras dan Perangkat Lunak; Internet dan Jaringan; Aplikasi Perkantoran; Berpikir Komputasional                                    |              25 |
| 6 SD  | Berpikir Komputasional; TIK; Jaringan Komputer dan Internet                                                                                 |              30 |

Dalam satu putaran lengkap yang mengerjakan seluruh materi pada enam jenjang, pemain akan mengerjakan **385 soal** (20 + 40 + 75 + 60 + 100 + 90). Setiap materi memiliki kumpulan konsep yang menghasilkan variasi soal tentang pengertian/fungsi, contoh penerapan, dan pernyataan yang tepat. Sistem mengacak soal serta pilihan jawaban, tetapi selalu menyajikan jumlah soal sesuai tabel.

### Catatan pemetaan usia

Rentang usia dibuat tidak tumpang tindih agar satu usia hanya menghasilkan satu jenjang. Contoh: usia 7,0 tahun masuk Kelas 2 SD; usia 8,0 tahun masuk Kelas 3 SD; usia 11–12 tahun masuk Kelas 6 SD.

## Aturan pengerjaan dan skor

- Jawaban benar pada kesempatan pertama: **100 poin**.
- Jawaban benar pada kesempatan kedua: **70 poin**.
- Jawaban benar pada kesempatan ketiga: **40 poin**.
- Setiap tiga jawaban benar beruntun yang semuanya benar pada kesempatan pertama mendapat **bonus 25 poin**.
- Jawaban salah memberi petunjuk dan mengurangi streak.
- Setelah tiga jawaban salah pada satu soal, jawaban benar dan penjelasannya ditampilkan. Pemain dapat melanjutkan ke soal berikutnya tanpa poin untuk soal tersebut.
- Skor dan jumlah benar dihitung untuk sesi materi yang sedang dimainkan.

## Perbaikan tampilan mobile

Aturan `.answer-feedback[hidden]` sekarang berlaku secara global sehingga pesan umpan balik tidak tetap terlihat ketika soal baru ditampilkan. JavaScript juga membersihkan judul, isi, dan status feedback setiap kali merender soal baru. Area feedback pada layar sempit dapat membungkus teks panjang tanpa mendorong layout keluar layar.

## Penyimpanan profil dan riwayat pengerjaan

Aplikasi menyimpan profil pemain dan progres setiap materi menggunakan `localStorage` pada browser/perangkat yang digunakan. Identitas pemain dibuat dari nama lengkap yang dinormalisasi (tidak membedakan huruf besar-kecil). Setiap pemain memiliki data kelas, daftar materi, bank soal yang sudah diacak, nomor soal terakhir, jawaban yang sudah dicoba, status feedback, skor, streak, dan bonus masing-masing.

- Saat pemain berganti, sesi aktif disimpan otomatis. Ketika nama pemain yang sama dimasukkan kembali, aplikasi menampilkan daftar pilihan materi terlebih dahulu. Pemain memilih materi yang ingin dilanjutkan; aplikasi kemudian memulihkan nomor soal dan sesi terakhir pada materi tersebut.
- Setiap materi memiliki sesi tersendiri. Berpindah materi tidak menghapus atau mengulang progres materi sebelumnya. Saat materi dibuka kembali, sesi terakhirnya dilanjutkan.
- Progres disimpan setelah setiap jawaban, saat berpindah soal, saat berpindah materi/pemain, serta ketika halaman disembunyikan atau ditutup.
- Tombol **Main Lagi** memulai sesi baru untuk materi yang sudah selesai. Ringkasan hasil sebelumnya disimpan dalam riwayat internal profil lokal.
- Data hanya tersimpan pada browser dan perangkat yang sama. Data tidak dikirim ke server dan tidak otomatis tersinkron ke perangkat lain. Menghapus data situs/browser dapat menghapus seluruh riwayat pemain.

## Progress soal

Persentase menunjukkan jumlah soal yang sudah diselesaikan, bukan nomor soal yang sedang dibuka. Pada soal pertama, progres tetap `0%` sampai soal dijawab benar atau kesempatan menjawabnya habis. Setelah soal pertama selesai dan pemain berpindah ke soal kedua, progres akan bertambah sesuai jumlah soal yang telah diselesaikan.

## Struktur folder

```text
App_Smart_Quizz_Challenge/
├── index.html
├── style.css
├── script.js
├── question-bank.js
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
2. Buka folder proyek di Visual Studio Code.
3. Jalankan `index.html` melalui Live Server atau buka langsung melalui browser.
4. Pastikan `question-bank.js` dan `script.js` berada sejajar dengan `index.html`.
5. Masukkan nama dan usia, pilih materi, lalu mulai kuis.

Tidak diperlukan build tools, framework, database, atau API. Google Fonts digunakan untuk peningkatan tampilan; jika tidak tersedia, aplikasi tetap memakai font fallback.

## Copyright

`Smart Quiz Challenge © [tahun berjalan] | Arjun Yuda Firwanda. All rights reserved.`
