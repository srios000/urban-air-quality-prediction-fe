"use client"
import { ArrowRight, Activity, ShieldCheck, Brain, Sparkles, MapPin, TrendingUp, BarChartHorizontalBig, UserCheck, SlidersHorizontal, Wind, Search } from 'lucide-react';
import Link from 'next/link';

const FeatureCard = ({ icon, title, description, link, linkText = "Learn More" }: { icon: React.ReactNode, title: string, description: string, link?: string, linkText?: string }) => (
  <div className="bg-card dark:bg-slate-800/50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col">
    <div className="flex-shrink-0">{icon}</div>
    <h3 className="text-xl font-semibold my-3 text-primary dark:text-sky-400">{title}</h3>
    <p className="text-muted-foreground flex-grow">{description}</p>
    {link && (
      <Link href={link} className="mt-4 inline-flex items-center text-accent-foreground hover:text-primary dark:hover:text-sky-300 font-medium group">
        {linkText}
        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    )}
  </div>
);

const ComingSoonFeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-card dark:bg-slate-800/50 p-6 rounded-xl shadow-lg relative overflow-hidden">
    <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full transform rotate-12 shadow-md">
      SOON
    </div>
    <div className="flex-shrink-0">{icon}</div>
    <h3 className="text-xl font-semibold my-3 text-primary dark:text-sky-400">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);


export default function EnhancedHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100 dark:from-slate-900 dark:via-gray-900 dark:to-indigo-950 text-foreground">
      <section className="py-20 md:py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <Wind className="absolute top-10 left-10 h-32 w-32 text-sky-300 animate-pulse" />
          <Sparkles className="absolute bottom-20 right-20 h-24 w-24 text-purple-300 animate-ping delay-1000" />
          <Activity className="absolute top-1/2 left-1/3 h-20 w-20 text-indigo-300 animate-spin-slow" />
        </div>
        <div className="container mx-auto px-6 relative">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 dark:from-sky-400 dark:via-indigo-400 dark:to-purple-400">
            Breathe Easier with Smart Air Insights
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Your intelligent companion for real-time air quality monitoring, AI-powered predictions, and personalized health recommendations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="#features"
                  className="px-8 py-3.5 text-lg font-semibold text-primary dark:text-sky-400 border-2 border-primary dark:border-sky-400 rounded-lg hover:bg-primary/5 dark:hover:bg-sky-400/10 transition-colors duration-300">
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary dark:text-sky-400">Powerful Tools for Cleaner Air</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Leverage cutting-edge technology to understand and predict air quality around you.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="h-10 w-10 text-purple-500 mb-2" />}
              title="AI-Powered Predictions"
              description="Get future air quality forecasts using our advanced machine learning models. Plan your activities with foresight."
              link="/predictions"
              linkText="Make a Prediction"
            />
            <FeatureCard
              icon={<MapPin className="h-10 w-10 text-green-500 mb-2" />}
              title="Real-Time Conditions"
              description="Access up-to-the-minute air quality data for any location. Stay informed about your current environment."
              link="/predictions#current-conditions"
              linkText="Check Current AQI"
            />
            <FeatureCard
              icon={<BarChartHorizontalBig className="h-10 w-10 text-orange-500 mb-2" />}
              title="Historical Data Analysis"
              description="Review past air quality trends and your prediction history to understand patterns and changes over time."
              link="/history"
              linkText="View History"
            />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-800/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary dark:text-sky-400">Protect Your Environment, Protect Your Health</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              We empower you with data-driven insights for a healthier life.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <ShieldCheck className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-semibold text-primary dark:text-sky-400">Actionable Insights</h4>
                  <p className="text-muted-foreground">Not just data, but clear summaries and recommendations to help you make informed decisions.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Activity className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-semibold text-primary dark:text-sky-400">Comprehensive Monitoring</h4>
                  <p className="text-muted-foreground">Track key pollutants (PM2.5, PM10, O3, NO2, SO2, CO) and understand their impact.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <TrendingUp className="h-8 w-8 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-semibold text-primary dark:text-sky-400">Always Improving</h4>
                  <p className="text-muted-foreground">We continuously refine our models and add new features to provide you with the best possible service.</p>
                </div>
              </div>
            </div>
            <div className="mt-10 md:mt-0">
              <img src="https://images.unsplash.com/photo-1599760087294-0c01ec130639?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xlYW4lMjBhaXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" alt="Clean environment" className="rounded-lg shadow-xl mx-auto" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary dark:text-sky-400">Exciting Features on the Horizon!</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              We're constantly innovating to bring you even more powerful tools for air quality management.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <ComingSoonFeatureCard
              icon={<UserCheck className="h-10 w-10 text-teal-500 mb-2" />}
              title="Personal Health Impact Calculator"
              description="Understand how current and predicted air quality specifically affects you based on your age, health conditions, and exposure time. Get tailored recommendations."
            />
            <ComingSoonFeatureCard
              icon={<SlidersHorizontal className="h-10 w-10 text-indigo-500 mb-2" />}
              title="'What-If' Scenario Tool"
              description="Explore the potential impact of emission changes. Simulate scenarios like 'What if vehicle emissions decrease by 30%?' and see the predicted outcomes."
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary via-blue-700 to-purple-600 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Take Control of Your Air?</h2>
          <p className="text-lg md:text-xl mb-10 max-w-xl mx-auto">
            Join thousands of users who are making informed decisions about their environment and health.
          </p>
          <Link href="/predictions"
                className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold bg-slate-400 dark:bg-slate-600 text-primary rounded-lg shadow-xl hover:bg-slate-100 hover:dark:bg-slate-400 transition-colors duration-300 group">
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}