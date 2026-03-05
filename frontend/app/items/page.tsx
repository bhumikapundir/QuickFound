'use client'
import { useEffect, useState } from "react"
import Link from "next/link"

export default function ItemsPage() {

  const [items, setItems] = useState([])

  useEffect(() => {
    fetch("http://localhost:5000/api/items")
      .then(res => res.json())
      .then(data => setItems(data))
  }, [])

  return (
    <div style={{ padding: "2rem" }}>
      <h1>All Items</h1>

      {items.length === 0 ? (
        <p>No items posted yet.</p>
      ) : (
        items.map((item:any) => (
          <Link key={item._id} href={`/items/${item._id}`}>
            <div style={{
              border:"1px solid #ddd",
              padding:"1rem",
              marginBottom:"1rem",
              borderRadius:"8px",
              cursor:"pointer"
            }}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p><b>Location:</b> {item.location}</p>
            </div>
          </Link>
        ))
      )}

    </div>
  )
}