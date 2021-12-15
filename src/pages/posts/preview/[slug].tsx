import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { RichText } from "prismic-dom";
import Link from 'next/link';
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";

import { getPrismicClient } from "../../../services/prismic";

import styles from "../post.module.scss";
import { useEffect } from "react";

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}

export default function PostPreview({post}: PostPreviewProps){
  const [session] = useSession();
  const router = useRouter();

  useEffect(() => {
    if(session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [session]) //array de dependencias geralmente com a variavel que muda ou é utilizada dentro do useEffect

  return(
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
            dangerouslySetInnerHTML={{__html:post.content}}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>
          </div>        
        </article>
      </main>
    </>
  );
  // usar o dangerouslySetInnerHTML só e somente só quando o backend/security tiver certeza que a segurança não permite
  // seja injetado HTML/Script no código, essa propriedade pode abrir uma brecha de segurança. #CrossSideScripting
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    // paths: [
    //   { params: {slug: 'dark-mode-com-css--mudando-a-aparencia-do-blog-de1'}}
    // ], posso passar quais páginas serão pré-carregadas na build SSR
    fallback: 'blocking' //true, false, blocking
  }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  const {slug} = params;

   const prismic = getPrismicClient();

  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0,3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  };

  return {
    props: { post },
    revalidate: 60 * 30, // 30 minutos
  }
}