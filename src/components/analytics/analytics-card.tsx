import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Eye, MousePointer, TrendingUp, Users } from 'lucide-react';

/**
 * Analytics Card Component
 * Displays analytics overview in the admin dashboard
 *
 * Note: This shows information about how to access Vercel Analytics.
 * Actual analytics data is viewed through Vercel Dashboard.
 */
export function AnalyticsCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <CardTitle>Website Analytics</CardTitle>
        </div>
        <CardDescription>
          Track visitor behavior and website performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Analytics Features */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3 rounded-lg border p-3">
              <Eye className="h-5 w-5 mt-0.5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Page Views</p>
                <p className="text-xs text-muted-foreground">
                  Track all page visits
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-3">
              <Users className="h-5 w-5 mt-0.5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Visitors</p>
                <p className="text-xs text-muted-foreground">
                  Unique visitor count
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-3">
              <MousePointer className="h-5 w-5 mt-0.5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Custom Events</p>
                <p className="text-xs text-muted-foreground">
                  Track user actions
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-3">
              <TrendingUp className="h-5 w-5 mt-0.5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Performance</p>
                <p className="text-xs text-muted-foreground">
                  Speed insights
                </p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <p className="text-sm font-medium">View Detailed Analytics</p>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Go to Vercel Dashboard</li>
              <li>Select your project</li>
              <li>Click "Analytics" tab</li>
              <li>View real-time visitor data</li>
            </ol>
            <a
              href="https://vercel.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-primary hover:underline mt-2"
            >
              Open Vercel Dashboard →
            </a>
          </div>

          {/* Tracked Events */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Tracked Events</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>✓ Page views (automatic)</p>
              <p>✓ Project clicks</p>
              <p>✓ Contact form submissions</p>
              <p>✓ Social link clicks</p>
              <p>✓ Resume downloads</p>
              <p>✓ Admin actions</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
