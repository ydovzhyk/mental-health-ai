import { convertToCoreMessages, streamText, smoothStream } from 'ai';
import { openai } from '@ai-sdk/openai';
import MemoryClient from 'mem0ai';
import path from 'path';
import fs from 'fs/promises';
import { promptMentalHealth } from '@/data/promts/promptMentalHealth';

// export const runtime = 'edge';
export const runtime = 'nodejs';
const mem0 = new MemoryClient({ apiKey: process.env.MEM0_API_KEY });
const FILE_PATH = path.resolve(
  process.cwd(),
  'src',
  'data',
  'userConsent.json'
);
const saveSignalRegex = /\[TOOL: SAVE_HISTORY\]/i;
const dontSaveSignalRegex = /\[TOOL: DONT_SAVE_HISTORY\]/i;

const getConsent = async userId => {
  try {
    const file = await fs.readFile(FILE_PATH, 'utf-8');
    const data = JSON.parse(file);
    return data[userId]?.saveHistory;
  } catch (e) {
    return undefined;
  }
};

const setConsent = async (userId, saveHistory) => {
  let data = {};
  try {
    const file = await fs.readFile(FILE_PATH, 'utf-8');
    data = JSON.parse(file);
  } catch (e) {
    console.error('Error reading consent file:', e.message || e);
  }

  data[userId] = { saveHistory };

  await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2));

  if (!saveHistory) {
    try {
      await mem0.deleteAll({ user_id: userId });
    } catch (e) {
      console.error(
        `Error deleting memories for user ${userId}:`,
        e.message || e
      );
    }
  }
};

export async function POST(req) {
  const { messages, user_id, initial_greet } = await req.json();
  let memoryContext = '';

  if (initial_greet) {
    try {
      const memSearch = await mem0.search('*', {
        filters: { AND: [{ user_id }] },
        api_version: 'v2',
      });

      console.log('Mem0 search results in agent-ai:', memSearch);

      if (Array.isArray(memSearch) && memSearch.length > 0) {
        const formattedMemories = memSearch
          .map((r, i) => {
            const date = r.created_at
              ? new Date(r.created_at).toLocaleDateString()
              : 'Unknown date';
            return `#${i + 1} (${date}): ${r.memory}`;
          })
          .join('\n\n');

        memoryContext = `This user has chatted with you before. Here is the summarized context with dates:\n\n${formattedMemories}\n\nIf the last message is older than 1 day, greet them gently with: "Welcome back. I'm here for you again. Above you can read our previous conversation, and I'm always here to support you. What would you like to talk about today?". Otherwise, just continue as usual. Include a summary so that the user can remember what you talked about.`;
      } else {
        memoryContext = ``;
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


  const finalMessages = [
    { role: 'system', content: promptMentalHealth },
    ...(memoryContext ? [{ role: 'system', content: memoryContext }] : []),
    ...messages,
  ];

  const result = await streamText({
    model: openai('gpt-4o'),
    messages: convertToCoreMessages(finalMessages),
    temperature: 0.2,
    maxSteps: 5,
    experimental_transform: smoothStream({
      chunking: 'word',
      delayInMs: 15,
    }),
  });

  const streamResponse = result.toDataStreamResponse();

  let fullAssistantReply = '';

  async function collectAndSave() {
    for await (const delta of result.textStream) {
      fullAssistantReply += delta;
    }
    console.log('Full assistant reply:', fullAssistantReply);

    if (saveSignalRegex.test(fullAssistantReply)) {
      await setConsent(user_id, true);
    }
    if (dontSaveSignalRegex.test(fullAssistantReply)) {
      await setConsent(user_id, false);
    }

    const userConsent = await getConsent(user_id);

    if (userConsent) {
      console.log('Saving conversation to Mem0...');
      const cleanedReply = fullAssistantReply
        .replace(saveSignalRegex, '')
        .replace(dontSaveSignalRegex, '')
        .trim();

        await mem0.add([{ role: 'user', content: userLastMessage }], {
          user_id,
          org_id: process.env.MEM0_ORG_ID,
          project_id: process.env.MEM0_PROJECT_ID,
        });

        await mem0.add([{ role: 'assistant', content: cleanedReply }], {
          user_id,
          org_id: process.env.MEM0_ORG_ID,
          project_id: process.env.MEM0_PROJECT_ID,
        });
    }
  }

  collectAndSave();

  return streamResponse;
}

