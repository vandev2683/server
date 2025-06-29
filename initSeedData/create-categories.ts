import { CreateCategoryBodyType } from 'src/routes/category/category.model'
import { PrismaService } from 'src/shared/services/prisma.service'

const prismaService = new PrismaService()

const categories: CreateCategoryBodyType[] = [
  {
    name: 'Burger',
    parentCategoryId: null,
    description: 'Các loại burger bò, gà, cá và chay với nhiều phần phụ hấp dẫn'
  },
  {
    name: 'Gà rán',
    parentCategoryId: null,
    description: 'Gà rán giòn, gà nướng thơm lừng với các gia vị đặc biệt'
  },
  {
    name: 'Mỳ',
    parentCategoryId: null,
    description: 'Mỳ Ý, mỳ xào, mỳ nước với nhiều loại nước sốt và topping đa dạng'
  },
  {
    name: 'Đồ uống',
    parentCategoryId: null,
    description: 'Nước giải khát, sinh tố, trà sữa, cà phê và các loại đồ uống khác'
  },
  {
    name: 'Tráng miệng',
    parentCategoryId: null,
    description: 'Kem, bánh ngọt, trái cây và các món tráng miệng hấp dẫn'
  },
  {
    name: 'Combo & Set meal',
    parentCategoryId: null,
    description: 'Các combo tiết kiệm với món chính, phụ và đồ uống'
  }
]

async function createCategoriesMain() {
  await prismaService.category.createMany({
    data: categories
  })
  console.log('Main categories created successfully.')
}

console.log('Creating main categories...')
createCategoriesMain()

