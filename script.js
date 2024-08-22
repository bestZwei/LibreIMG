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

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            reader.onload = function(e) {
                const previewDiv = document.createElement('div');
                previewDiv.className = 'flex items-center mt-2';

                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = '预览';
                img.className = 'w-24 h-24 object-cover rounded-md shadow-md'; // 固定大小 150x150

                previewDiv.appendChild(img);
                imagePreviewArea.appendChild(previewDiv);
            }
            reader.readAsDataURL(file); // 读取文件为 Data URL
        }
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

    const promises = [];
    for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]); // 只上传当前文件

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://telegra.ph/upload', true);

        xhr.upload.addEventListener('progress', function(e) {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                progressBar.style.width = percentComplete + '%';
            }
        });

        promises.push(new Promise((resolve, reject) => {
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    const filePath = response.src; // 获取文件路径
                    const originalLink = `https://telegra.ph${filePath}`;
                    const proxyLink = `https://example.com${filePath}`; // 代理链接
                    const markdownLink = `![Image](${proxyLink})`;
                    const htmlLink = `<img src="${proxyLink}" alt="Uploaded Image">`;

                    // 将链接信息添加到结果区
                    const resultHtml = `
                        <div class="mt-2">
                            <p>原始链接: <span class="text-blue-300">${originalLink}</span></p>
                            <p>代理链接: <span class="text-blue-300">${proxyLink}</span></p>
                            <p>Markdown 格式: <span class="text-blue-300">${markdownLink}</span></p>
                            <p>HTML 格式: <span class="text-blue-300">${htmlLink}</span></p>
                        </div>
                    `;
                    resultDiv.innerHTML += resultHtml;
                    resolve();
                } else {
                    reject('上传失败，请重试。');
                }
            };
            xhr.onerror = () => reject('网络错误，请重试。');
            xhr.send(formData);
        }));
    }

    // 等待所有上传完成
    Promise.all(promises)
        .then(() => {
            progressContainer.classList.add('hidden');
            progressBar.style.width = '0%';
            resultDiv.classList.remove('hidden');
        })
        .catch(error => {
            alert(error);
            progressContainer.classList.add('hidden');
            progressBar.style.width = '0%';
        });
}
