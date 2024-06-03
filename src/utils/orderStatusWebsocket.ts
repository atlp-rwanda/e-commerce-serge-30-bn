import { Server } from 'http';
import { WebSocketServer } from 'ws';

interface BroadcastData {
  message: string;
  orderId?: string;
  status?: string;
  expectedDeliveryDate?: Date;
}

export class WebSocketService {
  private wss: WebSocketServer;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', (ws) => {
      console.log('WebSocket connection established');

      ws.on('close', () => {
        console.log('WebSocket connection closed');
      });

      ws.on('error', (error) => {
        console.error('WebSocket error', error);
      });
    });
  }

  public notifyOrderStatusChange(data: BroadcastData) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
}