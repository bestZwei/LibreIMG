document.getElementById('uploadContainer').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.getElementById('uploadContainer').addEventListener('dragover', (event) => {
    event.preventDefault();
    document.getElementById('uploadContainer').classList.add('bg-gray-700');
});

document.getElementById('uploadContainer').addEventListener('dragleave', () => {
    document.getElementById('uploadContainer').classList.remove('bg-gray-700');
});

document.getElementById('uploadContainer').addEventListener('drop', (event) => {
    event.preventDefault();
    document.getElementById('uploadContainer').classList.remove('bg-gray-700');
    document.getElementById('fileInput').files = event.dataTransfer.files;
    displayFileInfo();
});

document.getElementById('fileInput').addEventListener('change', () => {
    displayFileInfo();
});

function displayFileInfo() {
    const input = document.getElementById('fileInput');
    const files = input.files;
    const imagePreviewArea = document.getElementById('imagePreviewArea');
    imagePreviewArea.innerHTML = ''; // 清空之前的预览

    if (files.length > 0) {
        const fileInfo = document.getElementById('fileInfo');
        fileInfo.classList.remove('hidden');
        fileInfo.textContent = '选择成功！';

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const previewContainer = document.createElement('div');
                previewContainer.className = 'flex items-center mt-2';

                const previewImage = document.createElement('img');
                previewImage.src = e.target.result;
                previewImage.alt = '预览';
                previewImage.className = 'w-24 h-24 rounded-md shadow-md'; // 固定大小 150x150

                const linkContainer = document.createElement('div');
                linkContainer.className = 'ml-4 w-2/3';

                const originalLinkInput = document.createElement('input');
                originalLinkInput.type = 'text';
                originalLinkInput.className = 'bg-gray-700 text-white w-full rounded p-1';
                originalLinkInput.placeholder = '原始链接';
                originalLinkInput.readOnly = true;

                const proxyLinkInput = document.createElement('input');
                proxyLinkInput.type = 'text';
                proxyLinkInput.className = 'bg-gray-700 text-white w-full rounded p-1';
                proxyLinkInput.placeholder = '代理链接';
                proxyLinkInput.readOnly = true;

                const markdownLinkInput = document.createElement('input');
                markdownLinkInput.type = 'text';
                markdownLinkInput.className = 'bg-gray-700 text-white w-full rounded p-1';
                markdownLinkInput.placeholder = 'Markdown 格式';
                markdownLinkInput.readOnly = true;

                const htmlLinkInput = document.createElement('input');
                htmlLinkInput.type = 'text';
                htmlLinkInput.className = 'bg-gray-700 text-white w-full rounded p-1';
                htmlLinkInput.placeholder = 'HTML 格式';
                htmlLinkInput.readOnly = true;

                linkContainer.appendChild(originalLinkInput);
                linkContainer.appendChild(proxyLinkInput);
                linkContainer.appendChild(markdownLinkInput);
                linkContainer.appendChild(htmlLinkInput);

                previewContainer.appendChild(previewImage);
                previewContainer.appendChild(linkContainer);
                imagePreviewArea.appendChild(previewContainer);
            }
            reader.readAsDataURL(file); // 读取文件
        });
    }
}

async function uploadImages() {
    const input = document.getElementById('fileInput');
    const files = input.files;
    if (files.length === 0) {
        alert('请选择至少一个文件');
        return;
    }

    const progressBar = document.querySelector('.progress-bar');
    const progressContainer = document.querySelector('.progress');
    const resultDiv = document.getElementById('result');

    progressContainer.classList.remove('hidden');
    resultDiv.classList.add('hidden');
    progressBar.style.width = '0%';

    const promises = Array.from(files).map(file => {
        const formData = new FormData();
        formData.append('file', file);

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://telegra.ph/upload', true);

            xhr.upload.addEventListener('progress', function(e) {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    progressBar.style.width = percentComplete + '%';
                }
            });

            xhr.onload = function() {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    const filePath = response[0].src; // 获取文件路径
                    const originalLink = `https://telegra.ph${filePath}`;
                    const proxyLink = `https://example.com${filePath}`; // 代理链接
                    const markdownLink = `![Image](${proxyLink})`;
                    const htmlLink = `<img src="${proxyLink}" alt="Uploaded Image">`;

                    // 更新链接到相应的输入框
                    const previewContainer = document.querySelector(`#imagePreviewArea div:last-child`);
                    previewContainer.querySelector('input[placeholder="原始链接"]').value = originalLink;
                    previewContainer.querySelector('input[placeholder="代理链接"]').value = proxyLink;
                    previewContainer.querySelector('input[placeholder="Markdown 格式"]').value = markdownLink;
                    previewContainer.querySelector('input[placeholder="HTML 格式"]').value = htmlLink;

                    resolve();
                } else {
                    reject('上传失败，请重试。');
                }
            };

            xhr.send(formData);
        });
    });

    try {
        await Promise.all(promises);
        resultDiv.classList.remove('hidden');
    } catch (error) {
        alert(error);
    } finally {
        progressContainer.classList.add('hidden');
        progressBar.style.width = '0%';
    }
}
