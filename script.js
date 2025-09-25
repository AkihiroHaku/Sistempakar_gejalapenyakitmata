// ====== BASIS PENGETAHUAN (Sama seperti sebelumnya) ======
const rules = [
  { conditions: ["G01", "G02", "G03", "G04"], conclusion: "diagnosis_katarak" },
  { conditions: ["G05", "G06", "G07"], conclusion: "diagnosis_trakoma" },
  { conditions: ["G08", "G09", "G10", "G11"], conclusion: "diagnosis_miopia" },
  { conditions: ["G12", "G13", "G14", "G15"], conclusion: "diagnosis_pterigyum" },
  { conditions: ["G12", "G16", "G17", "G05"], conclusion: "diagnosis_konjungtivitis" },
  { conditions: ["G18", "G19", "G20"], conclusion: "diagnosis_astenofia" },
  { conditions: ["G21", "G22", "G23", "G24"], conclusion: "diagnosis_glaukoma" },
  { conditions: ["G14", "G25", "G26", "G27"], conclusion: "diagnosis_hordeolum" }
];

// ====== DAFTAR PERTANYAAN/GEJALA (Sama seperti sebelumnya) ======
const questions = [
  // Gejala Katarak
  { key: "G01", text: "Pandangan mata samar/kabur" },
  { key: "G02", text: "Terlihat lapisan kuning atau coklat pada mata" },
  { key: "G03", text: "Pandangan mata nampak berwarna kekuningan" },
  { key: "G04", text: "Penglihatan ganda" },
  // Gejala Trakoma
  { key: "G05", text: "Kelopak mata bengkak" },
  { key: "G06", text: "Nyeri pada tepi kelopak mata" },
  { key: "G07", text: "Kornea tampak keruh dan mengeluarkan cairan bernanah dan berlendir" },
  // Gejala Miopia
  { key: "G08", text: "Mata sensitif terhadap cahaya" },
  { key: "G09", text: "Pandangan terlihat kabur saat melihat objek jauh" },
  { key: "G10", text: "Frekuensi mengedipkan mata yang berlebihan" },
  { key: "G11", text: "Biasanya terasa pusing" },
  // Gejala Pterigyum
  { key: "G12", text: "Mata terlihat merah" },
  { key: "G13", text: "Iritasi mata dan terasa gatal" },
  { key: "G14", text: "Mata berair" },
  { key: "G15", text: "Terasa ada yang mengganjal di mata" },
  // Gejala Konjungtivitis
  { key: "G16", text: "Mata terasa berpasir" },
  { key: "G17", text: "Kelopak mata atas dan bawah merekat di pagi hari" },
  // Gejala Astenofia
  { key: "G18", text: "Mata cepat lelah" },
  { key: "G19", text: "Kurang nyaman atau sakit disekitar mata" },
  { key: "G20", text: "Mata terasa panas" },
  // Gejala Glaukoma
  { key: "G21", text: "Penglihatan mata kabur" },
  { key: "G22", text: "Ketika melihat cahaya akan terlihat lingkaran cahaya" },
  { key: "G23", text: "Sakit yang dirasakan hingga kepala bagian belakang" },
  { key: "G24", text: "Mual dan muntah disertai dengan sakit kepala yang parah" },
  // Gejala Hordeolum
  { key: "G25", text: "Mata terasa gatal dan sakit" },
  { key: "G26", text: "Pembengkakan pada kelopak mata dan terasa nyeri" },
  { key: "G27", text: "Tumbuh benjolan seperti bisul yang berwarna merah" }
];

// ====== DETAIL DIAGNOSIS (Helper Object) ======
const diagnosisDetails = {
    "diagnosis_katarak": { name: "Katarak", advice: "Disarankan untuk berkonsultasi dengan dokter mata untuk pemeriksaan lebih lanjut dan penentuan tindakan, seperti operasi." },
    "diagnosis_trakoma": { name: "Trakoma", advice: "Ini adalah infeksi bakteri yang serius. Segera konsultasi ke dokter untuk mendapatkan antibiotik yang tepat." },
    "diagnosis_miopia": { name: "Miopia (Rabun Jauh)", advice: "Periksakan diri ke optik atau dokter mata untuk mendapatkan resep kacamata atau lensa kontak yang sesuai." },
    "diagnosis_pterigyum": { name: "Pterigyum", advice: "Gunakan kacamata hitam untuk melindungi mata dari matahari dan debu. Konsultasikan ke dokter jika sangat mengganggu." },
    "diagnosis_konjungtivitis": { name: "Konjungtivitis (Mata Merah)", advice: "Sangat menular. Jaga kebersihan, hindari menyentuh mata, dan konsultasikan ke dokter untuk mendapatkan obat tetes mata yang sesuai." },
    "diagnosis_astenofia": { name: "Astenofia (Mata Lelah)", advice: "Istirahatkan mata secara berkala, terapkan aturan 20-20-20 (setiap 20 menit, lihat objek sejauh 20 kaki, selama 20 detik)." },
    "diagnosis_glaukoma": { name: "Glaukoma", advice: "Segera periksakan diri ke dokter spesialis mata. Glaukoma adalah kondisi serius yang dapat menyebabkan kebutaan permanen jika tidak ditangani." },
    "diagnosis_hordeolum": { name: "Hordeolum (Bintitan)", advice: "Jaga kebersihan mata, kompres dengan air hangat. Jika tidak membaik atau memburuk, periksakan ke dokter." }
};


