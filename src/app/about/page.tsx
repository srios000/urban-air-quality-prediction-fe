import { ThemeToggle } from '@/components/(utility)/themeToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Target, Zap, Database, Globe, Brain, BarChart3 } from 'lucide-react';

export default function AboutPage() {
  const teamMembers = [
    {
      id: "A002YBF021",
      name: "Agung Kurniawan",
      institution: "Institut Teknologi Bandung",
      status: "active"
    },
    {
      id: "A135YAM326",
      name: "Muhammad Husain",
      institution: "Politeknik Negeri Ujung Pandang",
      status: "inactive"
    },
    {
      id: "A009YBF463",
      name: "Sintario Satya",
      institution: "Universitas Gunadarma",
      status: "active"
    },
    {
      id: "A135XAF486",
      name: "Tsamarah Muthi'ah Abdullah",
      institution: "Politeknik Negeri Ujung Pandang",
      status: "active"
    }
  ];

  const milestones = [
    {
      code: "M1",
      title: "Data Collection & Preprocessing",
      date: "19 Mei 2025",
      status: "completed"
    },
    {
      code: "M2", 
      title: "Baseline Model & EDA",
      date: "24 Mei 2025",
      status: "completed"
    },
    {
      code: "M3",
      title: "Optimized ML Model & Initial API",
      date: "31 Mei 2025", 
      status: "completed"
    },
    {
      code: "M4",
      title: "Visualization & System Integration",
      date: "9 Juni 2025",
      status: "delayed"
    },
    {
      code: "M5",
      title: "Project Finalization & Documentation",
      date: "11 Juni 2025",
      status: "delayed"
    }
  ];

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Manual Prediction",
      description: "Input pollution data directly to get AQI predictions"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Location-based Prediction", 
      description: "Select points on map for automatic pollution data retrieval and AQI prediction"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Interactive Visualization",
      description: "Air quality monitoring with interactive maps"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Historical Tracking",
      description: "MongoDB storage for comprehensive historical data analysis"
    }
  ];

  const techStack = [
    { name: "XGBoost", type: "ML Model" },
    { name: "FastAPI", type: "Backend" },
    { name: "Next.js", type: "Frontend" },
    { name: "MongoDB", type: "Database" },
    { name: "Google Maps API", type: "Visualization" },
    { name: "Google Air Quality API", type: "Data Source" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="mt-4 mr-3 flex justify-end">
        <ThemeToggle />
      </div>

      <div className="max-w-6xl mx-auto space-y-8 py-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
            Urban Air Quality Prediction System
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
            Machine Learning-powered system for predicting Air Quality Index (AQI) to support environmental policy planning and public health awareness
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Target className="w-7 h-7 text-red-500" />
              Problem Statement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Air pollution is a major problem for both developed and developing countries. The rapid growth of industrial sectors and motor vehicles has resulted in the release of pollutant gases that contaminate the air and negatively impact human health.
            </p>
            <p>
              According to WHO's 2021 report, every minute there are 13 deaths worldwide caused by air pollution and serious diseases such as cardiovascular disorders, stroke, and lung cancer. The increase in motor vehicles, industrial activities, and population growth has caused concentrations of air pollutants such as PM2.5, PM10, NO₂, SO₂, and CO to continue rising.
            </p>
            <p className="font-semibold text-blue-600 dark:text-blue-400">
              Research Question: "How accurate are machine learning models in predicting air quality based on daily pollutant data in urban areas?"
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Zap className="w-7 h-7 text-yellow-500" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="text-blue-500">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Database className="w-7 h-7 text-purple-500" />
              Technology Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {techStack.map((tech, index) => (
                <div key={index} className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {tech.name}
                  </h3>
                  <Badge variant="secondary" className="mt-1">
                    {tech.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Calendar className="w-7 h-7 text-green-500" />
              Project Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                    milestone.status === 'completed' ? 'bg-green-500' : 
                    milestone.status === 'delayed' ? 'bg-orange-500' : 'bg-gray-400'
                  }`}>
                    {milestone.code}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Target: {milestone.date}
                    </p>
                  </div>
                  <Badge variant={milestone.status === 'completed' ? 'default' : 
                                 milestone.status === 'delayed' ? 'destructive' : 'secondary'}>
                    {milestone.status === 'completed' ? 'Completed' :
                     milestone.status === 'delayed' ? 'Delayed' : 'Pending'}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500">
              <p className="text-orange-800 dark:text-orange-200">
                <strong>Note:</strong> M4 and M5 experienced slight delays due to visualization integration challenges. 
                Additional time was required for improvements and testing to ensure system quality. 
                M4 completed on June 9th and M5 on June 11th, maintaining final quality standards.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Users className="w-7 h-7 text-blue-500" />
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-blue-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {member.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {member.id}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {member.institution}
                      </p>
                    </div>
                    <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                      {member.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Globe className="w-7 h-7 text-green-500" />
              Project Impact & Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Through this project, we successfully built an Air Quality Index (AQI) prediction system based on machine learning 
              with the best model using XGBoost. This model was chosen because it provides the most accurate prediction performance 
              compared to other models.
            </p>
            <p>
              The system has been successfully deployed using FastAPI as the backend and Next.js as the frontend, 
              providing users with interactive and informative air quality monitoring capabilities.
            </p>
            <p className="font-semibold text-green-600 dark:text-green-400">
              This system is expected to serve as an initial step towards implementing AI technology for environmental issues, 
              supporting environmental policy planning, increasing public awareness, and encouraging preventive actions for a healthier and more sustainable future.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}