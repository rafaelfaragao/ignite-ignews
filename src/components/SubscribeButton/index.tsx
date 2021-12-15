import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
  priceId: string;
}

//

export function SubscribeButton({priceId}: SubscribeButtonProps) {
  const [session] = useSession();
  const router = useRouter(); //usar o useRouter quando for para redirecionar por função/automação sem interação com o usuario

  async function handleSubscribe(){
    if(!session){
      signIn('github')
      return;
    }

    if (session.activeSubscription) {
      router.push('/posts');
      return;
    }

    // se existir a session realizar a criação da checkout sessão
    try { 
      const response = await api.post('/subscribe')

      const { sessionId } = response.data;

      const stripe = await getStripeJs() // stripeJS para usar o stripe no front

      await stripe.redirectToCheckout({sessionId: sessionId})
    } catch (err) {
      alert(err.message);
    }

  }

  return (
    <button
     type="button"
     className={styles.subscribeButton}
     onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}