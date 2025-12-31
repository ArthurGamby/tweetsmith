/**
 * Ollama API Helper
 * Communicates with a local Ollama instance running at localhost:11434
 */

// Ollama API configuration
const OLLAMA_BASE_URL = "http://localhost:11434";
const MODEL_NAME = "gemma3:4b";

/**
 * Request body for the Ollama /api/generate endpoint
 */
export interface OllamaRequest {
  model: string;
  prompt: string;
  stream: boolean;
  options: {
    temperature: number;
  };
}

/**
 * Response from the Ollama /api/generate endpoint (non-streaming)
 * When stream is false, Ollama returns a single JSON object with the full response
 */
export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

/**
 * Sends a prompt to the local Ollama instance and returns the generated text
 *
 * @param prompt - The text prompt to send to the LLM
 * @returns The generated response text
 * @throws Error if the request fails or returns a non-OK status
 */
export async function generateWithOllama(prompt: string): Promise<string> {
  // Construct the request body
  const requestBody: OllamaRequest = {
    model: MODEL_NAME,
    prompt,
    stream: false, // Disable streaming for simpler response handling
    options: {
      temperature: 0.7,
    },
  };

  // Send POST request to Ollama's generate endpoint
  const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  // Check for HTTP errors
  if (!response.ok) {
    throw new Error(
      `Ollama request failed: ${response.status} ${response.statusText}`
    );
  }

  // Parse the JSON response
  const data: OllamaResponse = await response.json();

  // Return the generated text
  return data.response;
}
