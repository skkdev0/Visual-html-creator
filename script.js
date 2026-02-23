// DOM Elements
const htmlInput = document.getElementById('htmlInput');
const cssInput = document.getElementById('cssInput');
const jsInput = document.getElementById('jsInput');
const previewFrame = document.getElementById('previewFrame');
const tabBtns = document.querySelectorAll('.tab-btn');
const editorPanels = document.querySelectorAll('.editor-panel');
const runBtn = document.getElementById('runBtn');
const newBtn = document.getElementById('newBtn');
const saveBtn = document.getElementById('saveBtn');
const lineColSpan = document.getElementById('lineCol');
const wordCountSpan = document.getElementById('wordCount');

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    updatePreview();
    setupEventListeners();
    updateStatus();
});

// Event Listeners Setup
function setupEventListeners() {
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            switchTab(tabId);
        });
    });

    // Run button
    runBtn.addEventListener('click', updatePreview);

    // Auto-update preview (with debounce)
    let previewTimeout;
    [htmlInput, cssInput, jsInput].forEach(input => {
        input.addEventListener('input', () => {
            clearTimeout(previewTimeout);
            previewTimeout = setTimeout(updatePreview, 1000);
            updateStatus();
        });
    });

    // Cursor position tracking
    htmlInput.addEventListener('keyup', updateCursorPosition);
    htmlInput.addEventListener('click', updateCursorPosition);
    
    cssInput.addEventListener('keyup', updateCursorPosition);
    cssInput.addEventListener('click', updateCursorPosition);
    
    jsInput.addEventListener('keyup', updateCursorPosition);
    jsInput.addEventListener('click', updateCursorPosition);

    // New file button
    newBtn.addEventListener('click', createNewFile);
    
    // Save button
    saveBtn.addEventListener('click', saveFile);
}

// Switch between tabs
function switchTab(tabId) {
    // Update active tab button
    tabBtns.forEach(btn => {
        if (btn.dataset.tab === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Show corresponding panel
    editorPanels.forEach(panel => {
        if (panel.id === tabId + 'Editor' || (tabId === 'preview' && panel.id === 'previewPanel')) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });

    // If switching to preview, update it
    if (tabId === 'preview') {
        updatePreview();
    }
}

// Update preview
function updatePreview() {
    const html = htmlInput.value;
    const css = cssInput.value;
    const js = jsInput.value;

    const combinedCode = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>${css}</style>
        </head>
        <body>
            ${html}
            <script>${js}<\/script>
        </body>
        </html>
    `;

    const preview = previewFrame.contentDocument || previewFrame.contentWindow.document;
    preview.open();
    preview.write(combinedCode);
    preview.close();
    
    document.getElementById('fileStatus').textContent = 'Preview Updated';
    setTimeout(() => {
        document.getElementById('fileStatus').textContent = 'Ready';
    }, 2000);
}

// Update cursor position
function updateCursorPosition(e) {
    const textarea = e.target;
    const pos = textarea.selectionStart;
    const lines = textarea.value.substr(0, pos).split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    
    lineColSpan.textContent = `Ln ${line}, Col ${col}`;
    updateWordCount();
}

// Update word count
function updateWordCount() {
    const activeEditor = document.querySelector('.editor-panel.active textarea');
    if (activeEditor) {
        const text = activeEditor.value;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        wordCountSpan.textContent = `${words} words`;
    }
}

// Update status bar
function updateStatus() {
    updateWordCount();
}

// Create new file
function createNewFile() {
    if (confirm('के तपाईं नयाँ फाइल सुरु गर्न चाहनुहुन्छ? सबै unsaved data हराउनेछ।')) {
        htmlInput.value = '<!DOCTYPE html>\n<html>\n<head>\n    <title>नयाँ पेज</title>\n</head>\n<body>\n    <h1>नमस्ते!</h1>\n</body>\n</html>';
        cssInput.value = 'body {\n    font-family: Arial, sans-serif;\n    margin: 20px;\n}';
        jsInput.value = '// JavaScript कोड यहाँ लेख्नुहोस्';
        updatePreview();
        updateStatus();
    }
}

// Save file
function saveFile() {
    const content = {
        html: htmlInput.value,
        css: cssInput.value,
        js: jsInput.value,
        timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `html-project-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    document.getElementById('fileStatus').textContent = 'Saved!';
    setTimeout(() => {
        document.getElementById('fileStatus').textContent = 'Ready';
    }, 2000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+S to save
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveFile();
    }
    
    // Ctrl+Enter to run
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        updatePreview();
    }
    
    // Ctrl+N for new file
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        createNewFile();
    }
});
