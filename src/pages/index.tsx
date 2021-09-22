import { GetStaticProps } from 'next';
import Head from 'next/head';
import React from 'react';
import { stripe } from '../services/stripe';

import { SubscribeButton } from '../components/SubscribeButton';

import styles from './home.module.scss';
// três formas de usar API e rendenrizar dados -- toda requisição http usando o server demora mais que no client
// Client Side - chamada API no cliente (usando estados e hooks) - quando precisa carregar informações que precisam de interação do usuário
// ou carregar alguma outra coisa
// Server Side - SSR - páginas que possuem dados dinâmicos como dados de usuários mas precisam de indexação
// Static - SSG - páginas publicas gerais que precisam de indexação

// Post do blog
//Conteudo (SSG)
//Comentários (Cliente-Side)

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}


export default function Home({product}: HomeProps ) {

  return (
    <>
      <Head>
        <title>home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> World.</h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId}/>
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1JatheJ7QqlL1RsDZVvnwQ7R', {
    expand: ['product']
  })

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, //24 hours - sec * min * hours
  }
}