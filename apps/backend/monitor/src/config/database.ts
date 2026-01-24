import { join } from 'node:path'

export default () => {
    // const isProd = process.env.NODE_ENV === 'production'
    return {
        database: {
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'tianniu',
            database: 'tianniu-monitor',
            password: 'tianniu123',
            entities: [join(__dirname, '../', '**/**.entity{.ts,.js}')],
            synchronize: true,
        },
    }
}
