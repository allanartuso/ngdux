import jsonServer from 'json-server';
import { db } from './db';
import { pageMiddleware } from './page.middleware';

const server = jsonServer.create();
const router = jsonServer.router(db);

server.use(jsonServer.defaults());
server.use(
  jsonServer.rewriter({
    '/api/*': '/$1'
  })
);
server.use(pageMiddleware);
server.use(jsonServer.bodyParser);
server.use(router);

server.listen(3000, () => {
  console.log('Json server is running on port 3000');
});
