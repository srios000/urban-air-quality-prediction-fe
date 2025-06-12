"use client"
import { ArrowRight, Activity, ShieldCheck, Brain, Sparkles, MapPin, TrendingUp, BarChartHorizontalBig, UserCheck, SlidersHorizontal, Wind, Search, HeartPulse, Star, Zap } from 'lucide-react';
import Link from 'next/link';

const FeatureCard = ({ icon, title, description, link, linkText = "Learn More" }: { icon: React.ReactNode, title: string, description: string, link?: string, linkText?: string }) => (
  <div className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col border border-white/20 dark:border-slate-700/50 hover:border-sky-200 dark:hover:border-sky-400/30 hover:-translate-y-2">
    <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 to-purple-50/50 dark:from-sky-900/20 dark:to-purple-900/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative z-10">
      <div className="flex-shrink-0 mb-1">{icon}</div>
      <h3 className="text-xl font-bold my-4 text-slate-800 dark:text-sky-300 group-hover:text-sky-600 dark:group-hover:text-sky-200 transition-colors duration-300">{title}</h3>
      <p className="text-slate-600 dark:text-slate-300 flex-grow leading-relaxed mb-6">{description}</p>
      {link && (
        <Link href={link} className="mt-auto inline-flex items-center text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-200 font-semibold group/link transition-colors duration-300">
          {linkText}
          <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform duration-300" />
        </Link>
      )}
    </div>
  </div>
);

const ComingSoonFeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 overflow-hidden">
    <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full transform rotate-12 shadow-lg animate-pulse">
      COMING SOON
    </div>
    <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-orange-50/30 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl"></div>
    <div className="relative z-10">
      <div className="flex-shrink-0 mb-1 opacity-75">{icon}</div>
      <h3 className="text-xl font-bold my-4 text-slate-700 dark:text-slate-300">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
    </div>
  </div>
);

const FloatingElement = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <div className={`animate-float`} style={{ animationDelay: `${delay}s` }}>
    {children}
  </div>
);

