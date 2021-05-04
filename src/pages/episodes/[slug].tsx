
import { GetStaticPaths, GetStaticProps } from 'next';
import { api } from '../../services/api';
import { format, parseISO } from 'date-fns';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import Link from 'next/link'
import ptBR from 'date-fns/locale/pt-BR';
import styles from './episode.module.scss'
import Image from 'next/image';


type Episode = {
  id: string;
  title: string,
  thumbnail: string,
  members: string,
  duration: number,
  durationAtString: string,
  url: string,
  publishedAt: string,
  description: string,
}

type EpisodeProps = {
  episode: Episode;
}

/**
 * 
 * @returns 
 */
export default function Episode({ episode }: EpisodeProps) {

  return (
    <div className={styles.episode}>

      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button type="button">
          <img src="/play.svg" alt="Tocar Episódio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAtString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />

    </div>
  )

}

/**
 * 
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 2,
      _sort: 'publibshed_at',
      _order: 'desc'
    }
  })

  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id
      }
    }
  })
  
  return {
    paths,
    fallback: 'blocking'
  }
}

/**
 * 
 * @param context 
 * @returns 
 */
export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;

  const { data } = await api.get(`/episodes/${slug}`)

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
    duration: Number(data.file.duration),
    description: data.description,
    durationAtString: convertDurationToTimeString(Number(data.file.duration)),
    urt: data.file.url,
  };

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24 // 24 hours
  }
}