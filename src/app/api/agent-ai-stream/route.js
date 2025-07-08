import { convertToCoreMessages, streamText, smoothStream } from 'ai';
import { openai } from '@ai-sdk/openai';
import MemoryClient from 'mem0ai';
import { promptMentalHealth } from '@/data/promts/promptMentalHealth';

export const runtime = 'edge';

const mem0 = new MemoryClient({ apiKey: process.env.MEM0_API_KEY });

export async function POST(req) {
  const { messages, user_id, initial_greet } = await req.json();

  let memoryContext = '';

  if (initial_greet) {
    try {
      const memSearch = await mem0.search('*', {
        filters: { AND: [{ user_id }] },
        api_version: 'v2',
      });

      console.log('Mem0 search result:', memSearch);

      if (Array.isArray(memSearch) && memSearch.length > 0) {
        const formattedMemories = memSearch
          .map((r, i) => {
            const date = r.created_at
              ? new Date(r.created_at).toLocaleDateString()
              : 'Unknown date';
            return `#${i + 1} (${date}): ${r.memory}`;
          })
          .join('\n\n');

        memoryContext = `This user has chatted with you before. Here is the summarized context with dates:\n\n${formattedMemories}\n\nIf the last message is older than 1 day, greet them gently with: "Welcome back. I'm here for you again. Above you can read our previous conversation, and I'm always here to support you. What would you like to talk about today?". Otherwise, just continue as usual.`;
      } else {
        memoryContext = `This is the user's first time. Please greet them warmly and invite them to share how they are feeling today.`;
      }
    } catch (e) {
      console.error('❌ Mem0 error during initial_greet:', e.message || e);
      memoryContext = `We couldn't retrieve previous history. Please greet the user warmly and start fresh.`;
    }
  }

  const userLastMessage = messages
    ?.slice()
    .reverse()
    .find(msg => msg.role === 'user')?.content;

  // const finalMessages = [
  //   { role: 'system', content: promptMentalHealth },
  //   ...messages,
  // ];

  const finalMessages = [
    { role: 'system', content: promptMentalHealth },
    ...(memoryContext ? [{ role: 'system', content: memoryContext }] : []),
    ...messages,
  ];

  const result = await streamText({
    model: openai('gpt-4o'),
    messages: convertToCoreMessages(finalMessages),
    temperature: 0.4,
    maxSteps: 5,
    experimental_transform: smoothStream({
      chunking: 'word',
      delayInMs: 15,
    }),
  });

  const streamResponse = result.toDataStreamResponse();

  // Збираємо відповідь асистента для збереження
  let fullAssistantReply = '';

  async function collectAndSave() {
    try {
      for await (const delta of result.textStream) {
        fullAssistantReply += delta;
      }

      // Перевірка, чи бот вставив сигнал виклику тула
      const saveSignalRegex = /\[TOOL: SAVE_HISTORY\]/i;
      const shouldSave = saveSignalRegex.test(fullAssistantReply);

      if (shouldSave) {
        // Видаляємо сигнал перед збереженням
        const cleanedReply = fullAssistantReply
          .replace(saveSignalRegex, '')
          .trim();

        await mem0.add(
          [
            { role: 'user', content: userLastMessage },
            { role: 'assistant', content: cleanedReply },
          ],
          {
            user_id,
            org_id: process.env.MEM0_ORG_ID,
            project_id: process.env.MEM0_PROJECT_ID,
            metadata: { question: userLastMessage },
          }
        );
      }
    } catch (e) {
      console.error('Mem0 save error:', e.message || e);
    }
  }

  collectAndSave();

  return streamResponse;
}

