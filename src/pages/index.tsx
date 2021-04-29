
import { GetStaticProps } from 'next';
import { api } from '../services/api';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';


type Episode = {
  id: string;
  title: string,
  thumbnail: string
  description: string,
  members: string,
  duration: number,
  durationAtString: string,
  url: string,
  publishedAt: string,
}

type HomeProps = {
  episodes: Episode[];
}

export default function Home(props: HomeProps) {
  // console.log(props.episodes)

  return (
    <div>
      <h1>Index</h1>

      <p>{JSON.stringify(props.episodes)}</p>

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
      numbers: Number(episode.numbers),
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duation),
      description: episode.description,
      descriptionAsString: convertDurationToTimeString(Number(episode.file.duration)),
      urt: episode.file.url,
    }
  });

  return {
    props: {
      episodes
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

