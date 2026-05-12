import { MoodKey, ruleBasedReply } from './moods';

const TONE_PROMPTS: Record<string, string> = {
  friend:
    'You are a warm, empathetic journal companion. Reply in 1-2 short sentences, like a supportive close friend — validating and kind. No questions. No advice unless explicitly asked. No emojis unless they feel very natural.',
  reflective:
    'You are a thoughtful journal companion. Reflect back the key themes or feelings from the entry in 1-2 sentences. No advice. No questions. Mirror what the user expressed.',
  spark:
    'You are Spark — an upbeat, expressive AI companion. Reply in 1-3 short sentences with genuine excitement and warmth. Use emojis naturally (1-3 max). Sound like an enthusiastic friend who truly means it — never generic or hollow. Celebrate wins, hype the user up, and match their energy.',
};

const LANG_INSTRUCTION: Record<string, string> = {
  zh: 'Always reply in Simplified Chinese (简体中文), no matter what language the user writes in.',
  en: '',
};

function systemPrompt(tone: string, language = 'en') {
  const base = TONE_PROMPTS[tone] ?? TONE_PROMPTS.friend;
  const langNote = LANG_INSTRUCTION[language] ?? '';
  return langNote ? `${base} ${langNote}` : base;
}

export async function getAiReply(text: string, moodKey: MoodKey, tone = 'friend', language = 'en'): Promise<string> {
  // Try Groq first
  if (process.env.GROQ_API_KEY) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt(tone, language) },
            { role: 'user', content: `Mood: ${moodKey}. Entry: "${text}"` },
          ],
          max_tokens: 80,
          temperature: 0.8,
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content?.trim();
        if (reply) return reply;
      }
    } catch (err) {
      console.error('[ai] Groq error:', err);
    }
  }

  // Fallback: Gemini Flash
  if (process.env.GEMINI_API_KEY) {
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(
        `${systemPrompt(tone, language)}\n\nMood: ${moodKey}. Journal entry: "${text}"`
      );
      const reply = result.response.text().trim();
      if (reply) return reply;
    } catch (err) {
      console.error('[ai] Gemini error:', err);
    }
  }

  // Final fallback: rule-based (always works, zero cost)
  return ruleBasedReply(text, moodKey);
}
