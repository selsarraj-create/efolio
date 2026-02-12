'use client';

import { useState, useEffect } from 'react';

export default function AgencyGenerator() {
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [status, setStatus] = useState({ type: 'idle', message: '' });

    // Your specific master password
    const MASTER_PASSWORD = 'efolio2026?$';

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === MASTER_PASSWORD) {
            setIsAuthenticated(true);
            setStatus({ type: 'idle', message: '' });
        } else {
            setStatus({ type: 'error', message: 'Incorrect password. Access denied.' });
        }
    };

    const handleCreatePortfolio = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: 'loading', message: 'Generating virtual clone...' });

        try {
            const response = await fetch('/api/admin/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({
                    type: 'success',
                    message: `Success! Portfolio live at: ${data.url}. Assigned lead code: ${data.leadCode}`,
                });
                setFullName('');
            } else {
                setStatus({ type: 'error', message: data.error || 'Creation failed.' });
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Network error. Please check your connection.' });
        }
    };

    // 1. Password Gate (Login Screen)
    if (!isAuthenticated) {
        return (
            <main style={{ maxWidth: '400px', margin: '100px auto', padding: '40px', border: '1px solid #eaeaea', borderRadius: '12px', textAlign: 'center', fontFamily: 'sans-serif', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <h2 style={{ marginBottom: '10px' }}>Agency Control</h2>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '25px' }}>Authentication required to generate subdomains.</p>
                <form onSubmit={handleLogin}>
                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        required
                    />
                    <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                        Login
                    </button>
                </form>
                {status.type === 'error' && <p style={{ color: '#c53030', marginTop: '15px', fontSize: '14px' }}>{status.message}</p>}
            </main>
        );
    }

    // 2. The Generator UI (Hidden until authenticated)
    return (
        <main style={{ maxWidth: '450px', margin: '80px auto', padding: '35px', fontFamily: 'sans-serif', border: '1px solid #eee', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h2 style={{ margin: 0, fontSize: '20px' }}>Portfolio Generator</h2>
                <button onClick={() => setIsAuthenticated(false)} style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px' }}>Logout</button>
            </div>

            <form onSubmit={handleCreatePortfolio}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Model Full Name</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Jane Smith"
                        style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={status.type === 'loading'}
                    style={{ width: '100%', padding: '14px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', opacity: status.type === 'loading' ? 0.7 : 1 }}
                >
                    {status.type === 'loading' ? 'Generating...' : 'Create New Portfolio'}
                </button>
            </form>

            {status.message && (
                <div style={{
                    marginTop: '25px',
                    padding: '15px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    backgroundColor: status.type === 'success' ? '#f0fff4' : '#fff5f5',
                    color: status.type === 'success' ? '#22543d' : '#9b2c2c',
                    border: `1px solid ${status.type === 'success' ? '#c6f6d5' : '#feb2b2'}`
                }}>
                    {status.message}
                </div>
            )}

            <ClientList />
        </main>
    );
}

function ClientList() {
    const [clients, setClients] = useState<{ name: string, slug: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/clients')
            .then(res => res.json())
            .then(data => {
                if (data.clients) setClients(data.clients);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, []);

    const handleDelete = async (slug: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete ${name}? This cannot be undone.`)) {
            return;
        }

        try {
            const res = await fetch('/api/admin/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug }),
            });

            if (res.ok) {
                setClients(prev => prev.filter(c => c.slug !== slug));
            } else {
                alert('Failed to delete.');
            }
        } catch (err) {
            alert('Error deleting client.');
        }
    };

    if (loading) return <p style={{ marginTop: '30px', textAlign: 'center', fontSize: '13px', color: '#888' }}>Loading existing sites...</p>;

    if (clients.length === 0) return null;

    return (
        <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '15px' }}>Existing Sites ({clients.length})</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {clients.map(client => (
                    <li key={client.slug} style={{ marginBottom: '10px', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <a
                            href={`https://${client.slug}.edgetalent.co.uk`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#0070f3', textDecoration: 'none', flexGrow: 1 }}
                        >
                            {client.name} <span style={{ color: '#999', fontSize: '12px' }}>↗</span>
                        </a>
                        <button
                            onClick={() => handleDelete(client.slug, client.name)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#e53e3e',
                                fontSize: '12px',
                                cursor: 'pointer',
                                padding: '4px 8px',
                            }}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
