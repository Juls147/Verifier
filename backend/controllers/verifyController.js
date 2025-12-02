const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

exports.verifyPDF = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "File PDF tidak ditemukan" });
        }

        const pdfPath = req.file.path;

        // Buat form-data seperti di repo node-esign-BSrE
        const formData = new FormData();
        formData.append("file", fs.createReadStream(pdfPath));

        const response = await axios.post(
            process.env.BSRE_URL,
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    "Authorization": "Basic " + Buffer.from(
                        process.env.BSRE_USERNAME + ":" + process.env.BSRE_PASSWORD
                    ).toString("base64")
                }
            }
        );

        // Hapus file dari folder setelah selesai
        fs.unlinkSync(pdfPath);

        // Ambil data dari BSrE
        const result = response.data;

        return res.json({
            status: "success",
            data: {
                nama_perusahaan: result.data?.subject?.O || "Tidak diketahui",
                nama_dokumen: req.file.originalname,
                nomor_serial: result.data?.serialNumber || "Tidak diketahui",
                bsre_response: result.data
            }
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            status: "failed",
            message: "Gagal melakukan verifikasi PDF",
            error: err.response?.data || err.message
        });
    }
};
