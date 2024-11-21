import { useState } from 'react'
import '@fontsource/inter/variable.css'
import { motion } from 'framer-motion'
import { FiHome, FiSearch, FiUser, FiSettings } from 'react-icons/fi'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-background text-foreground">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
          <div className="container-fluid h-16 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold gradient-text">CasaDrives</h1>
              <div className="hidden md:flex items-center space-x-4">
                <a href="#" className="nav-link"><FiHome className="mr-2" /> Home</a>
                <a href="#" className="nav-link"><FiSearch className="mr-2" /> Search</a>
                <a href="#" className="nav-link"><FiUser className="mr-2" /> Profile</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="btn btn-ghost p-2"
              >
                {darkMode ? '🌞' : '🌙'}
              </button>
              <button className="btn btn-primary">
                Get Started
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-24 pb-16">
          <div className="container-fluid">
            {/* Hero Section */}
            <section className="section text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto space-y-6"
              >
                <h1 className="h1 gradient-text">
                  Welcome to CasaDrives
                </h1>
                <p className="text-lg text-muted-foreground">
                  Your modern solution for managing and sharing drives in style.
                </p>
                <div className="flex justify-center gap-4">
                  <button className="btn btn-primary px-8">
                    Get Started
                  </button>
                  <button className="btn btn-ghost px-8">
                    Learn More
                  </button>
                </div>
              </motion.div>
            </section>

            {/* Features Grid */}
            <section className="section">
              <div className="text-center mb-12">
                <h2 className="h2 mb-4">Why Choose CasaDrives?</h2>
                <p className="text-muted-foreground">
                  Experience the next generation of drive management
                </p>
              </div>
              <div className="feature-grid">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card p-6 hover-lift"
                  >
                    <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="h4 mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t">
          <div className="container-fluid py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-muted-foreground">
                2024 CasaDrives. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <a href="#" className="nav-link text-sm">Privacy</a>
                <a href="#" className="nav-link text-sm">Terms</a>
                <a href="#" className="nav-link text-sm">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

const features = [
  {
    title: 'Modern Interface',
    description: 'A beautiful and intuitive interface designed for the best user experience.',
    icon: <FiHome size={24} />,
  },
  {
    title: 'Smart Search',
    description: 'Find what you need quickly with our intelligent search system.',
    icon: <FiSearch size={24} />,
  },
  {
    title: 'User Profiles',
    description: 'Personalized profiles to manage your drives and preferences.',
    icon: <FiUser size={24} />,
  },
  {
    title: 'Advanced Settings',
    description: 'Customize every aspect of your drive management experience.',
    icon: <FiSettings size={24} />,
  },
]

export default App