export default function EnhancedHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 text-foreground overflow-hidden">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
      `}</style>

      <section className="relative py-24 md:py-32 lg:py-40 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <FloatingElement delay={0}>
            <Wind className="absolute top-16 left-16 h-24 w-24 text-sky-400" />
          </FloatingElement>
          <FloatingElement delay={2}>
            <Sparkles className="absolute bottom-32 right-24 h-20 w-20 text-purple-400" />
          </FloatingElement>
          <FloatingElement delay={4}>
            <Activity className="absolute top-1/2 left-1/4 h-16 w-16 text-indigo-400" />
          </FloatingElement>
          <FloatingElement delay={1}>
            <Zap className="absolute top-1/3 right-1/3 h-18 w-18 text-pink-400" />
          </FloatingElement>
        </div>

        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-sky-200/30 to-purple-200/30 dark:from-sky-800/20 dark:to-purple-800/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-indigo-200/30 to-pink-200/30 dark:from-indigo-800/20 dark:to-pink-800/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-700 mb-8">
            <Star className="h-4 w-4 fill-current" />
            Intelligent Air Quality Insights
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 dark:from-sky-400 dark:via-indigo-400 dark:to-purple-400 animate-gradient">
              Breathe Smarter
            </span>
            <br />
            <span className="text-slate-800 dark:text-slate-200">Live Better</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Transform your relationship with air quality through AI-powered insights, real-time monitoring, and personalized health recommendations that adapt to your lifestyle.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link href="/predictions"
                  className="group relative px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <span className="relative z-10 flex items-center">
                Start Predicting
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            </Link>
            
            <Link href="#features"
                  className="px-10 py-4 text-lg font-semibold text-slate-700 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-600 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-300">
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 md:py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 bg-sky-100 dark:bg-sky-900/30 px-4 py-2 rounded-full text-sm font-semibold text-sky-700 dark:text-sky-300 mb-6">
              <Zap className="h-4 w-4" />
              Powerful Features
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-slate-800 dark:text-slate-100">
              Next-Gen Air Quality Tools
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Harness the power of artificial intelligence and real-time data to make informed decisions about your environment.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            <FeatureCard
              icon={<Brain className="h-12 w-12 text-purple-500 drop-shadow-lg" />}
              title="AI-Powered Predictions"
              description="Our advanced machine learning algorithms analyze thousands of data points to provide accurate air quality forecasts up to 7 days ahead. Plan your outdoor activities with confidence."
              link="/predictions"
              linkText="Make a Prediction"
            />
            <FeatureCard
              icon={<MapPin className="h-12 w-12 text-emerald-500 drop-shadow-lg" />}
              title="Location-Based Data"
              description="Access current air quality information for locations worldwide. Get detailed readings for major pollutants with easy-to-understand health impact summaries."
              link="/predictions#current-conditions"
              linkText="Check Current AQI"
            />
            <FeatureCard
              icon={<BarChartHorizontalBig className="h-12 w-12 text-orange-500 drop-shadow-lg" />}
              title="Intelligent Analytics"
              description="Dive deep into historical trends, seasonal patterns, and pollution sources. Our analytics help you understand the 'why' behind air quality changes."
              link="/history"
              linkText="Explore Analytics"
            />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-gradient-to-br from-slate-50 to-sky-50 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-slate-100 leading-tight">
                  Your Health, Our Priority
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  We don't just provide data – we deliver actionable insights that empower you to make healthier choices every day.
                </p>
              </div>
              
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Personalized Recommendations</h4>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">Get tailored advice based on your location, health profile, and daily activities. Every recommendation is designed specifically for you.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Comprehensive Monitoring</h4>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">Track all major pollutants including PM2.5, PM10, O3, NO2, SO2, and CO with professional-grade accuracy and detailed health impact analysis.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Constantly Evolving</h4>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">Our AI models learn and improve continuously, incorporating the latest environmental science research to provide increasingly accurate insights.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 to-purple-400/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-2 rounded-3xl shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1663584266324-8852e9ad11cd?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb&dl=pema-gyamtsho-8BqcqLhs8co-unsplash.jpg" 
                  alt="Clean mountain air and pristine environment" 
                  className="w-full h-96 object-cover rounded-2xl shadow-lg"
                />
                <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  Photo by Pema Gyamtsho on Unsplash
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-sky-100 dark:from-emerald-900/30 dark:to-sky-900/30 px-4 py-2 rounded-full text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-6">
              <Sparkles className="h-4 w-4" />
              What's New
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-slate-800 dark:text-slate-100">
              Innovation Never Stops
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Discover our latest features and get a preview of what's coming next in our mission to revolutionize air quality monitoring.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <FeatureCard
              icon={<HeartPulse className="h-12 w-12 text-rose-500 drop-shadow-lg" />}
              title="Personal Health Impact Calculator"
              description="Revolutionary tool that calculates how air quality affects your specific health profile. Input your age, conditions, and activities to receive personalized risk assessments and protective recommendations tailored just for you."
              link="/health-impact"
              linkText="Try the Calculator"
            />
            
            <ComingSoonFeatureCard
              icon={<SlidersHorizontal className="h-12 w-12 text-indigo-500 drop-shadow-lg" />}
              title="Environmental Impact Simulator"
              description="Explore hypothetical scenarios with our advanced modeling engine. Simulate policy changes, emission reductions, or weather pattern shifts to understand their potential impact on air quality in your area."
            />
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-indigo-700 to-purple-800 dark:from-sky-800 dark:via-indigo-900 dark:to-purple-900"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-4 h-4 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-12 left-24 w-2 h-2 bg-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-24 left-12 w-3 h-3 bg-white rounded-full animate-pulse delay-2000"></div>
          <div className="absolute top-6 left-36 w-2 h-2 bg-white rounded-full animate-pulse delay-500"></div>
          <div className="absolute top-32 left-32 w-4 h-4 bg-white rounded-full animate-pulse delay-1500"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black mb-8 text-white leading-tight">
              Ready to Transform Your
              <br />Air Quality Experience?
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-sky-100 leading-relaxed max-w-2xl mx-auto">
              Start making informed decisions about your environment with our intelligent air quality platform designed for health-conscious individuals.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <Link href="/predictions"
                    className="group relative px-12 py-5 text-lg font-bold text-sky-600 bg-white hover:bg-gray-50 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <span className="flex items-center">
                  Start Your Journey
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
              
              <Link href="#features"
                    className="px-12 py-5 text-lg font-semibold text-white border-2 border-white/30 hover:border-white/50 rounded-2xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300">
                Learn More
              </Link>
            </div>
            
            <div className="mt-16 flex justify-center items-center gap-8 text-sky-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">AI-Powered</div>
                <div className="text-sm">Predictions</div>
              </div>
              <div className="w-px h-8 bg-sky-300/30"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">Global</div>
                <div className="text-sm">Coverage</div>
              </div>
              <div className="w-px h-8 bg-sky-300/30"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">Free</div>
                <div className="text-sm">To Use</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}