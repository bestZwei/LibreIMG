document.getElementById('uploadContainer').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.getElementById('uploadContainer').addEventListener('dragover', (event) => {
    event.preventDefault();
    document.getElementById('uploadContainer').classList.add('dragover');
});

document.getElementById('uploadContainer').addEventListener('dragleave', () => {
    document.getElementById('uploadContainer').classList.remove('dragover');
});

document.getElementById('uploadContainer').addEventListener('drop', (event) => {
    event.preventDefault();
    document.getElementById('uploadContainer').classList.remove('dragover');
    document.getElementById('fileInput').files = event.dataTransfer.files;
});

async function uploadImage() {
    const input = document.getElementById('fileInput');
    const files = input.files;
    if (files.length === 0) {
        alert('请选择一个文件');
        return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
    }

    const progressBar = document.querySelector('.progress-bar');
    document.querySelector('.progress').style.display = 'block';
    progressBar.style.width = '50%';

    try {
        const response = await fetch('https://telegra.ph/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('上传失败');
        }

        const result = await response.json();
        progressBar.style.width = '100%';

        let resultHtml = '';
        result.forEach(item => {
            const filePath = item.src;
            const originDomain = window.location.origin;
            const proxyUrl = `${originDomain}${filePath}`;
            const markdownLink = `![Image](https://telegra.ph${filePath})`;
            const htmlLink = `<img src="https://telegra.ph${filePath}" alt="Image">`;

            resultHtml += `
                <div class="result-item">
                    <p>原始链接: <a href="https://telegra.ph${filePath}" target="_blank">https://telegra.ph${filePath}</a></p>
                    <p>代理链接: <a href="${proxyUrl}" target="_blank">${proxyUrl}</a></p>
                    <p>Markdown 格式: <code>${markdownLink}</code> <button onclick="copyToClipboard('${markdownLink}')">复制</button></p>
                    <p>HTML 格式: <code>${htmlLink}</code> <button onclick="copyToClipboard('${htmlLink}')">复制</button></p>
                </div>
            `;
        });

        document.getElementById('result').innerHTML = resultHtml;
    } catch (error) {
        alert('上传过程中发生错误: ' + error.message);
    } finally {
        progressBar.style.width = '0%';
        document.querySelector('.progress').style.display = 'none';
        input.value = ''; // 清除文件输入
    }
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('已复制到剪贴板');
}
