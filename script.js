document.getElementById('uploadForm').onsubmit = function(event) {
    event.preventDefault(); // 防止默认表单提交

    const formData = new FormData(this);
    const fileInput = document.getElementById('select-file');

    // 直接提交表单
    const iframe = document.createElement('iframe');
    iframe.name = 'uploadTarget';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    iframe.onload = function() {
        const response = iframe.contentDocument.body.innerHTML;
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
                <p>原始链接: <a href="${filePath}" target="_blank">${filePath}</a></p>
                <p>代理链接: <a href="${proxyUrl}" target="_blank">${proxyUrl}</a></p>
                <p>Markdown 格式: <code>${markdownLink}</code> <button onclick="copyToClipboard('${markdownLink}')">复制</button></p>
                <p>HTML 格式: <code>${htmlLink}</code> <button onclick="copyToClipboard('${htmlLink}')">复制</button></p>
            </div>
        `;

        document.getElementById('result').innerHTML = resultHtml;
    };

    // 提交表单
    this.target = 'uploadTarget';
    this.submit();
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
