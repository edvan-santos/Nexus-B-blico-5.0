import { GoogleGenAI } from "@google/genai";

export const fetchVerseText = async (reference: string, version: string = 'NVI'): Promise<string> => {
  try {
    // Initialize the Google Gemini API client inside the function to ensure process.env is ready
    // and to handle potential configuration errors gracefully during the request.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

    const prompt = `Busque o texto completo do versículo bíblico '${reference}'. Use a versão da bíblia ${version}. Se a referência incluir uma letra (ex: '4a', '2b'), retorne apenas a parte correspondente do versículo. Sua resposta deve conter APENAS o texto do versículo, seguido pela sigla da versão entre parênteses. Exemplo de resposta: 'O Senhor é o meu pastor; de nada terei falta. (NVI)'`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    // Directly access the text property as per the SDK guidelines
    return response.text ? response.text.trim() : "";
  } catch (error) {
    console.error("Error fetching verse text from Gemini API:", error);
    throw new Error("Falha ao buscar o texto do versículo. Verifique a referência e tente novamente.");
  }
};