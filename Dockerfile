FROM node:18 as build

ADD . /app
WORKDIR /app

RUN corepack enable pnpm && \
    pnpm install && pnpm run build

# ------------------

FROM node:18-alpine

WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/output /app/output
COPY --from=build /app/dist /app/dist

EXPOSE 3000
VOLUME [ "/app/data", "/app/logs", "/app/config" ]

ENTRYPOINT [ "node", "./output/index.js" ]
