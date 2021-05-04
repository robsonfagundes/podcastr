
import { GetStaticProps } from 'next';
import { api } from '../services/api';
import { format, parseISO } from 'date-fns';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import ptBR from 'date-fns/locale/pt-BR';
import styles from './home.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext';


type Episode = {
  id: string;
  title: string,
  thumbnail: string,
  members: string,
  duration: number,
  durationAtString: string,
  url: string,
  publishedAt: string,
}

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  // console.log(props.episodes)

  const player = useContext(PlayerContext)

  return (
    <div className={styles.homepage}>

      <section className={styles.latestEpisodes}>
        <h2>Ultimos Lancamentos {player}</h2>

        <ul>
          {latestEpisodes.map(episode => {
            return (
              <li key={episode.id}>

                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt="{episode.title}"
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAtString}</span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos Episodios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duracao</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map(episode => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAtString}</td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt="Tocar Episodio" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

      </section>


    </div>
  );

}

/**
 * Consumindo uma API com next
 * SSG - Static Side Generation 
 */
export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'publibshed_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duation),
      durationAtString: convertDurationToTimeString(Number(episode.file.duration)),
      urt: episode.file.url,
    }


  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8,
  };

}

/**
 * Consumindo uma API com next
 * SSR - Server Side Render
 */
// export  async function getServerSideProps() {
//   const response = await fetch('http://localhost:3333/episodes')
//   const data = await response.json();

//   return {
//     props: {
//       episodes: data,
//     }
//   }
// }

/**
 * Consumindo uma API com next
 * SPA - Single Page App
 */

  // useEffect(() => {
  //   fetch('http://localhost:3333/episodes')
  //     .then(response => response.json())
  //     .then(data => console.log(data))
  // }, []);

