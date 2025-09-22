# Station Alpha Frontend Interview Challenges

This repository contains a collection of frontend development challenges designed to assess candidates for the Frontend Developer position at Station Alpha.

## Project Structure

This is a Turborepo-based monorepo containing the following applications:

1. **Bug Hunting** (`apps/bug-hunting`)  
   A React client-side application with intentional bugs for candidates to identify and fix.

2. **Animation Showcase** (`apps/animation-showcase`)  
   A React challenge focused on creating a reusable animated button component with multiple effects (hover, icon support, variants) and accessibility considerations.

3. **API Integration** (`apps/api-integration`)  
   A React application for testing API integration skills with a public weather API.

4. **Playwright Challenge** (`apps/playwright-challenge`)  
   A challenge focused on end-to-end testing using Playwright.

**Important:** Each application directory (`apps/*`) contains its own specific `README.md` file with detailed instructions and context for that particular challenge. Please refer to the README inside the relevant application folder for challenge specifics. Some challenges also include a `questions.md` file that candidates may need to review or answer as part of the assessment.

## Submission Process

This repository is designed as a take-home assessment to evaluate frontend developer candidates' skills. Here's how to proceed:

1. **Fork the Repository**: Start by forking this repository to your own GitHub account using the 'Fork' button at the top right.

2. **Clone Your Fork**: Clone your forked repository to your local machine:
   ```bash
   git clone https://github.com/YOUR_USERNAME/station-alpha-fe-challenge.git
   ```

3. **Complete the Challenges**: Work through the challenges in the `apps` directory. Each challenge has its own README.md with specific instructions.

4. **Push Your Changes**: When you're finished:
   - Commit all your changes to your fork
   - Push the changes to your repository
   - Share the link to your forked repository with us

**Important**: Make sure to:
- Complete all the required challenges
- Answer any questions in the respective `questions.md` files
- Keep your fork public so we can review your code
- Include any special setup instructions or notes in your repository's README

## How to Run

### Environment Setup

Before running the applications, you need to set up your environment variables:

1. **Copy the environment template**:
   ```bash
   cp .env.example .env
   ```

2. **Configure your API keys**: Edit the `.env` file and replace the placeholder values with your actual API keys:
   - `VITE_WEATHER_API_KEY`: Get your free API key from [WeatherAPI.com](https://www.weatherapi.com/)
   - Other configuration values can be left as default or customized as needed

3. **Environment Variables Reference**:
   - `VITE_WEATHER_API_KEY`: Your WeatherAPI.com API key (required for API integration challenge)
   - `VITE_WEATHER_API_BASE_URL`: Base URL for the weather API (default: https://api.weatherapi.com/v1)
   - `VITE_WEATHER_CACHE_DURATION`: Cache duration in minutes (default: 30)
   - `VITE_WEATHER_MAP_ZOOM`: Default map zoom level (default: 10)
   - `VITE_WEATHER_MAP_TYPE`: Default map type (default: precipitation)
   - Feature flags for enabling/disabling specific features

### Running the Applications

```bash
# Install dependencies
npm install

# Run a all apps
npm run dev

# Build all apps
npm run build
```

## Assessment Guidelines

Each challenge has its own README.md with specific instructions and a questions.md file for candidates to respond to. Candidates should create a PR with their solutions.

When assessing candidates, consider:

1. **Code Quality**: Is the code well-structured, readable, and maintainable?
2. **Problem-Solving**: How effectively did they identify and fix the issues?
3. **Technical Knowledge**: Do they demonstrate understanding of the underlying technologies?
4. **Communication**: How well did they document their approach in the questions.md file?

## Tech Stack

- **Core**: React, Next.js, TypeScript, SCSS
- **Tools**: Vite, Turborepo, npm
- **Testing**: (Varies by challenge)

## Contributing

To add new challenges or improve existing ones:

1. Create a new app in the `apps` directory
2. Add appropriate documentation and questions
3. Update this README to include the new challenge
