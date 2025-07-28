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

### Usage

1. **Upload Specification**: Choose between URL input or file upload
2. **Optional API Key**: Add your OpenAI API key for enhanced analysis
3. **Analyze**: Click "Analyze Specification" to start the process
4. **Review Results**: View scores, suggestions, and Spectral linting results
5. **Export/Share**: Download reports or share permalinks

## API Endpoints

### POST /api/analyze
Analyzes an OpenAPI specification and returns results via Server-Sent Events.

**Request Body (FormData):**
- `url` (optional): URL to OpenAPI specification
- `file` (optional): Uploaded OpenAPI file
- `apiKey` (optional): OpenAI API key

**Response:** Server-Sent Events stream with progress updates and final results

### GET /api/analyze?id={resultId}
Retrieves stored analysis results by ID.

## Sample OpenAPI Specification

A sample OpenAPI specification is included at `/public/sample-openapi.json` for testing purposes.

## Technical Architecture

- **Frontend**: Next.js 15 with React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes with Server-Sent Events
- **Analysis**: Custom heuristics engine + Spectral integration
- **Storage**: In-memory storage (production: database recommended)

## Development

### Project Structure

```
src/
├── app/
│   ├── api/analyze/
│   │   └── route.ts          # Analysis API endpoint
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main application page (simplified)
├── components/
│   ├── InputSection.tsx      # File upload and URL input component
│   ├── ProgressSection.tsx   # Analysis progress display
│   └── ResultsView.tsx       # Results display component
├── hooks/
│   └── useAnalysis.ts        # Custom hook for analysis logic
├── types/
│   └── analysis.ts           # TypeScript interfaces and types
└── lib/
    └── utils.ts              # Utility functions
```

### Key Components

- **Main Page** (`page.tsx`): Orchestrates the application flow
- **InputSection**: Handles file upload, URL input, and form submission
- **ProgressSection**: Displays real-time analysis progress
- **ResultsView**: Shows analysis results with scores and suggestions
- **useAnalysis Hook**: Manages analysis state and API communication
- **Analysis Engine**: Custom heuristics for AI readiness scoring
- **API Route**: Handles file uploads, URL fetching, and streaming responses

### Code Organization Benefits

The application has been refactored for better maintainability and readability:

- **Separation of Concerns**: Each component has a single responsibility
- **Reusability**: Components can be easily reused or tested independently
- **Type Safety**: Centralized types in `src/types/analysis.ts`
- **Custom Hooks**: Business logic extracted into reusable hooks
- **Modular Architecture**: Clean component composition and data flow

## Future Enhancements

- [ ] Full Spectral integration with custom rules
- [ ] PDF report generation
- [ ] Database persistence for results
- [ ] Advanced AI analysis using OpenAI API
- [ ] Batch analysis for multiple specs
- [ ] Custom rules configuration
- [ ] API usage analytics

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
