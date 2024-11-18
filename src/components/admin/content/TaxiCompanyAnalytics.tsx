import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompanyAnalytics } from '@/services/taxiCompanyService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface TaxiCompanyAnalyticsProps {
  analytics: CompanyAnalytics;
}

export function TaxiCompanyAnalytics({ analytics }: TaxiCompanyAnalyticsProps) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Trips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalTrips.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Completion Rate: {analytics.completionRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenue (YTD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{analytics.revenueData.yearToDate.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Daily: €{analytics.revenueData.daily.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Driver Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.driverPerformance.activeDrivers}/{analytics.driverPerformance.totalDrivers}
            </div>
            <p className="text-xs text-muted-foreground">
              Top Performers: {analytics.driverPerformance.topPerformers}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Customer Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.averageRating.toFixed(1)}/5.0
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.customerFeedback.positive} positive reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trip Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Trip Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.tripDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="trips"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Popular Routes */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.popularRoutes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="from"
                  label={{ value: 'From', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  label={{
                    value: 'Number of Trips',
                    angle: -90,
                    position: 'insideLeft',
                  }}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Customer Feedback Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Customer Feedback Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Positive</span>
                <div className="flex items-center space-x-2">
                  <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{
                        width: `${
                          (analytics.customerFeedback.positive /
                            (analytics.customerFeedback.positive +
                              analytics.customerFeedback.neutral +
                              analytics.customerFeedback.negative)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm">
                    {analytics.customerFeedback.positive}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Neutral</span>
                <div className="flex items-center space-x-2">
                  <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500"
                      style={{
                        width: `${
                          (analytics.customerFeedback.neutral /
                            (analytics.customerFeedback.positive +
                              analytics.customerFeedback.neutral +
                              analytics.customerFeedback.negative)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm">
                    {analytics.customerFeedback.neutral}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Negative</span>
                <div className="flex items-center space-x-2">
                  <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{
                        width: `${
                          (analytics.customerFeedback.negative /
                            (analytics.customerFeedback.positive +
                              analytics.customerFeedback.neutral +
                              analytics.customerFeedback.negative)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm">
                    {analytics.customerFeedback.negative}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Driver Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Active Drivers</span>
                  <span>
                    {analytics.driverPerformance.activeDrivers}/
                    {analytics.driverPerformance.totalDrivers}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${
                        (analytics.driverPerformance.activeDrivers /
                          analytics.driverPerformance.totalDrivers) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Top Performers</span>
                  <span>
                    {analytics.driverPerformance.topPerformers}/
                    {analytics.driverPerformance.totalDrivers}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width: `${
                        (analytics.driverPerformance.topPerformers /
                          analytics.driverPerformance.totalDrivers) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Average Rating</span>
                  <span>{analytics.driverPerformance.averageRating.toFixed(1)}/5.0</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{
                      width: `${
                        (analytics.driverPerformance.averageRating / 5) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
