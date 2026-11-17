const questions = [
  {
    category: "BASIC CODING",
    difficulty: "EASY",
    icon: "🧩",
    prompt:
      "Apa yang dimaksud dengan urutan instruksi (sequencing) dalam pemrograman?",
    hint: "Pikirkan bagaimana kita mengikuti langkah-langkah untuk membuat sesuatu.",
    answers: [
      "Menjalankan langkah secara berurutan",
      "Menghapus semua perintah",
      "Mengubah warna layar saja",
      "Mematikan komputer",
    ],
    correct: 0,
    explanation:
      "Sequencing berarti menyusun dan menjalankan instruksi secara berurutan agar program melakukan tugas sesuai tujuan.",
  },
  {
    category: "SCRATCH BASICS",
    difficulty: "EASY",
    icon: "🧱",
    prompt: "Scratch menggunakan cara pemrograman seperti apa?",
    hint: "Di Scratch, kita menyusun potongan perintah yang bentuknya seperti kepingan puzzle.",
    answers: [
      "Mengetik semua kode mesin",
      "Menyusun blok-blok perintah",
      "Menggambar tanpa instruksi",
      "Menggunakan angka saja",
    ],
    correct: 1,
    explanation:
      "Scratch menggunakan block-based programming. Kita menyusun blok perintah seperti puzzle untuk membuat program.",
  },
  {
    category: "EVENTS",
    difficulty: "EASY",
    icon: "🚩",
    prompt: "Apa fungsi blok 'when green flag clicked' di Scratch?",
    hint: "Bendera hijau biasanya menjadi tanda untuk memulai proyek.",
    answers: [
      "Menghapus karakter",
      "Menghentikan internet",
      "Memulai skrip saat bendera hijau diklik",
      "Mengganti nama proyek",
    ],
    correct: 2,
    explanation:
      "Blok event bendera hijau menjalankan rangkaian perintah ketika tombol bendera hijau ditekan.",
  },
  {
    category: "MOTION",
    difficulty: "EASY",
    icon: "🐱",
    prompt: "Blok 'move 10 steps' digunakan untuk apa?",
    hint: "Perhatikan kata move yang berarti bergerak.",
    answers: [
      "Mengubah suara",
      "Mengganti latar",
      "Menghapus sprite",
      "Menggerakkan sprite 10 langkah",
    ],
    correct: 3,
    explanation:
      "Blok Motion 'move 10 steps' menggerakkan sprite maju sebanyak 10 langkah pada panggung Scratch.",
  },
  {
    category: "LOOKS",
    difficulty: "EASY",
    icon: "💬",
    prompt: "Apa yang terjadi ketika blok 'say Hello!' dijalankan?",
    hint: "Bayangkan karakter sedang berbicara.",
    answers: [
      "Sprite menampilkan balon kata Hello!",
      "Sprite menghilang",
      "Panggung menjadi kosong",
      "Musik berhenti",
    ],
    correct: 0,
    explanation:
      "Blok Looks 'say' menampilkan balon percakapan di dekat sprite sehingga karakter terlihat sedang berbicara.",
  },
  {
    category: "LOOPS",
    difficulty: "EASY",
    icon: "🔁",
    prompt: "Apa kegunaan blok 'repeat 5' di Scratch?",
    hint: "Repeat berarti mengulangi sesuatu.",
    answers: [
      "Menjalankan satu perintah tanpa henti",
      "Mengulang perintah di dalamnya sebanyak 5 kali",
      "Menghapus 5 sprite",
      "Menunggu selama 5 menit",
    ],
    correct: 1,
    explanation:
      "Blok repeat mengulangi perintah di dalamnya sesuai jumlah yang ditentukan, dalam contoh ini lima kali.",
  },
  {
    category: "LOOPS",
    difficulty: "EASY",
    icon: "♾️",
    prompt: "Apa fungsi blok 'forever' dalam sebuah program?",
    hint: "Forever berarti terus-menerus.",
    answers: [
      "Mengulang perintah satu kali",
      "Menghentikan seluruh skrip",
      "Mengulang perintah terus-menerus sampai program dihentikan",
      "Mengubah sprite menjadi kecil",
    ],
    correct: 2,
    explanation:
      "Blok forever menjalankan perintah di dalamnya secara terus-menerus sampai skrip dihentikan.",
  },
  {
    category: "CONDITIONS",
    difficulty: "MEDIUM",
    icon: "🔀",
    prompt: "Blok 'if ... then' digunakan ketika kita ingin program ...",
    hint: "Kata if berarti jika. Program perlu memeriksa suatu keadaan.",
    answers: [
      "Selalu menghapus variabel",
      "Mengulang semua perintah 10 kali",
      "Berjalan tanpa kondisi",
      "Melakukan perintah jika kondisi terpenuhi",
    ],
    correct: 3,
    explanation:
      "If ... then adalah percabangan. Perintah di dalamnya dilakukan hanya ketika kondisi yang diperiksa bernilai benar.",
  },
  {
    category: "SPRITES",
    difficulty: "MEDIUM",
    icon: "🐱",
    prompt: "Dalam Scratch, apa yang disebut dengan sprite?",
    hint: "Sprite adalah tokoh atau objek yang dapat diprogram.",
    answers: [
      "Karakter atau objek yang dapat diberi perintah",
      "Nama koneksi internet",
      "Jenis keyboard",
      "Tempat menyimpan file",
    ],
    correct: 0,
    explanation:
      "Sprite adalah karakter atau objek dalam proyek Scratch yang dapat bergerak, berbicara, dan menjalankan skrip.",
  },
  {
    category: "STAGE",
    difficulty: "MEDIUM",
    icon: "🏞️",
    prompt: "Apa fungsi Stage (panggung) di Scratch?",
    hint: "Panggung adalah tempat kita melihat hasil program.",
    answers: [
      "Tempat mengetik kata sandi",
      "Area untuk menampilkan dan menjalankan proyek",
      "Tempat mengisi baterai",
      "Daftar aplikasi komputer",
    ],
    correct: 1,
    explanation:
      "Stage adalah area tampilan tempat sprite dan backdrop muncul saat proyek Scratch dijalankan.",
  },
  {
    category: "COSTUMES",
    difficulty: "MEDIUM",
    icon: "🎭",
    prompt: "Apa kegunaan costume pada sprite?",
    hint: "Costume berkaitan dengan tampilan atau penampilan karakter.",
    answers: [
      "Mengatur koneksi Wi-Fi",
      "Menghapus seluruh skrip",
      "Mengubah tampilan sprite",
      "Menambah kapasitas komputer",
    ],
    correct: 2,
    explanation:
      "Costume merupakan variasi tampilan sprite. Mengganti costume dapat membuat karakter terlihat berubah atau seolah bergerak.",
  },
  {
    category: "EVENTS",
    difficulty: "MEDIUM",
    icon: "⌨️",
    prompt: "Apa yang dilakukan blok 'when space key pressed'?",
    hint: "Blok ini menunggu sebuah tombol pada keyboard ditekan.",
    answers: [
      "Memutar musik sepanjang hari",
      "Mengubah ukuran monitor",
      "Menghapus panggung",
      "Menjalankan skrip ketika tombol spasi ditekan",
    ],
    correct: 3,
    explanation:
      "Blok event tersebut memulai skrip ketika pengguna menekan tombol spasi pada keyboard.",
  },
  {
    category: "SOUND",
    difficulty: "MEDIUM",
    icon: "🔊",
    prompt: "Blok pada kategori Sound digunakan untuk ...",
    hint: "Sound berhubungan dengan bunyi atau audio.",
    answers: [
      "Memutar dan mengatur suara",
      "Mengatur posisi mouse",
      "Mengubah koneksi internet",
      "Menghapus variabel",
    ],
    correct: 0,
    explanation:
      "Kategori Sound menyediakan blok untuk memainkan suara, menghentikan suara, dan mengatur volume.",
  },
  {
    category: "VARIABLES",
    difficulty: "MEDIUM",
    icon: "📦",
    prompt: "Apa fungsi variabel dalam pemrograman?",
    hint: "Variabel dapat menyimpan nilai yang bisa berubah, seperti skor.",
    answers: [
      "Menghias tampilan panggung",
      "Menyimpan nilai atau data",
      "Menghubungkan komputer ke listrik",
      "Menghapus semua sprite",
    ],
    correct: 1,
    explanation:
      "Variabel adalah tempat untuk menyimpan data, misalnya skor pemain, jumlah nyawa, atau waktu permainan.",
  },
  {
    category: "COORDINATES",
    difficulty: "MEDIUM",
    icon: "📍",
    prompt:
      "Pada koordinat Scratch, jika nilai x bertambah, sprite bergerak ke arah mana?",
    hint: "Bayangkan garis mendatar: kiri berada di sisi negatif dan kanan di sisi positif.",
    answers: ["Ke bawah", "Ke atas", "Ke kanan", "Tidak berpindah"],
    correct: 2,
    explanation:
      "Pada sistem koordinat Scratch, nilai x positif membuat sprite bergerak ke kanan, sedangkan nilai x negatif ke kiri.",
  },
  {
    category: "DEBUGGING",
    difficulty: "MEDIUM",
    icon: "🛠️",
    prompt: "Apa arti debugging dalam pemrograman?",
    hint: "Debugging dilakukan ketika program tidak bekerja sesuai harapan.",
    answers: [
      "Menambahkan gambar sebanyak mungkin",
      "Mematikan komputer",
      "Mengganti semua warna",
      "Mencari dan memperbaiki kesalahan program",
    ],
    correct: 3,
    explanation:
      "Debugging adalah proses mencari, memahami, dan memperbaiki kesalahan agar program bekerja sesuai tujuan.",
  },
  {
    category: "MESSAGES",
    difficulty: "HARD",
    icon: "📣",
    prompt: "Apa kegunaan blok 'broadcast message' di Scratch?",
    hint: "Broadcast mirip seperti mengirim pengumuman kepada sprite lain.",
    answers: [
      "Mengirim pesan agar skrip lain yang menunggu pesan dapat berjalan",
      "Menghapus semua pesan",
      "Mengunci komputer",
      "Mengganti bahasa keyboard",
    ],
    correct: 0,
    explanation:
      "Broadcast mengirim pesan yang dapat diterima oleh skrip lain melalui blok 'when I receive'. Ini membantu sprite bekerja bersama.",
  },
  {
    category: "OPERATORS",
    difficulty: "HARD",
    icon: "➗",
    prompt: "Apa fungsi blok operator perbandingan '=' di Scratch?",
    hint: "Tanda sama dengan memeriksa apakah dua nilai memiliki nilai yang sama.",
    answers: [
      "Menggabungkan dua gambar",
      "Memeriksa apakah dua nilai sama",
      "Mengulang perintah terus-menerus",
      "Menghentikan semua suara",
    ],
    correct: 1,
    explanation:
      "Operator '=' membandingkan dua nilai. Hasilnya benar (true) jika kedua nilai sama dan salah (false) jika berbeda.",
  },
  {
    category: "CONTROL",
    difficulty: "HARD",
    icon: "⏱️",
    prompt: "Apa yang dilakukan blok 'wait 1 seconds'?",
    hint: "Wait berarti menunggu sebelum menjalankan perintah berikutnya.",
    answers: [
      "Mengulang skrip selamanya",
      "Menghapus satu detik dari skor",
      "Menunda skrip selama satu detik",
      "Mengubah sprite menjadi transparan",
    ],
    correct: 2,
    explanation:
      "Blok wait memberi jeda selama waktu yang ditentukan sebelum skrip melanjutkan ke instruksi berikutnya.",
  },
  {
    category: "FINAL CHALLENGE",
    difficulty: "HARD",
    icon: "🚀",
    prompt:
      "Kamu ingin karakter bergerak saat bendera hijau diklik, lalu mengulang gerakan sebanyak 4 kali. Kombinasi blok yang paling tepat adalah ...",
    hint: "Gabungkan event untuk memulai dan loop untuk mengulang.",
    answers: [
      "Forever lalu stop",
      "Say Hello lalu hide",
      "Wait lalu delete this clone",
      "When green flag clicked lalu repeat 4 berisi move",
    ],
    correct: 3,
    explanation:
      "Event bendera hijau memulai program. Blok repeat 4 di dalamnya menjalankan gerakan move sebanyak empat kali. Ini menggabungkan event, sequencing, dan repetition.",
  },
];

