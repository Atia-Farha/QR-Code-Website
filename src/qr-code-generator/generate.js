const textInput = document.getElementById('textInput');
const qrColorInput = document.getElementById('qrColorInput');
const bgColorInput = document.getElementById('bgColorInput');
const marginSizeInput = document.getElementById('marginSizeInput');
const fileTypeInput = document.getElementById('fileTypeInput');
const generateBtn = document.getElementById('generateBtn');
const qrCode = document.getElementById('qrCode');

generateBtn.addEventListener('click', () => {
    qrCode.innerHTML = '';

    const inputText = textInput.value.trim();
    const qrColor = qrColorInput.value.slice(1);
    const bgColor = bgColorInput.value.slice(1);
    const marginSize = marginSizeInput.value.trim();
    const fileType = fileTypeInput.value.trim();

    if (!inputText) {
        qrCode.textContent = 'Please enter text first';
        return;
    }

    const loadingMessage = document.createElement('p');
    loadingMessage.textContent = 'Generating QR code...';
    loadingMessage.style.color = 'gray';
    qrCode.appendChild(loadingMessage);

    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(inputText)}&bgcolor=${bgColor}&color=${qrColor}&qzone=${marginSize}&format=${fileType}`;

    if (fileType === 'svg') {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.blob();
            })
            .then(blob => {
                qrCode.innerHTML = '';

                const previewURL = URL.createObjectURL(blob);
                const img = document.createElement('img');
                img.src = previewURL;
                img.alt = 'QR Code';
                qrCode.appendChild(img);

                const a = document.createElement('a');
                a.href = previewURL;
                a.download = 'qr-code.svg';
                a.textContent = 'Download QR Code';
                a.className = 'btn btn-download';
                qrCode.parentNode.appendChild(a);
            })
            .catch(() => {
                qrCode.textContent = '';

                const img = document.createElement('img');
                img.src = apiUrl;
                img.alt = 'QR Code';
                qrCode.appendChild(img);

                const a = document.createElement('a');
                a.href = apiUrl;
                a.download = 'qr-code.svg';
                a.textContent = 'Download QR Code (fallback)';
                a.className = 'btn btn-download';
                qrCode.parentNode.appendChild(a);
            });
    } else {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = apiUrl;
        img.alt = 'QR Code';

        img.onload = () => {
            qrCode.innerHTML = '';

            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            let mimeType;

            if (fileType === 'jpg') {
                mimeType = 'image/jpeg';
            }
            else if (fileType === 'gif') {
                mimeType = 'image/gif';
            }
            else {
                mimeType = 'image/png';
            }

            const a = document.createElement('a');

            try {
                a.href = canvas.toDataURL(mimeType);
            }
            catch (e) {
                a.href = img.src;
            }

            a.download = `qr-code.${fileType}`;
            a.textContent = 'Download QR Code';
            a.className = 'btn btn-download';

            qrCode.appendChild(img);
            qrCode.parentNode.appendChild(a);
        };

        img.onerror = () => {
            qrCode.textContent = 'Failed to load QR code image';
        };
    }
});

function resetQRCodeView() {
    qrCode.textContent = 'Generated QR Code will appear here...';
    document.querySelectorAll('.btn-download').forEach(btn => btn.remove());
}

document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', resetQRCodeView);
    el.addEventListener('change', resetQRCodeView);
});