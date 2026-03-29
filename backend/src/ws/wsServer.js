import { WebSocketServer } from 'ws';
let wss;
export function initWebSocket(server) {
  wss = new WebSocketServer({ noServer: true });
  server.on('upgrade', (req, socket, head) => {
    if (req.url === '/ws') {
      wss.handleUpgrade(req, socket, head, ws => {
        wss.emit('connection', ws, req);
      });
    }
  });
}
export function getWSS() { return wss; }