import { GoogleGenAI, Type, Schema } from '@google/genai';
import { addDays, format, parse, setHours, setMinutes } from 'date-fns';

export async function extractEventsFromText(text: string) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '');
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `Anda diberikan sebuah teks kalender produksi konten atau uraian jadwal mingguan.\n\nEkstrak daftar acara yang disebutkan di dalamnya ke dalam format JSON.\n\nTeks jadwal:\n${text}`;

  const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
          systemInstruction: "Anda adalah asisten penjadwalan cerdas. Ekstrak data acara menjadi array.",
          responseMimeType: "application/json",
          responseSchema: {
              type: Type.ARRAY,
              items: {
                  type: Type.OBJECT,
                  properties: {
                      summary: { type: Type.STRING, description: "Judul acara (contoh: 'Riset Topik', 'Syuting Batching')" },
                      description: { type: Type.STRING, description: "Catatan atau rincian tambahan" },
                      dayOffset: { type: Type.INTEGER, description: "Berapa hari dari sekarang acara tersebut akan dilakukan (contoh: 0 untuk Senin/hari ini, 1 untuk Selasa besok, 6 untuk Minggu dll. Asumsikan hari 0 adalah hari mulai minggu ini)" },
                      hour: { type: Type.INTEGER, description: "Jam mulai dalam format 24-jam (misal: 14)" }
                  },
                  required: ["summary", "description", "dayOffset", "hour"]
              }
          }
      },
  });

  const jsonStr = response.text;
  if (!jsonStr) return [];
  
  const parsed = JSON.parse(jsonStr);
  const now = new Date();
  
  return parsed.map((item: any) => {
      let date = addDays(now, item.dayOffset);
      date = setHours(date, item.hour || 9);
      date = setMinutes(date, 0);
      
      const endDate = new Date(date);
      endDate.setHours(endDate.getHours() + 1); // 1 jam secara default
      
      return {
          summary: item.summary,
          description: item.description,
          start: date.toISOString(),
          end: endDate.toISOString()
      };
  });
}
