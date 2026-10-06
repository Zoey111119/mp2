import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllPokemonDetails } from '../api/pokemon';
import type { PokemonDetail } from '../types/pokemon';
import styles from './GalleryView.module.css';

export const GalleryView: React.FC = () => {
  const [pokemons, setPokemons] = useState<PokemonDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    getAllPokemonDetails(151)
      .then(setPokemons)
      .catch(() => setError('fail to load'))
      .finally(() => setLoading(false));
  }, []);

  

    const allTypes = useMemo(() => {
    const types = new Set<string>();
    pokemons.forEach((p) => p.types?.forEach((t) => types.add(t.type.name)));
    return Array.from(types);
  }, [pokemons]);


  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };


  const filteredPokemons = useMemo(() => {
    if (selectedTypes.length === 0) return pokemons;
    return pokemons.filter((p) =>
      selectedTypes.some((st) => p.types?.some((t) => t.type.name === st))
    );
  }, [pokemons, selectedTypes]);

  if (loading) return <div className={styles.messageText}>loading...</div>;
  if (error) return <div className={styles.errorText}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.filterContainer}>
        {allTypes.map((type) => (
          <button
            key={type}
            onClick={() => toggleType(type)}
            className={`${styles.filterButton} ${selectedTypes.includes(type) ? styles.activeFilter : ''}`}
          >
            {type}
          </button>
        ))}
        {selectedTypes.length > 0 && (
          <button onClick={() => setSelectedTypes([])} className={styles.clearButton}>
            reset
          </button>
        )}
      </div>

      <div className={styles.galleryGrid}>
        {filteredPokemons.map((pokemon) => {
          const img =
            pokemon.sprites?.other?.['official-artwork']?.front_default ||
            pokemon.sprites?.front_default;

          return (
            <Link key={pokemon.id} to={`/pokemon/${pokemon.id}`} className={styles.galleryCard}>
              <div className={styles.imageWrapper}>
                <img src={img} alt={pokemon.name} className={styles.pokemonImage} />
              </div>
              <h3 className={styles.pokemonName}>{pokemon.name}</h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
};