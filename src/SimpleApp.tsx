// Simplified App to test step by step

function SimpleApp() {
  return (
    <div className="min-h-screen bg-blue-500 p-8">
      <h1 className="text-4xl font-bold text-white">CAMPUS360 Test</h1>
      <p className="text-white mt-4">If you see this styled, Tailwind is working!</p>
      
      <div className="mt-8 bg-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-blue-600">System Check</h2>
        <ul className="mt-4 space-y-2">
          <li className="text-green-600">✅ React is working</li>
          <li className="text-green-600">✅ Vite is working</li>
          <li className="text-green-600">✅ Tailwind CSS is working</li>
        </ul>
      </div>

      <button 
        className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50"
        onClick={() => alert('Button works!')}
      >
        Click Me to Test
      </button>
    </div>
  )
}

export default SimpleApp
