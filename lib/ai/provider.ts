/** Any backend that can look at an image and return raw text (expected to contain JSON). */
export interface VisionProvider {
  name: string;
  describeImage(input: { system: string; text: string; imageDataUrl: string; signal?: AbortSignal }): Promise<string>;
}

export class ProviderError extends Error {}
