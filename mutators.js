

export const mutators = {
    createNewRecord: async (tx, value) => {
      const values = await listValues(tx);
      console.log(values)
      await tx.put("value", {...value });
    },
    increment: async (tx, delta) => {
        const prev = (await tx.get("count")) ?? 0;
        const next = prev + delta;
        await tx.put("count", next);
      }

}

const listValues = async(tx) => {
    return (await tx.scan().values().toArray());
}