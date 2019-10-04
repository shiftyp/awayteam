FROM elixir

RUN apt-get update
RUN apt-get install -y netcat postgresql-client

COPY ./waitfor.sh /

WORKDIR /usr/src/app

RUN mix local.hex --force
RUN mix local.rebar --force

COPY ./chat/mix.exs .

RUN mix deps.get 
RUN mix deps.compile

COPY ./chat ./

EXPOSE 4000