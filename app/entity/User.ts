import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm'

@Entity({
    name: 'user'
})
export class User extends BaseEntity {
    @PrimaryGeneratedColumn({
        comment: '用户 id'
    })
    id: number

    @Column({
        length: 20,
        name: 'username',
        nullable: false,
        default: '',
        comment: '用户名'
    })
    @Index('idx_username')
    username: string

    @Column({
        length: 40,
        nullable: false,
        default: '',
        comment: '密码'
    })
    password: string

    @Column({
        name: 'is_super',
        default: false,
        comment: '是否为超级管理员'
    })
    isSuper: boolean

    @Column({
        default: true,
        name: 'is_active',
        comment: '是否有效'
    })
    isActive: boolean

    @CreateDateColumn({
        name: 'create_time',
        comment: '创建时间'
    })
    createTime: Date

    @UpdateDateColumn({
        comment: '修改时间',
        name: 'update_time'
    })
    updateTime: Date
}

export const userLoginBody = {
    username: { type: 'string', required: true },
    password: {
        type: 'string',
        required: true,
        pattern: '^[A-Za-zd_,.?/!\\@#$%^&*()-=+~|]{4,20}$',
        message: '密码格式不正确'
    }
}
