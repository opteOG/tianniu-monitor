import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'admin' })
export class AdminEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  password: string

  @Column()
  email: string

  @Column()
  phone: string

  @Column()
  role: string

}
