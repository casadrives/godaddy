import { BehaviorSubject } from 'rxjs';
import bcrypt from 'bcryptjs';

interface AdminUser {
  username: string;
  role: 'admin';
  lastLogin: Date;
}

class AdminAuthService {
  private static instance: AdminAuthService;
  private adminCredentials = {
    username: 'admincasa',
    passwordHash: '$2a$10$E9wQzY6eV3W6oQ0V1Z0Z2eG9G7Q1eQ1eQ1eQ1eQ1eQ1eQ1eQ1e' // bcrypt hash for 'admin123'
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
    console.log(`Attempting login with username: ${username}`);
    if (username === this.adminCredentials.username && bcrypt.compareSync(password, this.adminCredentials.passwordHash)) {
      console.log(`Password hash comparison result: ${bcrypt.compareSync(password, this.adminCredentials.passwordHash)}`);
      const adminUser: AdminUser = {
        username,
        role: 'admin',
        lastLogin: new Date()
      };
      
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      this.currentAdminSubject.next(adminUser);
      return true;
    }
    return false;
  }

  public async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    if (bcrypt.compareSync(currentPassword, this.adminCredentials.passwordHash)) {
      const newPasswordHash = bcrypt.hashSync(newPassword, 10);
      this.adminCredentials.passwordHash = newPasswordHash;
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
