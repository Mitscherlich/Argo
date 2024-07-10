# http-proxy-webui

A web interface for [`http-proxy-middleware`](https://github.com/chimurai/http-proxy-middleware)

## Quick start

### Docker services

1. clone this repo

```bash
$ git clone https://github.com/Mitscherlich/http-proxy-webui
```

2. via `docker-compose`

```bash
$ docker-compose up -d
# or
$ docker compose up -d # docker > 1.29.2
```

#### Build your own docker image

```bash
$ docker build -t http-proxy-web:dev .
```

then create container with following command:

```bash
$ docker run -d \
  --restar=unless-stop \
  --network=host \
  -v ./data:/app/data \
  -v ./config:/app/config \
  -v ./logs:/app/logs \
  http-proxy-webui:dev
```

### Local deployment

1. clone this repo

```bash
$ git clone https://github.com/Mitscherlich/http-proxy-webui
```

2. install deps via [`pnpm`](https://pnpm.io/)

```bash
$ pnpm i
```

3. start dev server

```bash
$ pnpm run dev
```

or start server / client specific

- run client in dev mode

```bash
$ pnpm run dev:client
```

- run server in dev mode

```bash
$ pnpm run dev:server
```

## License

[MIT](LICENSE)

---

made with love :heart: by [Mitscherlich](https://github.com/Mitscherlich)
