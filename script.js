document.addEventListener('DOMContentLoaded', () => {
    initializeGrid();
    createGroupOverlays();
    createSpreadsheet();
});

let cellSize;
const labels = new Map();

function initializeGrid() {
    const grid = document.getElementById('mainGrid');
    grid.innerHTML = '';
    
    for (let i = 0; i < 22 * 22; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        grid.appendChild(cell);
    }
    
    const tempCell = grid.firstChild;
    cellSize = tempCell.getBoundingClientRect().width;
}

function createGroupOverlays() {
    const container = document.getElementById('gridContainer');
    const groups = document.createElement('div');
    groups.id = 'groups';
    
    for (let y = 0; y < 11; y++) {
        for (let x = 0; x < 11; x++) {
            if (x === 5 && y === 5) {
                createFortress(container);
                continue;
            }
            
            const group = createGroup(x, y);
            groups.appendChild(group);
        }
    }
    
    container.appendChild(groups);
}

function createGroup(x, y) {
    const group = document.createElement('div');
    group.className = 'group-overlay';
    group.style.width = `${cellSize * 2}px`;
    group.style.height = `${cellSize * 2}px`;
    group.style.left = `${x * cellSize * 2}px`;
    group.style.top = `${y * cellSize * 2}px`;
    
    const groupId = y * 11 + x + 1;
    group.textContent = groupId;
    labels.set(`${x},${y}`, groupId.toString());
    
    return group;
}

function createFortress(container) {
    const fortress = document.createElement('div');
    fortress.id = 'fortress';
    fortress.className = 'group-overlay';
    fortress.style.width = `${cellSize * 2}px`;
    fortress.style.height = `${cellSize * 2}px`;
    fortress.style.left = `${10 * cellSize}px`;
    fortress.style.top = `${10 * cellSize}px`;
    fortress.textContent = 'Fortress';
    container.appendChild(fortress);
}

function createSpreadsheet() {
    const tbody = document.getElementById('spreadsheetBody');
    tbody.innerHTML = '';
    let tr;
    let count = 0;

    const entries = Array.from(labels.entries()).filter(([key]) => {
        const [x, y] = key.split(',').map(Number);
        return !(x === 5 && y === 5);
    });

    entries.forEach(([key, value], index) => {
        if (index % 3 === 0) {
            tr = document.createElement('tr');
        }

        const [x, y] = key.split(',').map(Number);
        const groupId = y * 11 + x + 1;
        
        const td = document.createElement('td');
        td.innerHTML = `
            <div>
                <span>${groupId}:</span>
                <input type="text" 
                       maxlength="20" 
                       data-x="${x}" 
                       data-y="${y}"
                       value="${value}">
            </div>
        `;
        
        td.querySelector('input').addEventListener('input', updateLabel);
        tr.appendChild(td);

        if (index % 3 === 2 || index === entries.length - 1) {
            tbody.appendChild(tr);
        }
    });
}

function updateLabel(e) {
    const input = e.target;
    const x = parseInt(input.dataset.x);
    const y = parseInt(input.dataset.y);
    const group = document.querySelector(`.group-overlay[style*="left: ${x * cellSize * 2}px"]`);
    
    if (group) {
        group.textContent = input.value;
        labels.set(`${x},${y}`, input.value);
    }
}

function exportToExcel() {
    const data = [];
    const headers = ["Group ID", "Label"];
    
    // Collect all input values
    document.querySelectorAll('#spreadsheet input').forEach(input => {
        const groupId = input.parentNode.querySelector('span').textContent.replace(':', '');
        data.push({
            "Group ID": groupId,
            "Label": input.value
        });
    });

    // Sort data by Group ID
    data.sort((a, b) => a["Group ID"] - b["Group ID"]);

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data, { header: headers });
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Labels");
    
    // Export file
    XLSX.writeFile(wb, "grid-labels.xlsx");
}