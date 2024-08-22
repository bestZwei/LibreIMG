document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const progress = document.getElementById('uploadProgress');
    const resultDiv = document.getElementById('result');

    if (!file) return;

    const formData = new FormData();
    formData.append('file0', file);

    progress.style.display = 'block';

    try {
        const response = await fetch('https://telegra.ph/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('上传失败，请重试。');
        }

        const data = await response.json();
        const originalUrl = `https://telegra.ph/file/${data[0].path}`;
        const proxyUrl = `https://example.com/file/${data[0].path.split('/').pop()}`;
        const markdownLink = `![${file.name}](${proxyUrl})`;
        const htmlLink = `<img src="${proxyUrl}" />`;

        resultDiv.innerHTML = `
            <p>原链接: <a href="${originalUrl}" target="_blank">${originalUrl}</a></p>
            <p>代理链接: <a href="${proxyUrl}" target="_blank">${proxyUrl}</a></p>
            <p>Markdown 格式链接: <code>${markdownLink}</code> <button class="copy-button" onclick="copyToClipboard('${markdownLink}')">复制</button></p>
            <p>HTML 格式插入链接: <code>${htmlLink}</code> <button class="copy-button" onclick="copyToClipboard('${htmlLink}')">复制</button></p>
        `;
    } catch (error) {
        resultDiv.innerHTML = `<p>${error.message}</p>`;
    } finally {
        progress.style.display = 'none';
    }
});

// 拖拽上传功能
const dropZone = document.getElementById('dropZone');
dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.classList.add('hover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('hover');
});

dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('hover');
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files; // 设置文件输入的文件
    }
});

// 复制到剪贴板
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('链接已复制到剪贴板！');
    }).catch(err => {
        console.error('复制失败', err);
    });
}
