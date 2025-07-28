# AI-Ready API Checker

A web tool that analyzes OpenAPI specifications for "AI-readiness" and "token-friendliness," providing numeric scores and actionable suggestions for each endpoint. The tool combines standard OpenAPI linting with custom AI-focused heuristics.

## Features

- **OpenAPI Specification Analysis**: Upload JSON/YAML files or provide URLs
- **AI Readiness Scoring**: Custom heuristics for LLM-friendly APIs
- **Spectral Linting Integration**: Standard OpenAPI quality checks
- **Real-time Progress**: Streaming analysis with progress updates
- **Actionable Suggestions**: Top 3 suggestions per endpoint
- **Modern UI**: Beautiful, responsive interface with dark mode support

## AI Readiness Heuristics

The tool evaluates endpoints based on:

- **Documentation Completeness**: Summary, description, parameter docs
- **Response Examples**: Help AI understand data structures
- **Error Handling**: Proper 4xx/5xx response documentation
- **Pagination Support**: Limit, page, offset parameters for large datasets
- **Parameter Documentation**: All parameters should have descriptions
- **Naming Consistency**: Uniform naming conventions across paths

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd amiready-ai
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Troubleshooting

If you encounter webpack module errors after making changes:
```bash
# Clear Next.js cache
rm -rf .next

# Restart development server
npm run dev
```

### Usage

1. **Upload Specification**: Choose between URL input or file upload
2. **Optional API Key**: Add your OpenAI API key for enhanced analysis
3. **Analyze**: Click "Analyze Specification" to start the process
4. **Review Results**: View scores, suggestions, and Spectral linting results
5. **Export/Share**: Download reports or share permalinks

## API Endpoints

### POST /api/analyze
Analyzes an OpenAPI specification and returns results via Server-Sent Events (SSE).

**Request Body (FormData):**
- `url` (optional): URL to OpenAPI specification
- `file` (optional): Uploaded OpenAPI file
- `apiKey` (optional): OpenAI API key for enhanced suggestions

**Response:** Server-Sent Events stream with real-time progress updates and final results

**Stream Format:**
```
data: {"type":"progress","progress":15,"step":"Fetching OpenAPI specification...","stepKey":"fetch"}

data: {"type":"progress","progress":30,"step":"Parsing specification...","stepKey":"parse"}

data: {"type":"complete","results":{...}}
```

### GET /api/analyze?id={resultId}
Retrieves stored analysis results by ID.

## Streaming Technology

The application uses **Server-Sent Events (SSE)** for real-time progress updates:

- **No WebSockets Required**: Uses standard HTTP with `text/event-stream`
- **Real Progress**: Updates happen as work is actually performed
- **Automatic Reconnection**: Browsers handle reconnection automatically
- **Simple Protocol**: Easy to debug and maintain
- **HTTP Compatible**: Works through proxies, firewalls, and load balancers

### How It Works

1. **Client** sends POST request with OpenAPI spec
2. **Server** starts streaming response with `Content-Type: text/event-stream`
3. **Real-time Updates** sent as work progresses through analysis steps
4. **Final Results** sent when analysis completes
5. **Connection** automatically closed by server

## Sample OpenAPI Specification

A sample OpenAPI specification is included at `/public/sample-openapi.json` for testing purposes.

## Technical Architecture

- **Frontend**: Next.js 15 with React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes with Server-Sent Events (SSE)
- **Analysis**: Custom heuristics engine + Spectral integration
- **Storage**: In-memory storage (production: database recommended)
- **Streaming**: Real-time progress updates via HTTP streaming

## Development

### Project Structure

```
src/
├── app/
│   ├── api/analyze/
│   │   └── route.ts          # Analysis API endpoint with SSE streaming
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main application page
├── components/
│   ├── InputSection.tsx      # File upload and URL input component
│   ├── ProgressSection.tsx   # Analysis progress display
│   └── ResultsView.tsx       # Results display component
├── hooks/
│   └── useAnalysis.ts        # Custom hook for analysis logic and SSE handling
├── types/
│   ├── openapi.ts            # OpenAPI specification interfaces
│   ├── analysis.ts           # Analysis result and scoring interfaces
│   └── index.ts              # Central type exports
└── lib/
    ├── analysisService.ts    # Main orchestration service
    ├── aiReadinessAnalyzer.ts # AI readiness scoring logic
    ├── openapiParser.ts      # OpenAPI parsing and validation
    ├── openaiService.ts      # OpenAI API integration
    ├── resultsStore.ts       # In-memory storage management
    ├── streamUtils.ts        # Server-Sent Events utilities
    ├── utils.ts              # General utility functions
    └── index.ts              # Central service exports
```

### Key Components

- **Main Page** (`page.tsx`): Orchestrates the application flow
- **InputSection**: Handles file upload, URL input, and form submission
- **ProgressSection**: Displays real-time analysis progress with step-by-step updates
- **ResultsView**: Shows analysis results with scores and suggestions
- **useAnalysis Hook**: Manages analysis state and Server-Sent Events communication
- **Analysis Engine**: Modular services for different analysis aspects
- **API Route**: Handles file uploads, URL fetching, and streaming responses

### Code Organization Benefits

The application has been refactored for better maintainability and debugging:

- **Separation of Concerns**: Each service has a single responsibility
- **Modular Architecture**: Business logic split into focused services
- **Type Safety**: Centralized types with clean import patterns
- **Real-time Streaming**: Server-Sent Events for honest progress updates
- **Easy Debugging**: Smaller, focused files are easier to debug
- **Reusability**: Services can be easily reused or tested independently

## Refactoring Benefits

The codebase has been refactored for improved maintainability and debugging:

- **Modular Services**: Business logic split into focused, single-responsibility services
- **Clean Imports**: Centralized exports via index files for cleaner imports
- **Type Safety**: Comprehensive TypeScript interfaces with proper separation
- **Easy Debugging**: Smaller files make it easier to isolate and fix issues
- **Testability**: Individual services can be unit tested independently
- **Extensibility**: New analysis features can be added as separate services

## Future Enhancements

- [ ] Full Spectral integration with custom rules
- [ ] PDF report generation
- [ ] Database persistence for results (replace in-memory storage)
- [ ] Advanced AI analysis using OpenAI API
- [ ] Batch analysis for multiple specs
- [ ] Custom rules configuration
- [ ] API usage analytics
- [ ] Unit tests for individual services
- [ ] Caching and performance optimizations
- [ ] Real-time collaboration features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- [Spectral](https://stoplight.io/open-source/spectral) for OpenAPI linting
- [Next.js](https://nextjs.org/) for the framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide React](https://lucide.dev/) for icons
