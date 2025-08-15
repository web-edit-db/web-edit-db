import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'

export default function Home() {
  const [count, setCount] = useState(0)

  return (
    <>
      <title>Web Edit DB - Home</title>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8 text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-white">
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
            className="bg-primary hover:bg-primary/90 focus:ring-primary/50 rounded-lg px-6 py-3 font-medium text-white transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
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
