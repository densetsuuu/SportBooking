import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export const dateSchema = vine
  .date({
    formats: ['iso8601'],
  })
  .transform((value) => DateTime.fromJSDate(value) as DateTime<true>)
