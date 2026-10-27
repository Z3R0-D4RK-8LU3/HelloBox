// 1. FUNGSI MEMUTAR KARTU AUTH SECARA 3D FLIP
function putarKartu() {
    // Memberikan perintah pada wadah internal kartu untuk membalikkan badan
    document.getElementById("cardInner").classList.toggle("flipped");
}

// Tampilkan atau sembunyikan password pada form yang dipilih.
function togglePassword(buttonElement) {
    const inputPassword = buttonElement.parentElement.querySelector(".passInput");
    const tampilkan = inputPassword.type === "password";
    inputPassword.type = tampilkan ? "text" : "password";
    buttonElement.classList.toggle("is-visible", tampilkan);
    buttonElement.setAttribute("aria-pressed", String(tampilkan));
    buttonElement.setAttribute("aria-label", tampilkan ? "Sembunyikan password" : "Tampilkan password");
}

// Akun demo disimpan hanya di browser/perangkat ini.
const KUNCI_AKUN = "hellobox-account";

// Pendaftaran menyimpan akun; hanya login yang membuka halaman utama.
function prosesAuth(buttonElement) {
    const cardNode = buttonElement.parentElement;
    const email = cardNode.querySelector(".emailInput").value.trim().toLowerCase();
    const passwordInputs = cardNode.querySelectorAll(".passInput");
    const password = passwordInputs[0].value;
    const isRegistration = cardNode.classList.contains("back-side");

    if (!email || !password) {
        alert("Email dan password tidak boleh kosong.");
        return;
    }

    if (isRegistration) {
        const nama = cardNode.querySelector('input[type="text"]').value.trim();
        const konfirmasi = passwordInputs[1].value;
        if (!nama || !konfirmasi) {
            alert("Nama dan konfirmasi password tidak boleh kosong.");
            return;
        }
        if (password !== konfirmasi) {
            alert("Password dan konfirmasi password harus sama.");
            return;
        }

        try {
            localStorage.setItem(KUNCI_AKUN, JSON.stringify({ nama, email, password }));
            const formLogin = document.querySelector(".front-side");
            formLogin.querySelector(".emailInput").value = email;
            formLogin.querySelector(".passInput").value = "";
            document.getElementById("cardInner").classList.remove("flipped");
            alert("Pendaftaran berhasil. Silakan login dengan akun yang sudah dibuat.");
        } catch (error) {
            alert("Akun tidak dapat disimpan di browser ini.");
        }
        return;
    }

    let akun;
    try {
        akun = JSON.parse(localStorage.getItem(KUNCI_AKUN) || "null");
    } catch (error) {
        akun = null;
    }

    if (!akun) {
        alert("Akun belum terdaftar. Silakan register terlebih dahulu.");
        return;
    }
    if (akun.email !== email || akun.password !== password) {
        alert("Email atau password salah.");
        return;
    }

    const namaPengirim = document.getElementById("namaPengirim");
    if (!namaPengirim.value.trim()) namaPengirim.value = akun.nama;
    document.getElementById("authPage").classList.add("slide-out");
    document.getElementById("homepageArea").classList.add("slide-in");
}

// 3. MAIL SURAT: disimpan di localStorage browser ini.
const KUNCI_SURAT = "hellobox-mail-surat";

function bacaSurat() {
    try {
        const surat = JSON.parse(localStorage.getItem(KUNCI_SURAT) || "[]");
        return Array.isArray(surat) ? surat : [];
    } catch (error) {
        return [];
    }
}

function tampilkanSurat() {
    const daftarSurat = document.getElementById("daftarSurat");
    const suratTersimpan = bacaSurat();
    daftarSurat.replaceChildren();

    if (suratTersimpan.length === 0) {
        const kosong = document.createElement("p");
        kosong.className = "mail-empty";
        kosong.textContent = "Belum ada surat. Jadilah yang pertama mengirim!";
        daftarSurat.appendChild(kosong);
        return;
    }

    suratTersimpan.slice().reverse().forEach((surat) => {
        const item = document.createElement("article");
        item.className = "mail-item";

        const meta = document.createElement("div");
        meta.className = "mail-meta";
        const pengirim = document.createElement("strong");
        pengirim.textContent = surat.nama || "Anonim";
        const waktu = document.createElement("time");
        const tanggal = new Date(surat.waktu);
        waktu.textContent = Number.isNaN(tanggal.getTime())
            ? ""
            : tanggal.toLocaleString("id-ID", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            });
        meta.append(pengirim, waktu);

        const isi = document.createElement("p");
        isi.textContent = surat.isi || "";
        item.append(meta, isi);
        daftarSurat.appendChild(item);
    });
}

function kirimPesan() {
    const inputPesan = document.getElementById("inputPesan");
    const isiKotak = inputPesan.value.trim();
    const nama = document.getElementById("namaPengirim").value.trim();

    if (isiKotak === "") {
        alert("❌ Surat tidak boleh kosong.");
        return;
    }

    try {
        const suratTersimpan = bacaSurat();
        suratTersimpan.push({ nama: nama || "Anonim", isi: isiKotak, waktu: new Date().toISOString() });
        localStorage.setItem(KUNCI_SURAT, JSON.stringify(suratTersimpan));
        inputPesan.value = "";
        document.getElementById("charCount").innerText = "0 / 1000";
        tampilkanSurat();
    } catch (error) {
        alert("❌ Surat tidak dapat disimpan. Penyimpanan browser mungkin penuh atau tidak tersedia.");
    }
}


function ubahTema() {
    var sakelar = document.getElementById("checkboxMode");
    var wadahSlider = document.getElementById("wadahSlider");
    if (sakelar.checked) {
        document.body.classList.add("dark-theme");
        wadahSlider.classList.add("aktif");
    } else {
        document.body.classList.remove("dark-theme");
        wadahSlider.classList.remove("aktif");
    }
}

tampilkanSurat();

document.getElementById("inputPesan").addEventListener("input", function() {
    var jumlahHuruf = this.value.length;
    document.getElementById("charCount").innerText = jumlahHuruf + " / 1000";
    if (jumlahHuruf > 1000) {
        this.value = this.value.substring(0, 1000);
        document.getElementById("charCount").innerText = "1000 / 1000";
    }
});
