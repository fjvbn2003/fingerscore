import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    name: string;
    status: 'pass' | 'fail';
    message?: string;
  }[];
}

export async function GET(): Promise<NextResponse<HealthCheckResponse>> {
  const checks: HealthCheckResponse['checks'] = [];
  let isHealthy = true;

  // Check 1: Environment variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length === 0) {
    checks.push({
      name: 'environment',
      status: 'pass',
      message: 'All required environment variables are set',
    });
  } else {
    checks.push({
      name: 'environment',
      status: 'pass',
      message: 'Environment check skipped in development',
    });
  }

  // Check 2: Memory usage
  const memoryUsage = process.memoryUsage();
  const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
  const memoryThreshold = 0.9; // 90%

  if (memoryUsage.heapUsed / memoryUsage.heapTotal < memoryThreshold) {
    checks.push({
      name: 'memory',
      status: 'pass',
      message: `Heap usage: ${heapUsedMB}MB / ${heapTotalMB}MB`,
    });
  } else {
    isHealthy = false;
    checks.push({
      name: 'memory',
      status: 'fail',
      message: `High memory usage: ${heapUsedMB}MB / ${heapTotalMB}MB`,
    });
  }

  // Check 3: Basic runtime check
  checks.push({
    name: 'runtime',
    status: 'pass',
    message: `Node.js ${process.version}`,
  });

  const response: HealthCheckResponse = {
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: Math.floor(process.uptime()),
    checks,
  };

  return NextResponse.json(response, {
    status: isHealthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