const state = {
  player: "",
  current: 0,
  score: 0,
  correct: 0,
  streak: 0,
  bonus: 0,
  attempts: 0,
  answered: false,
  finished: false,
};

const $ = (id) => document.getElementById(id);
const playerForm = $("playerForm");
const playerInput = $("playerName");
const setupPanel = $("playerSetup");
const quizPanel = $("quizPanel");
const quizBoard = $("quizBoard");
const resultPanel = $("resultPanel");
const answerGrid = $("answerGrid");
const feedback = $("answerFeedback");
const nextButton = $("nextQuestionBtn");

function scrollToElement(element) {
  if (!element) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  element.scrollIntoView({
    behavior: reduced ? "auto" : "smooth",
    block: "start",
  });
  if (element === quizBoard) {
    window.setTimeout(
      () => quizBoard.focus({ preventScroll: true }),
      reduced ? 0 : 450,
    );
  }
}

function updateHeader() {
  $("headerPlayer").textContent = state.player || "Tamu";
  $("levelNumber").textContent = state.player
    ? `${Math.min(state.current + 1, questions.length)} / ${questions.length}`
    : `0 / ${questions.length}`;
  $("totalScore").textContent = state.score.toLocaleString("id-ID");
  $("sidebarScore").textContent = state.score.toLocaleString("id-ID");
  $("correctCount").textContent = `${state.correct} / ${questions.length}`;
  $("bonusScore").textContent = `${state.bonus} PTS`;
  $("streakText").textContent =
    state.streak > 1
      ? `🔥 ${state.streak} jawaban benar beruntun!`
      : "Terus semangat belajar!";
}

