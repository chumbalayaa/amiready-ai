# AI-Ready API Checker

A comprehensive tool for analyzing OpenAPI specifications to assess their AI readiness and provide actionable suggestions for improvement.

## Features

- **OpenAPI Specification Analysis**: Supports both URL and file upload
- **AI Readiness Scoring**: Custom heuristics to evaluate API endpoints
- **Spectral Linting**: Integration with Spectral for OpenAPI validation
- **OpenAI-Powered Suggestions**: AI-generated recommendations (optional)
- **Real-time Progress Tracking**: Live updates during analysis
- **Modern UI**: Clean, responsive interface with dark mode support

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd amiready-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage

### Basic Analysis (Without OpenAI)
1. Enter an OpenAPI specification URL or upload a file
2. Click "Analyze Specification"
3. View AI readiness scores and suggestions

### Enhanced Analysis (With OpenAI)
1. Enter an OpenAPI specification URL or upload a file
2. Provide your OpenAI API key (optional)
3. Click "Analyze Specification"
4. View AI readiness scores, custom suggestions, and AI-generated recommendations

## Testing

The project includes a comprehensive test suite to ensure reliability and maintainability.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

The test suite covers:

#### Frontend Tests
- **Components**: InputSection, ProgressSection, ResultsView
- **Hooks**: useAnalysis hook with state management
- **Integration**: Main page workflow

#### Backend Tests
- **Services**: Analysis service, AI readiness analyzer
- **API Endpoints**: POST and GET routes
- **Business Logic**: OpenAPI parsing, scoring algorithms

#### Test Scenarios
- ✅ Analysis without API key
- ✅ Analysis with API key
- ✅ File upload functionality
- ✅ Progress tracking and UI updates
- ✅ Error handling and edge cases
- ✅ Component rendering and interactions
- ✅ State management and data flow

### Test Structure

```
src/
├── components/__tests__/
│   ├── InputSection.test.tsx      # Form input and submission tests
│   ├── ProgressSection.test.tsx   # Progress tracking UI tests
│   └── ResultsView.test.tsx       # Results display tests
├── hooks/__tests__/
│   └── useAnalysis.test.ts        # State management tests
├── lib/__tests__/
│   ├── analysisService.test.ts    # Core analysis logic tests
│   └── aiReadinessAnalyzer.test.ts # Scoring algorithm tests
└── app/__tests__/
    └── page.test.tsx              # Integration tests
```

### Continuous Integration

Tests run automatically on:
- **Push to main/develop branches**
- **Pull requests**
- **Multiple Node.js versions** (18.x, 20.x)

## Technical Architecture

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Modern icon library

### Backend
- **Next.js API Routes**: Server-side API endpoints
- **Server-Sent Events (SSE)**: Real-time progress updates
- **OpenAI API**: AI-powered suggestions
- **Spectral**: OpenAPI specification validation

### Key Components

#### Analysis Pipeline
1. **Input Processing**: URL fetching or file parsing
2. **OpenAPI Validation**: Version checking and structure validation
3. **Spectral Linting**: Automated rule checking
4. **AI Readiness Scoring**: Custom heuristics evaluation
5. **OpenAI Suggestions**: AI-generated recommendations (optional)
6. **Results Compilation**: Structured output generation

#### AI Readiness Heuristics
- **Documentation Quality**: Summary, description, examples
- **Error Handling**: 4xx/5xx response documentation
- **Pagination Support**: Limit, page, offset parameters
- **Parameter Documentation**: Complete parameter descriptions
- **Naming Consistency**: Uniform naming conventions

## API Endpoints

### POST `/api/analyze`
Analyzes an OpenAPI specification.

**Request:**
- `url` (string, optional): OpenAPI specification URL
- `file` (File, optional): OpenAPI specification file
- `apiKey` (string, optional): OpenAI API key

**Response:**
```json
{
  "id": "uuid",
  "spectralResults": {
    "errors": [...],
    "warnings": [...],
    "info": [...]
  },
  "aiReadinessScores": [
    {
      "path": "/endpoint",
      "method": "GET",
      "score": 85,
      "summary": "Endpoint description",
      "suggestions": ["Suggestion 1", "Suggestion 2"]
    }
  ],
  "suggestions": ["AI suggestion 1", "AI suggestion 2"],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### GET `/api/analyze?id=<result-id>`
Retrieves a previously stored analysis result.

## Streaming Technology

The application uses **Server-Sent Events (SSE)** for real-time progress updates:

- **Real-time Updates**: Progress percentage and current step
- **Step-by-step Feedback**: Detailed status for each analysis phase
- **Error Handling**: Graceful error reporting
- **Connection Management**: Automatic reconnection and cleanup

### SSE Event Types
- `progress`: Current analysis progress (percentage, step, stepKey)
- `complete`: Final results with full analysis data

## Refactoring Benefits

The codebase has been refactored for improved maintainability:

### Modular Architecture
- **Separation of Concerns**: Each service handles specific functionality
- **Single Responsibility**: Each file has a clear, focused purpose
- **Testability**: Isolated components and services for easier testing

### Service Layer
- **`analysisService.ts`**: Main orchestration logic
- **`aiReadinessAnalyzer.ts`**: Custom scoring algorithms
- **`openaiService.ts`**: AI integration with timeout handling
- **`openapiParser.ts`**: Specification parsing and validation
- **`resultsStore.ts`**: In-memory data management
- **`streamUtils.ts`**: SSE utilities and encoding

### Type Safety
- **Centralized Types**: All interfaces in `src/types/`
- **Strict Typing**: Full TypeScript coverage
- **Import Aliases**: Clean `@/` imports throughout

## Troubleshooting

### Build Issues
If you encounter webpack module errors:
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules cache
rm -rf node_modules/.cache

# Reinstall dependencies
npm install
```

### Test Issues
If tests fail with module resolution errors:
```bash
# Clear Jest cache
npm test -- --clearCache

# Run tests with verbose output
npm test -- --verbose
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.
