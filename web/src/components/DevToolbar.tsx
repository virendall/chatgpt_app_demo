import {useState} from 'react'
import {
    getAvailableTools,
    isDev,
    JOURNEY_TO_TOOL,
    setSimulatedToolOutput,
    simulateToolCall,
} from '../helpers/dev-simulator'
import type {JourneyId} from '../types/journey.types'

export function DevToolbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState<string | null>(null)
    const [useMockData, setUseMockData] = useState(true)
    const [lastResult, setLastResult] = useState<string | null>(null)

    //
    if (!isDev) return null

    const tools = getAvailableTools()

    const handleToolCall = async (toolName: string) => {
        setLoading(toolName)
        setLastResult(null)

        try {
            const result = await simulateToolCall(toolName, {}, {useMockData})

            if (result) {
                setSimulatedToolOutput(result, {
                    simulated: true,
                    mock: useMockData,
                    timestamp: new Date().toISOString(),
                })
                setLastResult(`✅ ${toolName} loaded successfully`)
            } else {
                setLastResult(`❌ No data returned for ${toolName}`)
            }
        } catch (error) {
            setLastResult(`❌ Error: ${error}`)
        } finally {
            setLoading(null)
        }
    }

    const handleClear = () => {
        setSimulatedToolOutput(null)
        setLastResult('🧹 Tool output cleared')
    };

    const handleNavigateAndLoad = async (journeyId: JourneyId) => {
        const toolName = JOURNEY_TO_TOOL[journeyId]
        await handleToolCall(toolName)
        window.location.hash = `#/${journeyId}`
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '10px',
                    right: '10px',
                    zIndex: 9999,
                    padding: '8px 12px',
                    background: '#1a1a2e',
                    color: '#00d4ff',
                    border: '1px solid #00d4ff',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                }}
            >
                🛠 Dev Tools
            </button>
        )
    }

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '10px',
                right: '10px',
                zIndex: 9999,
                width: '320px',
                background: '#1a1a2e',
                color: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '13px',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderBottom: '1px solid #333',
                }}
            >
        <span style={{fontWeight: 'bold', color: '#00d4ff'}}>
          🧪 MCP Dev Simulator
        </span>
                <button
                    onClick={() => setIsOpen(false)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#888',
                        cursor: 'pointer',
                        fontSize: '18px',
                    }}
                >
                    ✕
                </button>
            </div>

            <div style={{padding: '12px 16px', borderBottom: '1px solid #333'}}>
                <label
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                    }}
                >
                    <input
                        type="checkbox"
                        checked={useMockData}
                        onChange={(e) => setUseMockData(e.target.checked)}
                    />
                    <span>Use Mock Data</span>
                    <span style={{color: '#888', fontSize: '11px'}}>
            ({useMockData ? 'local JSON' : 'MCP server'})
          </span>
                </label>
            </div>

            <div style={{padding: '12px 16px'}}>
                <div style={{marginBottom: '8px', color: '#888', fontSize: '11px'}}>
                    Call MCP Tools:
                </div>

                <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
                    {tools.map(({tool, journey}) => (
                        <button
                            key={tool}
                            onClick={() =>
                                handleNavigateAndLoad(journey as JourneyId)
                            }
                            disabled={loading !== null}
                            style={{
                                padding: '8px 12px',
                                background: loading === tool ? '#333' : '#2a2a4e',
                                color: loading === tool ? '#888' : '#fff',
                                border: '1px solid #444',
                                borderRadius: '6px',
                                cursor: loading ? 'wait' : 'pointer',
                                textAlign: 'left',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <span>{tool}</span>
                            <span style={{color: '#888', fontSize: '11px'}}>
                /{journey}
              </span>
                        </button>
                    ))}
                </div>
            </div>

            <div style={{padding: '0 16px 12px', display: 'flex', gap: '8px'}}>
                <button
                    onClick={handleClear}
                    style={{
                        flex: 1,
                        padding: '8px',
                        background: '#4a1a1a',
                        color: '#ff6b6b',
                        border: '1px solid #6a2a2a',
                        borderRadius: '6px',
                        cursor: 'pointer',
                    }}
                >
                    Clear Output
                </button>

                <button
                    onClick={() => (window.location.hash = '#/')}
                    style={{
                        flex: 1,
                        padding: '8px',
                        background: '#1a4a2a',
                        color: '#6bff9b',
                        border: '1px solid #2a6a3a',
                        borderRadius: '6px',
                        cursor: 'pointer',
                    }}
                >
                    Go Home
                </button>
            </div>

            {lastResult && (
                <div
                    style={{
                        padding: '8px 16px 12px',
                        color: lastResult.startsWith('✅')
                            ? '#6bff9b'
                            : lastResult.startsWith('❌')
                                ? '#ff6b6b'
                                : '#fff6b6',
                        fontSize: '12px',
                    }}
                >
                    {lastResult}
                </div>
            )}

            <div
                style={{
                    padding: '8px 16px 12px',
                    color: '#666',
                    fontSize: '10px',
                    borderTop: '1px solid #333',
                }}
            >
                💡 Also try in console:{' '}
                <code style={{color: '#00d4ff'}}>
                    devSimulator.callTool('get_claims')
                </code>
            </div>
        </div>
    )
}
