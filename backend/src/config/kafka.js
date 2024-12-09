const kafka = require("kafka-node");

// Kafka client setup
const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
const producer = new kafka.Producer(client);

// Kafka consumer setup
const consumer = new kafka.Consumer(
  client,
  [{ topic: "votes", partition: 0 }],
  { autoCommit: true }
);

// Handling producer readiness
producer.on("ready", () => {
  console.log("Kafka Producer is ready");
});

// Error handling
producer.on("error", (err) => {
  console.error("Kafka Producer Error:", err);
});

// Handling consumer messages
consumer.on("message", (message) => {
  console.log("Received message from Kafka:", message);
});

consumer.on("error", (err) => {
  console.error("Kafka Consumer Error:", err);
});

module.exports = { producer, consumer };
