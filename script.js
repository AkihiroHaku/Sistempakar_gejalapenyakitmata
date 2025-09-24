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


// ====== RENDER TABEL GEJALA (Tidak diubah) ======
const tableBody = document.getElementById("symptomTableBody");
questions.forEach(q => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${q.text}</td>
    <td><input type="checkbox" value="${q.key}"></td>
  `;
  tableBody.appendChild(row);
});

// ====== ANALISIS DENGAN LOGIKA SKORING (BARU) ======
function analyze() {
  const checkedSymptoms = [...document.querySelectorAll('input[type="checkbox"]:checked')]
    .map(cb => cb.value);

  // Anda bisa mengubah nilai ini. 50 berarti minimal 50% gejala harus cocok.
  const MINIMUM_MATCH_THRESHOLD = 50; 
  let possibleDiagnoses = [];

  // Langkah 1: Hitung skor kecocokan untuk setiap penyakit
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

  // Langkah 2: Urutkan hasil dari persentase tertinggi ke terendah
  possibleDiagnoses.sort((a, b) => b.percentage - a.percentage);

  // Langkah 3: Siapkan dan tampilkan hasil
  let diagnosisHtml = "";
  if (possibleDiagnoses.length === 0) {
    diagnosisHtml = "<p>Tidak ada diagnosis yang cocok dengan kombinasi gejala yang Anda pilih. Coba pilih lebih banyak gejala.</p>";
  } else {
    diagnosisHtml = "<h3>Kemungkinan Diagnosis:</h3>";
    possibleDiagnoses.forEach(diag => {
      const details = diagnosisDetails[diag.conclusion];
      diagnosisHtml += `
        <div class="diagnosis-item" style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
          <h4>${details.name} (Tingkat kecocokan: ${diag.percentage}%)</h4>
          <p>${details.advice}</p>
        </div>
      `;
    });
  }
  
  const appContainer = document.getElementById("app");
  appContainer.innerHTML = `
    <div class="result-box">
      <h2>Hasil Analisis</h2>
      ${diagnosisHtml}
      <small><b>Disclaimer:</b> Hasil ini adalah prediksi berdasarkan probabilitas, bukan diagnosis medis resmi. Selalu konsultasikan dengan dokter profesional.</small>
      <br><br>
      <button id="restartBtn" class="analyze-btn">Analisis Ulang</button>
    </div>
  `;

  document.getElementById("restartBtn").addEventListener("click", () => location.reload());
}

document.getElementById("analyzeBtn").addEventListener("click", analyze);