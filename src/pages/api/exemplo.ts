import { NextApiRequest, NextApiResponse } from 'next'

// JWT (Storage)
// Next Auth (Social)
// Cognito, Auth0 - Authentication as a Service (Outros exemplos)

export default (request: NextApiRequest, response: NextApiResponse) => {
  const users = [
    {id: 1, name: 'Rafael'},
    {id: 2, name: 'Diego'},
    {id: 3, name: 'Mayk'},
  ]

  return response.json(users)
}
// ServerLess
// api routes - são ServerLess - não existe um servidor ex. express ela usa um ambiente isolado que é morto quando a requisição termina

// Ex: Landing Page - HTML puro
// se precisar inscrever o usuário numa newsletter e precisar de alguns dados do cliente
// caso essa ação seja realizada no cliente, pode ser interceptada
// colocaria a execução desse processo na API routes para proteger os dados e inclusões no BD para proteção.
