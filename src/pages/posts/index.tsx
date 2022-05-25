import { GetStaticProps } from 'next';
import * as prismic from '@prismicio/client';
import { getPrismicClient } from '../../services/prismic';
import Head from 'next/head';
import styles from './styles.module.scss';

export default function Post() {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#/">
            <time>23 de maio de 2022</time>
            <strong>Creating a Monorepo with Lerna & Yarn Workspaces</strong>
            <p>
              In this guide, you will learn how to create a Monorepo to manage
              multiple packages with a shared build, test, and release process.
            </p>
          </a>
          <a href="#/">
            <time>23 de maio de 2022</time>
            <strong>Creating a Monorepo with Lerna & Yarn Workspaces</strong>
            <p>
              In this guide, you will learn how to create a Monorepo to manage
              multiple packages with a shared build, test, and release process.
            </p>
          </a>
          <a href="#/">
            <time>23 de maio de 2022</time>
            <strong>Creating a Monorepo with Lerna & Yarn Workspaces</strong>
            <p>
              In this guide, you will learn how to create a Monorepo to manage
              multiple packages with a shared build, test, and release process.
            </p>
          </a>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const client = getPrismicClient();

  const documents = await client.get({
    predicates: prismic.predicate.at('document.type', 'post'),
    fetch: ['post.title', 'post.content'],
    pageSize: 100,
  });

  console.log(documents)

  console.log(JSON.stringify(documents, null, 2));
  return {
    props: {},
  };
};