function renderLevelMap() {
  const map = $("levelDots");
  map.innerHTML = "";
  questions.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.className = "level-dot";
    dot.textContent = index + 1;
    if (index < state.current) dot.classList.add("completed");
    if (index === state.current && !state.finished)
      dot.classList.add("current");
    dot.setAttribute(
      "aria-label",
      `Level ${index + 1}${index < state.current ? ", selesai" : index === state.current ? ", aktif" : ", belum dibuka"}`,
    );
    map.appendChild(dot);
  });
}

function renderQuestion() {
  if (state.current >= questions.length) {
    showResults();
    return;
  }
  const question = questions[state.current];
  state.answered = false;
  state.attempts = 0;
  $("questionCategory").textContent = question.category;
  $("questionDifficulty").textContent = question.difficulty;
  $("questionIllustration").textContent = question.icon;
  $("questionNumber").textContent = String(state.current + 1).padStart(2, "0");
  $("questionText").textContent = question.prompt;
  $("questionPrompt").textContent = "Pilih satu jawaban yang paling tepat.";
  $("questionProgressText").textContent =
    `LEVEL ${String(state.current + 1).padStart(2, "0")} OF ${questions.length}`;
  const percentage = Math.round(((state.current + 1) / questions.length) * 100);
  $("questionProgressPercent").textContent = `${percentage}%`;
  $("questionProgressBar").style.width = `${percentage}%`;
  feedback.hidden = true;
  feedback.classList.remove("is-incorrect");
  nextButton.disabled = true;
  nextButton.innerHTML = `Soal Berikutnya <span>→</span>`;
  $("attemptNote").textContent = "Pilih jawabanmu dengan teliti.";

  answerGrid.innerHTML = "";
  const letters = ["A", "B", "C", "D"];
  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-option";
    button.innerHTML = `<span class="answer-letter">${letters[index]}</span><span></span>`;
    button.querySelector("span:last-child").textContent = answer;
    button.addEventListener("click", () => chooseAnswer(index, button));
    answerGrid.appendChild(button);
  });

  $("quizPlayerName").textContent = firstName(state.player);
  updateHeader();
  renderLevelMap();
}

