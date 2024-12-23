'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Star } from 'lucide-react'
import { ClientButton } from '@/components/ui'
import type { Resource } from '@/lib/resources'

export default function ResourcesList() {
  const [resources, setResources] = useState<Resource[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const res = await fetch('/api/resources')
      if (res.ok) {
        const data = await res.json()
        setResources(data)
      }
    } catch (err) {
      console.error('Error fetching resources:', err)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this resource?')) return

    try {
      const res = await fetch(`/api/resources/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete resource')
      
      fetchResources() // Refresh the list
      router.refresh() // Refresh the page
    } catch (err) {
      console.error('Error deleting resource:', err)
    }
  }

  const handleEdit = (id: number) => {
    router.push(`/admin/resources/edit/${id}`)
  }

  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <div
          key={resource.id}
          className="flex justify-between items-start p-4 border border-gray-700 rounded-lg hover:bg-gray-800/50"
        >
          <div>
            <h3 className="font-medium">{resource.title}</h3>
            <div className="flex gap-2 text-sm text-gray-400">
              <span>{resource.author}</span>
              <span>•</span>
              <span>{resource.type}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{resource.rating}</span>
              </div>
            </div>
            {resource.comment && (
              <p className="mt-2 text-sm text-gray-400 line-clamp-2">{resource.comment}</p>
            )}
          </div>
          <div className="flex gap-2">
            <ClientButton
              onClick={() => handleEdit(resource.id)}
              className="p-2 text-gray-400 hover:text-gray-200"
              title="Edit resource"
            >
              <Pencil className="w-4 h-4" />
            </ClientButton>
            <ClientButton
              onClick={() => handleDelete(resource.id)}
              className="p-2 text-gray-400 hover:text-red-400"
              title="Delete resource"
            >
              <Trash2 className="w-4 h-4" />
            </ClientButton>
          </div>
        </div>
      ))}
    </div>
  )
} 