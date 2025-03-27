<p align="center">
  <img src="/public/open-mcq.svg" alt="Open MCQ Logo" width="150"/>
</p>

<h1 align="center">Open MCQ</h1>

An open-source multiple choice question testing platform built with React and TypeScript. Features practice mode, category tests, and timed exams.

## Quick Start

1. Clone the repository

```bash
git clone https://github.com/ygurin/open-mcq.git
cd open-mcq
```

2. Install dependencies

```bash
npm install
```

3. Download DTT data

```bash
chmod +x download-data.sh
./download-data.sh
```

4. Start the development server

```bash
npm run dev
```

## Features

- **Practice Mode**: Study questions with instant feedback and explanations
- **Category Test**: Take tests in specific categories with scoring
- **Exam Mode**: 45-minute timed exam with 40 random questions
  - **Question Flagging**: Mark questions for review
- **Progress Tracking**: Track your performance across categories

## Keyboard Navigation

The application supports full keyboard navigation for efficient use:

| Key | Action |
|-----|--------|
| Arrow Left/Right | Navigate between questions |
| Arrow Up/Down | Select answer options |
| Enter | Submit the selected answer |
| F | Flag/unflag a question (in exam mode) |
| Escape | Open the quit menu |

## Using Your Own Data

You can use your own questions by creating a `data.json` file in the `src` directory. The data should follow this structure:

```json
[
  {
    "question": "What is the main question text?",
    "heading": "Category Name",
    "explanation": "Detailed explanation of the correct answer",
    "questions": [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4"
    ],
    "answer": "Option 2",
    "id": "UNIQUE_ID",
    "update": "2024-01-01",
    "image": "optional-image.png"
  }
]
```

### Data Fields

- `question`: The main question text
- `heading`: Category name for grouping questions
- `explanation`: Shown after answering in practice mode
- `questions`: Array of 4 possible answers
- `answer`: The correct answer (must match one of the options exactly)
- `id`: Unique identifier for the question
- `update`: Last update date (YYYY-MM-DD format)
- `image`: Optional image filename (placed in `/public/images/`)

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## License

MIT License - feel free to use and modify for your own projects.
