import AdminJSFastify from '@adminjs/fastify'
import AdminJS from 'adminjs'
import { Adapter, Resource, Database } from '@adminjs/sql'
import Fastify from 'fastify'

/**
 * TODO
 * - better define trips table columns (photos, gpx files, ecc)
 * - better readme (env variabiles docs, ecc)
 * - authentication
 */

const start = async () => {
  //##TODO @fastify/env
  const app = Fastify()

  AdminJS.registerAdapter({
    Database,
    Resource,
  })

  const db = await new Adapter('postgresql', {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DB,
    user: process.env.PG_USER,
    password: process.env.PG_PW,
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

  await AdminJSFastify.buildRouter(admin, app)

  app.listen(
    { port: process.env.SERVER_PORT, address: process.env.SERVER_ADDRESS },
    (err, addr) => {
      if (err) {
        console.error(err)
      } else {
        console.log(
          `AdminJS started on http://localhost:${process.env.SERVER_PORT}${admin.options.rootPath}`
        )
      }
    }
  )
}

start()
