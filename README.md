# Server API Documentation

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Roles & Permissions](#roles--permissions)
  - [Addresses](#addresses)
  - [Products](#products)
  - [Categories](#categories)
  - [Tags](#tags)
  - [Orders](#orders)
  - [Profile](#profile)

## Overview

This is the API server for our e-commerce application, built with NestJS, Prisma ORM, and PostgreSQL. The API provides endpoints for managing users, products, orders, and more.

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run start:dev
```

## API Endpoints

### Authentication

- `POST /auth/login` - Login with email and password

  - Request: `{ email, password }`
  - Response: `{ accessToken, refreshToken, user }`

- `POST /auth/register` - Register a new user

  - Request: `{ email, password, name, phoneNumber }`
  - Response: `{ accessToken, refreshToken, user }`

- `POST /auth/refresh-token` - Get a new access token

  - Request: `{ refreshToken }`
  - Response: `{ accessToken, refreshToken }`

- `POST /auth/logout` - Logout and invalidate tokens

  - Request: `{ refreshToken }`
  - Response: `{ message }`

- `POST /auth/forgot-password` - Request password reset

  - Request: `{ email }`
  - Response: `{ message }`

- `POST /auth/reset-password` - Reset password with code
  - Request: `{ email, code, newPassword }`
  - Response: `{ message }`

### Users

- `GET /users` - Get list of users (paginated)

  - Query Parameters: `page`, `limit`
  - Response: `{ data, totalItems, page, limit, totalPages }`

- `GET /users/:userId` - Get user details

  - Path Parameters: `userId`
  - Response: User object

- `GET /users/me` - Get current user details

  - Response: User object

- `POST /users` - Create a new user

  - Request: `{ email, password, name, phoneNumber, roleId }`
  - Response: User object

- `PUT /users/:userId` - Update user details

  - Path Parameters: `userId`
  - Request: `{ name, phoneNumber, etc. }`
  - Response: User object

- `PUT /users/me/password` - Update current user's password

  - Request: `{ currentPassword, newPassword }`
  - Response: `{ message }`

- `DELETE /users/:userId` - Delete a user
  - Path Parameters: `userId`
  - Response: `{ message }`

### Roles & Permissions

- `GET /roles` - Get list of roles (paginated)

  - Query Parameters: `page`, `limit`
  - Response: `{ data, totalItems, page, limit, totalPages }`

- `GET /roles/:roleId` - Get role details with permissions

  - Path Parameters: `roleId`
  - Response: Role object with permissions

- `POST /roles` - Create a new role

  - Request: `{ name, description, isActive }`
  - Response: Role object

- `PUT /roles/:roleId` - Update role details

  - Path Parameters: `roleId`
  - Request: `{ name, description, isActive, permissionIds }`
  - Response: Role object

- `DELETE /roles/:roleId` - Delete a role

  - Path Parameters: `roleId`
  - Response: `{ message }`

- `GET /permissions` - Get all permissions
  - Response: Array of permission objects

### Addresses

- `GET /addresses` - Get user addresses (paginated)

  - Query Parameters: `page`, `limit`
  - Response: `{ data, totalItems, page, limit, totalPages }`

- `GET /addresses/all` - Get all user addresses

  - Response: `{ data, totalItems }`

- `GET /addresses/:addressId` - Get address details

  - Path Parameters: `addressId`
  - Response: Address object

- `POST /addresses` - Create a new address

  - Request: `{ recipientName, recipientPhone, provinceId, districtId, wardId, detailAddress, deliveryNote, isDefault }`
  - Response: Address object

- `PUT /addresses/:addressId` - Update address details

  - Path Parameters: `addressId`
  - Request: `{ recipientName, recipientPhone, etc. }`
  - Response: Address object

- `DELETE /addresses/:addressId` - Delete an address
  - Path Parameters: `addressId`
  - Response: `{ message }`

### Products

- `GET /products` - Get list of products (paginated)

  - Query Parameters: `page`, `limit`, `categoryId`, `tagId`, `search`
  - Response: `{ data, totalItems, page, limit, totalPages }`

- `GET /products/:productId` - Get product details

  - Path Parameters: `productId`
  - Response: Product object

- `POST /products` - Create a new product

  - Request: `{ name, description, price, stock, categoryId, tagIds, images }`
  - Response: Product object

- `PUT /products/:productId` - Update product details

  - Path Parameters: `productId`
  - Request: `{ name, description, etc. }`
  - Response: Product object

- `DELETE /products/:productId` - Delete a product

  - Path Parameters: `productId`
  - Response: `{ message }`

- `GET /products/featured` - Get featured products

  - Query Parameters: `limit`
  - Response: Array of product objects

- `GET /products/bestsellers` - Get bestselling products
  - Query Parameters: `limit`
  - Response: Array of product objects

### Categories

- `GET /categories` - Get all categories

  - Response: Array of category objects

- `GET /categories/:categoryId` - Get category details

  - Path Parameters: `categoryId`
  - Response: Category object

- `POST /categories` - Create a new category

  - Request: `{ name, description, parentId, image }`
  - Response: Category object

- `PUT /categories/:categoryId` - Update category details

  - Path Parameters: `categoryId`
  - Request: `{ name, description, etc. }`
  - Response: Category object

- `DELETE /categories/:categoryId` - Delete a category
  - Path Parameters: `categoryId`
  - Response: `{ message }`

### Tags

- `GET /tags` - Get all tags

  - Response: Array of tag objects

- `GET /tags/:tagId` - Get tag details

  - Path Parameters: `tagId`
  - Response: Tag object

- `POST /tags` - Create a new tag

  - Request: `{ name, description }`
  - Response: Tag object

- `PUT /tags/:tagId` - Update tag details

  - Path Parameters: `tagId`
  - Request: `{ name, description }`
  - Response: Tag object

- `DELETE /tags/:tagId` - Delete a tag
  - Path Parameters: `tagId`
  - Response: `{ message }`

### Orders

- `GET /orders` - Get user orders (paginated)

  - Query Parameters: `page`, `limit`, `status`
  - Response: `{ data, totalItems, page, limit, totalPages }`

- `GET /orders/:orderId` - Get order details

  - Path Parameters: `orderId`
  - Response: Order object

- `POST /orders` - Create a new order

  - Request: `{ addressId, items, paymentMethod, note }`
  - Response: Order object

- `PUT /orders/:orderId/cancel` - Cancel an order

  - Path Parameters: `orderId`
  - Response: Order object

- `GET /orders/statistics` - Get order statistics (admin)
  - Query Parameters: `startDate`, `endDate`
  - Response: Statistics object

### Profile

- `GET /profile` - Get user profile

  - Response: Profile object

- `PUT /profile` - Update user profile

  - Request: `{ name, phoneNumber, avatar, dateOfBirth }`
  - Response: Profile object

- `PUT /profile/password` - Update password

  - Request: `{ currentPassword, newPassword }`
  - Response: `{ message }`

- `POST /profile/enable-2fa` - Enable two-factor authentication

  - Response: `{ secret, qrCode }`

- `POST /profile/disable-2fa` - Disable two-factor authentication

  - Request: `{ code }`
  - Response: `{ message }`

- `GET /profile/addresses` - Get user addresses

  - Response: Array of address objects

- `GET /profile/orders` - Get user orders
  - Query Parameters: `page`, `limit`
  - Response: `{ data, totalItems, page, limit, totalPages }`
