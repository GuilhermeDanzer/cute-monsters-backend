import express, { Request, Response } from 'express'
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()
const router = express.Router()

type PokemonInput = {
  id: number
  name: string
  type: string
  totalLife: number
  currentLife: number
  level: number
  image: string
  experience: number
  evolvesTo: string
  evolvesAt: number
  evolutionStage: number
}

type CreateUserInput = {
  id: string
  pokemons?: PokemonInput[]
}

type UpdateUserInput = {
  pokemons?: PokemonInput[]
}

// Create a new user

router.get('/', async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello from the Pokémon API!' })
})
router.post('/users', async (req: Request, res: Response) => {
  const { id, pokemons }: CreateUserInput = req.body

  try {
    const newUser = await prisma.user.create({
      data: {
        id,
        pokemons: pokemons || [],
      },
    })
    res.status(201).json(newUser)
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma error:', error.message)
    }
    console.error('Error creating user:', error)
    res.status(500).json({ error: 'Error creating user' })
  }
})

router.get('/users/:id', async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { pokemons: true },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.status(200).json(user)
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma error:', error.message)
    }
    console.error('Error fetching user:', error)
    res.status(500).json({ error: 'Error fetching user' })
  }
})

router.patch('/users/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const { pokemons }: UpdateUserInput = req.body

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        pokemons: pokemons || [],
      },
    })
    res.status(200).json(updatedUser)
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'User not found' })
      }
      console.error('Prisma error:', error.message)
    }
    console.error('Error updating user:', error)
    res.status(500).json({ error: 'Error updating user' })
  }
})

export default router
