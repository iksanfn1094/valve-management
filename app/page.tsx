'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [valves, setValves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // State untuk Form Input
  const [tagNumber, setTagNumber] = useState('')
  const [valveType, setValveType] = useState('Gate Valve') // Default tipe
  const [status, setStatus] = useState('Operational')

  useEffect(() => {
    fetchValves()
  }, [])

  async function fetchValves() {
    setLoading(true)
    const { data, error } = await supabase.from('valves').select('*').order('created_at', { ascending: false })
    if (error) console.error('Error:', error)
    else setValves(data || [])
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    // Simpan ke Supabase
    const { error } = await supabase.from('valves').insert([
      { tag_number: tagNumber, valve_type: valveType, status: status }
    ])

    if (error) {
      alert('Gagal simpan data: ' + error.message)
    } else {
      alert('Data Berhasil Disimpan!')
      setTagNumber('') // Kosongkan form
      fetchValves() // Update list dashboard
    }
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Valve Management System</h1>
      
      {/* SEKSI FORM INPUT */}
      <section style={{ background: '#f4f4f4', padding: '20px', borderRadius: '10px', marginBottom: '40px' }}>
        <h3>Input Valve Baru</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label>Tag Number:</label>
          <input 
            type="text" 
            value={tagNumber} 
            onChange={(e) => setTagNumber(e.target.value)} 
            placeholder="Contoh: V-001"
            required 
            style={{ padding: '8px' }}
          />

          <label>Tipe Valve:</label>
          <select value={valveType} onChange={(e) => setValveType(e.target.value)} style={{ padding: '8px' }}>
            <option value="Gate Valve">Gate Valve</option>
            <option value="Ball Valve">Ball Valve</option>
            <option value="Globe Valve">Globe Valve</option>
            <option value="Check Valve">Check Valve</option>
          </select>

          {/* LOGIKA CABANG SEDERHANA */}
          {valveType === 'Gate Valve' && (
            <p style={{ color: 'blue', fontSize: '12px' }}>* Catatan khusus untuk Gate Valve: Periksa kondisi stem.</p>
          )}

          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: '8px' }}>
            <option value="Operational">Operational</option>
            <option value="Need Repair">Need Repair</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>

          <button type="submit" style={{ padding: '10px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
            Simpan ke Database
          </button>
        </form>
      </section>

      <hr />

      {/* SEKSI DAFTAR VALVE (DASHBOARD) */}
      <section>
        <h3>Daftar Valve Terkini</h3>
        {loading ? (
          <p>Memuat data...</p>
        ) : valves.length === 0 ? (
          <p>Belum ada data.</p>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {valves.map((v) => (
              <div key={v.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{v.tag_number}</strong> - {v.valve_type}
                </div>
                <span style={{ 
                  background: v.status === 'Operational' ? '#e6fffa' : '#fff5f5', 
                  color: v.status === 'Operational' ? '#2c7a7b' : '#c53030',
                  padding: '4px 10px', 
                  borderRadius: '15px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {v.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}