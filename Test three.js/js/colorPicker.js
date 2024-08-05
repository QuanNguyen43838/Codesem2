// colorPicker.js
let colorButton = document.querySelector('#color-button');
document.addEventListener('DOMContentLoaded', function () {
    const colorPickerPanel = document.querySelector('.color-picker-panel');
    colorButton.addEventListener('click', function (event) {
        colorPickerPanel.classList.toggle('visible');
        event.stopPropagation();
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const colorPalette = document.getElementById('color-palette');
    const colorCursor = document.getElementById('color-cursor');
    const hueColumn = document.getElementById('hue-column');
    const hueCursor = document.getElementById('hue-cursor');
    const currentColor = document.getElementById('current-color');
    const lastColor = document.getElementById('last-color');
    const ctx = colorPalette.getContext('2d');
    const hueCtx = hueColumn.getContext('2d');
    let colorResult = document.querySelector('.color-result');
    const colorInputHEXA = document.querySelector('#colorInput[data-type="HEXA"]');
    const colorInputRGBA = document.querySelector('#colorInputRGBA[data-type="RGBA"]');

    let isDragging = false;
    let isDraggingHue = false;

    function RGBtoHEX(color) {
        const [r, g, b] = color.match(/\d+/g).map(Number);
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function updateCursorPosition(event) {
        const paletteBounds = colorPalette.getBoundingClientRect();
        let x = Math.max(0, Math.min(event.clientX - paletteBounds.left, paletteBounds.width));
        let y = Math.max(0, Math.min(event.clientY - paletteBounds.top, paletteBounds.height));
        if (x >= 0 && x <= paletteBounds.width && y >= 0 && y <= paletteBounds.height) {
            colorCursor.style.left = `${x - colorCursor.offsetWidth / 2}px`;
            colorCursor.style.top = `${y - colorCursor.offsetHeight / 2}px`;
            const pixel = ctx.getImageData(x, y, 1, 1).data;
            const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
            updateColor(color);
        }
    }

    function updateHueCursorPosition(event) {
        const hueBounds = hueColumn.getBoundingClientRect();
        let y = Math.max(0, Math.min(event.clientY - hueBounds.top, hueBounds.height));
        if (y >= 0 && y <= hueBounds.height) {
            hueCursor.style.top = `${y - hueCursor.offsetHeight / 2}px`;
            const pixel = hueCtx.getImageData(0, y, 1, 1).data;
            const hueColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
            updateGradients(hueColor);
        }
    }

    function updateGradients(hueColor) {
        const horGradientColor = ctx.createLinearGradient(0, 0, colorPalette.width, 0);
        const verGradientColor = ctx.createLinearGradient(0, 0, 0, colorPalette.height);

        horGradientColor.addColorStop(0, 'rgb(255, 255, 255)');
        horGradientColor.addColorStop(1, hueColor);

        verGradientColor.addColorStop(0, 'rgba(255, 255, 255, 0)');
        verGradientColor.addColorStop(1, 'rgba(0, 0, 0, 1)');

        ctx.fillStyle = horGradientColor;
        ctx.fillRect(0, 0, colorPalette.width, colorPalette.height);
        ctx.fillStyle = verGradientColor;
        ctx.fillRect(0, 0, colorPalette.width, colorPalette.height);
    }

    function updateColor(color) {
        const hexColor = RGBtoHEX(color);
        currentColor.style.backgroundColor = color;
        if (colorButton) {
            colorButton.style.backgroundColor = color;
        }
        setHexColorValue(hexColor);
    }

    function updateLastColor(color) {
        const hexColor = RGBtoHEX(color);
        lastColor.style.backgroundColor = color;
        setHexColorValue(hexColor);
    }

    function setHexColorValue(hexColor) {
        if (colorResult) {
            colorResult.value = hexColor;
        }
        const colorEvent = new CustomEvent('colorSelected', { detail: hexColor });
        document.dispatchEvent(colorEvent);
    }

    document.addEventListener('mousedown', function (event) {
        const paletteBounds = colorPalette.getBoundingClientRect();
        const hueBounds = hueColumn.getBoundingClientRect();

        if (event.clientX >= paletteBounds.left && event.clientX <= paletteBounds.right &&
            event.clientY >= paletteBounds.top && event.clientY <= paletteBounds.bottom) {
            isDragging = true;
            updateCursorPosition(event);
        }

        if (event.clientX >= hueBounds.left && event.clientX <= hueBounds.right &&
            event.clientY >= hueBounds.top && event.clientY <= hueBounds.bottom) {
            isDraggingHue = true;
            updateHueCursorPosition(event);
        }
    });

    document.addEventListener('mousemove', function (event) {
        if (isDragging) {
            updateCursorPosition(event);
        }

        if (isDraggingHue) {
            updateHueCursorPosition(event);
        }

    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
        isDraggingHue = false;
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            const currentColorStyle = currentColor.style.backgroundColor;
            updateLastColor(currentColorStyle);
        }
    })

    const hueGradient = hueCtx.createLinearGradient(0, 0, 0, hueColumn.height);
    hueGradient.addColorStop(0, 'hsl(0, 100%, 50%)');
    hueGradient.addColorStop(1 / 6, 'hsl(60, 100%, 50%)');
    hueGradient.addColorStop(2 / 6, 'hsl(120, 100%, 50%)');
    hueGradient.addColorStop(3 / 6, 'hsl(180, 100%, 50%)');
    hueGradient.addColorStop(4 / 6, 'hsl(240, 100%, 50%)');
    hueGradient.addColorStop(5 / 6, 'hsl(300, 100%, 50%)');
    hueGradient.addColorStop(1, 'hsl(0, 100%, 50%)');

    hueCtx.fillStyle = hueGradient;
    hueCtx.fillRect(0, 0, hueColumn.width, hueColumn.height);

    let horGradientColor = ctx.createLinearGradient(0, 0, colorPalette.width, 0);
    let verGradientColor = ctx.createLinearGradient(0, 0, 0, colorPalette.height);
    horGradientColor.addColorStop(0, 'rgb(255, 255, 255)');
    horGradientColor.addColorStop(1, 'rgb(0, 0, 255)');
    verGradientColor.addColorStop(0, 'rgba(255, 255, 255, 0)');
    verGradientColor.addColorStop(1, 'rgba(0, 0, 0, 1)');

    ctx.fillStyle = horGradientColor;
    ctx.fillRect(0, 0, colorPalette.width, colorPalette.height);
    ctx.fillStyle = verGradientColor;
    ctx.fillRect(0, 0, colorPalette.width, colorPalette.height);
});
