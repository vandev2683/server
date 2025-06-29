// const variants = ['A', 'B', 'C', 'D', 'E', 'A']
// for (let i = 0; i < variants.length; i++) {
//   const typeIndex = variants.findIndex((v) => v === variants[i])
//   console.log(typeIndex, i, variants[i])
// }

import { ProductVariantsType } from 'src/shared/models/shared-product.model'

function generateSKUs(variants: ProductVariantsType) {
  // Hàm hỗ trợ để tạo tất cả tổ hợp
  function getCombinations(arrays: string[][]): string[] {
    return arrays.reduce(
      (acc, curr) =>
        acc.flatMap((x) =>
          curr.map((y) => {
            const value = `${x}${x ? '-' : ''}${y}`
            console.log('value', value)
            return value
          })
        ),
      ['']
    )
  }

  // Lấy mảng các options từ variants
  const options = variants.map((variant) => variant.options)

  // Tạo tất cả tổ hợp
  const combinations = getCombinations(options)
  console.log(combinations)

  // Chuyển tổ hợp thành SKU objects
  return combinations.map((value) => ({
    value,
    price: 0,
    stock: 0,
    thumbnail: null
  }))
}

console.log(
  generateSKUs([
    {
      type: 'color',
      options: ['red', 'blue', 'green']
    },
    {
      type: 'size',
      options: ['S', 'M', 'L']
    }
  ])
)
