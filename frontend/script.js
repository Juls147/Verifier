async function verifikasi(event) {
    if (event) event.preventDefault();

    const file = document.getElementById("pdfInput").files[0];

    if (!file) {
        alert("Silakan pilih file PDF terlebih dahulu");
        return;
    }

    let formData = new FormData();
    formData.append("pdf", file);

    let result = null;

    try {
        const response = await fetch("http://localhost:5000/api/verify", {
            method: "POST",
            body: formData
        });

        result = await response.json();
    } catch (err) {
        console.error("Error:", err);
        result = null;
    }

    // === Fallback Jika Result Tidak Ada ===
    const perusahaan = result?.data?.nama_perusahaan || "Tidak ditemukan";
    const dokumen = result?.data?.nama_dokumen || file.name;
    const serial = result?.data?.nomor_serial || "Tidak ditemukan";

    // Tampilkan hasil ke halaman
    document.getElementById("resPerusahaan").textContent = perusahaan;
    document.getElementById("resDokumen").textContent = dokumen;
    document.getElementById("resSerial").textContent = serial;

    // === Tampilkan PDF apapun yang terjadi ===
    const url = URL.createObjectURL(file);
    document.getElementById("pdfViewer").src = url;

    // === Selalu tampilkan section hasil ===
    document.getElementById("resultSection").style.display = "block";

    // Optional: Log error BSrE jika ada
    if (!result || result.status === "failed") {
        console.warn("Verifikasi gagal:", result);
    }
}
