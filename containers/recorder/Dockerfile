FROM golang:1.11

RUN apt-get update
RUN apt-get install -y netcat

ENV GO111MODULE=on

WORKDIR /go/src/app
COPY ./recorder/go.mod .

RUN go mod download

COPY ./recorder .

RUN go install -v ./...

COPY ./waitfor.sh /

CMD ["recorder"]