function firstName(fullName) {
  return fullName.trim().split(/\s+/)[0] || "Champion";
}

function chooseAnswer(index, selectedButton) {
  if (state.answered || selectedButton.disabled) return;

  const question = questions[state.current];
  const letters = ["A", "B", "C", "D"];

  state.attempts += 1;

  if (index !== question.correct) {
    state.streak = 0;

    selectedButton.classList.add("wrong");
    selectedButton.disabled = true;

    feedback.hidden = false;
    feedback.classList.add("is-incorrect");

    $("feedbackSymbol").textContent = "💪";
    $("feedbackTitle").textContent = "Belum tepat. Coba lagi!";
    $("feedbackText").textContent = question.hint;

    if (state.attempts >= 3) {
      state.answered = true;

      const answerButtons = [...answerGrid.querySelectorAll("button")];

      answerButtons.forEach((button, buttonIndex) => {
        button.disabled = true;

        if (buttonIndex === question.correct) {
          button.classList.add("correct");
        }
      });

      $("feedbackSymbol").textContent = "📘";
      $("feedbackTitle").textContent =
        "Kesempatan selesai. Yuk, pelajari jawabannya!";

      $("feedbackText").textContent =
        `Jawaban yang benar adalah ${letters[question.correct]}. ` +
        `${question.answers[question.correct]}. ` +
        question.explanation;

      $("attemptNote").textContent =
        "Kamu sudah menggunakan 3 kesempatan. Soal ini mendapatkan 0 poin.";

      nextButton.disabled = false;

      nextButton.innerHTML =
        state.current === questions.length - 1
          ? `Lihat Hasil <span>→</span>`
          : `Soal Berikutnya <span>→</span>`;

      updateHeader();
      renderLevelMap();

      return;
    }

    $("attemptNote").textContent =
      `Percobaan ${state.attempts} dari 3. ` +
      `Kamu masih memiliki ${3 - state.attempts} kesempatan.`;

    updateHeader();

    return;
  }

  state.answered = true;
  state.correct += 1;

  const pointsByAttempt = {
    1: 100,
    2: 70,
    3: 40,
  };

  const earnedPoints = pointsByAttempt[state.attempts];

  state.score += earnedPoints;

  if (state.attempts === 1) {
    state.streak += 1;
  } else {
    state.streak = 0;
  }

  let bonusAwarded = 0;

  if (state.streak > 0 && state.streak % 3 === 0) {
    bonusAwarded = 25;
    state.bonus += bonusAwarded;
    state.score += bonusAwarded;
  }

  const answerButtons = [...answerGrid.querySelectorAll("button")];

  answerButtons.forEach((button, buttonIndex) => {
    button.disabled = true;

    if (buttonIndex === question.correct) {
      button.classList.add("correct");
    }
  });

  selectedButton.classList.add("correct");

  feedback.hidden = false;
  feedback.classList.remove("is-incorrect");

  $("feedbackSymbol").textContent = bonusAwarded > 0 ? "🏆" : "✨";

  if (state.attempts === 1) {
    $("feedbackTitle").textContent =
      bonusAwarded > 0
        ? `Hebat! Bonus streak +${bonusAwarded} poin!`
        : "Jawaban benar pada percobaan pertama!";
  } else {
    $("feedbackTitle").textContent =
      `Berhasil pada percobaan ke-${state.attempts}!`;
  }

  $("feedbackText").textContent = question.explanation;

  $("attemptNote").textContent =
    `+${earnedPoints} poin` +
    (bonusAwarded > 0 ? ` + ${bonusAwarded} bonus streak!` : "");

  nextButton.disabled = false;

  nextButton.innerHTML =
    state.current === questions.length - 1
      ? `Lihat Hasil <span>→</span>`
      : `Soal Berikutnya <span>→</span>`;

  updateHeader();
  renderLevelMap();
}

