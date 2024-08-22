document.getElementById('uploadForm').onsubmit = function(event) {
    event.preventDefault(); // 防止默认表单提交

    const formData = new FormData(this);
    const fileInput = document.getElementById('select-file');

    // 显示进度条
    const progressBar = document.querySelector('.progress');
    const progressBarElement = document.querySelector('.progress-bar');
    progressBar.classList.remove('hidden');
    progressBarElement.style.width = '0%';

    // 创建一个新的 XMLHttpRequest 对象
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://telegra.ph/upload', true);
    
    // 更新进度条
    xhr.upload.onprogress = function(event) {
        if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            progressBarElement.style.width = percentComplete + '%';
        }
    };

    // 处理响应
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            const response = xhr.responseText;
            const parser = new DOMParser();
            const doc = parser.parseFromString(response, 'text/html');
            const filePath = doc.querySelector('img').src; // 获取上传后的图片链接

            // 生成结果
            const originDomain = window.location.origin;
            const proxyUrl = `${originDomain}${filePath}`;
            const markdownLink = `![Image](${filePath})`;
            const htmlLink = `<img src="${filePath}" alt="Image">`;

            const resultHtml = `
                <div class="result-item">
                    <label>原始链接:</label>
                    <input type="text" value="${filePath}" readonly class="w-full p-2 border border-gray-300 rounded mb-2">
                    <label>代理链接:</label>
                    <input type="text" value="${proxyUrl}" readonly class="w-full p-2 border border-gray-300 rounded mb-2">
                    <label>Markdown 格式:</label>
                    <input type="text" value="${markdownLink}" readonly class="w-full p-2 border border-gray-300 rounded mb-2">
                    <label>HTML 格式:</label>
                    <input type="text" value="${htmlLink}" readonly class="w-full p-2 border border-gray-300 rounded mb-2">
                </div>
            `;

            document.getElementById('result').innerHTML = resultHtml;
        } else {
            alert('上传失败，请重试。');
        }
        // 隐藏进度条
        progressBarElement.style.width = '0%';
        progressBar.classList.add('hidden');
    };

    // 提交表单
    xhr.send(formData);
};

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('已复制到剪贴板');
}
