# The Stage Where It Happens
FROM ghcr.io/sand-head/deno-arm64:ubuntu

# create workdir & cache dependencies
WORKDIR /usr/src/planning-poker
COPY deps.ts .
RUN deno cache deps.ts

# add the rest!
ADD . .
RUN deno cache src/main.ts

ENTRYPOINT [ "deno", "run", "--allow-read", "--allow-env", "--allow-net", "src/main.ts" ]