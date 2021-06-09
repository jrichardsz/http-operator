# Matrix Http Gateway

Matrix Http Gateway is a simple gateway service that provides dynamic routing and more. With Matrix, your clients and apis will live in a virtual and peaceful world.

![logo](logo.png)

# Lua ?

2019 and if you want to develop plugins in the most well known api gateways, you must need to know lua (kong)  or another ancestral languages.

# Javascript

Matrix Gateway Api is developed using nodejs/javascript, so you can modify it or add plugins like a game.

# Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

# Prerequisites

What things you need to install the software and how to install them

```
Node JS > 8.*
```

# Configure proxy

If you have an api called : http://acme-api.com and you want to use it as /marvel-api

you just need:

```sh
export proxy_data_01_source=localhost:8080
export proxy_data_01_target=http:/localhost:8081
```

or with several nodes

```sh
export proxy_data_01_source=localhost:8080
export proxy_data_01_target="http://localhost:8081 , http://localhost:8082"
```

# Development Mode

- Set required environment vars

```
export PORT=8080
```

- Execute

```
npm install
npm run dev
```

# Testing & Production Mode

```
export PORT=8080
```

- Execute

```
npm install
npm run start
```

Add this for debug
```
export log_level=debug
```

# Execute Matrix

if your origin api have and enpoint

- http://acme-api.com/looney-tunes

You can consume it using matrix with:

- http://localhost:8080/marvel-api/looney-tunes

# Coming soon, contribute and to-do

- UI
- mongo db
- add midlewares for basic auth, oauth2, etc
- test
- refactor
- add target types : web & api


# Versioning

1.0.0

# Authors

* **Richard Leon Ingaruca**


# License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
