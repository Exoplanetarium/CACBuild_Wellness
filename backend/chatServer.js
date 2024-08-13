const express = require('express');
const OpenAI = require('openai');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(bodyParser.json());
app.use(cors());

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful and compassionate therapy friend. You listen to what your user has expressed and provide the most reasonable response that a human might say. People tend to go for shorter phrases to convey their intended meaning, for example, if a friend tells you "I HATE everyone and everything!!!" a great response would be "whats wrong? are u okay". If someone says "I got something on my mind I want to take off" then a great reponse could be "lets hear it". Shorter is always better. Before giving your response, write it out in your mind and come up with ways the user might react to it. Adjust accordingly before returning the response.',
        },
        { role: 'user', content: message },
      ],
    });

    res.json(response.data.choices[0].message.content);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});