const app = require("express")();
const http = require("http").createServer(app);
const morgan = require("morgan");
const {
  initialize,
  getFeatureToggleDefinitions,
  isEnabled
} = require("unleash-client");

// !!!!!

// !!!!!!!!!

const { UNLEASH_URL } = process.env;
const instance = initialize({
  url: UNLEASH_URL,
  appName: "awayteam",
  instanceId: process.id
});

instance.on("error", console.error);
instance.on("warn", console.warn);
instance.on("ready", console.log);

app.use(morgan("combined"));

app.get("/session/:sessionId", (req, res) => {
  const context = {
    sessionId: req.params.sessionId
  };
  const features = getFeatureToggleDefinitions().reduce((acc, { name }) => {
    acc[name] = isEnabled(name, context);
    return acc;
  }, {});
  res.send(features);
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
