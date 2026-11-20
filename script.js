(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const curriculum = window.SMART_QUIZ_CURRICULUM || [];
  const letters = ["A", "B", "C", "D"];

  const state = {
    player: "",
    age: null,
    grade: null,
    currentMaterial: null,
    questions: [],
    current: 0,
    score: 0,
    correct: 0,
    streak: 0,
    bonus: 0,
    attempts: 0,
    answered: false,
    finished: false,
  };

  const playerForm = $("playerForm");
  const playerInput = $("playerName");
  const ageInput = $("playerAge");
  const setupPanel = $("playerSetup");
  const materialPanel = $("materialSelection");
  const materialGrid = $("materialGrid");
  const quizPanel = $("quizPanel");
  const quizBoard = $("quizBoard");
  const resultPanel = $("resultPanel");
  const answerGrid = $("answerGrid");
  const feedback = $("answerFeedback");
  const nextButton = $("nextQuestionBtn");

  const fallbackAnswers = {
    meaning: [
      "alat untuk menyimpan makanan dan minuman",
      "perintah untuk menghapus seluruh isi komputer",
      "cara membersihkan layar menggunakan air",
    ],
    example: [
      "membiarkan perangkat menyala tanpa digunakan",
      "menyimpan alat tulis di dalam tas",
      "menekan tombol secara acak tanpa membaca petunjuk",
    ],
    statement: [
      "hal tersebut tidak berhubungan dengan materi yang dipelajari",
      "hal tersebut hanya dapat dilakukan ketika komputer rusak",
      "hal tersebut sebaiknya dilakukan tanpa memperhatikan aturan",
    ],
  };

  function shuffle(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function uniqueOptions(correctAnswer, distractors, fallback) {
    const wrong = [...new Set([...distractors, ...fallback])].filter(
      (item) => item && item !== correctAnswer,
    );
    const selected = shuffle(wrong).slice(0, 3);
    while (selected.length < 3) {
      selected.push(`Pilihan lain yang tidak sesuai (${selected.length + 1})`);
    }
    const options = shuffle([correctAnswer, ...selected]);
    return { answers: options, correct: options.indexOf(correctAnswer) };
  }

  function makeQuestionSet(material, grade) {
    const facts = material.facts;
    const questionTypes = [
      {
        key: "meaning",
        prompt: (fact) => `Apa arti atau fungsi dari ${fact[0]}?`,
        answer: (fact) => fact[1],
        explanation: (fact) => `${fact[0]}: ${fact[1]}.`,
      },
      {
        key: "example",
        prompt: (fact) => `Manakah contoh yang tepat terkait ${fact[0]}?`,
        answer: (fact) => fact[2],
        explanation: (fact) => `Contoh ${fact[0]} adalah ${fact[2]}.`,
      },
      {
        key: "statement",
        prompt: (fact) => `Pernyataan mana yang benar tentang ${fact[0]}?`,
        answer: (fact) => `${fact[0]} ${fact[3]}.`,
        explanation: (fact) => `${fact[0]} ${fact[3]}.`,
      },
    ];

    const questionsByFact = facts.map((fact, index) =>
      questionTypes.map((type) => {
        const correctAnswer = type.answer(fact);
        const distractors = facts
          .filter((_, otherIndex) => otherIndex !== index)
          .map((otherFact) => {
            if (type.key === "statement")
              return `${otherFact[0]} ${otherFact[3]}.`;
            return otherFact[type.key === "meaning" ? 1 : 2];
          });
        const options = uniqueOptions(
          correctAnswer,
          distractors,
          fallbackAnswers[type.key],
        );
        return {
          category: material.shortTitle || material.title,
          difficulty:
            grade <= 2 ? "DASAR" : grade <= 4 ? "MENENGAH" : "LANJUTAN",
          icon: material.icon,
          prompt: type.prompt(fact),
          hint: `Ingat kembali materi tentang ${fact[0]}. Pikirkan fungsi dan penggunaannya.`,
          answers: options.answers,
          correct: options.correct,
          explanation: `${type.explanation(fact)} ${fact[1]} Contoh: ${fact[2]}.`,
        };
      }),
    );

    // Ambil satu variasi dari setiap konsep terlebih dahulu agar satu sesi
    // mencakup materi yang lebih beragam. Jika soal masih kurang, tambahkan
    // variasi pertanyaan lain dari konsep-konsep tersebut.
    const firstRound = shuffle(questionsByFact).map((variants) => {
      const chosenIndex = Math.floor(Math.random() * variants.length);
      const [chosen] = variants.splice(chosenIndex, 1);
      return { chosen, remaining: variants };
    });
    const firstQuestions = firstRound.map((item) => item.chosen);
    const extraQuestions = shuffle(
      firstRound.flatMap((item) => item.remaining),
    );
    return shuffle([...firstQuestions, ...extraQuestions]).slice(
      0,
      material.count,
    );
  }

  function gradeFromAge(age) {
    // Rentang tidak tumpang tindih: 6–<7 = kelas 1, 7–<8 = kelas 2, dst.
    return Math.min(6, Math.max(1, Math.floor(age) - 5));
  }

  function getGradeData(grade) {
    return curriculum.find((item) => item.grade === grade) || curriculum[0];
  }

  function firstName(fullName) {
    return (
      String(fullName || "Champion")
        .trim()
        .split(/\s+/)[0] || "Champion"
    );
  }

  function scrollToElement(element) {
    if (!element) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
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
    const total = state.questions.length;
    $("levelNumber").textContent = total
      ? `${Math.min(state.current + 1, total)} / ${total}`
      : "0 / 0";
    $("totalScore").textContent = state.score.toLocaleString("id-ID");
    $("sidebarScore").textContent = state.score.toLocaleString("id-ID");
    $("correctCount").textContent = `${state.correct} / ${total}`;
    $("bonusScore").textContent = `${state.bonus} PTS`;
    $("streakText").textContent =
      state.streak > 1
        ? `🔥 ${state.streak} jawaban benar beruntun!`
        : "Terus semangat belajar!";
  }

  function renderLevelMap() {
    const map = $("levelDots");
    map.innerHTML = "";
    state.questions.forEach((_, index) => {
      const dot = document.createElement("span");
      dot.className = "level-dot";
      dot.textContent = index + 1;
      if (index < state.current) dot.classList.add("completed");
      if (index === state.current && !state.finished)
        dot.classList.add("current");
      dot.setAttribute(
        "aria-label",
        `Soal ${index + 1}${index < state.current ? ", selesai" : index === state.current ? ", aktif" : ", berikutnya"}`,
      );
      map.appendChild(dot);
    });
    map.setAttribute("aria-label", `Peta ${state.questions.length} soal`);
    $("levelMapCaption").textContent =
      `${state.questions.length} soal dalam materi ini`;
  }

  function resetFeedback() {
    feedback.hidden = true;
    feedback.classList.remove("is-incorrect");
    $("feedbackSymbol").textContent = "✨";
    $("feedbackTitle").textContent = "Bagus!";
    $("feedbackText").textContent = "";
  }

  function renderQuestion() {
    if (state.current >= state.questions.length) {
      showResults();
      return;
    }

    const question = state.questions[state.current];
    state.answered = false;
    state.attempts = 0;
    resetFeedback();

    $("questionCategory").textContent = question.category;
    $("questionDifficulty").textContent = question.difficulty;
    $("questionIllustration").textContent = question.icon;
    $("questionNumber").textContent = String(state.current + 1).padStart(
      2,
      "0",
    );
    $("questionText").textContent = question.prompt;
    $("questionPrompt").textContent = "Pilih satu jawaban yang paling tepat.";
    $("questionProgressText").textContent =
      `SOAL ${String(state.current + 1).padStart(2, "0")} DARI ${String(state.questions.length).padStart(2, "0")}`;
    const percentage = Math.round(
      ((state.current + 1) / state.questions.length) * 100,
    );
    $("questionProgressPercent").textContent = `${percentage}%`;
    $("questionProgressBar").style.width = `${percentage}%`;
    nextButton.disabled = true;
    nextButton.innerHTML = `Soal Berikutnya <span>→</span>`;
    $("attemptNote").textContent = "Pilih jawabanmu dengan teliti.";

    answerGrid.innerHTML = "";
    question.answers.forEach((answer, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-option";
      const letter = document.createElement("span");
      letter.className = "answer-letter";
      letter.textContent = letters[index];
      const answerText = document.createElement("span");
      answerText.textContent = answer;
      button.append(letter, answerText);
      button.addEventListener("click", () => chooseAnswer(index, button));
      answerGrid.appendChild(button);
    });

    $("quizPlayerName").textContent = firstName(state.player);
    $("quizGradeLine").textContent =
      `${getGradeData(state.grade).title} · ${state.currentMaterial.title}`;
    updateHeader();
    renderLevelMap();
  }

  function updateAfterAnswer() {
    updateHeader();
    renderLevelMap();
  }

  function chooseAnswer(index, selectedButton) {
    if (state.answered || selectedButton.disabled) return;
    const question = state.questions[state.current];
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
          if (buttonIndex === question.correct) button.classList.add("correct");
        });
        $("feedbackSymbol").textContent = "📘";
        $("feedbackTitle").textContent =
          "Kesempatan selesai. Yuk, pelajari jawabannya!";
        $("feedbackText").textContent =
          `Jawaban yang benar adalah ${letters[question.correct]}. ` +
          `${question.answers[question.correct]}. ${question.explanation}`;
        $("attemptNote").textContent =
          "Kamu sudah menggunakan 3 kesempatan. Soal ini mendapatkan 0 poin.";
        nextButton.disabled = false;
        nextButton.innerHTML =
          state.current === state.questions.length - 1
            ? `Lihat Hasil <span>→</span>`
            : `Soal Berikutnya <span>→</span>`;
        updateAfterAnswer();
        return;
      }

      $("attemptNote").textContent =
        `Percobaan ${state.attempts} dari 3. Kamu masih memiliki ${3 - state.attempts} kesempatan.`;
      updateAfterAnswer();
      return;
    }

    state.answered = true;
    state.correct += 1;
    const pointsByAttempt = { 1: 100, 2: 70, 3: 40 };
    const earnedPoints = pointsByAttempt[state.attempts];
    state.score += earnedPoints;

    if (state.attempts === 1) state.streak += 1;
    else state.streak = 0;

    let bonusAwarded = 0;
    if (state.streak > 0 && state.streak % 3 === 0) {
      bonusAwarded = 25;
      state.bonus += bonusAwarded;
      state.score += bonusAwarded;
    }

    const answerButtons = [...answerGrid.querySelectorAll("button")];
    answerButtons.forEach((button, buttonIndex) => {
      button.disabled = true;
      if (buttonIndex === question.correct) button.classList.add("correct");
    });
    selectedButton.classList.add("correct");

    feedback.hidden = false;
    feedback.classList.remove("is-incorrect");
    $("feedbackSymbol").textContent = bonusAwarded > 0 ? "🏆" : "✨";
    $("feedbackTitle").textContent =
      state.attempts === 1
        ? bonusAwarded > 0
          ? `Hebat! Bonus streak +${bonusAwarded} poin!`
          : "Jawaban benar pada percobaan pertama!"
        : `Berhasil pada percobaan ke-${state.attempts}!`;
    $("feedbackText").textContent = question.explanation;
    $("attemptNote").textContent =
      `+${earnedPoints} poin` +
      (bonusAwarded > 0 ? ` + ${bonusAwarded} bonus streak!` : "");
    nextButton.disabled = false;
    nextButton.innerHTML =
      state.current === state.questions.length - 1
        ? `Lihat Hasil <span>→</span>`
        : `Soal Berikutnya <span>→</span>`;
    updateAfterAnswer();
  }

  function showResults() {
    state.finished = true;
    quizBoard.classList.add("hidden");
    resultPanel.classList.remove("hidden");
    $("resultPlayerName").textContent = firstName(state.player);
    $("finalScore").textContent = state.score.toLocaleString("id-ID");
    $("finalCorrect").textContent =
      `${state.correct} / ${state.questions.length}`;
    $("finalAccuracy").textContent =
      `${Math.round((state.correct / state.questions.length) * 100)}%`;
    $("resultDescription").textContent =
      `Kamu telah menyelesaikan ${state.questions.length} soal pada materi ${state.currentMaterial.title} untuk ${getGradeData(state.grade).title}. Terus berlatih dan jelajahi materi lainnya!`;
    $("levelNumber").textContent =
      `${state.questions.length} / ${state.questions.length}`;
    updateHeader();
    renderLevelMap();
    scrollToElement(resultPanel);
  }

  function renderMaterials() {
    const gradeData = getGradeData(state.grade);
    $("materialSelectionTitle").innerHTML =
      `Materi Informatika <span>${gradeData.title}</span>`;
    $("materialSelectionDescription").textContent =
      `Usia ${String(state.age).replace(".", ",")} tahun · ${gradeData.materials.length} pilihan materi. Pilih satu materi untuk mulai bermain.`;
    $("gradeSummaryText").textContent = gradeData.title;
    materialGrid.innerHTML = "";

    gradeData.materials.forEach((material, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "material-card";
      button.dataset.materialId = material.id;
      button.style.setProperty("--card-delay", `${index * 55}ms`);

      const icon = document.createElement("span");
      icon.className = "material-card-icon";
      icon.textContent = material.icon;
      const copy = document.createElement("span");
      copy.className = "material-card-copy";
      const title = document.createElement("strong");
      title.textContent = material.title;
      const description = document.createElement("small");
      description.textContent = material.description;
      copy.append(title, description);
      const meta = document.createElement("span");
      meta.className = "material-card-meta";
      meta.innerHTML = `<strong>${material.count}</strong><small>SOAL</small>`;
      const arrow = document.createElement("span");
      arrow.className = "material-card-arrow";
      arrow.textContent = "→";
      button.append(icon, copy, meta, arrow);
      materialGrid.appendChild(button);
    });
  }

  function showMaterialSelection() {
    // Setiap kali kembali ke daftar materi, sesi materi sebelumnya diakhiri.
    state.currentMaterial = null;
    state.questions = [];
    state.current = 0;
    state.score = 0;
    state.correct = 0;
    state.streak = 0;
    state.bonus = 0;
    state.attempts = 0;
    state.answered = false;
    state.finished = false;
    setupPanel.classList.add("hidden");
    quizPanel.classList.add("hidden");
    materialPanel.classList.remove("hidden");
    resultPanel.classList.add("hidden");
    quizBoard.classList.remove("hidden");
    updateHeader();
    renderLevelMap();
    renderMaterials();
    scrollToElement(materialPanel);
  }

  function startMaterial(materialId) {
    const gradeData = getGradeData(state.grade);
    const material = gradeData.materials.find((item) => item.id === materialId);
    if (!material) return;

    state.currentMaterial = material;
    state.questions = makeQuestionSet(material, state.grade);
    state.current = 0;
    state.score = 0;
    state.correct = 0;
    state.streak = 0;
    state.bonus = 0;
    state.attempts = 0;
    state.answered = false;
    state.finished = false;

    materialPanel.classList.add("hidden");
    setupPanel.classList.add("hidden");
    quizPanel.classList.remove("hidden");
    resultPanel.classList.add("hidden");
    quizBoard.classList.remove("hidden");
    $("sidebarPlayerName").textContent = state.player;
    $("gradeSummaryText").textContent = gradeData.title;
    renderQuestion();
    scrollToElement(quizBoard);
  }

  function returnToSetup(clearFields = false) {
    state.currentMaterial = null;
    state.questions = [];
    state.current = 0;
    state.score = 0;
    state.correct = 0;
    state.streak = 0;
    state.bonus = 0;
    state.attempts = 0;
    state.answered = false;
    state.finished = false;
    quizPanel.classList.add("hidden");
    materialPanel.classList.add("hidden");
    resultPanel.classList.add("hidden");
    quizBoard.classList.remove("hidden");
    setupPanel.classList.remove("hidden");
    if (clearFields) {
      playerInput.value = "";
      ageInput.value = "";
      state.player = "";
      state.age = null;
      state.grade = null;
      $("nameError").textContent = "";
    }
    updateHeader();
    scrollToElement(setupPanel);
    playerInput.focus({ preventScroll: true });
  }

  playerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const fullName = playerInput.value.trim().replace(/\s+/g, " ");
    const nameParts = fullName.split(" ").filter(Boolean);
    const age = Number(ageInput.value);

    if (nameParts.length < 2) {
      $("nameError").textContent =
        "Masukkan nama lengkap minimal dua kata, ya.";
      playerInput.focus();
      return;
    }
    if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(fullName)) {
      $("nameError").textContent =
        "Nama hanya boleh berisi huruf, spasi, tanda titik, atau tanda hubung.";
      playerInput.focus();
      return;
    }
    if (!Number.isFinite(age) || age < 6 || age > 12) {
      $("nameError").textContent =
        "Usia harus berada pada rentang 6 sampai 12 tahun.";
      ageInput.focus();
      return;
    }

    $("nameError").textContent = "";
    state.player = fullName;
    state.age = Math.round(age * 10) / 10;
    state.grade = gradeFromAge(state.age);
    $("headerPlayer").textContent = fullName;
    showMaterialSelection();
  });

  materialGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-material-id]");
    if (!button) return;
    startMaterial(button.dataset.materialId);
  });

  nextButton.addEventListener("click", () => {
    if (!state.answered) return;
    state.current += 1;
    if (state.current >= state.questions.length) showResults();
    else {
      renderQuestion();
      scrollToElement(quizBoard);
    }
  });

  $("changePlayerBtn").addEventListener("click", () => returnToSetup(false));
  $("newPlayerBtn").addEventListener("click", () => returnToSetup(true));
  $("playAgainBtn").addEventListener("click", () => {
    if (state.currentMaterial) startMaterial(state.currentMaterial.id);
  });
  $("selectMaterialBtn").addEventListener("click", showMaterialSelection);
  $("changeMaterialBtn").addEventListener("click", () => {
    const confirmed = window.confirm(
      "Kembali ke pilihan materi? Progres kuis pada materi yang sedang berjalan akan diulang jika kamu membukanya lagi.",
    );
    if (confirmed) showMaterialSelection();
  });
  $("editPlayerBtn").addEventListener("click", () => returnToSetup(false));

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
        const target = !setupPanel.classList.contains("hidden")
          ? setupPanel
          : !materialPanel.classList.contains("hidden")
            ? materialPanel
            : quizBoard;
        scrollToElement(target);
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
          const target =
            visible.target.id === "challengeSection"
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
})();
