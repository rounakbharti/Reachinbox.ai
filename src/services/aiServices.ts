import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    maxOutputTokens: 50,
    temperature: 0.7,
  },
});

export const generateSmartReplies = async (threadBody: string): Promise<string[]> => {
  try {
    const prompt = `
      Given the following email thread message: "${threadBody}"
      Generate 3 professional email reply suggestions (each 10-20 words).
      Focus on context-aware, actionable responses.
    `;
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const suggestions = responseText
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => line.replace(/^\d+\.\s*/, '').trim())
      .slice(0, 5);

    while (suggestions.length < 3) {
      suggestions.push('Thanks for your message. I’ll review and get back soon.');
    }
    return suggestions;
  } catch (error) {
    console.error('Error generating smart replies with Gemini:', error);
    return [
      'Thanks for reaching out. I’ll follow up soon.',
      'Can you clarify your request? Happy to assist!',
      'Looking forward to discussing this further.',
    ];
  }
};

export const summarizeThread = async (thread: { fromName: string; sentAt: string; body: string }[]): Promise<string> => {
  try {
    const prompt = `
      Summarize this email thread concisely in 20-30 words:
      ${thread.map((m) => `${m.fromName} (${m.sentAt}): ${m.body}`).join('\n')}
    `;
    
    const result = await model.generateContent(prompt);
    const summary = result.response.text().trim();
    return summary;
  } catch (error) {
    console.error('Error summarizing thread with Gemini:', error);
    return thread.map((m) => `${m.fromName} ${m.sentAt.split(' ')[0]}: ${m.body.slice(0, 20)}`).join('; ') || 'Failed to summarize thread';
  }
};



export const summarizeMail = async (mail: { fromName: string; sentAt: string; body: string }): Promise<string> => {
    try {
      const prompt = `
        Summarize this email concisely in 10-15 words:
        From: ${mail.fromName} (${mail.sentAt})
        Body: ${mail.body}
      `;
      const result = await model.generateContent(prompt);
      const summary = result.response.text().trim();
      return summary;
    } catch (error) {
      console.error('Error summarizing mail with Gemini:', error);
      // Fallback to a truncated version if AI fails
      return `${mail.fromName} ${mail.sentAt.split(' ')[0]}: ${mail.body.slice(0, 20)}...`;
    }
  };