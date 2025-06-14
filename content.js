function addMicButtons() {
  const fields = document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]');

  fields.forEach((field) => {
    if (field.dataset.voiceAttached) return;

    const micBtn = document.createElement("button");
    micBtn.textContent = "Speak to Write";
    micBtn.type = "button";
    micBtn.style.marginLeft = "8px";
    micBtn.style.marginBottom = "4px";
    micBtn.style.padding = "0px 4px";
    micBtn.style.backgroundColor = "black";
    micBtn.style.color = "white";
    micBtn.style.border = "none";
    micBtn.style.borderRadius = "4px";
    micBtn.style.cursor = "pointer";

    micBtn.onclick = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        // Create status label
        const label = document.createElement("span");
        label.textContent = "Developera Mic Listening to type...";
        label.style.marginLeft = "8px";
        label.style.color = "green";
        label.style.fontWeight = "bold";
        micBtn.insertAdjacentElement("afterend", label);

        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (field.tagName === "DIV") {
            field.textContent += " " + transcript;
            } else {
            field.value += " " + transcript;
            }
            label.remove(); // remove label after result
        };

        recognition.onerror = (err) => {
            console.error("Speech recognition error:", err);
            label.textContent = "❌ Error";
            setTimeout(() => label.remove(), 2000);
        };

        recognition.onend = () => {
            if (label.parentNode) label.remove(); // cleanup if no result
        };
    };


    field.insertAdjacentElement("afterend", micBtn);
    field.dataset.voiceAttached = "true";
  });
}

// Observe DOM changes (for dynamic fields)
const observer = new MutationObserver(addMicButtons);
observer.observe(document.body, { childList: true, subtree: true });

// Initial run
addMicButtons();
