# LEARNING JOURNAL

This is a React and TypeScript project built with Next.js. It uses Prisma for database management, Jest for testing, and Tailwind CSS for styling. It is a learning journal that allows users to create and manage their own learning journal entries. Users can create, read, update, and delete entries. Each journal entry is a small chunk of information that contains a topic, a learning material, and some notes. There are 4 types of learning material: quote, code, image, and link. The idea is when user sees something interesting or learns something new, they can quote it, crop a screenshot, or copy the link then write down what they learned in their own words.

The app is still in its infancy. It does not support multiple users yet. Anyone wants to use it can do so by cloning the repo and running it locally like any Next.js app. The installation instruction is below.

## Table of Contents

- [Motivation](#motivation)
- [Screenshots](#screenshots)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Motivation

After many years of learning, the author discovered that his brain can only process a small chunk of information at a time and the best way to learn anything is to write it down. He created this web app to help him any anyone whose brain works like his. The main purpose of this app is not to document what you learn (well, you can do that if you want) but to help you learn by writing down. You will recognize that when you see the live version on the author's website. There are topics, concepts, and information that has been repeated multiple times in different ways and in different entries.

## Screenshots

![Learning Journal Screenshot](./learning-journal-screenshot.png)

## Demo

You can see the demo at [https://learning-journal-drab.vercel.app/](https://learning-journal-drab.vercel.app/).

## Installation

1. Clone the repo
   ```sh
   git clone
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create a `.env.local` file in the root directory and add the following environment variables

   ```sh
    OPENAI_API_KEY= # Get it from https://platform.openai.com/api_keys (after signning up for an account).
    NEXT_PUBLIC_SUPABASE_URL= # Get it from https://app.supabase.io/ (after signning up for an account and create your own organization and project).
    NEXT_PUBLIC_SUPABASE_ANON_KEY= # Get it from https://app.supabase.io/ (after signning up for an account and create your own organization and project).
    DATABASE_URL= # Get it from https://app.supabase.io/ (after signning up for an account and create your own organization and project).
    ADMIN_EMAIL= # Go to the authentication section of your supabase's project, create a new user with an email and add it here. You can only use this email to log in to the admin section for managing the journals on your app.

   ```

4. Setup the database
   ```sh
   npx prisma migrate dev --name init
   ```
5. Run the app
   ```sh
    npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

After installing, go to [http://localhost:3000](http://localhost:3000) to see the app. Admin section can be accessed at [http://localhost:3000/admin](http://localhost:3000/admin). You can only login to the admin section with the email you added to the `ADMIN_EMAIL` environment variable.

## Contributing

Contributions are welcome! If you would like to contribute to this project, please follow these guidelines:

1. Fork the repository and create your branch from `main`.
2. Make your changes.
3. Submit a pull request with a clear description of your changes and why they should be merged.

Thank you for your contributions!

## License

This project is licensed under the GNU GPL License.
Please see the [LICENSE](./LICENSE) file for more details.
