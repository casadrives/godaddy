import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, Shield, Bell } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export function UserProfile() {
  const [isEditing, setIsEditing] = React.useState(false);

  const user = {
    name: 'Sophie Martin',
    email: 'sophie.martin@example.com',
    phone: '+352 691 234 567',
    avatar: '/avatars/sophie.jpg',
    preferences: {
      notifications: true,
      emailUpdates: true,
      twoFactor: false,
    },
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <p className="text-muted-foreground">Member since January 2024</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="space-y-4">
          <div className="grid gap-3">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              defaultValue={user.name}
              disabled={!isEditing}
              className="max-w-md"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue={user.email}
              disabled={!isEditing}
              className="max-w-md"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              defaultValue={user.phone}
              disabled={!isEditing}
              className="max-w-md"
            />
          </div>
          {isEditing && (
            <Button className="mt-4">Save Changes</Button>
          )}
        </div>
      </Card>

      {/* Preferences */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Push Notifications</div>
              <div className="text-sm text-muted-foreground">
                Receive notifications about your rides
              </div>
            </div>
            <Switch
              checked={user.preferences.notifications}
              onCheckedChange={() => {}}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Email Updates</div>
              <div className="text-sm text-muted-foreground">
                Receive ride summaries and receipts
              </div>
            </div>
            <Switch
              checked={user.preferences.emailUpdates}
              onCheckedChange={() => {}}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Two-Factor Authentication</div>
              <div className="text-sm text-muted-foreground">
                Add an extra layer of security
              </div>
            </div>
            <Switch
              checked={user.preferences.twoFactor}
              onCheckedChange={() => {}}
            />
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-destructive">
        <h3 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button variant="destructive">Delete Account</Button>
      </Card>
    </div>
  );
}
