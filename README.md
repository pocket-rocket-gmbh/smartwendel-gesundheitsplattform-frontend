# README

## Introduction to Smartwendeler Land Gesundheits- und Pflegeplattform Setup

Welcome to the Smartwendeler Land Gesundheits- und Pflegeplattform, a robust and dynamic Nuxt 3 application designed to cater the `health` scope of the [Smartwendeler Land API](https://gitlab.opencode.de/OC00003136130/smartwendeler-land-api). This document guides you through the essential steps to set up and configure the application effectively in an open-source environment.

## Prerequisites

Before proceeding with the setup, ensure you have the following prerequisites:

- Download and setup the [Smartwendeler Land API](https://gitlab.opencode.de/OC00003136130/smartwendeler-land-api)
- Make sure you have created a new Organization with `scope` = `health`. Also make sure you have assigned a `public_username` and a `public_password` to this organization. You need it for public API requests and for you `.env` file which we will setup in Step 1 below
- Optional but highly recommended: Adapt the `seeds.rb` file in the API to create some basiv database sets to have a starting point to work with
- Make sure you have Node.js and NPM running. We recommend using node version 20.1.0

## Setup Instructions

### Step 1: Setup .env

Create a `.env` File in the root directory of this app with the following content:

```
API_BASE_URL=http://localhost:3000/v1/
PUBLIC_API_USERNAME=pocketrocket_health
PUBLIC_API_PASSWORD=xxxxx
REGISTER_TOKEN=xxxx
LOGIN_PASSWORD=xxxx
```

`API_BASE_URL` this is the URL of your running Ruby on Rails server of the required API (see Prerequisites)
`PUBLIC_API_USERNAME` this is the username of the required organization scope of the API, by default its `pocketrocket_health`
`PUBLIC_API_PASSWORD` this is the password which belongs to the required organization scope
`REGISTER_TOKEN` the register token which belongs to the required organization scope. It is used to assign a user upon registration to the correct organization

### Step 2: Install

Run `npm install` to install all required packages.

### Step 3: Run development server

Run `npm run dev` to start the Nuxt 3 development server in SSR mode

### Support
Pocket Rocket GmbH
admin@pocket-rocket.io

## Deploy on Coolify

The repo ships a multi-stage `Dockerfile` (Node 20 like on Heroku, Nitro node-server, runs as `node`) and a `.dockerignore`. Heroku keeps working unchanged (`npm run build` + `npm start`).

1. **New Resource → Application → Dockerfile**, point it at this repo and the branch to deploy.
2. **Port:** `3000` (the container listens on `0.0.0.0:3000`).
3. **Environment variables:** copy from `.env.example`.
   - `[BUILD]` variables (`API_BASE_URL`) need **"Build Variable"** enabled: `nuxt.config.ts` reads them during `nuxt build`. A change needs a rebuild, not just a restart.
   - `[RUNTIME]` secrets are normal runtime variables in their `NUXT_` form (`NUXT_PUBLIC_API_USERNAME`, `NUXT_PUBLIC_API_PASSWORD`, `NUXT_REGISTER_TOKEN`, `NUXT_LOGIN_PASSWORD`).
4. **Health check:** `GET /` on port 3000. Requests to `localhost` skip the HTTPS redirect, so the internal check gets a 200.
5. Deploy. Coolify builds the image and starts `node .output/server/index.mjs`.

The Docker build sets `CYPRESS_INSTALL_BINARY=0`, so `npm ci` skips the Cypress binary download.
