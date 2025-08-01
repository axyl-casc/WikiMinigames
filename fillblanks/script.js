document.addEventListener("DOMContentLoaded", () => {
  const checkBtn = document.getElementById("checkBtn");
  const scoreEl = document.getElementById("score");
  if (!checkBtn) return;

    checkBtn.addEventListener("click", () => {
      const inputs = document.querySelectorAll("input[data-answer]");
      let correct = 0;

      inputs.forEach(input => {
        const expected = input.dataset.answer.trim();
        const value = input.value.trim();
        const isCorrect = value === expected;

        input.classList.remove("correct", "incorrect");
        input.classList.add(isCorrect ? "correct" : "incorrect");

        const next = input.nextElementSibling;
        if (next && next.classList.contains("feedback")) next.remove();
        const fb = document.createElement("span");
        fb.classList.add("feedback", isCorrect ? "correct" : "incorrect");
        fb.textContent = isCorrect ? "✔" : "✘";
        input.after(fb);

        if (isCorrect) correct++;
      });

    scoreEl.textContent = `Score: ${correct} / ${inputs.length}`;
    const gameID = document.body.dataset.game || "fillblanks";
    if (typeof saveScore === "function") {
      saveScore(gameID, correct);
    } else {
      localStorage.setItem(`score:${gameID}`, String(correct));
    }
  });
});
