import React, { useState } from 'react';
import { Send, Code, Clock, CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';

 const BackendPrefix = import.meta.env.VITE_APP_BACKEND_URL;

const App = () => {
  const [userCode, setUserCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);


 
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #f3e8ff 100%)',
      padding: '16px'
    },
    maxWidth: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    title: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    subtitle: {
      color: '#6b7280'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '24px',
      '@media (max-width: 1024px)': {
        gridTemplateColumns: '1fr'
      }
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      padding: '24px'
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    textarea: {
      width: '100%',
      height: '256px',
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: '14px',
      resize: 'none',
      outline: 'none',
      transition: 'border-color 0.2s',
      marginBottom: '16px'
    },
    textareaFocus: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)'
    },
    textareaDisabled: {
      backgroundColor: '#f9fafb',
      cursor: 'not-allowed'
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '8px 24px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      fontSize: '14px',
      fontWeight: '500'
    },
    buttonHover: {
      backgroundColor: '#2563eb'
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    buttonSecondary: {
      backgroundColor: 'transparent',
      color: '#6b7280',
      border: '1px solid #d1d5db'
    },
    buttonSecondaryHover: {
      backgroundColor: '#f9fafb'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px'
    },
    error: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#dc2626',
      backgroundColor: '#fef2f2',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '16px'
    },
    placeholder: {
      textAlign: 'center',
      color: '#6b7280',
      padding: '48px 0'
    },
    loading: {
      textAlign: 'center',
      padding: '48px 0'
    },
    statusSuccess: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#f0fdf4',
      color: '#166534',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '16px'
    },
    statusError: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '16px'
    },
    infoBox: {
      backgroundColor: '#eff6ff',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '16px'
    },
    infoTitle: {
      fontWeight: '600',
      color: '#1e40af',
      marginBottom: '8px'
    },
    infoText: {
      color: '#1e40af',
      fontSize: '14px'
    },
    complexityBox: {
      backgroundColor: '#faf5ff',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '16px'
    },
    complexityTitle: {
      fontWeight: '600',
      color: '#7c3aed',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    complexityComparison: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px'
    },
    complexityItem: {
      textAlign: 'center'
    },
    complexityValue: {
      fontFamily: 'monospace',
      fontSize: '18px',
      fontWeight: 'bold'
    },
    complexityOld: {
      color: '#dc2626'
    },
    complexityNew: {
      color: '#16a34a'
    },
    complexityLabel: {
      fontSize: '12px',
      color: '#6b7280'
    },
    codeSection: {
      marginBottom: '16px'
    },
    codeTitle: {
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '8px'
    },
    codeTextarea: {
      width: '100%',
      height: '128px',
      padding: '12px',
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: '14px',
      resize: 'none',
      outline: 'none'
    },
    copyButton: {
      marginTop: '8px',
      fontSize: '14px',
      color: '#3b82f6',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      textDecoration: 'none'
    },
    copyButtonHover: {
      color: '#1d4ed8',
      textDecoration: 'underline'
    },
    noOptimization: {
      backgroundColor: '#f9fafb',
      padding: '16px',
      borderRadius: '8px',
      textAlign: 'center'
    },
    noOptimizationTitle: {
      color: '#1f2937',
      fontWeight: '500',
      marginBottom: '4px'
    },
    noOptimizationText: {
      color: '#6b7280',
      fontSize: '14px'
    },
    apiSection: {
      marginTop: '32px',
      backgroundColor: '#eff6ff',
      borderRadius: '12px',
      padding: '24px'
    },
    apiTitle: {
      fontWeight: '600',
      color: '#1e40af',
      marginBottom: '8px'
    },
    apiText: {
      color: '#1e40af',
      fontSize: '14px',
      marginBottom: '8px'
    },
    apiCode: {
      backgroundColor: '#dbeafe',
      padding: '12px',
      borderRadius: '6px',
      fontSize: '12px',
      fontFamily: 'monospace',
      overflowX: 'auto',
      whiteSpace: 'pre-wrap'
    },
    spinner: {
      display: 'inline-block',
      animation: 'spin 1s linear infinite'
    },
    '@keyframes spin': {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' }
    }
  };

  const optimizeCode = async () => {
    if (!userCode.trim()) {
      setError('Please enter some code to optimize');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);
    setCopied(false);

    try {
      // Simulate API call to backend
      const response = await fetch(`${BackendPrefix}/optimize-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: userCode,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('An error occurred while optimizing the code. Please try again.');
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    optimizeCode();
  };

  const clearResults = () => {
    setResult(null);
    setError('');
  };

  const copyToClipboard = () => {
    if (result?.optimizedCode) {
      navigator.clipboard.writeText(result.optimizedCode).then(() => {
        setCopied(true); // Show feedback
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        <header style={styles.header}>
          <h1 style={styles.title}>
            <Code size={32} color="#3b82f6" />
            Code Optimizer
          </h1>
          <p style={styles.subtitle}>Submit your code and get optimized versions with performance analysis</p>
        </header>

        <div style={window.innerWidth > 1024 ? styles.grid : {}}>
          {/* Input Section */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              <Send size={20} />
              Your Code
            </h2>
            <div>
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                placeholder="Paste your code here..."
                style={{
                  ...styles.textarea,
                  ...(isLoading ? styles.textareaDisabled : {})
                }}
                disabled={isLoading}
              />
              
              {error && (
                <div style={styles.error}>
                  <XCircle size={16} />
                  {error}
                </div>
              )}

              <div style={styles.buttonGroup}>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !userCode.trim()}
                  style={{
                    ...styles.button,
                    ...(isLoading || !userCode.trim() ? styles.buttonDisabled : {})
                  }}
                >
                  {isLoading ? (
                    <Loader2 size={16} style={styles.spinner} />
                  ) : (
                    <Send size={16} />
                  )}
                  {isLoading ? 'Optimizing...' : 'Optimize Code'}
                </button>

                {result && (
                  <button
                    onClick={clearResults}
                    style={{
                      ...styles.button,
                      ...styles.buttonSecondary
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Optimization Results</h2>
            
            {!result && !isLoading && (
              <div style={styles.placeholder}>
                <Code size={48} color="#9ca3af" style={{ margin: '0 auto 12px' }} />
                <p>Submit your code to see optimization results</p>
              </div>
            )}

            {isLoading && (
              <div style={styles.loading}>
                <Loader2 size={32} color="#3b82f6" style={styles.spinner} />
                <p style={{ color: '#6b7280' }}>Analyzing and optimizing your code...</p>
              </div>
            )}

            {result && (
              <div>
                {/* Status */}
                <div style={result.status === true ? styles.statusSuccess : styles.statusError}>
                  {result.status === true ? (
                    <CheckCircle size={20} />
                  ) : (
                    <XCircle size={20} />
                  )}
                  <span style={{ fontWeight: '500' }}>
                    {result.status === true ? 'Optimization Successful' : 'No More Optimization Available'}
                  </span>
                </div>

                {result.status === true ? (
                  <>
                    {/* Optimized Code */}
                    <div style={styles.codeSection}>
                      <h3 style={styles.codeTitle}>Optimized Code:</h3>
                      <textarea
                        value={result.optimizedCode}
                        readOnly
                        style={styles.codeTextarea}
                      />
                      <button
                        onClick={copyToClipboard}
                        style={styles.copyButton}
                      >
                        {copied ? "Copied!" : "Copy optimized code"}
                      </button>
                    </div>

                    {/* Optimization Reason */}
                    {result.reason && (
                      <div style={styles.infoBox}>
                        <h3 style={styles.infoTitle}>Optimization Details:</h3>
                        <p style={styles.infoText}>{result.reason}</p>
                      </div>
                    )}

                    {/* Time Complexity Comparison */}
                    <div style={styles.complexityBox}>
                      <h3 style={styles.complexityTitle}>
                        <Clock size={16} />
                        Time Complexity Analysis
                      </h3>
                      <div style={styles.complexityComparison}>
                        <div style={styles.complexityItem}>
                          <div style={{ ...styles.complexityValue, ...styles.complexityOld }}>
                            {result.oldTimeComplexity}
                          </div>
                          <div style={styles.complexityLabel}>Original</div>
                        </div>
                        <ArrowRight size={20} color="#9ca3af" />
                        <div style={styles.complexityItem}>
                          <div style={{ ...styles.complexityValue, ...styles.complexityNew }}>
                            {result.newTimeComplexity}
                          </div>
                          <div style={styles.complexityLabel}>Optimized</div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={styles.noOptimization}>
                    <Code size={32} color="#9ca3af" style={{ margin: '0 auto 8px' }} />
                    <p style={styles.noOptimizationTitle}>Your code is already optimized</p>
                    <p style={styles.noOptimizationText}>No further optimizations are available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;