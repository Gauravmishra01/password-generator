# Password Generator

A simple, customizable password generator web app built with HTML, CSS, and JavaScript.

## 🔐 Features

- **Password Length Control** – Select your desired password length via a slider/input.
- **Character Type Options** – Choose to include uppercase, lowercase, numbers, and symbols.
- **Strength Indicator** – Visual feedback on password strength based on selected options.
- **Clipboard Copy** – One-click copy functionality.
- **Responsive Design** – Works well on desktop and mobile screens.

## 📁 Demo (if deployed)

Live version: [https://your-username.github.io/password-generator](https://your-username.github.io/password-generator)

---

## 🛠️ Table of Contents

1. [Installation](#installation)  
2. [Usage](#usage)  
3. [Code Structure](#code-structure)  
4. [Customizing](#customizing)  
5. [Contributing](#contributing)  
6. [License](#license)  

---

## Installation

Clone the repository and open in your browser:

```bash
git clone https://github.com/Gauravmishra01/password-generator.git
cd password-generator
# No build needed – just open index.html
````

---

## Usage

1. Open `index.html` in your web browser.
2. Adjust settings:

   * Set length.
   * Toggle checkboxes for character types (uppercase, lowercase, numbers, symbols).
3. Click **Generate Password**.
4. Use the **Copy** button to copy the result for use.

---

## Code Structure

```
├── index.html         # Main UI structure
├── style.css          # Styles and layout
└── script.js          # Logic: generation, strength meter, DOM interaction
```

### script.js – Key Functions

* `generateRandomLower()` – Random lowercase letter.
* `generateRandomUpper()` – Random uppercase letter.
* `generateRandomNumber()` – Random digit.
* `generateRandomSymbol()` – Random symbol (e.g., `!@#$`).
* `generatePassword()` – Combines selected types into password.
* `shufflePassword()` – Shuffles characters to ensure randomness.
* `updateStrengthIndicator()` – Sets strength color based on diversity & length.
* `copyToClipboard()` – Copies result to user clipboard.

---

## ⚙️ Customizing

* **Symbol set** – Change the characters in `symbols = '...';` in `script.js`.
* **Strength logic** – Adjust thresholds/colors in `updateStrengthIndicator()`.
* **UI tweaks** – Modify layout and styles in `style.css`.

---

## 🤝 Contributing

1. Fork this repo
2. Create a branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit (`git commit -m "Add feature"`)
5. Push (`git push origin feature/your-feature`)
6. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

## 📬 Contact

* **Author**: Gaurav Mishra
* **Email**: [gauravmishra92812@gmail.com]
* **GitHub**: [[Gauravmishra01](https://github.com/Gauravmishra01)]

