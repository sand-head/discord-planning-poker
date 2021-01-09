# build stage based on code attributed to Raphael Lechner under the MIT license: 
# https://github.com/lraphael/deno_docker_raspberry
FROM ubuntu:20.10 AS build
ENV DENO_VERISON=1.6.3

RUN apt-get -qq update && apt-get upgrade -y --no-install-recommends && \
    apt-get -qq install -y git ca-certificates curl tar build-essential python2 --no-install-recommends && \
    apt-get -qq clean && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://github.com/denoland/deno/releases/download/v1.6.3/deno_src.tar.gz --output deno_src.tar.gz && \
    tar -xvf deno_src.tar.gz && \
    rm deno_src.tar.gz && \
    chmod 755 deno

# add third_party prebuilts missing in release tar
RUN git clone https://github.com/denoland/deno_third_party.git deno/third_party
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
RUN . /root/.cargo/env && cd deno && rustup target add wasm32-unknown-unknown && rustup target add wasm32-wasi
RUN . /root/.cargo/env && cd deno && cargo build --release -vv

# The Stage Where It Happens
FROM ubuntu:20.10 AS run
COPY --from=build deno/target/release/deno /usr/bin/deno

# create workdir & cache dependencies
WORKDIR /usr/src/planning-poker
COPY deps.ts .
RUN deno cache deps.ts

# add the rest!
ADD . .
RUN deno cache src/main.ts

ENTRYPOINT [ "deno", "run", "--allow-read", "--allow-env", "--allow-net", "src/main.ts" ]