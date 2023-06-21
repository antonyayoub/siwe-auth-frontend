# siwe-auth-frontned
Frontend in Next.js consuming backend implementing Authentication with SIWE protocol.



## Getting started

Make sure to run [backend] (https://github.com/antonyayoub/siwe-auth-backend) first on port 3001


### Installation

```bash
$ yarn install
```

### Configure environment

Clone `.env.example` to `.env.local` and configure following environment variables if needed.


### Running the app

```bash
# build
$ yarn build

# start build
$ yarn start
```

## Future improvements

- refractor api fetch to a services folder
- use axios instead of fetch
- use state management 
- use next auth to handle jwt and session server side of frontend
- add e2e tests

