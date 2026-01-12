import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface UserDto {
    id: string;
    displayName: string;
    email: string;
    token: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    displayName: string;
    email: string;
    password: string;
}

export interface ArticleDto {
    id: number;
    title: string;
    content: string;
    author: UserDto;
    createdAt: Date;
}

export interface CreateArticleDto {
    title: string;
    content: string;
}


const agent = {

    Account: {
        login: async (email: string, password: string): Promise<UserDto> => {
            const response = await axiosInstance.post<UserDto>('/account/login', {
                email,
                password
            });
            return response.data;
        },
        
        register: async (displayName: string, email: string, password: string): Promise<UserDto> => {
            const response = await axiosInstance.post<UserDto>('/account/register', {
                displayName,
                email,
                password
            });
            return response.data;
        },
        
        getCurrent: async (): Promise<UserDto> => {
            const response = await axiosInstance.get<UserDto>('/account/current');
            return response.data;
        }
    },
    
    Articles: {
        getAll: async (): Promise<ArticleDto[]> => {
            const response = await axiosInstance.get<ArticleDto[]>('/articles');
            return response.data;
        },
        
        getById: async (id: number): Promise<ArticleDto> => {
            const response = await axiosInstance.get<ArticleDto>(`/articles/${id}`);
            return response.data;
        },
        
        create: async (article: CreateArticleDto): Promise<ArticleDto> => {
            const response = await axiosInstance.post<ArticleDto>('/articles', article);
            return response.data;
        },
        
        delete: async (id: number): Promise<void> => {
            await axiosInstance.delete(`/articles/${id}`);
        }
    },
    
    Chat: {
        //...
    }
};

export default agent;