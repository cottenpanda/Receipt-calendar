import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Remove data URL prefix if present
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    // Determine media type
    let mediaType = 'image/jpeg';
    if (image.startsWith('data:image/png')) {
      mediaType = 'image/png';
    } else if (image.startsWith('data:image/webp')) {
      mediaType = 'image/webp';
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: `Analyze this receipt image and extract the following information in JSON format:
{
  "storeName": "name of the store/restaurant",
  "date": "YYYY-MM-DD format if visible, otherwise null",
  "items": [
    { "name": "item name", "price": "price as number (e.g., 12.99)" }
  ]
}

Rules:
- Extract all line items with their prices
- Use the exact item names as shown on the receipt
- Prices should be numbers only, no currency symbols
- If date is not visible, set to null
- If store name is not clear, make your best guess
- Only return the JSON, no other text`,
            },
          ],
        },
      ],
    });

    // Parse the response
    const content = response.content[0].text;

    // Try to extract JSON from the response
    let extractedData;
    try {
      extractedData = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse receipt data');
      }
    }

    res.json(extractedData);
  } catch (error) {
    console.error('Error extracting receipt:', error);
    res.status(500).json({ error: error.message || 'Failed to extract receipt data' });
  }
}
