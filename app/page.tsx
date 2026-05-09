'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [valves, setValves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchValves()
  }, [])

  async function fetchValves() {
    try {
      const { data, error } = await supabase.from('valves').select('*')
      if (error) throw error
      if (data) setValves(data)
    } catch (err) {
      console.error('Error fetching:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Valve Management Dashboard</h1>
      <p>Monitoring data repair dan status valve.</p>
      <hr />
      {loading ? (
        <p>Memuat data...</p>
      ) : valves.length === 0 ? (
        <p>Belum ada data valve. Tambahkan data di Dashboard Supabase Anda.</p>
      ) : (
        <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
          {valves.map((v) => (
            <div key={v.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
              <h3>Tag: {v.tag_number}</h3>
              <p>Type: {v.valve_type} | Status: <strong>{v.status}</strong></p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}