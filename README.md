# Live Typing Display

Aplikasi web dua perangkat: satu perangkat mengetik, perangkat lain menampilkan teks secara langsung melalui Firebase Realtime Database.

## 1. Buat proyek Firebase
1. Buka https://console.firebase.google.com/ lalu pilih **Add project**.
2. Beri nama proyek, misalnya `live-typing-display`.
3. Di menu **Build > Realtime Database**, buat database. Pilih lokasi yang dekat dengan pengguna, misalnya Singapore jika tersedia.
4. Salin URL database yang diberikan Firebase.
5. Di **Project settings > General > Your apps**, tambahkan aplikasi Web (`</>`), lalu salin konfigurasi Firebase.

## 2. Aktifkan login anonim
1. Buka **Build > Authentication > Get started**.
2. Pilih **Sign-in method**.
3. Aktifkan **Anonymous**, lalu simpan.

## 3. Pasang konfigurasi
Buka `js/firebase.js`, lalu ganti semua nilai `GANTI_...` dengan konfigurasi dari Firebase. Pastikan `databaseURL` sama persis dengan URL Realtime Database Anda. Contoh format bisa berupa:
- `https://NAMA-DB.REGION.firebasedatabase.app`
- atau `https://NAMA-DB.firebaseio.com`

Jangan menambahkan tanda kutip ganda di dalam nilai string.

## 4. Pasang Security Rules
Di Firebase Console > Realtime Database > Rules, ganti aturan dengan isi file `database.rules.json`, lalu klik **Publish**.

Aturan ini mengharuskan pengguna login anonim. Namun, siapa pun yang mengetahui Room ID 6 angka dapat membaca dan menulis room tersebut. Room ID bukan pengganti password. Jangan gunakan untuk data rahasia. Untuk penggunaan publik yang lebih aman, tambahkan autentikasi/pin dan aturan keanggotaan room sebelum dipakai luas.

## 5. Deploy ke GitHub Pages
1. Buat repository GitHub baru, misalnya `live-typing-display`.
2. Upload seluruh isi folder proyek ini (bukan file ZIP-nya saja).
3. Buka **Settings > Pages**.
4. Pada **Build and deployment**, pilih **Deploy from a branch**.
5. Pilih branch `main`, folder `/ (root)`, lalu Save.
6. Tunggu sampai GitHub memberikan alamat situs, misalnya `https://username.github.io/live-typing-display/`.

Alternatif: unggah folder ini ke Cloudflare Pages sebagai proyek static site. Tidak perlu build command.

## 6. Cara menggunakan
1. Buka alamat situs di laptop pertama.
2. Pilih **Mode Pengetik**.
3. Klik **Buat Room**. Room ID 6 angka akan muncul.
4. Ketik tulisan pada kotak teks. Perubahan dikirim otomatis setelah jeda sangat singkat.
5. Klik **Salin link tampilan** dan buka link itu di laptop kedua. Atau buka `display.html` dan masukkan Room ID.
6. Klik **Fullscreen** pada laptop kedua bila ingin memenuhi layar.

## Catatan
- Kedua laptop memerlukan internet.
- Jangan membuka file HTML langsung dari folder (`file://`). Jalankan melalui hosting HTTPS atau server lokal.
- Firebase Realtime Database memiliki kuota dan batas penggunaan sesuai paket. Periksa penggunaan di Firebase Console.
- Room baru dibuat saat pengetik mulai mengirim teks; jika kosong, room tetap dapat dibuka dan menunggu tulisan.
- Sinkronisasi memakai debounce 60 ms untuk mengurangi jumlah permintaan saat mengetik cepat.
- Jika ingin menghentikan akses room, ubah/hapus data room atau cabut akses lewat aturan Firebase.
