package main

import (
  "context"
  "encoding/json"
  "log"
  "net/http"
  "strconv"
  "strings"
  
  "github.com/elastic/go-elasticsearch/v7"
  "github.com/elastic/go-elasticsearch/v7/esapi"
)

type BinaryAnnotation struct {
  Key string `json:"key"`
  Value string `json:"value"`
}

type Span struct {
  ID string `json:"id"`
  ParentID string `json:"parentId"`
  TraceID string`json:"traceId"`
  Name string `json:"name"`
  Duration float32 `json:"duration"`
  Timestamp int `json:"timestamp"`
  BinaryAnnotations []BinaryAnnotation `json:"binaryAnnotations"`
}

func makeHandler(es *elasticsearch.Client) func(http.ResponseWriter,*http.Request) {
  return func(rw http.ResponseWriter, req * http.Request) {
    decoder := json.NewDecoder(req.Body)
    var spans []Span
    err := decoder.Decode(&spans)

    if err != nil {
      panic(err)
    }

    for _, span := range(spans) {
      m := make(map[string]interface{})

      m["id"] = span.ID
      m["parentId"] = span.ParentID
      m["traceId"] = span.TraceID
      m["name"] = span.Name
      m["duration"] = span.Duration
      m["@timestamp"] = int64(float64(span.Timestamp) / 1e3)

      for _, annotation := range span.BinaryAnnotations {
        var value interface{} = annotation.Value
        f, err := strconv.ParseFloat(annotation.Value, 10)

        if err == nil {
          value = f
        }

        m[annotation.Key] = value
      }

      json, err := json.Marshal(m)

      if err != nil {
        panic(err)
      }

      indexReq := esapi.IndexRequest{
        Index:      "tracing",
        DocumentID: span.ID,
        Body:       strings.NewReader(string(json)),
        Refresh:    "true",
      }

      indexRes, err := indexReq.Do(context.Background(), es)

      if err != nil {
        panic(err)
      }

      defer indexRes.Body.Close()
    }
  }
}

func main() {
  es, err := elasticsearch.NewDefaultClient()
  if err != nil {
    log.Fatalf("Error creating the client: %s", err)
  }
  http.HandleFunc("/api/v1/spans", makeHandler(es))
  log.Fatal(http.ListenAndServe(":9411", nil))
}