'use client'
import { supabase } from '../lib/supabase'
export default function Home() {
  const [valves, setValves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchValves()
  }, [])

  async function fetchValves() {
    try {
      // Mengambil data dari tabel 'valves'
      const { data, error } = await supabase
        .from('valves')
        .select('*')
        
      if (error) throw error
      if (data) setValves(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '30px', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
        <h1 style={{ color: '#333' }}>Valve Management Dashboard</h1>
        <p style={{ color: '#666' }}>Sistem Monitoring Repair & Maintenance</p>
      </header>

      {loading ? (
        <p>Sedang memuat data valve...</p>
      ) : valves.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f9f9f9', borderRadius: '8px' }}>
          <p>Data valve kosong. Pastikan tabel "valves" di Supabase sudah terisi.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {valves.map((valve) => (
            <div 
              key={valve.id} 
              style={{ 
                border: '1px solid #ccc', 
                borderRadius: '8px', 
                padding: '20px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <h3 style={{ margin: '0 0 10px 0', color: '#0070f3' }}>{valve.tag_number}</h3>
              <div style={{ fontSize: '14px', color: '#444' }}>
                <p><strong>Type:</strong> {valve.valve_type}</p>
                <p><strong>Size:</strong> {valve.size}</p>
                <p><strong>Rating:</strong> {valve.class_rating}</p>
                <p><strong>Status:</strong> 
                  <span style={{ 
                    marginLeft: '5px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: valve.status === 'Operational' ? '#d4edda' : '#f8d7da',
                    color: valve.status === 'Operational' ? '#155724' : '#721c24'
                  }}>
                    {valve.status}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}