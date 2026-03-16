const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/remove-style-tag', (req, res) => {
  const { htmlCode } = req.body;
  if (!htmlCode) {
    return res.status(400).json({ error: 'htmlCode is required' });
  }
  // Remove <style> tags and their content
  const cleanedText = htmlCode.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  res.json({ result: cleanedText });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});