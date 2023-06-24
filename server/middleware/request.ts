export default defineEventHandler((event) => {
  // eslint-disable-next-line no-console
  console.log(
    `\x1B[2m[${new Date().toLocaleString()}]\x1B[0m`,
    `\x1B[32m${event.node.req.method}\x1B[0m`,
    `\x1B[2m[HTTP/${event.node.req.httpVersion}]\x1B[0m`,
    event.node.req.url
  );
});
