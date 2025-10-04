const generatePrefix = async (Model, fieldName, prefixCode, date) => {
  const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, "");

  const filter = { [fieldName]: { $regex: `^${prefixCode}-${formattedDate}-` } };

  const lastDoc = await Model.findOne(filter).sort({ [fieldName]: -1 });

  let nextNumber = 1;
  if (lastDoc) {
    const lastValue = lastDoc[fieldName];
    const parts = lastValue.split("-");
    const lastNumber = parseInt(parts[2], 10);
    nextNumber = lastNumber + 1;
  }

  return `${prefixCode}-${formattedDate}-${String(nextNumber).padStart(3, "0")}`;
};

module.exports = { generatePrefix };
