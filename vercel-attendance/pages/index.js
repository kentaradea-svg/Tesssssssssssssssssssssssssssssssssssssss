import { useEffect, useState } from 'react'

export default function Home() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/attendance')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(e => setError(e.message || String(e)))
  }, [])

  if (error) return <div>Error: {error}</div>
  if (!data) return <div>Loading...</div>

  return (
    <div style={{padding:20,fontFamily:'Arial, sans-serif'}}>
      <h1>Attendance (WIB)</h1>
      <h2>Rows</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr><th>ID</th><th>User</th><th>Date (WIB)</th><th>On Duty (WIB)</th><th>Off Duty (WIB)</th><th>Duration</th></tr>
        </thead>
        <tbody>
          {data.rows.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.user_id}</td>
              <td>{r.date}</td>
              <td>{r.on_duty || '-'}</td>
              <td>{r.off_duty || '-'}</td>
              <td>{r.duration ? r.duration.human : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Weekly Totals (Monday-Sunday, start date shown)</h2>
      <ul>
        {data.weekly.map(w => (
          <li key={w.weekStart}>{w.weekStart} — total: {w.total} (entries: {w.entries})</li>
        ))}
      </ul>

      <p style={{color:'#666',fontSize:12}}>Semua waktu ditampilkan dalam WIB (Asia/Jakarta). Minggu dihitung Senin–Minggu.</p>
    </div>
  )
}
