const fileInput = document.getElementById("fileInput");
const scanBtn = document.getElementById("scanBtn");
const scannedText = document.getElementById("scannedText");
const errorText = document.getElementById("errorContainer");
const copyBtn = document.getElementById("copyBtn");

scanBtn.addEventListener("click", () => {
    const file = fileInput.files[0];

    if (!file) {
        scannedText.style.display = 'none';
        errorText.style.display = 'block';
        errorText.textContent = 'Please select an image file.';

        return;
    }

    scannedText.style.display = 'block';
    scannedText.textContent = "Scanning...";
    scannedText.style.color = 'gray';
    errorText.style.display = 'none';

    const formData = new FormData();
    formData.append("file", file);

    fetch("https://api.qrserver.com/v1/read-qr-code/?outputformat=json", {
        method: "POST",
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            const result = data[0]?.symbol[0];

            if (result?.error) {
                scannedText.style.display = 'none';
                errorText.style.display = 'block';
                errorText.textContent = "Error: " + result.error;
            }
            else if (result?.data) {
                scannedText.style.display = 'block';
                scannedText.innerText = result.data;
                scannedText.style.color = 'black';
                errorText.style.display = 'none';
            }
            else {
                scannedText.style.display = 'none';
                errorText.style.display = 'block';
                errorText.textContent = "No QR code detected.";
            }
        })
        .catch(error => {
            scannedText.style.display = 'none';
            errorText.style.display = 'block';
            errorText.textContent = error;
        });
});

copyBtn.addEventListener("click", () => {
    const text = scannedText.innerText.trim();

    if (!text || text === "Scanning..." || text === "Scanned text will appear here...") {
        alert("Nothing to copy!");
        
        return;
    }

    navigator.clipboard.writeText(text)
        .then(() => alert("Copied to clipboard!"))
        .catch(() => alert("Failed to copy text."));
});

fileInput.addEventListener("change", () => {
    scannedText.style.display = 'block';
    scannedText.textContent = 'Scanned text will appear here...';
    scannedText.style.color = 'gray';
    errorText.style.display = 'none';
});