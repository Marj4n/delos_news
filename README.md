# DelosNews

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Marj4n/delos_news.git
   cd delos-news
   ```
2. Install the dependencies:
   ```bash
    npm install
   ```
3. Set up the environment variables:

   ```bash
   cp .env.local.example .env.local
   ```

   fill in the environment variables in the `.env.local` file.

   ```shell
   NEXT_PUBLIC_API_KEY="Enter your nytimes.com API key here"
   ```

   you can get your API key from [nytimes.com](https://developer.nytimes.com/)

4. Run the development server:

   ```bash
    npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Conclusion

This guide outlines the necessary steps to create a functional and maintainable DelosNews website using React and Next.js, with features for browsing, purchasing and as well as a lucky draw system. The focus is on clean code, modular design, and comprehensive testing to ensure quality and maintainability.
