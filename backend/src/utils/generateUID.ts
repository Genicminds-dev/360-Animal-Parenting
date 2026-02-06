import { ModelStatic } from "sequelize";

type GenerateUIDParams = {
    table: ModelStatic<any>;
    prefix: string;
    start?: number;
    end?: number;
};

export const generateUID = async ({
    table,
    prefix,
    start = 10001,
    end = 99999,
}: GenerateUIDParams): Promise<string> => {

    const lastRecord = await table.findOne({
        paranoid: false,
        order: [["createdAt", "DESC"]],
        attributes: ["uid"],
    });

    let nextNumber = start;

    if (lastRecord?.uid) {
        const parts = lastRecord.uid.split("-");
        const lastNumber = Number(parts[1]);

        if (!isNaN(lastNumber)) {
            nextNumber = lastNumber + 1;
        }
    }

    if (nextNumber > end) {
        throw new Error(`${prefix} UID limit exceeded`);
    }

    return `${prefix}-${nextNumber}`;
};