function showResults() {
  state.finished = true;
  quizBoard.classList.add("hidden");
  resultPanel.classList.remove("hidden");
  $("resultPlayerName").textContent = firstName(state.player);
  $("finalScore").textContent = state.score.toLocaleString("id-ID");
  $("finalCorrect").textContent = `${state.correct} / ${questions.length}`;
  $("finalAccuracy").textContent =
    `${Math.round((state.correct / questions.length) * 100)}%`;
  $("levelNumber").textContent = `${questions.length} / ${questions.length}`;
  updateHeader();
  renderLevelMap();
  scrollToElement(resultPanel);
}

function resetGame(keepPlayer = true) {
  const player = keepPlayer ? state.player : "";
  state.player = player;
  state.current = 0;
  state.score = 0;
  state.correct = 0;
  state.streak = 0;
  state.bonus = 0;
  state.attempts = 0;
  state.answered = false;
  state.finished = false;
  if (keepPlayer && player) {
    setupPanel.classList.add("hidden");
    quizPanel.classList.remove("hidden");
    resultPanel.classList.add("hidden");
    quizBoard.classList.remove("hidden");
    renderQuestion();
    scrollToElement(quizBoard);
  } else {
    quizPanel.classList.add("hidden");
    setupPanel.classList.remove("hidden");
    resultPanel.classList.add("hidden");
    quizBoard.classList.remove("hidden");
    playerInput.value = "";
    $("nameError").textContent = "";
    updateHeader();
    playerInput.focus({ preventScroll: true });
    scrollToElement(setupPanel);
  }
}

playerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const fullName = playerInput.value.trim().replace(/\s+/g, " ");
  const nameParts = fullName.split(" ").filter(Boolean);
  if (nameParts.length < 2) {
    $("nameError").textContent = "Masukkan nama lengkap minimal dua kata, ya.";
    playerInput.focus();
    return;
  }
  if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(fullName)) {
    $("nameError").textContent =
      "Nama hanya boleh berisi huruf, spasi, tanda titik, atau tanda hubung.";
    playerInput.focus();
    return;
  }
  state.player = fullName;
  resetGame(true);
});

nextButton.addEventListener("click", () => {
  if (!state.answered) return;
  state.current += 1;
  if (state.current >= questions.length) {
    showResults();
  } else {
    renderQuestion();
    scrollToElement(quizBoard);
  }
});

$("changePlayerBtn").addEventListener("click", () => resetGame(false));
$("newPlayerBtn").addEventListener("click", () => resetGame(false));
$("playAgainBtn").addEventListener("click", () => resetGame(true));

$("heroStartLink").addEventListener("click", (event) => {
  event.preventDefault();
  scrollToElement(setupPanel);
  playerInput.focus({ preventScroll: true });
});

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (href === "#challengeSection") {
      event.preventDefault();
      scrollToElement(state.player && !state.finished ? quizBoard : setupPanel);
    }
    document
      .querySelectorAll(".nav-link")
      .forEach((item) =>
        item.classList.toggle("active", item.getAttribute("href") === href),
      );
    $("mobileNav").classList.remove("open");
    $("mobileNavToggle").setAttribute("aria-expanded", "false");
  });
});

$("mobileNavToggle").addEventListener("click", () => {
  const nav = $("mobileNav");
  const isOpen = nav.classList.toggle("open");
  $("mobileNavToggle").setAttribute("aria-expanded", String(isOpen));
});

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      document.querySelectorAll(".nav-link").forEach((link) => {
        const challengeActive = visible.target.id === "challengeSection";
        const target = challengeActive
          ? "#challengeSection"
          : `#${visible.target.id}`;
        link.classList.toggle("active", link.getAttribute("href") === target);
      });
    },
    { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.15, 0.35] },
  );
  [$("home"), $("challengeSection"), $("guideSection")].forEach((section) =>
    sectionObserver.observe(section),
  );
}

const revealElements = document.querySelectorAll(".reveal");
if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

$("currentYear").textContent = new Date().getFullYear();
updateHeader();
renderLevelMap();
