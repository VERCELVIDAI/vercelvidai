const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/GEMINI_API_KEY="([^"]+)"/);
const apiKey = match ? match[1] : '';

const ai = new GoogleGenAI({ apiKey });

async function testGen() {
  const prompt = 'A simple geometric minimalist green circle on a white background, high quality';
  
  console.log('--- Attempt 1: ai.models.generateImages with gemini-3.1-flash-image ---');
  try {
    const res = await ai.models.generateImages({
      model: 'gemini-3.1-flash-image',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      }
    });
    console.log('Success generateImages with gemini-3.1-flash-image!');
    console.log('Result keys:', Object.keys(res));
    if (res.generatedImages && res.generatedImages.length > 0) {
      console.log('Image bytes length:', res.generatedImages[0].image.imageBytes.length);
      return;
    }
  } catch (err) {
    console.log('Attempt 1 error:', err.message || err);
  }

  console.log('\n--- Attempt 2: ai.models.generateContent with gemini-3.1-flash-image ---');
  try {
    const res2 = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image',
      contents: prompt,
    });
    console.log('Success generateContent with gemini-3.1-flash-image!');
    console.log('Candidates count:', res2.candidates?.length);
    if (res2.candidates && res2.candidates[0].content?.parts) {
      for (const p of res2.candidates[0].content.parts) {
        console.log('Part keys:', Object.keys(p));
        if (p.inlineData) {
          console.log('Found inlineData! Mime:', p.inlineData.mimeType, 'Data length:', p.inlineData.data.length);
        }
      }
    }
  } catch (err2) {
    console.log('Attempt 2 error:', err2.message || err2);
  }

  console.log('\n--- Attempt 3: ai.models.generateImages with imagen-3.0-generate-002 ---');
  try {
    const res3 = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      }
    });
    console.log('Success generateImages with imagen-3.0-generate-002!');
    if (res3.generatedImages && res3.generatedImages.length > 0) {
      console.log('Image bytes length:', res3.generatedImages[0].image.imageBytes.length);
      return;
    }
  } catch (err3) {
    console.log('Attempt 3 error:', err3.message || err3);
  }
}

testGen();
