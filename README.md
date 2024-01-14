# LEARNING JOURNAL

This is a React and TypeScript project built with Next.js. It uses Prisma for database management, Jest for testing, and Tailwind CSS for styling. It is a learning journal that allows users to create and manage their own learning journal entries. Users can create, read, update, and delete entries. Each journal entry is a small chunk of information that contains a topic, a learning material, and some notes. There are 4 types of learning material: quote, code, image, and link. The idea is when user sees something interesting or learns something new, they can quote it, crop a screenshot, or copy the link then write down what they learned in their own words.

The app is still in its infancy. It does not support multiple users yet. Anyone wants to use it can do so by cloning the repo and running it locally like any Next.js app. The installation instruction is below.

## Table of Contents

- [Motivation](#motivation)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Motivation

After many years of learning, the author discovered that his brain can only process a small chunk of information at a time and the best way to learn anything is to write it down. He created this web app to help him any anyone whose brain works like his. The main purpose of this app is not to document what you learn (well, you can do that if you want) but to help you learn by writing down. You will recognize that when you see the live version on the author's website. There are topics, concepts, and information that has been repeated multiple times in different ways and in different entries.

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
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/learning-journal?schema=public"
   ```

## Usage

Instructions on how to use your project and any relevant examples.

## Contributing

Guidelines for contributing to your project and how others can get involved.

## License

Information about the license for your project.
