document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const uploadSection = document.getElementById('upload-section');
    const resultDiv = document.getElementById('result');
    const form = document.getElementById('upload-form');

    loginButton.addEventListener('click', () => {
        const clientId = 'your-github-client-id';
        const redirectUri = encodeURIComponent(window.location.origin + '/callback');
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo`;
        window.location.href = githubAuthUrl;
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const fileInput = document.getElementById('image-file');
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('github_token')}`,
            },
        });

        const data = await response.json();
        if (data.url) {
            resultDiv.innerHTML = `
                <p>图片上传成功:</p>
                <p>图片链接: <a href=\"${data.url}\" target=\"_blank\">${data.url}</a></p>
                <p>HTML 格式引用: <code>&lt;img src=\"${data.url}\" alt=\"Image\"&gt;</code></p>
                <p>Markdown 格式引用: <code>![Image](${data.url})</code></p>
            `;
        } else {
            resultDiv.textContent = '图片上传失败，请重试。';
        }
    });

    // 检查是否已登录
    const token = localStorage.getItem('github_token');
    if (token) {
        document.getElementById('login-section').style.display = 'none';
        uploadSection.style.display = 'block';
    }
});