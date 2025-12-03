export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ReviewSnippet {
  source: string;
  content: string;
}

export interface MapSource {
  sourceId: string;
  title: string;
  uri: string;
  placeAnswerSources?: {
    reviewSnippets?: ReviewSnippet[];
  };
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: MapSource;
}

export interface SearchResult {
  text: string; // The natural language response from Gemini
  stores: MapSource[]; // Extracted store data
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  stores?: MapSource[];
}