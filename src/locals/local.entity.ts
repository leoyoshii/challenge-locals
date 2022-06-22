import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('locals')
export class Local {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar' })
  country: string

  @Column({ type: 'varchar' })
  location: string

  @Column({ type: 'timestamptz' })
  meta: Date

  @Column({ type: 'varchar', name: 'flag_url' })
  flagUrl: string

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updateAt: Date
}
