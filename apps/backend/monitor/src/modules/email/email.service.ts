/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import * as fs from 'node:fs'
import { join } from 'node:path'

import { Inject, Injectable, Logger } from '@nestjs/common'
import { compile } from 'handlebars'
import { Transporter } from 'nodemailer'

@Injectable()
export class EmailService {
    constructor(@Inject('EMAIL_CLIENT') private readonly emailClient: Transporter) {}

    async alert(params: { to: string; subject: string; text: string }) {
        const alterTemplate = await fs.promises.readFile(join(__dirname, '../../templates/email/index.hbs'), 'utf-8')
        const res = await this.emailClient.sendMail({
            from: 'miaomaedu@163.com',
            to: params.to,
            subject: params.subject,
            html: compile(alterTemplate)({ text: params.text }),
        })

        Logger.log('Email sent', res)
    }
}
