type MessageHandler = (data: any) => void;

interface WebSocketOptions {
  reconnectAttempts?: number;
  reconnectInterval?: number;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: Map<string, MessageHandler> = new Map();
  private reconnectAttempts: number;
  private reconnectInterval: number;
  private reconnectCount: number = 0;
  private isConnecting: boolean = false;
  private onOpenCallback?: () => void;
  private onCloseCallback?: () => void;
  private onErrorCallback?: (error: Event) => void;
  private heartbeatInterval: number = 30000; // 30 seconds
  private heartbeatTimer?: NodeJS.Timeout;
  private lastHeartbeat: number = 0;

  constructor(options: WebSocketOptions = {}) {
    this.reconnectAttempts = options.reconnectAttempts || Number(import.meta.env.VITE_WEBSOCKET_RECONNECT_ATTEMPTS) || 5;
    this.reconnectInterval = options.reconnectInterval || Number(import.meta.env.VITE_WEBSOCKET_RECONNECT_INTERVAL) || 2000;
    this.onOpenCallback = options.onOpen;
    this.onCloseCallback = options.onClose;
    this.onErrorCallback = options.onError;
  }

  private getWebSocketUrl(): string {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = import.meta.env.VITE_WS_URL || `${wsProtocol}//${window.location.host}`;
    return wsUrl;
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send('heartbeat', { timestamp: Date.now() });
        
        // Check if we haven't received a heartbeat response in too long
        const now = Date.now();
        if (this.lastHeartbeat && now - this.lastHeartbeat > this.heartbeatInterval * 2) {
          console.warn('No heartbeat received, reconnecting...');
          this.reconnect();
        }
      }
    }, this.heartbeatInterval);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = undefined;
    }
  }

  private reconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connect();
  }

  private attemptReconnect(): void {
    if (this.reconnectCount >= this.reconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    this.reconnectCount++;
    console.log(`Attempting to reconnect (${this.reconnectCount}/${this.reconnectAttempts})...`);
    
    setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) return;

    this.isConnecting = true;
    const wsUrl = this.getWebSocketUrl();
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.isConnecting = false;
      this.reconnectCount = 0;
      this.startHeartbeat();
      this.onOpenCallback?.();
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.isConnecting = false;
      this.stopHeartbeat();
      this.onCloseCallback?.();
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.onErrorCallback?.(error);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { type, payload } = data;
        
        if (type === 'heartbeat') {
          this.lastHeartbeat = Date.now();
          return;
        }

        const handler = this.messageHandlers.get(type);
        if (handler) {
          handler(payload);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  }

  subscribe<T>(type: string, handler: (data: T) => void): () => void {
    this.messageHandlers.set(type, handler);
    return () => this.messageHandlers.delete(type);
  }

  send(type: string, payload: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  disconnect(): void {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageHandlers.clear();
    this.reconnectCount = 0;
  }
}

export const wsService = new WebSocketService();
