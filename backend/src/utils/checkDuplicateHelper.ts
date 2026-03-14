import { Model, ModelStatic, Op, WhereOptions } from "sequelize";

interface GenericDuplicateCheckOptions<M extends Model> {
    model: ModelStatic<M>;
    payload: Record<string, any>;
    fields: string[];
    ignoreCol?: string;      
    ignoreValue?: string | number;
}

export const checkDuplicateGeneric = async <M extends Model>({
    model,
    payload,
    fields,
    ignoreCol,
    ignoreValue,
}: GenericDuplicateCheckOptions<M>) => {

    const primaryKey = model.primaryKeyAttribute;

    for (const field of fields) {

        let value = payload[field];

        if (value === undefined || value === null || value === "") continue;

        if (typeof value === "string") {
            value = value.trim();
        }

        const where: WhereOptions = {
            [field]: value,
        };

        if (ignoreValue) {
            const column = ignoreCol || primaryKey;

            Object.assign(where, {
                [column]: { [Op.ne]: ignoreValue }
            });
        }

        const exists = await model.findOne({ where });

        if (exists) {
            return {
                field,
                message: `${field} already exists`,
            };
        }
    }
    return null;
};