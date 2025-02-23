document.addEventListener('DOMContentLoaded', () => {
    const gridSize = 22;
    const blockSize = 2;
    const centerStart = Math.floor(gridSize/2) - 1;
    const gridContainer = document.getElementById('gridContainer');
    const controls = document.getElementById('controls');
    let blocks = {};

    // Create grid blocks
    for (let row = 0; row < gridSize; row += blockSize) {
        for (let col = 0; col < gridSize; col += blockSize) {
            if (row === centerStart && col === centerStart) {
                createFortress();
                continue;
            }
            
            const blockId = `${row}-${col}`;
            const isCenter = row >= centerStart && row < centerStart + blockSize &&
                            col >= centerStart && col < centerStart + blockSize;
            
            if (!isCenter) {
                createBlock(blockId, row, col);
                createControl(blockId);
            }
        }
    }

    function createBlock(id, row, col) {
        const block = document.createElement('div');
        block.className = 'gridBlock';
        block.id = id;
        block.textContent = blocks[id] || Object.keys(blocks).length + 1;
        
        const cellSize = 100 / gridSize;
        block.style.width = `${cellSize * blockSize}%`;
        block.style.height = `${cellSize * blockSize}%`;
        block.style.left = `${col * cellSize}%`;
        block.style.top = `${row * cellSize}%`;
        
        gridContainer.appendChild(block);
        blocks[id] = block.textContent;
    }

    function createFortress() {
        const fortress = document.createElement('div');
        fortress.className = 'gridBlock fortress';
        fortress.textContent = 'Fortress';
        
        const cellSize = 100 / gridSize;
        fortress.style.width = `${cellSize * blockSize}%`;
        fortress.style.height = `${cellSize * blockSize}%`;
        fortress.style.left = `${centerStart * cellSize}%`;
        fortress.style.top = `${centerStart * cellSize}%`;
        
        gridContainer.appendChild(fortress);
    }

    function createControl(id) {
        const row = document.createElement('tr');
        const input = document.createElement('input');
        input.type = 'text';
        input.value = blocks[id];
        
        input.addEventListener('input', (e) => {
            const block = document.getElementById(id);
            block.textContent = e.target.value;
            blocks[id] = e.target.value;
        });

        row.innerHTML = `<td>${id}</td><td></td>`;
        row.children[1].appendChild(input);
        controls.appendChild(row);
    }

    // Save functionality
    document.getElementById('saveBtn').addEventListener('click', () => {
        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Saved Grid</title>
    <style>
        ${document.querySelector('style').innerHTML}
    </style>
</head>
<body>
    ${document.querySelector('.container').outerHTML}
    <script>
        ${saveStateScript()}
    <\/script>
</body>
</html>`;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'grid_configuration.html';
        a.click();
        URL.revokeObjectURL(url);
    });

    function saveStateScript() {
        return `
            document.addEventListener('DOMContentLoaded', () => {
                const blocks = ${JSON.stringify(blocks)};
                Object.entries(blocks).forEach(([id, text]) => {
                    const block = document.getElementById(id);
                    if (block) block.textContent = text;
                });
            });
        `;
    }
});