import { Model, ModelStatic, Op, WhereOptions } from "sequelize";

interface GenericDuplicateCheckOptions<M extends Model> {
    model: ModelStatic<M>;
    payload: Record<string, any>;
    fields: string[];    
    ignoreField?: string;
    ignoreValue?: string;
}

export const checkDuplicateGeneric = async <M extends Model>({
    model,
    payload,
    fields,
    ignoreField = "uid",
    ignoreValue,
}: GenericDuplicateCheckOptions<M>) => {
    for (const field of fields) {
        const value = payload[field];
        if (!value) continue;

        const where: WhereOptions = {
            [field]: value,
            ...(ignoreValue ? { [ignoreField]: { [Op.ne]: ignoreValue } } : {}),
        } as Record<string, any>;

        const exists = await model.findOne({ where });

        if (exists) {
            return { field, message: `${field} already exists` };
        }
    }

    return null;
};
