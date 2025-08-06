import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { useRegisterSW } from 'virtual:pwa-register/react'

function App() {
  const [count, setCount] = useState(0)
  const [isDark, setIsDark] = useState(false)

  useRegisterSW({
    immediate: true,
    onRegisteredSW(swUrl, registration) {
      console.log('SW registered: ', registration, swUrl)
    },
    onRegisterError(error) {
      console.log('SW registration error: ', error)
    },
    onNeedRefresh() {
      console.log('Need refresh')
    },
    onOfflineReady() {
      console.log('Offline ready')
    },
  })

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    
    // Toggle the 'dark' class on the html element
    if (newTheme) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 transition-colors duration-300 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-3 rounded-full bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-yellow-400 shadow-lg border border-gray-200 dark:border-gray-600 transition-all duration-300"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707-.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

      <div className="flex gap-8 mb-8">
        <a href="https://vite.dev" target="_blank" className="hover:scale-105 transition-transform">
          <img 
            src={viteLogo} 
            className="h-24 w-24 p-6 hover:drop-shadow-[0_0_2em_#646cffaa] transition-all duration-300" 
            alt="Vite logo" 
          />
        </a>
        <a href="https://react.dev" target="_blank" className="hover:scale-105 transition-transform">
          <img 
            src={reactLogo} 
            className="h-24 w-24 p-6 hover:drop-shadow-[0_0_2em_#61dafbaa] transition-all duration-300 animate-spin" 
            alt="React logo" 
          />
        </a>
      </div>
      <h1 className="text-5xl font-bold mb-8">Vite + React</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
        Build date: {__DATE__}
      </p>
      <div className="p-8 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-lg transition-colors duration-300">
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          count is {count} clicks
        </button>
        <p className="mt-4 text-gray-600 dark:text-gray-300 transition-colors duration-300">
          Edit <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm text-gray-800 dark:text-gray-200 transition-colors duration-300">src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="mt-8 text-gray-500 dark:text-gray-400 transition-colors duration-300">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
