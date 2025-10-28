const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export async function fetchStartups(filters?: { category?: string; status?: string; search?: string }) {
  const params = new URLSearchParams()
  if (filters?.category) params.append("category", filters.category)
  if (filters?.status) params.append("status", filters.status)
  if (filters?.search) params.append("search", filters.search)

  const response = await fetch(`${API_BASE_URL}/startups?${params}`)
  if (!response.ok) throw new Error("Failed to fetch startups")
  return response.json()
}

export async function fetchStartup(id: string) {
  const response = await fetch(`${API_BASE_URL}/startups/${id}`)
  if (!response.ok) throw new Error("Failed to fetch startup")
  return response.json()
}

export async function createStartup(data: any, token: string) {
  const response = await fetch(`${API_BASE_URL}/startups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create startup")
  return response.json()
}

export async function updateStartup(id: string, data: any, token: string) {
  const response = await fetch(`${API_BASE_URL}/startups/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to update startup")
  return response.json()
}

export async function deleteStartup(id: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/startups/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) throw new Error("Failed to delete startup")
  return response.json()
}
