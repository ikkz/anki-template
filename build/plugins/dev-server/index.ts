import Router from '@koa/router';
import Koa from 'koa';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PassThrough } from 'node:stream';
import type { Plugin } from 'rolldown';

const log = (...args: any[]) => console.log('[devServer]', ...args);

const devServer = ({ port = 3000 } = {}) => {
  const koa = new Koa();
  const router = new Router();

  let sendCommand: null | ((cmd: string) => void) = null;
  router.get('/__dev_server', (ctx) => {
    ctx.set('Content-Type', 'text/event-stream');
    ctx.set('Cache-Control', 'no-cache');
    ctx.set('Connection', 'keep-alive');
    const stream = new PassThrough();
    ctx.status = 200;
    ctx.body = stream;
    sendCommand = (cmd) => {
      stream.write(`data: ${cmd}\n\n`);
    };
    ctx.req.on('close', () => {
      sendCommand = null;
    });
  });

  let html = '';
  router.get('/', (ctx) => {
    ctx.body = html;
  });

  koa.use(router.routes()).use(router.allowedMethods());
  koa.listen(port, '0.0.0.0');

  let firstBundle = true;

  log('bundling...');

  return {
    name: 'dev-server',
    watchChange() {
      sendCommand?.('update');
      log('rebundling...');
    },
    async generateBundle(_, bundle) {
      let body = '';
      Object.values(bundle).forEach((file) => {
        if (
          file.type === 'asset' &&
          path.extname(file.fileName) === '.html' &&
          !file.fileName.endsWith('back.html')
        ) {
          body += file.source;
        }
      });
      body += `<script> ${await fs.readFile(path.resolve(import.meta.dirname, 'runtime.js'), { encoding: 'utf-8' })} </script>`;
      html = `<!DOCTYPE html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body>${body}</body>
`;
      sendCommand?.('refresh');
      if (firstBundle) {
        firstBundle = false;
        log('ready to dev:', `http://localhost:${port}`);
      } else {
        log('refresh sent');
      }
    },
  } as Plugin;
};

export default devServer;
