FROM node:22.11-alpine

# Alpine node image doesn't come with bash
RUN apk --no-cache add \
    curl \
    bash \
    make \ 
    python3

# Install pnpm globally
RUN npm install -g pnpm

RUN mkdir -p /app /app/dist
WORKDIR /app

# install and cache app dependencies
COPY package.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH=/app/node_modules/.bin:$PATH

CMD [ "pnpm", "run", "start:dev" ] 