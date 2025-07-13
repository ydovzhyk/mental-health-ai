import MemoryClient from 'mem0ai';

export const runtime = 'edge';
const mem0 = new MemoryClient({ apiKey: process.env.MEM0_API_KEY });

export async function POST(req) {
  const { user_id } = await req.json();
  console.log('check-history user_id:', user_id);

  try {
    const memAll = await mem0.getAll({
      user_id,
      version: 'v2',
      page: 1,
      page_size: 100, // якщо треба більше — можеш збільшити
    });

    console.log('Mem0 getAll results:', memAll);

    const results = memAll.results || [];
    const hasHistory = results.length > 0;

    const pairs = [];
    for (let i = 0; i < results.length; i += 2) {
      const userMessage = results[i];
      const assistantMessage = results[i + 1];

      // Перевіряємо, чи обидва є
      if (userMessage && assistantMessage) {
        pairs.push({
          user: userMessage.memory,
          assistant: assistantMessage.memory,
        });
      }
    }

    console.log('Pairs:', pairs);

    return new Response(JSON.stringify({ hasHistory, pairs }), {
      status: 200,
    });
  } catch (e) {
    console.error('Mem0 error in check-history:', e.message || e);
    return new Response(JSON.stringify({ hasHistory: false, pairs: [] }), {
      status: 200,
    });
  }
}
