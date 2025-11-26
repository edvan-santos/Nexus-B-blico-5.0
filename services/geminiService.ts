import { GoogleGenAI } from "@google/genai";

// Initialize the Google Gemini API client. The API key is assumed to be available in `process.env.API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const fetchVerseText = async (reference: string, version: string = 'NVI'): Promise<string> => {
  try {
    const prompt = `Busque o texto completo do versículo bíblico '${reference}'. Use a versão da bíblia ${version}. Se a referência incluir uma letra (ex: '4a', '2b'), retorne apenas a parte correspondente do versículo. Sua resposta deve conter APENAS o texto do versículo, seguido pela sigla da versão entre parênteses. Exemplo de resposta: 'O Senhor é o meu pastor; de nada terei falta. (NVI)'`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error fetching verse text from Gemini API:", error);
    throw new Error("Falha ao buscar o texto do versículo. Verifique a referência e tente novamente.");
  }
};
