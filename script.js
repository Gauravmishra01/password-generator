document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const passwordInput = document.getElementById("password");
  const copyBtn = document.getElementById("copy-btn");
  const refreshBtn = document.getElementById("refresh-btn");
  const generateBtn = document.getElementById("generate-btn");
  const lengthSlider = document.getElementById("length");
  const lengthValue = document.getElementById("length-value");
  const uppercaseCheckbox = document.getElementById("uppercase");
  const lowercaseCheckbox = document.getElementById("lowercase");
  const numbersCheckbox = document.getElementById("numbers");
  const symbolsCheckbox = document.getElementById("symbols");
  const excludeSimilarCheckbox = document.getElementById("exclude-similar");
  const excludeAmbiguousCheckbox = document.getElementById("exclude-ambiguous");
  const strengthBar = document.querySelector(".strength-bar");
  const strengthText = document.getElementById("strength-text");
  const toast = document.getElementById("toast");
  const historyPanel = document.getElementById("history-panel");
  const passwordHistoryList = document.getElementById("password-history");

  // Character sets
  const characterSets = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  };

  // Similar and ambiguous characters
  const similarChars = "il1Lo0O";
  const ambiguousChars = "{}[]()/'\"`~,;:.<>";

  // Password history
  let passwordHistory =
    JSON.parse(localStorage.getItem("passwordHistory")) || [];

  // Initialize
  updateHistoryPanel();
  generatePassword();

  // Event listeners
  lengthSlider.addEventListener("input", updateLengthValue);
  generateBtn.addEventListener("click", generatePassword);
  refreshBtn.addEventListener("click", generatePassword);
  copyBtn.addEventListener("click", copyToClipboard);

  // Update length display
  function updateLengthValue() {
    lengthValue.textContent = lengthSlider.value;
  }

  // Generate password
  function generatePassword() {
    const length = parseInt(lengthSlider.value);
    const includeUppercase = uppercaseCheckbox.checked;
    const includeLowercase = lowercaseCheckbox.checked;
    const includeNumbers = numbersCheckbox.checked;
    const includeSymbols = symbolsCheckbox.checked;
    const excludeSimilar = excludeSimilarCheckbox.checked;
    const excludeAmbiguous = excludeAmbiguousCheckbox.checked;

    // Validate at least one character set is selected
    if (
      !includeUppercase &&
      !includeLowercase &&
      !includeNumbers &&
      !includeSymbols
    ) {
      showToast("Please select at least one character type!", "error");
      return;
    }

    let characters = "";
    if (includeUppercase) {
      let set = characterSets.uppercase;
      if (excludeSimilar) set = removeSimilarChars(set);
      if (excludeAmbiguous) set = removeAmbiguousChars(set);
      characters += set;
    }
    if (includeLowercase) {
      let set = characterSets.lowercase;
      if (excludeSimilar) set = removeSimilarChars(set);
      if (excludeAmbiguous) set = removeAmbiguousChars(set);
      characters += set;
    }
    if (includeNumbers) {
      let set = characterSets.numbers;
      if (excludeSimilar) set = removeSimilarChars(set);
      characters += set;
    }
    if (includeSymbols) {
      let set = characterSets.symbols;
      if (excludeAmbiguous) set = removeAmbiguousChars(set);
      characters += set;
    }

    // Final validation in case all characters were excluded
    if (characters.length === 0) {
      showToast("No valid characters left after exclusions!", "error");
      return;
    }

    let password = "";
    const characterArray = characters.split("");

    // Use crypto.getRandomValues for secure random numbers
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
      const randomIndex = randomValues[i] % characterArray.length;
      password += characterArray[randomIndex];
    }

    passwordInput.value = password;
    updateStrengthIndicator(password);
    addToHistory(password);
  }

  // Remove similar characters
  function removeSimilarChars(chars) {
    return chars
      .split("")
      .filter((c) => !similarChars.includes(c))
      .join("");
  }

  // Remove ambiguous characters
  function removeAmbiguousChars(chars) {
    return chars
      .split("")
      .filter((c) => !ambiguousChars.includes(c))
      .join("");
  }

  // Update strength indicator
  function updateStrengthIndicator(password) {
    let strength = 0;
    const length = password.length;

    // Length contributes up to 3 points
    if (length >= 8) strength += 1;
    if (length >= 12) strength += 1;
    if (length >= 16) strength += 1;

    // Character variety contributes up to 4 points
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    // Calculate strength percentage and labels
    let strengthPercentage, strengthLabel, strengthColor;

    if (strength <= 3) {
      strengthPercentage = 33;
      strengthLabel = "Weak";
      strengthColor = "#f72585"; // Red
    } else if (strength <= 5) {
      strengthPercentage = 66;
      strengthLabel = "Medium";
      strengthColor = "#f8961e"; // Orange
    } else {
      strengthPercentage = 100;
      strengthLabel = "Strong";
      strengthColor = "#4cc9f0"; // Teal
    }

    // Special case for very short passwords
    if (length < 6) {
      strengthPercentage = 20;
      strengthLabel = "Very Weak";
      strengthColor = "#d90429"; // Dark red
    }

    // Update UI
    strengthBar.style.width = `${strengthPercentage}%`;
    strengthBar.style.backgroundColor = strengthColor;
    strengthText.textContent = strengthLabel;
    strengthText.style.color = strengthColor;
  }

  // Copy to clipboard
  function copyToClipboard() {
    if (!passwordInput.value) {
      showToast("No password to copy!", "error");
      return;
    }

    navigator.clipboard
      .writeText(passwordInput.value)
      .then(() => {
        showToast("Password copied to clipboard!", "success");
      })
      .catch((err) => {
        showToast("Failed to copy password", "error");
        console.error("Failed to copy password:", err);
      });
  }

  // Add password to history
  function addToHistory(password) {
    // Add to beginning of array
    passwordHistory.unshift({
      password: password,
      timestamp: new Date().toISOString(),
    });

    // Keep only last 5 passwords
    if (passwordHistory.length > 5) {
      passwordHistory.pop();
    }

    // Save to localStorage
    localStorage.setItem("passwordHistory", JSON.stringify(passwordHistory));

    // Update UI
    updateHistoryPanel();
  }

  // Update history panel
  function updateHistoryPanel() {
    passwordHistoryList.innerHTML = "";

    if (passwordHistory.length === 0) {
      historyPanel.classList.add("hidden");
      return;
    }

    historyPanel.classList.remove("hidden");

    passwordHistory.forEach((item, index) => {
      const li = document.createElement("li");

      const passwordSpan = document.createElement("span");
      passwordSpan.textContent = item.password;
      passwordSpan.style.fontFamily = "Courier New, monospace";
      passwordSpan.style.fontWeight = "600";

      const timeSpan = document.createElement("span");
      timeSpan.textContent = formatTime(item.timestamp);
      timeSpan.style.fontSize = "12px";
      timeSpan.style.color = "var(--gray-color)";

      const copyBtn = document.createElement("button");
      copyBtn.innerHTML = '<i class="far fa-copy"></i>';
      copyBtn.className = "icon-btn";
      copyBtn.title = "Copy password";
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(item.password);
        showToast("Password copied to clipboard!", "success");
      });

      li.appendChild(passwordSpan);
      li.appendChild(timeSpan);
      li.appendChild(copyBtn);
      passwordHistoryList.appendChild(li);
    });
  }

  // Format timestamp
  function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // Show toast notification
  function showToast(message, type = "success") {
    toast.textContent = message;

    // Set color based on type
    if (type === "error") {
      toast.style.backgroundColor = "var(--danger-color)";
    } else if (type === "success") {
      toast.style.backgroundColor = "var(--success-color)";
    } else {
      toast.style.backgroundColor = "var(--dark-color)";
    }

    toast.style.opacity = "1";

    setTimeout(() => {
      toast.style.opacity = "0";
    }, 3000);
  }
});
