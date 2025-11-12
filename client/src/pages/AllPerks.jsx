import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

export default function AllPerks() {
  const [perks, setPerks] = useState([])
  const [nameFilter, setNameFilter] = useState('')
  const [merchantFilter, setMerchantFilter] = useState('')
  const [merchants, setMerchants] = useState([])

  async function load() {
    try {
      const res = await api.get('/perks', { 
        params: { 
          q: nameFilter || undefined,
          merchant: merchantFilter || undefined
        } 
      })
      setPerks(res.data.perks)
    } catch (err) {
      console.error('Failed to load perks:', err)
      setPerks([])
    }
  }

  // Load unique merchants on mount
  useEffect(() => {
    async function loadMerchants() {
      try {
        const res = await api.get('/perks')
        const uniqueMerchants = [...new Set(res.data.perks.map(p => p.merchant))]
        setMerchants(uniqueMerchants.sort())
      } catch (err) {
        console.error('Failed to load merchants:', err)
      }
    }
    loadMerchants()
  }, [])

  // Load perks when filters change
  useEffect(() => {
    load()
  }, [nameFilter, merchantFilter])

  const filteredCount = perks.length

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Explore All Perks</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Enter perk name to filter..."
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="input"
        />
        <select
          value={merchantFilter}
          onChange={(e) => setMerchantFilter(e.target.value)}
          className="input"
        >
          <option value="">All Merchants</option>
          {merchants.map(merchant => (
            <option key={merchant} value={merchant}>
              {merchant}
            </option>
          ))}
        </select>
      </div>

      <div className="text-sm text-zinc-600">
        Showing {filteredCount} perk{filteredCount !== 1 ? 's' : ''}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {perks.map(p => (
          <Link 
            key={p._id} 
            to={`/perks/${p._id}/view`}
            className="card hover:shadow-md transition-shadow cursor-pointer block"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{p.title}</div>
                <div className="text-sm text-zinc-600">{p.merchant} • {p.category} • {p.discountPercent}%</div>
              </div>
            </div>
            {p.description && <p className="mt-2 text-sm">{p.description}</p>}
          </Link>
        ))}
        {perks.length === 0 && <div className="text-sm text-zinc-600">No perks found.</div>}
      </div>
    </div>
  )
}