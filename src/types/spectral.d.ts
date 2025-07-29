declare module '@stoplight/spectral' {
  export class Spectral {
    loadRuleset(ruleset: string): Promise<void>;
    run(document: Document): Promise<SpectralResult[]>;
  }

  export class Document {
    constructor(content: string, format: string);
  }

  export interface SpectralResult {
    message: string;
    path: string[];
    severity: number;
  }
} 