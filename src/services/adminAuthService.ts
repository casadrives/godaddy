import { BehaviorSubject } from 'rxjs';

interface AdminUser {
  username: string;
  role: 'admin';
  lastLogin: Date;
}

class AdminAuthService {
  private static instance: AdminAuthService;
  private adminCredentials = {
    username: 'admincasa',
    password: 'admin123'
  };

  private currentAdminSubject = new BehaviorSubject<AdminUser | null>(null);

  private constructor() {
    // Check if there's a stored admin session
    const storedAdmin = localStorage.getItem('adminUser');
    if (storedAdmin) {
      this.currentAdminSubject.next(JSON.parse(storedAdmin));
    }
  }

  public static getInstance(): AdminAuthService {
    if (!AdminAuthService.instance) {
      AdminAuthService.instance = new AdminAuthService();
    }
    return AdminAuthService.instance;
  }

  public get currentAdmin() {
    return this.currentAdminSubject.value;
  }

  public get currentAdminObservable() {
    return this.currentAdminSubject.asObservable();
  }

  public async login(username: string, password: string): Promise<boolean> {
    if (username === this.adminCredentials.username && password === this.adminCredentials.password) {
      const adminUser: AdminUser = {
        username,
        role: 'admin',
        lastLogin: new Date()
      };
      
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      this.currentAdminSubject.next(adminUser);
      return true;
    }
    throw new Error('Invalid credentials');
  }

  public async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    if (currentPassword === this.adminCredentials.password) {
      this.adminCredentials.password = newPassword;
      return true;
    }
    throw new Error('Current password is incorrect');
  }

  public logout() {
    localStorage.removeItem('adminUser');
    this.currentAdminSubject.next(null);
  }

  public isAuthenticated(): boolean {
    return !!this.currentAdminSubject.value;
  }
}

export const adminAuthService = AdminAuthService.getInstance();
