// CodeMirror Editors
let htmlEditor, cssEditor, jsEditor;

// Initialize CodeMirror
function initEditors() {
    // HTML Editor
    htmlEditor = CodeMirror.fromTextArea(document.getElementById('htmlInput'), {
        mode: 'xml',
        theme: 'dracula',
        lineNumbers: true,
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineWrapping: true,
        indentUnit: 4,
        tabSize: 4,
        matchBrackets: true,
        autoRefresh: true
    });

    // CSS Editor
    cssEditor = CodeMirror.fromTextArea(document.getElementById('cssInput'), {
        mode: 'css',
        theme: 'dracula',
        lineNumbers: true,
        autoCloseBrackets: true,
        lineWrapping: true,
        indentUnit: 4,
        tabSize: 4,
        matchBrackets: true
    });

    // JavaScript Editor
    jsEditor = CodeMirror.fromTextArea(document.getElementById('jsInput'), {
        mode: 'javascript',
        theme: 'dracula',
        lineNumbers: true,
        autoCloseBrackets: true,
        lineWrapping: true,
        indentUnit: 4,
        tabSize: 4,
        matchBrackets: true
    });

    // Add change event for preview
    htmlEditor.on('change', debounceUpdatePreview);
    cssEditor.on('change', debounceUpdatePreview);
    jsEditor.on('change', debounceUpdatePreview);
    
    // Update cursor position
    htmlEditor.on('cursorActivity', updateCodeMirrorCursor);
    cssEditor.on('cursorActivity', updateCodeMirrorCursor);
    jsEditor.on('cursorActivity', updateCodeMirrorCursor);
}

// Debounce function for preview
function debounceUpdatePreview() {
    clearTimeout(previewTimeout);
    previewTimeout = setTimeout(updatePreview, 1000);
}

// Update cursor for CodeMirror
function updateCodeMirrorCursor(editor) {
    const pos = editor.getCursor();
    lineColSpan.textContent = `Ln ${pos.line + 1}, Col ${pos.ch + 1}`;
    updateWordCount();
}

// Override updatePreview for CodeMirror
function updatePreview() {
    const html = htmlEditor.getValue();
    const css = cssEditor.getValue();
    const js = jsEditor.getValue();

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

// Override save function for CodeMirror
function saveFile() {
    const content = {
        html: htmlEditor.getValue(),
        css: cssEditor.getValue(),
        js: jsEditor.getValue(),
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

// Initialize when DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    initEditors();
    setupEventListeners();
    updatePreview();
});
