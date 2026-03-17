const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

function removeStyleTags(htmlCode) {
  return htmlCode.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
}

function findEmails(htmlString) {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const matches = htmlString.match(emailRegex) || [];
  return [...new Set(matches)];
}

async function visitWebsiteAndGetEmail(url)
{
  try 
  {
    const response = await axios.get(url);
    console.log(url); 
    const emails = findEmails(response.data);
    console.log({url, emails});
    
    return emails || [];
  }
  catch
  {
    return []; 
  }

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

app.post('/extract-emails', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'url is required' });
  }
  try {
    const email = await visitWebsiteAndGetEmail(url);
    res.send(email);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/extract-all-emails', async (req, res) => {
  const { urls } = req.body;
  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: 'urls must be an array' });
  }
  try {
    const emailResults = await Promise.all(urls.map(async (url) => {
      const email = await visitWebsiteAndGetEmail(url);
      return email ?? "na"; 
    }));
    res.send(emailResults);
  } catch (error) {

    console.error('Error extracting emails:', error);
    res.status(500).json({ error: error.message });
  }
}); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});