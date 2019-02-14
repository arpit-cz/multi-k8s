const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const sub = redisClient.duplicate();
console.log(`redis server:- host: ${keys.redisHost} port: ${keys.redisPort}`);

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
  console.log('i m in worker: ' + message);
  redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');
console.log('worker is working');
