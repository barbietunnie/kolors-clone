import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
          The super fast
          <br />
          <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            color palette generator
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-10">
          Create beautiful color schemes in seconds. Press spacebar to generate
          new palettes, lock your favorites, and export in any format.
        </p>
        <div className="flex gap-4">
          <Link
            href="/generate"
            className="px-8 py-4 text-lg font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
          >
            Start generating
          </Link>
          <Link
            href="/palettes"
            className="px-8 py-4 text-lg font-medium text-gray-900 bg-white border-2 border-gray-200 rounded-full hover:border-gray-300 transition-colors"
          >
            Explore palettes
          </Link>
        </div>

        {/* Feature highlights */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <div className="p-6 text-left">
            <div className="w-12 h-12 mb-4 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Lightning Fast
            </h3>
            <p className="text-gray-600">
              Generate new palettes instantly with a single keypress. No waiting,
              no loading.
            </p>
          </div>

          <div className="p-6 text-left">
            <div className="w-12 h-12 mb-4 bg-pink-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-pink-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Lock Colors
            </h3>
            <p className="text-gray-600">
              Found a color you love? Lock it in place and keep generating the
              rest.
            </p>
          </div>

          <div className="p-6 text-left">
            <div className="w-12 h-12 mb-4 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Export Anywhere
            </h3>
            <p className="text-gray-600">
              Export as CSS, SCSS, Tailwind config, JSON, or copy individual
              colors.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 border-t border-gray-200">
        <p>
          Built with Next.js and Tailwind CSS.
        </p>
      </footer>
    </div>
  );
}
