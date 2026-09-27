import supabase from '../../lib/supabase'
import { toWIBString, durationBetween, dateWIB, weekKeyWIB } from '../../lib/time'

// API: GET /api/attendance
// Returns attendance rows with fields converted to WIB and grouped by week (Mon-Sun)
export default async function handler(req, res) {
  try {
    // Example fetch: adapt table/column names to real schema
    const { data, error } = await supabase
      .from('attendance')
      .select('id,user_id,on_duty,off_duty')
      .order('on_duty', { ascending: false })

    if (error) throw error

    // Map and compute durations, WIB strings
    const rows = (data || []).map(r => {
      const on = r.on_duty
      const off = r.off_duty
      const on_wib = on ? toWIBString(on) : null
      const off_wib = off ? toWIBString(off) : null
      const duration = (on && off) ? durationBetween(on, off) : null
      const date = on ? dateWIB(on) : (off ? dateWIB(off) : null)
      const weekKey = (on || off) ? weekKeyWIB(on || off) : null
      return {
        id: r.id,
        user_id: r.user_id,
        on_duty: on_wib,
        off_duty: off_wib,
        duration,
        date,
        weekKey
      }
    })

    // Compute weekly totals (per weekKey) - total seconds per week
    const weekly = {}
    rows.forEach(r => {
      if (!r.weekKey) return
      if (!weekly[r.weekKey]) weekly[r.weekKey] = { totalSeconds: 0, entries: 0 }
      if (r.duration) {
        weekly[r.weekKey].totalSeconds += (r.duration.hours || 0) * 3600 + (r.duration.minutes || 0) * 60 + (r.duration.seconds || 0)
      }
      weekly[r.weekKey].entries += 1
    })

    // Convert totals to human
    const weeklyArray = Object.entries(weekly).map(([weekStart, val]) => {
      const hrs = Math.floor(val.totalSeconds / 3600)
      const mins = Math.floor((val.totalSeconds % 3600) / 60)
      const secs = val.totalSeconds % 60
      return { weekStart, total: `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`, entries: val.entries }
    })

    res.status(200).json({ rows, weekly: weeklyArray })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || String(err) })
  }
}
