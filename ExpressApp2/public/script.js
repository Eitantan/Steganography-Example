document.querySelector("#text").addEventListener('input', () => {
    generateImage();
});

document.querySelector("#downloadButton").addEventListener('click', () => {
    downloadImage();
});

var alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+{}|:\"<>?-=[]\\;',./`~     \n";
var first100primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541];

Number.prototype.isPrime = function () {
    if (this < 2) return false; // Handle numbers less than 2
    for (var i = 2; i <= Math.sqrt(this); i++) { // Loop to sqrt(this)
        if (this % i === 0) return false; // Check for factors
    }
    return true; // If no factors found, it's prime
};

const randomHexColorCode = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return '#' + n.slice(0, 6);
};

function generateImage() {
    var text = document.querySelector("#text").value;
    var pixels = [];

    var primesSurpassed = 0;

    for (var i = 0; i < 256; i++) {
        pixels[i] = [];
        for (var j = 0; j < 256; j++) {
            pixels[i][j] = randomHexColorCode();
        }
    }

    for (var i = 0; i < 256; i++) {
        for (var j = 0; j < 256; j++) {
            var num = i * 256 + j;
            if (num.isPrime()) {
                primesSurpassed++;
                continue;
            }
            if (num >= text.length) break;

            var charIndex = alphabet.indexOf(text[num - primesSurpassed]);
            if (charIndex === -1) continue; // Skip if character not found in alphabet

            var primeValue = first100primes[charIndex];
            var x = Math.floor(primeValue / 256);
            var y = primeValue % 256;

            pixels[i][j] = pixels[x][y];
        }
    }

    var imageDataUrl = createImage(pixels);
    document.querySelector('#image').src = imageDataUrl;
}

function createImage(pixels) {
    var canvas = document.createElement('canvas');
    canvas.width = pixels[0].length;
    canvas.height = pixels.length;
    var context = canvas.getContext('2d');
    for (var r = 0; r < canvas.height; r++) {
        for (var c = 0; c < canvas.width; c++) {
            context.fillStyle = pixels[r][c];
            context.fillRect(c, r, 1, 1);
        }
    }
    return canvas.toDataURL('image/png');
}

function downloadImage() {
    var image = document.querySelector('#image').src;
    var link = document.createElement('a');
    link.href = image;
    link.download = 'generated_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
