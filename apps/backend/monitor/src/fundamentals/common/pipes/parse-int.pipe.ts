/*
 *   Copyright (c) 2024 妙码学院 @Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class ParseIntPipe implements PipeTransform<string> {
    async transform(value: string) {
        const val = parseInt(value, 10)
        if (isNaN(val)) {
            throw new BadRequestException('Validation failed')
        }
        return val
    }
}
