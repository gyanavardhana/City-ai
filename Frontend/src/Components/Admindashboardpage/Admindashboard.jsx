import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaInfoCircle } from 'react-icons/fa';
import Navbar from '../Homepage/Navbar';

const Barchart = React.lazy(() => import('./Barchart'));
const Piechart = React.lazy(() => import('./Piechart'));
const Scatterplot = React.lazy(() => import('./Scatterplot'));
const TimeSeriesChart = React.lazy(() => import('./TimeSeriesChart'));
const WordCloud = React.lazy(() => import('./WordCloud'));
const NetworkGraph = React.lazy(() => import('./NetworkGraph'));
const Histogram = React.lazy(() => import('./Histogram'));

const Dashboard = ({ locations, reviews, users, images }) => {
  const [selectedSection, setSelectedSection] = useState('Average Reviews');

  const sections = [
    { title: 'Average Reviews', component: Barchart, data: { locations, reviews } },
    { title: 'User Roles', component: Piechart, data: { users } },
    { title: 'Pollution vs Safety', component: Scatterplot, data: { locations } },
    { title: 'Reviews Over Time', component: TimeSeriesChart, data: { reviews } },
    { title: 'Image Metadata Tags', component: WordCloud, data: { images } },
    { title: 'User Interactions', component: NetworkGraph, data: { users, locations, reviews } },
    { title: 'Review Ratings', component: Histogram, data: { reviews } },
  ];

  const descriptions = {
    'Average Reviews': {
      text: 'This chart represents average reviews per location, highlighting user satisfaction trends.',
      insights: ['Identify top-performing locations', 'Gauge user sentiment effectively'],
    },
    'User Roles': {
      text: 'A breakdown of user roles within the platform, showcasing demographic diversity.',
      insights: ['Understand user demographics', 'Tailor features to user needs'],
    },
    'Pollution vs Safety': {
      text: 'Visual comparison of pollution levels versus safety metrics across various locations.',
      insights: ['Identify correlations between safety and pollution', 'Inform policy decisions'],
    },
    'Reviews Over Time': {
      text: 'This chart tracks reviews over time, providing insights into user engagement trends.',
      insights: ['Monitor changes in user feedback', 'Identify seasonal patterns'],
    },
    'Image Metadata Tags': {
      text: 'A visualization of image metadata tags, highlighting popular themes and categories.',
      insights: ['Identify trending topics', 'Enhance content strategy'],
    },
    'User Interactions': {
      text: 'This graph illustrates interactions among users, showcasing community dynamics.',
      insights: ['Analyze user engagement', 'Identify influential users'],
    },
    'Review Ratings': {
      text: 'Distribution of review ratings, allowing for quick assessment of user satisfaction.',
      insights: ['Track user satisfaction over time', 'Identify areas for improvement'],
    },
  };

  const scrollLeft = () => {
    const index = sections.findIndex(section => section.title === selectedSection);
    if (index > 0) {
      setSelectedSection(sections[index - 1].title);
    }
  };

  const scrollRight = () => {
    const index = sections.findIndex(section => section.title === selectedSection);
    if (index < sections.length - 1) {
      setSelectedSection(sections[index + 1].title);
    }
  };

  const SelectedComponent = sections.find(section => section.title === selectedSection).component;

  // Determine if the screen is small
  const isSmallScreen = window.innerWidth < 768; // Adjust the breakpoint as needed

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-cyan-100 flex flex-col">
        <div className="container mx-auto px-4 flex-grow">
          {/* Section Selection */}
          {!isSmallScreen && (
            <div className="flex justify-center mt-8 mb-12">
              <div className="bg-white p-2 rounded-full shadow-lg">
                {sections.map((section, index) => (
                  <button
                    key={section.title}
                    onClick={() => setSelectedSection(section.title)}
                    className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${
                      selectedSection === section.title
                        ? 'bg-cyan-500 text-white shadow-md transform scale-105'
                        : 'text-gray-600 hover:bg-gray-100'
                    } ${index !== 0 ? 'ml-2' : ''}`}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Data Visualization Area */}
          <motion.div
            key={selectedSection}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-xl p-8 mb-12"
          >
            <h2 className="text-3xl font-bold mb-8 text-gray-800 border-l-4 border-cyan-500 pl-3">
              {selectedSection}
            </h2>

            <div className="flex flex-col lg:flex-row items-start justify-between">
              <div className="w-full lg:w-2/3 mb-8 lg:mb-0 pr-0 lg:pr-8">
                <Suspense fallback={<div>Loading...</div>}>
                  <SelectedComponent {...sections.find(section => section.title === selectedSection).data} />
                </Suspense>
              </div>
              <div className="w-full lg:w-1/3 bg-gray-100 p-6 rounded-lg shadow-inner">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <FaInfoCircle className="mr-2 text-cyan-500" />
                  Insights
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {descriptions[selectedSection].text}
                </p>
                <h4 className="text-lg font-semibold mb-2 text-gray-800">Key Takeaways:</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {descriptions[selectedSection].insights.map((insight, index) => (
                    <li key={index} className="leading-relaxed">{insight}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={scrollLeft}
              className="bg-cyan-500 text-white p-3 rounded-full hover:bg-cyan-400 transition duration-300 shadow-lg"
              disabled={selectedSection === sections[0].title}
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={scrollRight}
              className="bg-cyan-500 text-white p-3 rounded-full hover:bg-cyan-400 transition duration-300 shadow-lg"
              disabled={selectedSection === sections[sections.length - 1].title}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
