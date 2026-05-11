export interface CostTier {
  startRange: number | string;
  endRange: number | string; // 'max' or empty string can denote upper bound
  costPerMillion: number;
}

export interface ModelMaster {
  id: string; // Model ID, e.g., gpt-4o
  provider: 'OpenAI' | 'Gemini';
  inputCosts: CostTier[];
  outputCosts: CostTier[];
  hasImageOutput: boolean;
  imageOutputCosts?: CostTier[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}
