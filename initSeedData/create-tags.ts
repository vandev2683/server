import { PrismaService } from 'src/shared/services/prisma.service'

type TagType = {
  Spice: 'Spice'
  Marketing: 'Marketing'
  Seasonal: 'Seasonal'
  Custom: 'Custom'
}
type TagTypeValue = TagType[keyof TagType]

type Tag = {
  name: string
  type: TagTypeValue
  description?: string
}
const prismaService = new PrismaService()

// Define the marketing tags to be created for Fast Food Restaurant
const tags: Tag[] = [
  {
    name: 'Spicy',
    type: 'Spice',
    description: 'Contains spicy ingredients'
  },
  {
    name: 'Vegan',
    type: 'Marketing',
    description: 'Suitable for vegan diets'
  },
  {
    name: 'Black Friday',
    type: 'Seasonal',
    description: 'Special offers for Black Friday'
  },
  {
    name: 'New',
    type: 'Marketing',
    description: 'Newly introduced items'
  },
  {
    name: 'Sales',
    type: 'Marketing',
    description: 'Items on sale'
  },
  {
    name: 'Best Seller',
    type: 'Marketing',
    description: 'Most popular items among customers'
  }
]

async function createTags() {
  await prismaService.tag.createMany({
    data: tags
  })

  console.log('Tags created successfully!')
}

console.log('Creating tags...')
createTags()