// ====== RENDER TABEL GEJALA AWAL ======
const tableBody = document.getElementById("symptomTableBody");
// Pengecekan untuk memastikan elemen ada sebelum dimanipulasi
if (tableBody) {
    questions.forEach(q => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${q.text}</td>
            <td><input type="checkbox" value="${q.key}"></td>
        `;
        tableBody.appendChild(row);
    });
}

// ====== ELEMEN DOM & KONTEN AWAL ======
const appContainer = document.getElementById("app");
const initialAppContent = appContainer.innerHTML; // Simpan konten awal aplikasi

// ====== FUNGSI ANALISIS UTAMA ======
function analyze() {
    const checkedSymptoms = [...document.querySelectorAll('input[type="checkbox"]:checked')]
        .map(cb => cb.value);

    const MINIMUM_MATCH_THRESHOLD = 50;
    let possibleDiagnoses = [];

    for (const rule of rules) {
        const matchCount = rule.conditions.filter(cond => checkedSymptoms.includes(cond)).length;
        const totalConditions = rule.conditions.length;

        if (matchCount > 0) {
            const matchPercentage = (matchCount / totalConditions) * 100;
            if (matchPercentage >= MINIMUM_MATCH_THRESHOLD) {
                possibleDiagnoses.push({
                    conclusion: rule.conclusion,
                    percentage: Math.round(matchPercentage)
                });
            }
        }
    }

    possibleDiagnoses.sort((a, b) => b.percentage - a.percentage);
    renderResults(possibleDiagnoses); // Panggil fungsi render yang baru
}

// ====== FUNGSI BARU UNTUK MENAMPILKAN HASIL ======
function renderResults(diagnoses) {
    let diagnosisHtml = "";
    let resultBoxClass = "result-box"; // Kelas default

    if (diagnoses.length === 0) {
        resultBoxClass += " no-results"; // Tambahkan kelas khusus jika hasil kosong
        diagnosisHtml = `
            <svg class="no-results-illustration" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
            </svg>
            <h3>Diagnosis Tidak Ditemukan</h3>
            <p>Kami tidak dapat menemukan kecocokan dari gejala yang Anda pilih. Coba pilih lebih banyak atau kombinasi gejala yang berbeda.</p>
        `;
    } else {
        diagnosisHtml = "<h3>Kemungkinan Diagnosis:</h3>";
        diagnoses.forEach(diag => {
            const details = diagnosisDetails[diag.conclusion];
            // Menghapus inline style, karena sudah diatur di CSS
            diagnosisHtml += `
                <div class="diagnosis-item">
                    <h4>${details.name} <span>(Tingkat kecocokan: ${diag.percentage}%)</span></h4>
                    <p>${details.advice}</p>
                </div>
            `;
        });
    }

    appContainer.innerHTML = `
        <div class="${resultBoxClass}">
            ${diagnosisHtml}
            <p class="disclaimer"><b>Disclaimer:</b> Hasil ini adalah prediksi, bukan diagnosis medis resmi. Selalu konsultasikan dengan dokter profesional.
            <a href="https://www.halodoc.com/">Klik Disini</a>
            </p>
            <button id="restartBtn" class="analyze-btn">Analisis Ulang</button>
        </div>
    `;

    // Pasang event listener ke tombol reset yang baru dibuat
    document.getElementById("restartBtn").addEventListener("click", resetApp);
}

// ====== FUNGSI BARU UNTUK RESET APLIKASI ======
function resetApp() {
    appContainer.innerHTML = initialAppContent;
    // Pasang kembali event listener ke tombol analisis yang asli setelah konten di-reset
    document.getElementById("analyzeBtn").addEventListener("click", analyze);
}

// ====== EVENT LISTENER AWAL ======
// Pastikan tombol analisis awal memiliki id="analyzeBtn" dan class="analyze-btn" di HTML
document.getElementById("analyzeBtn").addEventListener("click", analyze);