async function createCategories() {
  const burgerCategoryId = await prismaService.category.findFirst({
    where: { name: 'Burger' }
  })
  const burgerCategories: CreateCategoryBodyType[] = [
    {
      name: 'Burger Bò',
      parentCategoryId: burgerCategoryId?.id || null,
      description: 'Burger với thịt bò tươi ngon, phô mai và rau củ tươi mát'
    },
    {
      name: 'Burger Gà',
      parentCategoryId: burgerCategoryId?.id || null,
      description: 'Burger với thịt gà giòn rụm, sốt đặc biệt và rau củ tươi ngon'
    },
    {
      name: 'Burger Cá',
      parentCategoryId: burgerCategoryId?.id || null,
      description: 'Burger với cá hồi hoặc cá ngừ, sốt chanh dây và rau củ tươi mát'
    },
    {
      name: 'Burger Chay',
      parentCategoryId: burgerCategoryId?.id || null,
      description: 'Burger chay với đậu hũ, nấm và rau củ tươi ngon'
    },
    {
      name: 'Burger Tôm',
      parentCategoryId: burgerCategoryId?.id || null,
      description: 'Burger với tôm tươi, sốt mayonnaise và rau củ tươi mát'
    },
    {
      name: 'Burger Phô Mai',
      parentCategoryId: burgerCategoryId?.id || null,
      description: 'Burger với phô mai tan chảy, thịt bò và rau củ tươi ngon'
    }
  ]
  console.log('Creating burger categories...')
  await prismaService.category.createMany({
    data: burgerCategories
  })

  const chickenCategoryId = await prismaService.category.findFirst({
    where: { name: 'Gà rán' }
  })
  const chickenCategories: CreateCategoryBodyType[] = [
    {
      name: 'Gà Sốt Cay',
      parentCategoryId: chickenCategoryId?.id || null,
      description: 'Gà rán giòn với sốt cay đặc trưng, hương vị đậm đà và hấp dẫn'
    },
    {
      name: 'Gà Nướng',
      parentCategoryId: chickenCategoryId?.id || null,
      description: 'Gà nướng thơm lừng với các gia vị đặc biệt, thịt gà mềm và đậm đà'
    },
    {
      name: 'Gà Sốt Phô Mai',
      parentCategoryId: chickenCategoryId?.id || null,
      description: 'Gà rán giòn với sốt phô mai béo ngậy, hương vị thơm ngon và hấp dẫn'
    },
    {
      name: 'Gà Sốt Bơ Tỏi',
      parentCategoryId: chickenCategoryId?.id || null,
      description: 'Gà rán giòn với sốt bơ tỏi thơm lừng, hương vị đậm đà và hấp dẫn'
    }
  ]
  console.log('Creating chicken categories...')
  await prismaService.category.createMany({
    data: chickenCategories
  })

  const noodleCategoryId = await prismaService.category.findFirst({
    where: { name: 'Mỳ' }
  })
  const noodleCategories: CreateCategoryBodyType[] = [
    {
      name: 'Mỳ Ý',
      parentCategoryId: noodleCategoryId?.id || null,
      description: 'Mỳ Ý với nước sốt cà chua, thịt bò bằm và phô mai Parmesan'
    },
    {
      name: 'Mỳ Xào',
      parentCategoryId: noodleCategoryId?.id || null,
      description: 'Mỳ xào với rau củ tươi ngon, thịt gà hoặc tôm và nước sốt đặc biệt'
    },
    {
      name: 'Mỳ Cay',
      parentCategoryId: noodleCategoryId?.id || null,
      description: 'Mỳ cay với nước dùng đậm đà, thịt bò, hải sản và rau củ tươi ngon'
    }
  ]
  console.log('Creating noodle categories...')
  await prismaService.category.createMany({
    data: noodleCategories
  })

  const drinkCategoryId = await prismaService.category.findFirst({
    where: { name: 'Đồ uống' }
  })
  const drinkCategories: CreateCategoryBodyType[] = [
    {
      name: 'Nước Ngọt',
      parentCategoryId: drinkCategoryId?.id || null,
      description: 'Các loại nước ngọt như Coca Cola, Sprite, Fanta và các loại nước giải khát khác'
    },
    {
      name: 'Sinh Tố',
      parentCategoryId: drinkCategoryId?.id || null,
      description: 'Sinh tố trái cây tươi ngon, bổ dưỡng và mát lạnh'
    },
    {
      name: 'Trà Sữa',
      parentCategoryId: drinkCategoryId?.id || null,
      description: 'Trà sữa với nhiều hương vị khác nhau, topping đa dạng và thơm ngon'
    },
    {
      name: 'Nước có cồn',
      parentCategoryId: drinkCategoryId?.id || null,
      description: 'Các loại bia, rượu vang và cocktail đa dạng, phù hợp cho các buổi tiệc tùng'
    }
  ]
  console.log('Creating drink categories...')
  await prismaService.category.createMany({
    data: drinkCategories
  })

  const dessertCategoryId = await prismaService.category.findFirst({
    where: { name: 'Tráng miệng' }
  })
  const dessertCategories: CreateCategoryBodyType[] = [
    {
      name: 'Kem',
      parentCategoryId: dessertCategoryId?.id || null,
      description: 'Kem tươi mát với nhiều hương vị khác nhau như vani, socola, dâu và trà xanh'
    },
    {
      name: 'Bánh Ngọt',
      parentCategoryId: dessertCategoryId?.id || null,
      description: 'Bánh ngọt với nhiều loại như bánh kem, bánh mì nướng, bánh quy và bánh tart'
    },
    {
      name: 'Trái Cây Tươi',
      parentCategoryId: dessertCategoryId?.id || null,
      description: 'Trái cây tươi ngon, bổ dưỡng và mát lạnh, phù hợp cho các món tráng miệng nhẹ nhàng'
    },
    {
      name: 'Salad',
      parentCategoryId: dessertCategoryId?.id || null,
      description: 'Salad trộn với rau củ tươi ngon, nước sốt nhẹ nhàng và bổ dưỡng'
    },
    {
      name: 'Khoai Tây Chiên',
      parentCategoryId: dessertCategoryId?.id || null,
      description: 'Khoai tây chiên giòn với nhiều loại gia vị khác nhau, phù hợp cho các món ăn nhẹ'
    }
  ]
  console.log('Creating dessert categories...')
  await prismaService.category.createMany({
    data: dessertCategories
  })

  const comboCategoryId = await prismaService.category.findFirst({
    where: { name: 'Combo & Set meal' }
  })
  const comboCategories: CreateCategoryBodyType[] = [
    {
      name: 'Combo Burger',
      parentCategoryId: comboCategoryId?.id || null,
      description: 'Combo bao gồm burger, khoai tây chiên và đồ uống'
    },
    {
      name: 'Combo Gà Rán',
      parentCategoryId: comboCategoryId?.id || null,
      description: 'Combo bao gồm gà rán, khoai tây chiên và đồ uống'
    },
    {
      name: 'Combo Mỳ',
      parentCategoryId: comboCategoryId?.id || null,
      description: 'Combo bao gồm mỳ, salad và đồ uống'
    },
    {
      name: 'Combo 99k',
      parentCategoryId: comboCategoryId?.id || null,
      description: 'Combo tiết kiệm với nhiều món ăn khác nhau, bao gồm burger, gà rán, mỳ và đồ uống'
    },
    {
      name: 'Combo Gia Đình',
      parentCategoryId: comboCategoryId?.id || null,
      description: 'Combo dành cho gia đình với nhiều món ăn khác nhau, bao gồm burger, gà rán, mỳ và đồ uống'
    },
    {
      name: 'Combo 149k',
      parentCategoryId: comboCategoryId?.id || null,
      description: 'Combo tiết kiệm với nhiều món ăn khác nhau, bao gồm burger, gà rán, mỳ và đồ uống'
    },
    {
      name: 'Combo 199k',
      parentCategoryId: comboCategoryId?.id || null,
      description: 'Combo tiết kiệm với nhiều món ăn khác nhau, bao gồm burger, gà rán, mỳ và đồ uống'
    },
    {
      name: 'Combo 2 Người',
      parentCategoryId: comboCategoryId?.id || null,
      description: 'Combo dành cho 2 người với nhiều món ăn khác nhau, bao gồm burger, gà rán, mỳ và đồ uống'
    },
    {
      name: 'Combo Nhóm',
      parentCategoryId: comboCategoryId?.id || null,
      description: 'Combo dành cho nhóm với nhiều món ăn khác nhau, bao gồm burger, gà rán, mỳ và đồ uống'
    }
  ]
  console.log('Creating combo categories...')
  await prismaService.category.createMany({
    data: comboCategories
  })

  console.log('All subcategories created successfully.')
}

console.log('Creating subcategories...')
createCategories()
