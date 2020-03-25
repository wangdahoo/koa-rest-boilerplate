import { BaseEntity, getManager } from 'typeorm'
import _ from 'lodash'

export enum JoinFormat {
    FLAT = 'flat',
    TREE = 'TREE'
}

export interface JoinOptions<T extends typeof BaseEntity = typeof BaseEntity> {
    entity: T
    aliaName: string
    fields: string[]
    leftJoinNodes: LeftJoinNode[]
    format: JoinFormat
}

export interface LeftJoinNode<T extends typeof BaseEntity = typeof BaseEntity> {
    entity: T
    aliaName: string
    fields: string[] | string[][]
    leftJoinOn: string
}

export async function makeLeftJoinQuery (joinOptions: JoinOptions): Promise<any[]> {
    let builder = getManager().createQueryBuilder()

    const { entity, aliaName, fields, leftJoinNodes, format = JoinFormat.FLAT } = joinOptions

    builder = builder.select(fields.map((field: string) => `${aliaName}.${field} as ${field}`))

    for (const leftJoinNode of leftJoinNodes) {
        const { aliaName, fields } = leftJoinNode
        for (let field of fields) {
            let fieldAliaName = field
            if (Array.isArray(field)) {
                fieldAliaName = field[1]
                field = field[0]
            }
            builder = builder.addSelect(`${aliaName}.${field}`, `${fieldAliaName}`)
        }
    }

    builder = builder.from(entity, aliaName)

    for (const leftJoinNode of leftJoinNodes) {
        builder = builder.leftJoin(leftJoinNode.entity, `${leftJoinNode.aliaName}`, `${leftJoinNode.leftJoinOn}`)
    }

    let results = await builder.getRawMany()

    // 格式化
    if (format === JoinFormat.TREE && fields.indexOf('id') > -1) {
        results = _.values(
            results.reduce((rowMap: Map<number | string, any>, row: any) => {
                if (!rowMap[row.id]) {
                    const newRow = _.pick(row, fields)

                    for (const leftJoinNode of leftJoinNodes) {
                        newRow[`${leftJoinNode.aliaName}s`] = []
                    }

                    rowMap[row.id] = newRow
                }

                for (const leftJoinNode of leftJoinNodes) {
                    const fields: string[] = []

                    for (const field of leftJoinNode.fields) {
                        fields.push(Array.isArray(field) ? field[0] : field)
                    }

                    rowMap[row.id][`${leftJoinNode.aliaName}s`].push(_.pick(row, fields))
                }

                return rowMap
            }, {})
        )
    }

    return results
}
