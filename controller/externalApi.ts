import { ApiResponse } from "@/utils/Type/apiResponse";
import {
  DictionaryApiResponse,
  ProcessedResult
} from "@/utils/Type/ExApi";
import WordsDB from "./handler";

class ExternalApi {
  private dictionaryApiUrl: string;
  private translationApiUrl: string;
  private aistudioApiUrl: string;

  constructor() {
    this.dictionaryApiUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";
    this.translationApiUrl = "https://api.mymemory.translated.net/get";
    this.aistudioApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=`;
  }

  async fetchWordFromDictionary(
    word: string
  ): Promise<ApiResponse<DictionaryApiResponse[]>> {
    try {
      const response = await fetch(`${this.dictionaryApiUrl}${word}`);
      if (!response.ok) {
        return {
          status: "error",
          statusCode: response.status,
          message: `API request failed with status ${response.status}`,
          data: [],
        };
      }
      const data = await response.json();
      return {
        status: "success",
        statusCode: 200,
        data: data as DictionaryApiResponse[],
      };
    } catch (error) {
      return {
        status: "error",
        statusCode: 500,
        data: [],
        message: `Unexpected error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  }

  async fetchWordFromAi(word: string): Promise<ApiResponse<string>> {
    const key = await WordsDB.getAiKey();
    if (!key.apiKey) {
      return {
        data: "",
        status: "error",
        statusCode: 401,
        message: "API key not found",
      };
    }

    const SendData = {
      contents: [
        {
          parts: [
            {
              text: `For the word '${word}', generate a JSON object with the following structure:\n- A root key named 'word' containing the string '${word}'.\n- A root key named 'meanings' which is an array of objects.\n- Each object in the 'meanings' array must have the following keys:\n  - 'type': The part of speech (e.g., 'Verb', 'Noun').\n  - 'definition': short and understandable definition if possible for that part of speech.\n  - 'examples': An array of example sentences.\n  - 'verb_forms': An object containing verb forms ('base_form', 'past_simple', 'past_participle', 'present_participle', 'third_person_singular') ONLY if the 'type' is 'Verb'. Otherwise, this key should be null.`,
            },
          ],
        },
      ],
    };

    try {
      const response = await fetch(`${this.aistudioApiUrl}${key.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(SendData),
      });

      if (!response.ok) {
        return {
          data: "",
          status: "error",
          statusCode: response.status,
          message: `API request failed with status ${response.status}`,
        };
      }

      const data = await response.json();

      const processedData = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!processedData) {
        return {
          status: "error",
          data: "",
          statusCode: 500,
          message: "Invalid response format from AI API",
        };
      }

      return {
        status: "success",
        statusCode: 200,
        data: processedData,
      };
    } catch (error) {
      return {
        status: "error",
        data: "",
        statusCode: 500,
        message: `Unexpected error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  }

  async translate(
    text: string,
    targetLang: string = "hi"
  ): Promise<ApiResponse<string>> {
    const langPair = `Autodetect|${targetLang}`;
    const url = `${this.translationApiUrl}?q=${encodeURIComponent(
      text
    )}&langpair=${langPair}`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.responseStatus !== 200) {
        console.error("Translation failed:", data.responseDetails);
        return {
          data: "",
          status: "success",
          statusCode: data.responseStatus,
          message: data.message,
        };
      }

      return {
        status: "success",
        statusCode: 200,
        data: data.responseData.translatedText,
      };
    } catch (error) {
      return {
        data: "",
        status: "error",
        statusCode: 500,
        message: `Unexpected error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  }

  async getOrganizedWordDetails(
    word: string,
    fetchBy: "dictionary" | "ai" = "dictionary"
  ): Promise<ApiResponse<ProcessedResult>> {
    if (fetchBy === "ai") {
      const data = await this.fetchWordFromAi(word);
      if (data.statusCode === 200) {
        const startIndex = data.data.indexOf("{");
        const endIndex = data.data.lastIndexOf("}");
        const cleanJsonString = data.data.substring(startIndex, endIndex + 1);
        return {
          status: "success",
          statusCode: 200,
          data: JSON.parse(cleanJsonString),
        };
      } else {
        return {
          data: {
            word: "",
            meanings: [],
          },
          status: "error",
          statusCode: data.statusCode,
          message: data.message || "Failed to fetch word from AI",
        };
      }
    }

    const rawData = await this.fetchWordFromDictionary(word);
    if (rawData.statusCode === 200) {
      const ProcessedResult: ProcessedResult = {
        word: word,
        meanings: [],
      };
      const originalData = rawData.data;

      for (const meaning of originalData?.[0]?.meanings || []) {
        const definitions = meaning.definitions;
        const item =
          definitions[Math.floor(Math.random() * definitions.length)];
        const definition = item.definition;
        const example = [item.example || ""];

        ProcessedResult.meanings.push({
          id: Math.random().toString(36).substring(2, 9),
          type: meaning.partOfSpeech,
          definition: definition,
          examples: example,
          verb_forms: null,
        });
      }

      return {
        status: "success",
        statusCode: 200,
        data: ProcessedResult,
      };
    }

    return {
      data: {
        word: "",
        meanings: [],
      },
      status: "error",
      statusCode: rawData.statusCode || 500,
      message: rawData.message || "Failed to fetch word from dictionary",
    };
  }
}

export default new ExternalApi();
