// Simple test app to verify React is working

function TestApp() {
  return (
    <div style={{ 
      padding: '40px', 
      backgroundColor: '#3B82F6', 
      color: 'white',
      minHeight: '100vh',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>✅ React is Working!</h1>
      <p style={{ fontSize: '18px', marginBottom: '10px' }}>
        If you see this blue screen, React and Vite are working correctly.
      </p>
      <p style={{ fontSize: '16px', marginBottom: '20px' }}>
        The issue is likely in App.tsx or one of the imported components.
      </p>
      
      <div style={{ 
        backgroundColor: 'white', 
        color: '#1E3A8A', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2 style={{ marginBottom: '10px' }}>Next Steps:</h2>
        <ol style={{ paddingLeft: '20px' }}>
          <li>Open browser console (F12)</li>
          <li>Look for any error messages</li>
          <li>Share the error with your team</li>
        </ol>
      </div>

      <div style={{ marginTop: '30px', fontSize: '14px' }}>
        <p>Server: Running ✅</p>
        <p>React: Working ✅</p>
        <p>Vite: Working ✅</p>
        <p>Browser: Connected ✅</p>
      </div>
    </div>
  )
}

export default TestApp
