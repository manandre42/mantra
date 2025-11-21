import { GoogleGenAI } from "@google/genai";
import { AgentConfig, Order } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MODEL_NAME = 'gemini-2.5-flash';

export const generateAgentResponse = async (
  message: string,
  config: AgentConfig,
  businessName: string
): Promise<string> => {
  try {
    const systemPrompt = `
      Você é um agente de atendimento virtual chamado ${config.name} para a empresa ${businessName}.
      Seu tom de voz deve ser estritamente: ${config.tone}.
      
      Informações que você tem acesso: ${config.additionalInfo}.
      
      Regras:
      1. Seja breve e útil.
      2. Se o cliente perguntar sobre o menu, invente 3 itens deliciosos com preços em AKZ (Kwanza).
      3. Se o cliente quiser fazer um pedido, confirme os itens e pergunte se é retirada ou entrega.
      
      Responda à seguinte mensagem do cliente: "${message}"
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: systemPrompt,
    });

    return response.text || "Desculpe, estou tendo problemas para processar sua solicitação no momento.";
  } catch (error) {
    console.error("Erro ao gerar resposta do agente:", error);
    return "O sistema está indisponível temporariamente.";
  }
};

export const simulateIncomingOrder = async (businessType: string): Promise<Partial<Order>> => {
  try {
    const prompt = `Gere um pedido fictício para um negócio do tipo: ${businessType}.
    Retorne APENAS um JSON com o seguinte formato, sem markdown:
    {
      "customerName": "Nome Angolano Comum",
      "items": ["Item 1", "Item 2"],
      "total": 2500,
      "type": "delivery" | "pickup",
      "channel": "WhatsApp" | "Instagram"
    }
    Use valores realistas em AKZ (Kwanza).`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    throw new Error("Empty response");
  } catch (e) {
    return {
      customerName: "Cliente Exemplo",
      items: ["Produto Genérico"],
      total: 1000,
      type: "pickup",
      channel: "Web"
    };
  }
};

export const generateBusinessDescription = async (name: string, type: string): Promise<string> => {
  try {
    const prompt = `Escreva uma breve descrição comercial (máximo 30 palavras) convidativa para um negócio chamado "${name}" do tipo "${type}". Inclua informações essenciais como horário e qualidade. Retorne apenas o texto.`;
    
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    return `Bem-vindo ao ${name}. Oferecemos os melhores serviços de ${type} da região.`;
  }
};

export const analyzeBusinessStats = async (stats: any): Promise<string> => {
  try {
    const prompt = `Aja como um consultor de negócios experiente. Analise os seguintes dados da semana:
    - Receita Total: ${stats.revenue} AKZ
    - Pedidos: ${stats.totalOrders}
    - Clientes Atendidos: ${stats.totalClients}
    - Conversão: ${((stats.totalOrders / stats.totalClients) * 100).toFixed(1)}%
    
    Dê 3 conselhos práticos e curtos (bullet points) para melhorar o faturamento e a conversão. Seja direto.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Não foi possível gerar análise no momento.";
  } catch (error) {
    return "Análise indisponível.";
  }
};