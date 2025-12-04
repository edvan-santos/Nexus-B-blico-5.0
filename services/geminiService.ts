
import { GoogleGenAI } from "@google/genai";

export const fetchVerseText = async (reference: string, version: string = 'NVI'): Promise<string> => {
  console.log("Gemini Service v5.1 initialized"); // Log para verificar atualização de versão
  
  const apiKey = process.env.API_KEY;

  // Verificação explícita da chave
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    console.error("ERRO CRÍTICO: API_KEY não encontrada ou vazia.");
    throw new Error("A Chave de API (API_KEY) não está configurada no ambiente. Verifique as configurações do Vercel.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });

    const prompt = `Busque o texto completo do versículo bíblico '${reference}'. Use a versão da bíblia ${version}. Se a referência incluir uma letra (ex: '4a', '2b'), retorne apenas a parte correspondente do versículo. Sua resposta deve conter APENAS o texto do versículo, seguido pela sigla da versão entre parênteses. Exemplo de resposta: 'O Senhor é o meu pastor; de nada terei falta. (NVI)'`;

    console.log(`Buscando versículo: ${reference}...`);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    const text = response.text ? response.text.trim() : "";
    
    if (!text) {
        throw new Error("A IA retornou uma resposta em branco. Tente outra referência.");
    }

    return text;
  } catch (error: any) {
    console.error("Erro detalhado do Gemini:", error);
    
    // Repassa a mensagem de erro original para facilitar o debug
    // Se o usuário ver essa mensagem na tela, saberemos exatamente o problema
    if (error instanceof Error) {
        // Erros comuns da API
        if (error.message.includes("403")) return Promise.reject(new Error("Erro 403 (Acesso Negado): Sua API Key pode estar restrita a domínios incorretos ou não ter permissão."));
        if (error.message.includes("400")) return Promise.reject(new Error("Erro 400 (Requisição Inválida): A API rejeitou os dados enviados."));
        if (error.message.includes("429")) return Promise.reject(new Error("Erro 429 (Limite Excedido): Você atingiu o limite de requisições da API gratuita."));
        if (error.message.includes("API key")) return Promise.reject(new Error("Erro de API Key: A chave fornecida é inválida."));
        
        // Retorna o erro original se não for um dos acima
        throw new Error(`Erro na API: ${error.message}`);
    }
    
    throw new Error(`Erro desconhecido: ${JSON.stringify(error)}`);
  }
};
