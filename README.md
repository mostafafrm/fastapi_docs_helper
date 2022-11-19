# fastapi_docs_helper

A firefox extension which helps you read [FastApi docs](https://fastapi.tiangolo.com) a bit easier.

All this extension does is prevent the top announcement banner from shrinking, so the reader doesn't gets annoyed by all the text down the page jumping up and down.

![Showcase GIF](showcase.gif)

# Build from source

- Clone the repository in your local machine

  ```bash
  git clone https://github.com/sepsh/fastapi_docs_helper.git
  cd fastapi_docs_helper
  ```

- Build using one of these methodes:

  1. Using `nodejs` and `npm`

     Make sure you are running the current LTS (long term support) version of [NodeJS and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

     Install the dependencies

     ```bash
     npm ci
     ```

     Run the build command

     ```bash
     npm run build
     ```

     Your extension should be ready under `build/` directory.

  2. Using `docker-compose`

     Make sure you have [docker and docker-compose](https://docs.docker.com/get-docker/) set-up and running.

     Run the docker-compose

     ```bash
     docker-compose up
     ```

     If you are done building, you can remove the container and image

     ```bash
     docker-compose down --rmi local
     ```

     Your extension should be ready under `build/` directory.
