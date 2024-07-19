document.querySelector("#fileInput").addEventListener('change', handleFileSelect, false);

var alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+{}|:\"<>?-=[]\\;',./`~     \n";
var first100primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541];

function handleFileSelect(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement('canvas');
            document.body.appendChild(canvas)
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            const text = decodeImage(imageData, canvas.width, canvas.height);
            console.log(text)
            document.querySelector('#decodedText').value = text;
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function decodeImage(imageData, width, height) {
    let pixels = [];
    for (let i = 0; i < height; i++) {
        pixels[i] = [];
        for (let j = 0; j < width; j++) {
            let index = (i * width + j) * 4;
            pixels[i][j] = rgbToHex(imageData[index], imageData[index + 1], imageData[index + 2]);
        }
    }

    let decodedText = "";
    let primesSurpassed = 0;

    for (let num = 0; num < 65536; num++) {
        let i = Math.floor(num / 256);
        let j = num % 256;

        if (num.isPrime()) {
            primesSurpassed++;
            continue;
        }

        if (i >= height || j >= width) break;

        let hexColor = pixels[i][j];
        let originalPrime = findOriginalPrime(hexColor, pixels);
        let charIndex = first100primes.indexOf(originalPrime);
        if (charIndex !== -1) {
            decodedText += alphabet[charIndex];
        }
    }

    return decodedText;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function findOriginalPrime(color, pixels) {
    for (let i = 0; i < pixels.length; i++) {
        for (let j = 0; j < pixels[i].length; j++) {
            if (pixels[i][j] === color) {
                return (i * 256 + j);
            }
        }
    }
    return -1; // If no matching color is found
}

Number.prototype.isPrime = function () {
    if (this < 2) return false;
    for (var i = 2; i <= Math.sqrt(this); i++) {
        if (this % i === 0) return false;
    }
    return true;
};
