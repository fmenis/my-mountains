import AdminJSFastify from '@adminjs/fastify'
import AdminJS from 'adminjs'
import { Adapter, Resource, Database } from '@adminjs/sql'
import Fastify from 'fastify'
import env from '@fastify/env'
import closeWithGrace from 'close-with-grace'

import { sEnv } from './utils/schema.utils.js'

/**
 * TODO
 * - authentication
 * - better define trips table columns (photos, gpx files, ecc)
 * - better readme (env variabiles docs, ecc)
 * - closeWithGrace
 * - prisma
 * - typescript
 */

const start = async () => {
  const fastify = Fastify({
    logger: {
      level: process.env.LOG_LEVEL,
    },
    trustProxy: true,
    ajv: {
      customOptions: {
        allErrors: true,
      },
    },
  })

  await fastify.register(env, {
    schema: sEnv(),
  })

  AdminJS.registerAdapter({
    Database,
    Resource,
  })

  const db = await new Adapter('postgresql', {
    host: fastify.config.PG_HOST,
    port: fastify.config.PG_PORT,
    database: fastify.config.PG_DB,
    user: fastify.config.PG_USER,
    password: fastify.config.PG_PW,
  }).init()

  const admin = new AdminJS({
    // databases: [db],
    rootPath: '/admin',
    // version: 1,
    branding: {
      companyName: 'MY MOUNTAINS',
    },
    resources: [
      {
        //##TODO exclude craetedAt and updatedAt fields from creation
        resource: db.table('trip'),
        options: {
          properties: {
            status: {
              availableValues: [
                { label: 'TODO', value: 'TODO' },
                { label: 'DONE', value: 'DONE' },
                { label: 'REJECTED', value: 'REJECTED' },
              ],
            },
            type: {
              availableValues: [
                { label: 'FERRATA', value: 'FERRATA' },
                { label: 'CAMMINATA', value: 'CAMMINATA' },
              ],
            },
          },
        },
      },
    ],
  })

  await AdminJSFastify.buildRouter(admin, fastify)
  await fastify.ready()

  closeWithGrace({ delay: 500 }, async ({ signal, err }) => {
    const { log } = fastify
    if (err) {
      log.error(err)
    }
    log.debug(`'${signal}' signal receiced. Gracefully closing fastify server`)
    await fastify.close()
  })

  fastify.listen(
    {
      port: fastify.config.SERVER_PORT,
      address: fastify.config.SERVER_ADDRESS,
    },
    (err, addr) => {
      if (err) {
        fastify.log.fatal(err)
        process.exit(1)
      }

      fastify.log.debug(
        `AdminJS started on http://localhost:${fastify.config.SERVER_PORT}${admin.options.rootPath}`
      )
    }
  )
}

start()
