(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const curriculum = window.SMART_QUIZ_CURRICULUM || [];
  const letters = ["A", "B", "C", "D"];

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

  const STORAGE_KEY = "smart-quiz-challenge-player-progress-v3";

  const state = {
    player: "",
    profileKey: null,
    profile: null,
    age: null,
    grade: null,
    currentMaterial: null,
    questions: [],
    questionStates: [],
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

  let playerStore = readPlayerStore();

  function readPlayerStore() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return { version: 3, players: {} };
      const parsed = JSON.parse(raw);
      if (
        !parsed ||
        typeof parsed !== "object" ||
        !parsed.players ||
        typeof parsed.players !== "object"
      ) {
        return { version: 3, players: {} };
      }
      return { version: 3, players: parsed.players };
    } catch (error) {
      console.warn("Riwayat pemain tidak dapat dibaca dari browser.", error);
      return { version: 3, players: {} };
    }
  }

  function writePlayerStore() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(playerStore));
      return true;
    } catch (error) {
      console.warn("Riwayat pemain belum dapat disimpan di browser.", error);
      return false;
    }
  }

  function normalizePlayerKey(name) {
    return String(name || "")
      .trim()
      .replace(/\s+/g, " ")
      .toLocaleLowerCase("id-ID");
  }

  function createPlayerProfile(name, age, grade) {
    return {
      name,
      age,
      grade,
      gradeProgress: {},
      lastActiveMaterialId: null,
      lastActiveGrade: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  function getGradeProgress(
    profile = state.profile,
    grade = state.grade,
    create = false,
  ) {
    if (!profile || !grade) return null;
    profile.gradeProgress ||= {};
    const key = String(grade);
    if (!profile.gradeProgress[key] && create) {
      profile.gradeProgress[key] = { materials: {} };
    }
    const bucket = profile.gradeProgress[key] || null;
    if (bucket && create) bucket.materials ||= {};
    return bucket;
  }

  function getMaterialRecord(materialId, grade = state.grade, create = false) {
    const bucket = getGradeProgress(state.profile, grade, create);
    if (!bucket) return null;
    bucket.materials ||= {};
    if (!bucket.materials[materialId] && create) {
      bucket.materials[materialId] = { session: null, history: [] };
    }
    return bucket.materials[materialId] || null;
  }

  function makeQuestionState() {
    return {
      attempts: 0,
      wrongIndices: [],
      completed: false,
      outcome: null,
      selectedIndex: null,
      earnedPoints: 0,
      bonusAwarded: 0,
    };
  }

  function normalizeQuestionStates(saved, total) {
    return Array.from({ length: total }, (_, index) => {
      const item =
        saved && saved[index] && typeof saved[index] === "object"
          ? saved[index]
          : {};
      return {
        attempts: Math.max(0, Math.min(3, Number(item.attempts) || 0)),
        wrongIndices: Array.isArray(item.wrongIndices)
          ? [
              ...new Set(
                item.wrongIndices
                  .map(Number)
                  .filter(
                    (value) =>
                      Number.isInteger(value) && value >= 0 && value <= 3,
                  ),
              ),
            ]
          : [],
        completed: Boolean(item.completed),
        outcome:
          item.outcome === "correct" || item.outcome === "failed"
            ? item.outcome
            : null,
        selectedIndex: Number.isInteger(item.selectedIndex)
          ? item.selectedIndex
          : null,
        earnedPoints: Math.max(0, Number(item.earnedPoints) || 0),
        bonusAwarded: Math.max(0, Number(item.bonusAwarded) || 0),
      };
    });
  }

  function completedQuestionCount() {
    return state.questionStates.filter((item) => item && item.completed).length;
  }

  function saveCurrentSession() {
    if (
      !state.profile ||
      !state.currentMaterial ||
      !state.questions.length ||
      !state.profileKey
    )
      return;

    const record = getMaterialRecord(
      state.currentMaterial.id,
      state.grade,
      true,
    );
    record.session = {
      materialId: state.currentMaterial.id,
      grade: state.grade,
      questions: state.questions,
      questionStates: state.questionStates,
      current: state.current,
      score: state.score,
      correct: state.correct,
      streak: state.streak,
      bonus: state.bonus,
      finished: state.finished,
      updatedAt: new Date().toISOString(),
    };
    state.profile.lastActiveMaterialId = state.currentMaterial.id;
    state.profile.lastActiveGrade = state.grade;
    state.profile.updatedAt = new Date().toISOString();
    writePlayerStore();
  }

  function restoreSession(session, material) {
    if (
      !session ||
      !Array.isArray(session.questions) ||
      session.questions.length !== material.count
    ) {
      return false;
    }
    const validQuestions = session.questions.every(
      (question) =>
        question &&
        typeof question.prompt === "string" &&
        Array.isArray(question.answers) &&
        question.answers.length === 4 &&
        Number.isInteger(question.correct) &&
        question.correct >= 0 &&
        question.correct < 4,
    );
    if (!validQuestions) return false;

    state.currentMaterial = material;
    state.questions = session.questions;
    state.questionStates = normalizeQuestionStates(
      session.questionStates,
      state.questions.length,
    );
    state.current = Math.max(
      0,
      Math.min(Number(session.current) || 0, state.questions.length),
    );
    state.score = Math.max(0, Number(session.score) || 0);
    state.correct = Math.max(0, Number(session.correct) || 0);
    state.streak = Math.max(0, Number(session.streak) || 0);
    state.bonus = Math.max(0, Number(session.bonus) || 0);
    state.finished = Boolean(session.finished);

    if (!state.finished && state.current >= state.questions.length) {
      state.current = Math.max(0, state.questions.length - 1);
    }
    const currentQuestionState =
      state.questionStates[state.current] || makeQuestionState();
    state.attempts = currentQuestionState.attempts;
    state.answered = currentQuestionState.completed;
    return true;
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
    const questionNumber = state.finished
      ? total
      : Math.min(state.current + 1, total);
    $("levelNumber").textContent = total
      ? `${questionNumber} / ${total}`
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

  function updateQuestionProgress() {
    const total = state.questions.length;
    const done = completedQuestionCount();
    const percentage = total ? Math.round((done / total) * 100) : 0;
    $("questionProgressPercent").textContent = `${percentage}%`;
    $("questionProgressBar").style.width = `${percentage}%`;
  }

  function renderLevelMap() {
    const map = $("levelDots");
    map.innerHTML = "";
    state.questions.forEach((_, index) => {
      const dot = document.createElement("span");
      const response = state.questionStates[index];
      const isCompleted = Boolean(response && response.completed);
      const isCurrent = index === state.current && !state.finished;
      dot.className = "level-dot";
      dot.textContent = index + 1;
      if (isCompleted) dot.classList.add("completed");
      if (isCurrent) dot.classList.add("current");
      dot.setAttribute(
        "aria-label",
        `Soal ${index + 1}${isCompleted ? ", selesai" : isCurrent ? ", aktif" : ", berikutnya"}`,
      );
      map.appendChild(dot);
    });
    map.setAttribute("aria-label", `Peta ${state.questions.length} soal`);
    $("levelMapCaption").textContent =
      `${completedQuestionCount()} dari ${state.questions.length} soal selesai`;
  }

  function resetFeedback() {
    feedback.hidden = true;
    feedback.classList.remove("is-incorrect");
    $("feedbackSymbol").textContent = "✨";
    $("feedbackTitle").textContent = "Bagus!";
    $("feedbackText").textContent = "";
  }

  function setNextButtonState() {
    nextButton.disabled = !state.answered;
    nextButton.innerHTML =
      state.current === state.questions.length - 1
        ? `Lihat Hasil <span>→</span>`
        : `Soal Berikutnya <span>→</span>`;
  }

  function restoreCurrentQuestionFeedback(question, response) {
    const buttons = [...answerGrid.querySelectorAll("button")];
    response.wrongIndices.forEach((index) => {
      if (buttons[index]) {
        buttons[index].classList.add("wrong");
        buttons[index].disabled = true;
      }
    });

    if (!response.completed && response.attempts > 0) {
      feedback.hidden = false;
      feedback.classList.add("is-incorrect");
      $("feedbackSymbol").textContent = "💪";
      $("feedbackTitle").textContent = "Belum tepat. Coba lagi!";
      $("feedbackText").textContent = question.hint;
      $("attemptNote").textContent =
        `Percobaan ${response.attempts} dari 3. Kamu masih memiliki ${3 - response.attempts} kesempatan.`;
      return;
    }

    if (!response.completed) {
      $("attemptNote").textContent = "Pilih jawabanmu dengan teliti.";
      return;
    }

    buttons.forEach((button) => {
      button.disabled = true;
    });
    if (response.outcome === "correct") {
      if (buttons[question.correct])
        buttons[question.correct].classList.add("correct");
      feedback.hidden = false;
      feedback.classList.remove("is-incorrect");
      $("feedbackSymbol").textContent = response.bonusAwarded > 0 ? "🏆" : "✨";
      $("feedbackTitle").textContent =
        response.bonusAwarded > 0
          ? `Hebat! Bonus streak +${response.bonusAwarded} poin!`
          : response.attempts === 1
            ? "Jawaban benar pada percobaan pertama!"
            : `Berhasil pada percobaan ke-${response.attempts}!`;
      $("feedbackText").textContent = question.explanation;
      $("attemptNote").textContent =
        `+${response.earnedPoints} poin` +
        (response.bonusAwarded > 0
          ? ` + ${response.bonusAwarded} bonus streak!`
          : "");
    } else {
      if (buttons[question.correct])
        buttons[question.correct].classList.add("correct");
      feedback.hidden = false;
      feedback.classList.add("is-incorrect");
      $("feedbackSymbol").textContent = "📘";
      $("feedbackTitle").textContent =
        "Kesempatan selesai. Yuk, pelajari jawabannya!";
      $("feedbackText").textContent =
        `Jawaban yang benar adalah ${letters[question.correct]}. ${question.answers[question.correct]}. ${question.explanation}`;
      $("attemptNote").textContent =
        "Kamu sudah menggunakan 3 kesempatan. Soal ini mendapatkan 0 poin.";
    }
  }

  function renderQuestion() {
    if (state.current >= state.questions.length) {
      showResults();
      return;
    }

    const question = state.questions[state.current];
    const response = state.questionStates[state.current] || makeQuestionState();
    state.questionStates[state.current] = response;
    state.attempts = response.attempts;
    state.answered = response.completed;
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
    updateQuestionProgress();
    setNextButtonState();

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

    restoreCurrentQuestionFeedback(question, response);
    $("quizPlayerName").textContent = firstName(state.player);
    $("quizGradeLine").textContent =
      `${getGradeData(state.grade).title} · ${state.currentMaterial.title}`;
    updateHeader();
    renderLevelMap();
  }

  function updateAfterAnswer() {
    updateHeader();
    updateQuestionProgress();
    renderLevelMap();
    saveCurrentSession();
  }

  function chooseAnswer(index, selectedButton) {
    if (state.answered || selectedButton.disabled) return;
    const question = state.questions[state.current];
    const response = state.questionStates[state.current];
    response.attempts += 1;
    state.attempts = response.attempts;

    if (index !== question.correct) {
      state.streak = 0;
      response.wrongIndices = [...new Set([...response.wrongIndices, index])];
      selectedButton.classList.add("wrong");
      selectedButton.disabled = true;
      feedback.hidden = false;
      feedback.classList.add("is-incorrect");
      $("feedbackSymbol").textContent = "💪";
      $("feedbackTitle").textContent = "Belum tepat. Coba lagi!";
      $("feedbackText").textContent = question.hint;

      if (response.attempts >= 3) {
        response.completed = true;
        response.outcome = "failed";
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
        setNextButtonState();
        updateAfterAnswer();
        return;
      }

      $("attemptNote").textContent =
        `Percobaan ${response.attempts} dari 3. Kamu masih memiliki ${3 - response.attempts} kesempatan.`;
      updateAfterAnswer();
      return;
    }

    response.completed = true;
    response.outcome = "correct";
    response.selectedIndex = index;
    state.answered = true;
    state.correct += 1;
    const pointsByAttempt = { 1: 100, 2: 70, 3: 40 };
    const earnedPoints = pointsByAttempt[response.attempts];
    response.earnedPoints = earnedPoints;
    state.score += earnedPoints;

    if (response.attempts === 1) state.streak += 1;
    else state.streak = 0;

    let bonusAwarded = 0;
    if (state.streak > 0 && state.streak % 3 === 0) {
      bonusAwarded = 25;
      state.bonus += bonusAwarded;
      state.score += bonusAwarded;
    }
    response.bonusAwarded = bonusAwarded;

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
      response.attempts === 1
        ? bonusAwarded > 0
          ? `Hebat! Bonus streak +${bonusAwarded} poin!`
          : "Jawaban benar pada percobaan pertama!"
        : `Berhasil pada percobaan ke-${response.attempts}!`;
    $("feedbackText").textContent = question.explanation;
    $("attemptNote").textContent =
      `+${earnedPoints} poin` +
      (bonusAwarded > 0 ? ` + ${bonusAwarded} bonus streak!` : "");
    setNextButtonState();
    updateAfterAnswer();
  }

  function showResults(shouldScroll = true) {
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
      `Kamu telah menyelesaikan ${state.questions.length} soal pada materi ${state.currentMaterial.title} untuk ${getGradeData(state.grade).title}. Progres materi ini sudah tersimpan. Terus berlatih dan jelajahi materi lainnya!`;
    $("levelNumber").textContent =
      `${state.questions.length} / ${state.questions.length}`;
    updateHeader();
    renderLevelMap();
    saveCurrentSession();
    if (shouldScroll) scrollToElement(resultPanel);
  }

  function renderMaterials() {
    const gradeData = getGradeData(state.grade);
    $("materialSelectionTitle").innerHTML =
      `Materi Informatika <span>${gradeData.title}</span>`;
    $("materialSelectionDescription").textContent =
      `Usia ${String(state.age).replace(".", ",")} tahun · ${gradeData.materials.length} pilihan materi. Setiap materi menyimpan progres pemain secara terpisah.`;
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
      const total = document.createElement("strong");
      total.textContent = material.count;
      const totalLabel = document.createElement("small");
      totalLabel.textContent = "SOAL";
      meta.append(total, totalLabel);

      const record = getMaterialRecord(material.id, state.grade, false);
      const session = record && record.session;
      if (session && Array.isArray(session.questionStates)) {
        const done = session.questionStates.filter(
          (item) => item && item.completed,
        ).length;
        const progress = document.createElement("small");
        progress.className = "material-progress";
        progress.textContent = session.finished
          ? "SELESAI"
          : `${done}/${material.count} SELESAI`;
        meta.append(progress);
        button.classList.add(
          session.finished ? "has-completed" : "has-progress",
        );
      } else {
        const progress = document.createElement("small");
        progress.className = "material-progress";
        progress.textContent = "BELUM MULAI";
        meta.append(progress);
      }

      const arrow = document.createElement("span");
      arrow.className = "material-card-arrow";
      arrow.textContent = "→";
      button.append(icon, copy, meta, arrow);
      materialGrid.appendChild(button);
    });
  }

  function resetRuntimeSession() {
    state.currentMaterial = null;
    state.questions = [];
    state.questionStates = [];
    state.current = 0;
    state.score = 0;
    state.correct = 0;
    state.streak = 0;
    state.bonus = 0;
    state.attempts = 0;
    state.answered = false;
    state.finished = false;
  }

  function showMaterialSelection() {
    saveCurrentSession();
    resetRuntimeSession();
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

  function archiveCompletedSession(record) {
    if (!record || !record.session || !record.session.finished) return;
    record.history ||= [];
    const session = record.session;
    record.history.push({
      completedAt: session.updatedAt || new Date().toISOString(),
      score: Number(session.score) || 0,
      correct: Number(session.correct) || 0,
      total: Array.isArray(session.questions) ? session.questions.length : 0,
      accuracy:
        Array.isArray(session.questions) && session.questions.length
          ? Math.round(
              ((Number(session.correct) || 0) / session.questions.length) * 100,
            )
          : 0,
    });
    record.history = record.history.slice(-20);
  }

  function startMaterial(materialId, forceNew = false) {
    const gradeData = getGradeData(state.grade);
    const material = gradeData.materials.find((item) => item.id === materialId);
    if (!material || !state.profile) return;

    saveCurrentSession();
    const record = getMaterialRecord(material.id, state.grade, true);
    let restored = false;
    if (!forceNew && record.session) {
      restored = restoreSession(record.session, material);
    }

    if (!restored) {
      if (forceNew) archiveCompletedSession(record);
      const questions = makeQuestionSet(material, state.grade);
      state.currentMaterial = material;
      state.questions = questions;
      state.questionStates = questions.map(() => makeQuestionState());
      state.current = 0;
      state.score = 0;
      state.correct = 0;
      state.streak = 0;
      state.bonus = 0;
      state.attempts = 0;
      state.answered = false;
      state.finished = false;
    }

    state.profile.lastActiveMaterialId = material.id;
    state.profile.lastActiveGrade = state.grade;
    materialPanel.classList.add("hidden");
    setupPanel.classList.add("hidden");
    quizPanel.classList.remove("hidden");
    resultPanel.classList.add("hidden");
    quizBoard.classList.remove("hidden");
    $("sidebarPlayerName").textContent = state.player;
    $("gradeSummaryText").textContent = gradeData.title;

    if (state.finished) {
      showResults();
    } else {
      renderQuestion();
      saveCurrentSession();
      scrollToElement(quizBoard);
    }
  }

  function findLastActiveMaterial() {
    if (
      !state.profile ||
      state.profile.lastActiveGrade !== state.grade ||
      !state.profile.lastActiveMaterialId
    )
      return null;
    const gradeData = getGradeData(state.grade);
    const material = gradeData.materials.find(
      (item) => item.id === state.profile.lastActiveMaterialId,
    );
    const record = material
      ? getMaterialRecord(material.id, state.grade, false)
      : null;
    return record && record.session ? material : null;
  }

  function returnToSetup(clearFields = false) {
    saveCurrentSession();
    resetRuntimeSession();
    quizPanel.classList.add("hidden");
    materialPanel.classList.add("hidden");
    resultPanel.classList.add("hidden");
    quizBoard.classList.remove("hidden");
    setupPanel.classList.remove("hidden");

    if (clearFields) {
      playerInput.value = "";
      ageInput.value = "";
      state.player = "";
      state.profileKey = null;
      state.profile = null;
      state.age = null;
      state.grade = null;
      $("nameError").textContent = "";
    } else {
      playerInput.value = state.player;
      ageInput.value = state.age == null ? "" : state.age;
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
    state.profileKey = normalizePlayerKey(fullName);
    state.profile = playerStore.players[state.profileKey] || null;
    if (!state.profile) {
      state.profile = createPlayerProfile(fullName, state.age, state.grade);
      playerStore.players[state.profileKey] = state.profile;
    }
    state.profile.name = fullName;
    state.profile.age = state.age;
    state.profile.grade = state.grade;
    state.profile.updatedAt = new Date().toISOString();
    writePlayerStore();
    $("headerPlayer").textContent = fullName;

    const lastMaterial = findLastActiveMaterial();
    if (lastMaterial) {
      startMaterial(lastMaterial.id);
    } else {
      showMaterialSelection();
    }
  });

  materialGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-material-id]");
    if (!button) return;
    startMaterial(button.dataset.materialId);
  });

  nextButton.addEventListener("click", () => {
    if (!state.answered) return;
    state.current += 1;
    if (state.current >= state.questions.length) {
      showResults();
    } else {
      state.attempts = 0;
      state.answered = false;
      saveCurrentSession();
      renderQuestion();
      scrollToElement(quizBoard);
    }
  });

  $("changePlayerBtn").addEventListener("click", () => returnToSetup(true));
  $("newPlayerBtn").addEventListener("click", () => returnToSetup(true));
  $("playAgainBtn").addEventListener("click", () => {
    if (state.currentMaterial) startMaterial(state.currentMaterial.id, true);
  });
  $("selectMaterialBtn").addEventListener("click", showMaterialSelection);
  $("changeMaterialBtn").addEventListener("click", showMaterialSelection);
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

  window.addEventListener("beforeunload", saveCurrentSession);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") saveCurrentSession();
  });

  $("currentYear").textContent = new Date().getFullYear();
  updateHeader();
  updateQuestionProgress();
  renderLevelMap();
})();
