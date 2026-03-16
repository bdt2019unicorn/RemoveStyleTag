const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

function removeStyleTags(htmlCode) {
  return htmlCode.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
}

app.get('/', (req, res) => {
  console.log('Received GET request at /');
  res.send('Hello World! Testing');
});

app.post('/remove-style-tag', (req, res) => {
  const { htmlCode } = req.body;
  if (!htmlCode) {
    return res.status(400).json({ error: 'htmlCode is required' });
  }
  // Remove <style> tags and their content
  const cleanedText = removeStyleTags(htmlCode);
  res.json({ result: cleanedText });
});

app.post('/visit-website-and-remove-styles', async (req, res) => {
  const { url } = req.body;
  console.log('Received URL:', url);
  if (!url) {
    return res.status(400).json({ error: 'url is required' });
  }
  try {
    const response = await axios.get(url);
    let htmlContent = response.data;
    htmlContent = removeStyleTags(htmlContent);
    res.send(htmlContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});