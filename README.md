<p align="center">
  <img src="/public/open-mcq.svg" alt="Open MCQ Logo" width="150"/>
</p>

<h1 align="center">Open MCQ</h1>

An open-source multiple-choice question platform built with React. Open MCQ provides a free alternative to expensive commercial testing applications like [The Official Driver Theory Test Online](https://www.officialdttonline.ie/) and other paid alternatives.

With Open MCQ, you can practice test questions in various modes and prepare for exams in a user-friendly environment. Education should be free and accessible to everyone which drove the development of this tool.

<p align="center">
  <a href="https://open-mcq.netlify.app" target="_blank">
    <img src="https://img.shields.io/badge/Try_the_Demo-4CAF50?style=for-the-badge" alt="Try the Demo" />
  </a>
</p>

You can easily [use your own data](#using-your-own-data) to customize the platform for any subject or exam preparation needs.

<p align="center">
  <img src="/demo.gif" alt="Open MCQ Demo" width="720"/>
</p>

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

Select the dataset:
```text
╰─❯ ./download-data.sh
Welcome to the Open MCQ Data Installer
This script will download and install question datasets for Open MCQ
WARNING: This will replace any existing data files and images

==========================================
         Open MCQ Data Installer
==========================================
Please select a dataset to download:

1) Driver Theory Test (2025) Questions
2) Driver Theory Test (2019) Questions
3) Wildlife Questions
4) Exit

Enter your choice:
```

**Note:** You can also set a number param when running the script to avoid interactive mode, e.g. `./download-data.sh 1`

4. Start the development server

```bash
npm run dev
```

## Features

- **Practice Mode**: Study questions with instant feedback and explanations
- **Category Test Mode**: Take tests in specific categories with scoring (20 randomly selected questions)
- **Exam Mode**: 45-minute timed exam with 40 random questions
  - **Question Flagging**: Mark questions for review (flagged questions are treated as answered if not cleared by the end of the exam)

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
- `questions`: Array of 2-4 possible answers (supports variable number of options)
- `answer`: The correct answer (must match one of the options exactly)
- `id`: Unique identifier for the question
- `update`: Last update date (YYYY-MM-DD format)
- `image`: Optional image filename (placed in `/public/images/`)

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## Running with Docker

### Prerequisites

1. **Docker and Docker Compose**
   - [Install Docker](https://docs.docker.com/get-docker/)
   - [Install Docker Compose](https://docs.docker.com/compose/install/)

### Running with Docker

1. Build and start the container in detached mode:

```bash
docker build -t open-mcq .
docker run -d -p 8080:80 open-mcq
```

2. Visit `http://localhost:8080` in your browser.
3. To Stop the container and remove the container:

```bash
docker stop [CONTAINER_ID] && docker rm [CONTAINER_ID]
```

### Quickhost Publicly with Docker Compose and Serveo

[Serveo](http://serveo.net/) is a free service that allows you to expose your local server to the internet without any account registration or API keys.

> **Note**: Docker Compose has two syntax versions:
> - **Docker Compose V2**: Uses `docker compose` (without hyphen)
> - **Docker Compose V1**: Uses `docker-compose` (with hyphen)
>
> The examples below use V1 syntax. If you're using Docker Compose V2, replace `docker-compose` with `docker compose` in all commands.
> If unsure start with `--help` e.g. `docker compose --help`

1. Run the application with Docker Compose:

```bash
docker-compose up -d
```

2. Access your app:
   - Locally: `http://localhost:8080`
   - Public URL: Check the terminal output from the serveo service for your public URL (something like `https://[random-subdomain].serveo.net`)

3. To see the serveo service logs and get your public URL:

```bash
docker-compose logs -f serveo
```

4. To stop the containers:

```bash
docker-compose down
```

## Disclaimer

This software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and noninfringement. In no event shall the authors be liable for any claim, damages, or other liability arising from the use of this software.

Use at your own risk.

## License

This project is licensed under the [GNU Affero General Public License v3.0 or later](https://www.gnu.org/licenses/agpl-3.0.html).

You are free to use, modify, and redistribute this project under the terms of the AGPL-3.0-or-later license. If you run a modified version over a network (such as a web app), you must also make the source code for that version available to users.

Note: This license applies retroactively to all past versions of the code in this repository, even if early commits did not contain a license file.