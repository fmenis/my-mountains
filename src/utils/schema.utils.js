import S from 'fluent-json-schema'
import { ENV } from './enum.utils.js'

export function sEnv() {
  return S.object()
    .additionalProperties(false)
    .prop(
      'NODE_ENV',
      S.string()
        .enum([ENV.PRODUCTION, ENV.STAGING, ENV.DEVELOPMENT, ENV.LOCAL])
        .required()
    )
    .prop('SERVER_ADDRESS', S.string())
    .default('127.0.0.1')
    .prop('SERVER_PORT', S.string())
    .default('3000')
    .prop('LOG_LEVEL', S.string())
    .default('info')
    .prop('PG_HOST', S.string())
    .required()
    .prop('PG_PORT', S.string())
    .required()
    .prop('PG_DB', S.string())
    .required()
    .prop('PG_USER', S.string())
    .required()
    .prop('PG_PW', S.string())
    .required()
    .valueOf()
}
