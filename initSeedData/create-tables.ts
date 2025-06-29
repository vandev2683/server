import { PrismaService } from 'src/shared/services/prisma.service'

const prismaService = new PrismaService()

const tables = [
  {
    code: 'B101',
    capacity: 1
  },
  {
    code: 'B102',
    capacity: 1
  },
  {
    code: 'B201',
    capacity: 2
  },
  {
    code: 'B202',
    capacity: 2
  },
  {
    code: 'B203',
    capacity: 2
  },
  {
    code: 'B204',
    capacity: 2
  },
  {
    code: 'B401',
    capacity: 4
  },
  {
    code: 'B402',
    capacity: 4
  },
  {
    code: 'B403',
    capacity: 4
  },
  {
    code: 'B404',
    capacity: 4
  },
  {
    code: 'B405',
    capacity: 4
  },
  {
    code: 'B406',
    capacity: 4
  },
  {
    code: 'B407',
    capacity: 4
  },
  {
    code: 'B408',
    capacity: 4
  },
  {
    code: 'B601',
    capacity: 6
  },
  {
    code: 'B602',
    capacity: 6
  },
  {
    code: 'B603',
    capacity: 6
  },
  {
    code: 'B604',
    capacity: 6
  },
  {
    code: 'B605',
    capacity: 6
  },
  {
    code: 'B801',
    capacity: 8
  },
  {
    code: 'B802',
    capacity: 8
  },
  {
    code: 'B803',
    capacity: 8
  },
  {
    code: 'B804',
    capacity: 8
  },
  {
    code: 'B805',
    capacity: 8
  },
  {
    code: 'B1201',
    capacity: 12
  },
  {
    code: 'B1202',
    capacity: 12
  },
  {
    code: 'B1203',
    capacity: 12
  },
  {
    code: 'B1204',
    capacity: 12
  },
  {
    code: 'B1601',
    capacity: 16
  },
  {
    code: 'B1602',
    capacity: 16
  }
]

async function createTables() {
  await prismaService.table.createMany({
    data: tables
  })
  console.log('Tables created successfully')
}

console.log('Creating tables...')
createTables()
