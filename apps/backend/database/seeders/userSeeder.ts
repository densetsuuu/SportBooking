import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#users/models/user'
import { DateTime } from 'luxon'
import { randomUUID } from 'crypto'
import Hash from '@adonisjs/core/services/hash'

export default class UserSeeder extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        id: randomUUID(),
        email: 'admin@example.com',
        password: await Hash.make('admin123'),
        firstName: 'Alice',
        lastName: 'Admin',
        role: 'admin',
        createdAt: DateTime.now(),
      },
      {
        id: randomUUID(),
        email: 'owner@example.com',
        password: await Hash.make('owner123'),
        firstName: 'Oscar',
        lastName: 'Owner',
        role: 'owner',
        createdAt: DateTime.now(),
      },
      {
        id: randomUUID(),
        email: 'user@example.com',
        password: await Hash.make('user123'),
        firstName: 'Ulysse',
        lastName: 'User',
        role: 'user',
        createdAt: DateTime.now(),
      },
    ])
  }
}
