const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const axios = require('axios');
const { Octokit } = require('@octokit/rest');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

const clientId = 'your-github-client-id'; // 替换为你的 GitHub Client ID
const clientSecret = 'your-github-client-secret'; // 替换为你的 GitHub Client Secret
const owner = 'your-github-username'; // 替换为你的 GitHub 用户名
const repo = 'your-github-repo'; // 替换为你的 GitHub 仓库名

app.get('/callback', async (req, res) => {
    const code = req.query.code;
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
        client_id: clientId,
        client_secret: clientSecret,
        code,
    }, {
        headers: {
            Accept: 'application/json',
        },
    });

    const token = tokenResponse.data.access_token;
    res.redirect(`/?token=${token}`);
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const octokit = new Octokit({ auth: token });
    
    try {
        const file = req.file;
        const fileName = file.originalname;
        const content = file.buffer.toString('base64');

        const response = await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: `images/${fileName}`,
            message: `Upload ${fileName}`,
            content,
        });

        const url = `https://raw.githubusercontent.com/${owner}/${repo}/main/images/${fileName}`;
        res.json({ url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});