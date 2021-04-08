import { GetStaticPaths, GetStaticProps } from 'next';
import { Session } from 'next-auth';
import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import Link from 'next/link';
import { RichText } from 'prismic-dom';
import { useEffect } from 'react';
import { api } from '../../../services/api';
import { getPrismicClient } from '../../../services/prismic';
import { getStripeJs } from '../../../services/stripe-js';
import styles from '../post.module.scss';

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

interface SessionProps extends Session {
  activeSubscription?: object;
}

export default function PostPreview({ post }: PostPreviewProps) {
  const [session] = useSession();
  const newSession: SessionProps = session;
  const router = useRouter();

  useEffect(() => {
    if (newSession?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [newSession, post.slug, router]);

  async function handleSubscribe() {
    if (!session) {
      signIn('github');
      return;
    }

    if (newSession.activeSubscription) {
      router.push(`/posts/${post.slug}`);

      return;
    }

    try {
      const response = await api.post('/subscribe');

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      alert(err.message);
    }
  }
  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <Link href="/">
            <button
              type="button"
              className={styles.continueReading}
              onClick={handleSubscribe}
            >
              Wanna continue reading?
              <a>Subscribe now 🤗</a>
            </button>
          </Link>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      },
    ),
  };

  return {
    props: {
      post,
    },
    redirect: 60 * 30, // 30 minutes
  };
};
