import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message } from 'src/messages/messages.interface';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  private connectedClients: Map<string, string> = new Map();
  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const payload = this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN,
      });

      const privateRoom = `user-${payload.id}`;
      await client.join(privateRoom);
      this.connectedClients.set(privateRoom, privateRoom);
      console.log('Client joined');
    } catch (error) {
      console.log('error', error);
    }
  }

  sendMessage(userId: string, message: Message) {
    const privateRoom = `user-${userId}`;

    if (this.connectedClients.has(privateRoom)) {
      this.server.to(privateRoom).emit('new_message', message);
    }
  }
}
