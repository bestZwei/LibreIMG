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
    if (files.length > 0) {
        const fileInfo = document.getElementById('fileInfo');
        fileInfo.classList.remove('hidden');
        fileInfo.textContent = '选择成功！';

        const previewImage = document.getElementById('previewImage');
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            document.getElementById('imagePreview').classList.remove('hidden');
        }
        reader.readAsDataURL(files[0]); // 只显示第一个文件的预览
    }
}

async function uploadImage() {
    const input = document.getElementById('fileInput');
    const files = input.files;
    if (files.length === 0) {
        alert('请选择一个文件');
        return;
    }

    const formData = new FormData();
    formData.append('file', files[0]); // 只上传第一个文件

    const progressBar = document.querySelector('.progress-bar');
    const progressContainer = document.querySelector('.progress');
    const resultDiv = document.getElementById('result');

    progressContainer.classList.remove('hidden');
    resultDiv.classList.add('hidden');
    progressBar.style.width = '0%';

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
            const filePath = response.src; // 获取文件路径
            const originalLink = `https://telegra.ph${filePath}`;
            const proxyLink = `https://example.com${filePath}`; // 代理链接
            const markdownLink = `![Image](${proxyLink})`;
            const htmlLink = `<img src="${proxyLink}" alt="Uploaded Image">`;

            document.getElementById('original-link').textContent = originalLink;
            document.getElementById('proxy-link').textContent = proxyLink;
            document.getElementById('markdown-link').textContent = markdownLink;
            document.getElementById('html-link').textContent = htmlLink;

            resultDiv.classList.remove('hidden');
        } else {
            alert('上传失败，请重试。');
        }
        progressContainer.classList.add('hidden');
        progressBar.style.width = '0%';
    };

    xhr.send(formData);
}
