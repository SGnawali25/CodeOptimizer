import React, { useState, useEffect } from 'react';
import { Send, Code, Clock, CheckCircle, XCircle, Loader2, ArrowRight, Play, TestTube } from 'lucide-react';

const BackendPrefix = import.meta.env.VITE_APP_BACKEND_URL;

const App = () => {
  const [userCode, setUserCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  
  // Testing states
  const [testInputs, setTestInputs] = useState('');
  const [isTestingLoading, setIsTestingLoading] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [testError, setTestError] = useState('');

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const optimizeCode = async () => {
    if (!userCode.trim()) {
      setError('Please enter some code to optimize');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);
    setCopied(false);
    setTestResults(null);
    setTestInputs('');
    setTestError('');
    setTestResults(null);

    try {
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
    } finally {
      setIsLoading(false);
    }
  };

  const testCode = async () => {
    if (!result || result.status !== true) {
      setTestError('Please optimize code first before testing');
      return;
    }

    if (!testInputs.trim()) {
      setTestError('Please enter test inputs');
      return;
    }

    setIsTestingLoading(true);
    setTestError('');
    setTestResults(null);

    try {
      // Parse test inputs - expecting JSON format like [[2,7,11,15], 9]
      const parsedInputs = JSON.parse(testInputs);
      
      const response = await fetch('http://localhost:4000/api/test-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalCode: userCode,
          optimizedCode: result.optimizedCode,
          testCaseInputs: parsedInputs
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTestResults(data);
    } catch (err) {
      setTestError(`Error testing code: ${err.message}`);
      console.error(err);
    } finally {
      setIsTestingLoading(false);
    }
  };

  const handleSubmit = () => {
    optimizeCode();
  };

  const clearResults = () => {
    setResult(null);
    setUserCode('');
    setError('');
    setTestResults(null);
    setTestInputs('');
  };

  const copyToClipboard = () => {
    if (result?.optimizedCode) {
      navigator.clipboard.writeText(result.optimizedCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const isDesktop = windowWidth > 768;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #f3e8ff 100%)',
      padding: '16px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#000000',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <Code size={32} color="#3b82f6" />
            Code Optimizer
          </h1>
          <p style={{ color: '#000000' }}>
            Submit your code and get optimized versions with performance analysis
          </p>
        </header>

        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
          gap: '24px'
        }}>
          {/* Input Section */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '24px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#000000',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Send size={20} />
              Your Code
            </h2>
            
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              placeholder="Paste your code here..."
              disabled={isLoading}
              style={{
                width: '100%',
                height: '256px',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '14px',
                resize: 'none',
                outline: 'none',
                marginBottom: '16px',
                backgroundColor: isLoading ? '#f9fafb' : 'white',
                cursor: isLoading ? 'not-allowed' : 'text'
              }}
            />
            
            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#dc2626',
                backgroundColor: '#fef2f2',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <XCircle size={16} />
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !userCode.trim()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '8px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: (isLoading || !userCode.trim()) ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  opacity: (isLoading || !userCode.trim()) ? 0.5 : 1
                }}
              >
                {isLoading ? (
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Send size={16} />
                )}
                {isLoading ? 'Optimizing...' : 'Optimize Code'}
              </button>

              {result && (
                <button
                  onClick={clearResults}
                  style={{
                    padding: '8px 16px',
                    color: '#6b7280',
                    backgroundColor: 'transparent',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '24px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#000000',
              marginBottom: '16px'
            }}>
              Optimization Results
            </h2>
            
            {!result && !isLoading && (
              <div style={{ textAlign: 'center', color: '#000000', padding: '48px 0' }}>
                <Code size={48} color="#9ca3af" style={{ margin: '0 auto 12px', display: 'block' }} />
                <p>Submit your code to see optimization results</p>
              </div>
            )}

            {isLoading && (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <Loader2 size={32} color="#3b82f6" style={{ margin: '0 auto 12px', display: 'block', animation: 'spin 1s linear infinite' }} />
                <p style={{ color: '#000000' }}>Analyzing and optimizing your code...</p>
              </div>
            )}

            {result && (
              <div>
                {/* Status */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: result.status === true ? '#f0fdf4' : '#fef2f2',
                  color: result.status === true ? '#166534' : '#dc2626',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}>
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
                    <div style={{ marginBottom: '16px' }}>
                      <h3 style={{ fontWeight: '600', color: '#000000', marginBottom: '8px' }}>
                        Optimized Code:
                      </h3>
                      <textarea
                        value={result.optimizedCode}
                        readOnly
                        style={{
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
                        }}
                      />
                      <button
                        onClick={copyToClipboard}
                        style={{
                          marginTop: '8px',
                          fontSize: '14px',
                          color: '#3b82f6',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          textDecoration: 'none'
                        }}
                      >
                        {copied ? "Copied!" : "Copy optimized code"}
                      </button>
                    </div>

                    {/* Optimization Reason */}
                    {result.reason && (
                      <div style={{
                        backgroundColor: '#eff6ff',
                        padding: '16px',
                        borderRadius: '8px',
                        marginBottom: '16px'
                      }}>
                        <h3 style={{ fontWeight: '600', color: '#000000', marginBottom: '8px' }}>
                          Optimization Details:
                        </h3>
                        <p style={{ color: '#000000', fontSize: '14px' }}>{result.reason}</p>
                      </div>
                    )}

                    {/* Time Complexity Comparison */}
                    <div style={{
                      backgroundColor: '#faf5ff',
                      padding: '16px',
                      borderRadius: '8px',
                      marginBottom: '16px'
                    }}>
                      <h3 style={{
                        fontWeight: '600',
                        color: '#000000',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <Clock size={16} />
                        Time Complexity Analysis
                      </h3>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '16px'
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{
                            fontFamily: 'monospace',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: '#dc2626'
                          }}>
                            {result.oldTimeComplexity}
                          </div>
                          <div style={{ fontSize: '12px', color: '#000000' }}>Original</div>
                        </div>
                        <ArrowRight size={20} color="#9ca3af" />
                        <div style={{ textAlign: 'center' }}>
                          <div style={{
                            fontFamily: 'monospace',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: '#16a34a'
                          }}>
                            {result.newTimeComplexity}
                          </div>
                          <div style={{ fontSize: '12px', color: '#000000' }}>Optimized</div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{
                    backgroundColor: '#f9fafb',
                    padding: '16px',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <Code size={32} color="#9ca3af" style={{ margin: '0 auto 8px', display: 'block' }} />
                    <p style={{ color: '#000000', fontWeight: '500', marginBottom: '4px' }}>
                      Your code is already optimized
                    </p>
                    <p style={{ color: '#000000', fontSize: '14px' }}>
                      No further optimizations are available
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Testing Section - Only show if optimization is successful */}
        {result && result.status === true && (
          <div style={{
            marginTop: '24px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '24px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#000000',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              Test Your Code
            </h2>

            <p style={{ color: '#000000', fontSize: '14px', marginBottom: '12px' }}>
              Enter function arguments as an array in this format. Example: [first argument, second argument] for two arguments
            </p>

            <textarea
              value={testInputs}
              onChange={(e) => setTestInputs(e.target.value)}
              placeholder='["1st argument", "2nd argument"]'
              disabled={isTestingLoading}
              style={{
                width: '100%',
                height: '80px',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '14px',
                resize: 'none',
                outline: 'none',
                marginBottom: '16px',
                backgroundColor: isTestingLoading ? '#f9fafb' : 'white'
              }}
            />

            {testError && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#dc2626',
                backgroundColor: '#fef2f2',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <XCircle size={16} />
                {testError}
              </div>
            )}

            <button
              onClick={testCode}
              disabled={isTestingLoading || !testInputs.trim()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#10b981',
                color: 'white',
                padding: '8px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: (isTestingLoading || !testInputs.trim()) ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                opacity: (isTestingLoading || !testInputs.trim()) ? 0.5 : 1,
                marginBottom: '16px'
              }}
            >
              {isTestingLoading ? (
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <Play size={16} />
              )}
              {isTestingLoading ? 'Testing...' : 'Run Tests'}
            </button>

            {/* Test Results */}
            {testResults && (
              <div>
                {/* Results Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: testResults.outputsMatch ? '#f0fdf4' : '#fef2f2',
                  color: testResults.outputsMatch ? '#166534' : '#dc2626',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  border: testResults.outputsMatch ? '2px solid #10b981' : '2px solid #ef4444'
                }}>
                  {testResults.outputsMatch ? (
                    <CheckCircle size={20} />
                  ) : (
                    <XCircle size={20} />
                  )}
                  <span style={{ fontWeight: '600', fontSize: '16px' }}>
                    {testResults.outputsMatch ? 'Test Passed - Outputs Match!' : 'Test Failed - Outputs Do Not Match'}
                  </span>
                </div>

                {/* Output Comparison */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
                  gap: '16px'
                }}>
                  {/* Original Code Output */}
                  <div style={{
                    backgroundColor: '#fff7ed',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #fed7aa'
                  }}>
                    <h4 style={{
                      fontWeight: '600',
                      color: '#000000',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Code size={16} />
                      Original Code Output:
                    </h4>
                    <div style={{
                      backgroundColor: '#ffffff',
                      padding: '12px',
                      borderRadius: '6px',
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      color: '#000000',
                      wordBreak: 'break-all'
                    }}>
                      {JSON.stringify(testResults.originalOutput)}
                    </div>
                    {testResults.originalExecutionTime && (
                      <div style={{
                        marginTop: '8px',
                        fontSize: '12px',
                        color: '#000000',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Clock size={12} />
                        Execution Time: {testResults.originalExecutionTime}
                      </div>
                    )}
                  </div>

                  {/* Optimized Code Output */}
                  <div style={{
                    backgroundColor: '#f0fdf4',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #bbf7d0'
                  }}>
                    <h4 style={{
                      fontWeight: '600',
                      color: '#000000',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Code size={16} />
                      Optimized Code Output:
                    </h4>
                    <div style={{
                      backgroundColor: '#ffffff',
                      padding: '12px',
                      borderRadius: '6px',
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      color: '#000000',
                      wordBreak: 'break-all'
                    }}>
                      {JSON.stringify(testResults.optimizedOutput)}
                    </div>
                    {testResults.optimizedExecutionTime && (
                      <div style={{
                        marginTop: '8px',
                        fontSize: '12px',
                        color: '#000000',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Clock size={12} />
                        Execution Time: {testResults.optimizedExecutionTime}
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Info */}
                {testResults.error && (
                  <div style={{
                    marginTop: '16px',
                    backgroundColor: '#fef2f2',
                    padding: '12px',
                    borderRadius: '8px',
                    color: '#dc2626',
                    fontSize: '14px'
                  }}>
                    <strong>Error:</strong> {testResults.error}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default App;