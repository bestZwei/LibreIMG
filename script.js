document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;
    const progress = document.getElementById('uploadProgress');
    const resultDiv = document.getElementById('result');

    if (files.length === 0) return;

    const formData = new FormData();
    for (const file of files) {
        formData.append('file0', file);
    }

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
        const originalUrl = `https://telegra.ph/file/${data[0].path}`; // Telegra.ph 原链接
        const proxyUrl = `https://example.com/file/${data[0].path.split('/').pop()}`; // 代理链接
        const markdownLink = `![${files[0].name}](${proxyUrl})`; // Markdown 格式链接
        const htmlLink = `<img src="${proxyUrl}" />`; // HTML 格式插入链接

        resultDiv.innerHTML = `
            <p>原链接: <a href="${originalUrl}" target="_blank">${originalUrl}</a></p>
            <p>代理链接: <a href="${proxyUrl}" target="_blank">${proxyUrl}</a></p>
            <p>Markdown 格式链接: <code>${markdownLink}</code></p>
            <p>HTML 格式插入链接: <code>${htmlLink}</code></p>
            <img src="${originalUrl}" alt="Uploaded Image" />
        `;

        // 自动复制链接到剪贴板
        navigator.clipboard.writeText(proxyUrl).then(() => {
            console.log('代理链接已复制到剪贴板');
        });
    } catch (error) {
        resultDiv.innerHTML = `<p>${error.message}</p>`;
    } finally {
        progress.style.display = 'none';
    }
});

// 拖拽上传功能
const dropArea = document.getElementById('dropArea');

dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropArea.classList.add('hover');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('hover');
});

dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dropArea.classList.remove('hover');
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files; // 将拖拽的文件赋值给文件输入框
    }
});
