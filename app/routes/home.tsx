import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'

export default function Home() {
  const [count, setCount] = useState(0)
  const [isDark, setIsDark] = useState(false)

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
    <>
      <title>Web Edit DB - Home</title>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8 text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-white">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="fixed top-4 right-4 rounded-full border border-gray-200 bg-white p-3 text-gray-600 shadow-lg transition-all duration-300 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-yellow-400 dark:hover:bg-gray-600"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707-.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>

        <div className="mb-8 flex gap-8">
          <a
            href="https://vite.dev"
            target="_blank"
            className="transition-transform hover:scale-105"
          >
            <img
              src={viteLogo}
              className="h-24 w-24 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#646cffaa]"
              alt="Vite logo"
            />
          </a>
          <a
            href="https://react.dev"
            target="_blank"
            className="transition-transform hover:scale-105"
          >
            <img
              src={reactLogo}
              className="h-24 w-24 animate-spin p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#61dafbaa]"
              alt="React logo"
            />
          </a>
        </div>
        <h1 className="mb-8 text-5xl font-bold">Vite + React</h1>
        <p className="mb-4 text-lg text-gray-600 transition-colors duration-300 dark:text-gray-300">
          Build date: {__DATE__}
        </p>
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-lg transition-colors duration-300 dark:border-gray-700 dark:bg-gray-800">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            count is {count} clicks
          </button>
          <p className="mt-4 text-gray-600 transition-colors duration-300 dark:text-gray-300">
            Edit{' '}
            <code className="rounded bg-gray-100 px-2 py-1 text-sm text-gray-800 transition-colors duration-300 dark:bg-gray-700 dark:text-gray-200">
              src/App.tsx
            </code>{' '}
            and save to test HMR
          </p>
        </div>
        <p className="mt-8 text-gray-500 transition-colors duration-300 dark:text-gray-400">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </>
  )
}
