interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'ADMIN' | 'DRIVER';
  read: boolean;
  driverId: string;
}

class DriverCommunicationService {
  private messages: Message[] = [];

  // Send a message to a driver
  async sendMessage(driverId: string, content: string): Promise<Message> {
    const message: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      sender: 'ADMIN',
      read: false,
      driverId,
    };

    this.messages.push(message);
    // In a real implementation, this would send the message to a backend service
    return message;
  }

  // Get message history for a specific driver
  async getMessageHistory(driverId: string): Promise<Message[]> {
    return this.messages.filter((m) => m.driverId === driverId);
  }

  // Mark messages as read
  async markMessagesAsRead(driverId: string): Promise<void> {
    this.messages
      .filter((m) => m.driverId === driverId && !m.read)
      .forEach((m) => {
        m.read = true;
      });
  }

  // Get unread message count for a driver
  async getUnreadCount(driverId: string): Promise<number> {
    return this.messages.filter((m) => m.driverId === driverId && !m.read).length;
  }

  // Mock receiving a message from a driver
  async mockReceiveDriverMessage(
    driverId: string,
    content: string
  ): Promise<Message> {
    const message: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      sender: 'DRIVER',
      read: false,
      driverId,
    };

    this.messages.push(message);
    return message;
  }

  // Get message templates
  getMessageTemplates() {
    return [
      {
        id: 'doc_reminder',
        title: 'Document Reminder',
        content: 'Please submit your updated [document_type] by [date].',
      },
      {
        id: 'verification_success',
        title: 'Verification Success',
        content: 'Your [document_type] has been successfully verified.',
      },
      {
        id: 'verification_failed',
        title: 'Verification Failed',
        content: 'Your [document_type] verification failed. Reason: [reason]',
      },
      {
        id: 'performance_update',
        title: 'Performance Update',
        content:
          'Your current rating is [rating]. Keep up the good work! / Please work on improving your service.',
      },
      {
        id: 'maintenance_reminder',
        title: 'Vehicle Maintenance',
        content:
          'Your vehicle is due for maintenance by [date]. Please schedule an appointment.',
      },
    ];
  }

  // Fill template with actual values
  fillTemplate(
    templateId: string,
    values: { [key: string]: string }
  ): string | null {
    const template = this.getMessageTemplates().find((t) => t.id === templateId);
    if (!template) return null;

    let content = template.content;
    Object.entries(values).forEach(([key, value]) => {
      content = content.replace(`[${key}]`, value);
    });

    return content;
  }
}

export const driverCommunicationService = new DriverCommunicationService();
export default driverCommunicationService;
