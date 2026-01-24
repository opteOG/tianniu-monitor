/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */

import { join } from 'path'

export default () => ({
    email: {
        transport: 'smtps://xxxxx@qq.com:tsjjzmqcmhmoheje@smtp.qq.com',
        defaults: {
            from: '"nest-modules" <modules@nestjs.com>',
        },
        template: {
            dir: join(__dirname, '../templates/email'),
            // adapter: new PugAdapter(),
            options: {
                strict: true,
            },
        },
    },
})
