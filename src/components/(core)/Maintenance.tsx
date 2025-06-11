"use client"
import {
  Wind,
  Wrench,
  Clock,
  Sparkles,
  Activity,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useState, useEffect } from 'react';

const AnimatedIcon = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <div
    className="animate-pulse opacity-30 hover:opacity-60 transition-opacity duration-1000"
    style={{ animationDelay: `${delay}ms`, animationDuration: '3s' }}
  >
    {children}
  </div>
);

const MaintenanceTask = ({
  icon,
  title,
  status,
  description
}: {
  icon: React.ReactNode,
  title: string,
  status: 'completed' | 'in-progress' | 'pending',
  description: string
}) => (
  <div className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-slate-700/20 hover:border-sky-200/50 dark:hover:border-sky-700/50 hover:-translate-y-1">
    <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 to-indigo-50/50 dark:from-sky-900/10 dark:to-indigo-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative flex items-start gap-5">
      <div className="flex-shrink-0 p-3 bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="flex-grow">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-xl font-bold text-slate-800 dark:text-sky-300 group-hover:text-sky-600 dark:group-hover:text-sky-200 transition-colors duration-300">{title}</h3>
          <div className="ml-auto">
            {status === 'completed' && (
              <span className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/50 dark:to-green-900/50 px-4 py-2 rounded-full shadow-sm">
                <CheckCircle2 className="h-4 w-4" />
                Completed
              </span>
            )}
            {status === 'in-progress' && (
              <span className="flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300 bg-gradient-to-r from-blue-100 to-sky-100 dark:from-blue-900/50 dark:to-sky-900/50 px-4 py-2 rounded-full shadow-sm">
                <RefreshCw className="h-4 w-4 animate-spin" />
                In Progress
              </span>
            )}
            {status === 'pending' && (
              <span className="flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-300 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/50 dark:to-yellow-900/50 px-4 py-2 rounded-full shadow-sm">
                <Clock className="h-4 w-4" />
                Pending
              </span>
            )}
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

const parseEnvironmentTime = (envValue: string | undefined, fallbackHours: number = 2, timezone?: string): Date => {
  if (!envValue) {
    return new Date(Date.now() + fallbackHours * 60 * 60 * 1000);
  }
  if (envValue.includes('T') || envValue.includes('-')) {
    if (timezone && !envValue.includes('+') && !envValue.includes('Z') && !envValue.endsWith('Z')) {
      const dateWithTimezone = envValue.includes('T') ? `${envValue}${timezone}` : envValue;
      const parsedDate = new Date(dateWithTimezone);
      return isNaN(parsedDate.getTime()) 
        ? new Date(Date.now() + fallbackHours * 60 * 60 * 1000)
        : parsedDate;
    }
    
    const parsedDate = new Date(envValue);
    return isNaN(parsedDate.getTime()) 
      ? new Date(Date.now() + fallbackHours * 60 * 60 * 1000)
      : parsedDate;
  }
  const hours = parseFloat(envValue);
  if (!isNaN(hours)) {
    return new Date(Date.now() + hours * 60 * 60 * 1000);
  }
  return new Date(Date.now() + fallbackHours * 60 * 60 * 1000);
};

const parseStartTime = (envValue: string | undefined, timezone?: string): Date => {
  if (!envValue) {
    if (timezone) {
      try {
        const now = new Date();
        const timezoneName = timezone.replace(/[+-]\d{2}:\d{2}/, (match) => {
          return match;
        });
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
      } catch (e) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
      }
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }
  if (envValue.includes('T') || envValue.includes('-')) {
    if (timezone && !envValue.includes('+') && !envValue.includes('Z') && !envValue.endsWith('Z')) {
      const dateWithTimezone = envValue.includes('T') ? `${envValue}${timezone}` : envValue;
      const parsedDate = new Date(dateWithTimezone);
      return isNaN(parsedDate.getTime()) 
        ? new Date(Date.now() - 2 * 60 * 60 * 1000)
        : parsedDate;
    }
    
    const parsedDate = new Date(envValue);
    return isNaN(parsedDate.getTime()) 
      ? new Date(Date.now() - 2 * 60 * 60 * 1000)
      : parsedDate;
  }
  if (envValue.toLowerCase() === 'now') {
    return new Date();
  }
  return new Date(Date.now() - 2 * 60 * 60 * 1000);
};

const calculateProgress = (startTime: Date, endTime: Date, currentTime: Date): number => {
  const totalDuration = endTime.getTime() - startTime.getTime();
  const elapsed = currentTime.getTime() - startTime.getTime();
  
  if (elapsed <= 0) return 0;
  if (elapsed >= totalDuration) return 100;
  
  return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
};

export default function MaintenancePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const timezone = process.env.NEXT_PUBLIC_MAINTENANCE_TIMEZONE;
  const startTime = parseStartTime(process.env.NEXT_PUBLIC_MAINTENANCE_START_TIME, timezone);
  const endTime = process.env.NEXT_PUBLIC_MAINTENANCE_END_TIME 
    ? parseEnvironmentTime(process.env.NEXT_PUBLIC_MAINTENANCE_END_TIME, 2, timezone)
    : process.env.NEXT_PUBLIC_MAINTENANCE_DURATION_HOURS
    ? new Date(startTime.getTime() + parseFloat(process.env.NEXT_PUBLIC_MAINTENANCE_DURATION_HOURS) * 60 * 60 * 1000)
    : parseEnvironmentTime(undefined, 2, timezone);
  const progress = calculateProgress(startTime, endTime, currentTime);
  const isMaintenanceComplete = currentTime >= endTime;
  const timeRemaining = Math.max(0, endTime.getTime() - currentTime.getTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const formatTimeRemaining = (milliseconds: number): string => {
    if (milliseconds <= 0) return "Maintenance should be complete";
    
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `~${hours}h ${minutes}m remaining`;
    }
    return `~${minutes}m remaining`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 text-slate-900 dark:text-slate-100 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.15),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.15),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.08),transparent_50%)]"></div>
        
        <AnimatedIcon delay={0}>
          <Wind className="absolute top-20 left-10 h-32 w-32 text-sky-400/20 dark:text-sky-400/10" />
        </AnimatedIcon>
        <AnimatedIcon delay={500}>
          <Sparkles className="absolute bottom-32 right-20 h-24 w-24 text-purple-400/20 dark:text-purple-400/10" />
        </AnimatedIcon>
        <AnimatedIcon delay={1000}>
          <Activity className="absolute top-1/2 left-1/4 h-20 w-20 text-indigo-400/20 dark:text-indigo-400/10" />
        </AnimatedIcon>
        <AnimatedIcon delay={1500}>
          <Wrench className="absolute top-1/3 right-1/3 h-28 w-28 text-blue-400/20 dark:text-blue-400/10" />
        </AnimatedIcon>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center px-6">
        <section className="w-full max-w-6xl mx-auto py-20 md:py-32 text-center">
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-700/70 backdrop-blur-sm rounded-3xl mb-8 shadow-2xl border border-white/20 dark:border-slate-700/20">
              {isMaintenanceComplete ? (
                <CheckCircle2 className="h-16 w-16 text-emerald-500 dark:text-emerald-400 animate-pulse" />
              ) : (
                <Wrench className="h-16 w-16 text-sky-500 dark:text-sky-400 animate-bounce" />
              )}
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 dark:from-sky-400 dark:via-indigo-400 dark:to-purple-400 leading-tight">
            {isMaintenanceComplete ? "We'll Be Back Online Shortly!" : "We're Making Things Better"}
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
            {isMaintenanceComplete 
              ? "Our air quality monitoring system has been successfully updated with improved performance and new features."
              : "Our air quality monitoring system is currently undergoing scheduled maintenance to improve performance and add new features."
            }
          </p>

          <div className={`inline-flex items-center gap-4 border-2 rounded-2xl px-8 py-4 mb-12 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
            isMaintenanceComplete 
              ? "bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border-emerald-300 dark:border-emerald-600"
              : "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 border-amber-300 dark:border-amber-600"
          }`}>
            {isMaintenanceComplete ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-800 dark:text-emerald-200 font-bold text-lg">
                  Maintenance Complete
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                <span className="text-amber-800 dark:text-amber-200 font-bold text-lg">
                  Maintenance in Progress
                </span>
              </>
            )}
          </div>

          {!isMaintenanceComplete && (
            <div className="max-w-lg mx-auto mb-12 p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-slate-700 dark:text-slate-300">Overall Progress</span>
                <span className="text-xl font-black text-sky-600 dark:text-sky-400">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-full h-4 shadow-inner overflow-hidden">
                <div
                  className="bg-gradient-to-r from-sky-500 via-blue-500 to-purple-500 h-4 rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
              <div className="mt-4 text-lg font-semibold text-slate-600 dark:text-slate-300">
                {formatTimeRemaining(timeRemaining)}
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row justify-center items-center gap-8 text-lg text-slate-600 dark:text-slate-300 font-medium">
            <div className="flex items-center gap-3 px-6 py-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/20">
              <Clock className="h-5 w-5 text-sky-500" />
              <span>
                Started: {startTime.toLocaleDateString()} at {startTime.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}
              </span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/20">
              <Clock className="h-5 w-5 text-sky-500" />
              <span>
                {isMaintenanceComplete ? 'Completed' : 'Expected completion'}: {endTime.toLocaleDateString()} at {endTime.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}
              </span>
            </div>
          </div>
        </section>

        <section className="w-full py-24 bg-white/30 dark:bg-slate-800/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/20">
          <div className="container mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-purple-600 dark:from-sky-400 dark:to-purple-400">
                What We're Working On
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
                Here's what's happening behind the scenes to make your experience even better.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <MaintenanceTask
                icon={<ShieldCheck className="h-10 w-10 text-emerald-500" />}
                title="Security Updates"
                status="completed"
                description="Enhanced security protocols and vulnerability patches have been applied."
              />
              {/* Some Exmaples /}
              {/ <MaintenanceTask
                icon={<CircleDotDashedIcon className="h-8 w-8 text-blue-500" />}
                title="Daily Maintenance"
                status="in-progress"
                description="We want to make sure you have the best performance from our app"
              />
              <MaintenanceTask
                icon={<Activity className="h-8 w-8 text-blue-500" />}
                title="Database Optimization"
                status="in-progress"
                description="Improving query performance and data retrieval speeds for faster predictions."
              />
              <MaintenanceTask
                icon={<Wind className="h-8 w-8 text-blue-500" />}
                title="API Enhancements"
                status="in-progress"
                description="Upgrading our air quality data sources for more accurate real-time monitoring."
              />
              <MaintenanceTask
                icon={<Sparkles className="h-8 w-8 text-amber-500" />}
                title="New Features"
                status="pending"
                description="Adding advanced health impact calculations and personalized recommendations."
              /> */}
            </div>
          </div>
        </section>

        <section className="w-full max-w-6xl mx-auto py-24 mt-16">
          <div className="container mx-auto px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-black mb-12 bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-purple-600 dark:from-sky-400 dark:to-purple-400">
                {isMaintenanceComplete ? "What's New" : "What to Expect When We're Back"}
              </h2>
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="group p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Activity className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-sky-300">Smoother Experience</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">Improved loading times and smoother interactions.</p>
                </div>
                {/* <div className="p-6">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-primary dark:text-sky-400">Faster Performance</h3>
                  <p className="text-sm text-muted-foreground">Improved loading times and smoother interactions.</p>
                </div>
                <div className="p-6 bg-card dark:bg-slate-800/30 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-primary dark:text-sky-400">Enhanced Security</h3>
                  <p className="text-sm text-muted-foreground">Better protection for your data and privacy.</p>
                </div>
                <div className="p-6 bg-card dark:bg-slate-800/30 rounded-xl">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-primary dark:text-sky-400">New Features</h3>
                  <p className="text-sm text-muted-foreground">More personalized insights and recommendations.</p>
                </div> */}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 py-12 border-t border-white/20 dark:border-slate-700/20 bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl">
        <div className="container mx-auto px-8 text-center text-slate-600 dark:text-slate-300">
          <p className="text-lg font-semibold mb-2">&copy; {new Date().getFullYear()} Global Air Quality Monitor. All rights reserved.</p>
          <p className="text-sm opacity-75">
            Last updated: {currentTime.toLocaleString()}
          </p>
        </div>
      </footer>
    </div>
  );
}