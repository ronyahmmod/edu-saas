import { StatusCodes } from "http-status-codes";
import catchAsync from "./catchAsync.js";

export const restFactory = (Model, bodyValidator, options = {}) => {
  const {
    defaultSort = "-createdAt",
    defaultFields = "-__v",
    defaultPopulate = "",
    customFilter = null,
  } = options;

  // CREATE
  const createOne = catchAsync(async (req, res, next) => {
    const parsed = bodyValidator.safeParse(req.body);
    if (!parsed.success) {
      throw parsed.error;
    }
    const doc = await Model.create(parsed.data);
    res.status(StatusCodes.CREATED).json({ success: true, data: doc });
  });

  // GET ONE
  const getOne = catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (defaultPopulate) {
      query = query.populate(defaultPopulate);
    }
    const doc = await query;
    if (!doc) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Not Found",
      });
    }
    res.status(StatusCodes.OK).json({ success: true, data: doc });
  });

  // GET ALL with filtering, sorting, pagination
  const getAll = catchAsync(async (req, res, next) => {
    // Filtering
    let queryObj = { ...req.query };
    const excludeFields = ["page", "limit", "sort", "fields", "populate"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt|regex)\b/g,
      (match) => `$${match}`
    );
    queryObj = JSON.parse(queryString);
    if (typeof customFilter === "function") {
      queryObj = customFilter(queryObj, req) || queryObj;
    }
    let query = Model.find(queryObj);

    // Sorting
    query = req.query.fields
      ? query.select(req.query.fields.split(",").join(" "))
      : query.sort(defaultSort);

    // Field selection
    query = req.query.fields
      ? query.select(req.query.fields.split(",").join(" "))
      : query.select(defaultFields);

    // Populate
    if (req.query.populate) {
      query = query.populate(req.query.populate.split(",").join(" "));
    } else if (defaultPopulate) {
      query = query.populate(defaultPopulate);
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const results = await query;
    const total = await Model.countDocuments(queryObj);
    res.json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      count: results.length,
      data: results,
    });
  });

  // FULL UPDATE (PUT-Like)

  const updateOne = catchAsync(async (req, res, next) => {
    const parsed = bodyValidator.safeParse(req.body);
    if (!parsed.success) {
      throw parsed.error;
    }
    const doc = await Model.findByIdAndUpdate(req.params.id, parsed.data, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Not Found" });
    }
    res.status(StatusCodes.OK).json({ success: true, data: doc });
  });

  // PARTIAL UPDATE (PATCH-like)
  const patchOne = catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!doc) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Not Found" });
    }
    res.status(StatusCodes.OK).json({ success: true, data: doc });
  });

  // DELETE
  const deleteOne = catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Not Found" });
    }
    doc.isActive = false;
    await doc.save();
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Deleted Successfully" });
  });

  return { createOne, deleteOne, getOne, updateOne, patchOne, getAll };
};
