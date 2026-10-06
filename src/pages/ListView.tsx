import React, { useEffect, useState, useMemo} from "react";
import { Link } from "react-router-dom";
import { getAllPokemonDetails } from "../api/pokemon";
import type { PokemonDetail } from "../types/pokemon";
import styles from './ListView.module.css';



export const ListView: React.FC = () => {
    const [pokemons, setPokemons]= useState<PokemonDetail[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [searchBox, setSearchBox] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'id-asc' | 'id-desc' | 'name-asc' | 'name-desc'>('id-asc');


    useEffect(() => {
        const loadData = async () => {
      try {
        setLoading(true);
        const data = await getAllPokemonDetails(151);
        setPokemons(data);
      } catch (err) {
        setError('Failed to load');
      } finally {
        setLoading(false);
      }
    };
    loadData();
    }, []);
    


    const filteredPokemons = useMemo(() => {
        return pokemons
          .filter((pokemon) => {
            const matchesSearch = 
              pokemon.name.toLowerCase().includes(searchBox.toLowerCase().trim()) ||
              pokemon.id.toString() === searchBox.trim();

            const matchesType = 
              selectedType === 'all' ||
              pokemon.types.some((t) => t.type.name === selectedType);
            return matchesSearch && matchesType;
          })
          
          .sort((a, b) => {
            if (sortBy === 'id-asc') return a.id - b.id;
            if (sortBy === 'id-desc') return b.id - a.id;
            if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
            if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
            return 0;
          });
    }, [pokemons, searchBox, selectedType, sortBy]);

    const allTypes = useMemo(() => {
        const typesSet = new Set<string>();
        pokemons.forEach((p) => p.types.forEach((t) => typesSet.add(t.type.name)));
        return Array.from(typesSet);
    }, [pokemons]);

    if (loading) return <div className={styles.messageText}>loading...</div>;
    if (error) return <div className={styles.errorText}>{error}</div>;

    return(
        <div className={styles.listContainer}>
            <div className={styles.controlsBar}>
                <input type="text" placeholder="search" value={searchBox} onChange={(e) => setSearchBox(e.target.value)} className={styles.searchInput} />
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className={styles.filterSelect}>
                    <option value="all">
                        All Types
                    </option>
                    {allTypes.map((type) => (
                        <option key={type} value={type}>  {type.toUpperCase()}</option>
                    ))}
                </select>
                <select
                  value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className={styles.filterSelect}>
                    <option value= "id-asc">sort by id from small to large</option>
                    <option value= "id-desc">sort by id from large to small</option>
                    <option value= "name-asc">sort by name from A to Z</option>
                    <option value= "name-desc">sort by name from Z to A</option>
                </select>

            </div>

            <div className={styles.pokemonGrid}>
                {filteredPokemons.map((pokemon) => {
                    const imgUrl = 
                    pokemon.sprites.other?.['official-artwork']?.front_default ||
                    pokemon.sprites.front_default;

                    return (
                        <Link
                            key={pokemon.id}
                            to={`/pokemon/${pokemon.id}`}
                            className={styles.pokemonCard}>
                            <img src={imgUrl} alt={pokemon.name} className={styles.pokemonImg} />
                            <span className={styles.pokemonId}>#{pokemon.id}</span>
                            <h3 className={styles.pokemonName}>{pokemon.name}</h3>
                            <div className={styles.typesContainer}>
                                {pokemon.types.map((t) => (
                                    <span key={t.type.name} className={styles.typeBadge}> {t.type.name} </span>
                                ))}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    )

}