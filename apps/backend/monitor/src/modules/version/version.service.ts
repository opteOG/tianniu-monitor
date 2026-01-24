/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { ClickHouseClient } from '@clickhouse/client'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { compile } from 'handlebars'
import { Transporter } from 'nodemailer'

import { EmailService } from '../email/email.service'

@Injectable()
export class VersionService {
    constructor(
        @Inject('CLICKHOUSE_CLIENT') private clickhouseClient: ClickHouseClient,
        @Inject('EMAIL_CLIENT') private readonly emailClient: Transporter,
        private readonly emailService: EmailService
    ) {}
    getVersion() {
        return '1.0.0'
    }

    async tracking(params: { event_type: string; message: string }) {
        const res = await this.clickhouseClient.insert({
            table: 'heyi.base_monitor_storage',
            values: params,
            columns: ['event_type', 'message'],
            format: 'JSONEachRow',
        })

        Logger.log('Query result', JSON.stringify(res.summary))
    }

    async span() {
        // 从物化表中查
        // const query = `
        //             SELECT *
        // FROM kafka_to_monitor_data
        //         `
        // const query = `
        //     SELECT *
        //     FROM monitor_data
        //     WHERE key = '1'
        // `
        const query = `
            SELECT * FROM heyi.base_monitor_view;
        `

        const res = await this.clickhouseClient.query({
            query,
        })

        const queryResult = await res.json()
        Logger.log('Query result', queryResult)

        return queryResult.data
    }

    async sendEmail(params: { to: string; subject: string; text: string }) {
        const res = await this.emailClient.sendMail({
            from: 'miaomaedu@163.com',
            to: params.to,
            subject: params.subject,
            html: compile('<h1>{{name}}</h1>')({ name: params.text }),
        })

        Logger.log('Email sent', res)
    }

    async alert(params: { to: string; subject: string; text: string }) {
        await this.emailService.alert(params)
    }
}
