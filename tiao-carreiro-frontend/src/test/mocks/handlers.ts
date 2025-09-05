import { AuthResponse, User } from '@/@types/auth'
import { ApiResponse, Music, PaginatedResponse } from '@/@types/music'
import { http, HttpResponse } from 'msw'

const API_BASE_URL = 'http://localhost:8000/api'

const mockUser: User = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  created_at: '2024-01-01T00:00:00.000000Z',
  updated_at: '2024-01-01T00:00:00.000000Z',
}

const mockMusics: Music[] = [
  {
    id: 1,
    title: 'Rei do Gado',
    youtube_url: 'https://www.youtube.com/watch?v=test1',
    youtube_id: 'test1',
    views: 15000000,
    formatted_views: '15M',
    duration: '4:32',
    thumbnail: 'https://img.youtube.com/vi/test1/mqdefault.jpg',
    status: 'approved',
    created_at: '2024-01-01T00:00:00.000000Z',
    updated_at: '2024-01-01T00:00:00.000000Z',
  },
  {
    id: 2,
    title: 'Pagode em Brasília',
    youtube_url: 'https://www.youtube.com/watch?v=test2',
    youtube_id: 'test2',
    views: 12500000,
    formatted_views: '12.5M',
    duration: '3:45',
    thumbnail: 'https://img.youtube.com/vi/test2/mqdefault.jpg',
    status: 'approved',
    created_at: '2024-01-01T00:00:00.000000Z',
    updated_at: '2024-01-01T00:00:00.000000Z',
  },
  {
    id: 3,
    title: 'Luar do Sertão',
    youtube_url: 'https://www.youtube.com/watch?v=test3',
    youtube_id: 'test3',
    views: 11000000,
    formatted_views: '11M',
    duration: '5:12',
    thumbnail: 'https://img.youtube.com/vi/test3/mqdefault.jpg',
    status: 'approved',
    created_at: '2024-01-01T00:00:00.000000Z',
    updated_at: '2024-01-01T00:00:00.000000Z',
  },
  {
    id: 4,
    title: 'Chico Mineiro',
    youtube_url: 'https://www.youtube.com/watch?v=test4',
    youtube_id: 'test4',
    views: 9800000,
    formatted_views: '9.8M',
    duration: '4:18',
    thumbnail: 'https://img.youtube.com/vi/test4/mqdefault.jpg',
    status: 'approved',
    created_at: '2024-01-01T00:00:00.000000Z',
    updated_at: '2024-01-01T00:00:00.000000Z',
  },
  {
    id: 5,
    title: 'Cabocla Tereza',
    youtube_url: 'https://www.youtube.com/watch?v=test5',
    youtube_id: 'test5',
    views: 8500000,
    formatted_views: '8.5M',
    duration: '3:56',
    thumbnail: 'https://img.youtube.com/vi/test5/mqdefault.jpg',
    status: 'approved',
    created_at: '2024-01-01T00:00:00.000000Z',
    updated_at: '2024-01-01T00:00:00.000000Z',
  },
  {
    id: 6,
    title: 'Música Pendente',
    youtube_url: 'https://www.youtube.com/watch?v=pending1',
    youtube_id: 'pending1',
    views: 1000000,
    formatted_views: '1M',
    duration: '3:30',
    thumbnail: 'https://img.youtube.com/vi/pending1/mqdefault.jpg',
    status: 'pending',
    created_at: '2024-01-01T00:00:00.000000Z',
    updated_at: '2024-01-01T00:00:00.000000Z',
  },
]

export const handlers = [
  http.post(`${API_BASE_URL}/login`, async () => {
    const authResponse: AuthResponse = {
      user: mockUser,
      token: 'mock-token',
      token_type: 'Bearer',
    }
    return HttpResponse.json(authResponse)
  }),

  http.post(`${API_BASE_URL}/register`, async () => {
    const authResponse: AuthResponse = {
      user: mockUser,
      token: 'mock-token',
      token_type: 'Bearer',
    }
    return HttpResponse.json(authResponse)
  }),

  http.post(`${API_BASE_URL}/logout`, async () => {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Logged out successfully',
    }
    return HttpResponse.json(response)
  }),

  http.get(`${API_BASE_URL}/musicas/top5`, () => {
    const top5 = mockMusics.slice(0, 5)
    const response: ApiResponse<Music[]> = {
      data: top5,
    }
    return HttpResponse.json(response)
  }),

  http.get(`${API_BASE_URL}/musicas`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page')) || 1
    const perPage = Number(url.searchParams.get('per_page')) || 10
    
    const remaining = mockMusics.slice(5)
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    const paginatedData = remaining.slice(startIndex, endIndex)

    const response: PaginatedResponse<Music[]> = {
      data: paginatedData,
      meta: {
        current_page: page,
        last_page: Math.ceil(remaining.length / perPage),
        per_page: perPage,
        total: remaining.length,
      },
    }
    return HttpResponse.json(response)
  }),

  http.post(`${API_BASE_URL}/musicas`, async ({ request }) => {
    const body = await request.json() as { youtube_url: string }
    
    const newMusic: Music = {
      id: mockMusics.length + 1,
      title: 'Nova Música Sugerida',
      youtube_url: body.youtube_url,
      youtube_id: 'newmusic',
      views: 1000,
      formatted_views: '1K',
      duration: '3:00',
      thumbnail: 'https://img.youtube.com/vi/newmusic/mqdefault.jpg',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const response: ApiResponse<Music> = {
      data: newMusic,
      message: 'Suggestion submitted successfully!',
    }
    return HttpResponse.json(response)
  }),

  // Admin handlers
  http.get(`${API_BASE_URL}/admin/musicas/pending`, () => {
    const pendingMusics = mockMusics.filter(music => music.status === 'pending')
    const response: PaginatedResponse<Music[]> = {
      data: pendingMusics,
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: pendingMusics.length,
      },
    }
    return HttpResponse.json(response)
  }),

  http.patch(`${API_BASE_URL}/admin/musicas/:id/approve`, ({ params }) => {
    const id = Number(params.id)
    const music = mockMusics.find(m => m.id === id)
    
    if (!music) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Not Found',
      })
    }

    const updatedMusic = { ...music, status: 'approved' as const }
    const response: ApiResponse<Music> = {
      data: updatedMusic,
      message: 'Song approved successfully!',
    }
    return HttpResponse.json(response)
  }),

  http.patch(`${API_BASE_URL}/admin/musicas/:id/reject`, ({ params }) => {
    const id = Number(params.id)
    const music = mockMusics.find(m => m.id === id)
    
    if (!music) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Not Found',
      })
    }

    const updatedMusic = { ...music, status: 'rejected' as const }
    const response: ApiResponse<Music> = {
      data: updatedMusic,
      message: 'Song rejected!',
    }
    return HttpResponse.json(response)
  }),

  http.put(`${API_BASE_URL}/admin/musicas/:id`, async ({ params }) => {
    const id = Number(params.id)
    const music = mockMusics.find(m => m.id === id)
    
    if (!music) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Not Found',
      })
    }

    const response: ApiResponse<Music> = {
      data: music,
      message: 'Song updated successfully!',
    }
    return HttpResponse.json(response)
  }),

  http.delete(`${API_BASE_URL}/admin/musicas/:id`, () => {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Song deleted successfully!',
    }
    return HttpResponse.json(response)
  }),
]
