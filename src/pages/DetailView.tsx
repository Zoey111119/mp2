import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPokemonDetail } from '../api/pokemon';
import type { PokemonDetail } from '../types/pokemon';
import styles from './DetailView.module.css';

export const DetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const currentId = Number(id);

  useEffect(() => {
    setLoading(true);
    getPokemonDetail(currentId)
      .then(setPokemon)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentId]);


  if (loading) return <div className={styles.container}>loading ...</div>;
  if (!pokemon) return <div className={styles.container}>fail to find pokemon!</div>;


  const img =
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.front_default;

  return (
    <div className={styles.container}>
      <div className={styles.navBar}>
        <button
          onClick={() => navigate(`/pokemon/${currentId > 1 ? currentId - 1 : 151}`)}
          className={styles.navButton}
        >
          Previous
        </button>
        <Link to="/">back to list</Link>
        <button
          onClick={() => navigate(`/pokemon/${currentId < 151 ? currentId + 1 : 1}`)}
          className={styles.navButton}>
          Next
        </button>
      </div>


      <div className={styles.card}>
        <h2>#{pokemon.id} {pokemon.name}</h2>
        <img src={img} alt={pokemon.name} className={styles.img} />
        <p className={styles.text}>
          <p>height: {pokemon.height / 10} m | weight: {pokemon.weight / 10} kg</p>
          <p>type: {pokemon.types?.map((t) => t.type.name).join(', ')}</p>
        </p>
      </div>
    </div>
  );
};