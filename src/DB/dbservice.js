export const findOne = async ({
  model,
  filter = {},
  select = "",
  populate = [],
} = {}) => {
  return await model.findOne(filter).select().populate();
};



export const find = async ({
  model,
  filter = {},
  select = "",
  populate = [],
} = {}) => {
  return await model.find(filter).select( select).populate( populate);
};
export const findById = async ({ model, id = "" , populate = []} = {}) => {
  return await model.findById(id).populate( populate);
};

export const create = async ({
  model,
  data = [{}],
  optipns = { validateBeforeSave: true },
} = {}) => {
  return await model.create(data, optipns);
};


export const updateone = async ({
  model,
  data = {},
  filters = {},
  optipns = { validateBeforeSave: true },
} = {}) => {
  return await model.updateOne(filters, data, optipns);
};

export const findOneAndUpdate = async ({
  model,
  filter = {},
  data = {},
  select = "",
  options = { runValidators: true, new: true },
  populate = [],
} = {}) => {
  return await model
    .findOneAndUpdate(filter, { ...data, $inc: { __v: 1 } }, options)
    .select()
    .populate();
};




export const deleteone = async ({
  model,

  filters = {deletedAt: { $exists: true } },
} = {}) => {
  return await model.deleteOne(filters);
};





