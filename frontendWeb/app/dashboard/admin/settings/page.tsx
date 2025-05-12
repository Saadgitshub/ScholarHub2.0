"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Globe, Mail, Shield, Bell } from "lucide-react"

export default function AdminSettings() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSaveSettings = () => {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">Configure and manage your school system settings.</p>
      </div>
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
              <CardDescription>Basic information about your school</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="school-name">School Name</Label>
                <Input id="school-name" defaultValue="Westside High School" />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="school-address">Address</Label>
                <Textarea id="school-address" defaultValue="123 Education Lane, Learning City, LC 12345" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="school-phone">Phone Number</Label>
                  <Input id="school-phone" defaultValue="(555) 123-4567" />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="school-email">Email</Label>
                  <Input id="school-email" defaultValue="info@westsidehigh.edu" />
                </div>
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="school-website">Website</Label>
                <Input id="school-website" defaultValue="https://www.westsidehigh.edu" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>Configure system-wide preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="America/New_York">
                  <SelectTrigger id="timezone">
                    <Globe className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="date-format">Date Format</Label>
                <Select defaultValue="MM/DD/YYYY">
                  <SelectTrigger id="date-format">
                    <Calendar className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="time-format">Time Format</Label>
                <Select defaultValue="12">
                  <SelectTrigger id="time-format">
                    <Clock className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12-hour (AM/PM)</SelectItem>
                    <SelectItem value="24">24-hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode by Default</Label>
                  <p className="text-sm text-muted-foreground">Set dark mode as the default theme for all users</p>
                </div>
                <Switch id="dark-mode" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="academic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Year</CardTitle>
              <CardDescription>Configure the academic calendar and grading periods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="current-year">Current Academic Year</Label>
                  <Input id="current-year" defaultValue="2024-2025" />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="term-system">Term System</Label>
                  <Select defaultValue="semester">
                    <SelectTrigger id="term-system">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semester">Semester</SelectItem>
                      <SelectItem value="quarter">Quarter</SelectItem>
                      <SelectItem value="trimester">Trimester</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Term Dates</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="fall-start">Fall Start Date</Label>
                    <Input id="fall-start" type="date" defaultValue="2024-09-01" />
                  </div>
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="fall-end">Fall End Date</Label>
                    <Input id="fall-end" type="date" defaultValue="2024-12-20" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="spring-start">Spring Start Date</Label>
                    <Input id="spring-start" type="date" defaultValue="2025-01-15" />
                  </div>
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="spring-end">Spring End Date</Label>
                    <Input id="spring-end" type="date" defaultValue="2025-05-30" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Grading System</CardTitle>
              <CardDescription>Configure the grading scale and calculation methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="grading-scale">Grading Scale</Label>
                <Select defaultValue="standard">
                  <SelectTrigger id="grading-scale">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard (A, B, C, D, F)</SelectItem>
                    <SelectItem value="plus-minus">Plus/Minus (A+, A, A-, etc.)</SelectItem>
                    <SelectItem value="numerical">Numerical (0-100)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Grade Thresholds</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="a-threshold">A Threshold (%)</Label>
                    <Input id="a-threshold" type="number" defaultValue="90" />
                  </div>
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="b-threshold">B Threshold (%)</Label>
                    <Input id="b-threshold" type="number" defaultValue="80" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="c-threshold">C Threshold (%)</Label>
                    <Input id="c-threshold" type="number" defaultValue="70" />
                  </div>
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="d-threshold">D Threshold (%)</Label>
                    <Input id="d-threshold" type="number" defaultValue="60" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weighted-gpa">Use Weighted GPA</Label>
                  <p className="text-sm text-muted-foreground">Calculate GPA with honors and AP course weights</p>
                </div>
                <Switch id="weighted-gpa" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure system-wide notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send email notifications to users</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>In-App Notifications</Label>
                    <p className="text-sm text-muted-foreground">Show notifications within the application</p>
                  </div>
                  <Switch id="in-app-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send text message notifications (additional charges may apply)
                    </p>
                  </div>
                  <Switch id="sms-notifications" />
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Notification Events</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Grade Updates</Label>
                      <p className="text-sm text-muted-foreground">Notify when grades are updated</p>
                    </div>
                    <Switch id="grade-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Assignment Posts</Label>
                      <p className="text-sm text-muted-foreground">Notify when new assignments are posted</p>
                    </div>
                    <Switch id="assignment-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>System Announcements</Label>
                      <p className="text-sm text-muted-foreground">Notify for important system announcements</p>
                    </div>
                    <Switch id="announcement-notifications" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>Configure the email server settings for notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="smtp-server">SMTP Server</Label>
                <Input id="smtp-server" defaultValue="smtp.westsidehigh.edu" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input id="smtp-port" defaultValue="587" />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="smtp-security">Security</Label>
                  <Select defaultValue="tls">
                    <SelectTrigger id="smtp-security">
                      <Mail className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="ssl">SSL</SelectItem>
                      <SelectItem value="tls">TLS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="smtp-username">Username</Label>
                <Input id="smtp-username" defaultValue="notifications@westsidehigh.edu" />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="smtp-password">Password</Label>
                <Input id="smtp-password" type="password" defaultValue="••••••••••••" />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="from-email">From Email</Label>
                <Input id="from-email" defaultValue="no-reply@westsidehigh.edu" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure system-wide security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require two-factor authentication for all admin accounts
                    </p>
                  </div>
                  <Switch id="two-factor" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Password Complexity</Label>
                    <p className="text-sm text-muted-foreground">
                      Require complex passwords (min. 8 chars, uppercase, lowercase, number, symbol)
                    </p>
                  </div>
                  <Switch id="password-complexity" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Password Expiration</Label>
                    <p className="text-sm text-muted-foreground">Require password changes every 90 days</p>
                  </div>
                  <Switch id="password-expiration" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Account Lockout</Label>
                    <p className="text-sm text-muted-foreground">Lock accounts after 5 failed login attempts</p>
                  </div>
                  <Switch id="account-lockout" defaultChecked />
                </div>
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input id="session-timeout" type="number" defaultValue="30" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Data Protection</CardTitle>
              <CardDescription>Configure data protection and privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Data Encryption</Label>
                    <p className="text-sm text-muted-foreground">Encrypt sensitive data in the database</p>
                  </div>
                  <Switch id="data-encryption" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automated Backups</Label>
                    <p className="text-sm text-muted-foreground">Perform daily automated backups of all system data</p>
                  </div>
                  <Switch id="automated-backups" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Data Retention</Label>
                    <p className="text-sm text-muted-foreground">Automatically archive data older than 5 years</p>
                  </div>
                  <Switch id="data-retention" />
                </div>
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="backup-location">Backup Storage Location</Label>
                <Input id="backup-location" defaultValue="s3://westsidehigh-backups/" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure advanced system settings (use with caution)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Put the system in maintenance mode (only admins can access)
                    </p>
                  </div>
                  <Switch id="maintenance-mode" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Debug Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable detailed error logging and debugging</p>
                  </div>
                  <Switch id="debug-mode" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>API Access</Label>
                    <p className="text-sm text-muted-foreground">Allow external API access to the system</p>
                  </div>
                  <Switch id="api-access" defaultChecked />
                </div>
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="log-level">Log Level</Label>
                <Select defaultValue="info">
                  <SelectTrigger id="log-level">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warn">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                    <SelectItem value="trace">Trace</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="cache-ttl">Cache TTL (seconds)</Label>
                <Input id="cache-ttl" type="number" defaultValue="3600" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="destructive">
                <Shield className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button onClick={handleSaveSettings} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>View system information and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Version:</span>
                  <span className="text-sm">ScholarHub v2.5.3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Last Updated:</span>
                  <span className="text-sm">Apr 15, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Database Size:</span>
                  <span className="text-sm">4.2 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Total Users:</span>
                  <span className="text-sm">1,312</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Server Status:</span>
                  <span className="text-sm text-green-500">Healthy</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Bell className="mr-2 h-4 w-4" />
                Check for Updates
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
