import axios from "axios";
import type { PokemonListItem, PokemonDetail, PokemonListResponse } from '../types/pokemon';



const apiClient = axios.create({
    baseURL: 'https://pokeapi.co/api/v2',
    timeout: 100000,
});


export const getPokemonList = async (limit: number = 151): Promise<PokemonListItem[]> => {
    try{
        const response = await apiClient.get<PokemonListResponse>('/pokemon',{
            params: {
                limit
            },
        });

        return response.data.results;
    }catch(error){
        console.error('fail to get Pokemon list:', error);
        throw error;
    }
};


export const getAllPokemonDetails = async (limit: number = 151): Promise<PokemonDetail[]> => {
    try{

        const list = await getPokemonList(limit);
        const detailPromises = list.map((item) => getPokemonDetail(item.name));
        return await Promise.all(detailPromises);
    }catch(error){
        console.error('fail to get all Pokemon details:', error);
        throw error;
    }
};


export const getPokemonDetail = async (idOrName: string | number): Promise<PokemonDetail> => {
    try{
        const response = await apiClient.get<PokemonDetail>(`/pokemon/${idOrName}`);
        return response.data;
    }catch(error){
        console.error(`fail to get Pokemon detail for ${idOrName}:`, error);
        throw error;
    }
};


