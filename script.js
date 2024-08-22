document.getElementById('uploadForm').onsubmit = function(event) {
    event.preventDefault(); // 防止默认表单提交

    const formData = new FormData(this);
    const progressBar = document.querySelector('.progress');
    const progressBarElement = document.querySelector('.progress-bar');
    progressBar.classList.remove('hidden');
    progressBarElement.style.width = '0%';

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://telegra.ph/upload', true);
    
    xhr.upload.onprogress = function(event) {
        if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            progressBarElement.style.width = percentComplete + '%';
        }
    };

    xhr.onload = function() {
        progressBar.classList.add('hidden');
        if (xhr.status >= 200 && xhr.status < 300) {
            const response = xhr.responseText;
            const parser = new DOMParser();
            const doc = parser.parseFromString(response, 'text/html');
            const filePath = doc.querySelector('img').src; // 获取上传后的图片链接

            displayLinks(filePath);
        } else {
            alert('上传失败，请重试。');
        }
    };

    xhr.onerror = function() {
        progressBar.classList.add('hidden');
        alert('网络错误，请检查您的连接。');
    };

    xhr.send(formData);
};

function displayLinks(filePath) {
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
}
